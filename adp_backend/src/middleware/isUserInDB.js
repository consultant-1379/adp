const { HTTP_STATUS } = require('../library/utils/constants');
const answerWith = require('../answers/answerWith');

// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //

/**
* [ middleware.isUserInDB ]
* verify whether target user is in DB
* @params {string} signum of user that needs to be validated against DB
* @return Response object with list of errors or warning, otherwise call next middleware
* @author Veerender Voskula [zvosvee]
*/
module.exports = async (signum, RES, next) => {
  const packName = 'adp.middleware.isUserInDB';
  const startTimer = new Date();
  const {
    setHeaders, echoLog, user,
  } = adp;
  const res = setHeaders(RES);
  if (signum === null || signum === undefined) {
    answerWith(400, res, startTimer, 'User Signum is required', signum);
    return false;
  }
  try {
    const { docs } = await user.read(signum);
    if (Array.isArray(docs) && docs.length === 1) {
      return next();
    }
    const errorStatusCode = HTTP_STATUS['404'];
    echoLog(`User ${errorStatusCode}`, { signum }, 500, packName);
    answerWith(500, res, startTimer, `Error : User ${errorStatusCode}`, signum);
    return false;
  } catch ({ code, message, data }) {
    echoLog(`Error : ${message}`, { code, message, data }, code, packName, true);
    answerWith(code, res, startTimer, message, data);
    return false;
  }
};
