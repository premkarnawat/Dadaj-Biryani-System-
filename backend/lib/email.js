const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) {
    console.log('[Email] SMTP not configured, skipping:', subject);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'DADAJ BIRYANI <noreply@dadajbiryani.com>',
    to,
    subject,
    html,
  });
};

const sendOrderConfirmation = async (email, order) => {
  await sendEmail({
    to: email,
    subject: `Order Confirmed! #${order.id.slice(0, 8).toUpperCase()} – DADAJ BIRYANI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🍛 DADAJ BIRYANI</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Your order has been placed successfully!</p>
        </div>
        <div style="padding: 32px; border: 1px solid #fed7aa; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="background: #fff7ed; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #9a3412; font-size: 12px; font-weight: bold; letter-spacing: 1px;">ORDER ID</p>
            <p style="margin: 4px 0 0; color: #1a1a1a; font-size: 18px; font-weight: bold; font-family: monospace;">#${order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <h2 style="color: #1a1a1a; margin: 0 0 8px;">Order Confirmed! 🎉</h2>
          <p style="color: #666; margin: 0 0 24px;">Your biryani is being prepared with love. Estimated delivery: 25–35 minutes.</p>
          <div style="border-top: 2px solid #fed7aa; padding-top: 16px;">
            <p style="color: #1a1a1a; font-weight: bold; margin: 0 0 4px;">Total Amount</p>
            <p style="color: #f97316; font-size: 24px; font-weight: bold; margin: 0;">₹${order.total}</p>
          </div>
          <div style="margin-top: 24px; background: #f0fdf4; border-radius: 8px; padding: 16px;">
            <p style="margin: 0; color: #166534; font-size: 14px;">🛵 Track your order in real-time on the DADAJ BIRYANI app</p>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">
            For support, reach us at support@dadajbiryani.com or call 1800-DADAJ
          </p>
        </div>
      </div>
    `,
  });
};

const sendDeliveryUpdate = async (email, orderId, status) => {
  const statusMessages = {
    PREPARING: { emoji: '👨‍🍳', msg: 'Your biryani is being prepared!' },
    ON_THE_WAY: { emoji: '🛵', msg: 'Your order is on the way!' },
    DELIVERED: { emoji: '✅', msg: 'Your order has been delivered. Enjoy!' },
  };

  const info = statusMessages[status];
  if (!info) return;

  await sendEmail({
    to: email,
    subject: `${info.emoji} Order Update – DADAJ BIRYANI`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <div style="background: #f97316; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 36px;">${info.emoji}</h1>
          <p style="color: white; margin: 8px 0 0; font-size: 18px; font-weight: bold;">${info.msg}</p>
        </div>
        <div style="padding: 24px; border: 1px solid #fed7aa; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
          <p style="font-family: monospace; color: #f97316; font-size: 14px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
          <p style="color: #666;">Open the app to track your order live.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendOrderConfirmation, sendDeliveryUpdate };
