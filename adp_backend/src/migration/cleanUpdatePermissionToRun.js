// ============================================================================================= //
/**
* [ global.adp.migration.cleanUpdatePermissionToRun ]
* Update the lastRun date of each Permission To Run
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = PERMISSIONS => new Promise((RESOLVE, REJECT) => {
  // ------------------------------------------------------------------------------------------- //
  const timer = new Date();
  const packName = 'global.adp.migration.cleanUpdatePermissionToRun';
  // ------------------------------------------------------------------------------------------- //
  const updatePermission = NAME => new Promise((RES1, REJ1) => {
    const dbModel = new adp.models.Migrationscripts();
    dbModel.getByName(NAME)
      .then((RES) => {
        if (RES.docs.length === 1) {
          const permission = RES.docs[0];
          // eslint-disable-next-line no-underscore-dangle
          delete permission._rev;
          permission.lastRun = new Date();
          dbModel.update(permission)
            .then(() => {
              RES1();
            });
        }
      })
      .catch((ERROR) => {
        const endTimer = new Date() - timer;
        const errorMSG = `Error in ${endTimer}ms through [${packName}] :: ${ERROR}`;
        REJ1(errorMSG);
      });
  // ------------------------------------------------------------------------------------------- //
  });
  // ------------------------------------------------------------------------------------------- //
  const allPromises = [];
  if (Array.isArray(PERMISSIONS)) {
    PERMISSIONS.forEach((perm) => {
      allPromises.push(updatePermission(perm));
    });
  } else {
    allPromises.push(updatePermission(PERMISSIONS));
  }
  Promise.all(allPromises)
    .then(() => {
      RESOLVE();
    })
    .catch((ERROR) => {
      REJECT(ERROR);
    });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
