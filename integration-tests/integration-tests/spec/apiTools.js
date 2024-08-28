/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */

class ApiTools {
  /**
  * Just wait for a few seconds.
  * @param {integer} SECONDS String to print on console.
  * @param {object} JASMINE Object.
  * @return {Promise} Promise is resolved when the time ends.
  */
  waitFor(SECONDS = 1) {
    let seconds = SECONDS;
    if (SECONDS > 1) console.log(`\nStart the waiting [ ${seconds} of ${SECONDS} seconds ]`);
    const subtractOne = setInterval(() => {
      seconds -= 1;
      if (seconds % 5 === 0) {
        if (SECONDS > 1) console.log(`Still waiting [ ${seconds} of ${SECONDS} seconds ]`);
      }
    }, 1000);
    return new Promise(RESOLVE => setTimeout(() => {
      clearInterval(subtractOne);
      if (SECONDS > 1) console.log('Wait is finished...');
      RESOLVE();
    }, (SECONDS * 1000)));
  }
}

module.exports = {
  ApiTools,
};
