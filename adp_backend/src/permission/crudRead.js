// ============================================================================================= //
/**
* [ global.adp.permission.crudRead ]
* List of Permissions ( What the logged user can see )
* @param {Object} SIGNUM The id of the user.
* @param {Object} ROLE The role of the user.
* @return This functions is a <b>Promise</b>.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, ROLE) => new Promise((RESOLVE, REJECT) => {
  const time = new Date();
  const packName = 'global.adp.permission.crudRead';
  const dbModel = new adp.models.Permission();
  dbModel.index()
    .then((ALLPERMISSIONS) => {
      if (ALLPERMISSIONS.docs.length === 0) {
        const obj = {
          database: 'dataBasePermission',
          query: {},
        };
        const endTime = (new Date()).getTime() - time.getTime();
        adp.echoLog(`There is no permission to show! ( in ${endTime}ms )`, obj, 200, packName);
        RESOLVE([]);
        return;
      }
      const allPermissions = ALLPERMISSIONS.docs;
      let filteredPermissions = [];
      if (ROLE === 'admin') {
        filteredPermissions = allPermissions;
      } else {
        allPermissions.forEach((PER) => {
          if (PER.admin[SIGNUM] !== null && PER.admin[SIGNUM] !== undefined) {
            filteredPermissions.push(PER);
          }
        });
      }
      if (filteredPermissions.length === 0) {
        RESOLVE([]);
      } else {
        RESOLVE(filteredPermissions);
      }
    }).catch((ERROR) => {
      const errorText = 'Error in [ dbModel.index ]';
      const errorOBJ = {
        database: 'dataBasePermission',
        query: {},
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
