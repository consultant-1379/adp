// ============================================================================================= //
/**
* [ global.adp.migration.updateListoptionsDocCat ]
* Update the listoptions database with new values from file listOptions.json
* @author Omkar
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign                                                              */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'adp.migration.updateListoptionsDocCat';
  const dbname = 'listoption';
  await global.adp.dbConnection.db.destroy(dbname);
  await global.adp.dbConnection.db.create(dbname);
  await global.adp.listOptions.setDataBaseForListOptions()
    .then((msg) => {
      adp.echoLog(`[+${global.adp.timeStepNext()}] ${msg}`, null, 200, packName);
      RESOLVE();
    })
    .catch((err) => {
      const errorText = `[+${global.adp.timeStepNext()}] Error found in [ adp.listOptions.setDataBaseForListOptions ]`;
      adp.echoLog(errorText, { error: err }, 500, packName, true);
      REJECT(err);
    });
});
// ============================================================================================= //
