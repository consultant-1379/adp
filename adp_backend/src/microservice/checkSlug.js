// ============================================================================================= //
/**
* [ global.adp.microservice.checkSlug ]
* Check if Microservice SLUG is valid.
* Promise resolves with 'Valid SLUG' if slug is valid
* @params {string} SLUG of microservice that needs to be checked
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = SLUG => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.microservice.checkSlug';
  const adpModel = new adp.models.Adp();
  adpModel.getByMSSlug(SLUG)
    .then((RES) => {
      if (RES.resultsReturned === 0) {
        const errResp = { message: `Microservice not found for slug ${SLUG}`, code: 404 };
        REJECT(errResp);
        return;
      }
      RESOLVE('Valid SLUG');
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      adp.echoLog(`Error in ${endTimer}ms through [ ${packName} ]`, { error: ERROR }, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
