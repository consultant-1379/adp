// ============================================================================================= //
/**
* [ adp.endpoints.innersourcebytagstatus.get ]
* Returns the lastest report of InnerSource by Tag.
* Ready only. No parameters.
* @return {object} Result of the request.
* @group InnerSource
* @route GET /innersourcebytagstatus
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.innersourcebytagstatus.get';
  const res = global.adp.setHeaders(RES);
  const gitStatusModel = new adp.models.Gitstatus();
  return gitStatusModel.innerSourceByTagReportStatus()
    .then((RESULT) => {
      const endTimer = (new Date()).getTime() - timer;
      res.statusCode = 200;
      res.end(JSON.stringify(RESULT));
      adp.echoLog(`Lastest Report of InnerSource by Tag done in ${endTimer}ms`, null, 200, packName, false);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ gitStatusModel.innerSourceByTagReportStatus @ adp.models.Gitstatus ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
};
// ============================================================================================= //
