// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryLoadDocument ]
* Retrieve a document from Artifactory, save it in diskCache and offer it for download.
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
  const packName = 'global.adp.document.getFileFromArtifactoryLoadDocument';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.document.checkThisPath(`document/${SLUGFOLDER}`)
    .then((FULLPATH) => {
      const headerPath = `${FULLPATH}/headers.systemtext`;
      let remoteHeader;
      if (typeof REMOTEHEAD === 'string') {
        global.fs.writeFileSync(headerPath, REMOTEHEAD, 'utf8');
        remoteHeader = JSON.parse(REMOTEHEAD);
      } else {
        const remoteHeaderFile = global.fs.readFileSync(headerPath, 'utf8');
        remoteHeader = JSON.parse(remoteHeaderFile);
      }

      const setupObj = {
        followRedirect: false,
        followAllRedirects: false,
        encoding: null,
        url: URL,
        headers: HTTPHEADERS,
      };
      adp.echoLog('Retrieving from Artifactory', URL, 200, packName);

      let fileName = FILENAME;

      if (remoteHeader && remoteHeader.eriDocFileName) {
        fileName = remoteHeader.eriDocFileName;
      }

      const fileStream = global.fs.createWriteStream(`${FULLPATH}${fileName}`);
      const startTime = new Date();
      global.request.get(setupObj)
        .on('error', (ERROR) => {
          adp.echoLog('Error on [ global.request.get ]', { URL, ERROR }, 500, packName, true);
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
                  const object = {
                    url: URL,
                    internal: `${FULLPATH}${fileName}`,
                    download: DOCFULLSLUGLINK,
                  };
                  adp.echoLog('File retrieved', object, 200, packName);
                  RESOLVE({ fromcache: false, download: DOCFULLSLUGLINK, internal: `${FULLPATH}${fileName}` });
                });
              });
          } else {
            fileStream.close();
            global.adp.document.clearArtifactoryCache(FULLPATH);
            global.adp.document.removeFolderIfEmpty('document');
            adp.echoLog('File not Found', URL, 500, packName, true);
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
