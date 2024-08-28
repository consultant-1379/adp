// ============================================================================================= //
/**
* [ global.adp.endpoints.playground.post ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //

// ============================================================================================= //
/**
 * @swagger
 * /playground:
 *    post:
 *      description: Returns a playground URL
 *      summary: Returns a playground URL
 *      parameters:
 *        - in: query
 *          name: id
 *          schema:
 *           type: string
 *          required: true
 *          example: esupuse
 *          description: ID of the requester
 *        - in: query
 *          name: step
 *          schema:
 *           type: string
 *          required: true
 *          example: myfirstservice
 *          description: playground step value
 *        - in: query
 *          name: host
 *          schema:
 *           type: string
 *          example: hoff061.rnd.gic.ericsson.se
 *          description: playground host name
 *        - in: query
 *          name: status
 *          schema:
 *           type: string
 *          description: playground status (refresh/try me)
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
 *        - PlayGround
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.playground.post';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');

  const gotAnError = (ERROR) => {
    res.statusCode = ERROR.code;
    answer.setCode(ERROR.code);
    answer.setMessage(ERROR.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    const errorText = `Error :: ${ERROR.message} in ${(new Date()).getTime() - timer.getTime()}ms`;
    const errorOBJ = {
      error: ERROR,
    };
    adp.echoLog(errorText, errorOBJ, 500, packName, true);
  };

  const isABadRequest = (ERRORMESSAGE) => {
    const foundErrorOBJ = {
      code: 400,
      message: `400 - Bad Request: ${ERRORMESSAGE}`,
    };
    gotAnError(foundErrorOBJ);
  };

  if (REQ.body === null || REQ.body === undefined) {
    isABadRequest('Body of Request cannot be null or undefined');
    return;
  }

  if (REQ.query === null || REQ.query === undefined) {
    isABadRequest('No valid username');
    return;
  }
  if (REQ.query.id === null || REQ.query.id === undefined) {
    isABadRequest('No valid username');
    return;
  }
  let tempStep = null;
  if (REQ.query.step !== null && REQ.query.step !== undefined) {
    tempStep = REQ.query.step;
  }
  let tempHost = null;
  if (REQ.query.host !== null && REQ.query.host !== undefined) {
    tempHost = REQ.query.host;
  }

  let tempStatus = null;
  if (REQ.query.status !== null && REQ.query.status !== undefined) {
    tempStatus = REQ.query.status;
  }

  const username = REQ.query.id;
  const myStep = tempStep;
  const myHost = tempHost;
  const myStatus = tempStatus;

  const successfulAction = (FINALRESULT) => {
    res.statusCode = FINALRESULT.code;
    answer.setCode(FINALRESULT.code);
    answer.setTotal(1);
    answer.setData(FINALRESULT.data);
    answer.setSize(global.adp.getSizeInMemory(FINALRESULT.data));
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    const msg = `CMD Playground action successful in ${(new Date()).getTime() - timer.getTime()}ms`;
    adp.echoLog(msg, { link: FINALRESULT.data }, 200, packName);
  };

  global.adp.playground.cmd(username, myStep, myHost, myStatus)
    .then((RESULT) => {
      successfulAction(RESULT);
    })
    .catch(ERROR => gotAnError(ERROR));
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
