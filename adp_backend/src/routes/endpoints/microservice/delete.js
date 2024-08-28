// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.delete ]
* (Soft) Delete the MicroService if the user is admin or
* owner of the microService.
* @param {String} inline ID of the MicroService. After the URL, add a slash and the ID.
* Example: 03a6c2af-36da-430f-842c-84176fd54c0f
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservice/{ID}:
 *    delete:
 *      description: Delete the MicroService if the user is admin or owner
 *      summary: Delete a microservice by ID
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
 *        description: Enter Microservice ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packname = 'global.adp.endpoints.microservice.delete';
  if (REQ.params === null || REQ.params === undefined) {
    return global.adp.Answers.answerWith(400, RES, timer, 'MicroService ID is NULL or UNDEFINED');
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return global.adp.Answers.answerWith(400, RES, timer, 'MicroService ID is NULL or UNDEFINED');
  }
  const myMicroServiceID = REQ.params.id;
  return global.adp.permission.canDoIt(REQ, myMicroServiceID)
    .then(async () => {
      const user = REQ.user.docs[0];
      const USR = {
        signum: (`${user.signum}`).trim().toLowerCase(),
        role: user.role,
      };
      global.adp.microservice.delete(myMicroServiceID, USR)
        .then(() => {
          global.adp.Answers.answerWith(200, RES, timer, 'Microservice deleted');
          adp.echoLog(`Microservice deleted in ${(new Date()).getTime() - timer.getTime()}ms`, null, 200, packname);
        })
        .catch((finalResult) => {
          let errorText;
          let errorCode;
          const finalTimer = `in ${(new Date()).getTime() - timer.getTime()}ms`;
          if (finalResult === 404) {
            errorCode = 404;
            errorText = `Error in [ adp.microservice.delete ]: Microservice not found ${finalTimer}`;
            global.adp.Answers.answerWith(404, RES, timer, 'Microservice Not Found');
          } else {
            errorCode = 500;
            errorText = `Error in [ adp.microservice.delete ] ${finalTimer}`;
            global.adp.Answers.answerWith(500, RES, timer);
          }
          const errorOBJ = {
            user: USR,
            microserviceId: myMicroServiceID,
            error: finalResult,
          };
          adp.echoLog(errorText, errorOBJ, errorCode, packname, true);
        });
    })
    .catch((ERROR) => {
      global.adp.Answers.answerWith(403, RES, timer, 'You do not have permission to delete this Microservice');
      const errorText = 'Error in [ adp.permission.canDoIt ]';
      const errorOBJ = {
        error: ERROR,
        microserviceId: myMicroServiceID,
        header: REQ.headers,
      };
      adp.echoLog(errorText, errorOBJ, 403, packname, true);
    });
};
// ============================================================================================= //
