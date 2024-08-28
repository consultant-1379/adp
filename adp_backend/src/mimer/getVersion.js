// ============================================================================================= //
/**
* [ adp.mimer.getVersion ]
* Retrieve the product version from Mimer/Munin server.
* @param {String} PRODUCTNUMBER The Product ID from Mimer/Munin.
* @param {String} VERSION The Document Version Product.
* @param {String} URL The URL of the Document Version.
* @param {Boolean} ISMIMERDEVELOPMENT If this version will be used as development.
* @param {String} MSID The microservice ID.
* @param {string} QUEUEOBJECTIVE Queue Objective Unique Identifier.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.mimer.getVersion';
// ============================================================================================= //
module.exports = (
  PRODUCTNUMBER,
  VERSION,
  URL,
  ISMIMERDEVELOPMENT,
  MSID,
  QUEUEOBJECTIVE,
) => new Promise(async (RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  await adp.queue.setPayload(QUEUEOBJECTIVE, { status: 1 });
  let index = await adp.queue.getNextIndex(QUEUEOBJECTIVE);
  let docCount = 0;
  try {
    const adpModel = new adp.models.Adp();
    const getOneByIdResult = await adpModel.getOneById(MSID);
    const checkIfGotOne = getOneByIdResult
      && getOneByIdResult.docs
      && Array.isArray(getOneByIdResult.docs)
      && getOneByIdResult.docs.length === 1;
    if (!checkIfGotOne) {
      const errorCode = 404;
      const errorMessage = 'Error caught because [ getOneById @ adp.models.Adp ] returned empty.';
      const errorObject = { microserviceID: MSID };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.getVersion');
      REJECT(errorLogObject);
      return;
    }
    const ms = getOneByIdResult.docs[0];
    const assetSlug = ms.slug;
    const mimerClass = new adp.mimer.MimerControl();
    const answerFromRemote = await mimerClass.getVersion(URL, VERSION);
    const theLifecycleStage = answerFromRemote
      && answerFromRemote.lifecycleStage
      ? answerFromRemote.lifecycleStage
      : 'undefined';

    const isRelease = (`${theLifecycleStage}`).toLowerCase() === 'released';
    let canSyncBasedOnLifecycleStage = false;
    if ((ISMIMERDEVELOPMENT) || (!ISMIMERDEVELOPMENT && isRelease)) {
      canSyncBasedOnLifecycleStage = true;
    }

    if (canSyncBasedOnLifecycleStage && answerFromRemote.documents) {
      const jobQueueForTranslation = [];
      const menu = {};
      answerFromRemote.documents.forEach((DOCUMENT) => {
        if (DOCUMENT.systemOfRecord === 'Eridoc') {
          if (!(menu[VERSION])) {
            menu[VERSION] = { versionLabel: VERSION, 'release-documents': [] };
          }
          const doc = {
            name: `${DOCUMENT.documentNumber}`,
            slug: `${adp.slugIt(DOCUMENT.documentNumber)}`,
            mimer_source: true,
            mimer_document_number: `${DOCUMENT.documentNumber}`,
            document_server_source: 'mimer',
            language: DOCUMENT.language,
            revision: DOCUMENT.revision,
            approval_date: null,
            external_link: `${DOCUMENT.publicURL}`,
            physical_file_name: null,
            physical_file_extension: null,
            physical_file_status: null,
            default: false,
            restricted: false,
            url: `${DOCUMENT.documentURL}`,
            doc_route: [
              '/marketplace',
              `${assetSlug}`,
              'documentation',
              `${VERSION}`,
              'release-documents',
              `${adp.slugIt(DOCUMENT.documentNumber)}`,
            ],
            doc_link: `${adp.config.siteAddress}/document/${assetSlug}/${VERSION}/release-documents/${adp.slugIt(DOCUMENT.documentNumber)}`,
            doc_mode: 'download',
            category_name: 'Release Documents',
            category_slug: 'release-documents',
            titlePosition: 0,
            data_retrieved_at: new Date(),
          };
          menu[VERSION]['release-documents'].push(doc);
          const jobQueuePreparation = {
            command: 'adp.mimer.mimerTranslationAction',
            parameters: [
              ms._id,
              DOCUMENT.documentNumber,
              DOCUMENT.revision,
              DOCUMENT.language,
              VERSION,
            ],
            index,
          };
          jobQueueForTranslation.push(jobQueuePreparation);
          index += 1;
          docCount += 1;
          const jobQueueElasticSearchSyncPreparation = {
            command: 'adp.mimer.mimerElasticSearchSyncAction',
            parameters: [
              MSID,
              assetSlug,
              ms.name,
              VERSION,
              ISMIMERDEVELOPMENT,
              DOCUMENT.documentNumber,
              DOCUMENT.revision,
              DOCUMENT.language,
              QUEUEOBJECTIVE,
              ms.type,
            ],
            index,
          };
          jobQueueForTranslation.push(jobQueueElasticSearchSyncPreparation);
          index += 1;
        }
      });

      const arrayValidation = Array.isArray(jobQueueForTranslation);
      const arraySizeValidation = jobQueueForTranslation.length > 0;
      if (!arrayValidation || (arrayValidation && !arraySizeValidation)) {
        const obj = {
          status: 200,
          message: 'The server did not provided documents for this Product Number and Version. This is not considered an error.',
          product_number: PRODUCTNUMBER,
          version: VERSION,
          url: URL,
          ms_id: MSID,
          queue_objective: QUEUEOBJECTIVE,
          answerFromRemote,
        };
        adp.echoLog(obj.message, obj, 200, packName);
        RESOLVE(obj);
        return;
      }
      const assetDocuments = new adp.models.AssetDocuments();
      await assetDocuments.createOrUpdate(MSID, assetSlug, 'raw', VERSION, menu[VERSION]);
      menu.status = 200;
      menu.statusDescription = `Version ${VERSION} retrieved`;
      menu.answerFromRemote = answerFromRemote;
      adp.queue.addJobs(
        'mimerDocumentUpdate',
        MSID,
        QUEUEOBJECTIVE,
        jobQueueForTranslation,
      )
        .then(() => {
          RESOLVE(menu);
          const endTimer = (new Date()).getTime();
          if (docCount === 1) {
            adp.echoLog(`Asset [ ${assetSlug} / ${VERSION} ] got 1 Document in ${endTimer - timer}ms`, null, 200, packName);
          } else {
            adp.echoLog(`Asset [ ${assetSlug} / ${VERSION} ] got ${docCount} Documents in ${endTimer - timer}ms`, null, 200, packName);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adp.queue.addJobs ]';
          const errorObject = { error: ERROR };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.getVersion');
          REJECT(errorLogObject);
        });
    } else {
      let errorCode = 400;
      let errorMessage = 'Unknown Document format found.';
      if (!canSyncBasedOnLifecycleStage) {
        errorCode = 200;
        errorMessage = `LifeCycle is not "Released". Got "${theLifecycleStage}" instead.`;
      }
      const errorObject = {
        assetId: MSID,
        assetSlug,
        productNumber: PRODUCTNUMBER,
        version: VERSION,
        url: URL,
        error: answerFromRemote,
      };
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.getVersion');
      REJECT(errorLogObject);
    }
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getOneById(MSID) @ adp.models.Adp ]';
    const errorObject = { error: ERROR };
    const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.mimer.getVersion');
    REJECT(errorLogObject);
  }
});
// ============================================================================================= //
