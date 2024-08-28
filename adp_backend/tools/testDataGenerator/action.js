// ============================================================================================= //
module.exports = (QUANTMS, QUANTUSER) => new Promise(async (RESOLVE) => {
  const packName = 'action';
  adp.actionCounter = {};
  adp.actionCounter.collections = 0;
  adp.actionCounter.registers = 0;
  adp.actionCounter.views = 0;
  adp.echoDivider();
  adp.echoDivider();
  await adp.elasticSearchStart();
  await adp.db.start()
    .then(() => {
      adp.restore(QUANTMS, QUANTUSER)
        .then(() => {
          adp.restoreElasticsearch()
            .then(() => {
              const successObj = {
                message: 'Elasticsearch and Mongo Database was successfully restored with data from the JSON Files!',
                collections: adp.actionCounter.collections,
                documents: adp.actionCounter.registers,
              };
              RESOLVE(successObj);
            })
            .catch((ERROR) => {
              const errorText = 'Error in [ adp.restoreElasticsearch ] at "Elasticsearch Mode"';
              const errorObj = {
                quantMS: QUANTMS,
                quantUser: QUANTUSER,
                error: ERROR,
              };
              adp.echoLog(errorText, errorObj, 500, packName, false);
            });
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ adp.restore ] at "Mongo Mode"';
          const errorObj = {
            quantMS: QUANTMS,
            quantUser: QUANTUSER,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObj, 500, packName, false);
        });
    }).catch((ERROR) => {
      const errorText = 'Error in [ adp.mongoConnection.connect() ] at "Mongo Mode"';
      const errorObj = {
        quantMS: QUANTMS,
        quantUser: QUANTUSER,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
    });
});
// ============================================================================================= //
