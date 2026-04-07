/**
 * COUPONS ROUTE
 * Frontend calls: couponsApi.apply(code, orderTotal)
 * POST /apply-coupon { code, orderTotal }
 *
 * Frontend expects:
 * { valid, code, discountType, discountValue, discountAmount, message }
 * ↑ These names MUST match CouponState in cartStore.ts
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || orderTotal == null)
      return res.status(400).json({ error: 'code and orderTotal required' });

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !coupon)
      return res.status(404).json({ error: 'Invalid or expired coupon code' });

    // Expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      return res.status(400).json({ error: 'This coupon has expired' });

    // Usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit)
      return res.status(400).json({ error: 'Coupon usage limit reached' });

    // Minimum order
    if (Number(orderTotal) < coupon.min_order_value)
      return res.status(400).json({
        error: `Minimum order ₹${coupon.min_order_value} required`,
      });

    // Calculate discount — matches frontend logic in cart/page.tsx
    let discountAmount = coupon.discount_type === 'percentage'
      ? (Number(orderTotal) * coupon.discount_value) / 100
      : coupon.discount_value;

    if (coupon.max_discount) discountAmount = Math.min(discountAmount, coupon.max_discount);
    discountAmount = Math.round(Math.min(discountAmount, Number(orderTotal)));

    res.json({
      valid:         true,
      code:          coupon.code,
      discountType:  coupon.discount_type,   // 'percentage' | 'fixed' — matches CouponState
      discountValue: coupon.discount_value,
      discountAmount,
      message:       `You save ₹${discountAmount}!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
