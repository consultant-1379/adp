// ============================================================================================= //
/**
* [ global.adp.docs.readDoc ]
* Usually called by [ global.adp.docs.generateDocs ], the [ global.adp.docs.readDoc ]
* will read a physical file, extract the documentation and return this content.
* @param {str} FILE Physical path of the file.
* @return {str} A String with the documentation.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FILE) => {
  if (FILE === '' || FILE === undefined || FILE === null) {
    return '';
  }
  if (typeof FILE !== 'string' && !(FILE instanceof String)) {
    return '';
  }
  let mdate = null;
  const commentFinder = (CODEFILE) => {
    if (CODEFILE === '' || CODEFILE === undefined || CODEFILE === null) {
      return '';
    }
    const patternToGetComment = new RegExp(/(\/\*\*)[\S\s]*?(\*\/)/gim);
    const fileContent = CODEFILE;
    const find = {
      filename: FILE,
      text: fileContent.match(patternToGetComment),
      dependencies: global.adp.docs.getDependencies(fileContent.replace(patternToGetComment, '')),
      modificated: mdate,
    };
    return find;
  };
  const dates = global.fs.statSync(FILE);
  mdate = global.adp.dateFormat(dates.ctime).substr(0, 22);
  const commentsFile = commentFinder(global.fs.readFileSync(FILE, 'utf-8'), mdate);
  return commentsFile;
};
// ============================================================================================= //
