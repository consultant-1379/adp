// ============================================================================================= //
/**
* [ global.adp.permission.changeUserPermissions ]
* Change the permissions of a user
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @param {Object} PARAMETERS The JSON with the instructions.
* @return This functions is a <b>Promise</b>.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, PARAMETERS) => new Promise(async (RESOLVE, REJECT) => {
  // Declaring Variables :: Begin - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
  const packName = 'global.adp.permission.changeUserPermissions';
  const promises = [];
  let requestObject = {};
  let foundOne;
  let foundOneItem;
  // Declaring Variables :: End - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//

  // Checking Parameters :: Begin - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
  if (PARAMETERS === null || PARAMETERS === undefined
     || PARAMETERS.newPermissions === null || PARAMETERS.newPermissions === undefined) {
    const error = {
      code: 400,
      msg: 'No instructions was found',
    };
    REJECT(error);
    return;
  }
  PARAMETERS.newPermissions.every((permission) => {
    if (permission.field === null || permission.field === undefined) {
      const error = {
        code: 400,
        msg: 'No field was found',
      };
      REJECT(error);
      return false;
    }
    if (permission.items === null || permission.items === undefined) {
      const error = {
        code: 400,
        msg: 'No items were found',
      };
      REJECT(error);
      return false;
    }
    return true;
  });
  if (PARAMETERS.target == null || PARAMETERS.target === undefined || PARAMETERS.target === '') {
    const error = {
      code: 400,
      msg: 'Target signum not found',
    };
    REJECT(error);
    return;
  }
  const targetSignum = PARAMETERS.target.toLowerCase();
  // Checking Parameters :: End - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//

  // Checking User In Database :: Begin - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//
  let targetUserFromDB = null;
  global.adp.masterCache.clear('ALLUSERS', null, targetSignum);
  await global.adp.user.thisUserShouldBeInDatabase(targetSignum)
    .then((USER) => {
      if (Array.isArray(USER.docs)) {
        // eslint-disable-next-line prefer-destructuring
        targetUserFromDB = USER.docs[0];
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.user.thisUserShouldBeInDatabase ]';
      const errorOBJ = {
        signum: targetSignum,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    });
  if (targetUserFromDB === null) {
    const error = {
      code: 400,
      msg: 'Target signum not found',
    };
    REJECT(error);
    return;
  }
  // Checking User In Database :: End - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -//

  if (targetSignum === SIGNUM) {
    adp.echoLog(`Request from [${SIGNUM}/${ROLE}] for changing his own field permissions...`, null, 200, packName);
  } else {
    adp.echoLog(`Request from [${SIGNUM}/${ROLE}] for change [${targetSignum}] field permissions...`, null, 200, packName);
  }

  const oldPermissions = await global.adp.permission.isFieldAdminByUserID(targetSignum);
  const adminPermissions = await global.adp.permission.isFieldAdminByUserID(SIGNUM);
  let listOptions = await global.adp.listOptions.get();
  listOptions = JSON.parse(listOptions);
  if (Array.isArray(oldPermissions) && oldPermissions.length > 0) {
    let filteredPermission;
    oldPermissions.forEach((perm) => {
      const adminPermissionsArray = adminPermissions.filter(
        adminPerm => (adminPerm.field === perm.field && adminPerm.item === perm.item),
      );
      if (ROLE !== 'admin' && adminPermissionsArray.length === 0) {
        return;
      }
      filteredPermission = PARAMETERS.newPermissions.filter(
        newperm => newperm.field === perm.field,
      );
      if (filteredPermission.length === 1 && Array.isArray(filteredPermission[0].items)) {
        if (!((filteredPermission[0].items.filter(
          itemperm => itemperm === perm.item,
        )).length === 1)) {
          foundOne = listOptions.filter(option => option.slug === perm.field);
          if (foundOne.length === 1) {
            requestObject.fieldcode = foundOne[0].id;
            foundOneItem = foundOne[0].items.filter(option => option.name === perm.item);
            if (foundOneItem.length === 1) {
              requestObject.itemcode = foundOneItem[0].id;
            }
          }
          requestObject.target = targetSignum;
          requestObject.action = 'remove';
          promises.push(global.adp.permission.changeUser(SIGNUM, ROLE, requestObject));
          requestObject = {};
        }
      }
    });
  }

  PARAMETERS.newPermissions.forEach((permission) => {
    const validField = typeof permission.field === 'string' && (`${permission.field}`).length > 0;
    const validItems = Array.isArray(permission.items);
    if (validField && validItems) {
      permission.items.forEach((item) => {
        if (!(oldPermissions.filter(
          perm => (permission.field === perm.field && item === perm.item),
        ).length === 1)) {
          foundOne = listOptions.filter(option => option.slug === permission.field);
          if (foundOne.length === 1) {
            requestObject.fieldcode = foundOne[0].id;
            foundOneItem = foundOne[0].items.filter(option => option.name === item);
            if (foundOneItem.length === 1) {
              requestObject.itemcode = foundOneItem[0].id;
            }
          }
          requestObject.target = targetSignum;
          requestObject.action = 'add';
          promises.push(global.adp.permission.changeUser(SIGNUM, ROLE, requestObject));
          requestObject = {};
        }
      });
    } else {
      const error = {
        code: 400,
        msg: 'No instructions was found',
      };
      REJECT(error);
    }
  });

  const resolveThis = (HAVEUSER) => {
    global.adp.masterCache.clear('ALLUSERS', null, targetSignum);
    adp.echoLog(`Permissions updated by [${SIGNUM}/${ROLE}] for [${targetSignum}]`, null, 200, packName);
    const success = {
      code: 200,
      msg: 'Permission updated successfully',
      data: HAVEUSER,
    };
    RESOLVE(success);
    return success;
  };

  Promise.all(promises).then(async () => {
    let targetUser = targetUserFromDB;
    if (ROLE === 'admin') {
      if (PARAMETERS.role !== undefined && PARAMETERS.role !== null) {
        let newRole = PARAMETERS.role;
        if (newRole !== undefined && newRole !== null) {
          newRole = newRole.trim().toLowerCase();
        }
        if (newRole === 'admin' || newRole === 'author') {
          delete targetUser._rev;
          delete targetUser.type;
          delete targetUser.modified;
          if (targetUser.role !== newRole) {
            targetUser.role = newRole;
            const loggedUserOBJ = {
              signum: SIGNUM,
              role: ROLE,
            };
            const clearTargetUser = JSON.parse(JSON.stringify(targetUser));
            clearTargetUser.permissions = undefined;
            delete clearTargetUser.permissions;
            await global.adp.user.update(targetSignum, clearTargetUser, loggedUserOBJ);
          }
        } else {
          await global.adp.userbysignum.search(targetSignum)
            .then(async (RESULT) => {
              if (RESULT.data.usersFound.length === 1) {
                targetUser = {
                  _id: RESULT.data.usersFound[0].uid,
                  signum: RESULT.data.usersFound[0].signum,
                  name: RESULT.data.usersFound[0].name,
                  email: RESULT.data.usersFound[0].email,
                };
                const created = await global.adp.user.create(targetUser);
                if (created === 200) {
                  targetUser.role = newRole;
                  const loggedUserOBJ = {
                    signum: SIGNUM,
                    role: ROLE,
                  };
                  const clearTargetUser = JSON.parse(JSON.stringify(targetUser));
                  clearTargetUser.permissions = undefined;
                  delete clearTargetUser.permissions;
                  await global.adp.user.update(targetSignum, clearTargetUser, loggedUserOBJ);
                }
              }
            })
            .catch(() => {});
        }
        await global.adp.permission.isFieldAdminByUserID(targetSignum)
          .then((PERMISSIONS) => {
            const domains = [];
            PERMISSIONS.forEach((ITEM) => { domains.push(ITEM.item); });
            if (domains.length > 0) {
              targetUser.permissions = domains;
            } else {
              targetUser.permissions = [];
            }
          })
          .catch(() => {});
      }
    }
    return resolveThis(targetUser);
  })
    .catch((ERROR) => {
      const error = {
        code: 403,
        msg: 'Forbidden',
      };
      REJECT(error);
      const errorText = 'Error in [ Promise.all ]';
      adp.echoLog(errorText, { error: ERROR }, 500, packName, true);
      return false;
    });
});
// ============================================================================================= //
