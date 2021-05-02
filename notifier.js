"use strict";

/**
 * Sends email using NodeMailer
 * @type {Function}
 */
const sendMail = require("./mail");

/**
 * Sends SMS or WhatsApp Message using Twilio
 * @type {Function}
 */
const sendMessage = require("./message");

/**
 * Lambda function's handler which polls the SQS queue
 * @param  {Object} event The event which triggered the lambda
 * @return {Error}        Error object otherwise null
 */
module.exports.poller = async (event) => {
  try {
    let body = JSON.parse(event.Records[0].body);
    switch (body.type) {
      case "email": // if message type is email, send email
        await sendMail({
          from: process.env.FROM_EMAIL_ADDRESS,
          to: body.to,
          text: body.text,
          subject: body.subject,
          html: body.text,
        });
        break;
      case "sms": // if message type is sms, send sms
        await sendMessage({
          from: process.env.SMS_FROM_NUMBER,
          to: body.to,
          body: body.text,
        });
        break;
      case "whatsapp": // if message type is whatsapp, send whatsapp
        await sendMessage({
          from: `whatsapp:${process.env.WHATSAPP_FROM_NUMBER}`,
          to: `whatsapp:${body.to}`,
          body: body.text,
        });
        break;
      default:
        // otherwise print error message and exit
        console.log("Unknown body.type", JSON.parse(event.Records[0].body));
        break;
    }
  } catch (e) {
    throw e; // Throw all errors
  }
  return null; // Deletes the message from the queue
};
