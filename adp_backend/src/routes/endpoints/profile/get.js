// ============================================================================================= //
/**
* [ global.adp.endpoints.profile.get ]
* Returns one <b>User Profile</b> following the ID.
* @param {String} inline ID of the User. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f</b>
* @return {object} 200  - Shows requested User profil
* @return 404 - User not found
* @return 500 - Internal Server Error
* @group User Profile CRUD
* @route GET /profile
* @author Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const packName = 'global.adp.endpoints.profile.get';
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - User ID is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return badRequest();
  }
  const userID = REQ.params.id;
  await global.adp.profile.get(userID, REQ)
    .then((userData) => {
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setData(userData);
      answer.setLimit(999999);
      answer.setTotal(1);
      answer.setPage(1);
      answer.setSize(1);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const msg = `User Profile successful in ${(new Date()).getTime() - timer.getTime()}ms`;
      const obj = {
        userData,
      };
      adp.echoLog(msg, obj, 200, packName);
      return true;
    }).catch((error) => {
      const errorText = `Error in [ adp.profile.get ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = {
        error,
        userID,
        header: REQ.headers,
      };
      if (error && error.code && error.message) {
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        answer.setCode(error.code);
        res.statusCode = error.code;
        answer.setMessage(error.message);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
        return false;
      }
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      answer.setCode(500);
      res.statusCode = 500;
      answer.setMessage(`Error: ${error}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return false;
};
// ============================================================================================= //
