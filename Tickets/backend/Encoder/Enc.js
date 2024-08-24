const { Buffer } = require('buffer');

/**
 * Encodes a string to base64.
 * @param {string} str - The string to encode.
 * @returns {string} - The base64 encoded string.
 */
function encode64(str) {
  const buffer = Buffer.from(str);
  return buffer.toString('base64');
}

/**
 * Decodes a base64 encoded string.
 * @param {string} encodedStr - The base64 encoded string to decode.
 * @returns {string} - The decoded string.
 */
function decode64(encodedStr) {
  const buffer = Buffer.from(encodedStr, 'base64');
  return buffer.toString('utf8');
}

module.exports = {
  encode64,
  decode64
};
