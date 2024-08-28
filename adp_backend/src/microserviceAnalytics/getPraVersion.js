// ============================================================================================= //
/**
* [ global.adp.microserviceAnalytics.getPraVersion ]
* Retrieve a PRA version for a MicroService.
* @param {String} microserviceSlug the slug of the microservice in which to fetch the
* latest PRA version
* @return {String} Returns the latest PRA version of the given microservice.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //

module.exports = msSlug => new Promise(async (RESOLVE, REJECT) => {
  const dbModel = new adp.models.Adp();
  const packName = 'global.adp.microserviceAnalytics.getPraVersion';
  const errors = {
    connectionError: 'Problem with Connection to index.yaml file',
    notFoundError: 'Could not find entry for the given microservice helm chart name',
    msHasNoHelm: 'This microservice has no Helm information',
    failedToFetchMS: 'Could not retrieve the service by slug',
    formatFailure: 'index.yml file incorrectly structured',
  };
  const errorResponse = { code: 404, message: '' };

  /**
   * Checks if a microservice has helm information
   * @param {obj} msReturnObj the object return from the ms query
   * @returns {bool} true if it has defined helm information
   * @author Cein
   */
  const msHasHelmData = (msReturnObj) => {
    if (typeof msReturnObj.docs && msReturnObj.docs.length > 0) {
      const msObj = msReturnObj.docs[0];
      const hasHelmUrl = (msObj.helmurl && msObj.helmurl.trim() !== '');
      const hasHelmName = (msObj.helm_chartname && msObj.helm_chartname.trim() !== '');
      return (hasHelmUrl && hasHelmName);
    }
    return false;
  };

  /**
   * Fetches the latest pra number from the index.yaml file
   * provided by from the helm url given by the MS
   * @param {obj} yamlObject object containing pra information related to the give helm chart name
   * @param {string} helmName the helm chart name in which to find the latest pra number
   * @returns {obj} {found, lastPRAVersion}
   * {bool} found if the PRA version is found
   * {string} lastPRAVersion latest pra version
   * @author Omkar/Cein
   */
  const fetchLatestPRA = (yamlObject, helmName) => {
    const returnData = { found: false, lastPRAVersion: '' };
    const tempVersions = [];
    Object.keys(yamlObject.entries).forEach((entry) => {
      if (entry === helmName) {
        yamlObject.entries[entry].forEach((entryPra) => {
          if (entryPra.version.includes('+') && !entryPra.version.includes('EP')) {
            tempVersions.push(entryPra.version);
          }
        });
      }
    });

    if (tempVersions.length > 0) {
      const versionsDescending = tempVersions.map(version => version.trim()
        .replace(/\d+/g, verPointNumber => (+verPointNumber) + 100000))
        .sort().reverse()
        .map(version => version.trim().replace(/\d+/g, verPointNumber => (+verPointNumber) - 100000));
      const [latestVersion] = versionsDescending;
      returnData.lastPRAVersion = latestVersion;
      returnData.found = true;
    }
    return returnData;
  };

  /**
   * validates the error object depending on if the file failed on fetch
   * or the the yaml object build failed
   * @param {bool} fetchFailure if the fetch of the raw yaml file has failed
   * @returns {obj} errorResponse standard error reponse object
   * @author Cein
   */
  const yamlFetchFailureProcess = (fetchFailure) => {
    errorResponse.code = (fetchFailure ? 400 : 404);
    errorResponse.message = (fetchFailure ? errors.connectionError : errors.formatFailure);
    adp.echoLog('Error in [ yamlFetchFailureProcess ]', errorResponse.message, errorResponse.code, packName, true);
    return errorResponse;
  };

  /**
   * Will convert the yaml body file into a usable object safely
   * and validate the objects structure
   * @param {string} documentBody yaml file raw body
   * @returns {obj} {buildSuccess, yamlObject}
   * {boolean} buildSuccess if the build and structure of the usable yaml object is correct
   * {yamlObject} the successfully generated yaml object
   * @author Cein
   */
  const buildYamlObject = (documentBody) => {
    const returnData = { buildSuccess: false, yamlObject: {} };
    try {
      const yamlObject = global.jsyaml.safeLoad(documentBody);
      if (typeof yamlObject === 'object' && typeof yamlObject.entries !== 'undefined') {
        returnData.buildSuccess = true;
        returnData.yamlObject = yamlObject;
      }
      return returnData;
    } catch (yamlBuildError) {
      adp.echoLog('Error in try/catch from [ buildYamlObject ]', { error: yamlBuildError }, 500, packName, true);
      return returnData;
    }
  };

  if (typeof msSlug === 'string' && msSlug.trim() !== '') {
    adp.echoLog(`Starting to read MS Helm Information for slug: [${msSlug}]`, null, 200, packName);
    dbModel.getByMSSlug(msSlug).then((msReturnObj) => {
      if (msHasHelmData(msReturnObj)) {
        const helmName = msReturnObj.docs[0].helm_chartname;
        const helmUrl = msReturnObj.docs[0].helmurl;
        const indexYamlUrl = `${helmUrl}${(helmUrl.endsWith('/') ? '' : '/')}index.yaml`;
        const authorizationString = `Basic ${Buffer.from(global.adp.config.eadpusersPassword).toString('base64')}`;
        const headers = { Authorization: authorizationString };
        adp.echoLog(`Starting to read PRA Version using Helm Chart name: [${helmName}]`, null, 200, packName);
        global.request.get({ url: indexYamlUrl, headers }, (yamlFetchError, response, body) => {
          const yamlBuildObject = buildYamlObject(body);
          const fetchFailure = (typeof yamlFetchError !== 'undefined' && yamlFetchError !== null);
          if (fetchFailure || !yamlBuildObject.buildSuccess) {
            REJECT(yamlFetchFailureProcess(fetchFailure));
          } else {
            const praVersionObj = fetchLatestPRA(yamlBuildObject.yamlObject, helmName);
            if (praVersionObj.found && praVersionObj.lastPRAVersion.trim() !== '') {
              RESOLVE(praVersionObj.lastPRAVersion);
            } else {
              errorResponse.code = 404;
              errorResponse.message = errors.notFoundError;
              adp.echoLog('Error in [ request.get ]', errorResponse.message, errorResponse.code, packName, true);
              REJECT(errorResponse);
            }
          }
        });
      } else {
        errorResponse.code = 404;
        errorResponse.message = errors.msHasNoHelm;
        adp.echoLog('Not found', errorResponse.message, errorResponse.code, packName, true);
        REJECT(errorResponse);
      }
    }).catch((errorFetchingMs) => {
      adp.echoLog('Error in [ dbModel.getByMSSlug ]', { slug: msSlug, error: errorFetchingMs }, 500, packName, true);
      errorResponse.code = 500;
      errorResponse.message = errors.failedToFetchMS;
      REJECT(errorResponse);
    });
  } else {
    errorResponse.code = 404;
    errorResponse.message = errors.failedToFetchMS;
    adp.echoLog('Error in "msSlug" variable', { msSlug: `${msSlug}`, error: errorResponse.message }, errorResponse.code, packName, true);
    REJECT(errorResponse);
  }
});
// ============================================================================================= //
