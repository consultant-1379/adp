// ============================================================================================= //
/**
* [ cs.logDetails ]
* Apply +1 to a custom counter
* @param {string} STR String to identify the reason of the log.
* @param {string} SUBLEVEL If you need a sublevel. Can be null.
* @param {string} LOCALID If you don't want to repeat microservices, inform
* the microservice ID here. Can be null.
* Returns nothing. Variable is read at the end of the process.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = (STR, SUBLEVEL = null, LOCALID = null) => {
  let canAdd = true;
  if (cs.logDetailsCacheIDs === undefined) {
    cs.logDetailsCacheIDs = [];
  }
  if (LOCALID !== null) {
    const tempID = `${(STR).toString('base64')}_${(LOCALID).toString('base64')}}`;
    if (cs.logDetailsCacheIDs.includes(tempID) === true) {
      canAdd = false;
    } else {
      cs.logDetailsCacheIDs.push(tempID);
    }
  }
  if (canAdd) {
    if (SUBLEVEL !== null) {
      if (adp.fullLogDetails[SUBLEVEL] === undefined) {
        adp.fullLogDetails[SUBLEVEL] = {};
      }
      if (adp.fullLogDetails[SUBLEVEL][STR] === undefined) {
        adp.fullLogDetails[SUBLEVEL][STR] = 0;
      }
      adp.fullLogDetails[SUBLEVEL][STR] += 1;
    } else {
      if (adp.fullLogDetails[STR] === undefined) {
        adp.fullLogDetails[STR] = 0;
      }
      adp.fullLogDetails[STR] += 1;
    }
  }
};
// ============================================================================================= //
