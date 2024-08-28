// ============================================================================================= //
/**
* [ adp.db.update ]
* Updates a register on DataBase.<br/>
* <b>Important:</b> In native code, you have to send all the object to be replaced. But with
* this function, you can send only what is changed or the new fields.
* @param {string} COLLECTION The name of the Database.
* @param {JSON} OBJ JSON Object with the update.
* You have to inform the <b>_id</b> inside this <b>JSON Object</b>. Then, this register will be
* localized, analysed field by field to update the changes and apply on DataBase.
* @param {Boolean} NOTCHECKID Set to true if you want to avoid
* the automatic ID check for CouchDB x MongoDB. Default is false.
* @return {JSON} Returns the answer of DataBase.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, OBJ, NOTCHECKID = false) => new Promise((RESOLVE, REJECT) => {
  const packName = 'adp.db.update';
  if (OBJ === null || OBJ === undefined) {
    const errorMSG = ['Error: Parameter cannot be NULL or UNDEFINED'];
    REJECT(errorMSG);
    return;
  }
  let properties = 0;
  Object.keys(OBJ).forEach((item) => {
    if (item !== 'id' && item !== '_id') {
      properties += 1;
    }
  });
  if (properties === 0) {
    const errorMSG = ['Error: Parameter cannot be EMPTY'];
    REJECT(errorMSG);
    return;
  }
  if (OBJ._id === null || OBJ._id === undefined) {
    const errorMSG = ['Error: Parameter do not have an _id property'];
    REJECT(errorMSG);
    return;
  }

  const obj = NOTCHECKID ? OBJ : adp.db.checkID(COLLECTION, OBJ, false);
  adp.db.read(COLLECTION, obj._id)
    .then((originalToUpdate) => {
      const toUpdate = originalToUpdate;
      Object.keys(obj).forEach((item) => {
        if (item !== 'id' && item !== '_id') {
          let removeIt = false;
          const theValue = obj[item];
          if (Array.isArray(theValue)) {
            if (theValue.length === 0) {
              removeIt = true;
            }
          } else if (typeof theValue === 'string') {
            if ((theValue.trim()).length === 0) {
              removeIt = true;
            }
          } else if (theValue === null) {
            removeIt = true;
          }
          if (removeIt) {
            delete toUpdate[item];
          } else {
            toUpdate[item] = OBJ[item];
          }
        }
      });

      const theID = obj._id;
      delete toUpdate._rev;
      const objectID = { _id: theID };

      adp.mongoDatabase.collection(COLLECTION).replaceOne(objectID, toUpdate)
        .then((updateResp) => {
          if (updateResp.result !== undefined && updateResp.result.ok === 1) {
            const objTemplate = {
              ok: true,
              id: `${theID}`,
              rev: null,
            };
            RESOLVE(objTemplate);
            if (toUpdate.type === 'microservice' || toUpdate.type === 'user') {
              adp.masterCache.clearBecauseCUD(objTemplate.id);
            }
          } else {
            const errorText = 'Error in [ adp.mongoDatabase.collection().replaceOne() ] response';
            const errorObject = {
              collection: COLLECTION,
              id: theID,
              object: toUpdate,
              message: 'response.ok is not equal 1',
              response: updateResp,
            };
            adp.echoLog(errorText, errorObject, 500, packName, false);
            REJECT(errorObject);
          }
        })
        .catch((ERROR) => {
          const errorText = 'Catch an error on [ adp.mongoDatabase.collection().replaceOne() ]';
          const errorObject = {
            collection: COLLECTION,
            id: theID,
            object: toUpdate,
            error: ERROR,
          };
          adp.echoLog(errorText, errorObject, 500, packName, false);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.db.read ]';
      const errorObject = {
        collection: COLLECTION,
        id: OBJ._id,
        object: OBJ,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
