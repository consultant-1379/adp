// ============================================================================================= //
/**
* [ global.adp.permission.getUserFromRequestObject ]
* Return the signum and the role from Request Object.
* @param {Object} USERREQUEST Request Object, sent by the <b>JWT Middleware</b>.
* Basic contains the <b>USER</b> data.
* @return {promise<object>} obj.signum {string} the users signum
* obj.userRole {string} the role of the user
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = USERREQUEST => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.permission.getUserFromRequestObject';
  const errorDenied = 404;
  if (USERREQUEST === null || USERREQUEST === undefined) {
    adp.echoLog('ERROR: "USERREQUEST" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user === null || USERREQUEST.user === undefined) {
    adp.echoLog('ERROR: "USERREQUEST.user" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user.docs === null || USERREQUEST.user.docs === undefined) {
    adp.echoLog('ERROR: "USERREQUEST.user.docs" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (USERREQUEST.user.docs[0] === null || USERREQUEST.user.docs[0] === undefined) {
    adp.echoLog('ERROR: "USERREQUEST.user.docs[0]" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  const user = USERREQUEST.user.docs[0];
  if (user._id === undefined || user._id === null) {
    adp.echoLog('ERROR: "USERREQUEST.user.docs[0]._id" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (user._id.trim().length === 0) {
    adp.echoLog('ERROR: Trim of "USERREQUEST.user.docs[0]._id" is empty!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  const userName = user._id.toLowerCase().trim();
  if (user.role === undefined || user.role === null) {
    adp.echoLog('ERROR: "USERREQUEST.user.docs[0].role" is undefined/null!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (user.role.trim().length === 0) {
    adp.echoLog('ERROR: Trim of "USERREQUEST.user.docs[0].role" is empty!', { USERREQUEST }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  const userRole = user.role;
  const userObjecttoReturn = {
    signum: userName,
    role: userRole,
  };
  RESOLVE(userObjecttoReturn);
  return userObjecttoReturn;
});
// ============================================================================================= //
