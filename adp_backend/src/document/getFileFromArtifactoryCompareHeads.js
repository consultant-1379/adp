// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryCompareHeads ]
* Try to compare two file heads. One is retrieve from diskCache ( if exists ) and the other is
* retrieve from Artifactory.
* @param {String} SLUGFOLDER A String with the folder name, where should try to find the local
* file "headers.systemtext" with the previous file head. If the file is not there, means this URL
* is not cached at the momment.
* @param {String} URL A String with the URL of the document. This URL will be used for
* [ global.adp.document.getFileFromArtifactoryJustTheHead ] retrieve the remote HEAD.
* @param {String} HEADERS The parameters for the header of the resquest. This will be used by
* [ global.adp.document.getFileFromArtifactoryJustTheHead ] too.
* Keep in mind: "HEAD from a file" is not the same thing as "HEADERS from a request".
* @return {Object} Returns a <b>promise</b>.
* If RESOLVE as null, means the HEAD are the same.
* If RESOLVE with a HEAD object, means the remote HEAD is newer, so diskCache should be updated.
* If REJECT means the code got some unexpected error.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (SLUGFOLDER, URL, HEADERS) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.document.getFileFromArtifactoryCompareHeads';
  global.adp.document.getFileFromArtifactoryJustTheHead(URL, HEADERS)
    .then((REMOTEFILEHEADERS) => {
      global.adp.document.checkThisPath(`document/${SLUGFOLDER}`)
        .then((FULLPATH) => {
          const headerPath = `${FULLPATH}/headers.systemtext`;
          if (global.fs.existsSync(headerPath)) {
            const cacheHeader = global.fs.readFileSync(headerPath, 'utf-8');
            if (`${cacheHeader}` !== `${REMOTEFILEHEADERS}`) {
              global.adp.document.clearArtifactoryCache(FULLPATH);
              adp.echoLog(`Different Headers for [ ${URL} ]. Cleared local diskCache...`, null, 200, packName);
              RESOLVE(REMOTEFILEHEADERS);
            } else {
              adp.echoLog(`Same Headers for [ ${URL} ]. Using local diskCache!`, null, 200, packName);
              RESOLVE(null);
            }
          } else {
            adp.echoLog(`No Local Headers for [ ${URL} ]. Using remote files!`, null, 200, packName);
            RESOLVE(REMOTEFILEHEADERS);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || `ERROR on adp.document.checkThisPath('document/${SLUGFOLDER}')`;
          const errorObject = {
            error: ERROR,
            SLUGFOLDER,
            URL,
            response: ERROR,
          };
          errorLog(errorCode, errorMessage, errorObject, 'main', packName);
          REJECT();
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error occured while reading Artifactories repsonse header.';
      const errorObject = {
        error: ERROR,
        URL,
        response: ERROR,
      };
      errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      REJECT();
    });
});
// ============================================================================================= //
