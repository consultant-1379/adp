// ============================================================================================= //
/**
* [ global.adp.permission.crudCreate ]
* If possible, create a Permission
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @param {Object} PERMISSION The JSON with the Permission to create.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, PERMISSION) => new Promise((RESOLVE, REJECT) => {
  const time = new Date();
  const packName = 'global.adp.permission.crudCreate';
  const dbModel = new adp.models.Permission();
  let groupID = null;
  let itemID = null;
  if (PERMISSION['group-id'] === null || PERMISSION['group-id'] === undefined) {
    const error = {
      code: 400,
      msg: 'The field "group-id" was not found!',
    };
    REJECT(error);
    return;
  }
  groupID = PERMISSION['group-id'];
  if (isNaN(groupID)) {
    const error = {
      code: 400,
      msg: 'The field "group-id" should be a number!',
    };
    REJECT(error);
    return;
  }
  if (PERMISSION['item-id'] === null || PERMISSION['item-id'] === undefined) {
    const error = {
      code: 400,
      msg: 'The field "item-id" was not found!',
    };
    REJECT(error);
    return;
  }
  itemID = PERMISSION['item-id'];
  if (isNaN(itemID)) {
    const error = {
      code: 400,
      msg: 'The field "item-id" should be a number!',
    };
    REJECT(error);
    return;
  }
  if (PERMISSION.admin === null || PERMISSION.admin === undefined) {
    const error = {
      code: 400,
      msg: 'The field "admin" was not found!',
    };
    REJECT(error);
    return;
  }
  dbModel.getAllPermissionsByField(groupID, itemID)
    .then((PERMISSIONS) => {
      let canCreate = false;
      if (PERMISSIONS.docs.length > 0) {
        if (PERMISSIONS.docs[0].admin) {
          Object.keys(PERMISSION.admin).every((admin) => {
            if (Object.keys(PERMISSIONS.docs[0].admin).includes(admin)) {
              const endTime = (new Date()).getTime() - time.getTime();
              const errorText = `Cannot create permission for "${groupID}/${itemID}" because already exists! ( in ${endTime}ms )`;
              const errorOBJ = {
                groupID,
                itemID,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, false);
              const error = {
                code: 400,
                msg: 'Permission already exists!',
              };
              canCreate = false;
              REJECT(error);
              return false;
            }
            canCreate = true;
            return true;
          });
          if (canCreate) {
            const newPermission = PERMISSIONS.docs[0];
            Object.keys(PERMISSION.admin).forEach((admin) => {
              newPermission.admin[admin] = PERMISSION.admin[admin];
            });
            global.adp.permission.crudUpdate(SIGNUM, ROLE, newPermission).then(() => {
              const endTime = (new Date()).getTime() - time.getTime();
              adp.echoLog(`Permission successfully created for "${groupID}/${itemID}" by "${SIGNUM}"! ( in ${endTime}ms )`, null, 200, packName);
              const ok = {
                code: 200,
                msg: 'Permission successfully created!',
              };
              global.adp.permission.checkFieldPermissionCache = undefined;
              global.adp.permission.crudLog(SIGNUM, ROLE, 'create', PERMISSION, null);
              RESOLVE(ok);
              return true;
            }).catch((ERROR) => {
              const errorText = 'Error in [ adp.permission.crudUpdate ]';
              const errorOBJ = {
                signum: SIGNUM,
                role: ROLE,
                newPermission,
                error: ERROR,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              const error = {
                code: 500,
                msg: 'Internal Server Error',
              };
              REJECT(error);
              return false;
            });
          } else {
            const error = {
              code: 400,
              msg: 'Permission already exists!',
            };
            canCreate = false;
            REJECT(error);
            return false;
          }
        }
      } else {
        dbModel.createOne(PERMISSION)
          .then((RETURN) => {
            if (RETURN.ok === true) {
              const endTime = (new Date()).getTime() - time.getTime();
              adp.echoLog(`Permission successful created for "${groupID}/${itemID}" by "${SIGNUM}"! ( in ${endTime}ms )`, null, 200, packName);
              const ok = {
                code: 200,
                msg: 'Permission successful created!',
              };
              global.adp.permission.checkFieldPermissionCache = undefined;
              RESOLVE(ok);
              global.adp.permission.crudLog(SIGNUM, ROLE, 'create', PERMISSION, null);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ dbModel.createOne ]';
            const errorOBJ = {
              database: 'dataBasePermission',
              permission: PERMISSION,
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            const error = {
              code: 500,
              msg: 'Internal Server Error',
            };
            REJECT(error);
            return false;
          });
      }
      return true;
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.getAllPermissionsByField ]';
      const errorOBJ = {
        groupID,
        itemID,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const error = {
        code: 500,
        msg: 'Internal Server Error',
      };
      REJECT(error);
    });
});
// ============================================================================================= //
