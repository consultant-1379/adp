// ============================================================================================= //
/**
* [ endpoints.metrics.tutorialAnalytics ]
* Fetch tutorial analytical data
* @route GET /tutorialAnalytics
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //

module.exports = (REQ, RES) => {
  const timer = ((new Date()).getTime());
  const packname = 'adp.endpoints.metrics.tutorialAnalytics';
  global.adp.tutorialAnalytics.get().then(() => {
    if (global.customRegisters && global.customRegisters.tutorialRegistry) {
      const register = global.customRegisters.tutorialRegistry;
      RES.set('Content-Type', register.contentType);
      RES.end(register.metrics());
    }
    RES.end('');
  }).catch((ERROR) => {
    const errorText = `Error collecting Tutorial Metrics in ${((new Date()).getTime()) - timer}ms`;
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packname, true);
    RES.end('');
  });
};
// ============================================================================================= //
