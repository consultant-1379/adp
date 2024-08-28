/**
* [ adp.endpoints.teamHistory.checkTeamChanges ]
* checks for any team changes in the microservices of the given list of microservice ids.
* This check includes Mailers(PDL) and adp portal team data.
* @params {array} list of PDLs
* @author Cein-Sven Da Costa [edaccei]
*/
adp.docs.rest.push(__filename);
module.exports = (REQ, RES) => {
  const packageName = 'adp.endpoints.teamHistory.checkTeamChanges';
  const timer = new Date();
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const { msList, forceLaunchDate } = REQ.body;

  const teamHistContr = new adp.teamHistory.TeamHistoryController();
  teamHistContr.fetchLatestSnapshotsMsList(msList, true, forceLaunchDate).then((respObj) => {
    adp.echoLog(`Fetched lastest snapshots in ${(new Date() - timer)}ms`, null, 200, packageName);
    answer.setData(respObj);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
  }).catch((error) => {
    adp.echoLog(`Failed to fetch the latest snapshots in ${(new Date() - timer)}ms`, error, error.code, packageName);
    if (error.data) {
      answer.setData(error.data);
    }
    res.statusCode = error.code;
    answer.setCode(error.code);
    answer.setMessage(error.message);
    res.end(answer.getAnswer());
  });
};
