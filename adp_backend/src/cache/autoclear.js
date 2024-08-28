// ============================================================================================= //
/**
* [ global.adp.cache.autoclear ]
* WIP
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
// global.adp.docs.list.push(__filename)
// ============================================================================================= //
module.exports = (OBJ) => {
  if (!(Array.isArray(OBJ))) {
    return { ok: false, msg: '[ global.adp.cache.autoclear ] OBJ is not an Array...' };
  }
  OBJ.forEach((item) => {
    if (((new Date()) - item.date) > (global.adp.cache.timeInSeconds * 1000)) {
      /* eslint-disable no-param-reassign */
      /* Why? This is the core of this function. */
      delete OBJ[item.id];
      /* eslint-disable no-param-reassign */
    }
  });
  return { ok: true, msg: '[ global.adp.cache.autoclear ] OBJ is cleared of expired cache!' };
};
// ============================================================================================= //
