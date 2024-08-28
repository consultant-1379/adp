// ============================================================================================= //
/**
* [ adp.endpoints.queue.free ]
* Check if queue is free.
* @author Armando Dias [zdiaarm]
*/

/**
 * @swagger
 * /queue-is-free:
 *    get:
 *      description: Number of queued jobs. Zero means the queue is free.
 *      responses:
 *        '200':
 *          description: Success.
 *      tags:
 *        - Queue
 */
// ============================================================================================= //
// const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  const masterQueueModels = new adp.models.MasterQueue();
  masterQueueModels.queueIsFree()
    .then((RESULT) => {
      res.end(JSON.stringify(RESULT));
    })
    .catch((ERROR) => {
      res.end(JSON.stringify(ERROR));
    });
};
// ============================================================================================= //
