// ============================================================================================= //
/**
* [ adp.mimer.mimerElasticSearchSyncAction ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = (
  MSID,
  MSSLUG,
  MSNAME,
  VERSION,
  ISMIMERDEVELOPMENT,
  DOCUMENTNUMBER,
  DOCUMENTREVISION,
  DOCUMENTLANGUAGE,
  ASSETTYPE,
) => new Promise(async (RESOLVE, REJECT) => {
  const elasticSync = new adp.mimer.MimerElasticSearchSync();
  elasticSync.sync(
    MSID,
    MSSLUG,
    MSNAME,
    VERSION,
    ISMIMERDEVELOPMENT,
    DOCUMENTNUMBER,
    DOCUMENTREVISION,
    DOCUMENTLANGUAGE,
    ASSETTYPE,
  )
    .then(async (SUCCESS) => {
      RESOLVE(SUCCESS);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
