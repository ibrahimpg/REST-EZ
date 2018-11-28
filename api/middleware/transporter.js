const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 26,
  secure: false,
  tls: { rejectUnauthorized: false },
  pool: true,
  auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
});
