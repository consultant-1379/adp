// ============================================================================================= //
/**
* [ adp.db.create ]
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
module.exports = (COLLECTION, OBJ) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.create';

  if (OBJ === null || OBJ === undefined) {
    const msg = ['Error: Parameter cannot be NULL or UNDEFINED'];
    REJECT(msg);
    return;
  }

  const counter = Object.keys(OBJ).length;
  if (counter === 0) {
    const msg = ['Error: Parameter cannot be EMPTY'];
    REJECT(msg);
    return;
  }

  let obj = OBJ;
  Object.keys(obj).forEach((key) => {
    if (Array.isArray(obj[key])) {
      if (obj[key].length === 0) {
        delete obj[key];
      }
    } else if (typeof obj[key] === 'string') {
      if ((obj[key].trim()).length === 0) {
        delete obj[key];
      }
    } else if (obj[key] === null) {
      delete obj[key];
    }
  });

  obj = adp.db.checkID(COLLECTION, obj, true);
  adp.mongoDatabase.collection(COLLECTION).insertOne(obj)
    .then((insertResp) => {
      const docCreated = (insertResp.result && insertResp.result.ok === 1);
      if (docCreated) {
        const objTemplate = {
          ok: true,
          id: `${insertResp.insertedId}`,
          rev: null,
        };
        RESOLVE(objTemplate);
        if (obj.type === 'microservice') {
          adp.masterCache.clearBecauseCUD();
        }
      } else {
        const error = { message: `Document was not inserted into DB Mongo Collection [${COLLECTION}]`, code: 500, data: insertResp.result };
        const errorText = 'Error on [ adp.mongoDatabase.collection().insertOne() ] return';
        const errorObj = {
          message: error.message,
          collection: COLLECTION,
          object: OBJ,
          error: insertResp.result,
        };
        adp.echoLog(errorText, errorObj, error.code, packName);
        REJECT(error);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().insertOne() ]';
      const errorObj = {
        collection: COLLECTION,
        error: ERROR,
        object: OBJ,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
      const error = [`Error: ${ERROR}`];
      REJECT(error);
    });
});
// ============================================================================================= //
