// ============================================================================================= //
/**
 * [ adp.db.aggregate ]
 * Uses the aggregate command on DataBase.
 * @param {String} INDEX The ID of the register.
 * @param {array} STEPS the aggregate pipeline stages
 * @param {object} [OPTIONS={}] the options for the aggregate function
 *
 * @return Returns the answer from DataBase.
 * @author Armando Dias [zdiaarm]
 */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (COLLECTION, STEPS, OPTIONS = {}) => new Promise((RESOLVE, REJECT) => {
  let options = OPTIONS;
  const timer = new Date();
  const packName = 'adp.db.aggregate';
  if (typeof COLLECTION !== 'string' || (`${COLLECTION}`).trim() === 0) {
    const errorMSG = ['Error: Parameter COLLECTION should be a non-empty string'];
    const errorOBJ = {
      error: errorMSG[0],
      collection: COLLECTION,
      steps: STEPS,
    };
    adp.echoLog('Bad Request', errorOBJ, 400, packName, false);
    REJECT(errorMSG);
    return;
  }
  if (!Array.isArray(STEPS)) {
    const errorMSG = ['Error: Parameter STEPS should be an Array'];
    const errorOBJ = {
      error: errorMSG[0],
      collection: COLLECTION,
      steps: STEPS,
    };
    adp.echoLog('Bad Request', errorOBJ, 400, packName, false);
    REJECT(errorMSG);
    return;
  }
  if (typeof options !== 'object') {
    options = {};
  }
  // This callBack is asynchronous,
  // that's the reason of the async/await
  adp.mongoDatabase.collection(COLLECTION).aggregate(
    STEPS,
    options,
    async (err, docs) => {
      if (err !== null) {
        REJECT(err);
        return;
      }

      const resultList = [];
      await docs.forEach((doc) => {
        const item = doc;
        resultList.push(item);
      });

      const finalResult = await {
        resultsReturned: resultList.length,
        limitOfThisResult: 999999999,
        offsetOfThisResult: 0,
        message: 'Search Successful',
        time: `${(new Date()).getTime() - timer.getTime()} ms`,
        docs: resultList,
      };

      RESOLVE(finalResult);
    },
  );
});
// ============================================================================================= //
