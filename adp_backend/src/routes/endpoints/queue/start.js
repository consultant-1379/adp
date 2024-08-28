// ============================================================================================= //
/**
* [ adp.endpoints.queue.start ]
* Start the Queue Thread Variable.
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
  adp.queue.startJobs()
    .then(() => {})
    .catch(() => {});
  res.end(JSON.stringify('[ adp.queue.startJobs ] was requested'));
};
// ============================================================================================= //
