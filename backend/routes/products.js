const router = require('express').Router();
const supabase = require('../lib/supabase');
const { optionalAuth } = require('../middleware/auth');

// GET /products - list all products with optional filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, is_veg, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select(`*, categories(id, name, slug)`)
      .eq('is_available', true)
      .order('is_bestseller', { ascending: false })
      .order('rating', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category) query = query.eq('categories.slug', category);
    if (search) query = query.ilike('name', `%${search}%`);
    if (is_veg !== undefined) query = query.eq('is_veg', is_veg === 'true');

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ products: data, total: count, limit, offset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .eq('is_bestseller', true)
      .order('rating', { ascending: false })
      .limit(8);

    if (error) throw error;
    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(id, name, slug)`)
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
