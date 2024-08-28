const sleep = require('util').promisify(setTimeout);

/**
 * [adp.ModelRetry]
 * Retry queue for any model
 * @param {function} retryMethod the method that when run will return a promise
 * e.g. (() => peopleFinderModel.peopleSearchBySignum(signum, true))
 * @param {array<number>} retryOn list of error codes to retry on
 * e.g. [503]
 * @param {number} [waitOnRetry=0] how long in ms to wait until each retry
 * @param {number} [requestLimit=3] how many attempts must be made
 * @author Cein
 */
adp.docs.list.push(__filename);
/* eslint-disable no-await-in-loop */
class ModelRetry {
  constructor(retryMethod, retryOn, waitOnRetry = 0, requestLimit = 3) {
    this.package = 'adp.ModelRetry';
    this.retryMethod = retryMethod;
    this.retryOn = retryOn;
    this.requestLimit = requestLimit;
    this.waitOnRetry = waitOnRetry;
  }

  /**
   * validates the constructors params
   * @returns {object} joi validation response object
   * @author Cein
   */
  joiValidateConstruct() {
    const schema = global.joi.object({
      retryMethod: global.joi.function().label('retryMethod').required(),
      retryOn: global.joi.array().label('retryOn').required(),
      waitOnRetry: global.joi.number().min(0).label('waitOnRetry').required(),
      requestLimit: global.joi.number().min(1).label('requestLimit').required(),
    });

    return schema.validate({
      retryMethod: this.retryMethod,
      retryOn: this.retryOn,
      waitOnRetry: this.waitOnRetry,
      requestLimit: this.requestLimit,
    });
  }

  /**
   * Initialise the retry process
   * will return on first success
   * Will return the final error if the retry limit is exceeded
   * @returns {promise} the model response
   * @author Cein
   */
  async init() {
    const { error: valErr } = this.joiValidateConstruct();
    const time = (new Date()).getTime();
    if (typeof valErr === 'undefined') {
      let retryCount = 0;
      let lastErr = {};
      while (retryCount < this.requestLimit) {
        if (retryCount && this.waitOnRetry) {
          adp.echoLog(`Model retry(${retryCount}) due to code [${lastErr.code}] in the next ${this.waitOnRetry}ms`, { lastErr }, 200, this.package);
          await sleep(this.waitOnRetry);
        }
        try {
          const resp = await this.retryMethod();
          if (retryCount > 0) {
            adp.echoLog(
              `ModelRetry resolved after ${retryCount} ${(retryCount === 1 ? 'retry' : 'retries')} in ${((new Date()).getTime() - time)}ms`,
              null,
              200,
              this.package,
            );
          }
          return Promise.resolve(resp);
        } catch (err) {
          if (err.code && this.retryOn.includes(err.code)) {
            retryCount += 1;
            lastErr = err;
          } else {
            return Promise.reject(err);
          }
        }
      }

      return Promise.reject(lastErr);
    }

    const error = {
      message: valErr.message,
      code: 400,
      data: {
        error: valErr,
        retryMethodType: typeof this.retryMethod,
        retryOn: this.retryOn,
        waitOnRetry: this.waitOnRetry,
        requestLimit: this.requestLimit,
        origin: 'init',
      },
    };
    adp.echoLog(error.message, error.data, error.code, this.package);
    return Promise.reject(error);
  }
}

module.exports = ModelRetry;
