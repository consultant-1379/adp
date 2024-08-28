// ============================================================================================= //
/**
* [ global.adp.endpoints.rbac.delete ]
* Delete RBAC Group
* @group RBAC
* @route DELETE /rbac/group
* @param {String} ID Parameter for Group ID
* @return List of Groups
* @returns 200 - Group Read Successful
* @return 500 - Internal Server Error
* @return 404 - Group Not Found
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /rbac/group/{GroupID}:
 *    delete:
 *      description: Deletes the given permission group ID
 *      summary: Delete RBAC Permission Group
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
 *    parameters:
 *      - name: GroupID
 *        in: path
 *        description: Enter Permission Group ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const RbacGroupsController = require('../../../rbac/GroupsController');

module.exports = (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.rbac.delete';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const controllerObj = new RbacGroupsController();
  return controllerObj.deleteGroup(REQ.params.groupId, REQ.user).then(() => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
  })
    .catch((ERROR) => {
      answer.setCode(ERROR.code);
      answer.setMessage(ERROR.message);
      res.statusCode = ERROR.code;
      res.end(answer.getAnswer());
      const errorText = `Error in [ adp.rbac.delete ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = { message: ERROR.message, code: ERROR.code };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
    });
};
// ============================================================================================= //
