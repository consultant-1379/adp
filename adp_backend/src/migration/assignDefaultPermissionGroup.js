// ============================================================================================= //
/**
* [ global.adp.migration.assignDefaultPermissionGroup ]
* Update the existing user registers with default permission group Internal Users Group
* @author Veerender Voskula [zvosvee], Omkar Sadegaonkar [zsdgmkr]
*/
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = USER => new Promise((RESOLVE, REJECT) => {
  const USERRESP = USER;
  const groupID = global.adp.getDefaultRBACGroupID();
  const groupsController = new global.adp.rbac.GroupsController();
  groupsController.getGroups(groupID)
    .then((groups) => {
      if (!USERRESP.rbac) {
        USERRESP.rbac = groups;
        RESOLVE(USERRESP);
      } else {
        RESOLVE(true);
      }
    }).catch((error) => {
      const errorObj = {
        message: 'Failed to get groups',
        code: 500,
        data: {
          groupID, error, origin: 'migration.assignDefaultPermissionGroup',
        },
      };
      REJECT(errorObj);
    });
});
// ============================================================================================= //
