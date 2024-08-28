// ============================================================================================= //
/**
* [ global.adp.microservice.menuApplyRulesOnManual ]
* Apply rules on manual documentation menu.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MENU => new Promise((RESOLVE, REJECT) => {
  if (MENU === undefined || MENU === null) {
    RESOLVE(MENU);
    return;
  }
  if (MENU.manual === undefined || MENU.manual === null) {
    RESOLVE(MENU);
    return;
  }
  const packName = 'global.adp.microservice.menuApplyRulesOnManual';
  let menu = global.adp.clone(MENU);
  const originalMenuAuto = global.adp.clone(menu.auto);
  delete menu.auto;
  menu = global.adp.microservice.menuBasicStructure(menu);
  global.adp.documentMenu.process.action(menu)
    .then((RESULT) => {
      const result = RESULT;
      result.manual.date_modified = new Date();
      result.auto = originalMenuAuto;
      let foundErrors = false;
      const errorsArray = [];
      if (result.manual.errors !== undefined) {
        if (result.manual.errors.development !== undefined) {
          if (result.manual.errors.development.length > 0) {
            result.manual.errors.development.forEach((ITEM) => {
              errorsArray.push(`[ Development Error Detect ] ${ITEM}`);
            });
            foundErrors = true;
          }
        }
        if (result.manual.errors.release !== undefined) {
          if (result.manual.errors.release.length > 0) {
            result.manual.errors.release.forEach((ITEM) => {
              errorsArray.push(`[ Release Error Detect ] ${ITEM}`);
            });
            foundErrors = true;
          }
        }
      }
      if (!foundErrors) {
        delete result.auto.errors;
        delete result.auto.warnings;
        delete result.manual.errors;
        delete result.manual.warnings;
        RESOLVE(result);
      } else {
        REJECT(errorsArray);
      }
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ adp.documentMenu.process.action ]', { error: ERROR }, 500, packName, true);
      REJECT(ERROR);
    });
});
// ============================================================================================= //
