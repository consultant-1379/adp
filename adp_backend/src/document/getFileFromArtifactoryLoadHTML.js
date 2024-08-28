// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryLoadHTML ]
* Retrieve a HTML from Artifactory, save it in diskCache and send its content for render.
* @param {String} URL A String with the URL of the document in Artifactory.
* @param {String} DOCFULLSLUGLINK A String with the Backend URL of the document.
* @param {Object} HTTPHEADERS A object with the HEADERS for the REQUEST.
* @param {String} FILENAME The name of the file.
* @param {String} SLUGFOLDER The name of the folder where should save the file.
* @param {String} REMOTEHEAD The remote HEAD which should be save in "headers.systemtext" file.
* @return {Object} Returns a <b>promise</b>.
* This promise will be RESOLVED if the process is successful. But this means that we got an
* answer for the user: Could be a reference for the file download or a message about the file
* was not found in artifactory.
* This promise will be REJECTED if some ERROR was detected.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const { customMetrics } = require('../metrics/register');

module.exports = (
  URL,
  DOCFULLSLUGLINK,
  HTTPHEADERS,
  FILENAME,
  SLUGFOLDER,
  REMOTEHEAD,
) => new Promise((RESOLVE, REJECT) => {
// ============================================================================================= //
  const packName = 'global.adp.document.getFileFromArtifactoryLoadHTML';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.document.checkThisPath(`document/${SLUGFOLDER}`)
    .then((FULLPATH) => {
      if (typeof REMOTEHEAD === 'string') {
        const headerPath = `${FULLPATH}/headers.systemtext`;
        global.fs.writeFileSync(headerPath, REMOTEHEAD, 'utf8');
      }
      adp.echoLog('Retrieving file from Artifactory', URL, 200, packName);
      const fileStream = global.fs.createWriteStream(`${FULLPATH}/${FILENAME}`);
      const setupObj = {
        followRedirect: false,
        followAllRedirects: false,
        encoding: null,
        url: URL,
        headers: HTTPHEADERS,
      };
      const startTime = new Date();
      global.request.get(setupObj)
        .on('error', (ERROR) => {
          adp.echoLog('Error on [ global.request.get ]', ERROR, 500, packName, true);
          fileStream.close();
          REJECT(ERROR);
          customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
        })
        .on('response', (RESPONSE) => {
          customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
          if (RESPONSE.statusCode === 200) {
            RESPONSE.pipe(fileStream)
              .on('finish', () => {
                fileStream.close(() => {
                  global.adp.document.parseThisHTML(FILENAME, [], `${FULLPATH}`, DOCFULLSLUGLINK)
                    .then((CONTENT) => {
                      RESOLVE({ fromcache: false, html: CONTENT });
                    })
                    .catch((ERROR) => {
                      adp.echoLog('Error on [ adp.document.parseThisHTML ]', ERROR, 500, packName, true);
                    });
                });
              });
          } else {
            fileStream.close();
            global.adp.document.clearArtifactoryCache(FULLPATH);
            global.adp.document.removeFolderIfEmpty('document');
            adp.echoLog('File not Found', URL, 404, packName);
            RESOLVE({ status: RESPONSE.statusCode, msg: `File not Found: ${URL}`, download: 'ERROR' });
          }
        });
    })
    .catch((ERROR) => {
      adp.echoLog('Error on [ adp.document.checkThisPath ]', ERROR, 500, packName, true);
      REJECT(ERROR);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
