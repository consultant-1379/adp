// ============================================================================================= //
/**
* [ global.adp.endpoints.permission.postCreate ]
* Check if the permission already exists. If not, create. If yes, should return a message error.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.permission.postCreate';
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

  if (role !== 'admin') {
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`[ ${signum}, ${role} ] doesn't have enough rights to create a permission!`, null, 403, packName, true);
    global.adp.Answers.answerWith(403, RES, endTime, 'Not enough rights for this operation!');
    return;
  }

  if (REQ.body === null && REQ.body === undefined) {
    const endTime = (new Date()).getTime() - timer.getTime();
    global.adp.Answers.answerWith(400, RES, endTime, 'Body of the request not found!');
    return;
  }

  const body = REQ.body;

  global.adp.permission.crudCreate(signum, role, body)
    .then((RETURN) => {
      global.adp.Answers.answerWith(RETURN.code, RES, timer, RETURN.msg);
    })
    .catch((ERROR) => {
      const endTime = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.permission.crudCreate ] in ${endTime}ms`;
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
