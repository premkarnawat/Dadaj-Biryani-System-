const supabase = require('../lib/supabase');
const jwt      = require('jsonwebtoken');

/**
 * auth — validates Supabase JWT from frontend
 * Frontend sends: Authorization: Bearer <supabase_access_token>
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Missing authorization header' });

    const token = header.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user)
      return res.status(401).json({ error: 'Invalid or expired token' });

    req.user = user;           // { id, email, user_metadata, ... }
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * adminAuth — validates admin JWT (issued by /admin/login)
 */
const adminAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Admin token required' });

    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin)
      return res.status(403).json({ error: 'Admin access only' });

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid admin token' });
  }
};

/** optionalAuth — passes through even without token */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(header.split(' ')[1]);
      req.user = user || null;
    } else {
      req.user = null;
    }
  } catch { req.user = null; }
  next();
};

module.exports = { auth, adminAuth, optionalAuth };
