// ============================================================================================= //
/**
* [ adp.db.checkIDForArrays ]
* Apply the ObjectID ( Mongo feature ) on array where doesn't have the "_id"
* explicit attribute ( Array os IDs ).
* Case one or more IDs are invalid, this function will keep the string.
* @param {Array} THEARRAYOFIDS Simple array of strings with the IDs.
* @return Returns the updated Array: Same values, but using Mongo ObjectID.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (THEARRAYOFIDS) => {
  if (!Array.isArray(THEARRAYOFIDS)) {
    return THEARRAYOFIDS;
  }
  const ids = THEARRAYOFIDS.map((theID) => {
    let updatedID = theID;
    try {
      updatedID = new adp.MongoObjectID((`${theID}`).trim());
    } catch (ERROR) {
      updatedID = theID;
    }
    return updatedID;
  });
  return ids;
};
// ============================================================================================= //
