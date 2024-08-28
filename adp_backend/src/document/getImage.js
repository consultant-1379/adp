// ============================================================================================= //
/**
* [ global.adp.document.getImage ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = (LINK, SAVEAS, EXTENSION) => new Promise((RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.getImage';
  adp.echoLog('Get Image from external server', { link: LINK, saveAs: `${SAVEAS}.${EXTENSION}` }, 200, packName);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (!LINK) {
    const errorCode = 400;
    const errorMessage = 'Parameter LINK cannot be null/undefined';
    const errorObject = {
      error: errorMessage,
      parameters: {
        link: LINK,
        saveas: SAVEAS,
        extension: EXTENSION,
      },
    };
    REJECT(errorLog(errorCode, errorMessage, errorObject, 'Main Function', packName));
    return;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let path = `${global.adp.path}`;
  const checkFolder = (ADDFOLDER) => {
    path = `${path}/${ADDFOLDER}`;
    if (!(global.fs.existsSync(path))) {
      global.fs.mkdirSync(path, 0o744);
      adp.echoLog(`Folder "${ADDFOLDER}" created in "${path}"`, null, 200, packName);
    }
  };
  checkFolder('static');
  checkFolder('images');
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const url = global.adp.document.extractPath(LINK);
  const Authorization = `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}`;
  const headers = { Authorization };
  let fileID = '';
  if (SAVEAS === null || SAVEAS === undefined) {
    const fileAuxNumber = Math.floor(Math.random() * 99999);
    fileID = `${global.adp.timeStamp(false)}-${fileAuxNumber}`;
  } else {
    fileID = SAVEAS;
  }
  const dest = `${path}/${fileID}.${EXTENSION}`;
  const options = {
    headers,
    url,
    dest,
  };
  global.download.image(options)
    .then((filename) => {
      let convertingError = '';
      let errorMessageText = '';
      let filepathText = '';
      global.base64IMG.imgSync(`data:image/${EXTENSION};base64,${filename.image}`, path, fileID, (err, filepath) => {
        convertingError = err;
        filepathText = filepath;
        errorMessageText = `ERROR on saving file "${filename.filename}" in "${filepath}".`;
      });
      if (convertingError === '') {
        adp.echoLog(`File saved on "${filename.filename}"`, null, 200, packName);
        RESOLVE(`${fileID}.${EXTENSION}`);
      } else {
        const errorCode = 500;
        const errorMessage = errorMessageText;
        const errorObject = {
          error: convertingError,
          parameters: {
            link: LINK,
            saveas: SAVEAS,
            extension: EXTENSION,
            dest,
            filepathText,
          },
        };
        REJECT(errorLog(errorCode, errorMessage, errorObject, 'Main Function', packName));
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error on trying to download an image.';
      const errorObject = {
        error: ERROR,
        parameters: {
          link: LINK,
          saveas: SAVEAS,
          extension: EXTENSION,
          dest,
          options,
        },
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'Main Function', packName));
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
// ============================================================================================= //
