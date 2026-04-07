/**
 * ADDRESSES ROUTES
 * Frontend calls: addressesApi.getAll/create/update/delete
 *
 * Address shape matches Address type in supabase.ts:
 * { label, address_line1, address_line2?, city, pincode, lat?, lng? }
 *
 * Allowed delivery areas (STRICT — matches frontend validation):
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');

const ALLOWED_AREAS = [
  'sadar bazar','powai naka','shahupuri','sangam mahuli',
  'guruwar peth','ajinkyatara','sangamnagar',
];

const isAllowedArea = (addr) =>
  ALLOWED_AREAS.some(a => (addr.address_line1 || '').toLowerCase().includes(a) ||
                          (addr.city || '').toLowerCase().includes('satara'));

// GET /addresses
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('id, label, address_line1, address_line2, city, pincode, lat, lng, is_default')
      .eq('user_id', req.user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    res.json({ addresses: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /addresses
router.post('/', auth, async (req, res) => {
  try {
    const { label, address_line1, address_line2, city, pincode, lat, lng, is_default } = req.body;
    if (!address_line1 || !city || !pincode)
      return res.status(400).json({ error: 'address_line1, city, pincode required' });

    if (!isAllowedArea({ address_line1, city }))
      return res.status(400).json({
        error: 'We only deliver to: Sadar Bazar, Powai Naka, Shahupuri, Sangam Mahuli, Guruwar Peth, Ajinkyatara, Sangamnagar',
      });

    if (is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', req.user.id);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({ user_id: req.user.id, label: label || 'Home', address_line1, address_line2, city, pincode, lat, lng, is_default: !!is_default })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ address: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /addresses/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { label, address_line1, address_line2, city, pincode, lat, lng, is_default } = req.body;
    if (is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', req.user.id);
    }
    const { data, error } = await supabase
      .from('addresses')
      .update({ label, address_line1, address_line2, city, pincode, lat, lng, is_default })
      .eq('id', req.params.id).eq('user_id', req.user.id)
      .select().single();

    if (error) throw error;
    res.json({ address: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /addresses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('addresses').delete()
      .eq('id', req.params.id).eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
