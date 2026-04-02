const router = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');

// GET /chat/messages
router.get('/messages', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    res.json({ messages: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /chat/send
router.post('/send', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: req.user.id, message: message.trim(), is_admin: false })
      .select()
      .single();

    if (error) throw error;

    // Emit to admin room
    req.app.get('io')?.to('admin-room').emit('new-chat-message', {
      ...data, user_email: req.user.email,
    });

    res.status(201).json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
