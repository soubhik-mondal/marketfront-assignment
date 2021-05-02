"use strict";

/**
 * Library for sending emails
 * @type {Object}
 */
const nodemailer = require("nodemailer");

/**
 * Configure the mailer
 * @type {Object}
 */
const transporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  auth: {
    type: "login",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = async function (message) {
  // Send the email
  return await transporter.sendMail(message);
};
