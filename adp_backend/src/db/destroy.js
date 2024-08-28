// ============================================================================================= //
/**
* [ adp.db.destroy ]
* Delete ( for real ) a register on DataBase.
* @param {String} ID A String to inform the <B>ID</B> of the register.
* @return Returns the answer from DataBase.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, ID) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.destroy';
  if (typeof ID !== 'string' && !(ID instanceof String)) {
    const errorMSG = ['Error: Parameter ID must be a STRING'];
    REJECT(errorMSG);
    return;
  }
  const target = adp.db.checkID(COLLECTION, { _id: ID }, false);
  adp.mongoDatabase.collection(COLLECTION).deleteOne(target)
    .then((deleteResp) => {
      if (deleteResp.result !== undefined && deleteResp.result.ok === 1) {
        const resultTemplate = {
          ok: true,
          id: `${ID}`,
          rev: null,
        };
        RESOLVE(resultTemplate);
        global.adp.masterCache.clearBecauseCUD(ID);
      } else {
        const errorText = 'The result object looks invalid';
        const errorObj = {
          collection: COLLECTION,
          id: ID,
          result: deleteResp,
        };
        adp.echoLog(errorText, errorObj, 500, packName, false);
        REJECT(errorObj);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().deleteOne() ]';
      const errorObj = {
        collection: COLLECTION,
        id: ID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
