// ============================================================================================= //
/**
* [ permission.getAdminsByField ]
* This function is used to get the list of admins for requested listoption field
* @param {integer} Field for which list of admins are requested
* @param {integer} Option of field for which list of admins are requested
* @returns {Promise} Promise object represents list of admins
* @author Omkar Sadegaonkar [zsdgmkr]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports.fetchAdmins = (FIELDID, OPTIONID) => new Promise((RESOLVE, REJECT) => {
  const packName = 'permission.getAdminsByField';
  const dbModel = new adp.models.Permission();
  const errorDenied = 400;
  if (!FIELDID) {
    adp.echoLog('ERROR: Bad Request - "FIELDID"', { FIELDID }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  if (!OPTIONID) {
    adp.echoLog('ERROR: Bad Request - "OPTIONID"', { OPTIONID }, 400, packName, true);
    REJECT(errorDenied);
    return errorDenied;
  }
  const fieldId = FIELDID;
  const itemId = OPTIONID;
  dbModel.getAllPermissionsByField(fieldId, itemId)
    .then((RESULT) => {
      const resultOfQuery = RESULT.docs;
      if (resultOfQuery[0] && resultOfQuery[0].admin) {
        const allPromisesToGetAdminUserData = [];
        Object.keys(resultOfQuery[0].admin).forEach((admin) => {
          allPromisesToGetAdminUserData.push(global.adp.user.getUserNameMail(admin.toLowerCase()));
        });
        Promise.all(allPromisesToGetAdminUserData).then((adminUsers) => {
          try {
            RESOLVE(adminUsers.map(adminUser => adminUser.email));
            return true;
          } catch (error) {
            RESOLVE([]);
            const errorText = 'Error on try/catch of [ Promise.all ]';
            const errorOBJ = {
              error,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return true;
          }
        })
          .catch((ERROR) => {
            REJECT(ERROR);
            const errorText = 'Error in [ Promise.all ]';
            const errorOBJ = {
              error: ERROR,
            };
            adp.echoLog(errorText, errorOBJ, 500, packName, true);
            return false;
          });
      } else {
        RESOLVE([]);
        const errorText = 'Admins not found for specified field and option';
        const errorOBJ = {
          databaseAnswer: resultOfQuery,
        };
        adp.echoLog(errorText, errorOBJ, 404, packName);
      }
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ dbModel.getAllPermissionsByField ]';
      const errorOBJ = {
        fieldId,
        itemId,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      REJECT(ERROR);
      return false;
    });
  return true;
});
// ============================================================================================= //
