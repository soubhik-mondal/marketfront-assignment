"use strict";

/**
 * Library for sending messages via SMS or WhatsApp
 * @type {Object}
 */
const twilio = require("twilio");

/**
 * Configure the Twilio client
 * @type {Object}
 */
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = async function (message) {
  // Send the message
  return await client.messages.create(message);
};
