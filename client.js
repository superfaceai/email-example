const { SuperfaceClient } = require('@superfaceai/one-sdk');

/**
 * Centralized instance of `SuperfaceClient`.
 * https://github.com/superfaceai/one-sdk-js#initializing-the-onesdk-client
 */
let client = undefined;

/**
 * @returns centralized instance of SuperfaceClient
 */
function getClient() {
  if (client === undefined) {
    client = new SuperfaceClient();
  }

  return client;
}

module.exports = {
  getClient,
};
