/**
* Exported Method: [ global.adp.documentMenu.rulebook ]
* @author Armando Dias [zdiaarm]
*/

// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Exported Method: [ global.adp.documentMenu.rulebook.name ]
* Check if the name of document follow the rules...
* @param {Object} DOC The document object.
* @param {Function} ADDERROR Function to notify the error.
* @return {Boolean} If true, the field is following all the rules.
* @author Armando Dias [zdiaarm]
*/
const name = (DOC, ADDERROR) => {
  let foundError = false;
  // eslint-disable-next-line no-param-reassign
  delete DOC.error;
  const docString = JSON.stringify(DOC).replace(/"/gim, '\'');
  if (DOC.name === undefined) {
    ADDERROR(`'Name' cannot be undefined in '${docString}'.`);
    foundError = true;
  }
  if (DOC.name === null) {
    ADDERROR(`'Name' cannot be null in '${docString}'.`);
    foundError = true;
  }
  if (foundError) {
    return false;
  }
  if (typeof DOC.name !== 'string') {
    ADDERROR(`'Name' should be a string in '${docString}'.`);
    foundError = true;
  }
  if (foundError) {
    return false;
  }
  if (DOC.name.trim().length === 0) {
    ADDERROR(`'Name' cannot be an empty string in '${docString}'.`);
    foundError = true;
  }
  return !foundError;
};


/**
* Exported Method: [ global.adp.documentMenu.rulebook.link ]
* Check if the link parameter is "filepath" or "external-link"...
* @param {Object} DOC The document object.
* @param {Function} ADDERROR Function to notify the error.
* @return {Boolean} If true, the field is following all the rules.
* @author Armando Dias [zdiaarm]
*/
const link = (DOC, ADDERROR) => {
  let foundError = false;
  const filePath = DOC.filepath;
  const externalLink = DOC.external_link;
  if ((filePath === undefined || filePath === null)
  && (externalLink === undefined || externalLink === null)) {
    ADDERROR('The document should contain \'filepath\' or \'external_link\'.', DOC.name);
    foundError = true;
  } else if ((filePath !== undefined && filePath !== null)
  && (externalLink !== undefined && externalLink !== null)) {
    ADDERROR('The document should contain only one: \'filepath\' or \'external_link\'.', DOC.name);
    foundError = true;
  }
  if (foundError) {
    return false;
  }
  // filePath
  if ((filePath !== undefined && filePath !== null)) {
    if (typeof filePath !== 'string') {
      ADDERROR('\'filepath\' should be a string.', DOC.name);
      foundError = true;
    }
    if (foundError) {
      return false;
    }
    if (filePath.trim().length === 0) {
      ADDERROR('\'filepath\' cannot be an empty string.', DOC.name);
      foundError = true;
    }
  }
  if (foundError) {
    return false;
  }
  // externalLink
  if ((externalLink !== undefined && externalLink !== null)) {
    if (typeof externalLink !== 'string') {
      ADDERROR('\'external_link\' should be a string.', DOC.name);
      foundError = true;
    }
    if (foundError) {
      return false;
    }
    if (externalLink.trim().length === 0) {
      ADDERROR('\'external_link\' cannot be an empty string.', DOC.name);
      foundError = true;
    }
  }
  return !foundError;
};


/**
* Exported Method: [ global.adp.documentMenu.rulebook.restricted ]
* Check if the restricted parameter is true only if "external-link" is present
* @param {Object} DOC The document object.
* @param {Function} ADDERROR Function to notify the error.
* @param {Function} ADDWARNING Function to notify the warning.
* @return {Boolean} If true, the field is following all the rules.
* @author Armando Dias [zdiaarm]
*/
const restricted = (DOC, ADDERROR, ADDWARNING) => {
  let foundError = false;
  if (DOC.restricted === true) {
    if (DOC.external_link === undefined
      || DOC.external_link === null) {
      ADDERROR('\'restricted\' cannot be true if there is no \'external_link\'.', DOC.name);
      foundError = true;
    }
  } else if (DOC.restricted !== undefined) {
    if (typeof DOC.restricted !== 'boolean') {
      let warningMessage = 'The \'restricted\' property should be a boolean.';
      warningMessage = `${warningMessage} The ${typeof DOC.restricted} value '${DOC.restricted}' will be ignored.`;
      ADDWARNING(warningMessage, DOC.name);
    }
    // eslint-disable-next-line no-param-reassign
    delete DOC.restricted;
  }
  return !foundError;
};

/**
* Exported Method: [ global.adp.documentMenu.rulebook.charLimit ]
* Check if the document title has appropriate character limit
* @param {Object} DOC The document object.
* @param {Function} ADDERROR Function to notify the error.#
* @return {Boolean} If true, the field is following all the rules.
* @author Omkar [zsdgmkr]
*/
const schemaValidation = (DOC, ADDERROR) => {
  let foundError = false;
  const regExpRemoveInstanceFromName = new RegExp(/(instance\.)/gim);
  const errorList = [];
  const schemaDocument = global.adp.clone(global.adp.config.schema.document);
  const validateAgainstSchema = async () => {
    const validatorAction = new global.Jsonschema();
    const validationResult = await validatorAction.validate(DOC, schemaDocument);
    if (validationResult.errors.length > 0) {
      validationResult.errors.forEach((error) => {
        if ((error.stack !== null) && (error.stack !== undefined)) {
          const message = error.stack.replace(regExpRemoveInstanceFromName, '');
          errorList.push(message);
        }
      });
    }
    if (errorList.length > 0) {
      foundError = true;
      errorList.forEach((error) => {
        ADDERROR(error, DOC.name);
      });
    }
    return !foundError;
  };
  return validateAgainstSchema();
};

/**
* Exported Method: [ global.adp.documentMenu.rulebook.slug ]
* If slug is not there, slug will be created
* @param {Object} DOC The document object.
* @param {Function} ADDWARNING Function to notify the warning.
* @return {Boolean} If true, the field is following all the rules.
* @author Armando Dias [zdiaarm]
*/
const slug = (DOC, ADDWARNING) => {
  let showWarning = false;
  let newSlug = null;
  const previousSlug = DOC.slug;
  if (previousSlug !== undefined) {
    showWarning = true;
  }
  // eslint-disable-next-line no-param-reassign
  delete DOC.slug;
  if (DOC.name !== undefined && DOC.name !== null) {
    newSlug = global.adp.slugIt(DOC.name);
    // eslint-disable-next-line no-param-reassign
    DOC.slug = newSlug;
  }
  if (showWarning) {
    if (previousSlug !== newSlug) {
      ADDWARNING(`'${DOC.name}' cannot have '${previousSlug}' as slug. The slug of this document is '${newSlug}'.`);
    } else {
      ADDWARNING('The \'slug\' field is not part of the YAML file structure.');
    }
  }
  return true;
};


/**
* Exported Method: [ global.adp.documentMenu.rulebook.notAllowedField ]
* Check if there is a not allowed field.
* @param {Object} DOC The document object.
* @param {Function} ADDWARNING Function to notify the warning.
* @return {Boolean} Always returns true, because is a Warning.
* @author Armando Dias [zdiaarm]
*/
const notAllowedField = (DOC, ADDWARNING) => {
  const allowedFields = ['name', 'default', 'slug', 'filepath', 'external_link', 'restricted'];
  Object.keys(DOC).forEach((FIELD) => {
    if (!(allowedFields.includes(FIELD))) {
      ADDWARNING(`The field '${FIELD}' is not allowed and it will be ignored.`, DOC.name);
      // eslint-disable-next-line no-param-reassign
      delete DOC[FIELD];
    }
  });
  return true;
};


/**
* Private Method: onlyOneDefaultAtMaximum
* Check if there is more than one Default document in same level.
* If yes, keep the first "default:true" attribute and delete the rest.
* @param {Object} PREGROUP The object before the GROUP of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {Function} ADDERROR Function to notify the error.
* @param {Function} ADDWARNING Function to notify the warning.
* @return {Boolean} Always returns true, because is a warning, not an error.
* @author Armando Dias [zdiaarm]
*/
const onlyOneDefaultAtMaximum = (PREGROUP, GROUPID, ADDERROR, ADDWARNING) => {
  let hasVersionStructure = false;
  if (PREGROUP[GROUPID] === undefined || PREGROUP[GROUPID] === null) {
    hasVersionStructure = true;
  }
  let alreadyFoundOneDefault = false;
  let nameOfDefaultDocument = '';

  const analyseDefaultDocument = (THEGROUP) => {
    THEGROUP.forEach((DOCUMENT) => {
      if (DOCUMENT.default === true) {
        if (!alreadyFoundOneDefault) {
          alreadyFoundOneDefault = true;
          nameOfDefaultDocument = DOCUMENT.name;
        } else {
          // eslint-disable-next-line no-param-reassign
          delete DOCUMENT.default;
          let errorMessage = `The '${DOCUMENT.name}' cannot be default document`;
          errorMessage = `${errorMessage} because '${nameOfDefaultDocument}' already is.`;
          ADDERROR(errorMessage, DOCUMENT.name);
        }
      } else {
        if (typeof DOCUMENT.default !== 'boolean' && typeof DOCUMENT.default !== 'undefined') {
          let errorMessage = 'The \'default\' property should be a boolean.';
          errorMessage = `${errorMessage} The ${typeof DOCUMENT.default} value '${DOCUMENT.default}' will be ignored.`;
          ADDWARNING(errorMessage, DOCUMENT.name);
        }
        // eslint-disable-next-line no-param-reassign
        delete DOCUMENT.default;
      }
    });
    if (!alreadyFoundOneDefault) {
      if (THEGROUP[0] !== undefined) {
        // eslint-disable-next-line no-param-reassign
        THEGROUP[0].default = true;
      }
    }
  };

  if (!hasVersionStructure) {
    const group = PREGROUP[GROUPID];
    analyseDefaultDocument(group);
  } else {
    const groupPrepare = PREGROUP;
    groupPrepare.forEach((DOCUMENTGROUP) => {
      if (DOCUMENTGROUP.version === GROUPID) {
        const group = DOCUMENTGROUP.documents;
        analyseDefaultDocument(group);
      }
    });
  }

  return true;
};


/**
* Private Method: removeEmptyVersions
* Remove empty versions.
* @param {Object} PREGROUPS The object before the GROUPS of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {Function} ADDWARNING Function to notify the warning.
* @return {Boolean} Always returns true, because is a warning, not an error.
* @author Armando Dias [zdiaarm]
*/
const removeEmptyVersions = (PREGROUPS, GROUPID, ADDWARNING) => {
  if (PREGROUPS === undefined) {
    return true;
  }
  if (PREGROUPS[GROUPID] === undefined) {
    return true;
  }
  if (!Array.isArray(PREGROUPS[GROUPID])) {
    return true;
  }
  const groupsQuantInitial = PREGROUPS[GROUPID].length;
  const notEmptyVersion = [];
  PREGROUPS[GROUPID].forEach((VERSION) => {
    if (VERSION.documents.length > 0) {
      notEmptyVersion.push(VERSION);
    } else {
      ADDWARNING(`There is no documents in '${VERSION.version}' version.`);
    }
  });
  // eslint-disable-next-line no-param-reassign
  PREGROUPS[GROUPID] = notEmptyVersion;
  const groupsQuantFinal = PREGROUPS[GROUPID].length;
  if (groupsQuantInitial !== groupsQuantFinal) {
    ADDWARNING(`Only ${groupsQuantFinal} of ${groupsQuantInitial} versions are valid, after 'Non-empty Versions Validation'.`);
  }
  return true;
};


/**
* Private Method: uniqueVersionName
* Check if there is more than one version with the same name.
* @param {Object} PREGROUPS The object before the GROUPS of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {Function} ADDERROR Function to notify the error.
* @return {Boolean} Always returns true, because is a warning, not an error.
* @author Armando Dias [zdiaarm]
*/
const uniqueVersionName = (PREGROUPS, GROUPID, ADDERROR) => {
  if (PREGROUPS === undefined) {
    return true;
  }
  if (PREGROUPS[GROUPID] === undefined) {
    return true;
  }
  if (!Array.isArray(PREGROUPS[GROUPID])) {
    return true;
  }
  const cleanNames = [];
  const cleanVersions = [];
  const alertNames = [];
  const groupsQuantInitial = PREGROUPS[GROUPID].length;
  PREGROUPS[GROUPID].forEach((VERSION) => {
    if (VERSION.version !== undefined) {
      if (!cleanNames.includes(VERSION.version)) {
        cleanNames.push(VERSION.version);
        cleanVersions.push(VERSION);
      } else {
        if (!alertNames.includes(VERSION.version)) {
          ADDERROR(`There are more than one version with the same name '${VERSION.version}'.`);
        }
        alertNames.push(VERSION.version);
      }
    }
  });
  // eslint-disable-next-line no-param-reassign
  PREGROUPS[GROUPID] = cleanVersions;
  const groupsQuantFinal = PREGROUPS[GROUPID].length;
  if (groupsQuantInitial !== groupsQuantFinal) {
    ADDERROR(`Only ${groupsQuantFinal} of ${groupsQuantInitial} versions are valid, after 'Unique Version Name Validation'.`);
  }
  return true;
};


/**
* Private Method: uniqueDocName
* Check if there is documents with the same name inside of a group.
* @param {Object} PREGROUP The object before the GROUP of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {Function} ADDERROR Function to notify the error.
* @author Armando Dias [zdiaarm]
*/
const uniqueDocName = (PREGROUP, GROUPID, ADDERROR) => {
  let hasVersionStructure = false;
  if (PREGROUP[GROUPID] === undefined || PREGROUP[GROUPID] === null) {
    hasVersionStructure = true;
  }
  const uniqueNames = [];
  const cleanGroup = [];
  const alertNames = [];
  if (!hasVersionStructure) {
    const group = PREGROUP[GROUPID];
    group.forEach((DOCUMENT) => {
      if (!uniqueNames.includes(DOCUMENT.name)) {
        uniqueNames.push(DOCUMENT.name);
        cleanGroup.push(DOCUMENT);
      } else {
        if (!alertNames.includes(DOCUMENT.name)) {
          let errorMessage = `The name '${DOCUMENT.name}' is not unique`;
          errorMessage = `${errorMessage} in development documents.`;
          ADDERROR(errorMessage, DOCUMENT.name);
        }
        alertNames.push(DOCUMENT.name);
      }
    });
    // eslint-disable-next-line no-param-reassign
    PREGROUP[GROUPID] = cleanGroup;
  } else {
    const groupPrepare = PREGROUP;
    groupPrepare.forEach((DOCUMENTGROUP) => {
      if (DOCUMENTGROUP.version === GROUPID) {
        const group = DOCUMENTGROUP.documents;
        group.forEach((DOCUMENT) => {
          if (!uniqueNames.includes(DOCUMENT.name)) {
            uniqueNames.push(DOCUMENT.name);
            cleanGroup.push(DOCUMENT);
          } else {
            if (!alertNames.includes(DOCUMENT.name)) {
              let errorMessage = `The name '${DOCUMENT.name}' is not unique`;
              errorMessage = `${errorMessage} inside of the version ${GROUPID} of release documents.`;
              ADDERROR(errorMessage, DOCUMENT.name);
            }
            alertNames.push(DOCUMENT.name);
          }
        });
        // eslint-disable-next-line no-param-reassign
        DOCUMENTGROUP.documents = cleanGroup;
      }
    });
  }
  return true;
};


/**
* Private Method: checkBasicIntegrity
* Check the basic integrity of items.
* @param {Object} PREGROUP The object before the GROUP of Documents to be analysed.
* @param {String} GROUPID The ID of the GROUP of Documents to be analysed.
* @param {Function} ADDWARNING Function to notify the warning.
* @author Armando Dias [zdiaarm]
*/
const checkBasicIntegrity = (PREGROUP, GROUPID, ADDWARNING) => {
  if (PREGROUP[GROUPID] === undefined || PREGROUP[GROUPID] === null) {
    return true;
  }
  if (GROUPID !== 'release') {
    return true;
  }
  const clearnArray = [];
  let somethingChanged = false;
  PREGROUP[GROUPID].forEach((ITEM) => {
    if (GROUPID === 'release') {
      const versionCheck = (ITEM.version !== undefined && ITEM.version !== null && ITEM.version !== '');
      const documentsCheck = (ITEM.documents !== undefined && ITEM.documents !== null);
      if (versionCheck && documentsCheck) {
        clearnArray.push(ITEM);
      } else {
        somethingChanged = true;
        let warningMessage = '';
        if (versionCheck && !documentsCheck) {
          warningMessage = `There is no documents in version ${ITEM.version}.`;
        } else {
          warningMessage = 'There is an item without version or documents.';
        }
        ADDWARNING(warningMessage);
      }
    }
  });
  if (somethingChanged) {
    // eslint-disable-next-line no-param-reassign
    PREGROUP[GROUPID] = clearnArray;
  }
  return true;
};


/**
* Exported Method: [ global.adp.documentMenu.rulebook.checkCPI ]
* Check the CPI status on the version object.
* @param {Object} VERSIONOBJ The version object.
* @param {Boolean} MODE If the CPI of Microservice is on (true) or off (false)
* @param {string} VERSIONNAME The name of the version.
* @param {Function} ADDWARNING Function to notify the warning.
* @param {Function} ADDERROR Function to notify the error.
* @return {Boolean} If true, the field is following all the rules.
* @author Armando Dias [zdiaarm]
*/
const checkCPI = (VERSIONOBJ, MODE, VERSIONNAME, ADDWARNING, ADDERROR) => {
  if (!VERSIONOBJ) {
    return true;
  }
  if (MODE && !VERSIONOBJ.is_cpi_updated) {
    const warningMessage = `The 'is_cpi_updated' attribute is missing on '${VERSIONNAME}'. Please provide a boolean to indicate if CPI documentation is updated`;
    ADDWARNING(warningMessage, VERSIONOBJ.name);
    return true;
  }
  if (MODE && typeof VERSIONOBJ.is_cpi_updated !== 'boolean') {
    const errorMessage = `The 'is_cpi_updated' attribute should be a boolean on '${VERSIONNAME}'`;
    ADDERROR(errorMessage, VERSIONOBJ.name);
    return true;
  }
  if (!MODE && VERSIONOBJ.is_cpi_updated) {
    const warningMessage = `Your microservice has CPI disabled but you are trying to update it on '${VERSIONNAME}'`;
    ADDWARNING(warningMessage, VERSIONOBJ.name);
    return true;
  }
  return false;
};


/**
* Private Method: versionOrderDesc
* Sort by version (Desc), if there is versions.
* @param {Object} MENU Menu Object (probably release) to be sorted.
* @author Armando Dias [zdiaarm]
*/
const versionOrderDesc = MENU => MENU.sort(global.adp.versionSort('-version'));

module.exports = {
  name,
  link,
  restricted,
  slug,
  checkCPI,
  notAllowedField,
  onlyOneDefaultAtMaximum,
  uniqueDocName,
  uniqueVersionName,
  removeEmptyVersions,
  versionOrderDesc,
  checkBasicIntegrity,
  schemaValidation,
};
