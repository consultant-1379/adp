// ============================================================================================= //
/**
* [ global.adp.permission.crudDelete ]
* Delete a permission, if exists.
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @param {Object} FIELDID The id of the field.
* @param {Object} VALUEID The id of the value of the field.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, FIELDID, VALUEID) => new Promise((RESOLVE, REJECT) => {
  const time = new Date();
  const dbModel = new adp.models.Permission();
  const packName = 'global.adp.permission.crudDelete';
  dbModel.getAllPermissionsByField(FIELDID, VALUEID)
    .then((PERMISSIONS) => {
      if (PERMISSIONS.docs.length === 0) {
        const endTime = (new Date()).getTime() - time.getTime();
        const errorText = `Cannot delete permission for "${FIELDID}/${VALUEID}" because doesn't exist! ( in ${endTime}ms )`;
        const errorOBJ = {
          fieldID: FIELDID,
          valueID: VALUEID,
          databaseAnswer: PERMISSIONS,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        const error = {
          code: 400,
          msg: 'Cannot Delete! Permission does not exist!',
        };
        REJECT(error);
        return;
      }
      const permission = PERMISSIONS.docs[0];
      let canDestroy = false;
      if (ROLE === 'admin') {
        canDestroy = true;
      } else if (permission.admin !== null && permission.admin !== undefined) {
        if (permission.admin[SIGNUM] !== null && permission.admin[SIGNUM] !== undefined) {
          canDestroy = true;
        }
      }
      if (canDestroy) {
        dbModel.deleteOne(permission._id, permission._rev)
          .then((RETURN) => {
            if (RETURN.ok === true) {
              const endTime = (new Date()).getTime() - time.getTime();
              adp.echoLog(`Permission successful deleted for "${FIELDID}/${VALUEID}" by "${SIGNUM}"! ( in ${endTime}ms )`, null, 200, packName);
              const ok = {
                code: 200,
                msg: 'Permission successful deleted!',
              };
              global.adp.permission.checkFieldPermissionCache = undefined;
              RESOLVE(ok);
              global.adp.permission.crudLog(SIGNUM, ROLE, 'delete', null, permission);
            } else {
              const errorText = 'Error in [ dbModel.deleteOne ]';
              const errorOBJ = {
                database: 'dataBasePermission',
                id: permission._id,
                rev: permission._rev,
                error: RETURN,
              };
              adp.echoLog(errorText, errorOBJ, 500, packName, true);
              const error = {
                code: 500,
                msg: 'Internal Server Error',
              };
              REJECT(error);
            }
          })
          .catch((ERROR) => {
            const errorText = 'Error in [ dbModel.deleteOne ]';
            const errorOBJ = {
              database: 'dataBasePermission',
              id: permission._id,
              rev: permission._rev,
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
        const errorMSG = `User "${SIGNUM}" doesn't have enough rights to delete "${FIELDID}/${VALUEID}" permission.`;
        adp.echoLog(errorMSG, null, 403, packName);
        const error = {
          code: 403,
          msg: errorMSG,
        };
        REJECT(error);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.getAllPermissionsByField ]';
      const errorOBJ = {
        fieldID: FIELDID,
        valueID: VALUEID,
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
