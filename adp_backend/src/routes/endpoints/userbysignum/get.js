// ============================================================================================= //
/**
* [ global.adp.endpoints.userbysignum.get ]
* @author Omkar Sadegaonkar [esdgmkr]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');
  const errorAnswer = (OBJ) => {
    res.setCode = OBJ.code;
    answer.setCode(OBJ.code);
    answer.setMessage(OBJ.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setLimit(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  };
  const userToFind = REQ.params.uid;
  if (userToFind === null || userToFind === undefined) {
    const errorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    errorAnswer(errorOBJ);
    return;
  }
  if (userToFind.length <= 2) {
    const errorOBJ = {
      code: 406,
      message: '406 - Not Acceptable - String should contain 3 or more characteres',
    };
    errorAnswer(errorOBJ);
    return;
  }
  const successfulAnswer = (OBJ) => {
    res.setCode = OBJ.code;
    answer.setCode(OBJ.code);
    answer.setMessage(OBJ.message);
    answer.setTotal(OBJ.total);
    answer.setData(OBJ.data);
    answer.setSize(OBJ.size);
    answer.setLimit(OBJ.limit);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  };
  global.adp.userbysignum.search(userToFind)
    .then((RESULT) => {
      successfulAnswer(RESULT);
    })
    .catch((ERROR) => {
      errorAnswer(ERROR);
    });
  // ============================================================================================ //
};
// ============================================================================================= //
