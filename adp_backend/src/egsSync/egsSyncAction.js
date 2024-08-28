// ============================================================================================= //
/**
* [ adp.egsSync.egsSyncAction ]
* Trigger the EGS Synchronization process.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.egsSync.egsSyncAction';
// ============================================================================================= //
module.exports = QUEUEPAYLOAD => new Promise(async (RESOLVE, REJECT) => {
  adp.echoLog('Starting EGS Synchronization...', null, 200, packName, false);
  const timer = (new Date()).getTime();
  const queueObjective = QUEUEPAYLOAD;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // LOAD SETUP VARIABLES
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let setup;
  try {
    setup = await adp.egsSync.egsSyncSetup();
    if (!(setup.egsSyncActive === true)) {
      adp.egsSync.setup = undefined;
      const errorCode = setup && setup.code ? setup.code : 405;
      const errorMessage = setup && setup.message ? setup.message : 'Method Not Allowed';
      const errorObject = {
        method: 'adp.egsSync.egsSyncSetup',
        error: 'This method is not active',
        duration: `${((new Date()).getTime()) - timer}ms`,
        return: setup,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
      return;
    }
    adp.egsSync.setup = {
      egsSyncActive: setup.egsSyncActive,
      egsSyncActiveTypes: setup.egsSyncActiveTypes,
      egsSyncServerAddress: setup.egsSyncServerAddress,
      egsSyncItemsPerRequest: setup.egsSyncItemsPerRequest,
      egsSyncMaxBytesSizePerRequest: setup.egsSyncMaxBytesSizePerRequest,
    };
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
    const errorObject = {
      method: 'adp.egsSync.egsSyncSetup',
      duration: `${((new Date()).getTime()) - timer}ms`,
      return: setup,
      error: ERROR,
    };
    REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // PRIVATE FUNCTION TO ADD THE ID AT THE RIGHT ARRAY, INSIDE OF THE egsSyncItemsPerRequest LIMIT
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const addToRightArray = (TYPE, ARRAY, OBJ) => {
    if (TYPE === 'article' || TYPE === 'tutorial') {
      if (`${OBJ.type}` !== `${TYPE}`) return;
    }
    const thisArray = ARRAY;
    if (thisArray.length === 0) thisArray.push([]);
    thisArray[(thisArray.length - 1)].push(OBJ.id ? OBJ.id : OBJ);
    if ((thisArray[(thisArray.length - 1)].length + 1) > setup.egsSyncItemsPerRequest) {
      thisArray.push([]);
    }
  };
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // PREPARING QUEUE JOBS
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  try {
    const contentArray = setup
    && setup.rbacAccessPermissions
    && setup.rbacAccessPermissions.content
      ? adp.clone(setup.rbacAccessPermissions.content)
      : [];

    const assetArray = setup
    && setup.rbacAccessPermissions
    && setup.rbacAccessPermissions.assets
      ? adp.clone(setup.rbacAccessPermissions.assets)
      : [];

    const groupArticleArray = [];
    const groupTutorialArray = [];
    const groupAssetArray = [];

    while (contentArray.length > 0) {
      const object = contentArray.splice(0, 1)[0];
      addToRightArray('article', groupArticleArray, object);
      addToRightArray('tutorial', groupTutorialArray, object);
    }

    while (assetArray.length > 0) {
      const object = assetArray.splice(0, 1)[0];
      addToRightArray('asset', groupAssetArray, object);
    }

    let queueJobIndex = await adp.queue.getNextIndex(queueObjective);
    const jobQueue = [];
    groupArticleArray.forEach((IDS) => {
      const job = {
        command: 'adp.egsSync.egsSyncCheckGroups',
        parameters: [
          'article',
          IDS,
        ],
        index: queueJobIndex,
      };
      jobQueue.push(job);
      queueJobIndex += 1;
    });
    groupTutorialArray.forEach((IDS) => {
      const job = {
        command: 'adp.egsSync.egsSyncCheckGroups',
        parameters: [
          'tutorial',
          IDS,
        ],
        index: queueJobIndex,
      };
      jobQueue.push(job);
      queueJobIndex += 1;
    });
    groupAssetArray.forEach((IDS) => {
      const job = {
        command: 'adp.egsSync.egsSyncCheckGroups',
        parameters: [
          'asset',
          IDS,
        ],
        index: queueJobIndex,
      };
      jobQueue.push(job);
      queueJobIndex += 1;
    });

    if (jobQueue.length > 0) {
      adp.queue.addJobs('egsSync', 'egsSync', queueObjective, jobQueue)
        .then(() => {
          const obj = {
            code: 200,
            message: 'Request added to the queue',
          };
          adp.echoLog(`${jobQueue.length} job(s) added to the queue.`, null, 200, packName, false);
          RESOLVE(obj);
        })
        .catch(ERROR => REJECT(ERROR));
    } else {
      const obj = {
        code: 204,
        message: 'No content - Nothing found to be synchronized',
      };
      RESOLVE(obj);
    }
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
    const errorObject = {
      duration: `${((new Date()).getTime()) - timer}ms`,
      error: ERROR,
    };
    REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
