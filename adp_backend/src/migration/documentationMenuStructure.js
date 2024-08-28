// ============================================================================================= //
/**
* [ global.adp.migration.documentationMenuStructure ]
* Convert from the classic documentation menu structure to the new one ( ADPPRG-25890 ).
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  const { slugIt } = global.adp;
  const echo = adp.echoLog;
  const getListOptions = global.adp.listOptions.get;
  const packName = 'global.adp.migration.documentationMenuStructure';
  const ms = MS;
  let haveChanges = false;

  if (ms.menu_auto === undefined) {
    haveChanges = true;
    ms.menu_auto = false;
  }
  if (ms.repo_urls === undefined) {
    haveChanges = true;
    ms.repo_urls = { development: '', release: '' };
  } else {
    if (ms.repo_urls.development === undefined) {
      haveChanges = true;
      ms.repo_urls.development = '';
    }
    if (ms.repo_urls.release === undefined) {
      haveChanges = true;
      ms.repo_urls.release = '';
    }
  }
  if (ms.menu === undefined) {
    haveChanges = true;
    ms.menu = {};
  }
  const previousMenu = global.adp.clone(ms.menu);
  ms.menu = global.adp.microservice.menuBasicStructure(ms.menu);
  if (JSON.stringify(ms.menu) !== JSON.stringify(previousMenu)) {
    haveChanges = true;
  }

  if (ms.documentation !== undefined) {
    getListOptions()
      .then((LISTOPTIONS) => {
        const listOptions = JSON.parse(LISTOPTIONS);
        const listOptionsOldTitles = listOptions[7].items;
        const newManualMenu = [];
        let foundFirstDefault = false;
        ms.documentation.forEach((DOC) => {
          let stringName = null;
          if (DOC.titleId === 11) {
            stringName = DOC.title.trim();
          } else {
            stringName = listOptionsOldTitles.filter(ITEM => ITEM.id === DOC.titleId)[0].name;
          }
          const theNewDOC = {
            name: stringName,
            slug: slugIt(stringName),
            external_link: DOC.url,
            default: true,
          };
          if (DOC.default === true) {
            if (foundFirstDefault) {
              delete theNewDOC.default;
            }
            foundFirstDefault = true;
          } else {
            delete theNewDOC.default;
          }
          newManualMenu.push(theNewDOC);
        });
        if (newManualMenu.length === 1 || !foundFirstDefault) {
          newManualMenu[0].default = true;
        }
        ms.menu.manual.development = newManualMenu;
        ms.documentation = undefined;
        ms.menu = global.adp.microservice.menuBasicStructure(ms.menu);
        RESOLVE(ms);
      })
      .catch((ERROR) => {
        echo('Error on retrieve listOptions ( Can`t apply this migration script... )', { error: ERROR }, 500, packName, true);
        RESOLVE(true);
      });
  } else if (haveChanges === true) {
    RESOLVE(ms);
  } else {
    RESOLVE(true);
  }
});
// ============================================================================================= //
