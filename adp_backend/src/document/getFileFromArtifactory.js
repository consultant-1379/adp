// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactory ]
* Organize and take the decision about "how" the document should be retrieve from Artifactory.
* @param {String} URL A String with the URL of the document.
* It is assumed that the necessary <b>validations</b> are done before to call this function.
* @param {String} DOCFULLSLUGLINK A String with the backend link "slugged". This is generated
* by [ global.adp.document.getDocument ] before this call.
* @param {String} SUBFILE A String with the subfile name in case of more than one HTML in the
* ZIP package. Usually is null.
* @param {String} ERIDOCMIMEREXTENSION A String with the file extension, used in case the URL
* doesn't have it. Default value is null.
* @return {Object} Returns a <b>promise</b>.
* But the result will be different following the answer of the process.<br/>
* In case of <b>success</b>, the <b>promise</b> will be <b>solved</b> with the
* <b>raw content</b> of the request or the result of the process.<br/>
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (
  URL,
  DOCFULLSLUGLINK = null,
  SUBFILE = null,
  ERIDOCMIMEREXTENSION = null,
) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.document.getFileFromArtifactory';
  const authorizationString = `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}`;
  const headers = { Authorization: authorizationString };
  const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
  const fileExtensionFinder = URL.match(regExpExtension);
  const regExpFileName = new RegExp(/[^/]+$/gim);
  const fileNameFinder = URL.match(regExpFileName);
  let fileName = '';
  if (Array.isArray(fileNameFinder)) {
    if (fileNameFinder.length > 0) {
      fileName = fileNameFinder.pop();
    }
  }
  const slugFolder = global.adp.slugThisURL(URL);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.document.getFileFromArtifactoryCompareHeads(slugFolder, URL, headers)
    .then((HAVEHEAD) => {
      global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
        URL, DOCFULLSLUGLINK, fileName, fileExtensionFinder, SUBFILE,
      )
        .then((RESULTFROMDISKCACHE) => {
          RESOLVE(RESULTFROMDISKCACHE);
        })
        .catch(() => {
          if (ERIDOCMIMEREXTENSION === 'zip') {
            global.adp.document.getFileFromArtifactoryLoadZip(
              URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
            ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
          } else if (ERIDOCMIMEREXTENSION === 'html') {
            global.adp.document.getFileFromArtifactoryLoadHTML(
              URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
            ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
          } else if (!ERIDOCMIMEREXTENSION && Array.isArray(fileExtensionFinder)) {
            switch (fileExtensionFinder[0].substr(0, 4)) {
              case '.zip':
                global.adp.document.getFileFromArtifactoryLoadZip(
                  URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
                ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
                break;
              case '.html':
              case '.htm':
                global.adp.document.getFileFromArtifactoryLoadHTML(
                  URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
                ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
                break;
              default:
                global.adp.document.getFileFromArtifactoryLoadDocument(
                  URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
                ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
                break;
            }
          } else {
            global.adp.document.getFileFromArtifactoryLoadDocument(
              URL, DOCFULLSLUGLINK, headers, fileName, slugFolder, HAVEHEAD,
            ).then((RESULT) => { RESOLVE(RESULT); }).catch((ERROR) => { REJECT(ERROR); });
          }
        });
    })
    .catch((ERROR) => {
      const errorCode = (ERROR && ERROR.code) || 500;
      const errorMessage = (ERROR && ERROR.message) || 'Error occured while comparing headers from Artifactories.';
      const errorObject = {
        error: ERROR,
        URL,
        response: ERROR,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
