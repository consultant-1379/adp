// ============================================================================================= //
/**
* [ global.adp.document.solveHTMLExternalLink ]
* Just adds ' <b>target="_blank"</b> ' in all <b>a</b> tags, except <b>anchors</b>.
* @param {String} HTML String with the content of the document.
* @return {String} Returns a String with the result of the changes.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (HTML) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (HTML === null) {
    return null;
  }
  if (HTML === undefined) {
    return null;
  }
  const getNumber = Number.isNaN(parseInt(HTML, 10));
  if (!getNumber) {
    return null;
  }
  if (Array.isArray(HTML)) {
    return null;
  }
  if (typeof HTML === 'object') {
    return null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let theHTML = HTML;
  const regExpGetAllActionTags = new RegExp(/<a([\s\S]*?)>/gim);
  const allActionTags = theHTML.match(regExpGetAllActionTags);
  if (allActionTags === null || allActionTags === undefined) {
    return theHTML;
  }
  const regExpGetOnlyHRef = new RegExp(/href=(["'`])([\S]*)(["'`])/gim);
  const regExpGetTheAnchors = new RegExp(/(["'`])#([\S]*)(["'`])/gim);
  allActionTags.forEach((tag) => {
    const theHRef = tag.match(regExpGetOnlyHRef);
    if (theHRef === null || theHRef === undefined) {
      return null;
    }
    const isItAnAnchor = theHRef.toString().match(regExpGetTheAnchors);
    if (isItAnAnchor !== null && isItAnAnchor !== undefined) {
      return null;
    }
    const changeFor = `${theHRef} target="_blank"`;
    theHTML = theHTML.replace(theHRef, changeFor);
    return null;
  });
  return theHTML;
};
// ============================================================================================= //
// ============================================================================================= //
