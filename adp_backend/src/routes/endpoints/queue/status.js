// ============================================================================================= //
/**
* [ adp.endpoints.queue.status ]
* Returns the queue health status.
* @author Armando Dias [zdiaarm]
*/

/**
 * @swagger
 * /queue/{id}:
 *    get:
 *      description: This endpoint retrives the current status of the job in the queue
 *      responses:
 *        '200':
 *          description: Success.
 *      tags:
 *        - Queue
 */
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  const model = new adp.models.MasterQueue();
  const obj = {};
  obj.queueInProgress = adp.queue.queueInProgress;
  obj.queueRunningInstance = adp.queue.queueInstances;
  obj.showingTheNewest = 100;
  model.lastJobs(100)
    .then((RESULT) => {
      obj.lastQueues = RESULT;
      res.end(JSON.stringify(obj));
    })
    .catch(() => {});
};
// ============================================================================================= //
