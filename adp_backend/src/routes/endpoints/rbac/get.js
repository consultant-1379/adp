// ============================================================================================= //
/**
* [ global.adp.endpoints.rbac.get ]
* Create RBAC Group
* @group RBAC
* @route GET /rbac/group
* @param {String} ID (Optional) Parameter for Group ID
* @param {String} NAME (Optional) Parameter for Group Name
* If nothing is provided, all Groups will be fetched
* @return List of Groups
* @returns 200 - Group Read Successful
* @return 500 - Internal Server Error
* @return 404 - Group Not Found
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /rbac/group:
 *    get:
 *      description: Get's all the given permission groups details
 *      summary: Get all the RBAC Permission Groups
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
  const packName = 'adp.endpoints.rbac.get';
  const answer = new adp.Answers();
  const res = adp.setHeaders(RES);
  const controllerObj = new RbacGroupsController();
  return controllerObj.getGroups(REQ.query.id, REQ.query.name).then((Groups) => {
    answer.setCode(200);
    res.statusCode = 200;
    answer.setMessage('200 Ok');
    answer.setTotal(Groups.length);
    answer.setData(Groups);
    const endTimer = (new Date()).getTime() - timer.getTime();
    answer.setTime(endTimer);
    res.end(answer.getAnswer());
    return true;
  })
    .catch((ERROR) => {
      answer.setCode(ERROR.code);
      answer.setMessage(ERROR.message);
      res.statusCode = ERROR.code;
      res.end(answer.getAnswer());
      const errorText = `Error in [ adp.rbac.get ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorOBJ = { message: ERROR.message, code: ERROR.code };
      adp.echoLog(errorText, errorOBJ, 500, packName, false);
    });
};
// ============================================================================================= //
