// ============================================================================================= //
/**
* [ global.adp.endpoints.document.get ]
* Generate the HTML from document hosted in Gerrit.<br/>
* All behavior was changed. Please wait for the next update. <b>WIP</b>.
* @group Microservice Documentation
* @route GET /document
* @param {string} b64 - The path of document in Base 64.
* @returns 200 - Generated the HTML from document hosted in Gerrit.
* @return 500 - Internal Server Error
* @return 404 - Document not found
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const { customMetrics } = require('../../../metrics/register');
const errorLog = require('./../../../library/errorLog');

/**
 * Determine the last time this asset was synced. Mimer sync
 * stores its completion time on last_sync_date, ARM sync and
 * manual menu changes are stored on the respective menu object
 * @param {object} msObj Asset object
 * @param {string} mode auto | manual
 * @returns {date} The last time the Asset was synced
 */
const calculateLastModified = (msObj, mode) => {
  if (msObj.last_sync_date) {
    return msObj.last_sync_date;
  }
  if (msObj.menu && msObj.menu[mode]) {
    return msObj.menu[mode].date_modified;
  }
  return msObj.date_modified;
};

/**
 * Fetches the document url from either the manual or auto object
 * @param {object} msObj the microservice object to fetch the doc url from
 * @param {string} docSlug the document slug of the document to find the url
 * @param {string} verSlug the version of that the document
 * @returns {object} obj - date found while building the document menu/s
 * @returns {boolean} obj.menuAuto - if the documents are set to auto retrieval
 * @returns {string} obj.menuAutoLastModifiedDate - the last modified date of
 * the auto retrieval menu
 * @returns {string} obj.foundDocUrl - the found document urls, will be blank if no url is found.
 * @returns {string} obj.docTitle - the document title
 * @author Cein
 */
const retrieveDocUrlFromMSObj = async (msObj, slugCategory, docSlug, verSlug) => {
  let eridocExtension = null;
  const lastModified = calculateLastModified(msObj);
  const assetDocModel = new adp.models.AssetDocuments();
  let docObject;
  try {
    docObject = await assetDocModel.getSpecificDocumentBySlug(msObj._id, docSlug, slugCategory, verSlug, 'merged');
  } catch (ERROR) {
    return ERROR;
  }

  if (docObject && docObject.name) {
    const theName = docObject.name;
    const theUrl = docObject
      && docObject.url
      ? docObject.url
      : null;
    eridocExtension = docObject
      && docObject.physical_file_extension
      ? docObject.physical_file_extension
      : null;
    return {
      menuAuto: {},
      menuAutoLastModifiedDate: lastModified,
      menuObject: docObject,
      foundDocUrl: theUrl,
      docTitle: theName,
      eridocExtension,
    };
  }

  const menuAuto = !!msObj.menu_auto;
  const menuAutoKey = (menuAuto ? 'auto' : 'manual');

  let docsArr = [];
  let foundDocUrl = '';
  let repoUrl = '';
  let menuAutoLastModifiedDate = '';
  let docTitle = '';

  if (msObj.menu) {
    if (msObj.menu[menuAutoKey]) {
      const menuAutoObj = msObj.menu[menuAutoKey];
      menuAutoLastModifiedDate = calculateLastModified(msObj, menuAutoKey);
      if (verSlug === 'development' && menuAutoObj.development) {
        docsArr = menuAutoObj.development;
        repoUrl = (menuAuto ? msObj.repo_urls.development : '');
      } else if (menuAutoObj.release && menuAutoObj.release.length > 0) {
        const matchedReleaseObj = menuAutoObj.release.find(
          releaseObj => releaseObj.version === verSlug,
        );
        if (matchedReleaseObj && matchedReleaseObj.documents) {
          repoUrl = (menuAuto ? msObj.repo_urls.release : '');
          docsArr = matchedReleaseObj.documents;
        }
      }
    }
  }

  if (docsArr.length > 0) {
    const matchedDocObj = docsArr.find(docObj => (docObj.slug && docSlug === docObj.slug));

    if (matchedDocObj) {
      docTitle = matchedDocObj.name;

      if (matchedDocObj.external_link) {
        foundDocUrl = matchedDocObj.external_link;
      }
      if (repoUrl && matchedDocObj.filepath) {
        const repopath = repoUrl.replace(/\/$/, '');
        const filepath = matchedDocObj.filepath.replace(/^\//, '');
        foundDocUrl = `${repopath}/${filepath}`;
      }
    }
  }
  return {
    menuAuto,
    menuAutoLastModifiedDate,
    foundDocUrl,
    docTitle,
    eridocExtension,
  };
};

/**
 * _elasticSyncAfterDocumentFetch [ private ]
 * Does the elastic search Database sync of the document
 * after the document is fetched
 * @param {String} msSlug The slug of the Microservice.
 * @param {Array} msID Array of Microservice IDs.
 * @param {String} versionName The version name of the document to be retrieved.
 * @param {String} docSlug The slug of the document to be retrieved.
 * @returns a link which shows the status of the queue
 * @author Githu Jeeva Savy[ zjeegit ]
 */
const _elasticSyncAfterDocumentFetch = async (msSlug, msID, versionName, docSlug) => {
  try {
    const uniqueStringForObjective = `${msSlug}__${(new Date()).getTime()}`;
    const objectiveForDocSync = `documentSync_${uniqueStringForObjective}`;
    const mission = 'microserviceDocumentsElasticSyncLoad';
    // Mission value 'microserviceDocumentsElasticSyncLoad' indicates
    // that elastic sync triggered while opening a document.
    const singleJob = await adp.queue.addJob(
      mission,
      msID,
      'adp.microservice.synchronizeDocumentsWithElasticSearch.add',
      [[msID], versionName, docSlug, objectiveForDocSync, 'ALL', 'syncIntegration', mission, 'microservice'],
      objectiveForDocSync,
      0,
      0,
    );
    return (await adp.queue.obtainObjectiveLink(singleJob.queue, true));
  } catch (ERROR) {
    return errorLog(
      ERROR && ERROR.code ? ERROR.code : 500,
      ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
      { id: msID, error: ERROR },
      'main',
      'global.adp.endpoints.document.get',
    );
  }
};
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.document.get';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const dbModel = new adp.models.Adp();
  let documentTitle = '';
  let documentCategoryTitle = '';
  let eridocMimerExtension = null;

  if (REQ === null || REQ === undefined) {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Requisition Object is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return;
  }

  if (REQ.params === null || REQ.params === undefined || REQ.params === '') {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Parameters of Requisition Object are NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return;
  }

  if (REQ.params.msSlug === null || REQ.params.msSlug === undefined || REQ.params.msSlug === '') {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Parameter is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return;
  }

  let subSlug = null;
  if (REQ.params.sub !== null && REQ.params.sub !== undefined && REQ.params.sub !== '') {
    subSlug = REQ.params.sub;
  }

  let msID = null;
  let msSlug = null;
  let documentLinkBuffer = null;
  let assetMenuAuto = false;
  let menuLastModifiedDate = '';
  let fullMenuObject = null;
  let msObj = null;

  msSlug = await REQ.params.msSlug;
  const docVersion = REQ.params.ver;

  const slugCategory = REQ
    && REQ.params
    && REQ.params.cat
    ? REQ.params.cat
    : null;

  // ----------------------------------------------------------------------------------------- //
  documentLinkBuffer = null;
  await dbModel.getByMSSlug(msSlug)
    .then(async (ANSWER) => {
      if (Array.isArray(ANSWER.docs)) {
        // eslint-disable-next-line prefer-destructuring
        msObj = ANSWER.docs[0];
        // eslint-disable-next-line no-underscore-dangle
        msID = msObj._id;
        const docFetchObj = await retrieveDocUrlFromMSObj(
          msObj,
          slugCategory,
          REQ.params.doc,
          REQ.params.ver,
        );
        fullMenuObject = docFetchObj
          && docFetchObj.menuObject
          ? docFetchObj.menuObject
          : null;
        assetMenuAuto = docFetchObj.menuAuto;
        menuLastModifiedDate = docFetchObj.menuAutoLastModifiedDate;
        documentTitle = docFetchObj.docTitle;
        eridocMimerExtension = docFetchObj.eridocExtension;
        if (docFetchObj && docFetchObj.foundDocUrl && (`${docFetchObj.foundDocUrl.trim()}` !== '')) {
          documentLinkBuffer = docFetchObj.foundDocUrl;
        }
      }
    });

  const msg = {};
  msg.menuLastModifiedDate = menuLastModifiedDate;
  await answer.setData(msg);

  if (fullMenuObject && fullMenuObject.category_name) {
    documentCategoryTitle = fullMenuObject.category_name;
  } else {
    await global.adp.documentCategory.fetchAutoDocCategoryBySlug(slugCategory).then(
      (categoryObj) => {
        if (categoryObj !== null && categoryObj.name) {
          documentCategoryTitle = categoryObj.name;
        }
      },
    ).catch((catFetchError) => {
      const errorText = 'Error in [ adp.documentCategory.fetchAutoDocCategoryBySlug ]';
      const errorOBJ = {
        parameter: slugCategory,
        error: catFetchError,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
  }

  let linkOfDocumentToRetrieve;
  if (fullMenuObject && fullMenuObject.url) {
    linkOfDocumentToRetrieve = fullMenuObject.url;
  } else {
    linkOfDocumentToRetrieve = documentLinkBuffer;
  }

  if (linkOfDocumentToRetrieve === null || linkOfDocumentToRetrieve === undefined) {
    let errorStr = 'Document not found by the given parameters.';
    if (assetMenuAuto) {
      errorStr = `Documents retrieval set to automatic, ${errorStr}`;
    }
    answer.setCode(400);
    answer.setMessage(`400 Bad Request - ${errorStr}`);
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return;
  }
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX //
  const cacheObject = 'DOCUMENTS';
  const cacheSubObjectID = msID;
  const cacheObjectID = `${linkOfDocumentToRetrieve}`;
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.documents * 1000;
  // - - - - - - - - - - - - - - - - - - - - - //
  const getFileName = (STR) => {
    const pathArray = STR.split('/');
    const pathLength = pathArray.length;
    return pathArray[pathLength - 1];
  };
  // - - - - - - - - - - - - - - - - - - - - - //
  await global.adp.masterCache.get(
    cacheObject,
    cacheSubObjectID,
    cacheObjectID,
    true,
  )
    .then((CACHE) => {
      res.statusCode = CACHE.getServerStatus();
      const contentType = CACHE.getContentType();
      res.setHeader('Content-Type', contentType);
      if (contentType === 'application/json') {
        res.end(CACHE.getData());
        const endTimer = (new Date()).getTime() - timer;
        adp.echoLog(`Answer in ${endTimer}ms - from cache`, null, 200, packName);
      } else {
        const cachedObject = CACHE.getData();
        res.setHeader('fileName', getFileName(cachedObject.internal));
        res.download(cachedObject);
        const endTimer = (new Date()).getTime() - timer;
        adp.echoLog(`Download in ${endTimer}ms - from cache`, null, 200, packName);
      }
      customMetrics.documentationRespMonitoringHistogram.observe(new Date() - timer);
      customMetrics.docCacheHitMonitoringHistogram.observe(new Date() - timer);
    })
    .catch(async () => {
      await global.adp.document.getDocuments(
        linkOfDocumentToRetrieve,
        subSlug,
        documentTitle,
        documentCategoryTitle,
        true,
        eridocMimerExtension,
      )
        .then((OBJ) => {
          customMetrics.documentationRespMonitoringHistogram.observe(new Date() - timer);
          // ---------------------------------------------------------------------------------- //
          if (OBJ.download === undefined) {
            // --------------------------------------------------------------------------------- //
            const theDocument = OBJ;
            if (theDocument.ok !== null || theDocument.ok !== undefined) {
              const timerEnd = new Date();
              const timeMS = timerEnd.getTime() - timer.getTime();
              if (timeMS >= 0) {
                theDocument.time = `${timeMS} ms`;
              } else {
                theDocument.time = '0 ms';
              }
            }
            if (theDocument.ok === true) {
              answer.setCode(200);
              res.statusCode = 200;
              answer.setMessage('200 OK');
            } else {
              answer.setCode(400);
              res.statusCode = 400;
              answer.setMessage('400 Bad Request');
            }
            answer.setTime(theDocument.time);
            answer.setSize(theDocument.size);
            if (theDocument.fromcache) {
              answer.setCache(`${theDocument.fromcache}`);
            }
            if (Array.isArray(theDocument.warnings)) {
              answer.setWarning(theDocument.warnings);
            }
            theDocument.msg.menuLastModifiedDate = menuLastModifiedDate;

            if (theDocument && theDocument.msg && theDocument.msg.body) {
              const instrument = new adp.comments.InstrumentClass();
              theDocument.msg.location_id = instrument.getLocationIDMS(
                msID,
                theDocument.msg.category,
                docVersion,
                theDocument.msg.title,
              );
              theDocument.msg.body = instrument.remove(theDocument.msg.body);
              theDocument.msg.body = instrument.apply(theDocument.msg.body);
            }

            answer.setData(theDocument.msg);
            return _elasticSyncAfterDocumentFetch(msSlug, msID, REQ.params.ver, REQ.params.doc)
              .then((queueStatus) => {
                answer.setQueueLink(queueStatus);
                const toSend = answer.getAnswer();
                global.adp.masterCache.set(cacheObject, cacheSubObjectID, cacheObjectID, toSend, cacheHolderInMilliseconds, answer.getCode(), 'application/json');
                res.end(toSend);
                if (theDocument.fromcache) {
                  customMetrics.docCacheHitMonitoringHistogram.observe(new Date() - timer);
                  adp.echoLog(`/document finished in ${theDocument.time}ms from cache`, { link: linkOfDocumentToRetrieve }, 200, packName);
                } else {
                  adp.echoLog(`/document finished in ${theDocument.time}ms from remote`, { link: linkOfDocumentToRetrieve }, 200, packName);
                }
                return '';
              })
              .catch((ERROR) => {
                errorLog(
                  ERROR && ERROR.code ? ERROR.code : 500,
                  ERROR && ERROR.message ? ERROR.message : 'Unable to add Queue Link to the response',
                  { error: ERROR },
                  'main',
                  'global.adp.endpoints.document.get',
                );
              });
            // --------------------------------------------------------------------------------- //
          }
          // ----------------------------------------------------------------------------------- //
          if (OBJ.status !== undefined && OBJ.msg !== undefined) {
            res.statusCode = OBJ.status;
            const menuData = { menuLastModifiedDate };
            const toSend = JSON.stringify({ code: OBJ.status, msg: OBJ.msg, data: menuData });
            global.adp.masterCache.set(cacheObject, cacheSubObjectID, cacheObjectID, toSend, cacheHolderInMilliseconds, res.statusCode, 'application/json');
            res.end(toSend);
            const endTimer = (new Date()).getTime() - timer.getTime();
            const errorText = `Error: /document failed to download in ${endTimer}ms`;
            const errorOBJ = {
              status: OBJ.status,
              msg: OBJ.msg,
              link: linkOfDocumentToRetrieve,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
          } else {
            let mime = global.mime.lookup(OBJ.internal);
            if (mime === 'application/json') {
              mime = 'text/plain';
              res.setHeader('Content-type', 'text/plain');
              res.setHeader('fileName', getFileName(OBJ.internal));
            } else {
              res.setHeader('Content-type', `${mime}`);
              res.setHeader('fileName', getFileName(OBJ.internal));
            }
            const toSend = OBJ.internal;
            global.adp.masterCache.set(
              cacheObject,
              cacheSubObjectID,
              cacheObjectID,
              toSend,
              cacheHolderInMilliseconds,
              200,
              mime,
            );
            res.download(toSend);
            const endTimer = (new Date()).getTime() - timer.getTime();
            if (OBJ.fromcache) {
              customMetrics.docCacheHitMonitoringHistogram.observe(new Date() - timer);
              adp.echoLog(`/document to download finished in ${endTimer}ms from cache`, { link: linkOfDocumentToRetrieve }, 200, packName);
            } else {
              adp.echoLog(`/document to download finished in ${endTimer}ms from remote`, { link: linkOfDocumentToRetrieve }, 200, packName);
            }
          }
          return '';
          // ----------------------------------------------------------------------------------- //
        })
        .catch((ERROR) => {
          customMetrics.documentationRespMonitoringHistogram.observe(new Date() - timer);
          customMetrics.externalErrorCounter.inc();
          if (ERROR) {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error occured while reading the document';
            answer.setCode(errorCode);
            answer.setMessage(errorMessage);
            const errorObject = {
              error: ERROR,
              link: linkOfDocumentToRetrieve,
              subSlug,
              documentTitle,
              documentCategoryTitle,
            };
            errorLog(errorCode, errorMessage, errorObject, 'main', packName);
          } else {
            answer.setCode(500);
            answer.setMessage('Internal Server Error');
          }
          const timerEnd = new Date() - timer;
          answer.setTime(timerEnd);
          res.statusCode = ERROR && ERROR.code ? ERROR.code : 500;
          const toSend = answer.getAnswer();
          global.adp.masterCache.set(cacheObject, cacheSubObjectID, cacheObjectID, toSend, cacheHolderInMilliseconds, answer.getCode(), 'application/json');
          res.end(toSend);
          return '';
        });
      // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX //
    });
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX //
};
