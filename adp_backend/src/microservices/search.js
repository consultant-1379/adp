/**
 * Microservice search
 * @author Cein
 */

global.adp.docs.list.push(__filename);
const packName = 'global.adp.microservices.search';

/**
 * breaks up comma delimited values into an array
 * @param {string} VALUE string of comma delimited values
 * @param {string} [TYPE='number'] the type to convert to, only supports number
 * and string
 * @returns {array} list of values dependent on the type
 * @author Armando, Cein
 */
const isOneOrMore = (VALUE, TYPE = 'number') => {
  if (typeof VALUE === 'string' && VALUE.trim()) {
    const list = VALUE.split(',');
    if (list.length) {
      if (TYPE === 'number') {
        return list.map((value) => {
          const possibleNum = Number(value);
          return (Number.isNaN(possibleNum) ? value : possibleNum);
        });
      }
      return list;
    }
  }
  return [];
};

/**
 * Confirms that one or more key exists to the schema
 * @param {array} schemaKeyList list of schema keys to validate against
 * @param {string} requestedBy which area of the query string requires this. Example SORT, FILTER
 * Only used for the error response
 * @returns {object} obj.valid {boolean} - passed the schema check if true
 * obj.errors {array} if the validation failed at any point, the standard error object
 * will be listed
 * @author Cein
 */
const schemaValidation = (schemaKeyList, requestedBy, schemaType = 'microservice') => {
  const result = { valid: true, errors: [] };
  if (Array.isArray(schemaKeyList) && schemaKeyList.length) {
    schemaKeyList.forEach((schemaKey) => {
      if (global.adp.microservices.checkIfDontHaveInSchema(schemaKey, schemaType)) {
        result.valid = false;
        result.errors.push({
          code: 400,
          message: `Error on ${requestedBy}: The field [ ${schemaKey} ] does not exist`,
          data: {
            schemaKey, schemaKeyList, requestedBy, origin: 'schemaValidation',
          },
        });
      }
    });
  }

  return result;
};

/**
 * Will evaluate a list of possible filters and build a group and selectid
 * query for mongo. Where the group will be $and and selectid will be $or
 * This method will validate all given values and if any query matches it will be
 * added to the returning query.
 * @param {array} filterList list of objects where the object key will be the group name string
 * and the object value will be comma delimited group select ids.
 * @returns {object} obj.valid {boolean} if there is a set filter in the query
 * obj.query {array} list of valid mongo ready $match criteria
 * obj.errors {array} list of errors of items that did not pass the validation
 * @author Cein
 */
const validateFiltersGetQueryObj = (filterList, schemaType = 'microservice') => {
  const respObj = { valid: false, query: [], errors: [] };
  if (Array.isArray(filterList) && filterList.length) {
    filterList.forEach((filterObj) => {
      if (typeof filterObj === 'object' && filterObj !== null) {
        const listOptFilterGroup = Object.keys(filterObj)[0];
        let listOptFilterSelectIds = [];
        if (filterObj[listOptFilterGroup]) {
          listOptFilterSelectIds = isOneOrMore(filterObj[listOptFilterGroup]);
        }
        if (listOptFilterSelectIds.length) {
          const schemaValObj = schemaValidation([listOptFilterGroup], 'validation for fitlers get query', schemaType);

          if (schemaValObj.valid) {
            const andQuery = { $or: [] };

            listOptFilterSelectIds.forEach((selectId) => {
              const orQuery = {};
              orQuery[listOptFilterGroup] = selectId;
              andQuery.$or.push(orQuery);
            });
            respObj.query.push(andQuery);
            respObj.valid = true;
          } else {
            respObj.errors.push(...schemaValObj.errors);
          }
        } else {
          respObj.errors.push({
            code: 400,
            message: 'Unable to process the filter object values as they are empty or incorrectly formatted.',
            data: { filterObj, filterList, origin: 'validateFiltersGetQueryObj' },
          });
        }
      } else {
        respObj.errors.push({
          code: 400,
          message: 'Error on Filter: Unable to process filter object as it is of the wrong type.',
          data: { filterObj, filterList, origin: 'validateFiltersGetQueryObj' },
        });
      }
    });
  }
  return respObj;
};

/**
 * Finds all searchable keys in the microservice schema
 * @returns {array} of index objects containing and their paths searchable keys and their key paths
 * Example of index object
 * { path: 'denorm.service_category', key: 'service_category' }
 * @author Cein
 */
const getSearchableSchemaIndexes = () => {
  const msSchemaProp = global.adp.config.schema.microservice.properties;
  const foundKeys = [];
  let traversalPathArr = [];

  /**
   * Recursive property traversal of the schema's nested objects
   * @param {array} keyPathArr list of collection keys from traversal
   * example 'menu_item.slug'
   * @param {object} propertyObj the object level that defines collection keys
   * such as name or repo_urls
   * @author Cein
   */
  const traverseProperties = (keyPathArr, propertyObj) => {
    traversalPathArr = [...keyPathArr];
    if (propertyObj !== null && typeof propertyObj === 'object') {
      const schemaLvlArr = Object.entries(propertyObj);
      const schemaLvlLen = schemaLvlArr.length - 1;

      schemaLvlArr.forEach(([key, propObj], objIndex) => {
        const searchable = propObj.searchIndexable;

        if (propObj.searchableLookupKeys && propObj.searchableLookupKeys.length) {
          propObj.searchableLookupKeys.forEach((searchLookupKey) => {
            if (typeof searchLookupKey === 'string') {
              if (searchLookupKey.includes('denorm')) {
                foundKeys.push({ path: searchLookupKey, key });
              } else {
                const joinedPath = traversalPathArr.join('.');
                const path = `${joinedPath}${(joinedPath === '' ? '' : '.')}${key}.${searchLookupKey}`;
                foundKeys.push({ path, key: searchLookupKey });
              }
            }
          });
        }

        const searchableNonObjSchemaItem = (
          propObj.items && !propObj.items.properties && propObj.items.searchIndexable
        );

        if (searchable || searchableNonObjSchemaItem) {
          const joinedPath = traversalPathArr.join('.');
          const path = `${joinedPath}${(joinedPath === '' ? '' : '.')}${key}`;
          foundKeys.push({ path, key });
        } else if (propObj.properties) {
          traversalPathArr.push(key);
          traverseProperties(traversalPathArr, propObj.properties);
        } else if (propObj.items && propObj.items.properties) {
          traversalPathArr.push(key);
          traverseProperties(traversalPathArr, propObj.items.properties);
        }

        if (schemaLvlLen === objIndex) {
          traversalPathArr.pop();
        }
      });
    }
  };

  if (msSchemaProp) {
    traverseProperties([], msSchemaProp);
  }

  return foundKeys;
};

/**
 * Search validation and index fetch
 * @param {string} searchVal the search value from the url string query search
 * @return {object} obj.valid {boolean} if the search is needed
 * obj.searchToken {string} the search term in a regex format
 * obj.errors {array} any failures that occurred when fetching the schema keys
 * @author cein
 */
const validateSearchQueryGetToken = (searchVal) => {
  const respObj = { valid: false, searchToken: '', errors: [] };
  // remove all punctuation except @ - . , then remove consecutive spaces
  const searchStr = (typeof searchVal === 'string' ? searchVal : '').replace(/[^\w\s-@.,]+/gm, '').replace(/\s\s+/g, ' ').trim();

  if (searchStr !== '') {
    // allow for partial words and out of order searching with or condition
    respObj.searchToken = searchStr.split(' ').map(word => `(?=.*${word})`).join('');
    respObj.valid = true;
  } else {
    const error = { code: 400, message: 'The search string cannot be empty.', data: { searchVal, searchStr, origin: 'validateSearchQueryGetToken' } };
    respObj.errors.push(error);
  }
  return respObj;
};

/**
 * Private: Fetches a list of specific keys from an object then stringifies that object
 * @param {object} obj the object to retrieve keys from
 * @param {array} indexObjList a list of objects containing the object path from the schema
 * @returns {string} a json stringified values of the give object to the index keys
 * @author Cein
 */
const _removeObjectKeysStringify = (obj, indexObjList) => {
  const arrOfIndexValues = [];
  indexObjList.forEach((indexObj) => {
    if (indexObj.path) {
      const pathArr = indexObj.path.split('.');
      if (pathArr.length) {
        let recursiveVal;
        const validPath = pathArr.every((objKey) => {
          if (typeof recursiveVal === 'undefined' && typeof obj[objKey] !== 'undefined') {
            recursiveVal = obj[objKey];
            return true;
          }
          if (typeof recursiveVal !== 'undefined' && Array.isArray(recursiveVal) && recursiveVal.length) {
            recursiveVal.every((arrObj) => {
              if (typeof arrObj === 'object' && arrObj !== null && typeof arrObj[objKey] !== 'undefined') {
                arrOfIndexValues.push(arrObj[objKey]);
                return true;
              }
              return false;
            });
            return false;
          }
          if (typeof recursiveVal === 'object' && recursiveVal !== null && typeof recursiveVal[objKey] !== 'undefined') {
            recursiveVal = recursiveVal[objKey];
            return true;
          }
          return false;
        });

        if (validPath) {
          arrOfIndexValues.push(recursiveVal);
        }
      }
    }
  });

  return JSON.stringify(arrOfIndexValues);
};

/**
 * Searches through the mongo grouped documents result for given regex of search terms
 * and returns the updated groups of microservices
 * @param {array} dbDocData list of mongo asset data in its
 * grouped state(Including Non-grouped group)
 * @param {string} searchToken the regular expression to match the data again which
 * will contain the search terms
 * @returns {object} obj.result {array} the updated search results
 * obj.errors {array} list of errors that have occured during the search process
 * obj.totalAssets {number} searched total asset count
 * @author Cein
 */
const inMemorySearch = (dbDocData, searchToken) => {
  const respObj = { result: [], errors: [], totalAssets: 0 };
  if (dbDocData.length) {
    const indexes = getSearchableSchemaIndexes();
    if (Array.isArray(indexes) && indexes.length) {
      respObj.result = dbDocData.reduce((foundGroup, groupedObj) => {
        const foundMsList = groupedObj.microservices.filter((msObj) => {
          const searchableDocObjStr = _removeObjectKeysStringify(msObj, indexes);
          const test = searchableDocObjStr.match(new RegExp(searchToken, 'i'));
          return (test !== null);
        });

        if (foundMsList.length) {
          respObj.totalAssets += foundMsList.length;
          const newGroup = { ...groupedObj };
          newGroup.microservices = foundMsList;
          newGroup.total = foundMsList.length;
          foundGroup.push(newGroup);
        }
        return foundGroup;
      }, []);
    } else {
      const error = { code: 500, message: 'Failed to fetch search indexes from schema', data: { indexes, origin: 'validateSearchQueryGetIndexes' } };
      adp.echoLog(error.message, error.data, error.code, packName);
      respObj.errors.push(error);
    }
  }
  return respObj;
};

/**
 * validates the given group by parameter with the schema as a groupable item
 * @param {string} groupByStrQuery the groupby string query parameter from the search
 * @returns {object} obj.valid {boolean} if the groupby param is valid
 * obj.groupByKey {string} the valid collection key to group by
 * obj.errors {errors} list of any errors that had occurred
 * @author Cein
 */
const validateGroupingUrlQueryStr = (groupByStrQuery, schemaType = 'microservice') => {
  const respObj = { valid: false, groupByKey: '', errors: [] };

  if (typeof groupByStrQuery === 'string' && groupByStrQuery.trim() !== '') {
    let msSchemaProp;
    if (schemaType === 'assembly') {
      const assetSchema = new adp.assets.BuildAssetSchemaClass(false);
      msSchemaProp = assetSchema.loadExtra.assetSchema.properties;
    } else {
      msSchemaProp = global.adp.config.schema.microservice.properties;
    }
    if (msSchemaProp[groupByStrQuery] && msSchemaProp[groupByStrQuery].groupable) {
      respObj.valid = true;
      respObj.groupByKey = groupByStrQuery;
    } else {
      respObj.errors.push({ code: 400, message: 'Group by parameter is not a groupable schema item.', data: { groupByStrQuery, origin: 'validateGroupingUrlQueryStr' } });
    }
  } else {
    respObj.errors.push({ code: 400, message: 'Group by is not type string or is empty.', data: { groupByStrQuery, origin: 'validateGroupingUrlQueryStr' } });
  }

  return respObj;
};

/**
 * Validates the url string query sort parameter and returns the sort query object
 * if no url string query is given then the default sort query object will be returned
 * @param {string} sortStrQuery the sort url string query parameter, negative string for desc order
 * can be one or more, comma delimited
 * @returns {object} obj.valid {boolean} if one failure occurs the sort becomes invalid
 * obj.sortObjList {array} list of sort object, containing the after key
 * the order and the schema key
 * obj.errors {array} list of errors if there is a validation failure
 * @author Cein
 */
const validateSortGetQueryObj = (sortStrQuery) => {
  const respObj = { valid: true, sortObjList: [], errors: [] };

  if (typeof sortStrQuery === 'string' && sortStrQuery.trim() !== '') {
    const strQueryArr = isOneOrMore(sortStrQuery, 'string');
    if (strQueryArr) {
      strQueryArr.forEach((sortItem) => {
        const order = (sortItem.charAt(0) === '-' ? -1 : 1);
        let sortKey = sortItem;
        if (order === -1) {
          sortKey = sortKey.substr(1);
        }

        const msSchemaProp = global.adp.config.schema.microservice.properties;
        if (msSchemaProp[sortKey] && msSchemaProp[sortKey].sortableKey) {
          respObj.sortObjList.push(
            { key: msSchemaProp[sortKey].sortableKey, order, schemaKey: sortKey },
          );
        } else {
          respObj.errors.push({ code: 400, message: 'Sort key is not valid or is not a sortable items.', data: { sortStrQuery } });
          respObj.valid = false;
        }
      });
    }
  } else {
    respObj.errors.push({ code: 400, message: 'Sort key is not of type string or is empty.', data: { sortStrQuery } });
    respObj.valid = false;
  }
  return respObj;
};

/**
 * private: After collecting and validating the string queries pipeline updates
 * @param {object} pipelines holds all current pipeline data before mongo query
 * @param {array} [possibleFilters=[]] list of possible filter queries
 * @param {array} [sortList=[]] list of sort objects that need to be split into before
 * and after grouping sort
 * @returns {object} obj.valid {boolean} if any failures occurred during the validation and
 * building process
 * obj.pipelines {object} updated pipelines object
 * obj.errors {array} list of any error occurrences during this process
 * @author Cein
 */
const _afterStrQueryPipelineRules = (pipelines, possibleFilters = [], sortList = [], schemaType = 'microservice') => {
  const resp = { valid: true, pipelines: { ...pipelines }, errors: [] };
  const errors = [];
  if (typeof resp.pipelines.page === 'number' && typeof resp.pipelines.limit === 'number') {
    const { page } = resp.pipelines;
    resp.pipelines.skip = resp.pipelines.limit * (page ? (page - 1) : page);
  }

  if (possibleFilters.length) {
    const filterValObj = validateFiltersGetQueryObj(possibleFilters, schemaType);
    if (filterValObj.valid) {
      resp.pipelines.filters = filterValObj.query;
    } else {
      errors.push(...filterValObj.errors);
      resp.valid = false;
      return resp;
    }
  }

  if (sortList.length) {
    sortList.forEach((sortObj) => {
      if (resp.pipelines.groupByKey === sortObj.schemaKey) {
        if (!resp.pipelines.sortAfterGrouping) {
          resp.pipelines.sortAfterGrouping = {};
        }
        resp.pipelines.sortAfterGrouping[`microservices.${sortObj.key}`] = sortObj.order;
      } else {
        if (!resp.pipelines.sortBeforeGrouping) {
          resp.pipelines.sortBeforeGrouping = {};
        }
        resp.pipelines.sortBeforeGrouping[sortObj.key] = sortObj.order;
      }
    });
  }

  if (resp.pipelines.sortBeforeGrouping && resp.pipelines.groupByKey) {
    // separate group stage sort if present
    const groupSortVal = resp.pipelines.sortBeforeGrouping[resp.pipelines.groupByKey];
    if (typeof groupSortVal !== 'undefined') {
      resp.pipelines.sortAfterGrouping = groupSortVal;
      delete resp.pipelines.sortBeforeGrouping[resp.pipelines.groupByKey];
    }
  }
  return resp;
};

/**
 * Builds the pipeline queries according by the request query object.
 * The pipeline query objects is designed to be used by the adp model ms search
 * @param {object} reqQuery the query object from the request which include the search parameters
 * @returns {object} obj.valid {boolean} if any failures occurred during the validation and
 * building process
 * obj.pipelines {object} which will contain the pipeline stages if set by the request query
 * obj.errors {array} list of errors encountered
 * @author Cein
 */
const buildQueryPipelines = (reqQuery, schemaType = 'microservice') => {
  const resp = { valid: true, pipelines: {}, errors: [] };
  const possibleFilters = [];
  let sortList = [];

  resp.valid = Object.keys(reqQuery).every((queryStrKey) => {
    const key = (typeof queryStrKey === 'string' ? queryStrKey.trim() : '');
    switch (key) {
      case 'assetType': {
        // already handled
        break;
      }
      case 'search': {
        const searchValObj = validateSearchQueryGetToken(reqQuery.search);
        if (searchValObj.valid) {
          resp.pipelines.search = searchValObj.searchToken;
        } else if (searchValObj.errors.length) {
          resp.errors.push(...searchValObj.errors);
          return false;
        }
        break;
      }
      case 'sort': {
        const sortValObj = validateSortGetQueryObj(reqQuery.sort);
        if (sortValObj.valid && sortValObj.sortObjList.length) {
          sortList = sortValObj.sortObjList;
        } else {
          resp.errors.push(...sortValObj.errors);
          return false;
        }
        break;
      }
      case 'groupby': {
        const groupbyValObj = validateGroupingUrlQueryStr(reqQuery.groupby, schemaType);
        if (groupbyValObj.valid) {
          resp.pipelines.groupByKey = groupbyValObj.groupByKey;
        } else {
          resp.errors.push(...groupbyValObj.errors);
          return false;
        }
        break;
      }
      case 'page': {
        if (!Number.isNaN(reqQuery.page)) {
          resp.pipelines.page = parseInt(reqQuery.page, 10);
        } else {
          resp.errors.push({ code: 400, message: 'Page key is not of type integer' });
          return false;
        }
        break;
      }
      case 'limit': {
        if (!Number.isNaN(reqQuery.limit)) {
          resp.pipelines.limit = parseInt(reqQuery.limit, 10);
        } else {
          resp.errors.push({ code: 400, message: 'Limit key is not of type integer' });
          return false;
        }
        break;
      }
      default: {
        const schemaCheckObj = schemaValidation([key], 'Schema Validation', schemaType);
        if (schemaCheckObj.valid) {
          const filterObj = {};
          filterObj[key] = reqQuery[key];
          possibleFilters.push(filterObj);
        } else {
          resp.errors.push(...schemaCheckObj.errors);
          return false;
        }
      }
    }
    return true;
  });
  if (resp.valid) {
    const afterQuerySetup = _afterStrQueryPipelineRules(
      resp.pipelines, possibleFilters, sortList, schemaType,
    );
    resp.pipelines = afterQuerySetup.pipelines;
    resp.valid = afterQuerySetup.valid;
    resp.errors.push(...afterQuerySetup.errors);
  }

  return resp;
};

/**
 * [ rbacPermissions ]
 * Update the filters from pipeline following
 * instructions from RBAC Object.
 * @param {String} SIGNUM the user request signum
 * @param {Object} RBAC the RBAC Object
 * @param {Object} PIPELINE the Pipeline object to be updated
 * @author Armando Dias [zdiaarm]
 */
const rbacPermissions = (SIGNUM, RBAC, PIPELINE) => {
  const rbac = RBAC || {};
  const pipeline = PIPELINE || {};
  if (!pipeline.filters) {
    pipeline.filters = [];
  }
  const isAdmin = rbac[SIGNUM].admin || '';
  let allowedAssetsIDs = [];
  if (rbac[SIGNUM] && rbac[SIGNUM].allowed && rbac[SIGNUM].allowed.assets) {
    allowedAssetsIDs = rbac[SIGNUM].allowed.assets;
  }
  if (!isAdmin) {
    pipeline.filters.push({ $and: [{ _id: { $in: allowedAssetsIDs } }] });
  }
};


/**
 * Microservice search
 * @param {object} req the request object: accepted params:
 * search, sort, groupby, any filterable schema objects which will accept
 * comma delimitated select ids
 * @returns {object} obj.data {obj} standard response object with docs containing
 * the db result for the search request
 * obj.limit {number} the query limit
 * obj.page {number} the page of the limit
 * obj.total {number} total assets
 * @author Cein, Michael
 */
const search = req => new Promise((resolve, reject) => {
  // Prune the microservice result if the header is 'on'
  const getAllAttributes = req.headers['x-prune-microservice'] !== 'on';
  let pipelineobj = {};
  const { signum } = req && req.user && req.user.docs
    ? req.user.docs[0] : { role: null, signum: null };

  if (signum === null) {
    const errorObject = {
      code: 500,
      message: 'User not identified',
      data: { error: 'User not found in request object', req: '<API REQ Object>', origin: 'search' },
    };
    reject(errorObject);
    return;
  }
  let adpModel;
  let assetType;

  const requestedAssetType = req.query.assetType ? req.query.assetType : 'microservice';
  const schemaType = (requestedAssetType === 'assembly') ? 'assembly' : 'microservice';
  if (req && req.query && typeof req.query === 'object') {
    if (requestedAssetType === 'assembly') {
      assetType = ['assembly'];
    } else if (requestedAssetType === 'microservice') {
      assetType = ['microservice'];
    } else if (requestedAssetType === 'all') {
      assetType = ['assembly', 'microservice'];
    } else {
      assetType = [];
    }
    adpModel = new global.adp.models.Adp(assetType);
  }
  if (req && req.query && typeof req.query === 'object') {
    const pipelineBuildObj = buildQueryPipelines(req.query, schemaType);
    pipelineobj = pipelineBuildObj.pipelines;
    if (!pipelineBuildObj.valid) {
      reject(pipelineBuildObj.errors[0]);
      return;
    }
  }

  rbacPermissions(signum, req.rbac, pipelineobj);


  adpModel.msSearch(
    pipelineobj.filters,
    pipelineobj.sortBeforeGrouping,
    pipelineobj.groupByKey,
    pipelineobj.sortAfterGrouping,
    pipelineobj.skip,
    pipelineobj.limit,
    true,
    getAllAttributes,
  )
    .then((searchResp) => {
      let allAssets = [];
      const queryResponse = searchResp;
      const searchData = searchResp;
      let total = 0;
      searchResp.docs.forEach((type) => {
        if (Array.isArray(type.microservices)) {
          allAssets = allAssets.concat(type.microservices);
        }
      });
      if (requestedAssetType === 'all' && queryResponse.docs.length > 1) {
        queryResponse.docs.pop();
        queryResponse.docs[0].microservices = allAssets;
        queryResponse.docs[0]._id = 'microservice';
        queryResponse.docs[0].groupHeader = null;
        queryResponse.docs[0].groupDescription = null;
        queryResponse.docs[0].groupType = false;
        queryResponse.docs[0].total = queryResponse.docs[0].microservices.length;
      }
      if (queryResponse.docs && queryResponse.docs.length) {
        if (pipelineobj.search) {
          const searchRepObj = inMemorySearch(
            queryResponse.docs, pipelineobj.search, pipelineobj.search.schemaSearchKeys,
          );
          if (searchRepObj.errors.length) {
            reject(searchRepObj.errors[0]);
            return;
          }
          searchData.docs = searchRepObj.result;
          total = searchRepObj.totalAssets;
        } else {
          queryResponse.docs.forEach((groupObj) => {
            total += (groupObj.total || 0);
          });
        }
      }

      const limit = pipelineobj.limit ? pipelineobj.limit : 999999999999;
      const page = (pipelineobj.page ? pipelineobj.page : 1);

      resolve({
        data: searchData,
        limit,
        page,
        total,
      });
    })
    .catch((searchError) => {
      const error = {
        code: 500,
        message: 'Asset Search model call failure',
        data: {
          error: searchError, pipelineobj, query: (req ? req.query : undefined), origin: 'search',
        },
      };

      adp.echoLog(error.message, error.data, error.code, packName);
      reject(error);
    });
});

module.exports = {
  search,
  rbacPermissions,
  buildQueryPipelines,
  validateSortGetQueryObj,
  validateGroupingUrlQueryStr,
  validateSearchQueryGetToken,
  getSearchableSchemaIndexes,
  validateFiltersGetQueryObj,
  inMemorySearch,
  schemaValidation,
  isOneOrMore,
};
