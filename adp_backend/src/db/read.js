// ============================================================================================= //
/**
* [ adp.db.read ]
* Read a register from DataBase.
* @param {String} INDEX The ID of the register.
* @return Returns the answer from DataBase.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, INDEX) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.read';
  if (INDEX === null || INDEX === undefined) {
    const errorMSG = ['Error: Parameter cannot be NULL or UNDEFINED'];
    REJECT(errorMSG);
    return;
  }
  if (typeof INDEX !== 'string' && !(INDEX instanceof String) && !adp.MongoObjectID.isValid(INDEX)) {
    const errorMSG = ['Error: Parameter must be a STRING or Mongo Object ID'];
    REJECT(errorMSG);
    return;
  }

  const target = adp.db.checkID(COLLECTION, { _id: INDEX }, false);
  adp.mongoDatabase.collection(COLLECTION).findOne(target)
    .then((findData) => {
      RESOLVE(findData);
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().findOne() ]';
      const errorObject = {
        collection: COLLECTION,
        id: INDEX,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
