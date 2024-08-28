// ============================================================================================= //
/**
* [ global.adp.cache.set ]
* WIP
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
// global.adp.docs.list.push(__filename)
// ============================================================================================= //
module.exports = (OBJ, ID, DATA) => {
  global.adp.cache.autoclear(OBJ);
  if (!(Array.isArray(OBJ))) {
    return { ok: false, msg: '[ global.adp.cache.set ] OBJ is not an Array...' };
  }
  if (typeof ID !== 'string' && !(ID instanceof String)) {
    return { ok: false, msg: '[ global.adp.cache.set ] ID is not a String...' };
  }
  if (ID.trim().length === 0) {
    return { ok: false, msg: '[ global.adp.cache.set ] ID cannot be empty...' };
  }
  try {
    const toCache = { id: ID, date: new Date(), data: DATA };
    /* eslint-disable no-param-reassign */
    /* Why? Change this object is the core of this function. */
    OBJ[ID] = toCache;
    /* eslint-enable no-param-reassign */
    return { ok: true, msg: `[ global.adp.cache.set ] " ${ID} " cached!` };
  } catch (ERROR) {
    return { ok: false, msg: `[ global.adp.cache.set ] ERROR: ${ERROR}` };
  }
};
// ============================================================================================= //
