// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryLoadZip ]
* Retrieve a ZIP from Artifactory, unzip, save the content in diskCache and send its
* content for render.
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
const errorLog = require('../library/errorLog');
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
  const packName = 'global.adp.document.getFileFromArtifactoryLoadZip';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const diskFileName = `${(new Date()).getTime()}__TEMPORARY_FILE__${FILENAME}`;
  global.adp.document.checkThisPath('zip')
    .then((FULLPATH) => {
      adp.echoLog('Retrieving file from Artifactory and savind on disk...', { URL, localPath: `${FULLPATH}/${diskFileName}` }, 200, packName);
      const fileStream = global.fs.createWriteStream(`${FULLPATH}/${diskFileName}`);
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
                  global.adp.document.unzipThisFile(diskFileName, URL)
                    .then(() => {
                      global.adp.document.parseTheseFiles(URL, DOCFULLSLUGLINK)
                        .then((ZIPCONTENT) => {
                          let content = null;
                          if (Array.isArray(ZIPCONTENT)) {
                            if (ZIPCONTENT.length > 0) {
                              content = ZIPCONTENT[0];
                            }
                          } else {
                            content = ZIPCONTENT;
                          }
                          if (typeof REMOTEHEAD === 'string') {
                            global.adp.document.checkThisPath(`document/${SLUGFOLDER}`)
                              .then((FULLDOCPATH) => {
                                const headerPath = `${FULLDOCPATH}headers.systemtext`;
                                global.fs.writeFileSync(headerPath, REMOTEHEAD, 'utf8');
                                RESOLVE({ fromcache: false, html: content });
                              })
                              .catch((ERROR) => {
                                adp.echoLog(`Error on global.adp.document.checkThisPath( 'document/${SLUGFOLDER}' ) of "typeof REMOTEHEAD === 'string'" block:`, ERROR, 500, packName, true);
                                REJECT(ERROR);
                              });
                          } else {
                            RESOLVE({ fromcache: false, html: content });
                          }
                        })
                        .catch((ERROR) => {
                          adp.echoLog(`Error on global.adp.document.parseTheseFiles( ${URL}, ${DOCFULLSLUGLINK} ) of "global.adp.document.unzipThisFile( ${diskFileName}, ${URL} )" block:`, ERROR, 500, packName, true);
                          REJECT(ERROR);
                        });
                    })
                    .catch((ERROR) => {
                      adp.echoLog(`Error on global.adp.document.unzipThisFile( ${diskFileName}, ${URL} ) of "fileStream.close(() => {})" block:`, ERROR, 500, packName, true);
                      REJECT(ERROR);
                    });
                });
              });
          } else {
            try {
              fileStream.close();
              try {
                global.fs.unlinkSync(`${FULLPATH}/${diskFileName}`);
                adp.echoLog(`File ${FULLPATH}/${diskFileName} deleted`, null, 200, packName);
              } catch (error) {
                errorLog(
                  error.code === 'ENOENT' ? 404 : 500,
                  `Failure to unlink file: ${FULLPATH}/${diskFileName}`,
                  { error, FULLPATH, diskFileName },
                  'main',
                  packName,
                );
              }

              global.adp.document.removeFolderIfEmpty('zip');
              global.adp.document.checkThisPath(`document/${SLUGFOLDER}`)
                .then((FULLDOCPATH) => {
                  global.adp.document.clearArtifactoryCache(FULLDOCPATH);
                  global.adp.document.removeFolderIfEmpty('document');
                })
                .catch(() => {});
              adp.echoLog('File not Found', { URL }, 404, packName);
              RESOLVE({ status: RESPONSE.statusCode, msg: `File not Found: ${URL}`, download: 'ERROR' });
            } catch (error) {
              const errorObject = {
                error,
                path: `${FULLPATH}/${diskFileName}`,
              };
              adp.echoLog('Error when unlinking a file.', errorObject, 500, packName, false);
              RESOLVE({ status: RESPONSE.statusCode, msg: `File not Found: ${URL}`, download: 'ERROR' });
            }
          }
        });
    })
    .catch((ERROR) => {
      adp.echoLog('Error on [ adp.document.checkThisPath(\'zip\') ]', ERROR, 500, packName, true);
      REJECT(ERROR);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
