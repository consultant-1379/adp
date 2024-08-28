// ============================================================================================= //
/**
* [ global.adp.user.get ]
* Get one user from DataBase.
* @param {String} USERNAME A string with the <b>username</b>.
* @returns {JSON} Returns the information of the user.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const packName = 'global.adp.user.get';
// ============================================================================================= //
module.exports = USERNAME => new Promise((RESOLVE, REJECT) => {
  try {
    global.adp.user.thisUserShouldBeInDatabase(USERNAME)
      .then((USER) => {
        RESOLVE(USER);
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ adp.user.thisUserShouldBeInDatabase ]';
        const errorOBJ = {
          signum: USERNAME,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      });
  } catch (ERROR) {
    const errorText = 'Error in try/catch block';
    const errorOBJ = {
      signum: USERNAME,
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
    REJECT(ERROR);
  }
});
// ============================================================================================= //
