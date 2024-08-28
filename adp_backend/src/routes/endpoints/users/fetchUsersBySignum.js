/**
* [ global.adp.endpoints.users.fetchUsersBySignum ]
* Fetch Users by a signum array
* @author Cein
*/

/**
 * @swagger
 * /fetchUsersBySignum:
 *    post:
 *      description: This endpoint retrives all users from the database based on the array of signums given. No data is returned if no user is supplied.
 *      requestBody:
 *          description: "List of one or more user signums"
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["signum1", "signum2"]
 *      responses:
 *        '200':
 *          description: List of matched user objects
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *          - Users in Admin Area
 *
 */

global.adp.docs.rest.push(__filename);

module.exports = (REQ, RES) => {
  const timer = new Date();
  const userContr = new adp.users.UserController();
  userContr.getBySignum(REQ.body).then((respUsers) => {
    global.adp.Answers.answerWith(200, RES, timer, null, respUsers);
  }).catch((errUsers) => {
    const code = errUsers.code || 500;
    global.adp.Answers.answerWith(code, RES, timer, errUsers.message);
  });
};
