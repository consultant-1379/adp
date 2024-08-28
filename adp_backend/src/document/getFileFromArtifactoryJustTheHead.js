// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryJustTheHead ]
* Retrieve the HEAD of the file from Artifactory, without download the body of the file.
* @param {String} URL A String with the URL of the document.
* @param {String} HEADERS The parameters for the header of the resquest.
* Keep in mind: "HEAD from a file" is not the same thing as "HEADERS from a request".
* @return {Object} Returns a <b>promise</b>.
* If successful, RESOLVE with a stringified HEAD object.
* If fails, the promise will be REJECTED.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const ifItIsEriDocHeader = (RESPONSE) => {
  if (!RESPONSE || !RESPONSE.headers || !RESPONSE.headers['content-disposition']) {
    return { eriDocFileName: undefined, eriDocContentType: undefined };
  }
  const tempArray = RESPONSE.headers['content-disposition'].split('\'\'');
  if (!Array.isArray(tempArray) || tempArray.length <= 1) {
    return { eriDocFileName: undefined, eriDocContentType: undefined };
  }
  let tempString = tempArray[1];
  if (tempString.indexOf('%') >= 0) {
    tempString = decodeURIComponent(tempString);
  }
  tempString = adp.slugIt(tempString, true);
  let tempContentType;
  if (RESPONSE.headers['content-type']) {
    tempContentType = RESPONSE.headers['content-type'];
  }
  return { eriDocFileName: tempString, eriDocContentType: tempContentType };
};
// ============================================================================================= //
module.exports = (URL, HEADERS) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.document.getFileFromArtifactoryJustTheHead';
  const setupObj = {
    followRedirect: false,
    followAllRedirects: false,
    encoding: null,
    url: URL,
    headers: HEADERS,
    method: 'HEAD',
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.request(setupObj, (ERROR, RESPONSE) => {
    if (ERROR !== null && ERROR !== undefined) {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error occured while reading Artifactories repsonse header.';
      const errorObject = {
        error: ERROR,
        URL,
        response: RESPONSE,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    } else {
      const { eriDocFileName, eriDocContentType } = ifItIsEriDocHeader(RESPONSE);
      const headersObject = RESPONSE.headers;
      const headObjectFromArtifactory = {
        eriDocFileName,
        eriDocContentType,
        file: headersObject['x-artifactory-filename'],
        lastModified: headersObject['last-modified'],
        sha1: headersObject['x-checksum-sha1'],
        sha256: headersObject['x-checksum-sha256'],
        md5: headersObject['x-checksum-md5'],
        length: headersObject['content-length'],
      };
      RESOLVE(JSON.stringify(headObjectFromArtifactory));
    }
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
