// ============================================================================================= //
/**
* [ global.adp.users.get ]
* Returns a list of users.
* @param {Object} REQ The Request Object of this action.
* @return Returns an Object with a list of Users.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'global.adp.users.get';
  const dbModel = new adp.models.Adp();
  try {
    const startedAt = new Date();
    await dbModel.indexUsers()
      .then((RESULT) => {
        const resultOfQuery = RESULT.docs;
        resultOfQuery.map((ITEM) => {
          const item = ITEM;
          delete item._rev;
          return item;
        });
        const answer = new global.adp.Answers();
        answer.setCode(200);
        answer.setCache('Not from Cache');
        answer.setMessage('200 - Search Successful');
        answer.setTotal(resultOfQuery.length);
        answer.setData(resultOfQuery);
        answer.setSize(global.adp.getSizeInMemory(resultOfQuery));
        answer.setLimit(999999999);
        answer.setPage(0);
        const theEndTime = new Date() - startedAt;
        answer.setTime(theEndTime);
        adp.echoLog(`Finishing the search in ${theEndTime}ms.`, null, 200, packName);
        RESOLVE(answer);
      })
      .catch((ERR) => {
        const errorText = 'Error in [ dbModel.indexUsers ]';
        const errorOBJ = {
          error: ERR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERR);
      });
  } catch (e) {
    const errorText = 'Error in try/catch block';
    const errorOBJ = {
      error: e,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
    REJECT(e);
  }
});
// ============================================================================================= //
