// ============================================================================================= //
/**
* [ global.adp.endpoints.report.getServiceOwners ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.report.getServiceOwners';
  global.adp.quickReports.serviceOwners()
    .then((HTML) => {
      RES.set({ 'content-type': 'text/html; charset=utf-8' });
      RES.end(HTML);
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`HTML with the Report of Service Owners was sent in ${endTimer}ms`, null, 200, packName);
    })
    .catch((ERROR) => {
      const endTimer = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.quickReports.serviceOwners ] in ${endTimer}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
    });
};
// ============================================================================================= //
