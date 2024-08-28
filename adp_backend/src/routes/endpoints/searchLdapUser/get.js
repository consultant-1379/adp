// ============================================================================================= //
/**
* [ global.adp.endpoints.searchLdapUser.get ]
* @author Omkar Sadegaonkar [esdgmkr]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  // const packName = 'global.adp.endpoints.searchLdapUser.get';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');
  const errorAnswer = (OBJ) => {
    res.setCode = OBJ.code;
    res.statusCode = OBJ.code;
    answer.setCode(OBJ.code);
    answer.setMessage(OBJ.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setLimit(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  };
  const successfulAnswer = (OBJ, FROMCACHE) => {
    res.setCode = OBJ.code;
    answer.setCode(OBJ.code);
    answer.setMessage(OBJ.message);
    answer.setTotal(OBJ.total);
    answer.setData(OBJ.data);
    answer.setSize(OBJ.size);
    answer.setLimit(OBJ.limit);
    if (FROMCACHE) {
      answer.setCache('From Cache');
    } else {
      answer.setCache('Not from Cache');
    }
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  };
  if (REQ.params === null && REQ.params === undefined) {
    const errorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    errorAnswer(errorOBJ);
    return;
  }
  if (REQ.params.mode === null && REQ.params.mode === undefined) {
    const errorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    errorAnswer(errorOBJ);
    return;
  }
  if (REQ.params.user === null || REQ.params.user === undefined) {
    const errorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    errorAnswer(errorOBJ);
    return;
  }
  if (REQ.params.user.length <= 2) {
    successfulAnswer({
      code: 200,
      message: '200 - String should contain 3 or more characters to obtain a result',
      total: 0,
      data: { usersFound: [] },
      size: 0,
      limit: 0,
    });
    return;
  }
  const userToFind = REQ.params.user;
  global.adp.searchLdapUser.search(userToFind)
    .then((RESULT) => {
      successfulAnswer(RESULT);
    })
    .catch((ERROR) => {
      errorAnswer(ERROR);
    });
  // ============================================================================================ //
};
// ============================================================================================= //
