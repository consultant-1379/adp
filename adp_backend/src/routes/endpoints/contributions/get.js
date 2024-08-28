// ============================================================================================= //
/**
* [ global.adp.endpoints.contributions.get ]
* @return 200 - List of contributors
* @return 500 - Internal Server Error.
* @return 404 - Bad request
* @route GET /analytics/contributions
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  global.adp.contributions.get.getContributors(REQ).then((RESP) => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 - OK');
    answer.setTotal(0);
    answer.setData(RESP);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  })
    .catch((ERROR) => {
      answer.setCode(ERROR.code);
      res.statusCode = ERROR.code;
      answer.setMessage(ERROR.msg);
      answer.setTotal(0);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
