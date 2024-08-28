// ============================================================================================= //
/**
* [ global.adp.user.getUserNameMail ]
* Return the email of the given Signum.
* @param {String} SIGNUM A string with the <b>username</b>.
* @returns {JSON} Returns the email of the user.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = SIGNUM => new Promise(async (RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  try {
    const errorRecordNotFound = 'No record found for this SIGNUM';
    const resultOfQuery = await dbModel.getUsersById(SIGNUM);
    if (resultOfQuery.docs === null || resultOfQuery.docs === undefined) {
      REJECT(errorRecordNotFound);
      return null;
    }
    if (!Array.isArray(resultOfQuery.docs)) {
      REJECT(errorRecordNotFound);
      return null;
    }
    if (resultOfQuery.docs.length !== 1) {
      REJECT(errorRecordNotFound);
      return null;
    }
    const user = resultOfQuery.docs[0];
    const result = {
      name: user.name,
      email: user.email,
    };
    RESOLVE(result);
    return result;
  } catch (ERROR) {
    REJECT(ERROR);
    return ERROR;
  }
});
// ============================================================================================= //
