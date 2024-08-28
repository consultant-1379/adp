// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.checkname ]
* Check if the name already exists.
* @group Microservice CRUD
* @route GET /microservice
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservice/checkname/{Name}:
 *    get:
 *      description: Checks if the given microservice name already exists or not
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '400':
 *          'description': 'Bad Request'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Microservice
 *    parameters:
 *      - name: Name
 *        in: path
 *        description: Enter microservice name to check
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
  const answer = new global.adp.Answers();
  const packName = 'adp.endpoints.microservice.checkname';
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage(`400 Bad Request in ${new Date() - timer}ms - MicroService Name is NULL or UNDEFINED...`);
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };
  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.name === null || REQ.params.name === undefined) {
    return badRequest();
  }
  const myMicroServiceNewName = REQ.params.name;
  let myMicroServiceID = null;
  if (REQ.params.id !== null && REQ.params.id !== undefined) {
    myMicroServiceID = REQ.params.id.trim();
  }
  return adp.microservice.duplicateUniqueFields(myMicroServiceNewName, myMicroServiceID, true)
    .then((RESP) => {
      if (RESP === true) {
        answer.setCode(200);
        res.statusCode = 200;
        answer.setMessage('New name, so you can use as name of your microservice');
        answer.setTotal(0);
        answer.setSize(0);
        answer.setData([]);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
        return true;
      }
      answer.setCode(403);
      res.statusCode = 403;
      answer.setMessage(`${RESP}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const errorText = 'Error in [ adp.microservice.duplicateUniqueFields ]';
      const errorOBJ = {
        name: myMicroServiceNewName,
        id: myMicroServiceID,
        response: RESP,
      };
      adp.echoLog(errorText, errorOBJ, 403, packName, false);
      return false;
    })
    .catch((ERROR) => {
      answer.setCode(400);
      res.statusCode = 400;
      answer.setMessage(`${ERROR}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      const errorText = 'Error in [ adp.microservice.duplicateUniqueFields ]';
      const errorOBJ = {
        name: myMicroServiceNewName,
        id: myMicroServiceID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 400, packName, false);
      return false;
    });
};
// ============================================================================================= //
