// ============================================================================================= //
/**
* [ adp.mimer.mimerElasticSearchSyncClear ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = MSID => new Promise((RESOLVE, REJECT) => {
  const elasticSync = new adp.mimer.MimerElasticSearchSync();
  elasticSync.clearElasticDocuments(MSID)
    .then((SUCCESS) => {
      RESOLVE(SUCCESS);
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
});
// ============================================================================================= //
