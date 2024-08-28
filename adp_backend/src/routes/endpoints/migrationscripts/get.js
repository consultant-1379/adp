// ============================================================================================= //
/**
* [ global.adp.endpoints.migrationscripts.get ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (MAINREQ, MAINRES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.migrationscripts.get';
  global.adp.echoDivider();
  adp.echoLog('Running Migration Scripts by external request...', null, 200, packName);
  global.adp.echoDivider();
  await global.adp.microservice.duplicateUniqueFields(null, undefined, true)
    .then(() => {})
    .catch(() => {});
  await global.adp.migration.clean()
    .then((msg) => {
      adp.echoLog(`${msg}`, null, 200, packName);
    })
    .catch((err) => {
      const errorText = `Error running Migration Script in ${(new Date()).getTime() - timer}ms`;
      adp.echoLog(errorText, { error: err }, 500, packName, true);
    });
  global.adp.echoDivider();
  global.adp.echoDivider();
  MAINRES.end('Done. Check terminal logs.');
  const msg = `Migration Scripts by external request done in ${(new Date()).getTime() - timer}ms`;
  adp.echoLog(msg, null, 200, packName, true);
  // ============================================================================================ //
};
// ============================================================================================= //
