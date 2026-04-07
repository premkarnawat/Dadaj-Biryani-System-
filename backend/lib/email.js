const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const from = process.env.EMAIL_FROM || 'DADAJ BIRYANI <noreply@dadajbiryani.com>';

const send = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) { console.log('[Email] SMTP not configured, skip:', subject); return; }
  await transporter.sendMail({ from, to, subject, html });
};

// Matches: sendOrderConfirmation(req.user.email, order) in orders.js
const sendOrderConfirmation = async (email, order) => {
  await send({
    to: email,
    subject: `Order Confirmed! #${order.id.slice(0,8).toUpperCase()} – DADAJ BIRYANI`,
    html: `
<div style="font-family:sans-serif;max-width:520px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #fed7aa">
  <div style="background:linear-gradient(135deg,#f97316,#ea580c);padding:28px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:26px">🍛 DADAJ BIRYANI</h1>
    <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px">Your order has been placed!</p>
  </div>
  <div style="padding:28px">
    <div style="background:#fff7ed;border-radius:10px;padding:14px;margin-bottom:20px;text-align:center">
      <p style="margin:0;color:#9a3412;font-size:11px;font-weight:700;letter-spacing:1px">ORDER ID</p>
      <p style="margin:4px 0 0;color:#ea580c;font-size:20px;font-weight:900;font-family:monospace">#${order.id.slice(0,8).toUpperCase()}</p>
    </div>
    <p style="color:#1a1a1a;font-weight:700;font-size:16px">🎉 Order Placed Successfully!</p>
    <p style="color:#666;font-size:14px">Your biryani is being prepared. Estimated delivery: <strong>25–35 minutes</strong></p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px">
      <tr style="border-bottom:1px solid #fee2e2"><td style="padding:8px 4px;color:#555">Subtotal</td><td style="text-align:right;font-weight:600">₹${order.subtotal}</td></tr>
      <tr style="border-bottom:1px solid #fee2e2"><td style="padding:8px 4px;color:#555">GST (5%)</td><td style="text-align:right;font-weight:600">₹${order.tax}</td></tr>
      <tr style="border-bottom:1px solid #fee2e2"><td style="padding:8px 4px;color:#555">Delivery</td><td style="text-align:right;font-weight:600">${order.delivery_charge === 0 ? 'FREE' : '₹'+order.delivery_charge}</td></tr>
      ${Number(order.discount)>0 ? `<tr style="border-bottom:1px solid #fee2e2"><td style="padding:8px 4px;color:#16a34a">Discount</td><td style="text-align:right;color:#16a34a;font-weight:600">-₹${order.discount}</td></tr>` : ''}
      <tr><td style="padding:10px 4px;font-weight:800;font-size:15px">Total Paid</td><td style="text-align:right;font-weight:800;font-size:15px;color:#f97316">₹${order.total}</td></tr>
    </table>
    <p style="text-align:center;color:#999;font-size:12px;margin-top:20px">DADAJ BIRYANI · Satara, Maharashtra<br>For support: support@dadajbiryani.com</p>
  </div>
</div>`,
  });
};

// Matches: sendStatusUpdate(email, order_id, status) in orders.js
const sendStatusUpdate = async (email, orderId, status) => {
  const map = {
    PREPARING:  { emoji:'👨‍🍳', msg:'Your biryani is being prepared!',   sub:'Order Update' },
    ON_THE_WAY: { emoji:'🛵', msg:'Your order is on the way!',           sub:'Out for Delivery' },
    DELIVERED:  { emoji:'✅', msg:'Your order has been delivered. Enjoy!', sub:'Delivered!' },
  };
  const info = map[status];
  if (!info) return;
  await send({
    to: email,
    subject: `${info.emoji} ${info.sub} – DADAJ BIRYANI`,
    html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;text-align:center;padding:32px">
      <div style="font-size:64px;margin-bottom:16px">${info.emoji}</div>
      <h2 style="color:#ea580c;margin:0 0 8px">${info.msg}</h2>
      <p style="color:#888;font-size:13px">Order #${orderId.slice(0,8).toUpperCase()}</p>
    </div>`,
  });
};

module.exports = { sendOrderConfirmation, sendStatusUpdate };
