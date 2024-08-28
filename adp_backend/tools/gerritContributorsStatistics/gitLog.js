// ============================================================================================= //
/**
* [ cs.gitLog ]
* @author Armando Dias [zdiaarm]
*
* Process log for gerritContributorsStatistics
*/
// ============================================================================================= //
global.packageJson = require('../../package.json');
// ============================================================================================= //
module.exports = (MSG, OBJ, CODE, PACKNAME) => new Promise((RESOLVE, REJECT) => {
  const gitStatusModel = new adp.models.GitStatusLog();
  const obj = {
    packName: PACKNAME,
    code: CODE,
    date: new Date(),
    message: MSG,
    object: OBJ,
  };
  if (CODE !== 200) {
    adp.echoLog(MSG, OBJ, CODE, PACKNAME, true);
  } else {
    adp.echoLog(MSG, OBJ, CODE, PACKNAME);
  }
  gitStatusModel.createOne(obj)
    .then(() => RESOLVE(true))
    .catch((ERROR) => {
      const errorText = 'Error on [ createOne @ adp.models.GitStatusLog ]';
      const errorObject = { error: ERROR };
      const packName = 'cs.gitLog';
      adp.echoLog(errorText, errorObject, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
