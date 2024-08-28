// ============================================================================================= //
/**
* [ global.adp.endpoints.permission.getRead ]
* Answer with the details of specific Permission Rule.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.permission.getRead';
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

  if (REQ.params.uid !== null && REQ.params.uid !== undefined && REQ.params.uid !== '') {
    global.adp.permission.isFieldAdminByUserID(REQ.params.uid)
      .then((RET) => {
        const answer = new global.adp.Answers();
        answer.setCode(200);
        res.statusCode = 200;
        if (RET.length === 0) {
          answer.setMessage('200 Ok - But there is nothing to show!');
        } else {
          answer.setMessage('200 Ok - Displaying list of Permissions!');
        }
        answer.setTotal(RET.length);
        answer.setSize(global.adp.getSizeInMemory(RET));
        answer.setData(RET);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
        return true;
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ adp.permission.isFieldAdminByUserID ]';
        const errorOBJ = {
          userId: REQ.params.uid,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        global.adp.Answers.answerWith(ERROR.code, RES, timer, ERROR.msg);
        return false;
      });
  } else {
    global.adp.permission.crudRead(signum, role)
      .then((RET) => {
        const answer = new global.adp.Answers();
        answer.setCode(200);
        res.statusCode = 200;
        if (RET.length === 0) {
          answer.setMessage('200 Ok - But there is nothing to show!');
        } else {
          answer.setMessage('200 Ok - Displaying list of Permissions!');
        }
        answer.setTotal(RET.length);
        answer.setSize(global.adp.getSizeInMemory(RET));
        answer.setData(RET);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ adp.permission.crudRead ]';
        const errorOBJ = {
          signum,
          role,
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        global.adp.Answers.answerWith(ERROR.code, RES, timer, ERROR.msg);
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
