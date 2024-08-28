// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.integrationToken ]
* Returns one <b>microservice integration access_token</b>.
* @param {String} inline ID of the MicroService. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f</b>
* @return {object} 200  - Shows requested Microservice Integration Token
* @return 404 - Microservice not found
* @return 500 - Internal Server Error
* @return 403 - Unauthorized
* @group Microservice CRUD
* @route GET /microservice/integration-token
* @author Cein [edaccei]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservice/integration-token/{ID}:
 *    get:
 *      description: Gives microservice intrgration token as response for the given id
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
 *        - Microservice
 *    parameters:
 *      - name: ID
 *        in: path
 *        description: Enter microservice id
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.microservice.integrationToken';
  const answer = new global.adp.Answers();
  answer.setCache('Not from Cache');
  const res = global.adp.setHeaders(RES);

  /**
   * Error Response
   * @param {int} code response code
   * @param {str} message response message
   */
  const requestFailure = (code, message) => {
    answer.setCode(code);
    answer.setMessage(message);
    res.statusCode = code;
    res.end(answer.getAnswer());
    const errorText = `Error found in ${new Date() - timer}ms: ${message}`;
    const errorOBJ = {
      parameters: REQ.params,
      userRequest: REQ
        && REQ.user
        && REQ.user.docs
        && REQ.user.docs[0]
        ? REQ.user.docs[0]
        : undefined,
      rbac: REQ && REQ.rbac ? REQ.rbac : undefined,
    };
    adp.echoLog(errorText, errorOBJ, code, packName, true);
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return requestFailure(400, '400 Bad Request');
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return requestFailure(400, '400 Bad Request');
  }

  if (REQ.user && REQ.user.docs && REQ.user.docs.length > 0) {
    const userObj = REQ.user.docs[0];
    if (userObj._id) {
      const microServiceID = REQ.params.id;
      const userId = userObj._id;
      const userRole = userObj.role;
      return adp.microservice.integrationToken(userId, userRole, microServiceID, REQ)
        .then((msIntegrationToken) => {
          if (msIntegrationToken.access_token && msIntegrationToken.access_token.trim() !== '') {
            res.statusCode = 200;
            answer.setCode(res.statusCode);
            answer.setMessage('200 Ok');
            answer.setSize(global.adp.getSizeInMemory(msIntegrationToken));
            answer.setData(msIntegrationToken);
            answer.setTime(new Date() - timer);
            res.end(answer.getAnswer());
            const msg = `[ adp.microservice.integrationToken ] successful in ${new Date() - timer}ms`;
            adp.echoLog(msg, null, 200, packName);
            return true;
          }
          return requestFailure(403, '403 Forbidden');
        }).catch((ErrorFetchingToken) => {
          res.statusCode = 500;
          let errorMessage = 'Failure to fetch microservice token';
          if (ErrorFetchingToken.code && ErrorFetchingToken.message) {
            res.statusCode = ErrorFetchingToken.code;
            errorMessage = ErrorFetchingToken.message;
          }
          return requestFailure(ErrorFetchingToken.code, errorMessage);
        });
    }
    return requestFailure(403, '403 Forbidden');
  }
  return requestFailure(403, '403 Forbidden');
};
