// ============================================================================================= //
/**
* [ global.adp.microservice.checkName ]
* Check if name is unique.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (NAME, ID) => new Promise((RESOLVE, REJECT) => {
  const timer = new Date();
  const packName = 'global.adp.microservice.checkName';
  const dbModel = new adp.models.Adp();
  dbModel.getByNameIfIsNotTheID(NAME, ID)
    .then((RES) => {
      if (RES.resultsReturned === 0) {
        RESOLVE('Unique Name. Can Create!');
      } else {
        const errorMSG = 'DUPLICATE';
        REJECT(errorMSG);
      }
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      const errorMSG = `Error in ${endTimer}ms through [${packName}] :: ${ERROR}`;
      REJECT(errorMSG);
    });
});
// ============================================================================================= //
