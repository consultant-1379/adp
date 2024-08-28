// ============================================================================================= //
/**
* [ adp.endpoints.innerSourceUserHistory.get ]
* @return {object} Result of the request.
* @group InnerSource
* @route GET /innersourceUserHistory
* @author Omkar
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.innerSourceUserHistory.get';
  const res = global.adp.setHeaders(RES);
  const answer = new adp.Answers();

  const badRequest = (msg) => {
    answer.setCode(400);
    answer.setMessage(msg);
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest('NULL or UNDEFINED Parameters');
  }

  const { signum, date } = REQ.params;
  return adp.innerSource.userHistory(signum, date)
    .then((snapshots) => {
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(snapshots.length);
      answer.setData(snapshots);
      const endTimer = (new Date()).getTime() - timer;
      answer.setTime(`${endTimer}ms`);
      answer.setCode(200);
      res.end(answer.getAnswer());
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.innerSource.userHistory ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const endTimer = (new Date()).getTime() - timer;
      answer.setCode(ERROR.code);
      res.statusCode = ERROR.code;
      answer.setMessage(ERROR.msg);
      answer.setTotal(1);
      answer.setCache('Not from Cache');
      answer.setData('Please verify the Server Logs for more information');
      answer.setTime(endTimer);
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
