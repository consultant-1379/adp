// ============================================================================================= //
/**
* [ adp.db.createMany ]
* Creates a register on DataBase. The Object Schema should be tested before, once this layer
* do not have responsabilities for the content.
* @param {string} COLLECTION The name of the collection where this should be saved.
* @param {object} OBJ JSON Object to be inserted on the collection.
* @return Returns the response from DataBase.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, OBJARRAY, UPSERT = true) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.createMany';
  if (typeof COLLECTION !== 'string') {
    const msg = ['Error: Parameter COLLECTION should be a string'];
    REJECT(msg);
    return;
  }
  if (!Array.isArray(OBJARRAY) || OBJARRAY.length === 0) {
    const msg = ['Error: Parameter OBJARRAY should be an Array of Objects'];
    REJECT(msg);
    return;
  }

  adp.mongoDatabase.collection(COLLECTION).insertMany(OBJARRAY, { ordered: true, upsert: UPSERT })
    .then((insertResp) => {
      const result = {};
      result.ok = (insertResp && insertResp.result && insertResp.result.ok === 1);
      RESOLVE(result);
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().insertMany() ]';
      const errorObj = {
        error: ERROR,
        collection: COLLECTION,
        object: OBJARRAY,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
      const error = [`Error: ${ERROR}`];
      REJECT(error);
    });
});
// ============================================================================================= //
