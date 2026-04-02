const router = require('express').Router();
const supabase = require('../lib/supabase');

// GET /categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
