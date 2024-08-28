// ============================================================================================= //
/**
* [ global.adp.endpoints.permission.putUpdate ]
* Update Permission if exists.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.permission.putUpdate';
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
      const errorText = 'Error in [ adp.permission.getUserFromRequestObject ]';
      const errorOBJ = {
        error: ERROR,
        header: REQ.headers,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const err = 'User Object Invalid';
      return err;
    });

  const body = REQ.body;
  global.adp.permission.crudUpdate(signum, role, body)
    .then((RETURN) => {
      global.adp.Answers.answerWith(RETURN.code, RES, timer, RETURN.msg);
    })
    .catch((ERROR) => {
      const endTime = (new Date()).getTime() - timer.getTime();
      const errorText = 'Error in [ adp.permission.crudUpdate ]';
      const errorOBJ = {
        error: ERROR,
        signum,
        role,
        body,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      global.adp.Answers.answerWith(ERROR.code, RES, endTime, ERROR.msg);
    });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
