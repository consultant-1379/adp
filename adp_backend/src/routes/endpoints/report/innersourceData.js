// ============================================================================================= //
/**
* [ adp.endpoints.report.innersourceData ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.report.innersourceData';
  adp.quickReports.innersourceData.fetchUsersFromDateToDate(REQ.params.fromDate, REQ.params.toDate)
    .then((reportObj) => {
      RES.setHeader('Content-Disposition', `attachment; filename=${reportObj.fileName}`);
      RES.setHeader('Content-Transfer-Encoding', 'binary');
      RES.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      RES.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      RES.download(reportObj.filePath);
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`Asset report generated in ${endTimer}ms`, null, 200, packName);
    })
    .catch((ERROR) => {
      const endTimer = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.quickReports.innersourceData ] in ${endTimer}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName);
      const errorMessage = ERROR.msg || 'Error while fetching Innersource data';
      RES.end(errorMessage);
    });
};
// ============================================================================================= //
