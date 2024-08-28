// ============================================================================================= //
/**
* [ global.adp.endpoints.rbac.postDuplicate ]
* Create Duplicate RBAC Group
* @group RBAC
* @route POST /rbac/group/duplicate
* @param {Object} Group Data
* @returns 200 - Duplicate Group Successfully Created
* @return 500 - Internal Server Error
* @return 400 - Invalid Data
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /rbac/group/duplicate:
 *    post:
 *      description: Duplicates a permission group which is given in Raw Body
 *      summary: Duplicate RBAC Permission Group
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example:  Permission Group ID
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
  const packName = 'adp.endpoints.rbac.postDuplicate';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const controllerObj = new RbacGroupsController();
  return controllerObj.createDuplicateGroup(REQ.body, REQ.user).then((RESP) => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setData(RESP);
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
  })
    .catch((ERROR) => {
      answer.setCode(ERROR.code);
      answer.setMessage(ERROR.message);
      res.statusCode = ERROR.code;
      res.end(answer.getAnswer());
      const errorText = `Error in [ adp.rbac.post ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = { message: ERROR.message, code: ERROR.code };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
    });
};
// ============================================================================================= //
