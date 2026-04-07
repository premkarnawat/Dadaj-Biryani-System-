/**
 * ADMIN ROUTES
 * Frontend calls: adminApi.getDashboard/getOrders/updateOrderStatus/createProduct/etc.
 * All routes protected by adminAuth middleware
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { adminAuth } = require('../middleware/auth');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

/* ── AUTH ── */

// POST /admin/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !admin) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DASHBOARD ── */

// GET /admin/dashboard
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const iso   = today.toISOString();

    const [ordersRes, revenueRes, totalOrdersRes, usersRes] = await Promise.all([
      supabase.from('orders').select('id, status').gte('created_at', iso),
      supabase.from('orders').select('total').eq('payment_status','PAID').gte('created_at', iso),
      supabase.from('orders').select('id', { count:'exact', head:true }),
      supabase.from('users').select('id', { count:'exact', head:true }),
    ]);

    const todayRevenue = (revenueRes.data || []).reduce((s, o) => s + Number(o.total), 0);
    const statusBreak  = {};
    (ordersRes.data || []).forEach(o => { statusBreak[o.status] = (statusBreak[o.status]||0) + 1; });

    res.json({
      todayOrders:   ordersRes.data?.length || 0,
      todayRevenue,
      totalOrders:   totalOrdersRes.count  || 0,
      totalUsers:    usersRes.count        || 0,
      statusBreakdown: statusBreak,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── ORDERS ── */

// GET /admin/orders?status=ALL&limit=50&offset=0
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0, search } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        id, status, subtotal, tax, delivery_charge, discount, total,
        address, payment_method, payment_status, coupon_code, created_at,
        order_items ( name, quantity, price ),
        users ( email, full_name, phone )
      `)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status && status !== 'ALL') query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/orders/:id/status  { status, note? }
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const VALID = ['PLACED','ACCEPTED','PREPARING','PICKED','ON_THE_WAY','DELIVERED','CANCELLED'];
    if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select().single();

    if (error) throw error;

    await supabase.from('order_status_logs').insert({
      order_id: req.params.id, status, note: note || `Admin → ${status}`,
    });

    // Push realtime to user — matches frontend supabase.channel(`order-${id}`)
    req.app.get('io')?.to(`order-${req.params.id}`).emit('status-update', { status, ts: new Date() });

    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PRODUCTS ── */

// POST /admin/products
router.post('/products', adminAuth, async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, is_veg, is_bestseller, add_ons, prep_time, serves, calories } = req.body;
    if (!name || !price || !category_id) return res.status(400).json({ error: 'name, price, category_id required' });

    const { data, error } = await supabase.from('products').insert({
      name, description, price: Number(price), image_url, category_id,
      is_veg: !!is_veg, is_bestseller: !!is_bestseller,
      add_ons: add_ons || [],
      prep_time: prep_time || '25–30 min',
      serves: serves || '1',
      calories: calories || '',
      is_available: true, rating: 4.5, rating_count: 0,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/products/:id
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.id; delete updates.created_at;
    if (updates.price) updates.price = Number(updates.price);

    const { data, error } = await supabase.from('products')
      .update(updates).eq('id', req.params.id).select().single();

    if (error) throw error;
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/products/:id  (soft delete)
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('products')
      .update({ is_available: false }).eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── COUPONS ── */

// POST /admin/coupons
router.post('/coupons', adminAuth, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_value, max_discount, usage_limit, expires_at } = req.body;
    const { data, error } = await supabase.from('coupons').insert({
      code: code.toUpperCase(), discount_type,
      discount_value: Number(discount_value),
      min_order_value: Number(min_order_value) || 0,
      max_discount: max_discount ? Number(max_discount) : null,
      usage_limit:  usage_limit  ? Number(usage_limit)  : null,
      expires_at: expires_at || null,
      is_active: true, usage_count: 0,
    }).select().single();

    if (error) throw error;
    res.status(201).json({ coupon: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/coupons/:id
router.put('/coupons/:id', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('coupons')
      .update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ coupon: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── USERS ── */

// GET /admin/users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, phone, created_at, is_blocked')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ users: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/users/:id/block
router.put('/users/:id/block', adminAuth, async (req, res) => {
  try {
    const { blocked } = req.body;
    const { data, error } = await supabase.from('users')
      .update({ is_blocked: !!blocked }).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── CHAT ── */

// GET /admin/chat
router.get('/chat', adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, users(email, full_name)')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;
    res.json({ messages: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/chat/reply  { user_id, message }
router.post('/chat/reply', adminAuth, async (req, res) => {
  try {
    const { user_id, message } = req.body;
    const { data, error } = await supabase.from('chat_messages')
      .insert({ user_id, message, is_admin: true }).select().single();
    if (error) throw error;
    req.app.get('io')?.to(`user-${user_id}`).emit('chat-reply', data);
    res.status(201).json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
