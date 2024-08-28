// ============================================================================================= //
/**
* [ global.adp.document.getFileFromArtifactoryLoadFromDiskCache ]
* Retrieve a document from local diskCache.
* @param {String} URL A String with the URL of the document in Artifactory (For identification).
* @param {String} DOCFULLSLUGLINK A String with the Backend URL of the document.
* @param {String} FILENAME The name of the file.
* @param {String} FILEEXTENSIONFINDER Array with the extensions.
* @param {String} SUBFILE If the requested file is not the first HTML.
* @return {Object} Returns a <b>promise</b>.
* This promise will be RESOLVED if the process is successful and the content is retrieved
* from diskCache.
* This promise will be REJECTED if some ERROR was detected.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (
  URL,
  DOCFULLSLUGLINK,
  FILENAME,
  FILEEXTENSIONFINDER,
  SUBFILE,
) => new Promise((RESOLVE, REJECT) => {
// ============================================================================================= //
  const packName = 'global.adp.document.getFileFromArtifactoryLoadFromDiskCache';
  const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const sendThisFile = (FILEPATH, CACHED) => {
    if (!(global.fs.existsSync(FILEPATH))) {
      adp.echoLog('Local File not Found', FILEPATH, 404, packName);
      return { fromcache: CACHED, html: 'not found' };
    }
    const file = global.fs.readFileSync(FILEPATH, 'utf8');
    return { fromcache: CACHED, html: file };
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const folderName = global.adp.slugThisURL(URL);
  const path = `${global.adp.path}/static/document/${folderName}/`;
  const pathCached = `${global.adp.path}/static/document/${folderName}/cache/`;
  if (!(global.fs.existsSync(path))) {
    REJECT();
    return;
  }
  const stat = global.fs.statSync(path);
  if (stat.isDirectory()) {
    const filesArray = [];
    global.fs.readdirSync(path).forEach((FILE) => {
      filesArray.push(FILE);
    });
    if (global.fs.existsSync(pathCached)) {
      const statCache = global.fs.statSync(pathCached);
      if (statCache.isDirectory()) {
        global.fs.readdirSync(pathCached).forEach((FILE) => {
          filesArray.push(FILE);
        });
      }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const onlyHTML = filesArray.filter((FILE) => {
      const extension = FILE.match(regExpExtension);
      let result = false;
      if (Array.isArray(extension)) {
        if (extension.length === 1) {
          if (extension[0] === '.html' || extension[0] === '.htm') {
            result = true;
          }
        }
      }
      return result;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    if (onlyHTML.length === 0) {
      if (global.fs.existsSync(`${path}${FILENAME}`)) {
        const obj = {
          fromcache: true,
          download: DOCFULLSLUGLINK,
          internal: `${path}${FILENAME}`,
        };
        RESOLVE(obj);
        return;
      }
      const errorObject = { msg: 'No document was found!' };
      REJECT(errorObject);
      return;
    }
    if (onlyHTML.length === 1) {
      let thisFilePath;
      if ((global.fs.existsSync(pathCached))) {
        thisFilePath = `${pathCached}${onlyHTML[0]}`;
      } else {
        thisFilePath = `${path}${onlyHTML[0]}`;
      }
      RESOLVE(sendThisFile(thisFilePath, true));
      return;
    }
    if (SUBFILE !== undefined && SUBFILE !== null) {
      const thisFilePath = `${path}cache/${SUBFILE}`;
      RESOLVE(sendThisFile(thisFilePath, true));
      return;
    }
    const originalFileNameExtension = FILEEXTENSIONFINDER[0].substr(0, 3);
    const originalFileNameWithoutExtension = FILENAME.replace(originalFileNameExtension, '');
    const fileNoExtLen = originalFileNameWithoutExtension.length;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const candidateOne = onlyHTML.filter((FILE) => {
      if (FILE.substr(0, (fileNoExtLen - 1)) === originalFileNameWithoutExtension) {
        return true;
      }
      return false;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    if (candidateOne.length === 1) {
      RESOLVE(sendThisFile(`${path}/cache/${candidateOne}`, true));
      return;
    }
    RESOLVE(sendThisFile(`${path}/cache/${onlyHTML[0]}`, true));
  } else {
    RESOLVE(sendThisFile(path, true));
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
