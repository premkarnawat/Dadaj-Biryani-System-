require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const { createServer } = require('http');
const { Server }       = require('socket.io');
const rateLimit        = require('express-rate-limit');

const app        = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET','POST'] },
});

// ── Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15*60*1000, max: 300, message: { error: 'Rate limit exceeded' } }));

app.set('io', io);

// ── Routes ──
app.use('/products',      require('./routes/products'));
app.use('/categories',    require('./routes/categories'));
app.use('/cart',          require('./routes/cart'));
app.use('/order',         require('./routes/orders'));
app.use('/apply-coupon',  require('./routes/coupons'));
app.use('/addresses',     require('./routes/addresses'));
app.use('/chat',          require('./routes/chat'));
app.use('/payment',       require('./routes/payment'));
app.use('/admin',         require('./routes/admin'));
app.use('/delivery',      require('./routes/delivery'));

// ── Health check ──
app.get('/health', (_, res) => res.json({
  status: 'ok', service: 'DADAJ BIRYANI API', version: '2.0.0',
  timestamp: new Date().toISOString(),
}));

// ── 404 + Error handlers ──
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Socket.io ──
io.on('connection', socket => {
  console.log('[WS] connected:', socket.id);

  // User joins their order room to receive status updates
  socket.on('join-order', orderId => {
    socket.join(`order-${orderId}`);
    console.log(`[WS] ${socket.id} → order-${orderId}`);
  });

  // Delivery boy pushes location every few seconds
  socket.on('update-location', ({ orderId, lat, lng }) => {
    io.to(`order-${orderId}`).emit('location-update', { lat, lng, ts: Date.now() });
  });

  // Admin joins admin room to receive new order notifications
  socket.on('join-admin', () => socket.join('admin-room'));

  socket.on('disconnect', () => console.log('[WS] disconnected:', socket.id));
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🍛  DADAJ BIRYANI API  →  port ${PORT}`);
  console.log(`   Env : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

module.exports = { app, io };
