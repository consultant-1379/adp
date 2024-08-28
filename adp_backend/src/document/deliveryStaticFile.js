// ============================================================================================= //
/**
* [ global.adp.document.deliveryStaticFile ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (FOLDER, FILE, EXTENSION) => new Promise((RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const timer = new Date();
  const packName = 'global.adp.document.deliveryStaticFile';
  let tryAgain = 2;
  let fileExists = false;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let path;
  let mode;
  if (FOLDER !== null && FOLDER !== undefined) {
    if (EXTENSION.toLowerCase() !== 'html' && EXTENSION.toLowerCase() !== 'htm') {
      path = `${global.adp.path}/static/document/${FOLDER}/${FILE}`;
      mode = null;
    } else {
      path = `${global.adp.path}/static/document/${FOLDER}/cache/${FILE}`;
      mode = 'utf8';
    }
  } else {
    path = `${global.adp.path}/static/images/${FILE}`;
    mode = null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const waitFor = () => new Promise((RES) => {
    setTimeout(() => {
      RES();
    }, 500);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const lookingForTheFile = () => {
    fileExists = global.fs.existsSync(path);
    if (fileExists) {
      const fileStats = global.fs.statSync(path);
      const fileBinary = global.fs.readFileSync(path, mode);
      const fileObj = {
        stats: fileStats,
        binary: fileBinary,
      };
      RESOLVE(fileObj);
      const endTime = new Date();
      adp.echoLog(`File "${FILE}" ready to be send in ${endTime.getTime() - timer.getTime()} ms`, null, 200, packName);
    } else if (tryAgain >= 0) {
      tryAgain -= 1;
      waitFor()
        .then(() => {
          lookingForTheFile();
        });
    } else {
      const errorCode = 404;
      REJECT(errorCode);
    }
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  lookingForTheFile();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
