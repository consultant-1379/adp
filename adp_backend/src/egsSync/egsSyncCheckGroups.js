// ============================================================================================= //
/**
* [ adp.egsSync.egsSyncCheckGroups ]
* Check each group of IDs.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //
const packName = 'adp.egsSync.egsSyncCheckGroups';
// ============================================================================================= //
module.exports = (TYPE, IDARRAY, QUEUEOBJECTIVE) => new Promise((RESOLVE, REJECT) => {
  const timer = (new Date()).getTime();
  const egsSync = new adp.egsSync.EgsSyncClass(QUEUEOBJECTIVE);
  egsSync.checkGroup(TYPE, IDARRAY)
    .then((RESULT) => {
      RESOLVE(RESULT);
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
      const errorObject = {
        class: 'adp.egsSync.EgsSyncClass',
        method: 'egsSync.checkGroup',
        duration: `${((new Date()).getTime()) - timer}ms`,
        error: ERROR,
      };
      REJECT(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    });
});
// ============================================================================================= //
