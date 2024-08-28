// ============================================================================================= //
/**
* [ global.adp.endpoints.login.post ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.login.post';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');

  const gotAnError = (MSG, ERROR) => {
    res.statusCode = ERROR.code;
    answer.setCode(ERROR.code);
    answer.setMessage(ERROR.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    adp.echoLog(MSG, ERROR, ERROR.code, packName, true);
  };

  const isABadRequest = (ERRORMESSAGE) => {
    const foundErrorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    adp.echoLog(ERRORMESSAGE, null, 400, packName);
    gotAnError(foundErrorOBJ);
  };

  if (REQ.body === null || REQ.body === undefined) {
    isABadRequest('ERROR :: Body of Request cannot be null or undefined!');
    return;
  }

  let myJSON = REQ.body;
  const situationOne = (myJSON.username === null) || (myJSON.username === undefined);
  const situationTwo = (myJSON.password === null) || (myJSON.password === undefined);
  if (situationOne || situationTwo) {
    if (Object.keys(REQ.body).length !== 1) {
      isABadRequest('ERROR :: Username or Password is missing on Request!');
      return;
    }
    let keyFromBody = '';
    Object.keys(REQ.body).forEach((k) => {
      keyFromBody = k;
    });
    myJSON = JSON.parse(keyFromBody);
  }

  const { username } = myJSON;
  const { password } = myJSON;

  const successfulLogin = (FINALRESULT) => {
    res.statusCode = FINALRESULT.code;
    answer.setCode(FINALRESULT.code);
    answer.setMessage(FINALRESULT.message);
    answer.setTotal(1);
    answer.setData(FINALRESULT.data);
    answer.setSize(global.adp.getSizeInMemory(FINALRESULT.data));
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    adp.echoLog(FINALRESULT.message, null, 200, packName);
  };

  let userData = {};

  global.adp.login.ldap(username, password)
    .then((RESULT) => {
      global.adp.login.checkdb(RESULT.user)
        .then((FINALRESULT) => {
          userData = FINALRESULT;
          global.adp.permission.isFieldAdminByUserID(username)
            .then((PERMISSIONS) => {
              const domains = [];
              PERMISSIONS.forEach((ITEM) => { domains.push(ITEM.item); });
              if (domains.length > 0) {
                userData.data.permissions = domains;
              } else {
                userData.data.permissions = [];
              }
              successfulLogin(userData);
            })
            .catch(ERROR => gotAnError('Error in [ adp.permission.isFieldAdminByUserID ]', ERROR));
        })
        .catch(ERROR => gotAnError('Error in [ adp.login.checkdb ]', ERROR));
    })
    .catch(ERROR => gotAnError('Error in [ adp.login.ldap ]', ERROR));
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
