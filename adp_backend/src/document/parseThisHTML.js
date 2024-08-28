const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.parseThisHTML ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FILENAME, LIBRARY, PATH, DOCLINK) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.document.parseThisHTML';
  // Reading content from file...
  let HTML = null;
  try {
    HTML = global.fs.readFileSync(`${PATH}${FILENAME}`, 'utf-8');
  } catch (ERROR) {
    adp.echoLog('Error on try/catch block', ERROR, 500, packName, true);
    REJECT(ERROR);
    return;
  }

  const regExpDetectXHTML = new RegExp(/(http:\/\/www.w3.org\/1999\/xhtml)|(xml:lang=)|(application\/xhtml\+xml)/gim);
  const XHTMLAttributes = HTML.match(regExpDetectXHTML);

  const regExpRemoveHeader = new RegExp(/<html([\s\S]+?)((<body>)|(<body[\s\S]+?>))/gim);
  const regExpRemoveFinalBody = new RegExp(/<\/body>/gim);
  const regExpRemoveFinalHTML = new RegExp(/<\/html>/gim);

  HTML = HTML.replace(regExpRemoveHeader, '');
  HTML = HTML.replace(regExpRemoveFinalBody, '');
  HTML = HTML.replace(regExpRemoveFinalHTML, '');

  // Convert from XHTML to HTML if necessary
  if (Array.isArray(XHTMLAttributes)) {
    if (XHTMLAttributes.length > 0) {
      const dom = global.parse5.parse(HTML);
      HTML = global.XMLSerializer.serializeToString(dom);
      adp.echoLog('XHTML converted into HTML', null, 200, packName);
    }
  }

  const regExpRemoveHeaderAfter = new RegExp(/<html xmlns="http:\/\/www.w3.org\/1999\/xhtml"><head\/><body>/gim);
  const regExpRemoveFinalBodyAndHTML = new RegExp(/<\/body><\/html>/gim);

  HTML = HTML.replace(regExpRemoveHeaderAfter, '');
  HTML = HTML.replace(regExpRemoveFinalBodyAndHTML, '');

  // Getting the folder to build the URL...
  const regExpFolderName = new RegExp(/[^/]*[/]$/gim);
  const folderNameArray = PATH.match(regExpFolderName);
  let folderName = null;
  if (Array.isArray(folderNameArray)) {
    folderName = folderNameArray[0];
  }
  // Searching for image tags, changing SRC address if image in LIBRARY...
  const regExpFindImageTags = new RegExp(/<img([\w\W]+?)>/gim);
  const images = HTML.match(regExpFindImageTags);
  if (Array.isArray(images)) {
    images.forEach((TAG) => {
      if (Array.isArray(LIBRARY)) {
        if (LIBRARY.length > 0) {
          LIBRARY.forEach((AVAILABLEFILE) => {
            const foundFileInHTML = TAG.match(AVAILABLEFILE, 'gim');
            if (Array.isArray(foundFileInHTML)) {
              const newSRC = `${global.adp.config.siteAddress}/images/${folderName}${AVAILABLEFILE}`;
              const newTag = TAG.replace(new RegExp(AVAILABLEFILE, 'gim'), newSRC);
              HTML = HTML.split(TAG).join(newTag);
            }
          });
        }
      }
    });
  }
  // Searching for internal links tags, changing SRC address if in LIBRARY...
  const regExpFindActionTags = new RegExp(/<a([\w\W]+?)>/gim);
  const regExpGetHREF = new RegExp(/href="[\s\S]+?"/gim);
  const actionTags = HTML.match(regExpFindActionTags);
  if (Array.isArray(actionTags)) {
    actionTags.forEach((TAG) => {
      if (Array.isArray(LIBRARY)) {
        if (LIBRARY.length > 0) {
          LIBRARY.forEach((AVAILABLEFILE) => {
            const foundFileInHTML = TAG.match(AVAILABLEFILE, 'gim');
            if (Array.isArray(foundFileInHTML)) {
              const newActionSRC = `${DOCLINK}/${AVAILABLEFILE}`;
              const newActionTag = TAG.replace(regExpGetHREF, `href="javascript:void(0);" isBackendRequest="${newActionSRC}"`);
              HTML = HTML.replace(TAG, newActionTag);
            }
          });
        }
      }
    });
  }
  // Adding a special CSS class for Anchors IDs...
  const regExpFindAnchorsID = new RegExp(/<a (?!(href=([\w\W]+?)))([\w\W]+?)>/gim);
  const regExpLastGreaterThan = new RegExp(/>$/gim);
  const anchorClass = ' class="anchorClass">';
  const anchorList = HTML.match(regExpFindAnchorsID);
  if (Array.isArray(anchorList)) {
    anchorList.forEach((ANCHOR) => {
      const newTag = ANCHOR.replace(regExpLastGreaterThan, anchorClass);
      HTML = HTML.replace(ANCHOR, newTag);
    });
  }

  // Changing NOTE SPECIAL TEXT by INFO CIRCLE...
  const regExpDetectNotes = new RegExp(/<div([\s]*)class([\s]*)=([\s]*)"([\s]*)title([\s]*)"([\s]*)>([\s]*)(Note)([\s]*)<\/div>/gim);
  const infoCircle = '<i class="fas fa-info-circle"></i>';
  HTML = HTML.replace(regExpDetectNotes, infoCircle);

  // Adding "_blank" to href tags ( avoiding anchores actions )...
  const regExpIsBackend = new RegExp(/<a(?=\s|>)(?!(?:[^>=]|=(['"])(?:(?!\1).)*\1)*?\sisBackendRequest=['"])[^>]*>/gim);
  const regExpFindHyperLinkTags = new RegExp(/<a([\W\w]+?)>/gim);
  const regExpDetectAnchor = new RegExp(/href=([\W\w])#/gim);
  const regExpHaveHREF = new RegExp(/href=/gim);
  const blank = ' target="_blank">';
  const hyperLinks = HTML.match(regExpFindHyperLinkTags);
  if (Array.isArray(hyperLinks)) {
    hyperLinks.forEach((LINK) => {
      const isOurBackend = LINK.match(regExpIsBackend);
      if (isOurBackend !== null) {
        // ------------------------------------------------------------------------------------- //
        // It is not in LIBRARY, should check if is an anchor. If not, add a "_blank"...
        const isAnchorIfArray = LINK.match(regExpDetectAnchor);
        if (!(Array.isArray(isAnchorIfArray))) {
          const haveHREFIfArray = LINK.match(regExpHaveHREF);
          if (Array.isArray(haveHREFIfArray)) {
            const changed = LINK.replace(regExpLastGreaterThan, blank);
            HTML = HTML.replace(LINK, changed);
          }
        }
        // ------------------------------------------------------------------------------------- //
      }
    });
  }
  // ------------------------------------------------------------------------------------------- //
  const saveCallback = (MSG) => {
    adp.echoLog('Error on [ saveCallback ]', MSG, 500, packName, true);
  };
  // ------------------------------------------------------------------------------------------- //
  // If HTML is not null, generate a file with the parsed content...
  if (HTML !== null) {
    global.adp.document.checkThisPath(`${PATH}cache`, 'FULLPATH')
      .then((FOLDERISOK) => {
        const newFile = `${FOLDERISOK}${FILENAME}`;
        global.fs.writeFileSync(newFile, HTML, 'utf8', saveCallback);
        try {
          global.fs.unlinkSync(`${PATH}${FILENAME}`);
          adp.echoLog(`Parsed file "${FILENAME}" saved in "${newFile}"`, null, 200, packName);
        } catch (error) {
          errorLog(
            error.code === 'ENOENT' ? 404 : 500,
            `Failure to unlink file: ${PATH}${FILENAME}`,
            { error, PATH, FILENAME },
            'main',
            packName,
          );
        }
        RESOLVE(HTML);
      })
      .catch((ERROR) => {
        adp.echoLog('Error on [ adp.document.checkThisPath ]', ERROR, 200, packName);
        REJECT(ERROR);
      });
  } else {
    const errorMSG = 'No HTML to save...';
    adp.echoLog('HTML cannot be null', null, 500, packName, true);
    REJECT(errorMSG);
  }
  // ------------------------------------------------------------------------------------------- //
// ============================================================================================= //
});
// ============================================================================================= //
