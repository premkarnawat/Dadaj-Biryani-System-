require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

const app = express();
const httpServer = createServer(app);

// Socket.io for realtime tracking
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Make io available in routes
app.set('io', io);

// Routes
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/cart', require('./routes/cart'));
app.use('/order', require('./routes/orders'));
app.use('/apply-coupon', require('./routes/coupons'));
app.use('/addresses', require('./routes/addresses'));
app.use('/chat', require('./routes/chat'));
app.use('/payment', require('./routes/payment'));
app.use('/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DADAJ BIRYANI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Socket.io events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Socket ${socket.id} joined order-${orderId}`);
  });

  socket.on('update-location', ({ orderId, lat, lng }) => {
    io.to(`order-${orderId}`).emit('location-update', { lat, lng, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`\n🍛 DADAJ BIRYANI API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

module.exports = { app, io };
