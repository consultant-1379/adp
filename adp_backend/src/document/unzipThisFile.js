const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.unzipThisFile ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (LOCALFILE, ORIGINALURL) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.document.unzipThisFile';
  const checkThis = `/document/${global.adp.slugThisURL(ORIGINALURL)}/`;
  global.adp.document.checkThisPath(checkThis)
    .then((FULLPATH) => {
      const path = `${global.adp.path}/static/zip/${LOCALFILE}`;
      if (global.fs.existsSync(path)) {
        global.fs.createReadStream(path)
          .pipe(global.unzipper.Extract({ path: `${FULLPATH}` }))
          .on('error', () => {
            REJECT();
          })
          .on('close', () => {
            try {
              global.fs.unlinkSync(path);
              global.adp.document.removeFolderIfEmpty('zip');
              adp.echoLog(`File deleted in "${path}"`, null, 200, packName);
            } catch (error) {
              errorLog(
                error.code === 'ENOENT' ? 404 : 500,
                `Failure to unlink file: ${path}`,
                { error, path },
                'main',
                packName,
              );
            }
            RESOLVE();
          });
      } else {
        adp.echoLog(`File [ ${path} ] doesn't exist!`, { path, localFile: LOCALFILE, originalURL: ORIGINALURL }, 500, packName, true);
        REJECT();
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.document.checkThisPath ]';
      const errorOBJ = {
        path: checkThis,
        localFile: LOCALFILE,
        originalURL: ORIGINALURL,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
    });
// ============================================================================================= //
});
// ============================================================================================= //
