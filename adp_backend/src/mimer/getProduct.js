// ============================================================================================= //
/**
* [ adp.mimer.getProduct ]
* Retrieve the product from Mimer/Munin server.
* @param {String} PRODUCTID The Product ID from Mimer/Munin.
* @param {Boolean} ALLVERSIONS To retrieve all the versions (if true).
* @param {string} SPECIFICVERSION Microservice SPECIFICVERSION.
* @param {string} MSID Microservice ID.
* @param {string} QUEUEOBJECTIVE Queue Objective Unique Identifier.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.mimer.getProduct';
// ============================================================================================= //
module.exports = (
  PRODUCTID,
  ALLVERSIONS,
  MSID,
  QUEUEOBJECTIVE,
  SPECIFICVERSION,
) => new Promise(async (RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  adp.echoLog(`PRODUCTID:: ${PRODUCTID} - ALLVERSIONS:: ${ALLVERSIONS} - SPECIFICVERSION::${SPECIFICVERSION}`, null, 200, packName);
  await adp.queue.setPayload(QUEUEOBJECTIVE, { status: 1 });
  let index = await adp.queue.getNextIndex(QUEUEOBJECTIVE);
  let answerFromRemote;
  try {
    const adpModel = new adp.models.Adp();
    const getOneByIdResult = await adpModel.getOneById(MSID);
    const assetDocumentsModel = new adp.models.AssetDocuments();
    if (ALLVERSIONS === true || ALLVERSIONS === 'true') {
      const cleaningStartTimer = (new Date()).getTime();
      await assetDocumentsModel.hardDeleteFromDatabaseByType(MSID, ['raw', 'mimer']);
      const cleaningEndTimer = (new Date()).getTime();
      adp.echoLog(`Asset raw/mimer documentation deleted for clean execution in ${cleaningEndTimer - cleaningStartTimer}ms`, null, 200, packName);
    }

    if (ALLVERSIONS === false || ALLVERSIONS === 'false') {
      // deleting the records from assetDocumentation for both latestverion & mimerdevelopment
      if (SPECIFICVERSION === null || SPECIFICVERSION === '' || SPECIFICVERSION === undefined || SPECIFICVERSION === 'ALL') {
        const latestVersion = await adpModel.getLatestVersionByMSId(MSID);
        const mimerDevelopmentVersion = await adpModel.getMimerDevelopmentVersionFromYAML(MSID);
        adp.echoLog(`Deleting Asset raw/mimer documentations for latest & MDV ${latestVersion} & ${mimerDevelopmentVersion}`, null, 200, packName);
        if (latestVersion !== null && latestVersion !== undefined) {
          await assetDocumentsModel.hardDeleteFromDatabaseByVersion(MSID, latestVersion);
          adp.echoLog('Deleted the entries for latestVersion', null, 200, packName);
        }
        if (mimerDevelopmentVersion !== null && mimerDevelopmentVersion !== undefined) {
          await assetDocumentsModel.hardDeleteFromDatabaseByVersion(MSID, mimerDevelopmentVersion);
          adp.echoLog('Deleted the entries for mimerDevelopmentVersion', null, 200, packName);
        }
      } else {
        await assetDocumentsModel.hardDeleteFromDatabaseByVersion(MSID, SPECIFICVERSION);
      }
    }

    const mimerMenu = await assetDocumentsModel.getMenuVersions(MSID, 'raw');
    const check = getOneByIdResult
      && Array.isArray(getOneByIdResult.docs)
      && (getOneByIdResult.docs.length > 0);
    if (check) {
      const ms = getOneByIdResult
        && getOneByIdResult.docs
        && getOneByIdResult.docs[0]
        ? getOneByIdResult.docs[0]
        : null;
      const mimerVersionStarter = ms
          && ms.mimer_version_starter
        ? `${ms.mimer_version_starter}`
        : null;
      const mimerDevelopmentVersion = ms
      && ms.mimer_development_version
        ? `${ms.mimer_development_version}`
        : null;
      let oldVersions = [];
      if (mimerMenu && (ALLVERSIONS === false || ALLVERSIONS === 'false')) {
        oldVersions = mimerMenu;
      }
      let versionsToCheckCounter = 0;
      const mimerClass = new adp.mimer.MimerControl();
      mimerClass.getProduct(PRODUCTID)
        .then((RESPONSE) => {
          answerFromRemote = RESPONSE;
          if (RESPONSE && Array.isArray(RESPONSE)) {
            const responseSorted = adp
                && adp.versionSort
              ? RESPONSE.sort(adp.versionSort('-version'))
              : RESPONSE;
            const responseClear = [];
            const jobQueue = [];
            let mimerVersionsFound = false;
            responseSorted.forEach((VERSION) => {
              const versionObject = VERSION;
              const isDevelopment = (`${versionObject.version}` === mimerDevelopmentVersion);
              if ((!mimerVersionsFound) || isDevelopment) {
                if (isDevelopment) {
                  versionObject.isDevelopment = true;
                }
                responseClear.push(versionObject);
              }
              if (`${versionObject.version}` === `${mimerVersionStarter}`) mimerVersionsFound = true;
            });

            responseClear.forEach((VERSION) => {
              let check1;
              let check2;
              let check3; // verifying the specific version condition for manual sync for assets
              let isDevelopment;
              if (SPECIFICVERSION !== null && SPECIFICVERSION !== '' && SPECIFICVERSION !== undefined && SPECIFICVERSION !== 'ALL') {
                if (SPECIFICVERSION === VERSION.version) {
                  check3 = true;
                } else {
                  check3 = false;
                }
              } else {
                check1 = !(ALLVERSIONS === false || ALLVERSIONS === 'false');
                check2 = !oldVersions.includes(VERSION.version);
                check3 = false;
                isDevelopment = VERSION.isDevelopment === true;
              }
              adp.echoLog(`check conditions [ ${check1} - ${check2} - ${check3} - ${isDevelopment} ] ${VERSION.version} ${SPECIFICVERSION}`, null, 200, packName);
              // if (check3 || (!check4 && check1) || (!check4 && check2)
              // || (!check4 && isDevelopment)) {
              if (check1 || check2 || check3 || isDevelopment) {
                versionsToCheckCounter += 1;
                const job = {
                  command: 'adp.mimer.getVersion',
                  parameters: [
                    VERSION.number,
                    VERSION.version,
                    VERSION.url,
                    isDevelopment,
                    MSID,
                    QUEUEOBJECTIVE,
                  ],
                  index,
                };
                jobQueue.push(job);
              }
              index += 1;
            });
            adp.echoLog(`jobQueue.length [ ${jobQueue.length} ]`, null, 200, packName);
            if (jobQueue.length > 0) {
              const jobRawMimerMenu = {
                command: 'adp.mimer.savingRawMimerMenu',
                parameters: [MSID, SPECIFICVERSION != null
                  ? SPECIFICVERSION : ALLVERSIONS, QUEUEOBJECTIVE],
                index,
                priority: 1,
              };
              jobQueue.push(jobRawMimerMenu);
              index += 1;

              const jobElasticClear = {
                command: 'adp.mimer.mimerElasticSearchSyncClear',
                parameters: [MSID, QUEUEOBJECTIVE],
                index,
                priority: 2,
              };
              jobQueue.push(jobElasticClear);
              index += 1;

              const jobRenderMimerMenu = {
                command: 'adp.mimer.renderMimerArmMenu',
                parameters: [MSID,
                  SPECIFICVERSION != null ? SPECIFICVERSION : ALLVERSIONS,
                  QUEUEOBJECTIVE],
                index,
                priority: 3,
              };
              jobQueue.push(jobRenderMimerMenu);
              index += 1;

              adp.queue.addJobs(
                'mimerDocumentUpdate',
                MSID,
                QUEUEOBJECTIVE,
                jobQueue,
              )
                .then((QUEUERESULT) => {
                  const queueResult = QUEUERESULT;
                  queueResult.status = 200;
                  queueResult.statusDescription = `Product ${ms.slug} retrieved`;
                  const AnswerQueueResult = QUEUERESULT;
                  AnswerQueueResult.answerFromRemote = answerFromRemote;
                  RESOLVE(AnswerQueueResult);
                  const endTimer = (new Date()).getTime();
                  adp.echoLog(`Asset [ ${ms.slug} ] mimer data retrieved ${versionsToCheckCounter} new versions in ${endTimer - timer}ms`, null, 200, packName);
                })
                .catch((ERROR) => {
                  const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                  const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adp.queue.addJob ]';
                  const errorObject = { error: ERROR };
                  const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
                  REJECT(errorLogObject);
                });
            } else {
              adp.queue.addJob(
                'mimerDocumentUpdate',
                MSID,
                'adp.mimer.renderMimerArmMenu',
                [MSID, ALLVERSIONS, QUEUEOBJECTIVE],
                QUEUEOBJECTIVE,
                index,
                1,
              )
                .then(() => {
                  const endTimer = (new Date()).getTime();
                  adp.echoLog(`Microservice [ ${ms.slug} ] mimer data retrieved in ${endTimer - timer}ms. No new versions were found.`, null, 200, packName);
                  RESOLVE({ status: 200, statusDescription: 'No new versions were found.' });
                })
                .catch((ERROR) => {
                  const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                  const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adp.queue.addJob ]';
                  const errorObject = { error: ERROR };
                  const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
                  REJECT(errorLogObject);
                });
            }
          } else {
            const errorCode = 500;
            const errorMessage = 'Error caught on [ mimerClass.getProduct(PRODUCTID) @ adp.mimer.MimerControl ]';
            const errorObject = {};
            const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
            REJECT(errorLogObject);
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ mimerClass.getProduct @ adp.mimer.MimerControl ]';
          const errorObject = { error: ERROR };
          const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
          REJECT(errorLogObject);
        });
    } else {
      const errorCode = 404;
      const errorMessage = `The microservice [ ${MSID} ] was not found.`;
      const errorObject = {};
      const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      REJECT(errorLogObject);
    }
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error caught on [ adpModel.getOneById(MSID) @ adp.models.Adp ]';
    const errorObject = { error: ERROR };
    const errorLogObject = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
    REJECT(errorLogObject);
  }
});
// ============================================================================================= //
