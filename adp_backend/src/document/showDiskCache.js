// ============================================================================================= //
/**
* [ global.adp.document.showDiskCache ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const obj = {};
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  global.adp.document.removeFolderIfEmpty('zip');
  global.adp.document.removeFolderIfEmpty('document');
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const getFiles = (PATH) => {
    if (!(global.fs.existsSync(PATH))) {
      return undefined;
    }
    const result = {};
    global.fs.readdirSync(PATH).forEach((FILE) => {
      const stat = global.fs.statSync(`${PATH}/${FILE}`);
      if (stat.isDirectory()) {
        result[FILE] = getFiles(`${PATH}/${FILE}/`);
      } else {
        result[FILE] = `${global.adp.formatBytes(stat.size)} on ${global.adp.dateFormat(stat.mtime, false)}`;
      }
    });
    return result;
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  obj.zip = getFiles(`${global.adp.path}/static/zip/`);
  obj.document = getFiles(`${global.adp.path}/static/document/`);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  RESOLVE(obj);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
// ============================================================================================= //
