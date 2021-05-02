"use strict";

/**
 * Provides methods for interacting with database
 * @type {Object}
 */
const db = require("./dynamodb");

/**
 * Sends message to SQS queue
 * @type {Function}
 */
const sendMessage = require("./sqs");

/**
 * Handle notification via email, sms, or whatsapp
 * @param  {String} userId         The user who needs to be notified
 * @param  {Object} body           The request body
 * @param  {String} body.type      The type of notification
 * @param  {String} body.to        The recipient (email of phone)
 * @param  {String} body.text      The message body
 * @param  {String} [body.subject] The email subject
 * @return {Object}                The response
 */
const notify = async (userId, body) => {
  try {
    let userDetails = await db.getUser(userId);
    if (!userDetails) {
      // Return 404 if user not found
      return {
        statusCode: 404,
        body: "Not found",
      };
    }
    if (userDetails.settings.email && userDetails.email) {
      // Handle email notification
      await sendMessage({
        type: "email",
        to: userDetails.email,
        text: body.text,
        subject: body.subject,
      });
    }
    if (userDetails.settings.sms && userDetails.phone) {
      // Handle sms notification
      await sendMessage({
        type: "sms",
        to: userDetails.phone,
        text: body.text,
      });
    }
    if (userDetails.settings.whatsapp && userDetails.phone) {
      // Handle whatsapp notification
      await sendMessage({
        type: "whatsapp",
        to: userDetails.phone,
        text: body.text,
      });
    }
  } catch (e) {
    throw e;
  }
  // General success response
  return {
    statusCode: 200,
    body: "Success",
  };
};

/**
 * Handle subscription
 * @param  {String}  userId          The user who wants to be subscribed
 * @param  {Object}  body            The request body
 * @param  {Boolean} [body.email]    Subscribes to email notification
 * @param  {Boolean} [body.sms]      Subscribes to sms notification
 * @param  {Boolean} [body.whatsapp] Subscribes to whatsapp notification
 * @return {Object}                  The response
 */
const subscribe = async (userId, body) => {
  try {
    let userDetails = await db.getUser(userId);
    if (!userDetails) {
      return {
        statusCode: 404,
        body: "Not found",
      };
    }
    if (body.email) {
      userDetails.settings.email = true;
    }
    if (body.sms) {
      userDetails.settings.sms = true;
    }
    if (body.whatsapp) {
      userDetails.settings.whatsapp = true;
    }
    await db.setUser(userDetails);
  } catch (e) {
    throw e;
  }
  return {
    statusCode: 200,
    body: "Success",
  };
};

/**
 * Handle unsubscription
 * @param  {String}  userId          The user who wants to be unsubscribed
 * @param  {Object}  body            The request body
 * @param  {Boolean} [body.email]    Unsubscribes from email notification
 * @param  {Boolean} [body.sms]      Unsubscribes from sms notification
 * @param  {Boolean} [body.whatsapp] Unsubscribes from whatsapp notification
 * @return {Object}                  The response
 */
const unsubscribe = async (userId, body) => {
  try {
    let userDetails = await db.getUser(userId);
    if (!userDetails) {
      return {
        statusCode: 404,
        body: "Not found",
      };
    }
    if (body.email) {
      userDetails.settings.email = false;
    }
    if (body.sms) {
      userDetails.settings.sms = false;
    }
    if (body.whatsapp) {
      userDetails.settings.whatsapp = false;
    }
    await db.setUser(userDetails);
  } catch (e) {
    throw e;
  }
  return {
    statusCode: 200,
    body: "Success",
  };
};

/**
 * The handler
 * @param  {Object} event The event object
 * @return {Object}       The response
 */
module.exports.handler = async (event) => {
  switch (event.resource) {
    // Notify API
    case "/api/v1/user/{userId}/notify":
      return await notify(event.pathParameters.userId, JSON.parse(event.body));
      break;
    // Subscribe API
    case "/api/v1/user/{userId}/subscribe":
      return await subscribe(
        event.pathParameters.userId,
        JSON.parse(event.body)
      );
      break;
    // Unsubscribe API
    case "/api/v1/user/{userId}/unsubscribe":
      return await unsubscribe(
        event.pathParameters.userId,
        JSON.parse(event.body)
      );
      break;
    // Unknown
    default:
      return {
        statusCode: 404,
        body: "Not found",
      };
  }
};
