const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.clearArtifactoryCache ]
* Clear files and folders, starting from a given path.
* For security, the beginning of the PATH is locked in Hard Code.
* @param {String} PATH A String with the PATH to be deleted.
* @return {Boolean} Returns true or false, if succeed or not.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PATH) => {
  const packName = 'global.adp.document.clearArtifactoryCache';
  const securePath = `${global.adp.path}/static/`;
  if (securePath !== PATH.substr(0, securePath.length)) {
    adp.echoLog(`Only can delete folders/files inside of "${securePath}"`, { parameter: PATH }, 500, packName, true);
    return false;
  }

  try {
    global.fs.readdirSync(PATH).forEach((ELEMENT) => {
      const elementPath = `${PATH}${ELEMENT}`;
      if (global.fs.existsSync(elementPath)) {
        const fileStatus = global.fs.statSync(elementPath);
        if (fileStatus.isDirectory()) {
          global.adp.document.clearArtifactoryCache(`${elementPath}/`);
        } else {
          try {
            global.fs.unlinkSync(elementPath);
            adp.echoLog(`File ${elementPath} deleted from diskCache`, null, 200, packName);
          } catch (error) {
            errorLog(
              error.code === 'ENOENT' ? 404 : 500,
              `Failure to unlink file: ${elementPath}`,
              { error, PATH, elementPath },
              'main',
              packName,
            );
          }
        }
      }
    });
  } catch (error) {
    errorLog(
      error.code === 'ENOENT' ? 404 : 500,
      `Failure to analyse the directory ${PATH}`,
      { error, PATH },
      'main',
      packName,
    );
    return false;
  }

  try {
    global.fs.rmdirSync(PATH);
    adp.echoLog(`Folder ${PATH} removed from diskCache`, null, 200, packName);
    return true;
  } catch (error) {
    errorLog(
      error.code === 'ENOENT' ? 404 : 500,
      `Failure to remove directory ${PATH}`,
      { error, PATH },
      'main',
      packName,
    );
    return false;
  }
};
// ============================================================================================= //
