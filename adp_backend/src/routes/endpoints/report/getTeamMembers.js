// ============================================================================================= //
/**
* [ global.adp.endpoints.report.getTeamMembers ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.report.getTeamMembers';
  global.adp.quickReports.teamMembers()
    .then((CSV) => {
      RES.setHeader('Content-Type', 'text/csv');
      RES.download(CSV);
      const endTimer = (new Date()).getTime() - timer.getTime();
      adp.echoLog(`HTML with the Report of Team Members by Microservice was sent in ${endTimer}ms`, null, 200, packName);
    })
    .catch((ERROR) => {
      const endTimer = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.quickReports.teamMembers ] in ${endTimer}ms`;
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
    });
};
// ============================================================================================= //
