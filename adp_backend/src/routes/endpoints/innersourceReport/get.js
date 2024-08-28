// ============================================================================================= //
/**
* [ adp.endpoints.innerSourceReport.get ]
* Returns the one-time report.
* @return {object} Result of the request.
* @group InnerSource
* @route GET /innersourcereport
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.innerSourceReport.get';
  const res = global.adp.setHeaders(RES);

  const externalContributors = new adp.quickReports.ExternalContributorsList();
  externalContributors.get()
    .then((RESULT) => {
      const answer = new adp.Answers();
      answer.setCode(200);
      if (RESULT.filePath) {
        RES.setHeader('Content-Disposition', `attachment; filename=${RESULT.fileName}`);
        RES.setHeader('Content-Transfer-Encoding', 'binary');
        RES.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        RES.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        RES.download(RESULT.filePath);
        const endTimer = (new Date()).getTime() - timer;
        adp.echoLog(`One-Time External Contributors Report generated in ${endTimer}ms`, null, 200, packName);
      } else {
        adp.echoLog('Error generating One-Time External Contributors Report', { format: RESULT.format }, 500, packName, true);
        res.setCode = 500;
        res.statusCode = 500;
        answer.setCode(500);
        res.end(answer.getAnswer());
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ externalContributors.get ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const endTimer = (new Date()).getTime() - timer;
      const answer = new adp.Answers();
      answer.setCode(500);
      res.statusCode = 500;
      answer.setMessage('500 Server Internal Error');
      answer.setTotal(1);
      answer.setCache('Not from Cache');
      answer.setData('Please verify the Server Logs for more information');
      answer.setTime(endTimer);
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
