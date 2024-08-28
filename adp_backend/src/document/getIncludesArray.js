// ============================================================================================= //
/**
* [ global.adp.document.getIncludesArray ]
* Search all the <b>includes</b> ( ASCIIDoc format ) on the code and returns an <b>Array</b>.
* @param {String} TEXT A String with the content of the document.
* @return {Object} Returns an Array of Includes.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TEXT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (TEXT === null) {
    return null;
  }
  if (TEXT === undefined) {
    return null;
  }
  const getNumber = Number.isNaN(parseInt(TEXT, 10));
  if (!getNumber) {
    return null;
  }
  if (Array.isArray(TEXT)) {
    return null;
  }
  if (typeof TEXT === 'object') {
    return null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const regExpIncludes = new RegExp(/include::([a-zA-Z0-9.\-\_\/])*/gim); // eslint-disable-line no-useless-escape
  const arrayOfIncludes = TEXT.match(regExpIncludes);
  if (arrayOfIncludes === null || arrayOfIncludes === undefined) {
    return null;
  }
  return arrayOfIncludes;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
// ============================================================================================= //
