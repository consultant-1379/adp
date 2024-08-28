const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.clearExpiredFilesFromArtifactory ]
* Clear all the files from Artifactory cached on disk with more time than
* "global.adp.config.artifactoryDiskCacheTimeOutInSeconds".
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.clearExpiredFilesFromArtifactory';
  const timerInMS = global.adp.config.artifactoryDiskCacheTimeOutInSeconds * 1000;
  const timerToCheck = global.adp.config.artifactoryCheckDiskCacheTimeOutInSeconds * 1000;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const clearAllOldZips = () => new Promise((RESZIP, REJZIP) => {
    global.adp.document.checkThisPath('zip')
      .then((WORKPATH) => {
        if (global.fs.existsSync(WORKPATH)) {
          global.fs.readdirSync(WORKPATH).forEach((ELEMENT) => {
            const path = `${WORKPATH}${ELEMENT}`;
            const fileStatus = global.fs.statSync(path);
            const fileBirthTime = fileStatus.birthtime;
            const timerDiff = ((new Date(fileBirthTime)).getTime() + timerInMS)
              - (new Date()).getTime();
            if (timerDiff < 0) {
              try {
                global.fs.unlinkSync(path);
                adp.echoLog(`File [ ${path} ] deleted`, null, 200, packName);
              } catch (error) {
                errorLog(
                  error.code === 'ENOENT' ? 404 : 500,
                  `Failure to unlink file: ${path}`,
                  { error, path },
                  'main',
                  packName,
                );
              }
            }
          });
        }
        RESZIP();
      })
      .catch((ERROR) => {
        adp.echoLog('ERROR on clearAllOldZips()', ERROR, 500, packName, true);
        REJZIP();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const clearAllOldDocs = () => new Promise((RESDOC, REJDOC) => {
    global.adp.document.checkThisPath('document')
      .then((WORKPATH) => {
        if (global.fs.existsSync(WORKPATH)) {
          global.fs.readdirSync(WORKPATH).forEach((ELEMENT) => {
            const path = `${WORKPATH}${ELEMENT}/`;
            const fileStatus = global.fs.statSync(path);
            const fileBirthTime = fileStatus.birthtime;
            const timerDiff = ((new Date(fileBirthTime)).getTime() + timerInMS)
              - (new Date()).getTime();
            if (timerDiff < 0) {
              global.adp.document.clearArtifactoryCache(path);
              adp.echoLog(`Folder [ ${path} ] deleted`, null, 200, packName);
            }
          });
        }
        RESDOC();
      })
      .catch((ERROR) => {
        adp.echoLog('ERROR on clearAllOldDocs()', ERROR, 500, packName, true);
        REJDOC();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let firstTime = false;
  if (global.adp.artifactoryCleanDiskCacheLastCheck === undefined) {
    global.adp.artifactoryCleanDiskCacheLastCheck = (new Date()).getTime();
    firstTime = true;
  }
  const tsNow = (new Date()).getTime();
  const tsCheck = (parseInt(global.adp.artifactoryCleanDiskCacheLastCheck, 10)
    + parseInt(timerToCheck, 10));
  const wait = tsCheck - tsNow;
  if ((wait <= 0) || firstTime) {
    global.adp.artifactoryCleanDiskCacheLastCheck = (new Date()).getTime();
    const myPromises = [];
    myPromises.push(clearAllOldZips().then(() => {}).catch(() => {}));
    myPromises.push(clearAllOldDocs().then(() => {}).catch(() => {}));
    Promise.all(myPromises)
      .then(() => {
        RESOLVE({ status: true, msg: 'All files older than 1 minute were deleted from DiskCache!' });
      })
      .catch((ERROR) => {
        adp.echoLog('Error on catch of Promise.all', ERROR, 500, packName, true);
        RESOLVE({ status: false, msg: 'Got an error: Please check the logs!' });
      });
  } else {
    adp.echoLog(`Can't clear from Artifactory Disk Cache, has to wait for ${wait}ms...`, null, 200, packName);
    const seconds = (wait / 1000).toFixed(0);
    let theMSG = `You have to wait for ${seconds} seconds to be able to run this command again!`;
    if (seconds <= 1) {
      theMSG = 'You have to wait for one second to be able to run this command again!';
    }
    RESOLVE({ status: false, msg: theMSG });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
