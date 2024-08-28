// ============================================================================================= //
/**
* [ global.adp.microservice.menuBasicStructure ]
* Check if menu object contains minimal information and structure.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (MENU) => {
  const menu = MENU;
  if (menu === null || menu === undefined) {
    const obj = {
      auto: { development: [], release: [], date_modified: '' },
      manual: { development: [], release: [], date_modified: '' },
    };
    return obj;
  }
  if (menu.auto === null || menu.auto === undefined) {
    menu.auto = { development: [], release: [], date_modified: '' };
  }
  if (menu.auto.development === null || menu.auto.development === undefined) {
    menu.auto.development = [];
  }
  if (menu.auto.release === null || menu.auto.release === undefined) {
    menu.auto.release = [];
  }
  if (menu.auto.date_modified === null || menu.auto.date_modified === undefined) {
    menu.auto.date_modified = '';
  }
  if (menu.manual === null || menu.manual === undefined) {
    menu.manual = { development: [], release: [], date_modified: '' };
  }
  if (menu.manual.development === null || menu.manual.development === undefined) {
    menu.manual.development = [];
  }
  if (menu.manual.release === null || menu.manual.release === undefined) {
    menu.manual.release = [];
  }
  if (menu.manual.date_modified === null || menu.manual.date_modified === undefined) {
    menu.manual.date_modified = '';
  }
  return menu;
};
// ============================================================================================= //
