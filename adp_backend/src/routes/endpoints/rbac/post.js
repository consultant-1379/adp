// ============================================================================================= //
/**
* [ global.adp.endpoints.rbac.post ]
* Create RBAC Group
* @group RBAC
* @route POST /rbac/group
* @param {Object} Group Data
* @returns 200 - Group Successfully Created
* @return 500 - Internal Server Error
* @return 400 - Invalid Data
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /rbac/group:
 *    post:
 *      description: Create a permission group which is given in Raw Body
 *      summary: Create RBAC Permission Group
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  type:
 *                    type: string
 *                    example:  Permission Group Type
 *                  name:
 *                    type: string
 *                    example:  Permission Group Name
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
 *        - RBAC Permissions
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const RbacGroupsController = require('../../../rbac/GroupsController');

module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.rbac.post';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const controllerObj = new RbacGroupsController();
  return controllerObj.createGroup(REQ.body, REQ.user).then((RESP) => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setData(RESP);
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
  })
    .catch((ERROR) => {
      const code = ERROR.code ? ERROR.code : 400;
      const message = ERROR.message ? ERROR.message : 'Bad Request';
      answer.setCode(code);
      answer.setMessage(message);
      res.statusCode = code;
      res.end(answer.getAnswer());
      const errorText = `Error in [ adp.rbac.post ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = { message, code, ERROR };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
    });
};
// ============================================================================================= //
