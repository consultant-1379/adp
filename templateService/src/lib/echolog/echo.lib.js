/**
 * Log processing controls
 */

/**
 * Terminal logging standard
 * @param {string} message log message
 * @param {object} dataObj data output placeholder
 * @param {number} code reporting status code
 * @param {string} pack the package name
 * @author Cein
 */
const log = (message, dataObj = null, code = 200, pack = '') => {
  if (dataObj === null) {
    console.log(code, message, pack); // eslint-disable-line no-console
  } else {
    console.log(code, message, pack, dataObj); // eslint-disable-line no-console
  }
};

module.exports = {
  log,
};
