// ============================================================================================= //
/**
* [ global.adp.document.checkThisPath ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PATH, FULLPATHMODE) => new Promise((RESOLVE, REJECT) => {
// ============================================================================================= //
  const packName = 'global.adp.document.checkThisPath';
  let path = '';
  let newPath = '';
  if (FULLPATHMODE === undefined || FULLPATHMODE === null) {
    path = `${global.adp.path}/static/${PATH}`;
  } else {
    path = PATH;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const checkFolder = (ADDFOLDER) => {
    if (ADDFOLDER.trim().length > 0) {
      newPath = `${newPath}/${ADDFOLDER}`;
      if (!(global.fs.existsSync(newPath))) {
        global.fs.mkdirSync(newPath, 0o744);
        adp.echoLog(`Folder "${ADDFOLDER}" created in "${newPath}"`, null, 200, packName);
      }
    }
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  try {
    const pathArray = path.split('/');
    pathArray.forEach((SEGMENT) => {
      if (SEGMENT.trim().length > 0) {
        checkFolder(SEGMENT);
      }
    });
    path = `${path}/`;
    adp.echoLog(`Local path checked [ ${path} ]`, null, 200, packName);
    RESOLVE(path);
  } catch (ERROR) {
    adp.echoLog('Error on try/catch', ERROR, 500, packName, true);
    REJECT(ERROR);
  }
// ============================================================================================= //
});
// ============================================================================================= //
