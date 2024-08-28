const errorLog = require('../library/errorLog');

// ============================================================================================= //
/**
* [ global.adp.document.getDocument ]
* Get a document from external link, if the target is a valid source.<br/>
* @param {String} LINK A String with the URL of the document.
* The <b>basic validation</b> of <b>LINK</b> is done here. The
* <b>[ global.adp.document.checkLink ]</b> is responsible for the <b>advanced validation</b>.
* @param {String} SUBFILE A String with the subfile name of the document.
* @param {String} documentTitle The friendly name of the document. Default is an empty string.
* @param {String} documentCat The friendly name of the category. Default is an empty string.
* @param {Boolean} retrieveImages If the images should be served or not. Default is true.
* @param {String} eridocMimerExtension The extension of the file, case the LINK doesn't have
* the file extension. Default is null.
* @return {Object} Returns an <b>Object</b> with the result.
* In case of <b>success</b>, this <b>Object</b> has:<br/><br/>
* - <b>ok</b> as boolean to indicate <b>success</b> (true) or <b>error</b> (false),<br/>
* - <b>time</b> as string with how many time the request took.<br/>
* - <b>size</b> as string with the size of the request. <br/>
* - <b>fromCache</b> as boolean about if the request comes from <b>cache</b> (true)
* or if comes from a <b>direct request</b> (false).<br/>
* - <b>msg</b> as array with the HTML of the document.<br/><br/>
* Example of success:
* <PRE>
* {
* &nbsp;&nbsp;ok: true,
* &nbsp;&nbsp;time: "695ms",
* &nbsp;&nbsp;size: "65.85 Kbytes",
* &nbsp;&nbsp;fromcache: false,
* &nbsp;&nbsp;msg: [
* &nbsp;&nbsp;&nbsp;&nbsp;"HUGE HTML CODE WITH THE DOCUMENT CONTENT"
* &nbsp;&nbsp;]
* }
* </PRE>
* Example of error, sending "<b>https://gerrit-gamma.gic.ericsson.se/gitweb?hb=705b</b>" as parameter:
* <PRE>
* {
* &nbsp;&nbsp;ok: false,
* &nbsp;&nbsp;mode: 0,
* &nbsp;&nbsp;msg: [
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ] LINK ( Remote origin of the document )
* for Gerrit have to has a Project Parameter (p=...)",
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ] LINK ( Remote origin of the document )
* for Gerrit have to has a Blob Parameter (a=...)",
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ] LINK ( Remote origin of the document )
* for Gerrit have to has a File Parameter (f=...)",
* &nbsp;&nbsp;&nbsp;&nbsp;"[ global.adp.document.checkLink ] The LINK looks valid
* to https://gerrit-gamma.gic.ericsson.se/gitweb"
* &nbsp;&nbsp;]
* &nbsp;&nbsp;time:"1ms"
* }
* </PRE>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const { customMetrics } = require('../metrics/register');

const packName = 'global.adp.document.getDocument';

/**
 * Clears document image cache
 * @author Armando Schiavon Dias [escharm]
 */
const clearImageCache = () => {
  global.adp.document.clearImage()
    .catch(() => {
      // Impossible to clear old images, but this is not a problem...
    });
};

/**
 * Checks if a document is in cache, if it is in the cache the full document response is returned
 * Prepares the given link for processing
 * @param {string} LINK the document link need for retrieval
 * @returns {object} obj.docResp {object} cache information object
 * obj.docResp {object} the cached document response
 * obj.preparedLink {string} the prepared document link
 * @author Armando Schiavon Dias [escharm]
 */
const fetchDocumentFromCache = (LINK) => {
  const returnObj = {
    isCached: {},
    docResp: {},
    preparedLink: LINK,
  };

  const regExpDoNotChangeIfFoundThisBlobPlain = new RegExp(/(a=blob_plain)/gim);
  const regExpChangeSource = new RegExp(/(a=blob)/gim);

  if (!(returnObj.preparedLink.match(regExpDoNotChangeIfFoundThisBlobPlain))) {
    returnObj.preparedLink = returnObj.preparedLink.replace(regExpChangeSource, 'a=blob_plain');
  }

  returnObj.isCached = global.adp.cache.get(global.adp.cache.document, returnObj.preparedLink);

  if (returnObj.isCached.ok) {
    const cachedHTML = returnObj.isCached.data.data.body;
    const cachedTitle = returnObj.isCached.data.data.title;
    const cachedCategory = returnObj.isCached.data.data.category;
    const fullCacheSize = global.adp.getSizeInMemory(global.adp.cache.document, true);
    const cacheSize = global.adp.getSizeInMemory(cachedHTML, true);
    returnObj.docResp = {
      ok: true,
      time: '-1ms',
      size: cacheSize,
      fromcache: true,
      msg: { title: cachedTitle, category: cachedCategory, body: cachedHTML },
    };
    adp.echoLog(`Delivering document ( ${cacheSize} ) from cache. [ adp.cache.document ] Total cache size is ${fullCacheSize}!`, null, 200, packName);
  }
  return returnObj;
};

/**
 * Builds the full link with correct slugs which is need to fetch artifactory documents
 * @param {string} LINK the document link
 * @param {string} category the document category
 * @param {string} title the document title
 * @param {array} dbDocs the document list from the db
 * @param {string} fullSlugLink the document link in slug form
 * @returns {object} obj.docFullSlugLink {string} updated document link in slug form
 * obj.docCategory {string} the updated document category
 * obj.docTitle {string} the updated document title
 * @author Armando Schiavon Dias [escharm]
 */
const buildArtifactorySlugPath = (LINK, category, title, dbDocs, fullSlugLink) => {
  let docCategory = category;
  let docTitle = title;
  let docFullSlugLink = fullSlugLink;

  if (typeof docCategory === 'string' && docCategory.trim() === '') {
    docCategory = 'Category not in Database';
  }
  if (typeof docTitle === 'string' && docTitle.trim() === '') {
    docTitle = 'Document not in Database';
  }

  if (dbDocs.length > 0) {
    const { documentation, slug: assetSlug } = dbDocs[0];
    const activeDocument = documentation.filter((DOC) => {
      if (DOC.url === LINK) {
        return true;
      }
      return false;
    });
    if (activeDocument.length > 0) {
      const theDoc = activeDocument[0];
      const listOptions = JSON.parse(global.adp.listOptions.cache.options);
      const categoryOptions = listOptions.filter(ITEM => ITEM.id === 7)[0];
      const titleOptions = listOptions.filter(ITEM => ITEM.id === 8)[0];

      const pickCategory = categoryOptions.items.filter(ITEM => ITEM.id === theDoc.categoryId)[0];
      const pickTitle = titleOptions.items.filter(ITEM => ITEM.id === theDoc.titleId)[0];

      docCategory = pickCategory.name;
      docTitle = pickTitle.name;

      if (Math.abs(theDoc.titleId) === 11) {
        if (theDoc.title !== undefined && theDoc.title !== null) {
          if (theDoc.title.trim().length > 0) {
            docTitle = theDoc.title.trim();
          }
        }
      }

      docFullSlugLink = `${global.adp.config.siteAddress}/document/${assetSlug}`;
      if (theDoc.slug !== undefined && theDoc.slug !== null) {
        const docSlugArray = theDoc.slug.split('/');
        docFullSlugLink = `${docFullSlugLink}/${docSlugArray[0]}/${docSlugArray[1]}`;
      }
    }
  }

  return { docCategory, docTitle, docFullSlugLink };
};

module.exports = (
  LINK,
  SUBFILE,
  documentTitle = '',
  documentCat = '',
  retrieveImages = true,
  eridocMimerExtension = null,
) => new Promise((RESOLVE, REJECT) => {
  let docTitle = documentTitle;
  let docCategory = documentCat;
  let docFullSlugLink = '';

  adp.echoLog(`Getting document from LINK "${LINK}"`, null, 200, packName);
  clearImageCache();
  if (typeof LINK !== 'string') {
    const linkType = typeof LINK;
    const incorrectType = (linkType === 'object' && linkType === null ? 'null' : linkType);
    const errMsg = `Parameter LINK "${LINK}" cannot be ${incorrectType}`;
    errorLog(
      400,
      errMsg,
      { error: errMsg, linkType, LINK },
      'getDocument',
      packName,
    );
    const error = null;
    REJECT(error);
    return;
  }
  adp.echoLog(`Checking if [ ${LINK} ] is valid.`, null, 200, packName);
  const checking = global.adp.document.checkLink(LINK);
  if (!(checking.ok)) {
    RESOLVE(checking);
    return;
  }

  const convertParam = { safe: 'server', attributes: { showtitle: false, icons: 'fonts' } };
  const { isCached, docResp, preparedLink: theLink } = fetchDocumentFromCache(LINK);
  if (isCached.ok) {
    RESOLVE(docResp);
    return; // Extremely necessary.
  }

  /**
   * Fetches the document from gerrit
   * @author Armando Schiavon Dias [escharm]
   */
  const readFromGerritPlugIns = () => {
    global.adp.document.getFileFromGerrit(LINK).then((content) => {
      const cacheSize = global.adp.getSizeInMemory(content, false);
      const toReturn = {
        ok: true,
        time: '-1ms',
        size: cacheSize,
        fromcache: false,
        msg: [content],
      };
      RESOLVE(toReturn);
    }).catch((errorRetrievingFile) => {
      REJECT(errorRetrievingFile);
    });
  };

  /**
   * Fetches the file from artifactory
   * @param {string} DOCFULLSLUGLINK slug prepared document url for artifactory retrieval
   * @param {string} ERIDOCMIMEREXTENSION the file extension.
   * @author Armando Schiavon Dias [escharm]
   */
  const readFromArtifactory = (DOCFULLSLUGLINK, ERIDOCMIMEREXTENSION) => {
    global.adp.document.getFileFromArtifactory(
      theLink,
      DOCFULLSLUGLINK,
      SUBFILE,
      ERIDOCMIMEREXTENSION,
    )
      .then((CONTENT) => {
        if (CONTENT.download === undefined) {
          const cacheSize = global.adp.getSizeInMemory(CONTENT.html, true);
          const toReturn = {
            ok: true,
            time: '-1ms',
            size: cacheSize,
            fromcache: CONTENT.fromcache,
            msg: { title: docTitle, category: docCategory, body: CONTENT.html },
          };
          if (toReturn.msg.body !== undefined) {
            RESOLVE(toReturn);
          } else {
            const errMsg = 'Error reading file/zip from artifactory';
            REJECT(errorLog(
              404,
              errMsg,
              { error: errMsg, link: theLink },
              'getFileFromGerrit',
              packName,
            ));
          }
        } else {
          RESOLVE(CONTENT);
        }
      })
      .catch((ERROR) => {
        REJECT(errorLog(
          500,
          'Error reading file/zip from artifactory',
          { error: ERROR, DOCFULLSLUGLINK },
          'readFromArtifactory',
          packName,
        ));
      });
  };

  /**
   * Fetches the file from gerrit and uses the asciidoctor service to translate ascii to html
   * @author Armando Schiavon Dias [escharm]
   */
  const readFromGerritGitWeb = async () => {
    const asciidoc = new adp.asciidoctorService.AsciidoctorController();
    const startTime = new Date();
    const includesContent = [];
    let gerritResult = null;
    let includesArray = null;
    let persistString = '';

    await global.adp.document.getFileFromGerrit(theLink)
      .then((OBJ) => {
        customMetrics.gerritRespMonitoringHistogram.observe(new Date() - startTime);
        persistString = OBJ;
      })
      .catch((ERROR) => {
        customMetrics.gerritRespMonitoringHistogram.observe(new Date() - startTime);
        gerritResult = ERROR;
      });
    if (persistString.length === 0 && gerritResult !== null) {
      let msg = `[ global.adp.document.getDocument ] Error :: Document String from "${theLink}" is Empty.`;
      if (gerritResult.msg !== null && gerritResult.msg !== undefined) {
        msg = `${gerritResult.msg}.`;
      }
      REJECT(errorLog(
        500,
        msg,
        { error: gerritResult, gerritResponseCode: gerritResult.code, link: theLink },
        'readFromGerritGitWeb',
        packName,
      ));
      return gerritResult;
    }

    includesArray = await global.adp.document.getIncludesArray(persistString);
    if (includesArray === null) {
      let html = persistString;
      let asciidoctorMessages = [];
      html = await asciidoc.asciiToHtml(html, convertParam).then((asciiResp) => {
        asciidoctorMessages = asciiResp.logs || [];
        return asciiResp.html || null;
      }).catch(() => null);

      if (html === null) {
        const error = { msg: 'Failure to convert ascii to html.', code: 500, data: { html, convertParam, asciidoctorMessages } };
        REJECT(error);
        return error;
      }

      if (retrieveImages) {
        html = await global.adp.document.solveHTMLImagePath(html, theLink);
        html = await global.adp.document.solveHTMLImageSizes(html, theLink);
      }
      html = await global.adp.document.solveHTMLExternalLink(html);

      const objToReturn = {
        ok: true,
        time: '-1ms',
        size: global.adp.getSizeInMemory(html, false),
        fromcache: false,
        warnings: asciidoctorMessages,
        msg: { title: docTitle, category: docCategory, body: html },
      };
      global.adp.cache.set(global.adp.cache.document, theLink, objToReturn.msg);
      const fullCacheSize = global.adp.getSizeInMemory(global.adp.cache.document, true);
      const cacheSize = global.adp.getSizeInMemory(html, true);
      adp.echoLog(`Delivering document ( ${cacheSize} ) from cache. [ adp.cache.document ] Total cache size is ${fullCacheSize}!`, null, 200, packName);
      RESOLVE(objToReturn);
      return null;
    }
    /* eslint-disable no-await-in-loop */
    const getADOCException = new RegExp(/\.[adoc]+$/gim);
    while (includesArray.length > 0) {
      const include = includesArray.pop();
      let includeContent = '';
      await global.adp.document.getThatInclude(include, theLink)
        .then((content) => {
          includeContent = content;
        })
        .catch((error) => {
          errorLog(
            error.code || 500,
            error.desc || 'Failure to fetch the included gerrit document.',
            { error, include, theLink },
            'readFromGerritGitWeb',
            packName,
          );
        });
      if (includeContent !== '') {
        const isLink = await global.adp.document.isJustALink(includeContent);
        if (isLink === null) {
          const includeNumber = Math.floor(Math.random() * 99999);
          const includeID = `||||||${global.adp.timeStamp(false)}|||${includeNumber}||||||`;
          if (include.match(getADOCException) !== null) {
            includeContent = `${includeContent}`;
          }
          includesContent.push({ id: includeID, content: includeContent });
          persistString = persistString.replace(include, includeID);
        } else {
          const newLink = `include::${includeContent}[]`;
          persistString = persistString.replace(include, newLink);
          includesArray.push(newLink);
        }
      }
    }
    /* eslint-enable no-await-in-loop */
    let html = persistString;
    while (includesContent.length > 0) {
      const changeFor = includesContent.pop();
      if (changeFor.content.length > 99) {
        let sample = changeFor.content.substr(0, 100);
        sample = sample.replace(/(?:\r\n|\r|\n)/gim, '');
      } else {
        let sample = changeFor.content;
        sample = sample.replace(/(?:\r\n|\r|\n)/gim, '');
      }
      html = html.replace(changeFor.id, changeFor.content);
    }

    let asciidoctorMessages = [];
    html = await asciidoc.asciiToHtml(html, convertParam).then((asciiResp) => {
      asciidoctorMessages = asciiResp.logs || [];
      return asciiResp.html || null;
    }).catch(() => null);

    if (html === null) {
      const error = { msg: 'Failure to convert ascii to html.', code: 500, data: { html, convertParam, asciidoctorMessages } };
      REJECT(error);
      return error;
    }

    if (retrieveImages) {
      html = await global.adp.document.solveHTMLImagePath(html, theLink);
      html = await global.adp.document.solveHTMLImageSizes(html, theLink);
    }
    html = await global.adp.document.solveHTMLExternalLink(html);

    const temporarySolutionToRemoveExceedBrackets = new RegExp(/\[\]<\/p/gim);
    html = html.replace(temporarySolutionToRemoveExceedBrackets, '</p');
    const objToReturn = {
      ok: true,
      time: '-1ms',
      size: global.adp.getSizeInMemory(html, false),
      fromcache: false,
      warnings: asciidoctorMessages,
      msg: { title: docTitle, category: docCategory, body: html },
    };
    global.adp.cache.set(global.adp.cache.document, theLink, objToReturn.msg);
    const fullCacheSize = global.adp.getSizeInMemory(global.adp.cache.document, true);
    const cacheSize = global.adp.getSizeInMemory(html, true);
    const msg = `Adding document ( ${cacheSize} ) to cache. [ adp.cache.document ] Total cache size is ${fullCacheSize}!`;
    adp.echoLog(msg, null, 200, packName);
    RESOLVE(objToReturn);
    return objToReturn;
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const adpModel = new global.adp.models.Adp();
  adpModel.getMsByDocumentUrl(LINK)
    .then((RESP) => {
      if (Array.isArray(RESP.docs)) {
        const {
          docFullSlugLink: fullSlugLink, docCategory: category, docTitle: title,
        } = buildArtifactorySlugPath(
          LINK, docCategory, docTitle, RESP.docs, docFullSlugLink,
        );

        docFullSlugLink = fullSlugLink;
        docCategory = category;
        docTitle = title;

        switch (checking.mode) {
          case 1:
            readFromGerritPlugIns();
            break;
          case 2:
            readFromArtifactory(docFullSlugLink, eridocMimerExtension);
            break;
          case 3:
            readFromArtifactory(LINK, eridocMimerExtension);
            break;
          default:
            readFromGerritGitWeb();
            break;
        }
      }
    })
    .catch((ERROR) => {
      REJECT(errorLog(
        ERROR.code || 500,
        ERROR.desc || 'Error retrieving a microservice by document url.',
        { error: ERROR, LINK },
        'getDocument',
        packName,
      ));
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
