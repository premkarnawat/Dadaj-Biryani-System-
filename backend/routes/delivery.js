/**
 * DELIVERY BOY ROUTES
 * Frontend (delivery/page.tsx) pushes GPS:
 *   supabase.from('delivery_tracking').upsert({ order_id, lat, lng })
 *
 * This route handles:
 *   - Delivery boy OTP login
 *   - Fetching assigned orders (with bill info)
 *   - Updating location + order status
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const jwt      = require('jsonwebtoken');

// POST /delivery/login  { phone }  — sends OTP
router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    // In production: send real SMS OTP via Twilio/MSG91
    // For demo: OTP is always 123456
    console.log(`[Delivery OTP] Phone: ${phone} → OTP: 123456 (demo)`);
    res.json({ message: 'OTP sent', phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /delivery/verify-otp  { phone, otp }
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'phone and otp required' });

    // Demo: any 6-digit OTP passes
    if (otp !== '123456' && otp.length !== 6)
      return res.status(401).json({ error: 'Invalid OTP' });

    // Get or create delivery boy record
    const { data: agent, error } = await supabase
      .from('delivery_boys')
      .select('*')
      .eq('phone', phone)
      .single();

    const deliveryAgent = agent || { id: `demo-${phone}`, phone, name: 'Delivery Partner' };

    const token = jwt.sign(
      { id: deliveryAgent.id, phone, isDelivery: true },
      process.env.JWT_SECRET || 'dadaj-delivery-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, agent: deliveryAgent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /delivery/orders — assigned orders for delivery boy
// (In production: filter by agent_id; demo returns PICKED + ON_THE_WAY orders)
router.get('/orders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token required' });

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id, status, total, address, payment_method, payment_status,
        created_at,
        order_items ( name, quantity, price ),
        users ( full_name, phone )
      `)
      .in('status', ['PICKED', 'ON_THE_WAY', 'ACCEPTED', 'PREPARING'])
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) throw error;
    res.json({ orders: orders || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /delivery/update-location  { order_id, lat, lng, agent_name?, agent_phone? }
router.post('/update-location', async (req, res) => {
  try {
    const { order_id, lat, lng, agent_name, agent_phone } = req.body;
    if (!order_id || lat == null || lng == null)
      return res.status(400).json({ error: 'order_id, lat, lng required' });

    // Upsert into delivery_tracking — frontend reads this via Supabase Realtime
    const { error } = await supabase
      .from('delivery_tracking')
      .upsert({
        order_id,
        agent_name:  agent_name  || 'Delivery Partner',
        agent_phone: agent_phone || '',
        lat:         Number(lat),
        lng:         Number(lng),
        updated_at:  new Date().toISOString(),
      }, { onConflict: 'order_id' });

    if (error) throw error;

    // Also push via Socket.io (instant, no DB polling needed)
    req.app.get('io')?.to(`order-${order_id}`).emit('location-update', {
      lat: Number(lat), lng: Number(lng), ts: Date.now(),
    });

    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /delivery/orders/:id/deliver  — mark order as delivered
router.put('/orders/:id/deliver', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'DELIVERED', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('order_status_logs').insert({
      order_id: id, status: 'DELIVERED', note: 'Marked delivered by delivery boy',
    });

    req.app.get('io')?.to(`order-${id}`).emit('status-update', { status: 'DELIVERED', ts: new Date() });

    res.json({ order, message: 'Order delivered!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
