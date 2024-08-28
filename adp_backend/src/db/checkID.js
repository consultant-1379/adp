// ============================================================================================= //
/**
* [ adp.db.checkID ]
* Analyse and prepare the ID ( CouchDB Registers Compatibility )
* If COLLECTION in /adp_backend/src/setup/dataBaseSetup.json contains "useObjectID": true,
* means the COLLECTION should use ObjectID ( Mongo feature ) instead string.
* @param {string} COLLECTION The name of the collection where this should be saved.
* @param {object} OBJECT JSON Object to be inserted on the collection.
* @param {boolean} ADD If true, add an new _id if there is none.
* @return Returns the full object with the right ID.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
const mongoObjectIDCollectionList = [];
// ============================================================================================= //
module.exports = (COLLECTION, OBJECT, ADD = false) => {
  if (mongoObjectIDCollectionList.length === 0) {
    const arrayOfCollections = adp.clone(adp.config.database);
    arrayOfCollections.forEach((ITEM) => {
      if (ITEM.useObjectID === true) {
        mongoObjectIDCollectionList.push(ITEM.collection);
      }
    });
  }
  const obj = OBJECT;
  if (mongoObjectIDCollectionList.includes(COLLECTION) === false) {
    if ((obj._id === undefined || obj._id === null) && (ADD)) {
      const newID = new adp.MongoObjectID();
      obj._id = `${newID}`;
    }
    return obj;
  }
  if (typeof obj._id === 'string' && obj._id.trim().length === 24) {
    obj._id = new adp.MongoObjectID(obj._id.trim());
  } else if ((obj._id === undefined || obj._id === null) && (ADD)) {
    obj._id = new adp.MongoObjectID();
  }
  return obj;
};
// ============================================================================================= //
