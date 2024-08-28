// ============================================================================================= //
/**
* [ global.adp.cache.get ]
* WIP
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
// global.adp.docs.list.push(__filename)
// ============================================================================================= //
module.exports = (OBJ, ID) => {
  global.adp.cache.autoclear(OBJ);
  if (!(Array.isArray(OBJ))) {
    return { ok: false, msg: '[ global.adp.cache.get ] OBJ is not an Array...' };
  }
  if (typeof ID !== 'string' && !(ID instanceof String)) {
    return { ok: false, msg: '[ global.adp.cache.get ] ID is not a String...' };
  }
  if (ID.trim().length === 0) {
    return { ok: false, msg: '[ global.adp.cache.get ] ID cannot be empty...' };
  }
  try {
    const toReturn = OBJ[ID];
    if (toReturn === null || toReturn === undefined) {
      return { ok: false, msg: `[ global.adp.cache.get ] " ${ID} " not in cache!` };
    }
    if (((new Date()) - toReturn.date) > (global.adp.cache.timeInSeconds * 1000)) {
      /* eslint-disable no-param-reassign */
      /* Why? Change this object is the core of this function. */
      delete OBJ[ID];
      /* eslint-enable no-param-reassign */
      return { ok: false, msg: `[ global.adp.cache.get ] " ${ID} " time expired!` };
    }
    /* eslint-disable no-param-reassign */
    /* Why? Change this object is the core of this function. */
    // OBJ[ID].date = new Date();
    /* eslint-enable no-param-reassign */
    return { ok: true, msg: `[ global.adp.cache.get ] " ${ID} " is in cache!`, data: OBJ[ID] };
  } catch (ERROR) {
    return { ok: false, msg: `[ global.adp.cache.get ] ERROR: ${ERROR}` };
  }
};
// ============================================================================================= //
