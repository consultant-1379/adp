// ============================================================================================= //
/**
* [ adp.innerSource.lastAssetStatus ]
* Retrieve the last reading commit status of selected Asset.
* @param {String} ID _id or slug of the Microservice.
* @return {JSON} Returns a JSON Object containing the information.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = ID => new Promise((RESOLVE) => {
  const dbModelAdplog = new adp.models.AdpLog();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const timer = new Date();
  const packName = 'adp.innerSource.lastAssetStatus';
  dbModelAdplog.getContributorsStatisticsByModeID(ID)
    .then((RESULT) => {
      if (Array.isArray(RESULT.docs) && (RESULT.docs.length > 0)) {
        const logs = RESULT.docs.sort(adp.dynamicSort('-end'));
        const log = logs[0];
        let target = null;
        if (Array.isArray(log.success)) {
          log.success.forEach((ITEM) => {
            if (ITEM.asset_id === ID || ITEM.asset_slug === ID) {
              target = ITEM;
            }
          });
        }
        if (target === null) {
          if (Array.isArray(log.errors)) {
            log.errors.forEach((ITEM) => {
              if (ITEM.asset_id === ID || ITEM.asset_slug === ID) {
                target = ITEM;
              }
            });
          }
        }
        if (target === null) {
          RESOLVE({ lastStatusCode: 404, lastStatusMessage: `Information about the commits of [ ${ID} ] was not found`, lastStatusResponse: null });
        } else {
          let useThisCode = 200;
          let useThisMessage = 'Successful';
          if (target.desc !== 'success') {
            useThisCode = 500;
            useThisMessage = 'Error. Please see details in lastStatusResponse.';
          }
          RESOLVE({
            lastStatusCode: useThisCode,
            lastStatusMessage: useThisMessage,
            lastStatusResponse: target,
          });
        }
      } else {
        RESOLVE({ lastStatusCode: 404, lastStatusMessage: `Information about the commits of [ ${ID} ] was not found`, lastStatusResponse: null });
      }
    })
    .catch((ERROR) => {
      const errorText = `Error in [ dbModelAdplog.getContributorsStatisticsByModeID ] in ${(new Date()) - timer}ms`;
      const errorObj = {
        id: ID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, true);
      RESOLVE({ lastStatusCode: 500, lastStatusMessage: 'Internal Server Error', lastStatusResponse: null });
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
