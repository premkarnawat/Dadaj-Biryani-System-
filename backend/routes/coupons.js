const router = require('express').Router();
const supabase = require('../lib/supabase');
const { optionalAuth } = require('../middleware/auth');

// POST /apply-coupon
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || !orderTotal) {
      return res.status(400).json({ error: 'Coupon code and order total are required' });
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon code' });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    // Check minimum order value
    if (orderTotal < coupon.min_order_value) {
      return res.status(400).json({
        error: `Minimum order value of ₹${coupon.min_order_value} required for this coupon`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderTotal * coupon.discount_value) / 100;
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    discountAmount = Math.round(Math.min(discountAmount, orderTotal));

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount,
      message: `Coupon applied! You save ₹${discountAmount}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
