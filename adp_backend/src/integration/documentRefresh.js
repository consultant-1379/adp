// ============================================================================================= //
/**
* [ global.adp.integration.documentRefresh ]
* @author John Dolan [xjohdol]
*/
// ============================================================================================= //
const packName = 'adp.integration.documentRefresh';
const errorLog = require('./../library/errorLog');

/**
* Convenience function to deep copy an object
* @param {Object} fromObject A simple String, with the ID of the Microservice.
* @returns {Object} A copy of the fromObject
* @author John Dolan [xjohdol]
*/
function clone(fromObject) {
  return JSON.parse(JSON.stringify(fromObject));
}

/**
* Call the clear cache function for a specified id
* @param {String} ID A simple String, with the ID of the Microservice.
* @author John Dolan [xjohdol], Armando Dias [zdiaarm]
*/
function clearCache(msId, msSlug) {
  try {
    adp.masterCache.clear('ALLASSETS', null, msId);
    adp.masterCache.clear('DOCUMENTS', msId);
    adp.echoLog(`Cache of [ ${msSlug} ] asset and documents cleared!`, null, 200, packName);
    return new Promise(RES => RES(`Cache of [ ${msId} / ${msSlug} ] asset and documents cleared!`));
  } catch (ERROR) {
    return new Promise(REJ => REJ(ERROR));
  }
}


/**
* Record an error about microservice by id.
* @param {String} errorMessage The error to record
* @param {String} id The ID of the Microservice.
* @author John Dolan [xjohdol]
*/
function recordError(errorMessage, id, slug) {
  const { echoLog } = global.adp;
  const dbModelLog = new adp.models.AdpLog();
  const logObject = {
    type: 'yamlretrieveerror',
    datetime: new Date(),
    microservice_id: id,
    microservice_slug: slug,
    log: errorMessage,
  };
  dbModelLog.createOne(logObject)
    .catch((ERROR) => {
      const errorText = 'Data not saved in database log due to error';
      const errorOBJ = {
        database: 'dataBaseLog',
        logObject,
        error: ERROR,
      };
      echoLog(errorText, errorOBJ, 500, packName, true);
    });
}

/**
* Analyse the quantity of errors and warnings
* @param {Object} MENU The menu object to analyse
* @param {Boolean} MENUAUTO the documentation retrieval mode, true being auto
* @param {Object} RAWMENU The raw YAML menu object for log
* @param {String} MSID The ID of the Microservice
* @param {String} MSSLUG The Slug of the Microservice
* @author Armando Dias [zdiaarm]
*/
const analyseErrorsAndWarnings = (MENU, MENUAUTO, RAWMENU, MSID, MSSLUG) => {
  const autoMode = (MENUAUTO ? 'auto' : 'manual');
  const setQuants = (MODE) => {
    let errors = 0;
    let warnings = 0;
    if (MENU !== undefined) {
      if (MENU[MODE] !== undefined) {
        if (MENU[MODE].errors !== undefined) {
          if (MENU[MODE].errors.development !== undefined) {
            errors += MENU[MODE].errors.development.length;
          }
          if (MENU[MODE].errors.release !== undefined) {
            errors += MENU[MODE].errors.release.length;
          }
        }
        if (MENU[MODE].warnings !== undefined) {
          if (MENU[MODE].warnings.development !== undefined) {
            warnings += MENU[MODE].warnings.development.length;
          }
          if (MENU[MODE].warnings.release !== undefined) {
            warnings += MENU[MODE].warnings.release.length;
          }
        }
      }
    }
    return {
      errorsQuant: errors,
      warningsQuant: warnings,
    };
  };

  const { errorsQuant, warningsQuant } = setQuants(autoMode);
  if (errorsQuant > 0 || warningsQuant > 0) {
    const logObject = {
      rawContent: RAWMENU,
      processedContent: MENU,
    };
    recordError(logObject, MSID, MSSLUG);
  }
  const result = {
    errors: errorsQuant,
    warnings: warningsQuant,
  };
  return result;
};


/**
* Prepare the menu update operation for the specified
* microservice by the specified user.
* @param {Object} MS A simple Microservice Object, containing:
* {
*   _id: 'Microservice Unique Database ID',
*   name: 'Microservice Name',
*   slug: 'microservice-slug',
*   menu_auto: boolean true indicating this is using auto menu,
*   repo_urls: {
*     development: 'Development Artifactory Menu Root',
*     release: 'Release Artifactory Menu Root'
*   }
* }
* @param {String} OBJECTIVE Unique String to identify the Group Queue.
* @returns {Object} An object containing dbResponse and errors keys.
* @author John Dolan [xjohdol], Omkar [zsdgmkr], Armando Dias [zdiaarm]
*/
async function update(MS, OBJECTIVE = null, specificVersion = 'ALL') {
  let statusCode = 200;
  const updatedService = clone(MS);
  const { updateService } = global.adp.artifactoryRepo;
  const msId = MS._id;
  const msSlug = MS.slug;

  const dbResponse = {
    _id: MS._id,
    name: MS.name,
    slug: MS.slug,
  };

  try {
    await updateService(updatedService, OBJECTIVE, specificVersion);
  } catch (error) {
    statusCode = 500;
    let useThisStatusCode = 500;
    let useThisStatusMessage = 'Error on [ adp.artifactoryRepo.updateService ]';
    try {
      if (error && error.message && JSON.parse(error.message).code > 0) {
        const errorParsed = JSON.parse(error.message);
        useThisStatusCode = errorParsed.code;
        if (errorParsed.message) {
          useThisStatusMessage = errorParsed.message;
        }
      }
      statusCode = useThisStatusCode;
    } catch (tryCatchError) {
      statusCode = 500;
    }
    const errorMessage = useThisStatusMessage;
    const errorObject = {
      status: statusCode,
      error,
      ms: MS,
      objective: OBJECTIVE,
      statusCode,
      dbResponse,
      yamlErrors: ['Fatal Error'],
      yamlErrorsQuant: 1,
      yamlWarnings: [],
      yamlWarningsQuant: 0,
    };
    errorLog(statusCode, errorMessage, errorObject, 'update', packName);
    recordError(error.message, msId, msSlug);
    return errorObject;
  }

  return {
    statusCode,
    dbResponse,
    yamlErrors: [],
    yamlErrorsQuant: 0,
    yamlWarnings: [],
    yamlWarningsQuant: 0,
  };
}

module.exports = {
  update,
  clearCache,
  analyseErrorsAndWarnings,
};
// ============================================================================================= //
