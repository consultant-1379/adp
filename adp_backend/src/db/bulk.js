/**
* [ adp.db.bulk ]
* @author Armando Dias [zdiaarm]
*/
global.adp.docs.list.push(__filename);
const packageName = 'adp.db.bulk';

/**
 * Mongo Bulk Operations for update(upsert) and insert only
 * @param {string} DB the collection to connect to
 * @param {array} snapshotList the list of snapshots to bulk insert/update
 * @param {boolean} [COUCHFORMAT=false] only for mongo, will return in couch structure
 * @returns {array} couch response array of updated/upserted items ids and responses if
 * COUCHFORMAT is true
 * {object} standard mongo bulk response object if COUCHFORMAT is false
 */
const mongoBulkOp = (DB, LISTOFSNAPSHOTS, COUCHFORMAT) => new Promise((RESOLVE, REJECT) => {
  const couchFormatResp = [];
  const upsertQuery = LISTOFSNAPSHOTS.map((docObj) => {
    if (docObj._id) {
      couchFormatResp.push({
        ok: true,
        id: docObj._id,
      });

      return {
        updateOne: {
          filter: { _id: docObj._id },
          update: { $set: docObj },
          upsert: true,
        },
      };
    }
    const newDocObj = { ...docObj };
    const newID = new adp.MongoObjectID();
    newDocObj._id = `${newID}`;
    return { insertOne: { document: newDocObj } };
  });

  adp.mongoDatabase.collection(DB).bulkWrite(upsertQuery, { ordered: false })
    .then((bulkResp) => {
      if (COUCHFORMAT) {
        if (bulkResp.result.writeErrors.length || bulkResp.result.writeConcernErrors.length) {
          REJECT(bulkResp);
        } else {
          if (bulkResp.insertedCount) {
            const insertDocs = bulkResp.result.insertedIds.map(
              docObj => ({ ok: true, id: `${docObj._id}` }),
            );
            couchFormatResp.push(...insertDocs);
          }
          RESOLVE(couchFormatResp);
        }
      } else {
        RESOLVE(bulkResp);
      }
    }).catch((errorBulkWrite) => {
      const error = { message: 'Bulk [couchDB] Operation Failure', code: 500, data: { error: errorBulkWrite, DB, LISTOFSNAPSHOTS } };
      adp.echoLog(error.message, error.data, error.code, packageName, false);
      REJECT(error);
    });
});


module.exports = (DB, ARRAY, RETURNCOUCHFORMAT = false) => new Promise((RESOLVE, REJECT) => {
  const isArray = Array.isArray(ARRAY);
  if (!isArray || (isArray && ARRAY.length === 0)) {
    const msg = ['Error: Array parameter is empty or is not of type array'];
    REJECT(msg);
    return;
  }

  mongoBulkOp(DB, ARRAY, RETURNCOUCHFORMAT)
    .then(mongoResp => RESOLVE(mongoResp))
    .catch(errorMongoResp => REJECT(errorMongoResp));
});
