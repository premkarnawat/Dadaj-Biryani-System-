const router = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../lib/email');
const { v4: uuidv4 } = require('uuid');

// POST /order/create
router.post('/create', auth, async (req, res) => {
  try {
    const {
      items, address, payment_method, payment_id,
      coupon_code, subtotal, tax, delivery_charge, discount, total, notes,
    } = req.body;

    if (!items?.length) return res.status(400).json({ error: 'No items in order' });
    if (!address) return res.status(400).json({ error: 'Delivery address required' });

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        status: 'PLACED',
        subtotal, tax, delivery_charge,
        discount: discount || 0,
        total,
        address,
        payment_method: payment_method || 'RAZORPAY',
        payment_status: payment_id ? 'PAID' : 'PENDING',
        coupon_code: coupon_code || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image_url: item.image_url,
      add_ons: item.selectedAddOns || [],
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Log initial status
    await supabase.from('order_status_logs').insert({
      order_id: order.id,
      status: 'PLACED',
      note: 'Order placed successfully',
    });

    // Create payment record if paid
    if (payment_id) {
      await supabase.from('payments').insert({
        order_id: order.id,
        payment_id,
        amount: total,
        method: payment_method,
        status: 'SUCCESS',
      });
    }

    // Send confirmation email (fire and forget)
    sendOrderConfirmation(req.user.email, order).catch(console.error);

    // Emit realtime event
    req.app.get('io')?.emit('new-order', { orderId: order.id });

    res.status(201).json({ order, message: 'Order placed successfully' });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /order/my-orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`*, order_items(*)`)
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
      .select(`*, order_items(*), order_status_logs(*), delivery_tracking(*)`)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /order/status/update (admin via socket or direct)
router.put('/status/update', auth, async (req, res) => {
  try {
    const { order_id, status, note } = req.body;

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('order_status_logs').insert({
      order_id, status, note: note || `Status updated to ${status}`,
    });

    // Emit real-time update
    req.app.get('io')?.to(`order-${order_id}`).emit('status-update', { status, timestamp: new Date() });

    res.json({ order, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
