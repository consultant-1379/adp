/**
* Exported Method: [ global.adp.documentMenu.process.action ]
* Get the JSON from YAML File, process and apply the rules.
* @author Armando Dias [zdiaarm]
*/


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Private Method: addOnErrorList ( Exported only for Unit Test use )
* Just add an Error or Warning on errorList object.
* This functions is to be used only by addError and addWarning methods.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @param {String} DESC The description of the error/warning.
* @param {String} MODE "auto" or "manual".
* @param {String} LEVEL "errors" or "warnings".
* @param {String} TYPE "development" or "release".
* @author Armando Dias [zdiaarm]
*/
const addOnErrorList = (ERRORLIST, DESC, MODE, LEVEL, TYPE) => {
  let mode = 'auto';
  if (typeof MODE === 'string') {
    const myMode = MODE.trim().toLowerCase();
    if (myMode === 'auto' || myMode === 'manual') {
      mode = myMode;
    }
  }
  let type = 'development';
  if (typeof TYPE === 'string') {
    const myType = TYPE.trim().toLowerCase();
    if (myType === 'development' || myType === 'release') {
      type = myType;
    }
  }
  ERRORLIST[mode][LEVEL][type].push(DESC);
};


/**
* Private Method: addError ( Exported only for Unit Test use )
* Prepare an error to be added on errorList object.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @param {String} DESC The description of the error.
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {String} TYPE Could be 'development', 'release' or 'null/undefined'.
* @param {String} VERSION The version name but could be 'null/undefined'.
* @param {String} FILE The name of the file but could be 'null/undefined'.
* @author Armando Dias [zdiaarm]
*/
const addError = (ERRORLIST, DESC, MODE, TYPE, VERSION, FILE) => {
  let desc = DESC;
  if (FILE !== undefined && FILE !== null) {
    desc = `[ ${FILE} ] ${desc}`;
  }
  if (VERSION !== undefined && VERSION !== null) {
    desc = `[ ${VERSION} ] ${desc}`;
  }
  addOnErrorList(ERRORLIST, desc, MODE, 'errors', TYPE);
};


/**
* Private Method: addWarning ( Exported only for Unit Test use )
* Just add an warning on errorList object.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @param {String} DESC The description of the error.
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {String} TYPE Could be 'development', 'release' or 'null/undefined'.
* @param {String} VERSION The version name but could be 'null/undefined'.
* @param {String} FILE The name of the file but could be 'null/undefined'.
* @author Armando Dias [zdiaarm]
*/
const addWarning = (ERRORLIST, DESC, MODE, TYPE, VERSION, FILE) => {
  let desc = DESC;
  if (FILE !== undefined && FILE !== null) {
    desc = `[ ${FILE} ] ${desc}`;
  }
  if (VERSION !== undefined && VERSION !== null) {
    desc = `[ ${VERSION} ] ${desc}`;
  }
  addOnErrorList(ERRORLIST, desc, MODE, 'warnings', TYPE);
};


/**
* Private Method: checkForPreviousErrors ( and Warnings ) ( Exported only for Unit Test use )
* Add previous errors (and/or warnings) on errorList array.
* @param {Object} TARGETMENU One menu object ( auto or release ).
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @author Armando Dias [zdiaarm]
*/
const checkForPreviousErrors = (TARGETMENU, MODE, ERRORLIST) => {
  if (TARGETMENU === undefined || TARGETMENU === null) {
    return;
  }
  if (TARGETMENU.errors !== undefined && TARGETMENU.errors !== null) {
    if (Array.isArray(TARGETMENU.errors.development)) {
      TARGETMENU.errors.development.forEach((ITEM) => {
        addError(ERRORLIST, ITEM, MODE, 'development');
      });
    }
    if (Array.isArray(TARGETMENU.errors.release)) {
      TARGETMENU.errors.release.forEach((ITEM) => {
        addError(ERRORLIST, ITEM, MODE, 'release');
      });
    }
  }
  if (TARGETMENU.warnings !== undefined && TARGETMENU.warnings !== null) {
    if (Array.isArray(TARGETMENU.warnings.development)) {
      TARGETMENU.warnings.development.forEach((ITEM) => {
        addWarning(ERRORLIST, ITEM, MODE, 'development');
      });
    }
    if (Array.isArray(TARGETMENU.warnings.release)) {
      TARGETMENU.warnings.release.forEach((ITEM) => {
        addWarning(ERRORLIST, ITEM, MODE, 'release');
      });
    }
  }
};


/**
* Private Method: applyRulesByItem ( Exported only for Unit Test use )
* Apply the Rules in one document per execution.
* @param {Object} DOC Document to be analysed.
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {String} TYPE Could be 'development' or 'release/anything'.
* @param {String} VERSION String with the Version Name. Could be null/undefined.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @return {Object} Return an object, with the document.
* @author Armando Dias [zdiaarm]
*/
const applyRulesByItem = (DOC, MODE, TYPE, VERSION, ERRORLIST) => {
  const theRulebook = global.adp.documentMenu.rulebook;
  const quickError = (MSG, FILE) => {
    addError(ERRORLIST, MSG, MODE, TYPE, VERSION, FILE);
  };
  const quickWarning = (MSG, FILE) => {
    addWarning(ERRORLIST, MSG, MODE, TYPE, VERSION, FILE);
  };
  theRulebook.schemaValidation(DOC, quickError);
  theRulebook.name(DOC, quickError);
  theRulebook.link(DOC, quickError);
  theRulebook.restricted(DOC, quickError, quickWarning);
  theRulebook.slug(DOC, quickWarning);
  theRulebook.notAllowedField(DOC, quickWarning);
  return DOC;
};


/**
* Private Method: applyRulesByGroup ( Exported only for Unit Test use )
* Apply the Rules in one group of documents per execution.
* @param {Object} PREGROUP The object before the GROUP of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {String} TYPE Could be 'development' or 'release/anything'.
* @param {String} VERSION String with the Version Name. Could be null/undefined.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @return {Object} Return an object, with the group of documents.
* @author Armando Dias [zdiaarm]
*/
const applyRulesByGroup = (PREGROUP, GROUPID, MODE, TYPE, VERSION, ERRORLIST) => {
  const theRulebook = global.adp.documentMenu.rulebook;
  const quickError = (MSG, FILE) => {
    addError(ERRORLIST, MSG, MODE, TYPE, VERSION, FILE);
  };
  const quickWarning = (MSG, FILE) => {
    addWarning(ERRORLIST, MSG, MODE, TYPE, VERSION, FILE);
  };
  theRulebook.uniqueDocName(PREGROUP, GROUPID, quickError);
  theRulebook.onlyOneDefaultAtMaximum(PREGROUP, GROUPID, quickError, quickWarning);

  return PREGROUP;
};


/**
* Private Method: applyRulesOn ( Exported only for Unit Test use )
* Prepare the objects to apply rules for each document...
* @param {Object} TARGETMENU One menu object ( auto or manual ).
* @param {String} MODE Could be 'auto' or 'manual/anything'.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @return {Object} Return an object, with the menu ( auto or release ).
* @author Armando Dias [zdiaarm]
*/
const applyRulesOn = (
  TARGETMENU,
  MODE,
  ERRORLIST,
  PREVIOUSMENU = null,
  CPI = false,
  allDocsMode = false,
) => {
  const theRulebook = global.adp.documentMenu.rulebook;
  const quickWarningDevelopment = (MSG) => {
    addWarning(ERRORLIST, MSG, MODE, 'development');
  };
  const quickWarningRelease = (MSG) => {
    addWarning(ERRORLIST, MSG, MODE, 'release');
  };
  const quickErrorRelease = (MSG) => {
    addError(ERRORLIST, MSG, MODE, 'release');
  };
  if (TARGETMENU.development !== undefined) {
    if (Array.isArray(TARGETMENU.development)) {
      theRulebook.checkBasicIntegrity(TARGETMENU, 'development', quickWarningDevelopment);
      const originalQuant = TARGETMENU.development.length;
      TARGETMENU.development.forEach((ITEM) => {
        applyRulesByItem(ITEM, MODE, 'development', undefined, ERRORLIST);
      });
      applyRulesByGroup(TARGETMENU, 'development', MODE, 'development', undefined, ERRORLIST);
      const endQuant = TARGETMENU.development.length;
      if (originalQuant !== endQuant) {
        const message = `Only ${endQuant} of ${originalQuant} development documents will be used.`;
        addWarning(ERRORLIST, message, MODE, 'development');
      }
    }
  }
  if (TARGETMENU.release !== undefined) {
    if (Array.isArray(TARGETMENU.release)) {
      theRulebook.checkBasicIntegrity(TARGETMENU, 'release', quickErrorRelease);
      theRulebook.uniqueVersionName(TARGETMENU, 'release', quickErrorRelease);
      TARGETMENU.release.forEach((VERSION) => {
        const versionName = VERSION.version;
        if (!allDocsMode
          && PREVIOUSMENU
          && PREVIOUSMENU.auto
          && Array.isArray(PREVIOUSMENU.auto.release)
          && PREVIOUSMENU.auto.release.find(ITEM => ITEM.version === versionName)
        ) {
          return;
        }
        if (VERSION.documents !== undefined) {
          if (Array.isArray(VERSION.documents)) {
            const originalQuant = VERSION.documents.length;
            theRulebook.checkCPI(VERSION, CPI, versionName, quickWarningRelease, quickErrorRelease);
            VERSION.documents.forEach((ITEM) => {
              applyRulesByItem(ITEM, MODE, 'release', versionName, ERRORLIST);
            });
            applyRulesByGroup(TARGETMENU.release, versionName, MODE, 'release', versionName, ERRORLIST);
            const endQuant = VERSION.documents.length;
            if (originalQuant !== endQuant) {
              const message = `Only ${endQuant} of ${originalQuant} release documents ( Version ${versionName} ) will be used.`;
              addWarning(ERRORLIST, message, MODE, 'release', versionName);
            }
          }
        }
      });
    }
    theRulebook.removeEmptyVersions(TARGETMENU, 'release', quickWarningRelease);
    theRulebook.versionOrderDesc(TARGETMENU.release);
  }
  return TARGETMENU;
};


/**
* Private Method: howManyDocuments ( Exported only for Unit Test use )
* Just count how many documents there are in the menu object.
* @param {Object} MENU the menu object.
* @param {String} THISMODE String with 'auto' or 'manual'.
* @returns {Object} Object with the results.
* @author Armando Dias [zdiaarm]
*/
const howManyDocuments = (MENU, THISMODE) => {
  if (MENU === undefined || MENU === null) {
    return 0;
  }
  const readByMode = (MODE) => {
    let value = 0;
    if (MENU[MODE] !== undefined && MENU[MODE] !== null) {
      if (MENU[MODE].development !== undefined && MENU[MODE].development !== null) {
        if (Array.isArray(MENU[MODE].development)) {
          value += MENU[MODE].development.length;
        }
      }
      if (MENU[MODE].release !== undefined && MENU[MODE].release !== null) {
        if (Array.isArray(MENU[MODE].release)) {
          MENU[MODE].release.forEach((VERSION) => {
            if (Array.isArray(VERSION.documents)) {
              value += VERSION.documents.length;
            }
          });
        }
      }
    }
    return value;
  };
  return readByMode(THISMODE);
};


/**
* Private Method: transferErrorList ( Exported only for Unit Test use )
* Just copy the Error List to output menu object.
* @param {Object} MENU The full menu object.
* @param {Object} ERRORLIST The object who holds errors and warnings.
* @author Armando Dias [zdiaarm]
*/
const transferErrorList = (MENU, ERRORLIST) => {
  const menu = MENU;
  if (menu && !menu.auto) menu.auto = {};
  if (menu && !menu.manual) menu.manual = {};

  if (menu && menu.auto && menu.auto.errors) delete menu.auto.errors;
  if (ERRORLIST && ERRORLIST.auto && ERRORLIST.auto.errors) {
    menu.auto.errors = ERRORLIST.auto.errors;
  }

  if (menu && menu.auto && menu.auto.warnings) delete menu.auto.warnings;
  if (ERRORLIST && ERRORLIST.auto && ERRORLIST.auto.warnings) {
    menu.auto.warnings = ERRORLIST.auto.warnings;
  }

  if (menu && menu.manual && menu.manual.errors) delete menu.manual.errors;
  if (ERRORLIST && ERRORLIST.manual && ERRORLIST.manual.errors) {
    menu.manual.errors = ERRORLIST.manual.errors;
  }

  if (menu && menu.manual && menu.manual.warnings) delete menu.manual.warnings;
  if (ERRORLIST && ERRORLIST.manual && ERRORLIST.manual.warnings) {
    menu.manual.warnings = ERRORLIST.manual.warnings;
  }
};


/**
* Exported Method: [ global.adp.documentMenu.process.action ]
* Prepare the Menu for Frontend
* @param {Object} MENUOBJ The raw menu object.
* @param {Object} PREVIOUSMENU The previous menu from database.
* @return {Object} Return an object, with the menu and possible errors.
* @author Armando Dias [zdiaarm]
*/
const action = (
  MENUOBJ,
  PREVIOUSMENU,
  CPI = false,
  allDocsMode = false,
) => new Promise((RESOLVE, REJECT) => {
  const errorList = {
    auto: {
      errors: { development: [], release: [] },
      warnings: { development: [], release: [] },
    },
    manual: {
      errors: { development: [], release: [] },
      warnings: { development: [], release: [] },
    },
  };
  const menu = MENUOBJ;
  if (menu === undefined || menu === null) {
    const error = 'MENUOBJ cannot be undefined or null.';
    REJECT(error);
    return;
  }
  if (menu.auto !== undefined) {
    checkForPreviousErrors(menu.auto, 'auto', errorList);
    menu.auto = applyRulesOn(menu.auto, 'auto', errorList, PREVIOUSMENU, CPI, allDocsMode);
  }
  if (menu.manual !== undefined) {
    checkForPreviousErrors(menu.manual, 'manual', errorList);
    menu.manual = applyRulesOn(menu.manual, 'manual', errorList);
  }
  const previousDocQuant = howManyDocuments(PREVIOUSMENU, 'auto');
  const currentDocQuant = howManyDocuments(menu, 'auto');
  if (currentDocQuant === 0 && previousDocQuant !== 0) {
    let msg = `( ${previousDocQuant} documents deleted ).`;
    if (previousDocQuant === 1) {
      msg = '( one document deleted ).';
    }
    addWarning(errorList, `Saving an EMPTY MENU over a previous one ${msg}.`, 'auto', 'development');
    addWarning(errorList, `Saving an EMPTY MENU over a previous one ${msg}.`, 'auto', 'release');
  }
  transferErrorList(menu, errorList);
  RESOLVE(menu);
});

module.exports = {
  action,
  transferErrorList,
  applyRulesOn,
  applyRulesByGroup,
  applyRulesByItem,
  checkForPreviousErrors,
  addWarning,
  addError,
  addOnErrorList,
  howManyDocuments,
};
