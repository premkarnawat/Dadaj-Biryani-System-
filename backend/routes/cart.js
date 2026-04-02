const router = require('express').Router();
// Cart is managed client-side via Zustand + localStorage
// This route can be used for server-side cart sync

const { auth } = require('../middleware/auth');
const supabase = require('../lib/supabase');

// POST /cart/sync - sync client cart to server (optional)
router.post('/sync', auth, async (req, res) => {
  try {
    const { items } = req.body;
    // Could store in a cart table; for now just validate items
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Items must be an array' });
    }

    // Validate products exist
    const ids = items.map((i) => i.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, is_available')
      .in('id', ids);

    if (error) throw error;

    const validatedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);
      return { ...item, valid: !!product && product.is_available, currentPrice: product?.price };
    });

    res.json({ items: validatedItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
