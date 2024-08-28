// ============================================================================================= //
/**
* [ adp.endpoints.innerSourceLastStatus.get ]
* Returns the last commit status of selected Asset.
* @param {String} inline ID or slug of the MicroService.
* @return {object} Result of the request.
* @group InnerSource
* @route GET /innersourcelaststatus
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.innerSourceLastStatus.get';
  const res = global.adp.setHeaders(RES);
  let myMicroServiceID = null;
  if (REQ.params !== undefined && REQ.params !== null) {
    if (REQ.params.id !== undefined && REQ.params.id !== null) {
      myMicroServiceID = `${REQ.params.id}`;
    }
  }
  return adp.innerSource.lastAssetStatus(myMicroServiceID)
    .then((RESULT) => {
      const endTimer = (new Date()).getTime() - timer;
      const answer = new adp.Answers();
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(1);
      answer.setCache('Not from Cache');
      answer.setSize(adp.getSizeInMemory(RESULT));
      answer.setData(RESULT);
      answer.setTime(endTimer);
      res.end(answer.getAnswer());
      adp.echoLog(`Inner Source Last Status done in ${endTimer}ms`, null, 200, packName, false);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.innerSource.lastAssetStatus ]';
      const errorOBJ = {
        parameter: myMicroServiceID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
};
// ============================================================================================= //
