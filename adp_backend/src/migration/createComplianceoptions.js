// ============================================================================================= //
/**
* [ global.adp.migration.createComplianceoptions ]
* Update the complianceoptions database with new values from file complianceoption.json
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE, REJECT) => {
  const packName = 'adp.migration.createComplianceoptions';
  const dbname = 'complianceoption';
  await global.adp.dbConnection.db.destroy(dbname);
  await global.adp.dbConnection.db.create(dbname);
  await global.adp.listOptions.setDataBaseForListOptions('ComplianceOption')
    .then((msg) => {
      adp.echoLog(`[+${global.adp.timeStepNext()}] ${msg}`, null, 200, packName);
      RESOLVE();
    })
    .catch((err) => {
      adp.echoLog(`[+${global.adp.timeStepNext()}] Error in [ adp.listOptions.setDataBaseForListOptions ]`, err, 500, packName, true);
      REJECT(err);
    });
});
// ============================================================================================= //
