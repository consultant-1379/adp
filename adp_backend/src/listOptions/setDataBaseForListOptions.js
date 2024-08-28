// ============================================================================================= //
/**
* [ global.adp.listOptions.setDataBaseForListOptions ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (type = 'ListOption') => new Promise((RESOLVE, REJECT) => {
  const packName = `global.adp.listOptions.setDataBaseFor${type}`;
  const dbModel = type === 'ListOption' ? new adp.models.Listoption() : new adp.models.Complianceoption();
  dbModel.index()
    .then((LISTOPTIONS) => {
      let canInsert = false;
      if (Array.isArray(LISTOPTIONS.docs)) {
        if (LISTOPTIONS.docs.length === 0) {
          canInsert = true;
        }
      }
      if (canInsert) {
        adp.echoLog(`[+${global.adp.timeStepNext()}] "${type}" database is empty. Starting to fill...`, null, 200, packName);
        const regExpRemoveLastSlashSRCAndBeyond = new RegExp(/(src(?!.*src))([\s\S])*/gim);
        const toolsPath = `tools/testDataGenerator/templateDataBase/${type.toLowerCase()}.json`;
        let listOptionsJSONPath = `${global.adp.path}`;
        listOptionsJSONPath = listOptionsJSONPath
          .replace(regExpRemoveLastSlashSRCAndBeyond, toolsPath);
        if (global.fs.existsSync(listOptionsJSONPath)) {
          const configJSON = JSON.parse(global.fs.readFileSync(listOptionsJSONPath, 'utf-8'));
          const myPromises = [];
          if (Array.isArray(configJSON.options)) {
            configJSON.options.forEach((ITEM) => {
              myPromises.push(dbModel.createOne(ITEM));
            });
          }
          Promise.all(myPromises)
            .then(() => {
              RESOLVE(`"${type}" database was filled with default values!`);
            })
            .catch((ERROR) => {
              adp.echoLog(`[+${global.adp.timeStepNext()}] Error in [ Promise.all ]`, { error: ERROR }, 500, packName, true);
              REJECT();
            });
        } else {
          const errorMSG = `File "${listOptionsJSONPath}" not found!`;
          adp.echoLog('Error on "canInsert" variable', { error: errorMSG }, 500, packName, true);
          REJECT(errorMSG);
        }
      } else {
        RESOLVE();
      }
    })
    .catch((ERROR) => {
      adp.echoLog(`[+${global.adp.timeStepNext()}] Error on [ dbModel.index() ]`, { database: `dataBase${type}`, error: ERROR }, 500, packName, true);
      REJECT();
    });
});
// ============================================================================================= //
