// ============================================================================================= //
/**
* [ adp.integration.documentRefreshPerVersion ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
const packName = 'adp.integration.documentRefreshPerVersion';
// ============================================================================================= //
const errorLog = require('./../library/errorLog');
// ============================================================================================= //

adp.integration.debuggerMode = true;

const debuggerMessage = (MESSAGE) => {
  if (adp.integration.debuggerMode === true) {
    adp.echoLog(MESSAGE, null, 200, packName);
  }
};

/**
* Retrieve and parse YAML files from artifactory to build the document menu.
* One YAML file per request.
* @param {string} MSID The microservice ID to update.
* @param {string} MSSLUG The microservice Slug.
* @param {string} YAMLURL The absolute url of the YAML file.
* @param {string} VERSION The version of the YAML file.
* @param {string} OBJECTIVE Name of the queue group which this request belongs.
* @returns {Object} An object containing dbResponse and errors keys.
* @author Armando Dias [ zdiaarm ]
*/

module.exports = (
  MSID,
  MSSLUG,
  YAMLURL,
  VERSION,
  MODE,
  OBJECTIVE,
) => new Promise(async (RESOLVE) => {
  const fullTimer = (new Date()).getTime();
  const version = VERSION;
  let serverStatusCode = 200;
  let logVersion = version;
  if (MODE === 'development') {
    logVersion = 'DEV';
  }
  debuggerMessage(`[ ${logVersion} ] Starting process for [ ${MSSLUG} ]`);

  // Retrieving YAML file from Artifactory...
  let rawFile;
  let versionMenu;
  let docQuantity = 0;
  try {
    const timer = (new Date()).getTime();
    const artifactory = adp.artifactoryRepo;
    debuggerMessage(`[ ${logVersion} ] Retrieving YAML File [ ${YAMLURL} ]...`);
    rawFile = await artifactory.artifactoryFileRequest(MSID, MSSLUG, YAMLURL, OBJECTIVE);
    versionMenu = artifactory.parseYaml(rawFile);
    if ((MODE === 'development') && (VERSION === 'indevelopment') && versionMenu) {
      const mimerStartTimer = (new Date()).getTime();
      const mimerDevelopmentVersion = versionMenu
        && versionMenu.version
        ? `${versionMenu.version}`
        : null;
      const adpModel = new adp.models.Adp();
      await adpModel.setMimerDevelopmentVersionFromYAML(MSID, mimerDevelopmentVersion);
      const mimerEndTimer = (new Date()).getTime();
      debuggerMessage(`[ ${logVersion} ] [ Version: ${mimerDevelopmentVersion} ] was set as Mimer Development Version in ${mimerEndTimer - mimerStartTimer}ms.`);
    }
    docQuantity = versionMenu.documents.length;
    debuggerMessage(`[ ${logVersion} ] YAML File retrieved in ${(new Date()).getTime() - timer}ms.`);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Retrieving YAML file from Artifactory ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  // Reading Microservice from Database...
  let ms;
  let originalMs;
  try {
    const timer = (new Date()).getTime();
    debuggerMessage(`[ ${logVersion} ] Reading Microservice from Database [ ${MSID} ]...`);
    const adpModel = new adp.models.Adp();
    const msObject = await (adpModel.getById(MSID));
    ms = msObject.docs[0];
    originalMs = adp.clone(ms);
    debuggerMessage(`[ ${logVersion} ] Microservice from Database in ${(new Date()).getTime() - timer}ms.`);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Reading Microservice from Database ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  // Reading the Payload...
  let heritage;
  try {
    const timer = (new Date()).getTime();
    debuggerMessage(`[ ${logVersion} ] Preparing/Retrieving the payload...`);
    heritage = await adp.queue.getPayload(OBJECTIVE);
    if (!heritage) {
      heritage = {
        status: 1,
        serverStatusCode: 200,
        name: ms.name,
        slug: ms.slug,
        versions: 0,
        yamlErrors: { development: [], release: [] },
        yamlErrorsQuant: 0,
        yamlWarnings: { development: [], release: [] },
        yamlWarningsQuant: 0,
        theMenu: { auto: { development: [], release: [] } },
      };
    }
    debuggerMessage(`[ ${logVersion} ] Payload prepared/retrieved in ${(new Date()).getTime() - timer}ms.`);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Reading the Payload ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }

  if (!heritage) {
    heritage = {
      status: 1,
      serverStatusCode: 200,
      name: ms.name,
      slug: ms.slug,
      versions: 0,
      yamlErrors: { development: [], release: [] },
      yamlErrorsQuant: 0,
      yamlWarnings: { development: [], release: [] },
      yamlWarningsQuant: 0,
      theMenu: { auto: { development: [], release: [] } },
    };
  }
  const thePayload = heritage;

  // Parsing YAML File...
  let menuToBeAnalysed;
  let originalMenuToBeAnalysed;
  let menuAnalysed;
  let statusCode = 200;
  let errors;
  let warnings;
  try {
    const timer = (new Date()).getTime();
    debuggerMessage(`[ ${logVersion} ] Parsing the YAML file...`);
    if (MODE === 'development') {
      if (thePayload && !thePayload.theMenu) {
        thePayload.theMenu = {};
      }
      if (thePayload && thePayload.theMenu && !thePayload.theMenu.auto) {
        thePayload.theMenu.auto = {};
      }
      if (thePayload
        && thePayload.theMenu
        && thePayload.theMenu.auto
        && !thePayload.theMenu.auto.development
      ) {
        thePayload.theMenu.auto.development = [];
      }
      versionMenu.documents.forEach((ITEM) => {
        if (!thePayload.theMenu.auto.development.includes(ITEM)) {
          thePayload.theMenu.auto.development.push(ITEM);
        }
      });
      menuToBeAnalysed = { auto: { development: versionMenu.documents } };
      originalMenuToBeAnalysed = { auto: { development: originalMs.menu.auto.development } };
    } else {
      const releaseObject = {
        version: versionMenu.version,
        is_cpi_updated: versionMenu
          && (versionMenu.is_cpi_updated === true
          || versionMenu.is_cpi_updated === false)
          ? versionMenu.is_cpi_updated
          : false,
        documents: versionMenu.documents,
      };
      if (thePayload && !thePayload.theMenu) {
        thePayload.theMenu = {};
      }
      if (thePayload && thePayload.theMenu && !thePayload.theMenu.auto) {
        thePayload.theMenu.auto = {};
      }
      if (thePayload
        && thePayload.theMenu
        && thePayload.theMenu.auto
        && !thePayload.theMenu.auto.release
      ) {
        thePayload.theMenu.auto.release = [];
      }
      thePayload.theMenu.auto.release.push(releaseObject);
      menuToBeAnalysed = { auto: { release: [versionMenu] } };
      originalMenuToBeAnalysed = { auto: { release: [] } };
      const found = originalMs.menu.auto.release.find(ITEM => ITEM.version === version);
      if (found && !Array.isArray(found)) {
        originalMenuToBeAnalysed.auto.release = [found];
      } else if (found && Array.isArray(found)) {
        originalMenuToBeAnalysed.auto.release = found;
      }
    }
    const { process } = global.adp.documentMenu;
    menuAnalysed = await process.action(
      menuToBeAnalysed, originalMenuToBeAnalysed, originalMs.check_cpi, true,
    );
    if (menuAnalysed
      && menuAnalysed.auto
      && menuAnalysed.auto.errors
      && Array.isArray(menuAnalysed.auto.errors.development)
      && Array.isArray(menuAnalysed.auto.errors.release)) {
      const allErrors = menuAnalysed.auto.errors.development
        .concat(menuAnalysed.auto.errors.release);
      if (allErrors.length > 0) {
        if (allErrors.includes('Artifactory location not found')) {
          statusCode = 404;
          serverStatusCode = 404;
        } else if (allErrors.includes('Error while reading artifactory location')) {
          statusCode = 500;
          serverStatusCode = 500;
        } else {
          statusCode = 400;
          serverStatusCode = 400;
        }
      }
    }
    const legacy = adp.integration.documentRefresh;
    const analyse = legacy.analyseErrorsAndWarnings(menuToBeAnalysed, true, rawFile, MSID, MSSLUG);
    errors = analyse.errors;
    warnings = analyse.warnings;
    debuggerMessage(`[ ${logVersion} ] YAML file parsed in ${(new Date()).getTime() - timer}ms.`);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Parsing YAML File ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  // Preparing The Report...
  let theReport;
  try {
    const timer = (new Date()).getTime();
    debuggerMessage(`[ ${logVersion} ] Preparing report for this YAML file...`);
    const dbResponseToLog = {
      _id: MSID,
      slug: MSSLUG,
    };
    const useThisAutoErrors = menuAnalysed
      && menuAnalysed.auto
      && menuAnalysed.auto.errors
      ? menuAnalysed.auto.errors
      : { development: [], release: [] };

    const useThisAutoWarnings = menuAnalysed
      && menuAnalysed.auto
      && menuAnalysed.auto.warnings
      && menuAnalysed.auto.warnings
      ? menuAnalysed.auto.warnings
      : { development: [], release: [] };

    theReport = {
      statusCode,
      version: (MODE === 'development') ? 'development' : version,
      yamlUrl: YAMLURL,
      yamlRaw: rawFile,
      yamlParsed: versionMenu,
      dbResponse: dbResponseToLog,
      yamlErrors: useThisAutoErrors,
      yamlErrorsQuant: errors,
      yamlWarnings: useThisAutoWarnings,
      yamlWarningsQuant: warnings,
    };
    debuggerMessage(`[ ${logVersion} ] Report of this YAML file done in ${(new Date()).getTime() - timer}ms.`);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Preparing The Report ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  // The Classic Report preparation...
  let docsMessage;
  try {
    thePayload.yamlErrorsQuant += theReport.yamlErrorsQuant;
    thePayload.yamlWarningsQuant += theReport.yamlWarningsQuant;
    if (thePayload && thePayload.yamlErrors && thePayload.yamlErrors.development) {
      thePayload.yamlErrors.development = thePayload.yamlErrors.development
        .concat(theReport.yamlErrors.development);
    }
    if (thePayload && thePayload.yamlErrors && thePayload.yamlErrors.release) {
      thePayload.yamlErrors.release = thePayload.yamlErrors.release
        .concat(theReport.yamlErrors.release);
    }
    if (thePayload && thePayload.yamlWarnings && thePayload.yamlWarnings.development) {
      thePayload.yamlWarnings.development = thePayload.yamlWarnings.development
        .concat(theReport.yamlWarnings.development);
    }
    if (thePayload && thePayload.yamlWarnings && thePayload.yamlWarnings.release) {
      thePayload.yamlWarnings.release = thePayload.yamlWarnings.release
        .concat(theReport.yamlWarnings.release);
    }
    if (thePayload && !thePayload.versions) {
      thePayload.versions = 0;
    }
    thePayload.versions += 1;

    if (docQuantity === 0) {
      docsMessage = 'No documents were found';
    } else if (docQuantity === 1) {
      docsMessage = 'One document found';
    } else {
      docsMessage = `${docQuantity} documents found`;
    }
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ The Classic Report preparation ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  // Status Server Code resolution...
  try {
    if (thePayload.serverStatusCode === 200
      && serverStatusCode
      && serverStatusCode !== 200) {
      thePayload.serverStatusCode = serverStatusCode;
    }
    await adp.queue.setPayload(OBJECTIVE, thePayload);
  } catch (ERROR) {
    const errorCode = ERROR.code || 500;
    const errorMessage = ERROR.message || 'Error on [ Status Server Code resolution ] Code Block';
    const errorObject = {
      status: errorCode,
      error: ERROR,
      microserviceId: MSID,
      microserviceSlug: MSSLUG,
      yamlURL: YAMLURL,
      version: VERSION,
      mode: MODE,
      objective: OBJECTIVE,
    };
    RESOLVE(errorLog(errorCode, errorMessage, errorObject, 'main', packName));
    return;
  }


  const logMessage = `[ ${logVersion} ] [ ${docsMessage} ] End process for [ ${MSSLUG} ] in ${(new Date()).getTime() - fullTimer}ms.`;
  debuggerMessage(logMessage);
  RESOLVE(theReport);
});
