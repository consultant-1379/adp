const { validateRequestSchema } = require('../middleware/validations/joi.validator');
const assignUserWithRbacSchema = require('../schemas/assignUserWithRBAC');

// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
* [ adp.validations.validateAndPrepareRBACPermissionGroups ]
* validates rbac permission group id's against the DB rbacGroups.
* returns rbac groups if passed group IDs are valid else validation failures
* @param {Array} rbacGroup array of group id that needs to be validated
* @return {Promise} Returns promise;fulfilled returns rbacGroups else validation failures
* @author Veerender Voskula[zvosvee]
*/
// ============================================================================================= //
module.exports = rbacGroup => new Promise((RESOLVE, REJECT) => {
  const rbacController = new adp.rbac.GroupsController();
  const packName = 'adp.validations.validateAndPrepareRBACPermissionGroups';
  const originSource = 'validateAndPrepareRBACPermissionGroups';

  const valError = validateRequestSchema(assignUserWithRbacSchema.body, rbacGroup);
  if (valError.message) {
    REJECT(valError);
    return;
  }
  const promiseArr = [];
  rbacGroup.forEach((groupID) => {
    promiseArr.push(rbacController.getGroups(groupID));
  });

  Promise.all(promiseArr).then((rbacGroups) => {
    const userPermissionGroups = [];
    const prepareRBACGroups = (rbac) => {
      if (Array.isArray(rbac)) {
        for (let i = 0; i < rbac.length; i += 1) {
          prepareRBACGroups(rbac[i]);
        }
      } else {
        userPermissionGroups.push(rbac);
      }
    };

    prepareRBACGroups(rbacGroups);
    RESOLVE(userPermissionGroups);
  }).catch((error) => {
    const errorObj = {
      message: error.message || 'Failed to fetch groups',
      code: error.code || 500,
    };
    adp.echoLog(errorObj.message, { rbacGroup, error, origin: originSource },
      errorObj.code, packName);
    REJECT(error);
  });
});
