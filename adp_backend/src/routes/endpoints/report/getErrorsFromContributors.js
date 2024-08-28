// ============================================================================================= //
/**
* [ global.adp.endpoints.report.getErrorsFromContributors ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.report.getErrorsFromContributors';
  adp.quickReports.errorsFromContributorsStatistics()
    .then((CSV) => {
      RES.setHeader('Content-Type', 'text/csv');
      RES.download(CSV);
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`HTML with the Report of Errors from Contributors Statistics was sent in ${endTimer}ms`, null, 200, packName);
    })
    .catch((ERROR) => {
      const endTimer = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.quickReports.errorsFromContributorsStatistics ] in ${endTimer}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
    });
};
// ============================================================================================= //
