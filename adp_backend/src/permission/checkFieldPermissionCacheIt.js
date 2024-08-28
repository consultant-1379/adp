// ============================================================================================= //
/**
* [ global.adp.permission.checkFieldPermissionCacheIt ]
* Create a cache with all the Permissions from Database.
* Do not run this inside of a looping ( Or this will be useless ).
* Call this function before [ global.adp.permission.checkFieldPermission ]
* [ global.adp.permission.checkFieldPermission ] can be inside of a looping.
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const dbModel = new adp.models.Permission();
  const packName = 'global.adp.permission.checkFieldPermissionCacheIt';
  const staticCache = global.adp.permission.checkFieldPermissionCache;
  if (staticCache !== undefined && staticCache !== null) {
    if (staticCache.date !== undefined && staticCache.date !== null) {
      const now = new Date();
      const diff = (now.getTime() - staticCache.date.getTime());
      if (diff < (global.adp.cache.timeInSecondsForDatabase * 1000)) {
        RESOLVE(global.adp.permission.checkFieldPermissionCache);
        return;
      }
    }
  }

  dbModel.index().then((PERMISSIONS) => {
    const cache = {};
    PERMISSIONS.docs.forEach((PERMISSION) => {
      const groupID = PERMISSION['group-id'];
      if (cache[groupID] === undefined || cache[groupID] === null) {
        cache[groupID] = {};
      }
      const itemID = PERMISSION['item-id'];
      cache[groupID][itemID] = {};
      cache[groupID][itemID].fieldAdministrators = PERMISSION.admin;
    });
    cache.date = new Date();
    global.adp.permission.checkFieldPermissionCache = cache;
    const endTime = (new Date()).getTime() - timer.getTime();
    adp.echoLog(`Got permission from Database in ${endTime}ms`, null, 200, packName);
    RESOLVE(global.adp.permission.checkFieldPermissionCache);
  })
    .catch(() => {
      REJECT();
    });
// ============================================================================================= //
});
// ============================================================================================= //
