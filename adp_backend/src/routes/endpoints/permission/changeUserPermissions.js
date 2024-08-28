// ============================================================================================= //
/**
* [ global.adp.endpoints.permission.changeUserPermissions ]
* Quick and Safe way to change a permission based on User.
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.permission.changeUserPermissions';
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');

  let signum = null;
  let role = null;
  await global.adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      signum = USER.signum;
      role = USER.role;
    })
    .catch((ERROR) => {
      const errorText = `Error in [ adp.permission.getUserFromRequestObject ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      const err = 'User Object Invalid';
      global.adp.Answers.answerWith(500, RES, timer, 'Invalid Token');
      return err;
    });

  const body = REQ.body;
  global.adp.permission.changeUserPermissions(signum, role, body)
    .then((RETURN) => {
      global.adp.Answers.answerWith(RETURN.code, RES, timer, RETURN.msg, RETURN.data);
      const msg = `[ adp.permission.changeUserPermissions ] successful in ${(new Date()).getTime() - timer.getTime()}ms`;
      adp.echoLog(msg, null, 200, packName);
    })
    .catch((ERROR) => {
      global.adp.Answers.answerWith(ERROR.code, RES, timer, ERROR.msg);
      const errorText = `Error in [ adp.permission.changeUserPermissions ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
