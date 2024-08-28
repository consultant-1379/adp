// ============================================================================================= //
/**
* [ adp.db.destroyMany ]
* Delete ( for real ) registers from DataBase based on a given filter.
* @param {Object} FILTER A MongoDB Filter to perform the deletion.
* @return Returns the answer from DataBase.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = (COLLECTION, FILTER) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.destroyMany';
  adp.mongoDatabase.collection(COLLECTION).deleteMany(FILTER)
    .then((RESULT) => {
      if (RESULT.result !== undefined && RESULT.result.ok === 1) {
        RESOLVE(RESULT);
      } else {
        REJECT(RESULT);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().deleteMany() ]';
      const errorObj = {
        collection: COLLECTION,
        filter: FILTER,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
