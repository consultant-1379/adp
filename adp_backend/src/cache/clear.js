// ============================================================================================= //
/**
* [ global.adp.cache.clear ]
* WIP
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
// global.adp.docs.list.push(__filename)
// ============================================================================================= //
module.exports = (OBJ) => {
  if (!(Array.isArray(OBJ))) {
    return { ok: false, msg: '[ global.adp.cache.clear ] OBJ is not an Array...' };
  }
  /* eslint-disable no-param-reassign */
  /* Why? This is the core of this function. */
  OBJ = [];
  /* eslint-disable no-param-reassign */
  return { ok: true, msg: '[ global.adp.cache.clear ] OBJ is clear!' };
};
// ============================================================================================= //
