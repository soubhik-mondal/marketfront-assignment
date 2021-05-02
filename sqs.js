"use strict";

/**
 * The SQS Class
 * @type {Class}
 */
const SQS = require("aws-sdk").SQS;

/**
 * Instantiating the SQS class
 * @type {SQS}
 */
const sqs = new SQS();

/**
 * Send SQS message
 * @param  {Object}  message           The SQS message object
 * @param  {String}  message.type      The type of notification
 * @param  {String}  message.to        The recipient (email of phone)
 * @param  {String}  message.text      The message body
 * @param  {String}  [message.subject] The email subject
 * @return {Promise}                   The promise
 */
const sendMessage = async (message) => {
  let params = {
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify(message),
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = sendMessage;
