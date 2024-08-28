// ============================================================================================= //
/**
* [ adp.egsSync.egsSyncSendPayload ]
* Send the Payload to the external server.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const errorLog = require('../library/errorLog');
// ============================================================================================= //
const packName = 'adp.egsSync.egsSyncSendPayload';
// ============================================================================================= //
module.exports = (PAYLOADID, QUEUEOBJECTIVE) => new Promise(async (RESOLVE, REJECT) => {
  try {
    const egsSync = new adp.egsSync.EgsSyncClass(QUEUEOBJECTIVE);
    await egsSync.closePayloadsToSend();
    const sentIds = await egsSync.sendPayload(PAYLOADID);
    RESOLVE({ sentIds });
  } catch (ERROR) {
    const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
    const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
    const errorObject = {
      error: ERROR,
    };
    REJECT(errorLog(errorCode, errorMessage, errorObject, 'getPayload', packName));
  }
});
// ============================================================================================= //
