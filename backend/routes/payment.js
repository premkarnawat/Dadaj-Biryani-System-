/**
 * PAYMENT ROUTES — Razorpay integration
 * Frontend uses: fake payment for now, Razorpay in production
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');
const crypto   = require('crypto');

let Razorpay;
try { Razorpay = require('razorpay'); } catch { Razorpay = null; }

const getRazorpay = () => {
  if (!Razorpay || !process.env.RAZORPAY_KEY_ID) return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

// POST /payment/create-order  { amount (INR), receipt? }
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount || amount < 1) return res.status(400).json({ error: 'Invalid amount' });

    const rzp = getRazorpay();
    if (!rzp) {
      // Demo mode — return fake order
      return res.json({
        id:       `demo_order_${Date.now()}`,
        amount:   Math.round(amount * 100),
        currency,
        key:      process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
        demo:     true,
      });
    }

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({ id: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /payment/verify  — verifies Razorpay signature
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      // Demo mode — auto-verify
      await supabase.from('payments').upsert({
        order_id, payment_id: razorpay_payment_id || `demo_${Date.now()}`,
        status: 'SUCCESS', verified_at: new Date().toISOString(),
      });
      await supabase.from('orders').update({ payment_status: 'PAID' }).eq('id', order_id);
      return res.json({ success: true, payment_id: razorpay_payment_id });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature)
      return res.status(400).json({ error: 'Payment verification failed' });

    await supabase.from('payments').upsert({
      order_id, payment_id: razorpay_payment_id,
      razorpay_order_id, status: 'SUCCESS', verified_at: new Date().toISOString(),
    });
    await supabase.from('orders').update({ payment_status: 'PAID' }).eq('id', order_id);

    res.json({ success: true, payment_id: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
