// ============================================================================================= //
/**
* [ global.adp.migration.cleanGetPermissionToRun ]
* Get the permission of each migration script to run.
* Decide what can be executed and what will be only analysed.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((RESOLVE, REJECT) => {
  // ------------------------------------------------------------------------------------------- //
  const timer = new Date();
  const packName = 'global.adp.migration.cleanGetPermissionToRun';
  const dbModel = new adp.models.Migrationscripts();
  // ------------------------------------------------------------------------------------------- //
  dbModel.index()
    .then((RES) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      const permissionToRunJustForDatabase = [];
      const permissionToRunForEachDoc = [];
      let atLeastOne = 0;
      RES.docs.forEach((PERMISSION) => {
        // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //
        /* Example of PERMISSION:
        // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //
        {
          "_id": "5c2941141c64cfbcea47e8b1600a7825",
          "_rev": "1-3eaadbdbb7cdc7c3a5f40f8b8db58d07",
          "commandName": "trimName",
          "version": "1.0.40",
          "runOnce": false,
          "lastRun": null
        }
        */
        // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //
        let applyRule = false;
        const ruleRunJustOnceIsOFF = PERMISSION.runOnce === false;
        const ruleLastRunIsNotThere = PERMISSION.lastRun === undefined
          || PERMISSION.lastRun === null;
        const ruleRunOnceAndLastRunAreAllowing = !(!ruleRunJustOnceIsOFF && !ruleLastRunIsNotThere);
        if (ruleRunJustOnceIsOFF || ruleLastRunIsNotThere || ruleRunOnceAndLastRunAreAllowing) {
          applyRule = true;
        }
        PERMISSION.applyRule = applyRule;
        PERMISSION.followRule = 0;
        PERMISSION.breakRule = 0;

        const focusOnDatabase = PERMISSION.focus === 'database';
        const focusOnAsset = PERMISSION.focus === 'asset';
        const focusOnUsers = PERMISSION.focus === 'user';
        const lastRunIsInvalid = PERMISSION.lastRun === undefined || PERMISSION.lastRun === null;
        const canRunJustOnce = PERMISSION.runOnce === true;
        const canRunOnThisDatabase = !canRunJustOnce || (canRunJustOnce && lastRunIsInvalid);

        if (focusOnDatabase && canRunOnThisDatabase) {
          permissionToRunJustForDatabase.push(PERMISSION);
          adp.echoLog(`[ ${PERMISSION.commandName} ] will run for Database...`, null, 200, packName);
          atLeastOne += 1;
        }
        if (focusOnAsset && canRunOnThisDatabase) {
          permissionToRunForEachDoc.push(PERMISSION);
          adp.echoLog(`[ ${PERMISSION.commandName} ] will run for each Asset...`, null, 200, packName);
          atLeastOne += 1;
        }
        if (focusOnUsers && canRunOnThisDatabase) {
          permissionToRunForEachDoc.push(PERMISSION);
          adp.echoLog(`[ ${PERMISSION.commandName} ] will run for each User...`, null, 200, packName);
          atLeastOne += 1;
        }
      });
      const rulesResult = {
        migrationscripts: {
          database: permissionToRunJustForDatabase,
          doc: permissionToRunForEachDoc,
        },
      };
      if (atLeastOne > 0) {
        global.adp.echoDivider();
      }
      RESOLVE(rulesResult);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      const errorMSG = `Error in ${endTimer}ms through [${packName}] :: ${ERROR}`;
      REJECT(errorMSG);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
