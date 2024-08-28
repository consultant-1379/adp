/**
 * Azure model, manages Azure token fetching and connection
 * [ adp.models.azure ]
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);
class Azure {
  constructor() {
    this.package = 'adp.models.azure ';
    this.defaultExpSec = 3300;
    this.expiresMs = 0;
    this.tokenSetTime = 0;
    this._tokenObj = {};
  }

  /**
   * sets the new token to allow expiry tracking
   * @param {object} tokenObj the azure token object
   * @author Cein
   */
  trackNewToken(tokenObj) {
    const expiresSec = (tokenObj.expires_in ? (tokenObj.expires_in - 200) : this.defaultExpSec);
    this.expiresMs = expiresSec * 1000;
    const currentDate = new Date();
    this.tokenSetTime = currentDate.getTime();
    this._tokenObj = tokenObj;
  }

  /**
   * Clears the token variables
   * @author Cein
   */
  clearToken() {
    this._tokenObj = {};
    this.tokenSetTime = 0;
    this.expiresMs = 0;
  }

  /**
   * Checks if the Azure token has not expired
   * @returns {boolean} true if the token has not expired
   * @author Cein
   */
  tokenActiveCheck() {
    const tokenObj = this._tokenObj;
    if (tokenObj && Object.keys(tokenObj).length && this.tokenSetTime) {
      const currentDate = new Date();
      const tokenUsedTime = currentDate.getTime() - this.tokenSetTime;
      return (tokenUsedTime < this.expiresMs);
    }
    return false;
  }


  /**
   * Connects and retrieves the Azure token
   * @returns {Promise} object containing the access_token
   * @author Cein
   */
  connect() {
    return new Promise((resolve, reject) => {
      const conf = adp.config.azure;
      const options = {
        url: conf.url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          grant_type: conf.grant_type,
          client_id: conf.client_id,
          client_secret: conf.client_secret,
          resource: conf.resource,
        },
      };
      global.request(options, (azureError, res, body) => {
        if (azureError) {
          const error = { message: azureError, code: 500 };
          adp.echoLog('Azure request error', error.message, error.code, this.package);
          this.clearToken();
          reject(error);
        } else if (res.statusCode === 200 && typeof body === 'string') {
          const tokenObj = JSON.parse(body);
          if (tokenObj.access_token) {
            this.trackNewToken(tokenObj);
            resolve(tokenObj);
          } else {
            const error = { message: 'Response does not contain the access token', code: 500 };
            adp.echoLog(error.message, null, error.code, this.package);
            this.clearToken();
            reject(error);
          }
        } else {
          const error = { message: 'Failure to fetch token or response is not of type json', code: 500 };
          adp.echoLog(error.message, null, error.code, this.package);
          this.clearToken();
          reject(error);
        }
      });
    });
  }

  /**
   * Returns the currently set token
   * @returns {string} the currently set token
   * @author Cein
   */
  token() {
    return this.tokenObj()
      .then(tokenObj => tokenObj.access_token);
  }

  /**
   * Returns the currently set full token object
   * @returns {object} the currently set full token details
   * @author Cein
   */
  tokenObj() {
    return new Promise((resolve, reject) => {
      if (this.tokenActiveCheck()) {
        resolve(this._tokenObj);
      } else {
        this.connect()
          .then(tokenObj => resolve(tokenObj))
          .catch(errorFetchingToken => reject(errorFetchingToken));
      }
    });
  }
}

module.exports = new Azure();
