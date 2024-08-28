// ============================================================================================= //
/**
* [ global.adp.document.solveHTMLImageSizes ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (HTML, THELINK) => {
  const packName = 'global.adp.document.solveHTMLImageSizes';
  adp.echoLog(`Solving HTML Image Sizes for: ${THELINK}`, null, 200, packName);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  if (HTML === null || THELINK === null) {
    adp.echoLog('Parameters HTML and THELINK cannot be null', { link: THELINK }, 400, packName);
    return null;
  }
  if (HTML === undefined || THELINK === undefined) {
    adp.echoLog('Parameters HTML and THELINK cannot be undefined', { link: THELINK }, 400, packName);
    return null;
  }
  const getNumber = Number.isNaN(parseInt(THELINK, 10));
  if (!getNumber) {
    adp.echoLog('Parameter THELINK cannot be number', { link: THELINK }, 400, packName);
    return null;
  }
  if (Array.isArray(HTML) || Array.isArray(THELINK)) {
    adp.echoLog('Parameters HTML and THELINK cannot be Array', { link: THELINK }, 400, packName);
    return null;
  }
  if (typeof HTML === 'object' || typeof THELINK === 'object') {
    adp.echoLog('Parameters HTML and THELINK cannot be Object', { link: THELINK }, 400, packName);
    return null;
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const regExpGetImage = new RegExp(/<img([\s\S]*?)>/gim);
  const regExpGetWidthTag = new RegExp(/(width=")([0-9])+(\S")/gim);
  const regExpGetHeightTag = new RegExp(/(height=")([0-9])+(\S")/gim);
  const regExpOnlyNumbers = new RegExp(/([0-9])+/gim);
  let theHTML = HTML;
  const imagesArray = theHTML.match(regExpGetImage);
  if (imagesArray !== null) {
    imagesArray.forEach((IMAGE) => {
      const haveWidth = IMAGE.match(regExpGetWidthTag);
      const haveHeight = IMAGE.match(regExpGetHeightTag);
      const haveOnlyWidth = (haveWidth !== null) && (haveHeight === null);
      const haveOnlyHeight = (haveWidth === null) && (haveHeight !== null);
      const haveBoth = (haveWidth !== null) && (haveHeight !== null);
      if (haveBoth) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        let getWidth = haveWidth.toString().match(regExpOnlyNumbers);
        if (getWidth > 1100) {
          getWidth = 1100;
        }
        let getHeight = haveHeight.toString().match(regExpOnlyNumbers);
        if (getHeight > 1100) {
          getHeight = 1100;
        }
        const style = ` style="width:${getWidth}px;height:${getHeight}px;" `;
        const newTag = IMAGE.replace(regExpGetWidthTag, style).replace(regExpGetHeightTag, '');
        theHTML = theHTML.replace(IMAGE, newTag);
        adp.echoLog(`CSS Size Adjust for "${IMAGE}"`, { link: THELINK }, 200, packName);
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      } else if (haveOnlyWidth) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        let getWidth = haveWidth.toString().match(regExpOnlyNumbers);
        if (getWidth > 1100) {
          getWidth = 1100;
        }
        const style = ` style="width:${getWidth}px;height:auto;" `;
        const newTag = IMAGE.replace(regExpGetWidthTag, style);
        theHTML = theHTML.replace(IMAGE, newTag);
        adp.echoLog(`CSS Size Adjust (Width) for "${IMAGE}"`, { link: THELINK }, 200, packName);
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      } else if (haveOnlyHeight) {
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        let getHeight = haveHeight.toString().match(regExpOnlyNumbers);
        if (getHeight > 1100) {
          getHeight = 1100;
        }
        const style = ` style="width:auto;height:${getHeight}px;" `;
        const newTag = IMAGE.replace(regExpGetHeightTag, style);
        theHTML = theHTML.replace(IMAGE, newTag);
        adp.echoLog(`CSS Size Adjust (Height) for "${IMAGE}"`, { link: THELINK }, 200, packName);
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      } else {
        adp.echoLog(`No Size Adjust for "${IMAGE}"`, { link: THELINK }, 200, packName);
      }
    });
  }
  return theHTML;
};
// ============================================================================================= //
// ============================================================================================= //
