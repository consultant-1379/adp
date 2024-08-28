// ============================================================================================= //
/**
* [ endpoints.metrics.register ]
* Create metrics for monitoring purpose
* @route GET /metrics
* @author John, Omkar [zsdgmkr]
*/
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const { customMetrics } = require('../../../metrics/register');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packname = 'endpoints.metrics.register';
  try {
    const queueModel = new adp.models.MasterQueue();
    const itemsInQueue = await queueModel.countItemsInQueue();
    const oldestInQueue = await queueModel.oldestItemInQueue();
    customMetrics.itemsInQueueCounter.set(itemsInQueue);
    customMetrics.oldestItemInQueue.set(oldestInQueue);
    const register = await global.prometheus.register;
    RES.set('Content-Type', register.contentType);
    RES.end(await register.metrics());
    const finalTimer = ((new Date()).getTime()) - timer;
    if (finalTimer >= 500) {
      adp.echoLog(`Metrics Data successful collected in ${finalTimer}ms`, null, 200, packname);
    }
  } catch (ERROR) {
    const errorText = `Error collecting Metrics in ${((new Date()).getTime()) - timer}ms`;
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packname, true);
    RES.end('');
  }
};
// ============================================================================================= //
