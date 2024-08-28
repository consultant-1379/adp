/**
 * [ adp.endpoints.peopleFinder.getPerson ]
 * fetches a persons details by signum from the people finder api
 * @param {string} signum of the person to lookup
 * @returns {object} the peoplefinder response for the person
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.rest.push(__filename);
module.exports = (REQ, RES) => {
  const packageName = 'adp.endpoints.peopleFinder.getPerson';
  const timer = new Date();
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const signum = (REQ.params && REQ.params.signum ? REQ.params.signum : '');

  const pfSingleOp = new adp.peoplefinder.BaseOperations();
  pfSingleOp.searchPeopleBySignum(signum).then((respObj) => {
    adp.echoLog(`Peoplefinder person details fetch complete in ${(new Date() - timer)}ms`, null, 200, packageName);
    answer.setData(respObj);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  }).catch((error) => {
    adp.echoLog(`Peoplefinder person details fetch Failed in ${(new Date() - timer)}ms`, error, error.code, packageName);
    res.statusCode = error.code;
    answer.setCode(error.code);
    answer.setMessage(error.message);
    res.end(answer.getAnswer());
  });
};
