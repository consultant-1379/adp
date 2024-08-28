const request = require('request');

module.exports = options => new Promise((resolve, reject) => {
  // eslint-disable-next-line consistent-return
  request(options, (error, response, body) => {
    if (response) {
      return resolve(response, body);
    }
    if (error) {
      return reject(error);
    }
  });
});
