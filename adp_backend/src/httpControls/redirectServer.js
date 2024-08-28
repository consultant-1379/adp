// ============================================================================================= //
/**
* [ global.adp.httpControls.redirectServer ]
* Creates an HTTP Server but only to redirect to HTTPS Server.
* @return {promise} Answer the request and return a Promise when done.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  try {
    global.adp.httpControls.httpServerService = global.http
      .createServer((REQ, RES) => {
        const res = RES;
        res.writeHead(301, { Location: `https://${REQ.headers.host}${REQ.url}` });
        res.end();
      });
    const regularPort = global.adp.httpControls.getRegularPort();
    global.adp.httpControls.httpServerService.listen(regularPort);
    adp.echoLog(`[+${global.adp.timeStepNext()}] Http Server running on ${regularPort}`);
    RESOLVE(true);
  } catch (e) {
    adp.echoLog(`[+${global.adp.timeStepNext()}] Http Server error`, e, 500, 'adp.httpControls.httpServerService');
    const errorBoolean = true;
    REJECT(errorBoolean);
  }
});
// ============================================================================================= //
