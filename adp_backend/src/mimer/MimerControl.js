// ============================================================================================= //
/**
* [ adp.mimer.MimerControl ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const axios = require('axios');
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
class MimerControlClass {
  /**
   * Class contructor
   * Prepares the class.
   * @author Armando Dias [zdiaarm]
   */
  constructor() {
    this.packName = 'adp.mimer.MimerControl';
    this.fs = global.fs;
    this.mimerUrlBase = adp
      && adp.config
      && adp.config.mimerServer
      ? adp.config.mimerServer
      : null;
    this.muninUrlBase = adp
      && adp.config
      && adp.config.muninServer
      ? adp.config.muninServer
      : null;
    this.functionalUser = 'eadphub';
    this.mimerRefreshToken = null;
    this.mimerRefreshTokenSavedAt = null;
    this.mimerAccessToken = null;
    this.mimerAccessTokenExpiresIn = null;
  }


  /**
   * autoRefreshToken()
   * Refresh the "Access Token" using the "Refresh Token",
   * this method was created to be called by an endpoint
   * everyday to avoid token expiration.
   * @author Armando Dias [zdiaarm]
   */
  autoRefreshToken() {
    return new Promise((RESOLVE, REJECT) => {
      this._checkRefreshToken()
        .then((TOKEN) => {
          if (!TOKEN) {
            const moreInfo = {
              action: 'Access the Swagger and send the initial Refresh Token to unlock this feature.',
              url: `${adp.config.siteAddress}/api-docs/#/Mimer/post_mimerRefreshToken`,
            };
            const errorObject = errorLog(500, 'Refresh Token not found. This feature is locked.', moreInfo, 'getProduct', this.packName);
            REJECT(errorObject);
            return;
          }
          this.mimerRefreshToken = TOKEN.token;
          this.mimerRefreshTokenSavedAt = new Date(TOKEN.saved_at);
          if (this._checkIfExpired()) {
            this._refreshToken()
              .then(() => { RESOLVE(true); })
              .catch((ERROR) => {
                const errorObject = errorLog(500, 'Error when it was trying to refresh the access token.', ERROR, 'getVersion', this.packName);
                REJECT(errorObject);
              });
          }
        });
    });
  }


  /**
   * Private _refreshToken()
   * Refresh the "Access Token" using the "Refresh Token".
   * @author Armando Dias [zdiaarm]
   */
  _refreshToken() {
    const theHeaders = {
      'Content-Type': 'application/json',
      'X-On-Behalf-Of': this.functionalUser,
    };
    const theMethod = 'post';
    const theUrl = adp.urljoin(this.mimerUrlBase, 'authn/api/v2/refresh-token');
    const theData = JSON.stringify({ token: this.mimerRefreshToken });
    return new Promise((RESOLVE, REJECT) => {
      axios({
        method: theMethod,
        url: theUrl,
        headers: theHeaders,
        data: theData,
      })
        .then((RESPONSE) => {
          const response = RESPONSE
              && RESPONSE.data
              && Array.isArray(RESPONSE.data.results)
              && RESPONSE.data.results.length > 0
            ? RESPONSE.data.results[0]
            : null;
          if (!response) {
            const error = {
              error: 'Unexpected answer format from Mimer Server.',
              method: theMethod,
              url: theUrl,
              headers: theHeaders,
            };
            const errorObject = errorLog(500, 'Unexpected answer from Mimer Server.', error, '_refreshToken', this.packName);
            REJECT(errorObject);
            return;
          }
          if (response.operation !== 'Authentication'
              || response.code !== 'OK'
              || !response.data
              || !response.data.access_token) {
            const error = {
              code: response.code,
              operation: response.operation,
              messages: response.messages,
              method: theMethod,
              url: theUrl,
              headers: theHeaders,
            };
            const errorObject = errorLog(500, 'The access_token was not found in answer as expected.', error, '_refreshToken', this.packName);
            REJECT(errorObject);
            return;
          }

          const newAccessToken = response.data.access_token;
          this.mimerAccessToken = newAccessToken;
          adp.config.functionalMimerAccessToken = newAccessToken;

          const nowMilliseconds = (new Date()).getMilliseconds();
          const accessTokenExpireIn = nowMilliseconds + response.data.expires_in;
          const addingMilliseconds = new Date().setMilliseconds(accessTokenExpireIn);
          this.mimerAccessTokenExpiresIn = new Date(addingMilliseconds);

          const newRefreshToken = response.data.refresh_token;
          this.mimerRefreshToken = newRefreshToken;
          adp.config.functionalMimerToken = newRefreshToken;

          adp.config.mimerAccessTokenExpiresIn = this.mimerAccessTokenExpiresIn;

          if (this.mimerRefreshTokenSavedAt) {
            const diff = new Date((new Date()).getTime() - this.mimerRefreshTokenSavedAt.getTime());
            if ((diff.getTime() / 1000) > 59) {
              this.acceptRefreshToken(newRefreshToken)
                .then((TOKEN) => {
                  this.mimerRefreshToken = TOKEN.token;
                  this.mimerRefreshTokenSavedAt = new Date(TOKEN.saved_at);
                  RESOLVE(this.mimerAccessToken);
                })
                .catch((ERROR) => {
                  const errorObject = errorLog(500, 'Caught an error on this.acceptRefreshToken(newRefreshToken).', ERROR, '_refreshToken', this.packName);
                  REJECT(errorObject);
                });
            } else {
              RESOLVE(this.mimerAccessToken);
            }
          } else {
            RESOLVE(this.mimerAccessToken);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Request reject when trying to access the Mimer Server.';
          const error = {
            url: theUrl,
            error: ERROR,
          };
          const errorObject = errorLog(errorCode, errorMessage, error, '_refreshToken', this.packName);
          REJECT(errorObject);
        });
    });
  }


  /**
   * Private _checkIfExpired()
   * Check if the "Access Token" is expired.
   * @return {boolean} true if expired, false if not expired.
   * @author Armando Dias [zdiaarm]
   */
  _checkIfExpired() {
    if (!this.mimerAccessTokenExpiresIn) {
      return true;
    }
    if (this.mimerAccessTokenExpiresIn.getTime() < (new Date()).getTime()) {
      return true;
    }
    return false;
  }


  /**
   * _retrieveProduct()
   * Retrieves the product information from Munin Server.
   * This function doesn't check the token. Please use getProduct() instead.
   * @param {string} PRODUCTID The unique ID of the Product in Mimer/Munin Server.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _retrieveProduct(PRODUCTID) {
    const theHeaders = {
      Accept: 'application/json',
      'X-On-Behalf-Of': this.functionalUser,
      Authorization: `Bearer ${this.mimerAccessToken}`,
    };
    const theMethod = 'get';
    const theUrl = adp.urljoin(this.muninUrlBase, 'api/v1/products/', PRODUCTID);

    return axios({
      method: theMethod,
      url: theUrl,
      headers: theHeaders,
    })
      .then((RESPONSE) => {
        if (!RESPONSE
          || RESPONSE.status !== 200
          || !RESPONSE.data
          || !Array.isArray(RESPONSE.data.results)
          || RESPONSE.data.results.length === 0
          || !RESPONSE.data.results[0].data) {
          theHeaders.Authorization = '<< ACCESS TOKEN HERE >>';
          const error = {
            error: 'Unexpected answer format from Munin Server.',
            method: theMethod,
            url: theUrl,
            headers: theHeaders,
          };
          const errorObject = errorLog(500, 'Unexpected answer from Munin Server.', error, '_retrieveProduct', this.packName);
          return Promise.reject(errorObject);
        }
        const response = RESPONSE.data.results[0].data;
        return Promise.resolve(response);
      })
      .catch((ERROR) => {
        const errorCode = ERROR && ERROR.code ? ERROR.code : ERROR.response.status;
        const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Request reject when trying to access the Munin Server during _retrieveProduct().';
        const error = {
          url: theUrl,
          error: ERROR,
        };
        const errorObject = errorLog(errorCode, errorMessage, error, '_retrieveProduct', this.packName);
        return Promise.reject(errorObject);
      });
  }

  /**
   * _productParser()
   * Parse and organize the Product Versions.
   * @param {object} PRODUCT The Product Object.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _productParser(PRODUCT) {
    if (!PRODUCT || !Array.isArray(PRODUCT.productVersions)) {
      const error = {
        message: 'Unexpected format of the parameter: PRODUCT.',
        product: PRODUCT,
      };
      const errorObject = errorLog(500, 'Unexpected format of the parameter: PRODUCT.', error, '_productParser', this.packName);
      return new Promise((RES, REJ) => REJ(errorObject));
    }
    const obj = [];
    const theProduct = PRODUCT.designation;
    const theProductNumber = PRODUCT.productNumber;
    PRODUCT.productVersions.forEach((VERSION) => {
      obj.push({
        number: theProductNumber,
        product: theProduct,
        version: VERSION.productVersionLabel,
        url: VERSION.productVersionUrl,
      });
    });
    return new Promise(RES => RES(obj));
  }


  /**
   * _documentListParser()
   * @param {object} ITEMOBJ The version object.
   * @param {object} DOCUMENTLIST The object from remote.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _documentListParser(ITEMOBJ, DOCUMENTLIST) {
    const theLifecycleStage = DOCUMENTLIST
      && DOCUMENTLIST.lifecycle
      && DOCUMENTLIST.lifecycle.lifecycleStage
      ? DOCUMENTLIST.lifecycle.lifecycleStage
      : null;

    this.something = 1;
    if (!DOCUMENTLIST || !DOCUMENTLIST.relations
      || (!DOCUMENTLIST.relations.includes && !DOCUMENTLIST.relations.documentedBy)) {
      let itemObject = ITEMOBJ;
      if (!itemObject) {
        itemObject = {};
      }
      if (!itemObject.unexpectedResult) {
        itemObject.unexpectedResult = [];
      }
      const errorObject = {
        message: 'Document Object does not follow the - relations.includes or relations.documentedBy - format.',
        objectFromRemote: DOCUMENTLIST,
      };
      itemObject.unexpectedResult.push(errorObject);
      return;
    }

    const DocList = DOCUMENTLIST.relations.documentedBy
      ? DOCUMENTLIST.relations.documentedBy : DOCUMENTLIST.relations.includes;

    DocList.forEach((DOCUMENT) => {
      const numberPartRaw = DOCUMENT
        && DOCUMENT.eridocTargetIdentifier
        && DOCUMENT.eridocTargetIdentifier.documentNumber
        ? DOCUMENT.eridocTargetIdentifier.documentNumber
        : null;

      const language = DOCUMENT
        && DOCUMENT.eridocTargetIdentifier
        && DOCUMENT.eridocTargetIdentifier.language
        ? DOCUMENT.eridocTargetIdentifier.language
        : null;
      const getLangCode = (languageVar) => {
        const codes = {
          UEN: 'EN',
        };
        const langString = typeof languageVar === 'string' || languageVar instanceof String ? languageVar.toUpperCase() : 'UEN';
        return codes[langString] || 'EN';
      };
      const langCode = getLangCode(language);
      let numberPart = numberPartRaw;
      if (language) {
        numberPart = `${numberPart}${language}`;
      }
      numberPart = encodeURIComponent(numberPart);

      const revision = DOCUMENT
        && DOCUMENT.eridocTargetIdentifier
        && DOCUMENT.eridocTargetIdentifier.revision
        ? encodeURIComponent(DOCUMENT.eridocTargetIdentifier.revision)
        : null;

      const itemObject = ITEMOBJ;
      itemObject.lifecycleStage = theLifecycleStage;
      if (!itemObject.documents) {
        itemObject.documents = [];
      }

      const document = {};
      document.systemOfRecord = DOCUMENT.systemOfRecord;

      if (document.systemOfRecord === 'Eridoc') {
        document.documentNumber = numberPartRaw || undefined;
        document.language = language || undefined;
        document.revision = revision || undefined;
        document.documentURL = `${adp.config.eridocServer}d2rest/repositories/eridoca/eridocument/download?number-part=${numberPart}`;
        document.publicURL = `${adp.config.eridocPublicServer}Download?DocNo=${numberPartRaw}&Lang=${langCode}`;
        if (revision) {
          document.documentURL = `${document.documentURL}&revision=${revision}`;
          document.publicURL = `${document.publicURL}&Rev=${revision}`;
        }
      }

      itemObject.documents.push(document);
      return itemObject;
    });
  }

  /**
   * _retrieveVersion()
   * Retrieves the product information from Munin Server.
   * This function doesn't check the token. Please use getProduct() instead.
   * @param {string} PRODUCTID The unique ID of the Product in Mimer/Munin Server.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _retrieveVersion(URL) {
    const theHeaders = {
      Accept: 'application/json',
      'X-On-Behalf-Of': this.functionalUser,
      Authorization: `Bearer ${this.mimerAccessToken}`,
    };
    const theMethod = 'get';
    const theUrl = `${URL}`;

    return axios({
      method: theMethod,
      url: theUrl,
      headers: theHeaders,
    })
      .then((RESPONSE) => {
        if (!RESPONSE
          || RESPONSE.status !== 200
          || !RESPONSE.data
          || !Array.isArray(RESPONSE.data.results)
          || RESPONSE.data.results.length === 0
          || !RESPONSE.data.results[0].data) {
          theHeaders.Authorization = '<< ACCESS TOKEN HERE >>';
          const error = {
            error: 'Unexpected answer format from Munin Server.',
            method: theMethod,
            url: theUrl,
            headers: theHeaders,
          };
          const errorObject = errorLog(500, 'Unexpected answer from Munin Server.', error, '_retrieveProduct', this.packName);
          return Promise.reject(errorObject);
        }
        const response = RESPONSE.data.results[0].data;
        return Promise.resolve(response);
      })
      .catch((ERROR) => {
        const error = {
          method: theMethod,
          url: theUrl,
          error: ERROR,
        };
        const errorObject = errorLog(500, 'Request reject when trying to access the Munin Server during _retrieveVersion().', error, '_retrieveProduct', this.packName);
        return Promise.reject(errorObject);
      });
  }

  /**
   * _checkRefreshToken()
   * Retrieves the product information from Munin Server.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  _checkRefreshToken() {
    return new Promise((RES) => {
      const tokenFile = `${adp.path}/keys/adp/refreshToken.json`;
      if (!this.fs.existsSync(tokenFile)) {
        const tokenObject = null;
        RES(tokenObject);
      } else {
        const tokenObject = JSON.parse(this.fs.readFileSync(tokenFile, 'utf8'));
        RES(tokenObject);
      }
    });
  }

  /**
   * acceptRefreshToken()
   * Updates the Refresh Token.
   * @param {string} REFRESHTOKEN Token
   * @return {Promise} true boolean if successful
   * or error object.
   * @author Armando Dias [zdiaarm]
   */
  acceptRefreshToken(REFRESHTOKEN) {
    return new Promise((RES, REJ) => {
      try {
        const keysFolder = `${adp.path}/keys/adp`;
        if (!this.fs.existsSync(keysFolder)) {
          this.fs.mkdirSync(keysFolder, 0o744);
        }
        const tokenObject = {
          token: `${REFRESHTOKEN}`,
          saved_at: new Date(),
        };
        const tokenFile = `${keysFolder}/refreshToken.json`;
        const existsBefore = this.fs.existsSync(tokenFile);
        this.fs.writeFileSync(tokenFile, JSON.stringify(tokenObject, null, 2), 'utf8');
        const displayObject = {
          token: `Hidden Token ${tokenObject.token.length} characters long.`,
          saved_at: tokenObject.saved_at,
          path: tokenFile,
        };
        if (existsBefore) {
          adp.echoLog('Token file updated.', displayObject, 200, this.packName);
        } else {
          adp.echoLog('Token file created.', displayObject, 200, this.packName);
        }
        RES(true);
      } catch (ERROR) {
        const errorDetails = {
          error: ERROR,
        };
        const errorObject = errorLog(500, 'Error caught when savind file in disk.', errorDetails, 'acceptRefreshToken', this.packName);
        REJ(errorObject);
      }
    });
  }

  /**
   * deleteToken
   * Delete the token file from disk.
   * @return {Promise} with the result.
   * @author Armando Dias [zdiaarm]
   */
  deleteToken() {
    return new Promise((RES, REJ) => {
      try {
        const tokenFile = `${adp.path}/keys/adp/refreshToken.json`;
        if (!this.fs.existsSync(tokenFile)) {
          adp.echoLog('Token file already deleted. Nothing to do.', { path: tokenFile }, 200, this.packName);
          RES({ result: 'Token already deleted.' });
          return;
        }
        this.fs.unlinkSync(tokenFile);
        adp.echoLog('Token file deleted.', { path: tokenFile }, 200, this.packName);
        RES({ result: 'Token deleted.' });
        return;
      } catch (ERROR) {
        const errorDetails = {
          error: ERROR,
        };
        const errorObject = errorLog(500, 'Error caught when deleting a file in disk.', errorDetails, 'deleteToken', this.packName);
        REJ(errorObject);
      }
    });
  }


  /**
   * getVersion()
   * Retrieve the content of the version from Mimer Server.
   * @param {string} URL The URL of the version.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  getVersion(URL) {
    return new Promise((RES, REJ) => {
      this._checkRefreshToken()
        .then((TOKEN) => {
          if (!TOKEN) {
            const moreInfo = {
              action: 'Access the Swagger and send the initial Refresh Token to unlock this feature.',
              url: `${adp.config.siteAddress}/api-docs/#/Mimer/post_mimerRefreshToken`,
            };
            const errorObject = errorLog(500, 'Refresh Token not found. This feature is locked.', moreInfo, 'getProduct', this.packName);
            REJ(errorObject);
            return;
          }
          this.mimerRefreshToken = TOKEN.token;
          this.mimerRefreshTokenSavedAt = new Date(TOKEN.saved_at);
          const PARSED = {};
          if (this._checkIfExpired()) {
            this._refreshToken()
              .then(() => this._retrieveVersion(URL))
              .then(DOCUMENTLIST => this._documentListParser(PARSED, DOCUMENTLIST))
              .then(() => { RES(PARSED); })
              .catch((ERROR) => {
                const errorObject = errorLog(500, 'Error when it was trying to refresh the access token.', ERROR, 'getVersion', this.packName);
                REJ(errorObject);
              });
            return;
          }
          this._retrieveVersion(URL)
            .then(DOCUMENTLIST => this._documentListParser(PARSED, DOCUMENTLIST))
            .then(() => { RES(PARSED); })
            .catch((ERROR) => {
              const errorObject = errorLog(500, 'Error was caught when it was retrieving the Product from the Mimer Server.', ERROR, 'getVersion', this.packName);
              REJ(errorObject);
            });
        })
        .catch((ERROR) => {
          const errorObject = errorLog(500, 'Error caught while retrieving data from remote.', ERROR, 'getProduct', this.packName);
          REJ(errorObject);
        });
    });
  }


  /**
   * getProduct()
   * Checks if the current access token is valid,
   * then retrieves the product information from Mimer Server.
   * @param {string} PRODUCTID The unique ID of the Product in Mimer Server.
   * @return {Promise} With the result of the request.
   * @author Armando Dias [zdiaarm]
   */
  getProduct(PRODUCTID) {
    return new Promise((RES, REJ) => {
      this._checkRefreshToken()
        .then((TOKEN) => {
          if (!TOKEN) {
            const moreInfo = {
              action: 'Access the Swagger and send the initial Refresh Token to unlock this feature.',
              url: `${adp.config.siteAddress}/api-docs/#/Mimer/post_mimerRefreshToken`,
            };
            const errorObject = errorLog(500, 'Refresh Token not found. This feature is locked.', moreInfo, 'getProduct', this.packName);
            REJ(errorObject);
            return;
          }
          this.mimerRefreshToken = TOKEN.token;
          this.mimerRefreshTokenSavedAt = new Date(TOKEN.saved_at);
          if (this._checkIfExpired()) {
            this._refreshToken()
              .then(() => this._retrieveProduct(PRODUCTID))
              .then(PRODUCT => this._productParser(PRODUCT))
              .then((MSVERSIONS) => { RES(MSVERSIONS); })
              .catch((ERROR) => {
                const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR && ERROR.desc ? ERROR.desc : 'Request reject when trying to access the Munin Server at getProduct().';
                const error = {
                  productNumber: PRODUCTID,
                  error: ERROR,
                };
                const errorObject = errorLog(errorCode, errorMessage, error, 'getProduct', this.packName);
                REJ(errorObject);
              });
            return;
          }
          this._retrieveProduct(PRODUCTID)
            .then(RESULT => RESULT)
            .then(PRODUCT => this._productParser(PRODUCT))
            .then((MSVERSIONS) => { RES(MSVERSIONS); })
            .catch((ERROR) => {
              const errorObject = errorLog(500, 'Error was caught when it was retrieving the Product from the Mimer Server.', ERROR, 'getProduct', this.packName);
              REJ(errorObject);
            });
        })
        .catch((ERROR) => {
          const errorObject = errorLog(500, 'Error caught while retrieving data from remote.', ERROR, 'getProduct', this.packName);
          REJ(errorObject);
        });
    });
  }
}
// ============================================================================================= //
module.exports = MimerControlClass;
// ============================================================================================= //
