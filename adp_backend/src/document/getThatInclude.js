// ============================================================================================= //
/**
* [ global.adp.document.getThatInclude ]
* Convert the <b>ASCIIDoc notation</b> for <b>includes</b> to an <b>absolute path</b> and call
* for the content, using <b>[ global.adp.document.getFileFromGerrit ]</b>.
* @param {String} URL A String with the ASCIIDoc URL of the include.
* @param {String} BASEURL A String with the URL of the base document.
* @return {Object} Returns a <b>promise</b>.
* Solved if is possible to retrieve the content of the include. Rejected if found any kind of error.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (URL, BASEURL) => new Promise(async (RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const packName = 'global.adp.document.getThatInclude';
  adp.echoLog(`Checking URL "${URL}" of "${BASEURL}"`, null, 200, packName);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (URL === null || BASEURL === null) {
    adp.echoLog(`Parameters URL (${URL}) and BASEURL (${BASEURL}) cannot be null`, { URL, BASEURL }, 400, packName);
    const error = null;
    REJECT(error);
    return;
  }
  if (URL === undefined || BASEURL === undefined) {
    adp.echoLog(`Parameters URL (${URL}) and BASEURL (${BASEURL}) cannot be undefined`, { URL, BASEURL }, 400, packName);
    const error = null;
    REJECT(error);
    return;
  }
  const urlIsNumber = typeof URL === 'number';
  const baseURLIsNumber = typeof BASEURL === 'number';
  if (urlIsNumber || baseURLIsNumber) {
    adp.echoLog(`Parameters URL (${URL}) and BASEURL (${BASEURL}) cannot be number`, { URL, BASEURL }, 400, packName);
    const error = null;
    REJECT(error);
    return;
  }
  if (Array.isArray(URL) || Array.isArray(BASEURL)) {
    adp.echoLog(`Parameters URL (${URL}) and BASEURL (${BASEURL}) cannot be Array`, { URL, BASEURL }, 400, packName);
    const error = null;
    REJECT(error);
    return;
  }
  if (typeof URL === 'object' || typeof BASEURL === 'object') {
    adp.echoLog(`Parameters URL (${URL}) and BASEURL (${BASEURL}) cannot be Object`, { URL, BASEURL }, 400, packName);
    const error = null;
    REJECT(error);
    return;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const regExpToRemoveWordInclude = new RegExp(/include::/gim);
  const regExpToRemoveEndOfInclude = new RegExp(/\[\]/gim);
  const regExpBackFolders = new RegExp(/(\.\.\/)/gim);
  const regExpReplaceF = new RegExp(/(f=)([\s\S])*;/gim);
  const regExpJustTheFile = new RegExp(/(\/)(?!.*\/)([\s\S])*;/gim);
  const regExpRemoveLastFolder = new RegExp(/(?![f=])(\/)?((?!.*\/)([\s\S])*)/gim);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const onlyTheFile = URL
    .replace(regExpToRemoveWordInclude, '')
    .replace(regExpToRemoveEndOfInclude, '');
  adp.echoLog(`onlyTheFile is "${onlyTheFile}" from "${URL}"`, null, 200, packName);
  const backFoldersArray = onlyTheFile.match(regExpBackFolders);
  if (backFoldersArray !== null && backFoldersArray !== undefined) {
    const quantReturns = backFoldersArray.length;
    adp.echoLog(`"${quantReturns}" BackFolders found in "${onlyTheFile}"`, null, 200, packName);
    const withoutReturns = onlyTheFile.replace(regExpBackFolders, '');
    let newIncludeLink = BASEURL.match(regExpReplaceF).toString();
    newIncludeLink = newIncludeLink.replace(regExpJustTheFile, '');
    for (let counter = 0; counter < quantReturns; counter += 1) {
      newIncludeLink = newIncludeLink.replace(regExpRemoveLastFolder, '');
    }
    if (newIncludeLink === 'f=') {
      newIncludeLink = `${newIncludeLink}${withoutReturns}`;
    } else {
      newIncludeLink = `${newIncludeLink}/${withoutReturns}`;
    }
    newIncludeLink = BASEURL.replace(regExpReplaceF, `${newIncludeLink};`);
    adp.echoLog(`newIncludeLink is "${newIncludeLink}". Calling [ adp.document.getFileFromGerrit ] to finish this task`, null, 200, packName);
    await global.adp.document.getFileFromGerrit(newIncludeLink)
      .then(theReturn => RESOLVE(theReturn))
      .catch(error => REJECT(error));
  } else {
    adp.echoLog(`No backFolders found in "${onlyTheFile}"`, { URL, BASEURL }, 1, packName);
    let fileLink = BASEURL.match(regExpReplaceF).toString();
    fileLink = fileLink.replace(regExpJustTheFile, `/${onlyTheFile};`);
    const includeLink = BASEURL.replace(regExpReplaceF, fileLink);
    adp.echoLog(`includeLink is "${includeLink}". Calling [ adp.document.getFileFromGerrit ] to finish this task`, null, 200, packName);
    await global.adp.document.getFileFromGerrit(includeLink)
      .then(theReturn => RESOLVE(theReturn))
      .catch(error => REJECT(error));
  }
});
// ============================================================================================= //
