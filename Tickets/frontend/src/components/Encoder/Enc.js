import { Buffer } from 'buffer';

/**
 * Encodes a string to base64.
 * @param {string} str - The string to encode.
 * @returns {string} - The base64 encoded string.
 */
function encode64(str) {
  const buffer = Buffer.from(truncateFilename(str,50));
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



/**
 * Truncates a filename to a specified length, preserving the file extension.
 * @param {string} filename - The filename to truncate.
 * @param {number} length - The maximum length of the truncated filename (excluding the extension).
 * @returns {string} - The truncated filename.
 */
function truncateFilename(filename, length) {
    const dotIndex = filename.lastIndexOf('.');
    const name = filename.substring(0, dotIndex);
    const extension = filename.substring(dotIndex);
    
    if (name.length <= length) {
      return filename;
    }
  
    return `${name.substring(0, length)}...${extension}`;
  }
  

  export  {
    encode64,
    decode64
  };
  



// console.log(truncateFilename("asdasdasdasdasssssssssdddddddddddddddddddddddddddddd.pdf"));