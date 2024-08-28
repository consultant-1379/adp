// ============================================================================================= //
/**
* [ global.adp.microservice.checkId ]
* Check if ID is valid.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = ID => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.microservice.checkId';
  const adpModel = new global.adp.models.Adp();
  adpModel.getById([ID])
    .then((RES) => {
      if (RES.resultsReturned === 0) {
        REJECT();
        return;
      }
      RESOLVE('Valid ID');
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      adp.echoLog(`Error in ${endTimer}ms through [ ${packName} ]`, { error: ERROR }, 500, packName, true);
      REJECT();
    });
});
// ============================================================================================= //
