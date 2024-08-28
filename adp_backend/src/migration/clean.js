// ============================================================================================= //
/**
* [ global.adp.migration.clean ]
* Check the integrity of Microservices in Database.
* This file just organize the call of other three files:
* = global.adp.migration.cleanGetPermissionToRun
* = global.adp.migration.cleanGetAllAssets
* = global.adp.migration.cleanRunScripts
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  // ------------------------------------------------------------------------------------------- //
  const timer = new Date();
  const packName = 'global.adp.migration.clean';
  global.adp.echoDivider();
  // ------------------------------------------------------------------------------------------- //
  global.adp.migration.memoryCache = {};
  // ------------------------------------------------------------------------------------------- //
  // Promise Chain
  // ------------------------------------------------------------------------------------------- //
  global.adp.migration.cleanGetPermissionToRun()
    .then(RULES => global.adp.migration.cleanGetAllAssets(RULES))
    .then(RULESASSETS => global.adp.migration.cleanRunScripts(RULESASSETS))
    .then(() => {
      const endTimer = (new Date()) - timer;
      const msg = `Migration Scripts finished execution in ${endTimer}ms.`;
      delete global.adp.migration.memoryCache;
      RESOLVE(msg);
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      const errorMSG = `Error in ${endTimer}ms through [${packName}] :: ${ERROR}`;
      delete global.adp.migration.memoryCache;
      REJECT(errorMSG);
    });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
