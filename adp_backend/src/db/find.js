// ============================================================================================= //
/**
* [ adp.db.find ]
* Retrieve a register from DataBase with more options.
* @param {string} DB the couchdb database or the Mongodb collection name
* @param {object} SELECTOR the couchdb or mongo query
* @param {object} OPTIONS
* @return {Object} Returns the answer from DataBase.
* @author Armando Schiavon Dias [escharm]
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (
  COLLECTION,
  QUERY,
  OPTIONS = { skip: 0, limit: 999999 },
  PROJECTION = {},
) => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'adp.db.find';

  if (typeof QUERY !== 'object') {
    const txt = 'Error: Parameter QUERY must be an Object';
    const errorMSG = [txt];
    REJECT(errorMSG);
    return;
  }
  const theQuery = adp.db.checkID(COLLECTION, QUERY, false);
  adp.mongoDatabase.collection(COLLECTION).find(theQuery)
    .project(PROJECTION)
    .sort(OPTIONS && OPTIONS.sort ? OPTIONS.sort : undefined)
    .skip(OPTIONS && OPTIONS.skip ? OPTIONS.skip : 0)
    .limit(OPTIONS && OPTIONS.limit ? OPTIONS.limit : 999999)
    .toArray()
    .then((findData) => {
      if (Array.isArray(findData)) {
        const headerAndReturnedDocsAsView = {
          resultsReturned: findData.length,
          limitOfThisResult: OPTIONS.limit,
          offsetOfThisResult: OPTIONS.skip,
          message: 'Search Successful',
          time: `${(new Date()).getTime() - timer.getTime()} ms`,
          docs: findData,
        };
        RESOLVE(headerAndReturnedDocsAsView);
      } else {
        const errorText = 'Error in [ adp.mongoDatabase.collection().find() ]: Result is not an Array!';
        const errorObject = {
          collection: COLLECTION,
          query: QUERY,
          projection: PROJECTION,
          error: findData,
        };
        adp.echoLog(errorText, errorObject, 500, packName, false);
        REJECT(errorObject);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Catch an error on [ adp.mongoDatabase.collection().find() ]';
      const errorObject = {
        collection: COLLECTION,
        query: QUERY,
        projection: PROJECTION,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObject, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
