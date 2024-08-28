// ============================================================================================= //
/**
* [ adp.integration.documentRefreshConsolidation ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
const packName = 'adp.integration.documentRefreshConsolidation';
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
adp.integration.debuggerMode = true;

const debuggerMessage = (MESSAGE) => {
  if (adp.integration.debuggerMode === true) {
    adp.echoLog(MESSAGE, null, 200, packName);
  }
};

const clearArray = (THEARRAY, MODE) => {
  const theArray = THEARRAY;
  const cleanArray = [];
  theArray[MODE].forEach((ITEM) => {
    if (!cleanArray.includes(ITEM)) {
      cleanArray.push(ITEM);
    }
  });
  return cleanArray;
};

/**
* Retrieve and parse YAML files from artifactory to build the document menu.
* One YAML file per request.
* @param {string} MSID The microservice ID to update.
* @param {string} MSSLUG The microservice Slug.
* @param {string} OBJECTIVE Name of the queue group which this request belongs.
* @returns {Object} An object containing dbResponse and errors keys.
* @author Armando Dias [ zdiaarm ]
*/

module.exports = (
  MSID,
  MSSLUG,
  OBJECTIVE,
  SPECIFICVERSION = 'ALL',
) => new Promise((RESOLVE, REJECT) => {
  const fullTimer = (new Date()).getTime();
  adp.queue.groupHeader(OBJECTIVE)
    .then((RESULT) => {
      let groupHeader;
      if (RESULT && Array.isArray(RESULT.docs)) {
        groupHeader = RESULT.docs[0];
      }
      let requestedAt;
      if (groupHeader && groupHeader.added) {
        requestedAt = groupHeader.added;
      }
      let startedAt;
      if (groupHeader && groupHeader.started) {
        startedAt = groupHeader.started;
      }
      const finishedAt = new Date();
      const payload = groupHeader
        && groupHeader.payload
        ? groupHeader.payload
        : {};

      if (payload && payload.yamlErrors) {
        let ArrayLen = 0;
        if (Array.isArray(payload.yamlErrors.development)) {
          payload.yamlErrors.development = clearArray(payload.yamlErrors, 'development');
          ArrayLen += payload.yamlErrors.development.length;
        }
        if (Array.isArray(payload.yamlErrors.release)) {
          payload.yamlErrors.release = clearArray(payload.yamlErrors, 'release');
          ArrayLen += payload.yamlErrors.release.length;
        }
        payload.yamlErrorsQuant = ArrayLen;
      }

      if (payload && payload.yamlWarnings) {
        let ArrayLen = 0;
        if (Array.isArray(payload.yamlWarnings.development)) {
          payload.yamlWarnings.development = clearArray(payload.yamlWarnings, 'development');
          ArrayLen += payload.yamlWarnings.development.length;
        }
        if (Array.isArray(payload.yamlWarnings.release)) {
          payload.yamlWarnings.release = clearArray(payload.yamlWarnings, 'release');
          ArrayLen += payload.yamlWarnings.release.length;
        }
        payload.yamlWarningsQuant = ArrayLen;
      }

      let microserviceName = payload && payload.name ? payload.name : null;
      if (!microserviceName && groupHeader && groupHeader.data && groupHeader.data.dbResponse) {
        microserviceName = groupHeader.data.dbResponse.name;
      }
      let microserviceSlug = payload && payload.slug ? payload.slug : null;
      if (!microserviceSlug && groupHeader && groupHeader.data && groupHeader.data.dbResponse) {
        microserviceSlug = groupHeader.data.dbResponse.slug;
      }

      const useStatus = payload
        && payload.serverStatusCode
        ? payload.serverStatusCode
        : payload.status;

      const useStatusMessage = adp.queue.queueStatusCodeToString(useStatus);
      payload.status = useStatus;

      let versionsFound;
      if (payload && payload.theMenu && payload.theMenu.auto) {
        versionsFound = 0;
        if (payload.theMenu.auto.development) {
          versionsFound += 1;
        }
        if (payload.theMenu.auto.release) {
          versionsFound += payload.theMenu.auto.release.length;
        }
      }

      const finalReport = {
        status: useStatus,
        statusMessage: useStatusMessage,
        currentStatus: '',
        percentage: 0,
        microserviceName,
        microserviceSlug,
        requestedAt,
        startedAt,
        finishedAt,
        versionsFound,
        yamlErrorsQuant: payload.yamlErrorsQuant,
        yamlWarningsQuant: payload.yamlWarningsQuant,
        yamlErrors: payload.yamlErrors,
        yamlWarnings: payload.yamlWarnings,
      };

      adp.queue.currentStatus(OBJECTIVE)
        .then((CURRENTSTATUS) => {
          finalReport.currentStatus = CURRENTSTATUS.currentStatus;
          finalReport.percentage = CURRENTSTATUS.percentage;
          if (payload
            && payload.theMenu
            && payload.theMenu.auto
            && Array.isArray(payload.theMenu.auto.release)) {
            const orderTimer = (new Date()).getTime();
            payload.theMenu.auto.release = payload.theMenu.auto.release
              .sort(adp.versionSort('-version'));
            debuggerMessage(`All Release Document Menu ordered in ${(new Date()).getTime() - orderTimer}ms`);
          }
          adp.queue.setPayload(OBJECTIVE, payload)
            .then(() => {
              if (payload.yamlErrorsQuant === 0) {
                const adpModel = new adp.models.Adp();
                payload.theMenu.auto.date_modified = new Date();
                adpModel.updateOnlyAutoMenu(MSID, payload.theMenu.auto, SPECIFICVERSION)
                  .then((AFTERUPDATE) => {
                    if (AFTERUPDATE.ok) {
                      adp.queue.addJob(
                        'documentRefreshClearCache',
                        MSID,
                        'adp.integration.documentRefresh.clearCache',
                        [MSID, MSSLUG],
                        `${OBJECTIVE}`,
                        0,
                        0,
                        'MAIN',
                      )
                        .then(() => {
                          adp.echoLog('Action queued for Main Backend...', null, 200, packName);
                          RESOLVE(finalReport);
                        })
                        .catch((ERROR) => {
                          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error on [ adp.queue.addJob ]';
                          const errorObject = {
                            error: ERROR,
                            microserviceID: MSID,
                            microserviceSLUG: MSSLUG,
                            objective: `${OBJECTIVE}`,
                            cmd: 'adp.integration.documentRefresh.clearCache',
                            runner: 'MAIN',
                          };
                          REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
                        });
                    } else {
                      adp.echoLog('Action not queued for Main Backend...', null, 200, packName);
                      REJECT(finalReport);
                    }
                    debuggerMessage(`Finished the consolidation process for [ ${MSSLUG} ] in ${(new Date()).getTime() - fullTimer}ms`);
                    global.gc();
                  })
                  .catch((ERROR) => {
                    const errorCode = ERROR.code || 500;
                    const errorMessage = ERROR.message || 'Error on [ adpModel.updateOnlyAutoMenu @ adp.models.Adp ]';
                    const errorObject = {
                      error: ERROR,
                      microserviceID: MSID,
                      theMenuAuto: payload.theMenu.auto,
                    };
                    REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
                  });
              } else {
                debuggerMessage(`Finished the consolidation process for [ ${MSSLUG} ] in ${(new Date()).getTime() - fullTimer}ms`);
                RESOLVE(finalReport);
                global.gc();
              }
            })
            .catch((ERROR) => {
              const errorCode = ERROR.code || 500;
              const errorMessage = ERROR.message || 'Error on [ adp.queue.setPayload ]';
              const errorObject = {
                error: ERROR,
                objective: OBJECTIVE,
                payload,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
            });
        })
        .catch((ERROR) => {
          const errorCode = ERROR.code || 500;
          const errorMessage = ERROR.message || 'Error on [ adp.queue.currentStatus ]';
          const errorObject = {
            error: ERROR,
            objective: OBJECTIVE,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error on [ adp.queue.groupHeader ]';
      const errorObject = {
        error: ERROR,
        objective: OBJECTIVE,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
});
