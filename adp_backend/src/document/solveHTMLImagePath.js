// ============================================================================================= //
/**
* [ global.adp.document.solveHTMLImagePath ]
* Convert the <b>relative paths</b> from images to <b>absolute paths</b>.
* @param {String} HTML String with the content of the document.
* @param {String} THELINK String with the URL of the base document.
* @return {String} Returns a String with the HTML with the changes. In case the error, returns null.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
module.exports = async (HTML, THELINK) => {
  const packName = 'global.adp.document.solveHTMLImagePath';
  adp.echoLog(`Solving HTML Image Path for: ${THELINK}`, null, 1, packName);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if ((!HTML) || (typeof HTML !== 'string') || (!THELINK) || (typeof THELINK !== 'string')) {
    const errorCode = 400;
    const errorMessage = 'Parameters HTML and THELINK must be string';
    const errorObject = {
      error: errorMessage,
      parameters: {
        thelink: THELINK,
        html: HTML,
      },
    };
    errorLog(errorCode, errorMessage, errorObject, 'Main Function', packName);
    return null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let theHTML = HTML;
  const regExpJustTheFileParameter = new RegExp(/f=([\S]*)(\.([a-zA-Z0-9])*)/gim);
  const regExpRemoveLastFolder = new RegExp(/(?!(f=))(?!\/)?((?!.*\/)([\s\S])*)/gim);
  let justTheFileParameter = THELINK.match(regExpJustTheFileParameter);
  if (justTheFileParameter !== null && justTheFileParameter !== undefined) {
    justTheFileParameter = justTheFileParameter.toString();
  } else {
    adp.echoLog(`justTheFileParameter is ${justTheFileParameter}, so there is nothing to do here. Returning the original HTML parameter.`, null, 200, packName);
    return HTML;
  }
  const thePathFromTheLink = justTheFileParameter.replace(regExpRemoveLastFolder, '');

  const regExpGetImages = new RegExp(/<img([\s\S]*?)>/gim);
  const regExpGetSource = new RegExp(/(src[ ]?=[ ]?["'`])([\s\S]*?)["'`]/gim);
  const regExpParameterSourceName = new RegExp(/src[ ]?=[ ]?["'`]/gim);
  const regExpGetEndOfString = new RegExp(/["'`]$/gim);
  const regExpGetBackFolders = new RegExp(/(\.\.\/)/gim);
  const regExpGetSameFolder = new RegExp(/(\.\/)/gim);

  const regExpRemoveH = new RegExp(/(h=)([a-zA-Z0-9/])+;?/gim);
  const regExpRemoveHB = new RegExp(/(hb=)([a-zA-Z0-9/])+;?/gim);

  const regExpExceptionNote = new RegExp(/(.)?\/images\/icons\/note.png/gim);
  const regExpExceptionCaution = new RegExp(/(.)?\/images\/icons\/caution.png/gim);
  const regExpExceptionWarning = new RegExp(/(.)?\/images\/icons\/warning.png/gim);

  const imagesArray = HTML.match(regExpGetImages);
  if (imagesArray !== null) {
    adp.echoLog(`imagesArray is ${imagesArray}`, imagesArray, 200, packName);
    await imagesArray.forEach((img) => {
      adp.echoLog(`Solving ${img}`, null, 2, packName);
      const getTheFirstAndProbablyUniqueSource = img.match(regExpGetSource).toString();
      const getOnlyTheText = getTheFirstAndProbablyUniqueSource.replace(regExpParameterSourceName, '').replace(regExpGetEndOfString, '');
      adp.echoLog(`getTheFirstAndProbablyUniqueSource is ${getTheFirstAndProbablyUniqueSource}`, null, 200, packName);
      adp.echoLog(`getOnlyTheText is ${getOnlyTheText}`, null, 200, packName);
      let left = thePathFromTheLink;
      let right = getOnlyTheText;
      if (right.match(regExpExceptionNote)) {
        adp.echoLog(`Replacing ${img} with '<i class="fas fa-info-circle"></i>' class`, null, 200, packName);
        theHTML = theHTML.replace(/<img src="(.)?\/images\/icons\/note.png" alt="Note">/gim, '<i class="fas fa-info-circle"></i>');
      } else if (right.match(regExpExceptionCaution)) {
        adp.echoLog(`Replacing ${img} with '<i class="fas fa-exclamation-circle"></i>' class`, null, 200, packName);
        theHTML = theHTML.replace(/<img src="(.)?\/images\/icons\/caution.png" alt="Caution">/gim, '<i class="fas fa-exclamation-circle"></i>');
      } else if (right.match(regExpExceptionWarning)) {
        adp.echoLog(`Replacing ${img} with '<i class="fas fa-exclamation-triangle"></i>' class`, null, 200, packName);
        theHTML = theHTML.replace(/<img src="(.)?\/images\/icons\/warning.png" alt="Warning">/gim, '<i class="fas fa-exclamation-triangle"></i>');
      } else {
        let backFolders = 0;
        if (right.match(regExpGetBackFolders) > 0) {
          backFolders = right.match(regExpGetBackFolders).length;
        }
        if (backFolders > 0) {
          adp.echoLog(`"backFolders" has found: ${backFolders}`, null, 200, packName);
          right.replace(regExpGetBackFolders, '');
          while (backFolders > 0) {
            left = left.replace(regExpRemoveLastFolder, '');
            backFolders -= 1;
          }
        } else if (right.match(regExpGetSameFolder)) {
          right = right.replace(regExpGetSameFolder, '');
        }
        let theNewLink = THELINK.replace(justTheFileParameter, `${left}${right}`);
        theNewLink = theNewLink.replace(regExpRemoveH, '');
        theNewLink = theNewLink.replace(regExpRemoveHB, '');

        const regExpGetExtension = new RegExp(/([a-zA-Z0-9])+$/gim);
        const extension = getOnlyTheText.match(regExpGetExtension);
        const fileAuxNumber = Math.floor(Math.random() * 99999);
        const fileID = `${global.adp.timeStamp(false)}-${fileAuxNumber}`;
        const imagePath = `${global.adp.config.siteAddress}/images/${fileID}`;
        adp.echoLog(`Changing from "${getOnlyTheText}" to "${imagePath}.${extension}"`, null, 200, packName);
        theHTML = theHTML.replace(getOnlyTheText, `${imagePath}.${extension}`);
        global.adp.document.getImage(theNewLink, fileID, extension)
          .then(async (FILE) => {
            adp.echoLog(`Image "${getOnlyTheText}" from "${theNewLink}" saved as "${FILE}"`, null, 200, packName);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error on trying to get an image.';
            const errorObject = {
              error: ERROR,
              parameters: {
                thelink: THELINK,
                html: HTML,
              },
            };
            errorLog(errorCode, errorMessage, errorObject, 'Main Function', packName);
          });
      }
    });
  } else {
    adp.echoLog('No images detected', null, 200, packName);
  }
  adp.echoLog('Changing all possible Note icons to "<i class="fas fa-info-circle"></i>" class if they exist!', null, 200, packName);
  theHTML = await theHTML.replace(/<img src="(.)?\/images\/icons\/note.png" alt="Note">/gim, '<i class="fas fa-info-circle"></i>');
  adp.echoLog('Changing all possible Caution icons to "<i class="fas fa-exclamation-circle"></i>" class if they exist!', null, 200, packName);
  theHTML = await theHTML.replace(/<img src="(.)?\/images\/icons\/caution.png" alt="Caution">/gim, '<i class="fas fa-exclamation-circle"></i>');
  adp.echoLog('Changing all possible Warning icons to "<i class="fas fa-exclamation-triangle"></i>" class if they exist!', null, 200, packName);
  theHTML = await theHTML.replace(/<img src="(.)?\/images\/icons\/warning.png" alt="Warning">/gim, '<i class="fas fa-exclamation-triangle"></i>');
  adp.echoLog('Delivering theHTML content after checked all possible images', null, 200, packName);
  return theHTML;
};
// ============================================================================================= //
