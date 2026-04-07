/**
 * CHAT ROUTES
 * Frontend calls: chatApi.getMessages(), chatApi.sendMessage(message)
 * Supabase table: chat_messages { id, user_id, message, is_admin, created_at }
 * Frontend subscribes directly via Supabase Realtime — no extra socket needed
 */
const router   = require('express').Router();
const supabase = require('../lib/supabase');
const { auth } = require('../middleware/auth');

// GET /chat/messages
router.get('/messages', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, message, is_admin, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) throw error;
    res.json({ messages: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /chat/send  { message }
router.post('/send', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: req.user.id, message: message.trim(), is_admin: false })
      .select()
      .single();

    if (error) throw error;

    // Notify admin room via socket
    req.app.get('io')?.to('admin-room').emit('new-chat-message', {
      ...data, user_email: req.user.email,
    });

    res.status(201).json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
