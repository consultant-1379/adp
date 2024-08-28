// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.microservice.synchronizeDocumentsWithElasticSearch';
// ============================================================================================= //
const pviConstant = require('./../library/utils/constants').PVI;
// ============================================================================================= //

/**
 * _loadMSFromDatabase [ private ]
 * Retrieves the denormalised Microservice Object from [ adp.microservice.read ],
 * prepares an object with only what is necessary.
 * @param {String} ID The microservice ID.
 * @returns Simple denormalised Microservice Object.
 * @author Armando Dias [ zidaarm ]
 */
const _loadMSFromDatabase = async (ID, ASSETTYPE) => {
  try {
    await adp.masterCache.clear('ALLASSETS', null, ID);
    let ASSET;
    let onlyWhatIsNecessaryAsset;
    if (ASSETTYPE === 'assembly') {
      ASSET = await adp.assembly.read(ID, { signum: 'adpSystem', role: 'admin' });
      onlyWhatIsNecessaryAsset = {
        _id: ASSET._id,
        name: ASSET.name,
        slug: ASSET.slug,
        menu_auto: ASSET.menu_auto,
        menu: ASSET.documentsForRendering,
        post_type: 'assembly_documentation',
      };
    } else {
      ASSET = await adp.microservice.read(ID, { signum: 'adpSystem', role: 'admin' });
      onlyWhatIsNecessaryAsset = {
        _id: ASSET._id,
        name: ASSET.name,
        slug: ASSET.slug,
        menu_auto: ASSET.menu_auto,
        menu: ASSET.documentsForRendering,
        check_pvi: ASSET.check_pvi,
        post_type: 'ms_documentation',
      };
    }
    return onlyWhatIsNecessaryAsset;
  } catch (ERROR) {
    const errorCode = ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR.message ? ERROR.message : 'Unable to retrieve MS from Database';
    errorLog(
      errorCode,
      errorMessage,
      { id: ID, error: ERROR },
      'loadMSFromDatabase',
      packName,
    );
    return {
      code: errorCode,
      message: errorMessage,
    };
  }
};


/**
 * _checkDocsForUpdate [ private ]
 * If VERSIONNAME or DOCSLUG are valid strings, this function will
 * filter and returns only what should be synchronized.
 * @param {Object} MS Microservice object.
 * @param {String} VERSIONNAME The version name. Can be null/undefined.
 * @param {String} DOCSLUG The slug of the document. Can be null/undefined.
 * @param {String} SPECIFICVERSION Use 'ALL' for all versions (default),
 *                 version number or 'development' keyword.
 * @returns Array with the documents which should be inserted/updated.
 * @author Armando Dias [ zidaarm ]
 */
const _checkDocsForUpdate = async (MS, VERSIONNAME, DOCSLUG, SPECIFICVERSION = 'ALL') => {
  const msId = MS._id;
  const msName = MS.name;
  const msSlug = MS.slug;
  const msMenu = MS.menu;
  const toUpdate = [];
  const docType = MS.post_type;

  const versionOrder = [];
  Object.keys(msMenu).forEach((KEYVERSION) => {
    if (SPECIFICVERSION === 'ALL' || `${KEYVERSION}` === `${SPECIFICVERSION}`) {
      versionOrder.push(KEYVERSION);
    }
  });

  Object.keys(msMenu).forEach((KEYVERSION) => {
    const currentVersion = KEYVERSION;
    const version = msMenu[currentVersion];
    if (!VERSIONNAME || VERSIONNAME.toLowerCase().trim() === currentVersion.toLowerCase().trim()) {
      Object.keys(version).forEach((CATEGORY) => {
        const category = CATEGORY;
        const documents = version[category];
        if (Array.isArray(documents)) {
          documents.forEach((DOC) => {
            if (SPECIFICVERSION === 'ALL' || `${KEYVERSION}` === `${SPECIFICVERSION}`) {
              if (!DOCSLUG || DOCSLUG.toLowerCase().trim() === DOC.slug.toLowerCase().trim()) {
                const doc = {
                  ms_id: msId,
                  ms_name: msName,
                  ms_slug: msSlug,
                  doc_version: currentVersion,
                  post_type: docType,
                  doc_version_order: Array.isArray(versionOrder)
                    ? versionOrder.indexOf(currentVersion)
                    : 9999999,
                };
                Object.keys(DOC).forEach((FIELD) => {
                  if (FIELD.substring(0, 3) === 'doc_') {
                    doc[`${FIELD}`] = DOC[FIELD];
                  } else {
                    doc[`doc_${FIELD}`] = DOC[FIELD];
                  }
                  if (FIELD === 'doc_mode') {
                    doc.doc_new_tab = DOC[FIELD] !== 'api';
                  }
                });
                if (doc.doc_default === undefined) {
                  doc.doc_default = false;
                }
                if (doc.doc_restricted === undefined) {
                  doc.doc_restricted = false;
                }
                toUpdate.push(doc);
              }
            }
          });
        }
      });
    }
  });
  return toUpdate;
};


/**
 * _addDocsOnTheQueue [ private ]
 * Add the documnents on the queue
 * @param {String} TARGET Target of the queue.
 * @param {Array} DOCLIST list of documents to be inserted/updated.
 * @param {String} OBJECTIVE Unique ID for the queue.
 * @param {Number} INDEX Index for the job in the queue.
 * @param {String} MISSION Mission for the job in the queue.
 * @returns The length of the queue.
 * @author Armando Dias [ zidaarm ]
 */
const _addDocsOnTheQueue = async (TARGET, DOCLIST, OBJECTIVE, INDEX, MISSION) => {
  let index = INDEX;
  const jobQueue = [];
  DOCLIST.forEach((DOC) => {
    const job = {
      command: 'adp.microservice.synchronizeDocumentsWithElasticSearch.sync',
      parameters: DOC,
      index,
    };
    jobQueue.push(job);
    index += 1;
  });

  await adp.queue.addJobs(
    MISSION,
    TARGET,
    OBJECTIVE,
    jobQueue,
  );

  return jobQueue.length;
};

/**
 * deleteElasticDocuments
 * Delete documents from ElsticSearch
 * based in an Array of IDs.
 *  @author Anil Chaurasiya [ zchiana ]
 */
const deleteElasticPviDocuments = async (ID) => {
  try {
    const esModel = new adp.modelsElasticSearch.MicroserviceDocumentation();
    const deleteDocument = await esModel.removePviDocuments(ID);
    return deleteDocument;
  } catch (error) {
    const obj = {
      id: ID,
      error,
    };
    adp.echoLog('Error on [ deleteElasticPviDocuments ]', obj, 500, this.packName);
    return error;
  }
};

/**
 * clearElasticPviDocuments
 * Delete pvi documents from disabled PVI Microservices.
 * @author Anil Chaurasiya [ zchiana ]
 */
const clearElasticPviDocuments = assetId => new Promise(async (RES) => {
  try {
    if (assetId !== null || assetId !== '' || assetId !== undefined) {
      const deletedResult = await deleteElasticPviDocuments(assetId);
      let message = 'PVI documents has removed from ElasticSearch.';
      if (deletedResult && deletedResult.body && deletedResult.body.deleted > 1) {
        message = `${deletedResult.body.deleted} documents were removed from ElasticSearch.`;
      }
      adp.echoLog(message, 200, this.packName);
      return RES({
        statusCode: 200,
        message,
        deleted_elasticsearch_id: assetId,
      });
    }
    const msg = 'No documents were removed from ElasticSearch.';
    adp.echoLog(msg, 200, this.packName);
    return RES({
      statusCode: 200,
      msg,
      deleted_elasticsearch_id: '',
    });
  } catch (ERROR) {
    const errorObj = {
      message: `Caught an error on try/catch block at clearElasticPviDocuments() [ ${this.packName} ]`,
      error: ERROR,
    };
    return errorObj;
  }
});

/**
 * pviDocList [ private ]
 * Create Pvi Template Data
 * with the previous ElasticSearch model.
 * @param {*} versions  ms, The versions that insert into pvi document dynamically.
 * @param {*} ms  The ms is microservices data that insert into pvi document dynamically.
 * @returns The object to be inserted/updated on ElasticSearch.
 * @author Anil [ zchiana ]
 */
const _pviDocList = (versions, ms) => {
  const pviList = [];
  versions.forEach((version) => {
    const pviDocument = {
      ms_id: ms._id,
      ms_name: ms.name,
      ms_slug: ms.slug,
      doc_version: version,
      post_type: ms.post_type,
      doc_version_order: 6,
      doc_name: pviConstant.DOC_NAME,
      doc_filepath: '',
      doc_slug: pviConstant.DOC_SLUG,
      doc_url: '',
      doc_doc_route: [
        '/marketplace',
        ms.slug,
        'documentation',
        version,
        'release-documents',
        'pvi',
      ],
      doc_doc_link: '',
      doc_doc_mode: 'api',
      doc_new_tab: false,
      doc_category_name: 'Release Documents',
      doc_category_slug: 'release-documents',
      doc_titlePosition: 9,
      doc_document_server_source: 'arm',
      doc_default: false,
      doc_restricted: false,
    };
    pviList.push(pviDocument);
  });
  return pviList;
};

/**
 * add
 * Prepare the Queue following the parameters.
 * @param {Array} IDS Array of Microservice IDs.
 * @param {String} VERSIONNAME The version name, if necessary. Can be null/undefined.
 * @param {String} DOCSLUG The slug of the document, if necessary. Can be null/undefined.
 * @param {String} QUEUEOBJECTIVE Unique string ID for the queue.
 * @param {String} SPECIFICVERSION Use 'ALL' for all versions (default),
 *                 version number or 'development' keyword.
 * @param {String} MISSION Use 'microserviceDocumentsElasticSync' as default value.
 * @returns the object to be send to the user wait for the queue.
 * @author Armando Dias [ zidaarm ]
 */
const add = async (IDS, VERSIONNAME, DOCSLUG, QUEUEOBJECTIVE, SPECIFICVERSION = 'ALL', checkPvi = false, MISSION = 'microserviceDocumentsElasticSync', ASSETTYPE = 'microservice') => {
  if (!Array.isArray(IDS)) {
    const errorObject = {
      code: 400,
      message: 'Parameter IDS should be an array of microservice ids.',
    };
    return new Promise((RES, REJ) => REJ(errorObject));
  }
  let index = 0;
  let queueIndex = 0;
  let isCheckPvi = checkPvi;
  let syncStatusFrom = '';
  const action = async () => {
    if (IDS[index]) {
      const getIndex = IDS[index] && IDS[index]._id ? IDS[index]._id : IDS[index];
      let ms = await _loadMSFromDatabase(getIndex, ASSETTYPE);
      if (isCheckPvi === 'syncIntegration') {
        isCheckPvi = (ms && ms.check_pvi) ? ms.check_pvi : false;
        syncStatusFrom = 'Sync from Integration';
      } else {
        syncStatusFrom = 'Sync from Contribution flow';
      }
      let docList = await _checkDocsForUpdate(ms, VERSIONNAME, DOCSLUG, SPECIFICVERSION);
      if (isCheckPvi === true) {
        const pviDocResult = await _pviDocList(Object.keys(ms.menu), ms);
        docList = [...docList, ...pviDocResult];
        adp.echoLog(`PVI Documents ${syncStatusFrom} for ${ms.name} [ ${pviDocResult.length} ]`, null, 200, packName);
      } else {
        clearElasticPviDocuments(ms._id);
        adp.echoLog(`PVI Documents removing ${syncStatusFrom} for ${ms.name} [ ${docList.length} ]`, null, 200, packName);
      }
      if (docList.length > 0) {
        adp.echoLog(`_checkDocsForUpdate response [ ${docList.length} ]`, null, 200, packName);
        const quant = await _addDocsOnTheQueue(
          ms._id, docList, QUEUEOBJECTIVE, queueIndex, MISSION,
        );
        queueIndex += quant;
      }
      if (IDS[index + 1]) {
        ms = null;
        docList = null;
        index += 1;
        return action();
      }
      return true;
    }
    return false;
  };
  const result = await action();
  if (result !== false) {
    adp.queue.startJobs();
  }
  const messageToSend = {
    queueStatusLink: adp.queue.obtainObjectiveLink(QUEUEOBJECTIVE),
  };
  return messageToSend;
};

/**
 * _retroCompatibility [ private ]
 * Just changes the name of some fields to be compatible
 * with the previous ElasticSearch model.
 * @param {*} SYNCOBJ The Document Object to be synchronized.
 * @returns The object to be inserted/updated on ElasticSearch.
 * @author Armando Dias [ zidaarm ]
 */
const _retroCompatibility = (SYNCOBJECT) => {
  const sync = SYNCOBJECT;
  const retro = {
    post_id: sync.post_id,
    post_name: sync.post_name,
    post_name_version_order: sync.post_name_version_order,
    post_new_tab: sync.post_new_tab,
    post_type: sync.post_type,
    asset_id: sync.ms_id,
    asset_name: sync.ms_name,
    asset_slug: sync.ms_slug,
    version: sync.doc_version,
    title: sync.doc_name,
    title_slug: sync.doc_slug,
    category: sync.doc_category_name,
    category_slug: sync.doc_category_slug,
    document_url: sync.doc_doc_link,
    external_link: sync.doc_doc_link,
    default: sync.doc_default,
    restricted: sync.doc_restricted,
    sync_date: sync.doc_sync_date,
  };
  retro.original = sync.doc_original;
  retro.raw_text = sync.doc_text;
  return retro;
};


/**
 * _compareAndUpdate [ private ]
 * Compare the retrieved document with the ElasticSearch copy
 * and decides if should update or not.
 * @param {*} SYNCOBJ The Document Object to be synchronized.
 * @returns Promise resolve with the result ( or the error ).
 * Because this is expected by a queue, should not reject.
 * @author Armando Dias [ zidaarm ]
 */
const _compareAndUpdate = async (SYNCOBJECT) => {
  const syncObject = SYNCOBJECT;
  try {
    const elasticSearchModel = new adp.modelsElasticSearch.MicroserviceDocumentation();
    const esDocument = await elasticSearchModel.getThisSpecificMSDocument(syncObject);
    adp.echoLog(`received getThisSpecificMSDocument response [ ${esDocument.code} ]`, null, 200, packName);
    if (esDocument.code !== 200) {
      if (esDocument.error.substring(0, 25) === 'index_not_found_exception') {
        await elasticSearchModel.verifyIndex();
      }
      const docReady = _retroCompatibility(syncObject);
      await elasticSearchModel.createThisSpecificMSDocument(docReady);
      adp.echoLog(`MSDoc [ ${syncObject.post_id} ] inserted on ElasticSearch.`, null, 200, packName);
      return { code: 200, message: 'Document successful inserted on ElastiSearch.' };
    }
    if (esDocument.doc.post_id === syncObject.post_id) {
      if (esDocument.doc.original === syncObject.doc_original) {
        adp.echoLog(`MSDoc [ ${syncObject.post_id} ] doesn't need to be updated.`, null, 200, packName);
        return { code: 200, message: 'Document doesn`t need to be updated.' };
      }
      const docReady = _retroCompatibility(syncObject);
      await elasticSearchModel.updateThisSpecificMSDocument(esDocument.docESID, docReady);
      adp.echoLog(`MSDoc [ ${syncObject.post_id} ] updated on ElasticSearch.`, null, 200, packName);
      return { code: 200, message: 'Document successful updated on ElastiSearch.' };
    }
    return { status: 500, error: 'Error on comparing documents' };
  } catch (ERROR) {
    const errorCode = ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR.message ? ERROR.message : 'Unable to retrieve the document from external';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      errorMessage,
      syncObject,
    };
    return errorLog(errorCode, errorMessage, errorObject, 'syncRenderDoc', packName);
  }
};

/**
 * _clearDiskCache [ private ]
 * Clear the cache of specific document from cache.
 * @param {string} DOCURL The Document URL to be removed
 * from diskcache ( if exists ).
 * @author Armando Dias [ zidaarm ]
 */
const _clearDiskCache = (DOCURL) => {
  try {
    const slugURL = adp.slugThisURL(DOCURL);
    const path = `${adp.path}/static/document/${slugURL}/`;
    if (global.fs.existsSync(path)) {
      global.fs.rmSync(path, { recursive: true, force: true });
    }
    return true;
  } catch (ERROR) {
    // Is not a problem if this code breaks.
    return false;
  }
};


/**
 * _syncRenderDoc [ private ]
 * Synchronize documents including the body of the document.
 * @param {*} SYNCOBJ The Document Object to be synchronized.
 * @returns Promise resolve with the result ( or the error ).
 * Because this is expected by a queue, should not reject.
 * @author Armando Dias [ zidaarm ]
 */
const _syncRenderDoc = (SYNCOBJ) => {
  const syncObject = SYNCOBJ;
  return new Promise(async (RESOLVE) => {
    _clearDiskCache(syncObject.doc_url);
    if (syncObject.doc_slug === pviConstant.DOC_SLUG) {
      try {
        syncObject.doc_original = '';
        syncObject.doc_text = '';
        syncObject.doc_sync_date = new Date();
        syncObject.post_id = `${syncObject.ms_id}_${syncObject.doc_version}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
        syncObject.post_name = `${syncObject.ms_id}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
        syncObject.post_name_version_order = syncObject.doc_version_order;
        syncObject.post_new_tab = syncObject.doc_new_tab;
        await _compareAndUpdate(syncObject);
        RESOLVE({ status: 200, doc: syncObject });
      } catch (ERROR) {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Unable to Sync the PVI document with Elastic Search';
        const errorObject = {
          status: errorCode,
          error: ERROR,
          errorMessage,
          syncObject,
        };
        RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'syncRenderDoc', packName));
      }
    } else {
      adp.document.getDocuments(
        syncObject.doc_url,
        null,
        syncObject.doc_name,
        syncObject.doc_category_name,
        false,
      )
        .then(async (DOCUMENT) => {
          if (DOCUMENT.ok === true) {
            syncObject.doc_original = DOCUMENT.msg.body;
            syncObject.doc_text = await adp.stripHtmlTags(DOCUMENT.msg.body);
            syncObject.doc_sync_date = new Date();
            syncObject.post_id = `${syncObject.ms_id}_${syncObject.doc_version}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
            syncObject.post_name = `${syncObject.ms_id}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
            syncObject.post_name_version_order = syncObject.doc_version_order;
            syncObject.post_new_tab = syncObject.doc_new_tab;
            await _compareAndUpdate(syncObject);
            RESOLVE({ status: 200, doc: syncObject });
          } else {
            let status = 500;
            if (DOCUMENT && Array.isArray(DOCUMENT.msg)) {
              if (DOCUMENT.msg[0].indexOf('has to be a gerrit or artifactory link') >= 0) {
                status = 400;
              }
            }
            RESOLVE({ status, error: DOCUMENT.msg });
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR.message ? ERROR.message : 'Unable to retrieve the document from external';
          const errorObject = {
            status: errorCode,
            error: ERROR,
            errorMessage,
            syncObject,
          };
          RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'syncRenderDoc', packName));
        });
    }
  });
};


/**
 * _syncExternalDoc [ private ]
 * Synchronize external documents - ignoring the body of the document.
 * @param {*} SYNCOBJ The Document Object to be synchronized.
 * @returns Promise resolve with the result ( or the error ).
 * Because this is expected by a queue, should not reject.
 * @author Armando Dias [ zidaarm ]
 */
const _syncExternalDoc = (SYNCOBJ) => {
  const syncObject = SYNCOBJ;
  return new Promise(async (RESOLVE) => {
    try {
      syncObject.doc_original = '';
      syncObject.doc_text = '';
      syncObject.doc_sync_date = new Date();
      syncObject.post_id = `${syncObject.ms_id}_${syncObject.doc_version}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
      syncObject.post_name = `${syncObject.ms_id}_${syncObject.doc_category_slug}_${syncObject.doc_slug}`;
      syncObject.post_name_version_order = syncObject.doc_version_order;
      syncObject.post_new_tab = syncObject.doc_new_tab;
      syncObject.post_type = syncObject.post_type;
      await _compareAndUpdate(syncObject);
      RESOLVE({ status: 200, doc: syncObject });
    } catch (ERROR) {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Unable to Sync the document with Elastic Search';
      const errorObject = {
        status: errorCode,
        error: ERROR,
        errorMessage,
        syncObject,
      };
      RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'syncExternalDoc', packName));
    }
  });
};


/**
 * sync
 * Decides if the document can be rendered by our Portal
 * ( doc_mode === api ) or not to call syncRenderDoc or
 * syncExternalDoc.
 * @param {*} SYNCOBJ The Document Object to be synchronized.
 * @returns Promise resolve with the result. Because this is
 * expected by a queue, should not reject.
 * @author Armando Dias [ zidaarm ]
 */
const sync = SYNCOBJ => new Promise((RESOLVE) => {
  adp.echoLog(`inside sync function [ ${SYNCOBJ.doc_doc_mode} ]`, null, 200, packName);
  if (SYNCOBJ.doc_doc_mode === 'api') {
    RESOLVE(_syncRenderDoc(SYNCOBJ));
  } else {
    RESOLVE(_syncExternalDoc(SYNCOBJ));
  }
});

module.exports = {
  add,
  sync,
  deleteElasticPviDocuments,
  clearElasticPviDocuments,
};
