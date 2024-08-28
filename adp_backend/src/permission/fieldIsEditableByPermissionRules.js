// ============================================================================================= //
/**
* [ global.adp.permission.fieldIsEditableByPermissionRules ]
* @param {String} ASSET The Asset/Microservice Object.
* @param {JSON} SIGNUM The signum of the user.
* @returns {Array} List of Fields which this user cannot edit. Can be empty.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (ASSET, SIGNUM) => new Promise(async (RESOLVE) => {
  const timer = new Date();
  const packName = 'global.adp.permission.fieldIsEditableByPermissionRules';
  if (global.adp.permission.fieldPermissionCache === undefined
    || global.adp.permission.fieldPermissionCache === null) {
    await global.adp.permission.fieldListWithPermissions();
  }
  if (global.adp.permission.fieldIsEditableByPermissionRulesCache === undefined
    || global.adp.permission.fieldIsEditableByPermissionRulesCache === null) {
    await global.adp.permission.fieldIsEditableByPermissionRulesCacheIt();
  }
  await global.adp.permission.checkFieldPermissionCacheIt();
  const situation1 = global.adp.permission.fieldIsEditableByPermissionRulesCache === null;
  const situation2 = global.adp.permission.fieldIsEditableByPermissionRulesCache === undefined;
  const situation3 = global.adp.permission.fieldIsEditableByPermissionRulesCache.length === 0;
  const situation4 = global.adp.permission.fieldIsEditableByPermissionRulesCache.length > 0;
  if (situation1 || situation2 || situation3) {
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`Read Only Field List with Permission Rules solved in ${endTime}ms`, null, 200, packName);
    RESOLVE([]);
  } else if (situation4) {
    const allPromises = [];
    const allReadOnlyFields = [];
    const listToRemove = [];
    await global.adp.listOptions.get();
    const listOptionsCache = JSON.parse(global.adp.listOptions.cache.options);
    global.adp.permission.fieldIsEditableByPermissionRulesCache.forEach((READONLYFIELD) => {
      allReadOnlyFields.push(READONLYFIELD.field);
      READONLYFIELD.readOnlyExceptionsForListOption.forEach((FIELDID) => {
        const fieldNameArray = listOptionsCache.filter(ITEM => ITEM.id === FIELDID);
        const fieldName = fieldNameArray[0].slug;
        const fieldValue = ASSET[fieldName];
        allPromises.push(new Promise((RES1, REJ1) => {
          global.adp.permission.checkFieldPermission(FIELDID, fieldValue)
            .then((PERMISSIONOVERTHEFIELD) => {
              if (PERMISSIONOVERTHEFIELD !== undefined
                && PERMISSIONOVERTHEFIELD !== null) {
                let amIOnTheList = false;
                Object.keys(PERMISSIONOVERTHEFIELD).forEach((PERMISSIONSIGNUM) => {
                  if (PERMISSIONSIGNUM === SIGNUM) {
                    amIOnTheList = true;
                  }
                });
                if (amIOnTheList) {
                  listToRemove.push(READONLYFIELD.field);
                }
              }
              RES1();
            })
            .catch((ERR) => {
              REJ1(ERR);
            });
        }));
      });
    });
    Promise.all(allPromises)
      .then(() => {
        const finalReadOnlyList = [];
        allReadOnlyFields.forEach((ITEM) => {
          let canInsert = true;
          listToRemove.forEach((TOREMOVE) => {
            if (TOREMOVE === ITEM) {
              canInsert = false;
            }
          });
          if (canInsert) {
            finalReadOnlyList.push(ITEM);
          }
        });
        RESOLVE(finalReadOnlyList);
      })
      .catch(() => {
        RESOLVE([]);
      });
  } else {
    RESOLVE([]);
  }
});
// ============================================================================================= //
