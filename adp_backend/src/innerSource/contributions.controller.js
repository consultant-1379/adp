/**
 * Innersource contributions list search
 * @author Veerender
 */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
const packName = 'global.adp.innersource.contributions';
const msSearch = require('../microservices/search');
// ============================================================================================= //
/**
 * preparing search result data
 * @param  {object} searchResp response object from DB
 * @author Veerender
 */
const _prepareSearchResultData = (searchResp) => {
  const searchData = [];
  if (searchResp.docs && searchResp.docs.length) {
    searchResp.docs.forEach((contribution) => {
      if (contribution.micro_services && contribution.micro_services.length
        && contribution.micro_services[0].assetId) {
        searchData.push(contribution);
      }
    });
  }
  return searchData;
};


/**
 *After collecting and validating the string queries pipeline updates
 * @param {object} pipelines holds all current pipeline data before mongo query
 * @param {array} [possibleFilters=[]] list of possible filter queries
 * @returns {object} obj.valid {boolean} if any failures occurred during the validation and
 * building process
 * obj.pipelines {object} updated pipelines object
 * obj.errors {array} list of any error occurrences during this process
 * @author Veerender
 */
const afterStrQueryPipelineRules = (pipelines, possibleFilters = []) => {
  const resp = { valid: true, pipelines: { ...pipelines }, errors: [] };
  const errors = [];

  if (possibleFilters.length) {
    const filterValObj = msSearch.validateFiltersGetQueryObj(possibleFilters);
    if (filterValObj.valid) {
      resp.pipelines.filters = filterValObj.query;
    } else {
      errors.push(...filterValObj.errors);
      resp.valid = false;
      return resp;
    }
  }

  return resp;
};

/**
  * Builds the pipeline queries according by the request query object.
  * The pipeline query objects is designed to be used by the gitstatus model
  * @param {object} reqQuery the query object from the request which include the search parameters
  * @returns {object} obj.valid {boolean} if any failures occurred during the validation and
  * building process
  * obj.pipelines {object} which will contain the pipeline stages if set by the request query
  * obj.errors {array} list of errors encountered
  * @author Veerender
  */
const buildQueryPipelines = (reqQuery) => {
  const resp = { valid: true, pipelines: {}, errors: [] };
  const possibleFilters = [];
  resp.valid = Object.keys(reqQuery).every((queryStrKey) => {
    const key = (typeof queryStrKey === 'string' ? queryStrKey.trim() : '');
    const filterObj = {};
    filterObj[key] = reqQuery[key];
    possibleFilters.push(filterObj);
    return true;
  });
  if (resp.valid) {
    const afterQuerySetup = afterStrQueryPipelineRules(
      resp.pipelines, possibleFilters,
    );
    resp.pipelines = afterQuerySetup.pipelines;
    resp.valid = afterQuerySetup.valid;
    resp.errors.push(...afterQuerySetup.errors);
  }

  return resp;
};

/**
  * Innersource contributions(contributors, organisations) search
  * @param {object} query query params filter object
  * @param {string} key key representing contributors or organisations api call
  * @returns {promise} containing db result and total result count
  * @author Veerender, Michael
  */
const contributions = (query, key) => new Promise((resolve, reject) => {
  let pipelineobj = {};
  let queryParams = query;

  if (typeof queryParams === 'object') {
    const pipelineBuildObj = buildQueryPipelines(queryParams);
    pipelineobj = pipelineBuildObj.pipelines;
  } else {
    queryParams = {};
  }

  const gitStatusModel = new adp.models.Gitstatus();
  let innersourceApi = gitStatusModel.innerSourceContributors.bind(gitStatusModel);

  if (key === 'organisations') {
    innersourceApi = gitStatusModel.innersourceOrganisations.bind(gitStatusModel);
  }

  innersourceApi(
    pipelineobj.filters,
    queryParams.fromDate,
    queryParams.toDate,
    queryParams.limit,
  ).then((searchResp) => {
    const searchData = _prepareSearchResultData(searchResp);
    resolve({
      data: searchData, total: searchData.length,
    });
  }).catch((searchError) => {
    const { code, message } = searchError;
    const error = {
      code: code || 500,
      message: message || 'db failure: Failed to execute',
    };
    adp.echoLog(message, {
      error: searchError, pipelineobj, queryParams, origin: 'innersource.contributions',
    }, error.code, packName);
    reject(error);
  });
});

module.exports = {
  contributions,
};
