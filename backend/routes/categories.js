/**
 * CATEGORIES ROUTES
 * Frontend calls: categoriesApi.getAll()
 * Expected: { categories: [{ id, name, slug, image_url, sort_order }] }
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, sort_order')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
