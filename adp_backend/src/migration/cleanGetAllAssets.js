// ============================================================================================= //
/**
* [ global.adp.migration.cleanGetAllAssets ]
* Retrieve all documents from DB and filter assets/microservices,users based on criteria passed.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Migration+Script
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = PROCESSOBJ => new Promise((RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const timer = new Date();
  const packName = 'global.adp.migration.cleanGetAllAssets';
  const dbModel = new adp.models.Adp();
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  dbModel.index()
    .then((AllMSOBJ) => {
      const AllDocs = AllMSOBJ.docs;
      const resObj = PROCESSOBJ;
      resObj.allassets = AllDocs.filter(doc => doc.type === 'microservice');
      resObj.allUsers = AllDocs.filter(doc => doc.type === 'user');
      RESOLVE(resObj);
    })
    .catch((ERROR) => {
      const endTimer = new Date() - timer;
      const errorMSG = `Error in ${endTimer}ms through [${packName}] :: ${ERROR}`;
      REJECT(errorMSG);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
