// ============================================================================================= //
/**
* [ adp.endpoints.report.creatorByDomain ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.report.creatorByDomain';
  if (typeof parseInt(REQ.params.domaincode, 10) !== 'number') {
    const errorText = 'HTML Report of Creators by Domain Error: Missing domain code!';
    RES.end(errorText);
    adp.echoLog(errorText, { parameters: REQ.params }, 400, packName);
  }
  adp.quickReports.creatorByDomain(REQ.params.domaincode)
    .then((CSV) => {
      RES.set({ 'content-type': 'text/csv; charset=utf-8' });
      RES.end(CSV, 'report_creatorByDomain.csv');
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`HTML with the Report of Creators by Domain was sent in ${endTimer}ms`, null, 200, packName);
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.quickReports.creatorByDomain ]';
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      RES.end('HTML Report of Creators by Domain Error!');
    });
};
// ============================================================================================= //
