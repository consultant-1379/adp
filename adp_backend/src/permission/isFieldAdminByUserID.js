// ============================================================================================= //
/**
* [ global.adp.permission.isFieldAdminByUserID ]
* Return list of fields
* @param {Object} SIGNUM The id of the User.
* @return This functions is a <b>Promise</b>.
* Returns the ASSET if true ( Is Field Admin ),
* or undefined if not.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = SIGNUM => new Promise(async (RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.permission.isFieldAdminByUserID';
  const dbModel = new adp.models.Permission();
  const fields = [];
  const respFields = [];
  const JSONSelector = {
    selector: { deleted: { $exists: false } },
    limit: 9999999,
    skip: 0,
    execution_stats: true,
  };
  dbModel.index()
    .then((PERMISSIONS) => {
      PERMISSIONS.docs.forEach((PERMISSION) => {
        const tempFieldAdmin = {};
        tempFieldAdmin['group-id'] = PERMISSION['group-id'];
        tempFieldAdmin['item-id'] = PERMISSION['item-id'];
        Object.keys(PERMISSION.admin).some((admin) => {
          if (admin === SIGNUM) {
            fields.push(tempFieldAdmin);
            return true;
          }
          return false;
        });
      });
      global.adp.listOptions.get().then((ans) => {
        const listOptions = JSON.parse(ans);
        if (Array.isArray(listOptions)) {
          let foundOne;
          let foundOneItem;
          let tempField = {};
          fields.forEach((field) => {
            tempField = {};
            foundOne = listOptions.filter(option => option.id === field['group-id']);
            if (foundOne.length === 1) {
              tempField.field = foundOne[0].slug;
              if (Array.isArray(foundOne[0].items)) {
                foundOneItem = foundOne[0].items.filter(option => option.id === field['item-id']);
                if (foundOneItem.length === 1) {
                  tempField.item = foundOneItem[0].name;
                }
              } else {
                tempField.item = '';
              }
            }
            respFields.push(tempField);
          });
        }
        const theEndTime = new Date() - timer;
        adp.echoLog(`Checking completed for if user [${SIGNUM}] is field admin in ${theEndTime}ms`, null, 200, packName);
        RESOLVE(respFields);
      })
        .catch((error) => {
          const errorText = 'Error in [ adp.listOptions.get ]';
          const errorOBJ = { error };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          REJECT(error);
        });
    })
    .catch((error) => {
      const errorText = 'Error in [ dbModel.index ]';
      const errorOBJ = {
        database: 'dataBasePermission',
        query: JSONSelector,
        error,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(error);
    });
});
// ============================================================================================= //
