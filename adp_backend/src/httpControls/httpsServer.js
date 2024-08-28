// ============================================================================================= //
/**
* [ global.adp.httpControls.httpsServer ]
* Prepare the HTTPS port to listen requests.
* @return {promise} listen the security port and return a Promise, Keeps the App alive.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE) => {
  global.adp.httpControls.options();
  const httpsOptionsInfo = {
    key: global.adp.config.ssl.key,
    cert: global.adp.config.ssl.cert,
    ca: global.adp.config.ssl.ca,
  };
  global.adp.routes(global.express);
  global.adp.httpControls.httpsServerService = global.https
    .createServer(httpsOptionsInfo, global.express);
  const securityPort = global.adp.httpControls.getSecurityPort();
  global.adp.httpControls.httpsServerService.listen(securityPort);
  adp.echoLog(`[+${global.adp.timeStepNext()}] Https Server running on ${securityPort}`);
  RESOLVE(true);
});
// ============================================================================================= //
