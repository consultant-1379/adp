const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.clearImage ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.clearImage';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const limitTimeOut = global.adp.cache.timeInSeconds;
  const dateNow = new Date();
  dateNow.setSeconds(dateNow.getSeconds() - limitTimeOut);
  const limit = global.adp.dateFormat(dateNow, true);
  const path = `${global.adp.path}/static/images/`;
  const folderExists = global.fs.existsSync(path);
  let clearCount = 0;
  let totalAttempts = 0;
  if (folderExists) {
    await global.fs.readdir(path, (ERR, ITEMS) => {
      if (ERR !== null) {
        errorLog(
          404,
          `Failure to read given directory: ${path}`,
          { error: ERR, path },
          'main',
          packName,
        );
        RESOLVE(false);
        return;
      }
      ITEMS.forEach((FILE) => {
        if (FILE.substr(0, (limit.length - 1)) < limit) {
          totalAttempts += 1;
          try {
            global.fs.unlinkSync(`${path}${FILE}`);
            clearCount += 1;
            adp.echoLog(`deleted ${path}${FILE}`, null, 200, packName);
          } catch (error) {
            errorLog(
              error.code === 'ENOENT' ? 404 : 500,
              `Failure to unlink image: ${path}${FILE}`,
              { error, path, FILE },
              'main',
              packName,
            );
          }
        }
      });
      adp.echoLog(`Images from cache cleared - ${clearCount} out of ${totalAttempts}`, null, 200, packName);
      RESOLVE(true);
    });
  } else {
    RESOLVE(false);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
// ============================================================================================= //
