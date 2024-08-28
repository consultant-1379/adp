// ============================================================================================= //
/**
* [ adp.endpoints.userPermissionGroup.update ]
* Update assigned permission groups for a specific user
* Examples:
* /api/users/eteuse/permissions
* /api/users/emeuse/permissions
* @return 201 - Status created successfully
* @return 500 - Internal Server Error
* @group userPermissionGroup
* @route PUT /users/:id/permissions
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
const userPermissionGroupController = require('../../../userPermissionGroup/userPermissionGroup.controller');
// ============================================================================================= //
module.exports = async ({ body: userRbacGroup, params: { id } }, RES) => {
  const startTimer = new Date();
  const packName = 'adp.endpoints.userPermissionGroup.update';
  const {
    setHeaders, echoLog, Answers: { answerWith },
  } = adp;
  const res = setHeaders(RES);
  try {
    await userPermissionGroupController.updateUserPermissionGroup(id, userRbacGroup);
    const message = `User Permissions successfully updated for ${id} in ${new Date().getTime() - startTimer.getTime()}ms !`;
    answerWith(200, res, startTimer, message);
  } catch (error) {
    const { code, message, data } = error;
    echoLog(message, {
      error, id, userRbacGroup, origin: 'userPermissionGroup.update',
    }, error.code, packName, true);
    answerWith(code, res, startTimer, message, data);
  }
};
// ============================================================================================= //
