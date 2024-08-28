// ============================================================================================= //
/**
* [ adp.endpoints.egsSync.trigger ]
* Trigger the EGS Synchronization
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /egssync/trigger:
 *    get:
 *      description: This endpoint triggers the <b>EGS Synchronization</b>.
 *                  <br/>Should be triggered by a <b>Super Admin</b>.
 *                  <br/>This endpoint returns a <b>Queue Link</b> ( <b>queueStatusLink</b> ).
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - EGSSync
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const egsSyncObjective = `egsSync__${(new Date()).getTime()}`;
  await adp.queue.addJob(
    'egsSync',
    'egsSync',
    'adp.egsSync.egsSyncAction',
    [egsSyncObjective],
    egsSyncObjective,
    0,
  )
    .then((RESPONSE) => {
      const res = adp.setHeaders(RES);
      res.statusCode = 200;
      res.end(JSON.stringify(RESPONSE));
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
      const errorObject = {
        code: errorCode,
        message: errorMessage,
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.endpoints.egsSync.trigger');
      const res = adp.setHeaders(RES);
      res.statusCode = errorCode;
      res.end(JSON.stringify(errorObject));
    });
};
// ============================================================================================= //
