// ============================================================================================= //
/**
* [ global.adp.permission.changeUser ]
* Change the permissions of a user
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @param {Object} PARAMETERS The JSON with the instructions.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE, PARAMETERS) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.permission.changeUser';
  const dbModel = new adp.models.Permission();
  let fieldCode = null;
  let itemCode = null;
  let actionCommand = 'read';
  let targetSignum;
  if (PARAMETERS === null || PARAMETERS === undefined) {
    const error = {
      code: 400,
      msg: 'No instructions was found',
    };
    REJECT(error);
    return;
  }
  if (PARAMETERS.fieldcode !== null && PARAMETERS.fieldcode !== undefined) {
    fieldCode = PARAMETERS.fieldcode;
    if (isNaN(fieldCode)) {
      const error = {
        code: 400,
        msg: 'The field "fieldcode" should be a number!',
      };
      REJECT(error);
      return;
    }
  }
  if (PARAMETERS.itemcode !== null && PARAMETERS.itemcode !== undefined) {
    itemCode = PARAMETERS.itemcode;
    if (isNaN(itemCode)) {
      const error = {
        code: 400,
        msg: 'The field "itemCode" should be a number!',
      };
      REJECT(error);
      return;
    }
  }
  if (PARAMETERS.action !== null && PARAMETERS.action !== undefined) {
    actionCommand = (typeof PARAMETERS.action === 'string') ? PARAMETERS.action.trim().toLowerCase() : PARAMETERS.action;
    if (actionCommand !== 'read' && actionCommand !== 'add' && actionCommand !== 'remove') {
      const error = {
        code: 400,
        msg: 'The field "action" should be a string ( read, add or remove )!',
      };
      REJECT(error);
      return;
    }
  }
  if (PARAMETERS.target !== null && PARAMETERS.target !== undefined) {
    targetSignum = PARAMETERS.target;
  } else {
    const error = {
      code: 400,
      msg: 'The field "target" should be a provided!',
    };
    REJECT(error);
    return;
  }

  if (targetSignum === SIGNUM) {
    adp.echoLog(`Request from [${SIGNUM}/${ROLE}] for change itself field permissions...`, null, 200, packName);
  } else {
    adp.echoLog(`Request from [${SIGNUM}/${ROLE}] for change [${targetSignum}] field permissions...`, null, 200, packName);
  }

  // =========================================================================================== //
  /**
   * This function checks if the operating user has permissions to change the
   * permissions of the user
   * @author Armando
   */
  const checkAccess = () => new Promise((RES, REJ) => {
    dbModel.getFieldAdminPermission(SIGNUM, fieldCode, itemCode)
      .then((PERMISSIONS) => {
        if (PERMISSIONS.docs.length > 0) {
          RES();
        } else {
          REJ();
        }
      })
      .catch((ERROR) => {
        const errorText = 'Error in [ dbModel.getFieldAdminPermission ] at [ checkAccess ]';
        const errorObj = {
          signum: SIGNUM,
          fieldCode,
          itemCode,
          error: ERROR,
        };
        adp.echoLog(errorText, errorObj, 500, packName, true);
        REJ();
      });
  });
  // =========================================================================================== //
  /**
   * This function is used to read the permissions of the user
   * for the provided field and item
   * @author Armando
   */
  const readPermissions = () => new Promise(async (RES, REJ) => {
    let canDoThis = false;
    if (ROLE === 'admin') {
      canDoThis = true;
    } else {
      await checkAccess()
        .then(() => {
          canDoThis = true;
        })
        .catch(() => {
          canDoThis = false;
          const obj = {
            code: 403,
            msg: `Read fail for [${SIGNUM}/${ROLE}] - Forbidden`,
          };
          REJ(obj);
        });
    }
    if (canDoThis) {
      dbModel.getFieldAdminPermission(targetSignum, fieldCode, itemCode)
        .then((PERMISSIONS) => {
          const obj = {
            code: 200,
            msg: `Read successful for [${SIGNUM}/${ROLE}]`,
            data: PERMISSIONS.docs,
          };
          RES(obj);
        })
        .catch((ERROR) => {
          const obj = {
            code: 500,
            msg: `Read fail for [${SIGNUM}/${ROLE}]`,
            data: ERROR.msg,
          };
          REJ(obj);
        });
    }
  });
  // =========================================================================================== //
  /**
   * This function adds the permission for user
   * @author Omkar
   */
  const addPermission = () => new Promise(async (RES, REJ) => {
    let canDoThis = false;
    if (ROLE === 'admin') {
      canDoThis = true;
    } else {
      await checkAccess()
        .then(() => {
          canDoThis = true;
        })
        .catch(() => {
          canDoThis = false;
          const obj = {
            code: 403,
            msg: `Add fail for [${SIGNUM}/${ROLE}] - Forbidden`,
          };
          REJ(obj);
        });
    }
    if (canDoThis) {
      dbModel.getFieldAdminPermission(targetSignum, fieldCode, itemCode)
        .then((PERMISSIONS) => {
          if (PERMISSIONS.docs.length > 1) {
            adp.echoLog(`No field permissions found for [${targetSignum}] `, null, 200, packName);
            const obj = {
              code: 200,
              msg: `unique permission not found for [${SIGNUM}/${ROLE}]`,
            };
            RES(obj);
            return false;
          }
          if (PERMISSIONS.docs.length === 0) {
            // Need to create a permission document
            const newPermission = {
              'group-id': fieldCode,
              'item-id': itemCode,
              admin: {
              },
            };
            newPermission.admin[targetSignum] = {
              notification: [
                'update',
                'delete',
                'create',
              ],
            };
            global.adp.permission.crudCreate(SIGNUM, ROLE, newPermission).then(() => {
              const obj = {
                code: 200,
                msg: `Added successfully for [${targetSignum}]`,
              };
              RES(obj);
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
              const obj = {
                code: 500,
                msg: `Creating fail for [${SIGNUM}/${ROLE}]`,
                data: ERROR.msg,
              };
              REJ(obj);
              return false;
            });
            return true;
          }
          const newPermission = PERMISSIONS.docs[0];
          newPermission.admin[targetSignum] = {
            notification: [
              'update',
              'delete',
              'create',
            ],
          };
          global.adp.permission.crudUpdate(SIGNUM, ROLE, newPermission).then(() => {
            const obj = {
              code: 200,
              msg: `Added successfully for [${targetSignum}]`,
            };
            RES(obj);
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
            const obj = {
              code: 500,
              msg: `Add fail for [${SIGNUM}/${ROLE}]`,
              data: ERROR.msg,
            };
            REJ(obj);
            return false;
          });
          return true;
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ dbModel.getFieldAdminPermission ]';
          const errorOBJ = {
            fieldCode,
            itemCode,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          const obj = {
            code: 500,
            msg: `Add fail for [${SIGNUM}/${ROLE}]`,
            data: ERROR.msg,
          };
          REJ(obj);
        });
    }
  });
  // =========================================================================================== //
  /**
   * This function is used to remove the permissions of the user
   * for the provided field and item
   * @author Omkar
   */
  const removePermission = () => new Promise(async (RES, REJ) => {
    let canDoThis = false;
    if (ROLE === 'admin') {
      canDoThis = true;
    } else {
      await checkAccess()
        .then(() => {
          canDoThis = true;
        })
        .catch(() => {
          canDoThis = false;
          const obj = {
            code: 403,
            msg: `Remove fail for [${SIGNUM}/${ROLE}] - Forbidden`,
          };
          REJ(obj);
        });
    }
    if (canDoThis) {
      dbModel.getFieldAdminPermission(targetSignum, fieldCode, itemCode)
        .then((PERMISSIONS) => {
          if (PERMISSIONS.docs.length !== 1) {
            adp.echoLog(`No field permissions found for [${targetSignum}] `, null, 200, packName);
            const obj = {
              code: 200,
              msg: `permission not found for [${SIGNUM}/${ROLE}]`,
            };
            RES(obj);
            return false;
          }
          const newPermission = PERMISSIONS.docs[0];
          delete newPermission.admin[targetSignum];
          global.adp.permission.crudUpdate(SIGNUM, ROLE, newPermission).then(() => {
            const obj = {
              code: 200,
              msg: `Removed successful for [${targetSignum}]`,
            };
            RES(obj);
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
            const obj = {
              code: 500,
              msg: `Remove fail for [${SIGNUM}/${ROLE}]`,
              data: ERROR.msg,
            };
            REJ(obj);
            return false;
          });
          return true;
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ dbModel.getFieldAdminPermission ]';
          const errorOBJ = {
            signum: SIGNUM,
            targetSignum,
            fieldCode,
            itemCode,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          const obj = {
            code: 500,
            msg: `Remove fail for [${SIGNUM}/${ROLE}]`,
            data: ERROR.msg,
          };
          REJ(obj);
        });
    }
  });
  // =========================================================================================== //

  // ------------------------------------------------------------------------------------------- //
  switch (actionCommand) {
  // ------------------------------------------------------------------------------------------- //
    case 'add':
      // --------------------------------------------------------------------------------------- //
      RESOLVE(addPermission());
      // --------------------------------------------------------------------------------------- //
      break;
    case 'remove':
      // --------------------------------------------------------------------------------------- //
      RESOLVE(removePermission());
      // --------------------------------------------------------------------------------------- //
      break;
    default: // read
      // --------------------------------------------------------------------------------------- //
      RESOLVE(readPermissions());
      // --------------------------------------------------------------------------------------- //
      break;
  // ------------------------------------------------------------------------------------------- //
  }
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
