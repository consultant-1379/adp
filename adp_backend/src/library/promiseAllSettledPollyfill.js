/**
 * [ adp.promiseAllSettled ]
 * Pollyfill for Promise.allSettled due to current node version 10.7.0
 * @param {Promise<object[]>} promiseArr list of promises
 * @returns {Promise<object[]>} List of promise allSettled results
 * @author Cein
 */
const promiseAllSettled = (promiseArr) => {
  if (!Promise.allSettled) {
    Promise.allSettled = promises => Promise.all(
      promises.map(promise => promise.then(value => ({
        status: 'fulfilled',
        value,
      })).catch(reason => ({
        status: 'rejected',
        reason,
      }))),
    );
  }

  return Promise.allSettled(promiseArr);
};

module.exports = promiseAllSettled;
