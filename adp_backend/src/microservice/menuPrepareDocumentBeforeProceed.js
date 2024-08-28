// ============================================================================================= //
/**
* [ global.adp.microservice.menuPrepareDocumentBeforeProceed ]
* Copy the previous inactive menu to the new object, to not lose it.
* @param {Object} MSTOCHANGE Microservice to change.
* @param {Object} OLDMSTOCOMPARE Previous microservice to compare.
* @return The Microservice Object, changed.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MSTOCHANGE, OLDMSTOCOMPARE, CANCHANGEAUTO = false) => {
  if (OLDMSTOCOMPARE === null || OLDMSTOCOMPARE === undefined) {
    return MSTOCHANGE;
  }
  if (OLDMSTOCOMPARE.menu === null || OLDMSTOCOMPARE.menu === undefined) {
    return MSTOCHANGE;
  }
  const ms = global.adp.clone(MSTOCHANGE);
  let cloneOldMSMenu = global.adp.clone(OLDMSTOCOMPARE.menu);
  cloneOldMSMenu = global.adp.microservice.menuBasicStructure(cloneOldMSMenu);
  if (ms.menu === undefined || ms.menu === undefined) {
    ms.menu = {};
    ms.menu = global.adp.microservice.menuBasicStructure(ms.menu);
  }
  if (ms.menu_auto === true) {
    // menu_auto is true, so we should ignore the "manual menu" changes...
    ms.menu.manual = cloneOldMSMenu.manual;
  }
  if (CANCHANGEAUTO === false) {
    // If [ global.adp.microservice.menuPrepareDocumentBeforeProceed ] is called by
    // [ global.adp.microservice.update ], the CANCHANGEAUTO should be false
    // because the ms.menu.auto should not change, so we copy the previous menu
    // (cloneOldMSMenu.auto) over the new (ms.menu.auto).
    ms.menu.auto = cloneOldMSMenu.auto;
  }
  ms.menu = global.adp.microservice.menuBasicStructure(ms.menu);
  return ms;
};
// ============================================================================================= //
