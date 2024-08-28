// ============================================================================================= //
/**
* [ global.adp.endpoints.permission.delete ]
* Check if the permission already exists. If not, create. If yes, should return a message error.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.permission.delete';
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
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      const err = 'User Object Invalid';
      return err;
    });

  const body = REQ.body;
  const fieldID = body['group-id'];
  if (isNaN(fieldID)) {
    global.adp.Answers.answerWith(400, RES, timer, 'The field "group-id" should be a number!');
    const errorText = 'Error in "fieldID" variable: The field "group-id" should be a number!';
    adp.echoLog(errorText, { fieldID, signum, role }, 400, packName, true);
    return;
  }
  const valueID = body['item-id'];
  if (isNaN(valueID)) {
    global.adp.Answers.answerWith(400, RES, timer, 'The field "item-id" should be a number!');
    const errorText = 'Error in "valueID" variable: The field "item-id" should be a number!';
    adp.echoLog(errorText, { fieldID, signum, role }, 400, packName, true);
    return;
  }

  global.adp.permission.crudDelete(signum, role, fieldID, valueID)
    .then((RETURN) => {
      global.adp.Answers.answerWith(RETURN.code, RES, timer, RETURN.msg);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.permission.crudDelete ]';
      const errorOBJ = {
        signum,
        role,
        fieldID,
        valueID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      global.adp.Answers.answerWith(ERROR.code, RES, timer, ERROR.msg);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
