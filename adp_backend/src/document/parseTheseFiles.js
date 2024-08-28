// ============================================================================================= //
/**
* [ global.adp.document.parseTheseFiles ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (ORIGINALURL, DOCFULLSLUGLINK) => new Promise((RESOLVE, REJECT) => {
  const regExpOnlyFileName = new RegExp(/[^/]*$/gim);
  const regExpHTMLExtension = new RegExp(/(\.)(htm)(l)?$/gim);
  const fileNameArray = ORIGINALURL.match(regExpOnlyFileName);
  let fileName = null;
  if (Array.isArray(fileNameArray)) {
    if (fileNameArray.length > 0) {
      fileName = fileNameArray[0];
    }
  }
  if (fileName === null) {
    const errorMSG = `File name cannot found in URL: ${ORIGINALURL}`;
    REJECT(errorMSG);
  } else {
    const folderName = global.adp.slugThisURL(ORIGINALURL);
    const path = `${global.adp.path}/static/document/${folderName}/`;
    const documentLibrary = [];
    global.fs.readdirSync(path).forEach((FILE) => {
      documentLibrary.push(FILE);
    });
    const allPromises = [];
    documentLibrary.forEach((FILENAME) => {
      const matched = FILENAME.match(regExpHTMLExtension);
      if (matched) {
        allPromises.push(global.adp.document.parseThisHTML(
          FILENAME,
          documentLibrary,
          path,
          DOCFULLSLUGLINK,
        ));
      }
    });
    Promise.all(allPromises)
      .then((library) => {
        RESOLVE(library);
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      });
  }
// ============================================================================================= //
});
// ============================================================================================= //
