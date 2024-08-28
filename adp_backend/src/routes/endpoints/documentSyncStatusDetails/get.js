/* eslint-disable no-param-reassign */
// ============================================================================================= //
/**
* [ adp.endpoints.documentSyncStatusDetails.get ]
* Returns assets document sync status details.
* @author Ravikiran [zgarsri]
*/

/**
 * @swagger
 * /documentSyncStatusDetails:
 *    get:
 *      description: This endpoint fetch the data of give objective / Job
 *                   which was added in masterQueue.
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
 *        - Document Sync Status Details
 *    parameters:
 *      - name: objective
 *        in: query
 *        description: Enter objective to fetch the details
 *        required: true
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
const errorLog = require('../../../library/errorLog');
// ============================================================================================= //

const getMsName = (SIGNUM, ROLE, MSID, REQ) => new Promise((RESOLVE, REJECT) => {
  let msName;
  const MSIDNAME = true;
  const assetType = 'microservice';
  return adp.microservices.getByOwner(SIGNUM, ROLE, assetType, REQ, MSIDNAME)
    .then((RESULT) => {
      if (RESULT.templateJSON && RESULT.templateJSON.data && RESULT.templateJSON.data.length > 0) {
        RESULT.templateJSON.data.forEach((MS) => {
          if (MS._id === MSID) {
            msName = MS.name;
          }
        });
      }
      RESOLVE(msName);
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ adp.microservices.getByOwner ]', { error: ERROR }, 500, 'adp.endpoints.documentSyncStatusDetails.get', true);
      REJECT(ERROR);
    });
});

module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const res = global.adp.setHeaders(RES);
  const packName = 'adp.endpoints.documentSyncStatusDetails.get';
  const answer = new global.adp.Answers();

  const SIGNUM = REQ
  && REQ.userRequest
  && REQ.userRequest.signum
    ? REQ.userRequest.signum
    : null;

  const ROLE = REQ
  && REQ.userRequest
  && REQ.userRequest.role
    ? REQ.userRequest.role
    : null;

  const OBJECTIVE = REQ && REQ.query && REQ.query.objective
    ? REQ.query.objective
    : '';

  const masterQueueModel = new adp.models.MasterQueue();


  masterQueueModel.documentSyncStatusDetails(OBJECTIVE)
    .then(async (masterQueueData) => {
      if (masterQueueData[0].msId) {
        getMsName(SIGNUM, ROLE, masterQueueData[0].msId, REQ)
          .then((MSNAME) => {
            masterQueueData[0].msName = MSNAME;
            answer.setCode(200);
            answer.setCache('Not from Cache');
            answer.setMessage('200 - Search Successful');
            answer.setTotal(masterQueueData.length);
            answer.setData(masterQueueData);
            answer.setSize(adp.getSizeInMemory(masterQueueData));
            answer.setLimit(9999999);
            answer.setPage(1);
            answer.setTime((new Date()).getTime() - timer);
            res.statusCode = answer.getCode();
            const resAnswer = answer.getAnswer();
            res.end(resAnswer);
            adp.echoLog(`Finishing the search in ${((new Date()).getTime() - timer)}ms`, null, 200, packName, false);
          })
          .catch((ERROR) => {
            const errorCode = ERROR.code || 500;
            const errorMessage = ERROR.message || 'Error got on [getMsName] function';
            const errorObject = { error: ERROR };
            const errorOrigin = 'getMsName';
            errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
            answer.setCode(errorCode);
            answer.setCache('Not from Cache');
            answer.setMessage(`${errorCode} - Unexpected Error`);
            answer.setTime((new Date()).getTime() - timer);
            res.statusCode = answer.getCode();
            const resAnswer = answer.getAnswer();
            res.end(resAnswer);
          });
      } else {
        answer.setCode(404);
        answer.setCache('Not from Cache');
        answer.setMessage(`Nothing was found with this ${OBJECTIVE}`);
        answer.setData(masterQueueData);
        answer.setSize(adp.getSizeInMemory(masterQueueData));
        answer.setTime((new Date()).getTime() - timer);
        const resAnswer = answer.getAnswer();
        res.end(resAnswer);
      }
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error got on main function';
      const errorObject = { error: ERROR };
      const errorOrigin = 'main';
      errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
      answer.setCode(errorCode);
      answer.setCache('Not from Cache');
      answer.setMessage(`${errorCode} - Unexpected Error`);
      answer.setTime((new Date()).getTime() - timer);
      res.statusCode = answer.getCode();
      const resAnswer = answer.getAnswer();
      res.end(resAnswer);
    });
};
// ============================================================================================= //
