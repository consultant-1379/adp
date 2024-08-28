// ============================================================================================= //
/**
* [ global.adp.endpoints.rbac.put ]
* Update RBAC Group
* @group RBAC
* @route PUT /rbac/group
* @param {Object} Group Data
* @returns 200 - Group Update Successful
* @return 500 - Internal Server Error
* @return 404 - Group Not Found
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /rbac/group:
 *    put:
 *      description: Update a permission group which is given in Raw Body
 *      summary: Update RBAC Permission Group
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
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const controllerObj = new RbacGroupsController();
  return controllerObj.updateGroup(REQ.body, REQ.user).then(() => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
  }).catch((ERROR) => {
    answer.setCode(ERROR.code);
    answer.setMessage(ERROR.message);
    res.statusCode = ERROR.code;
    res.end(answer.getAnswer());
  });
};
// ============================================================================================= //
