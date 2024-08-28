// ============================================================================================= //
/**
* [ global.adp.endpoints.user.read ]
* Returns one <b>User</b> following the ID/Signum.
* @author Armando Schiavon Dias [escharm]
*/

/**
 * @swagger
 * /user/{signum}:
 *    get:
 *      description: This endpoint retrives the requested user information
 *      responses:
 *        '200':
 *          description: OK.Success-Shows the requested user information
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - User CRUD Operations
 *      parameters:
 *        - name: signum
 *          in: path
 *          description: Signum of the user to be fetched
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - User ID is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return badRequest();
  }
  const myUserID = REQ.params.id.trim().toLowerCase();
  await global.adp.user.read(myUserID)
    .then((myUser) => {
      if (!Array.isArray(myUser.docs) || myUser.docs.length !== 1) {
        answer.setCode(404);
        res.statusCode = 404;
        answer.setMessage('404 User not found');
        answer.setTime(new Date() - timer);
        answer.setSize(0);
        res.end(answer.getAnswer());
        return false;
      }
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(myUser.totalInDatabase);
      answer.setSize(global.adp.getSizeInMemory(myUser.docs[0]));
      answer.setData(myUser.docs[0]);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return true;
    }).catch((error) => {
      answer.setCode(error.code);
      res.statusCode = error.code;
      answer.setMessage(`${error.message}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return false;
};
// ============================================================================================= //
