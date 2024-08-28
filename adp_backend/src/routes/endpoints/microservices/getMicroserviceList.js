// ============================================================================================= //
/**
* [ global.adp.endpoints.microservices.getMicroserviceList ]
* Returns all <b>microservices</b> with name and id.
* @return 200 - Shows Microservice List.
* @return 500 - Internal Server Error.
* @route GET /getMicroserviceList
* @author Anil Chaurasiya [zchiana]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
/**
 * @swagger
 * /microserviceList:
 *    get:
 *      description: Returns all the list of microservice with name and id filds.
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Microservice
 */
// ============================================================================================= //
module.exports = (REQ, RES) => {
    const timer = new Date().getTime();
    const packName = 'global.adp.endpoints.microservices.getMicroserviceList';
    const answer = new global.adp.Answers()
    const res = global.adp.setHeaders(RES);
    res.setHeader('Content-Type', 'application/json');
  // ------------------------------------------------------------------------------------------- //

    const adpModel = new adp.models.Adp();
    adpModel.getMicroserviceList()
    .then(async (MSList) => {
        answer.setCode(200);
        answer.setCache('Not from Cache');
        answer.setMessage('200 - Search Successful');
        answer.setTotal(MSList);
        answer.setData(MSList);
        answer.setSize(adp.getSizeInMemory(MSList));
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
}