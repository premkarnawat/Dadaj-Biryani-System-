/**
 * ORDERS ROUTES
 * Frontend calls:
 *   POST /order/create  → ordersApi.create(data)
 *   GET  /order/my-orders → ordersApi.getMyOrders()
 *   GET  /order/:id     → ordersApi.getById(id)
 *   PUT  /order/status/update → internal
 *
 * Order payload from frontend cart:
 * {
 *   items: [{ id, name, price, image_url, quantity, selectedAddOns, itemTotal }],
 *   address: { label, address_line1, city, pincode, lat?, lng? },
 *   payment_method: 'upi'|'card'|'cod'|'netbank',
 *   payment_id?: string,
 *   coupon_code?: string,
 *   subtotal: number,    ← from cartStore.subtotal()
 *   tax: number,         ← from cartStore.tax()  = subtotal * 0.05
 *   delivery_charge: number, ← calculateDeliveryCharge()
 *   discount: number,    ← coupon.discountAmount
 *   total: number,       ← cartStore.total()
 * }
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');
const { sendOrderConfirmation, sendStatusUpdate } = require('../lib/email');

// POST /order/create
router.post('/create', auth, async (req, res) => {
  try {
    const {
      items, address, payment_method, payment_id,
      coupon_code, subtotal, tax, delivery_charge, discount, total, notes,
    } = req.body;

    if (!items?.length) return res.status(400).json({ error: 'No items in order' });
    if (!address)       return res.status(400).json({ error: 'Delivery address required' });
    if (!total || total < 0) return res.status(400).json({ error: 'Invalid total' });

    // 1 — Create order
    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({
        user_id:         req.user.id,
        status:          'PLACED',
        subtotal:        Number(subtotal) || 0,
        tax:             Number(tax) || 0,
        delivery_charge: Number(delivery_charge) || 0,
        discount:        Number(discount) || 0,
        total:           Number(total),
        address,                          // stored as JSONB — matches Address type
        payment_method:  payment_method || 'upi',
        payment_status:  payment_id ? 'PAID' : 'PENDING',
        coupon_code:     coupon_code || null,
        notes:           notes || null,
      })
      .select()
      .single();

    if (oErr) throw oErr;

    // 2 — Insert order_items (each item = CartItem from frontend)
    const orderItems = items.map(item => ({
      order_id:     order.id,
      product_id:   item.id,            // id from CartItem
      quantity:     item.quantity,
      price:        item.price,         // unit price + add-on price
      name:         item.name,
      image_url:    item.image_url,
      add_ons:      item.selectedAddOns || [],  // AddOn[] from supabase.ts
      item_total:   item.itemTotal,
    }));

    const { error: iiErr } = await supabase.from('order_items').insert(orderItems);
    if (iiErr) throw iiErr;

    // 3 — Status log
    await supabase.from('order_status_logs').insert({
      order_id: order.id, status: 'PLACED', note: 'Order placed via app',
    });

    // 4 — Payment record
    if (payment_id) {
      await supabase.from('payments').insert({
        order_id: order.id, payment_id, amount: total,
        method: payment_method, status: 'SUCCESS',
      });
    }

    // 5 — Notify admin via socket
    req.app.get('io')?.to('admin-room').emit('new-order', {
      orderId: order.id, customer: req.user.email, total,
    });

    // 6 — Email (fire & forget)
    sendOrderConfirmation(req.user.email, order).catch(console.error);

    res.status(201).json({ order, message: 'Order placed successfully' });
  } catch (err) {
    console.error('[order/create]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /order/my-orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, status, subtotal, tax, delivery_charge, discount, total,
        address, payment_method, payment_status, coupon_code, notes,
        created_at, updated_at,
        order_items ( id, product_id, name, image_url, quantity, price, add_ons, item_total )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /order/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, status, subtotal, tax, delivery_charge, discount, total,
        address, payment_method, payment_status, coupon_code, notes,
        created_at, updated_at,
        order_items ( * ),
        order_status_logs ( status, note, created_at ),
        delivery_tracking ( agent_name, agent_phone, lat, lng, updated_at )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /order/status/update  (used by admin & delivery routes too)
router.put('/status/update', auth, async (req, res) => {
  try {
    const { order_id, status, note } = req.body;
    const VALID = ['PLACED','ACCEPTED','PREPARING','PICKED','ON_THE_WAY','DELIVERED','CANCELLED'];
    if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('order_status_logs').insert({
      order_id, status, note: note || `Status → ${status}`,
    });

    // Push realtime to user — frontend listens on supabase.channel(`order-${id}`)
    req.app.get('io')?.to(`order-${order_id}`).emit('status-update', { status, ts: new Date() });

    // Also push via Supabase Realtime (postgres_changes) — automatic

    // Email on key statuses
    const { data: orderData } = await supabase.from('orders')
      .select('users(email)').eq('id', order_id).single();
    if (orderData?.users?.email) {
      sendStatusUpdate(orderData.users.email, order_id, status).catch(console.error);
    }

    res.json({ order, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
