// ============================================================================================= //
/**
* [ global.adp.document.removeFolderIfEmpty ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (PATH) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.removeFolderIfEmpty';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const safePath = `${global.adp.path}/static/${PATH}`;
  if (global.fs.existsSync(safePath)) {
    const stat = global.fs.statSync(safePath);
    if (!stat.isDirectory()) {
      adp.echoLog(`ERROR :: Can't remove Folder "${safePath}" because this is not a Folder!`, null, 500, packName, true);
      return false;
    }
    try {
      const files = global.fs.readdirSync(safePath);
      if (files.length === 0) {
        global.fs.rmdirSync(safePath);
        return true;
      }
      // If not empty, the Folder won't be removed. But this is not a problem.
    } catch (ERROR) {
      adp.echoLog('Error on try/catch block', ERROR, 500, packName, true);
    }
  }
  return false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
