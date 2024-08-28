// ============================================================================================= //
/**
* [ adp.endpoints.contributorsStatistics.get ]
* Returns one <b>microservice</b> following the ID.
* @return {object} Result of the request.
* @group ContributorsStatistics
* @route GET /contributorsstatisticsprogress
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const res = global.adp.setHeaders(RES);
  let myMicroServiceID = null;
  if (REQ.params !== undefined && REQ.params !== null) {
    if (REQ.params.id !== undefined && REQ.params.id !== null) {
      myMicroServiceID = `${REQ.params.id}`;
    }
  }

  if (adp.contributions.contributorsStatisticsProgress !== undefined) {
    let progress = null;
    if (myMicroServiceID !== null) {
      progress = adp.contributions.contributorsStatisticsProgress[myMicroServiceID];
      if (progress === null || progress === undefined) {
        progress = adp.contributions.contributorsStatisticsProgress;
      }
    } else {
      progress = adp.contributions.contributorsStatisticsProgress;
    }
    const answer = new adp.Answers();
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setTotal(Object.keys(progress).length);
    answer.setCache('Not from Cache');
    answer.setSize(adp.getSizeInMemory(progress));
    answer.setData(progress);
    answer.setTime((new Date()).getTime() - timer);
    res.end(answer.getAnswer());
  } else {
    const answer = new adp.Answers();
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setTotal(0);
    answer.setCache('Not from Cache');
    answer.setSize(0);
    answer.setData('');
    answer.setTime((new Date()).getTime() - timer);
    res.end(answer.getAnswer());
  }

  return true;
};
// ============================================================================================= //
