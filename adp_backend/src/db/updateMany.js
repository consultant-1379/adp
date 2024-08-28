// ============================================================================================= //
/**
* [ adp.db.updateMany ]
* Update multiple register from DataBase.
* @param {string} COLLECTION the Mongodb collection name
* @param {object} FILTER the selection criteria for update
* @param {object} UPDATE the modifications to apply
* @param {object} OPTIONS the extra options for operation
* @return {Object} Returns the response from DataBase.
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, FILTER, UPDATE, OPTIONS = {}) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.updateMany';
  if (!COLLECTION || typeof COLLECTION !== 'string') {
    const txt = 'Error: Parameter COLLECTION must be string';
    const errorMSG = [txt];
    REJECT(errorMSG);
    return;
  }
  if (!FILTER || !UPDATE || typeof FILTER !== 'object' || typeof UPDATE !== 'object') {
    const txt = 'Error: Parameter FILTER or UPDATE must be an Object';
    const errorMSG = [txt];
    REJECT(errorMSG);
    return;
  }
  adp.mongoDatabase.collection(COLLECTION).updateMany(FILTER, UPDATE, OPTIONS)
    .then((updateResp) => {
      const RESULT = updateResp.result;
      if (RESULT && RESULT.ok === 1) {
        const objTemplate = {
          ok: true,
          rev: null,
          matchedCount: RESULT.n,
          modifiedCount: RESULT.nModified,
        };
        adp.masterCache.clearBecauseCUD();
        RESOLVE(objTemplate);
      } else {
        const error = { message: `Document was not updated into DB Mongo Collection [${COLLECTION}]`, code: 500, data: updateResp.result };
        const errorText = `Error on [ adp.mongoDatabase.collection(${COLLECTION}).updateMany() ] return`;
        const errorObj = {
          message: error.message,
          collection: COLLECTION,
          object: UPDATE,
          error: updateResp.result,
        };
        adp.echoLog(errorText, errorObj, error.code, packName);
        REJECT(errorObj);
      }
    }).catch((errorBulkUpdate) => {
      const error = {
        message: 'Bulk update Operation Failure',
        code: 500,
        data: {
          errorBulkUpdate,
        },
      };
      adp.echoLog(error.message, error.data, error.code, packName);
      REJECT(error);
    });
});
// ============================================================================================= //
