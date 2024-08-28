// ============================================================================================= //
/**
* [ adp.endpoints.queue.check ]
* Returns the queue status.
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
 *      parameters:
 *        - id: id
 *          in: path
 *          description: The Job ID in the queue
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = global.adp.setHeaders(RES);

  const badRequest = () => {
    res.statusCode = 400;
    const obj = {
      code: 400,
      message: 'Bad Request - ID is invalid...',
    };
    res.end(JSON.stringify(obj));
  };

  if (REQ.params === null || REQ.params === undefined) {
    badRequest();
    return;
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    badRequest();
    return;
  }

  const myJobID = REQ.params.id.trim();
  const versionDetect = (myJobID.substring(0, 5) === 'V2.0_') ? '2.0' : '1.0';
  let commandVersion;

  switch (versionDetect) {
    case '1.0':
      commandVersion = 'status';
      adp.echoLog(`Queue requested for [ ${myJobID} ]`, null, 200, 'Queue Endpoint');
      break;
    default:
      commandVersion = 'groupStatus';
      break;
  }

  adp.queue[commandVersion](myJobID)
    .then((RESULT) => {
      res.statusCode = 200;
      const result = RESULT;
      if (result && result.status && result.error) {
        if (adp.config.siteAddress.indexOf('adp.ericsson.se') >= 0) {
          result.error = adp.getServerStatusErrorMessage(result.status);
        } else {
          const errorCode = result && result.status ? result.status : 500;
          const errorMessage = result && result.status ? adp.getServerStatusErrorMessage(result.status) : 'Internal Server Error';
          const errorData = {
            id: myJobID,
            error: result,
          };
          errorLog(errorCode, errorMessage, errorData, 'main', 'adp.endpoints.queue.check');
        }
      }
      res.end(JSON.stringify(result));
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Internal Server Error';
      const errorData = {
        id: myJobID,
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorData, 'main', 'adp.endpoints.queue.check');
      res.statusCode = errorCode;
      const obj = {
        code: errorCode,
        message: errorMessage,
      };
      res.end(JSON.stringify(obj));
    });
};
// ============================================================================================= //
