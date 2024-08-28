// ============================================================================================= //
/**
* [ adp.mimer.assetCacheClear ]
* Worker should request to Main Backend clear
* the cache for this specific asset.
* @param {string} ASSETID Asset ID.
* @param {string} ASSETSLUG Asset Slug.
* @return {Promise} Resolve if successful.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const packName = 'adp.mimer.assetCacheClear';
// ============================================================================================= //
module.exports = (ASSETID, ASSETSLUG) => new Promise((RESOLVE) => {
  const timer = (new Date()).getTime();
  adp.masterCache.clear('ALLASSETS', null, ASSETID);
  adp.masterCache.clear('DOCUMENTS', ASSETID);
  const endTimer = (new Date()).getTime();
  const diffTimer = endTimer - timer;
  const obj = {
    assetid: ASSETID,
    assetslug: ASSETSLUG,
    message: `Cache for [ ${ASSETSLUG} ] was cleared in ${diffTimer}ms`,
  };
  adp.echoLog(obj.message, null, 200, packName);
  RESOLVE(obj);
});
// ============================================================================================= //
