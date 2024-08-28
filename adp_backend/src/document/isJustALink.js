// ============================================================================================= //
/**
* [ global.adp.document.isJustALink ]
* Analyse if the content is just a link - and nothing else.
* @param {String} TEXT Content of the file/document.
* @return {String} If <b>true</b>, returns the <b>TEXT</b>. If <b>false</b>, returns <b>null</b>.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (TEXT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (TEXT === null || TEXT === undefined) {
    return null;
  }
  if (typeof TEXT !== 'string' && !(TEXT instanceof String)) {
    return null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const regExpIsolatedLinks = new RegExp(/(\.\.\/)+?([\S]*\/)+?([\S]*)+?/gim);
  const getALinkIfPossible = TEXT.match(regExpIsolatedLinks);
  if (Array.isArray(getALinkIfPossible)) {
    if (TEXT === getALinkIfPossible.toString()) {
      return TEXT;
    }
  }
  return null;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
// ============================================================================================= //
