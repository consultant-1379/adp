/* eslint-disable no-param-reassign */
// ============================================================================================= //
/**
* [ adp.endpoints.documentSyncStatus.get ]
* Returns the queue health status.
* @author Ravikiran [zgarsri]
*/

/**
 * @swagger
 * /documentSyncStatus:
 *    get:
 *      description: This endpoint fetch the data of jobs which were added in masterQueue.
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
 *        - Document Sync Status
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //


const allowedMicroservices = (SIGNUM, ROLE, REQ) => new Promise((RESOLVE, REJECT) => {
  const MSIDNAME = true;
  const assetTypeMS = 'microservice';
  const assetTypeAssembly = 'assembly';
  const getMS = adp.microservices.getByOwner(SIGNUM, ROLE, assetTypeMS, REQ, MSIDNAME);
  const getAssembly = adp.microservices.getByOwner(SIGNUM, ROLE, assetTypeAssembly, REQ, MSIDNAME);
  const resArray = [];
  Promise.all([getMS, getAssembly]).then((RESULT) => {
    if(RESULT.length > 0) {
      RESULT.forEach((arrData) => {
        if(arrData.templateJSON && arrData.templateJSON.data && arrData.templateJSON.data.length > 0) {
          arrData.templateJSON.data.forEach((MS) => {
            resArray.push({ id: MS._id, name: MS.name });
         });
        }
      });
    }
    RESOLVE(resArray);
  }).catch((ERROR) => { REJECT(ERROR); });
});

module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const res = global.adp.setHeaders(RES);
  const packName = 'adp.endpoints.documentSyncStatus.get';
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

  // commented to implement this logic when mimer sync and pagination is required
  // const thePageSize = REQ && REQ.query && REQ.query.pagesize
  //   ? REQ.query.pagesize
  //   : 20;

  // const thePage = REQ && REQ.query && REQ.query.page && REQ.query.page > 0
  //   ? REQ.query.page
  //   : 1;

  // const skipDocuments = (thePage - 1) * thePageSize;

  const masterQueueModel = new adp.models.MasterQueue();

  allowedMicroservices(SIGNUM, ROLE, REQ)
    .then((MICROSERVICES) => {
      masterQueueModel.documentSyncStatus(MICROSERVICES)
        .then(async (masterQueueData) => {
          // const total = await masterQueueModel.documentSyncStatus(
          //   MICROSERVICES,
          //   0,
          //   0,
          //   true,
          // );
          // formatDateToGMT(masterQueueData);
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
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error got on [allowedMicroservices] function';
      const errorObject = { error: ERROR };
      const errorOrigin = 'allowedMicroservices';
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
