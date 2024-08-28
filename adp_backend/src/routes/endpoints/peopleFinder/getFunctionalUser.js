/**
 * [ adp.endpoints.peopleFinder.getFunctionalUser ]
 * fetches a functional users details by signum from the people finder api
 * @param {string} signum of the functional user
 * @returns {object} the peoplefinder response for the functional user
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.rest.push(__filename);
module.exports = (REQ, RES) => {
  const timer = new Date();
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const signum = (REQ.params && REQ.params.signum ? REQ.params.signum : '');
  const packageName = 'adp.endpoints.peopleFinder.getFunctionalUser';

  const pfSingleOp = new adp.peoplefinder.BaseOperations();
  pfSingleOp.searchFunctionalUserBySignum(signum).then((respObj) => {
    adp.echoLog(`Peoplefinder functional user fetch complete in ${(new Date() - timer)}ms`, null, 200, packageName);
    answer.setData(respObj);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  }).catch((error) => {
    adp.echoLog(`Peoplefinder functional user fetch Failed in ${(new Date() - timer)}ms`, error, error.code, packageName);
    res.statusCode = error.code;
    answer.setCode(error.code);
    answer.setMessage(error.message);
    res.end(answer.getAnswer());
  });
};
