/* eslint-disable prefer-destructuring */
const cheerio = require('cheerio');
const rax = require('retry-axios');
const axios = require('axios');

const yaml = require('js-yaml');
const url = require('url');
const { customMetrics } = require('../metrics/register');
const errorLog = require('./../library/errorLog');

let warnings = { development: [], release: [] };
let errorsRepo = { development: [], release: [] };
// const { slugIt } = global.adp;
const originalYAMLFiles = [];
const packName = 'adp.artifactoryRepo.artifactoryRepo';
/**
* Parse a html string for links to yaml files and return a list of
* yaml file references.
* @author John Dolan [xjohdol]
*/
const parseRepoInfo = htmlString => new Promise((resolve, reject) => {
  const invalidValues = [null, undefined, ''];
  if (invalidValues.indexOf(htmlString) > -1) {
    reject(new Error(`htmlParse: Null, blank or undefined html: ${htmlString}.`));
  }
  const $ = cheerio.load(htmlString);
  const hasArtifactoryTitle = $('title').text() !== '';
  if (!hasArtifactoryTitle) {
    reject(new Error(`htmlParse: Unable to read artifactory page: ${htmlString}.`));
  }
  const links = $('a')
    .toArray()
    .map(x => cheerio(x)
      .attr('href'));
  const answer = links.filter((reference) => {
    if (reference.indexOf('yaml') > -1) {
      const tokens = reference.split('.');
      return tokens[tokens.length - 1] === 'yaml';
    }
    return false;
  });
  resolve(answer);
});

/** ! CHANGES !
* Create an object that makes an artifactory request for the provided url.
* @param {string} requestUrl Url to request.
* @returns {Object} An object with a no argument get function that performs the request.
* The get function resolves to the body of the successful request and is rejected on errors.
* @author John Dolan [xjohdol]
*/
const artifactoryFileRequest = async (
  ASSETID,
  ASSETSLUG,
  requestUrl,
) => {
  const timer = (new Date()).getTime();
  const authorizationString = `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}`;
  const headers = { Authorization: authorizationString };
  const requestURLWithTimeStamp = `${requestUrl}?ts=${(new Date()).getTime()}`;
  const obj = {
    info: requestURLWithTimeStamp,
    get: () => new Promise((RES, REJ) => {
      const startTime = new Date();
      rax.attach();
      axios({
        method: 'get',
        url: requestURLWithTimeStamp,
        headers,
        raxConfig: {
          retryDelay: 300,
          onRetryAttempt: (retryObj) => {
            const retryConf = rax.getConfig(retryObj);
            errorLog(
              504,
              `Artifactory retry attempt #${retryConf.currentRetryAttempt} for url ${requestURLWithTimeStamp}`,
              {
                error: retryObj,
                responseTime: (new Date().getTime() - timer),
                response: requestURLWithTimeStamp,
              },
              'artifactoryRequest',
              packName,
              false,
            );
          },
        },
      }).then((resp) => {
        customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
        RES(resp.data);
      }).catch((err) => {
        const resp = err.response;
        let msg;
        let code;
        let error;
        if (resp) {
          const errArr = resp.data && Array.isArray(resp.data.errors) ? resp.data.errors : [];
          msg = errArr.length && err.response.data.errors[0].message ? err.response.data.errors[0].message : 'Error while reading artifactory location';
          code = err.response.status;
          error = errArr;
        } else if (err.request) {
          msg = 'No response from Artifactory was received';
          code = 502;
          error = err.request;
        } else {
          msg = err.message || `Error throw during Artifactory connection: ${requestURLWithTimeStamp}`;
          code = 500;
          error = err;
        }
        customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
        errorLog(
          code,
          msg,
          { serverError: error, url },
          'artifactoryRequest',
          packName,
        );
        if (code === 404) {
          REJ(new Error('Artifactory location not found'));
        } else if (code !== 200) {
          REJ(new Error('Error while reading artifactory location'));
        } else {
          RES();
        }
      });
    }),
  };
  const yamlFile = await obj.get();
  return yamlFile;
};


/**
* Create an object that makes an artifactory request for the provided url.
* @param {string} requestUrl Url to request.
* @returns {Object} An object with a no argument get function that performs the request.
* The get function resolves to the body of the successful request and is rejected on errors.
* @author John Dolan [xjohdol]
*/
const artifactoryRequest = (requestUrl) => {
  const timer = (new Date()).getTime();
  const authorizationString = `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}`;
  const headers = { Authorization: authorizationString };
  const requestURLWithTimeStamp = `${requestUrl}?ts=${(new Date()).getTime()}`;
  return {
    info: requestURLWithTimeStamp,
    get: () => new Promise((resolve, reject) => {
      const startTime = new Date();
      rax.attach();
      axios({
        method: 'get',
        url: requestURLWithTimeStamp,
        headers,
        raxConfig: {
          retryDelay: 300,
          onRetryAttempt: (retryObj) => {
            const retryConf = rax.getConfig(retryObj);
            errorLog(
              504,
              `Artifactory retry attempt #${retryConf.currentRetryAttempt} for url ${requestURLWithTimeStamp}`,
              {
                error: retryObj,
                responseTime: (new Date().getTime() - timer),
                response: requestURLWithTimeStamp,
              },
              'artifactoryRequest',
              packName,
              false,
            );
          },
        },
      }).then((resp) => {
        customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
        adp.echoLog(`Retrieved from Artifactory Successfully: ${requestURLWithTimeStamp}`, null, 200, packName);
        resolve(resp.data);
      }).catch((err) => {
        const resp = err.response;
        let msg;
        let code;
        let error;
        if (resp) {
          const errArr = resp.data && Array.isArray(resp.data.errors) ? resp.data.errors : [];
          msg = errArr.length && err.response.data.errors[0].message ? err.response.data.errors[0].message : 'Error while reading artifactory location';
          code = err.response.status;
          error = errArr;
        } else if (err.request) {
          msg = 'No response from Artifactory was received';
          code = 502;
          error = err.request;
        } else {
          msg = err.message || `Error throw during Artifactory connection: ${requestURLWithTimeStamp}`;
          code = 500;
          error = err;
        }
        customMetrics.artifactoryRespMonitoringHistogram.observe(new Date() - startTime);
        errorLog(
          code,
          msg,
          { serverError: error, url },
          'artifactoryRequest',
          packName,
        );
        if (code === 404) {
          reject(new Error('Artifactory location not found'));
        } else if (code !== 200) {
          reject(new Error('Error while reading artifactory location'));
        } else {
          resolve();
        }
      });
    }),
  };
};


/**
* Retrieve an artifactory repository url as html.
* @author John Dolan [xjohdol]
*/
async function getRepoInfo(repoUrl) {
  return artifactoryRequest(repoUrl).get();
}

/**
* Convert a yaml string to a yaml object suitable for saving to the database as part of the menu.
* @param {string} yamlString Yaml file contents as a string.
* @returns {Object} An object representation of the yaml file with correct key names.
* @author John Dolan [xjohdol]
*/
const parseYaml = (yamlString) => {
  const yamlObject = yaml.safeLoad(yamlString);
  if (yamlObject.documents) {
    const processedDocuments = [];
    yamlObject.documents.forEach((document) => {
      const hasName = typeof document.name !== 'undefined';
      const hasPathOrLink = !(typeof (document.filepath) === 'undefined' && typeof (document['external-link']) === 'undefined');
      if (hasName && hasPathOrLink) {
        processedDocuments.push(document);
      } else {
        processedDocuments.push({ ...document, error: `invalidDocument: Skipping ${JSON.stringify(document)}.` });
      }
    });
    const filtered = processedDocuments.map((document) => {
      const newDocument = { ...document };
      if (typeof newDocument['external-link'] !== 'undefined') {
        newDocument.external_link = newDocument['external-link'];
        delete newDocument['external-link'];
      }
      return newDocument;
    });
    yamlObject.documents = filtered;
  } else {
    yamlObject.documents = [];
  }

  return yamlObject;
};

/**
* From a given baseUrl, download an array of relative yaml documents and parse them.
* @param {string} baseUrl The url to a directory containing yaml files.
* @param {string[]} refArray An array of yaml filenames.
* @param {object} originalMicroservice The original Microservice, for comparison.
* @param {boolean} allDocsMode If true, all documents will be retrieved. Default false.
* @param {string} OBJECTIVE The queue group id, necessary for this process.
* @param {string} MODE If is "development" or "release".
* @param {integer} STARTINDEX The start index for the queue.
* @param {string} specificVersion The version label ( to update just
*                 one version ), the word "development" ( to update just
*                 development version ) or "ALL" ( Default value, to update
*                 all the version - retrocompatibility )
* @returns {Object} An array of parsed yaml files
* @author John Dolan [xjohdol]
*/
const getYamlDocuments = (
  baseUrl,
  refArray,
  originalMicroservice = null,
  OBJECTIVE,
  MODE,
  STARTINDEX,
  specificVersion = 'ALL',
) => {
  let filteredRefArray = [];
  filteredRefArray = refArray;
  const fullUrls = filteredRefArray.map(reference => url.resolve(baseUrl, reference));
  const jobQueue = [];
  const versionNameRegExp = new RegExp(/[^/\\&?]+\.\w{3,4}(?=([?&].*$|$))/gim);
  let index = STARTINDEX || 1;

  const specificVersionSanitized = specificVersion ? specificVersion.toLowerCase().trim() : null;
  const isDevelopment = MODE === 'development'
    && (specificVersionSanitized === 'development'
    || specificVersionSanitized === 'indevelopment'
    || specificVersionSanitized === 'in-development');

  fullUrls.forEach((URL) => {
    const checkInDevelopmentYamlFileName = (URL.substring(URL.length - 19) === '/indevelopment.yaml');
    const version = (`${URL.match(versionNameRegExp)}`).replace('.yaml', '');
    // If is Development, should get only '/indevelopment.yaml' file;
    const firstSituation = isDevelopment && checkInDevelopmentYamlFileName;
    // If is not Development, should check specificVersion
    const secondSituation = specificVersion === 'ALL' || `${specificVersion}` === `${version}`;

    if (firstSituation || (!isDevelopment && secondSituation)) {
      const job = {
        command: 'adp.integration.documentRefreshPerVersion',
        parameters: [
          originalMicroservice._id,
          originalMicroservice.slug,
          URL,
          version,
          MODE,
        ],
        index,
      };
      jobQueue.push(job);
      index += 1;
    }
  });
  if (jobQueue.length > 0) {
    return adp.queue.addJobs('documentRefresh', originalMicroservice._id, OBJECTIVE, jobQueue)
      .then(() => new Promise(resolve => resolve({ index })))
      .catch(ERROR => new Promise((resolve, reject) => reject(ERROR)));
  }
  if (specificVersion !== 'ALL' && jobQueue.length === 0) {
    return new Promise(RESOLVETHIS => RESOLVETHIS({ code: 404, message: 'Version not found' }));
  }
  return new Promise(RESOLVETHIS => RESOLVETHIS({ message: 'No YAML files were found in the HTML' }));
};

/**
* Create a timestamp string that can be saved to couch
* and also passes JSON schema.
* @returns {string} Time stamp string ie '2020-04-08T19:03:34.256Z'
* @author John Dolan [xjohdol]
*/
function timestamp() {
  return JSON.parse(JSON.stringify(new Date()));
}


/**
* Given two arrays of yaml files, merge as one object.
* @param {Object[]} developmentDocuments The array of dev documents
* @param {Object[]} releaseDocuments The array of release documents
* @returns {Object} The menu object, including unmodified manual items.
* @author Armando Dias [zdiaarm]
*/
const buildMenu = (developmentDocuments, releaseDocuments) => {
  const devList = [];
  const releaseList = [];
  let howManyDevYAMLFiles = 0;
  developmentDocuments.forEach((ITEM) => {
    howManyDevYAMLFiles += 1;
    if (ITEM !== undefined && ITEM !== null) {
      if (ITEM.documents !== undefined && ITEM.documents !== null) {
        if (Array.isArray(ITEM.documents)) {
          ITEM.documents.forEach((DOC) => {
            devList.push(DOC);
          });
        }
      }
    }
  });
  releaseDocuments.forEach((ITEM) => {
    if (ITEM !== undefined && ITEM !== null) {
      releaseList.push(ITEM);
    }
  });
  if (howManyDevYAMLFiles > 1) {
    warnings.development.push(`There are ${howManyDevYAMLFiles} YAML files as Development instead of one. They will be merged and processed.`);
  }
  return {
    warnings,
    errors: errorsRepo,
    development: devList,
    release: releaseList,
    date_modified: timestamp(),
  };
};

/**
* Validation function. Used to identify repo urls that should be ignored.
* @param {string} repoUrl The repo url to validate
* @returns {boolean} False if the link should be skipped without errors.
* True if the link should be tried.
* @author John Dolan [xjohdol]
*/
function checkInputLink(repoUrl) {
  const skipList = [null, undefined, ''];
  if (skipList.indexOf(repoUrl) > -1) {
    // indicate to skip
    return false;
  }
  return true;
}

/**
* Perform all steps to convert repo urls into menu object.
* @param {string} devRepo The development repo url.
* @param {string} releaseRepo The release repo url.
* @param {object} originalMicroservice The original microservice for comparison.
* @param {boolean} allDocsMode If true, all documents will be retrieve. Default is false.
* @param {string} OBJECTIVE The queue group id, necessary for this process.
* @param {string} specificVersion The version label ( to update just
*                 one version ), the word "development" ( to update just
*                 development version ) or "ALL" ( Default value, to update
*                 all the version - retrocompatibility )
* @returns {Object} The menu object.
* @author John Dolan [xjohdol], Michael Coughlan [zmiccou]
*/
/* eslint-disable-next-line consistent-return */
async function getMenuFromRepos(
  devRepo,
  releaseRepo,
  originalMicroservice = null,
  OBJECTIVE,
  specificVersion = 'ALL',
) {
  let menu = {};
  let queueIndex = 1;
  let YamlReturnDev;
  let YamlReturnRel;
  warnings = { development: [], release: [] };
  errorsRepo = { development: [], release: [] };
  let devDocs; let
    releaseDocs;
  if (!checkInputLink(devRepo)) {
    devDocs = [];
  } else {
    let devHtml;
    await getRepoInfo(devRepo)
      .then((RES) => {
        devHtml = RES;
      })
      .catch((ErrResp) => {
        errorsRepo.development.push(ErrResp.message);
      });
    if (devHtml) {
      let devYamlList = await parseRepoInfo(devHtml);
      if (devYamlList && devYamlList.length === 0) {
        warnings.development.push('There is no YAML file provided in the Development repository location');
      }
      if (devYamlList && devYamlList.length > 0) {
        const refinedDevYamlList = devYamlList.filter(yamlFileName => yamlFileName === 'indevelopment.yaml');
        if (refinedDevYamlList.length > 0) {
          devYamlList = refinedDevYamlList;
        } else {
          devYamlList = [];
          warnings.development.push('There is no indevelopment.yaml file provided in the Development repository location');
        }
      }
      YamlReturnDev = await getYamlDocuments(
        devRepo,
        devYamlList,
        originalMicroservice,
        OBJECTIVE,
        'development',
        queueIndex,
        specificVersion,
      );
      queueIndex = YamlReturnDev.index ? YamlReturnDev.index : 1;
    }
  }

  if (!checkInputLink(releaseRepo)) {
    releaseDocs = [];
  } else {
    let releaseHtml;
    await getRepoInfo(releaseRepo)
      .then((RES) => {
        releaseHtml = RES;
      })
      .catch((ErrResp) => {
        errorsRepo.release.push(ErrResp.message);
      });
    if (releaseHtml) {
      const releaseYamlList = await parseRepoInfo(releaseHtml);
      if (releaseYamlList && releaseYamlList.length === 0) {
        warnings.release.push('There is no YAML file provided in the Release repository location');
      }
      YamlReturnRel = await getYamlDocuments(
        releaseRepo,
        releaseYamlList,
        originalMicroservice,
        OBJECTIVE,
        'release',
        queueIndex,
        specificVersion,
      );
      queueIndex = YamlReturnRel.index ? YamlReturnRel.index : 1;
    }
  }

  if ((YamlReturnDev && YamlReturnDev.code) && (YamlReturnRel && YamlReturnRel.code)) {
    errorsRepo = {
      code: YamlReturnRel && YamlReturnRel.code ? YamlReturnRel.code : 404,
      message: YamlReturnRel && YamlReturnRel.message ? YamlReturnRel.message : 'Version not found',
    };
    throw new Error(JSON.stringify(errorsRepo));
  }

  if (errorsRepo
    && ((Array.isArray(errorsRepo.development) && errorsRepo.development.length > 0)
    || (Array.isArray(errorsRepo.release) && errorsRepo.release.length > 0))) {
    const allRepoErrors = errorsRepo.development.concat(errorsRepo.release);
    let useStatus = 1;
    let useServerStatusCode = 200;
    if (Array.isArray(allRepoErrors)) {
      if (allRepoErrors.includes('Artifactory location not found')) {
        useStatus = 404;
        useServerStatusCode = 404;
      } else if (allRepoErrors.includes('Error while reading artifactory location')) {
        useStatus = 500;
        useServerStatusCode = 500;
      }
    }
    const thePayload = {
      status: useStatus,
      serverStatusCode: useServerStatusCode,
      yamlErrors: { development: errorsRepo.development, release: errorsRepo.release },
      yamlErrorsQuant: (errorsRepo.development.concat(errorsRepo.release)).length,
      yamlWarnings: { development: warnings.development, release: warnings.release },
      yamlWarningsQuant: (warnings.development.concat(warnings.release)).length,
    };
    await adp.queue.setPayload(OBJECTIVE, thePayload);
    throw new Error(JSON.stringify(errorsRepo));
  }

  adp.queue.addJob(
    'documentRefresh',
    originalMicroservice._id,
    'adp.integration.documentRefreshConsolidation',
    [originalMicroservice._id, originalMicroservice.slug, OBJECTIVE, specificVersion],
    OBJECTIVE,
    queueIndex,
  )
    .then(async () => {
      devDocs = devDocs || [];
      releaseDocs = releaseDocs || [];
      menu = await buildMenu(devDocs, releaseDocs);
      return menu;
    })
    .catch(ERROR => new Promise((resolve, reject) => reject(ERROR)));
}

// eslint-disable-next-line consistent-return
async function getVersionsFromRepos(devRepo, releaseRepo) {
  warnings = { development: [], release: [] };
  errorsRepo = { development: [], release: [] };
  // eslint-disable-next-line no-unused-vars
  let devDocs; let releaseDocs;
  let devYamlList = [];
  let releaseYamlList = [];
  try {
    if (!checkInputLink(devRepo)) {
      devDocs = [];
    } else {
      let devHtml;
      await getRepoInfo(devRepo)
        .then((RES) => {
          devHtml = RES;
        })
        .catch((ErrResp) => {
          errorsRepo.development.push(ErrResp.message);
        });
      if (devHtml) {
        devYamlList = await parseRepoInfo(devHtml);
        if (devYamlList && devYamlList.length === 0) {
          warnings.development.push('There is no YAML file provided in the Development repository location');
        }
        if (devYamlList && devYamlList.length > 0) {
          const refinedDevYamlList = devYamlList.filter(yamlFileName => yamlFileName === 'indevelopment.yaml');
          if (refinedDevYamlList.length > 0) {
            devYamlList = refinedDevYamlList;
          } else {
            devYamlList = [];
            warnings.development.push('There is no indevelopment.yaml file provided in the Development repository location');
          }
        }
      }
    }

    let releaseHtml;
    if (!checkInputLink(releaseRepo)) {
      releaseDocs = [];
    } else {
      await getRepoInfo(releaseRepo)
        .then((RES) => {
          releaseHtml = RES;
        })
        .catch((ErrResp) => {
          errorsRepo.release.push(ErrResp.message);
        });
      if (releaseHtml) {
        releaseYamlList = await parseRepoInfo(releaseHtml);
        if (releaseYamlList && releaseYamlList.length === 0) {
          warnings.release.push('There is no YAML file provided in the Release repository location');
        }
        // return releaseYamlList;
      }
      if (releaseHtml === undefined || releaseHtml === null) {
        return [];
      }
      const mergedYamlList = [...devYamlList, ...releaseYamlList];
      return mergedYamlList;
    }
  } catch (error) {
    return [];
  }
}

/**
* Extract urls from a microservice object and return a valid menu object. Does not modify
* the input microservice object.
* @param {Microservice} msBasics The microservice ID, Slug and a few more fields.
* @param {string} OBJECTIVE The queue group id, necessary for this process.
* @param {string} specificVersion The version label ( to update just
*                 one version ), the word "development" ( to update just
*                 development version ) or "ALL" ( Default value, to update
*                 all the version - retrocompatibility )
* @returns {Object} An Object with the valid menu (theMenu) and the raw content (theRawContent).
* @author John Dolan [xjohdol]
*/
async function updateService(msBasics, OBJECTIVE, specificVersion = 'ALL') {
  const adpModel = new adp.models.Adp();
  let fromDatabase;
  let microservice;
  try {
    fromDatabase = await adpModel.getById(msBasics._id);
    microservice = fromDatabase.docs[0];
  } catch (error) {
    throw new Error(`portalConfig: Impossible to read the microservice ${msBasics._id}/${msBasics.slug}.`);
  }

  if (microservice.menu_auto) {
    if (typeof (microservice.repo_urls) === 'undefined') {
      throw new Error(`portalConfig: No repo_urls field on ${microservice}.`);
    }
    let devRepo = microservice.repo_urls.development ? microservice.repo_urls.development : '';
    if ((`${devRepo}`).trim().length > 0) {
      if (devRepo.substr(devRepo.length - 1, 1) !== '/') {
        devRepo = `${devRepo}/`;
      }
    }
    let releaseRepo = microservice.repo_urls.release ? microservice.repo_urls.release : '';
    if ((`${releaseRepo}`).trim().length > 0) {
      if (releaseRepo.substr(releaseRepo.length - 1, 1) !== '/') {
        releaseRepo = `${releaseRepo}/`;
      }
    }
    const emptyManual = {
      release: [],
      development: [],
      date_modified: timestamp(),
    };
    const manualMenuPresent = microservice.menu && microservice.menu.manual;
    const menu = {
      auto: await getMenuFromRepos(
        devRepo,
        releaseRepo,
        microservice,
        OBJECTIVE,
        specificVersion,
      ),
      manual: manualMenuPresent ? microservice.menu.manual : emptyManual,
    };
    return { theMenu: menu, theRawContent: originalYAMLFiles };
  }
  throw new Error('portalConfig: Automatic menu updates not enabled.');
}

module.exports = {
  parseRepoInfo,
  getRepoInfo,
  getYamlDocuments,
  updateService,
  getMenuFromRepos,
  artifactoryFileRequest,
  parseYaml,
  getVersionsFromRepos,
};
