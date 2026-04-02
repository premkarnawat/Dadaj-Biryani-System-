const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /payment/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /payment/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update payment in DB
    await supabase.from('payments').upsert({
      order_id,
      payment_id: razorpay_payment_id,
      razorpay_order_id,
      status: 'SUCCESS',
      verified_at: new Date().toISOString(),
    });

    await supabase
      .from('orders')
      .update({ payment_status: 'PAID' })
      .eq('id', order_id);

    res.json({ success: true, payment_id: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /payment/webhook (Razorpay webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const isValid = crypto
    .createHmac('sha256', secret)
    .update(req.body)
    .digest('hex') === signature;

  if (!isValid) return res.status(400).send('Invalid signature');

  const event = JSON.parse(req.body);
  console.log('Razorpay webhook event:', event.event);

  // Handle events
  if (event.event === 'payment.captured') {
    const paymentId = event.payload.payment.entity.id;
    console.log('Payment captured:', paymentId);
    // Update order status if needed
  }

  res.json({ received: true });
});

module.exports = router;
