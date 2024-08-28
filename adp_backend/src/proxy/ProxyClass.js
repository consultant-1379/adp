// ============================================================================================= //
/**
* [ adp.proxy.ProxyClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
class ProxyClass {
  // ------------------------------------------------------------------------------------------ //
  /**
   * [ Constructor ]
   * Should receive the Server URL to prepare the Class
   * @param {string} SERVERURL Server URL from Wordpress
   * @Author Armando Dias [ zdiaarm ]
   */
  // ------------------------------------------------------------------------------------------ //
  constructor(SERVERURL) {
    this.packName = 'adp.proxy.ProxyClass';
    this.start = new Date();
    this.serverURL = SERVERURL;
  }
  // ------------------------------------------------------------------------------------------ //


  // ------------------------------------------------------------------------------------------ //
  /**
   * [ getData ]
   * Retrieve content from external server
   * @param {string} PATH The path of the content which should be retrieved.
   * @param {Object} PAYLOAD Object with three variables to allow
   * this function work before Wordpress updated.
   * ( Please see: [ retrocompatibilityParams ] at
   * /adp_backend/src/routes/endpoints/wpcontent/get.js )
   * @author Armando Dias [zdiaarm]
   */
  getData(PATH, PAYLOAD) {
    const verb = PAYLOAD === undefined || PATH === 'preview' ? 'get' : 'post';
    const path = PATH === 'preview' ? `preview/${PAYLOAD.id}?ts=${(new Date()).getTime()}` : PATH;
    return new Promise((RESOLVE, REJECT) => {
      const url = `${this.serverURL}${path}`;
      global.request[verb](
        { url, json: PAYLOAD },
        (ERROR, RES, DATA) => {
          let errorText = '';
          let statusCode = RES && RES.statusCode ? RES.statusCode : 500;
          const errorObject = {};
          if (ERROR) {
            errorText = 'Error to fetch the content';
            statusCode = 500;
          } else if (statusCode === 401) {
            errorText = '401 - Unauthorized';
          } else if (statusCode === 404) {
            errorText = '404 - Content not found';
          } else if (statusCode !== 200) {
            errorText = '500 - Internal Server Error';
            statusCode = 500;
          }
          errorObject.code = statusCode;
          errorObject.message = errorText;
          errorObject.fullURL = url;
          errorObject.error = ERROR;
          errorObject.bodyRetrieved = RES && RES.body ? RES.body : null;
          if (statusCode === 200) {
            RESOLVE(DATA);
          } else {
            adp.echoLog(errorText, errorObject, statusCode, this.packName, true);
            delete errorObject.bodyRetrieved;
            REJECT(errorObject);
          }
        },
      );
    });
  }
  // ------------------------------------------------------------------------------------------ //

  // ------------------------------------------------------------------------------------------ //
  /**
   * [ getUser ]
   * Retrieve user from external server
   * @param {string} ID The user id.
   * @author Rinosh Cherian [zcherin]
   */
  getUser(ID) {
    const verb = 'get';
    const path = 'users/';
    return new Promise((RESOLVE, REJECT) => {
      const url = `${this.serverURL}${path}${ID}`;
      global.request[verb](
        { url },
        (ERROR, RES, DATA) => {
          let errorText = '';
          let statusCode = RES && RES.statusCode ? RES.statusCode : 500;
          const errorObject = {};
          if (ERROR) {
            errorText = 'Error to fetch the content';
            statusCode = 500;
          } else if (statusCode === 401) {
            errorText = '401 - Unauthorized';
          } else if (statusCode === 404) {
            errorText = '404 - Content not found';
          } else if (statusCode !== 200) {
            errorText = '500 - Internal Server Error';
            statusCode = 500;
          }
          errorObject.code = statusCode;
          errorObject.message = errorText;
          errorObject.fullURL = url;
          errorObject.error = ERROR;
          errorObject.bodyRetrieved = RES && RES.body ? RES.body : null;
          if (statusCode === 200) {
            RESOLVE(DATA);
          } else {
            adp.echoLog(errorText, errorObject, statusCode, this.packName, true);
            delete errorObject.bodyRetrieved;
            REJECT(errorObject);
          }
        },
      );
    });
  }
  // ------------------------------------------------------------------------------------------ //
}
// ============================================================================================= //
module.exports = ProxyClass;
// ============================================================================================= //
