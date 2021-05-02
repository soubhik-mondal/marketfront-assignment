"use strict";

/* The simplified DynamoDB Document Client */
const DynamoDB = require("aws-sdk").DynamoDB.DocumentClient;

// Instantiate the DynamoDB client
const db = new DynamoDB();

/**
 * Gets the user details
 * @param  {String}  userId The user whose details need to be retrieved
 * @return {Promise}        The promise
 */
const getUser = async (userId) => {
  /**
   * Setting up the DynamoDB GET query
   * @type {Object}
   */
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: {
      userId: userId,
    },
  };

  // Wrapping the callback with a Promise
  return new Promise((resolve, reject) => {
    db.get(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.Item);
      }
    });
  });
};

/**
 * Sets the user details
 * @param  {Object}  data                   The user details object
 * @param  {String}  data.userId            The user id
 * @param  {String}  data.email             The email address
 * @param  {String}  data.phone             The phone number
 * @param  {Object}  data.settings          The notification settings
 * @param  {Boolean} data.settings.email    The email notification settings
 * @param  {Boolean} data.settings.sms      The sms notification settings
 * @param  {Boolean} data.settings.whatsapp The whatsapp notification settings
 * @return {Promise}                        The promise
 */
const setUser = async (data) => {
  /**
   * Setting up the DynamoDB GET query
   * @type {Object}
   */
  let params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      userId: data.userId,
      email: data.email,
      phone: data.phone,
      settings: {
        email: data.settings.email,
        sms: data.settings.sms,
        whatsapp: data.settings.whatsapp,
      },
    },
  };

  // Wrapping the callback with a Promise
  return new Promise((resolve, reject) => {
    db.put(params, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  getUser,
  setUser,
};
