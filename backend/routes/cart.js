/**
 * CART SYNC ROUTE (optional — cart is client-side in Zustand)
 * Validates product prices server-side to prevent tampering
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');

// POST /cart/sync { items: CartItem[] }
router.post('/sync', auth, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'items must be array' });

    const ids = items.map(i => i.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, is_available')
      .in('id', ids);

    if (error) throw error;

    const validated = items.map(item => {
      const p = products.find(pr => pr.id === item.id);
      return {
        ...item,
        valid:        !!p && p.is_available,
        serverPrice:  p?.price,
        priceMismatch: p && Math.abs(p.price - item.price) > 50, // allow add-on variance
      };
    });

    res.json({ items: validated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
