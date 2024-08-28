// ============================================================================================= //
/**
* [ adp.endpoints.innersourcebydaterangesignummsid.delete ]
* Soft Delete gitstatus ranges by asset and userid
* @group InnerSource
* @param {String} StartDate of the first commit
* @param {String} EndDate of the last commit
* @param {String} UserID signum of the committer
* @param {String} msSlug asset linked to the committing user
* @returns 200 - Deletion Successful
* @return 500 - Internal Server Error
* @return 404 - Not Found
* @author Abhishek Singh [zihabns], Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.innersourcebydaterangesignummsid.delete';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const {
    startdate, enddate, signum, msslug,
  } = REQ.query;
  return adp.innerSource.deleteCommits(startdate, enddate, signum, msslug, REQ.user).then(() => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
  })
    .catch((ERROR) => {
      answer.setCode(ERROR.code);
      answer.setMessage(ERROR.message);
      res.statusCode = ERROR.code;
      res.end(answer.getAnswer());
      const errorText = `Error in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = { message: ERROR.message, code: ERROR.code, origin: 'endpoint/innersourcebydaterangesignummsid' };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
    });
};
// ============================================================================================= //
