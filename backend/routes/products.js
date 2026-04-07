/**
 * PRODUCTS ROUTES
 * Frontend calls: productsApi.getAll(), getById(), getBestsellers()
 * Expected response: { products: [...] } or { product: {...} }
 *
 * Product shape (must match frontend dish data):
 * { id, name, description, price, image_url, category_id, rating,
 *   rating_count, is_veg, is_available, is_bestseller, add_ons[], prepTime, serves, calories }
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { optionalAuth } = require('../middleware/auth');

// GET /products?category=&search=&is_veg=
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, is_veg, sort = 'popular', limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select(`
        id, name, description, price, image_url, category_id,
        rating, rating_count, is_veg, is_available, is_bestseller,
        add_ons, prep_time, serves, calories,
        categories ( id, name, slug )
      `)
      .eq('is_available', true)
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (category)  query = query.eq('categories.slug', category);
    if (search)    query = query.ilike('name', `%${search}%`);
    if (is_veg !== undefined) query = query.eq('is_veg', is_veg === 'true');

    if (sort === 'price-asc')  query = query.order('price', { ascending: true });
    else if (sort === 'price-desc') query = query.order('price', { ascending: false });
    else query = query.order('is_bestseller', { ascending: false }).order('rating', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ products: data, total: count, limit: Number(limit), offset: Number(offset) });
  } catch (err) {
    console.error('[products]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /products/bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, image_url, rating, rating_count, is_veg, is_bestseller, add_ons, prep_time')
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
      .select('*, categories(id, name, slug)')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
