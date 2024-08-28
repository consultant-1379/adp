// ============================================================================================= //
/**
* [ global.adp.permission.crudUpdate ]
* If possible, update a Permission
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @param {Object} PERMISSION The JSON with the Permission to update.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, PERMISSION) => new Promise((RESOLVE, REJECT) => {
  const time = new Date();
  const packName = 'global.adp.permission.crudUpdate';
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
      if (PERMISSIONS.docs.length === 0) {
        const errorOBJ = {
          groupID,
          itemID,
          databaseAnswer: PERMISSIONS,
        };
        const endTime = (new Date()).getTime() - time.getTime();
        const errorText = `Cannot update permission for "${groupID}/${itemID}" because doesn't exist! ( in ${endTime}ms )`;
        adp.echoLog(errorText, errorOBJ, 404, packName);
        const error = {
          code: 400,
          msg: 'Cannot Update! Permission does not exist!',
        };
        REJECT(error);
        return;
      }
      const previousPermission = PERMISSIONS.docs[0];
      let canUpdate = false;
      if (ROLE === 'admin') {
        canUpdate = true;
      } else if (previousPermission.admin !== null
        && previousPermission.admin !== undefined) {
        if (previousPermission.admin[SIGNUM] !== null
          && previousPermission.admin[SIGNUM] !== undefined) {
          canUpdate = true;
        }
      }
      if (canUpdate) {
        const newPermission = PERMISSION;
        newPermission._id = previousPermission._id;
        delete newPermission._rev;
        dbModel.updateOne(newPermission)
          .then((RETURN) => {
            if (RETURN.ok === true) {
              const endTime = (new Date()).getTime() - time.getTime();
              adp.echoLog(`Permission successful updated for "${groupID}/${itemID}" by "${SIGNUM}"! ( in ${endTime}ms )`, null, 200, packName);
              const ok = {
                code: 200,
                msg: 'Permission successful updated!',
              };
              global.adp.permission.checkFieldPermissionCache = undefined;
              RESOLVE(ok);
              delete newPermission._id;
              global.adp.permission.crudLog(SIGNUM, ROLE, 'update', newPermission, previousPermission);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ dbModel.updateOne ]';
            const errorOBJ = {
              database: 'dataBasePermission',
              newPermission,
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            const error = {
              code: 500,
              msg: 'Internal Server Error',
            };
            REJECT(error);
          });
      } else {
        const errorMSG = `User "${SIGNUM}" doesn't have enough rights to update "${groupID}/${itemID}" permission.`;
        adp.echoLog(errorMSG, null, 406, packName, true);
        const error = {
          code: 406,
          msg: errorMSG,
        };
        REJECT(error);
      }
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
