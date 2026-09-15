const nodemailer = require('nodemailer');

// Create Gmail / SMTP transporter using environment configuration
const createTransporter = () => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const secure = process.env.EMAIL_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER || 'waqaskamboh269@gmail.com',
      pass: process.env.EMAIL_PASS || 'wlupjofyqnevatdu',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send an email with HTML and text content
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content
 * @param {string} [options.text] - Plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!to) {
      console.warn('sendEmail skipped: recipient email is missing.');
      return { success: false, error: 'Recipient email missing' };
    }

    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || '"LuxuryStay Hospitality" <waqaskamboh269@gmail.com>';

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || 'Please view this email in an HTML-compatible email client.',
      html,
    });

    console.log(`[Email Delivered] MessageId: ${info.messageId} | Recipient: ${to} | Subject: ${subject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Error] Failed to send email via SMTP:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail, createTransporter };
