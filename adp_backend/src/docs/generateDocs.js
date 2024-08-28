// ============================================================================================= //
/**
* [ global.adp.docs.generateDocs ]
* Use the browser call "/doc" route to trigger [ global.adp.docs.generateDocs ],
* which uses [ global.adp.docs.readDoc ] and [ global.adp.docs.generateDocHTML ].
* Using the array [ global.adp.docs.list ], [ global.adp.docs.generateDocs ] will ask
* to [ global.adp.docs.readDoc ] read each Node.js Script File extracting the special
* comments and sending them to [ global.adp.docs.generateDocHTML ] to format its visual.
* Finally, [ global.adp.docs.generateDocs ] get the result, put it on HTML code and
* send to browser.
* @return {promise} Display the HTML code for Documentation Page.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MODE, URL, FILTER) => new Promise((RESOLVE, REJECT) => {
  let mode = MODE;
  if (mode === null || mode === undefined) {
    mode = 'DOC';
  }
  if (mode !== 'REST') {
    mode = 'DOC';
  }
  let useThisList = null;
  let theHTMLTitle = '';
  if (mode === 'REST') {
    useThisList = global.adp.docs.rest;
    theHTMLTitle = 'ADP Portal Backend Application - REST API Documentation';
  } else {
    useThisList = global.adp.docs.list;
    theHTMLTitle = 'ADP Portal Backend Application - NODE.JS Documentation';
    if (FILTER !== null && FILTER !== undefined) {
      if (FILTER.a !== null && FILTER.a !== undefined) {
        if (FILTER.a.toUpperCase() === 'ADP') {
          if (FILTER.p !== null && FILTER.p !== undefined) {
            theHTMLTitle = `${theHTMLTitle} :: Filtering ${FILTER.p.toUpperCase()} Package`;
          }
        }
      }
    }
  }
  if (useThisList === undefined || useThisList === null) {
    const errorMSG = '<b>Nothing to Show!</b>';
    REJECT(errorMSG);
    return;
  }
  if (!Array.isArray(useThisList)) {
    const errorMSG = '<b>Nothing to Show!</b>';
    REJECT(errorMSG);
    return;
  }
  if (useThisList.length === 0) {
    const errorMSG = '<b>Nothing to Show!</b>';
    REJECT(errorMSG);
    return;
  }
  const authorizationFromFilter = (path) => {
    if (FILTER === undefined || FILTER === null) {
      return true;
    }
    if (FILTER.a === null || FILTER.a === undefined) {
      return true;
    }
    if (FILTER.a.toUpperCase() !== 'ADP') {
      return true;
    }
    if (FILTER.p === null || FILTER.p === undefined) {
      return true;
    }
    const regExpGetFullPackage = new RegExp(/(\/adp\/)([\S]+)/gim);
    const packageAndCommand = path.match(regExpGetFullPackage);
    if (Array.isArray(packageAndCommand)) {
      let hasFound = true;
      packageAndCommand.forEach((item) => {
        let str = `/adp/${FILTER.p}/`;
        if (FILTER.s !== null && FILTER.s !== undefined) {
          str = `${str}/${FILTER.s}`;
        }
        if (item.substr(0, str.length) !== str) {
          hasFound = false;
          return false;
        }
        return true;
      });
      return hasFound;
    }
    return true;
  };

  const start = async () => {
    let htmlContent = '';
    await useThisList.forEach(async (pathOfFileToRead) => {
      if (authorizationFromFilter(pathOfFileToRead)) {
        htmlContent += global.adp.docs
          .generateDocHTML(MODE, URL, global.adp.docs.readDoc(pathOfFileToRead));
      }
    });
    const html = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>${theHTMLTitle}</title>
            <style>
                body {
                    margin:0px;
                    padding:0px;
                    font-family:Arial;
                    font-size:14px;
                    background-color: #FFF;
                    color: #000;
                }
                .vBox {
                    padding:10px;
                    padding:10px;
                    background-color: #000;
                    color: #FFF;
                    font-weight: bold;
                }
                .vTable {
                    margin:10px;
                    padding:0px;
                }
                .firstColumn {
                    font-weight: bold;
                }
                .grayDark {
                    background-color: #CFCFCF;
                }
                .grayMedium {
                    background-color: #DFDFDF;
                }
                .grayLight {
                    background-color: #EFEFEF;
                }
            </style>
        </head>
        <body>
            <div class="vBox">${theHTMLTitle}</div>
            <table class="vTable" cellpadding="5">
            ${htmlContent}
            </table>
        </body>
    </html>
`;
    RESOLVE(html);
  };
  start();
});
// ============================================================================================= //
