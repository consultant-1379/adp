// ============================================================================================= //
/**
* [ global.adp.migration.dateModifiedRecovery ]
* Check if "date_modified" exists. If not, try to get from "adpLog" or
* apply the default value: '2018-02-01T00:00:00.000Z'
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign                                                              */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  if (MS.date_modified !== undefined && MS.date_modified !== null) {
    // If date_modified exists, do nothing...
    RESOLVE(true);
    return;
  }
  const packName = 'global.adp.migration.dateModifiedRecovery';
  const thisID = MS._id;
  const adpLogModel = new adp.models.AdpLog();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  // Reading all the adpLogs for the specific Asset/Microservice.
  // If there is more than one, gets the most recent.
  // If there is no one, just use the default date/time.
  adpLogModel.getNewOrUpdateByID(thisID)
    .then((LOGOBJECT) => {
      let lastDate = null;
      LOGOBJECT.docs.forEach((LOG) => {
        const tempDate = LOG.datetime;
        if (lastDate === null) {
          lastDate = tempDate;
        } else {
          const previousDate = new Date(lastDate);
          const foundDate = new Date(tempDate);
          const diff = previousDate.getTime() - foundDate.getTime();
          if (diff < 0) {
            lastDate = tempDate;
          }
        }
      });
      if (lastDate !== null) {
        MS.date_modified = lastDate;
      } else {
        MS.date_modified = '2018-02-01T00:00:00.000Z';
      }
      RESOLVE(MS);
    })
    .catch((ERROR) => {
      // Unexpected Error. So, no changes...
      const obj = {
        id: thisID,
        error: ERROR,
      };
      adp.echoLog('Error in [ adpLogModel.getNewOrUpdateByID ]', obj, 500, packName, true);
      RESOLVE(true);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
