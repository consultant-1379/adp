const { HTTP_STATUS } = require('../library/utils/constants');
const answerWith = require('../answers/answerWith');

adp.docs.rest.push(__filename);
/**
* [ middleware.hasRole ]
* middleware for validating if the userin action is authorised to perform action.
* @param {string} ROLE authorized user role for action
* @return Response object with list of errors or warning, otherwise call next middleware
* @author Veerender Voskula [zvosvee]
*/
// eslint-disable-next-line consistent-return
const hasRole = ROLE => ({ user: { docs } }, RES, next) => {
  const startTimer = new Date();
  const packName = 'adp.middleware.hasRole';
  const { setHeaders, echoLog } = adp;
  const res = setHeaders(RES);
  const { role, signum } = docs[0];
  try {
    if (Object.is(role, ROLE)) {
      next();
      return true;
    }
    const errorStatusCode = HTTP_STATUS['403'];
    echoLog(`Error : ${errorStatusCode}`, { signum, role }, 403, packName, true);
    answerWith(403, res, startTimer, errorStatusCode, { signum, role });
  } catch ({ code, message, data }) {
    echoLog(`Error : ${message}`, { code, message, data }, code, packName, true);
    answerWith(code, res, startTimer, message, data);
  }
};

module.exports = hasRole;
