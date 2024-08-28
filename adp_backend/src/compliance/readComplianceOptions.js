// ============================================================================================= //
/**
* [ global.adp.compliance.readComplianceOptions ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
const timer = new Date();
const packName = 'global.adp.compliance.readComplianceOptions';
let complianceOptionsSchema;
let answers = [];
let groups = [];
let settings = [];

/**
 * This method is used to check the object against schema.
 * In case of missing values, default value is added.
 * @param {object} ITEMOBJECT The object which needs to be validated against schema
 * @param {string} type The type of compliance option
 * @returns {object} schema validated object
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const checkSchema = (ITEMOBJECT, type) => {
  if (complianceOptionsSchema) {
    const item = ITEMOBJECT;
    let itemSchema;
    Object.keys(item).forEach((KEY) => {
      itemSchema = complianceOptionsSchema[type].properties[KEY];
      if (!itemSchema) {
        delete item[KEY];
        return item;
      }
      if (item[KEY] === undefined) {
        if (itemSchema && !itemSchema.requiredFromDB) {
          if (itemSchema.default !== undefined && itemSchema.default !== null) {
            item[KEY] = itemSchema.default;
          } else {
            adp.echoLog(`The field [ ${KEY} ] doesn't have default value!`, { ITEMOBJECT, type }, 500, packName);
          }
        } else {
          adp.echoLog(`The field [ ${KEY} ] should be provided by the database!`, { ITEMOBJECT, type }, 500, packName);
        }
      }
      return true;
    });
    return item;
  }
  return ITEMOBJECT;
};

/**
 * This function is used to make DB request based on requested parameters
 * @param {string} type of compliance data needs to be fetched
 * @param {stirng} idSelector Unique ID for the data
 * @returns {Promise}  with the requested data
 * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
 */
const getDbRequest = (type, idSelector) => new Promise((RES, REJ) => {
  const complianceModel = new adp.models.Complianceoption();
  const respItems = [];
  complianceModel.getByType(type)
    .then((ITEMS) => {
      let tempObj = {};
      ITEMS.docs.forEach((item) => {
        tempObj = {};
        tempObj = {
          id: item[idSelector],
          name: item.name,
          value: item.value,
          desc: item.desc,
          slug: item.slug,
          testID: item['test-id'],
          order: item.order,
          group: item.name,
          fields: [],
          default: item.default,
          commentRequired: item.commentRequired,
        };
        respItems.push(checkSchema(tempObj, type));
      });
      RES(respItems.sort(global.adp.dynamicSort('order')));
    })
    .catch((ERROR) => {
      adp.echoLog('Error calling [ complianceModel.getByType ]', ERROR, 500, packName, true);
      REJ(ERROR);
    });
});


/**
 * This function is used to make DB request based on requested parameters
 * @param {string} GROUPID Group ID
 * @returns {Promise}  with the requested data
 * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
 */
const getDbRequestByFieldAndGroupID = GROUPID => new Promise((RES, REJ) => {
  const complianceModel = new adp.models.Complianceoption();
  const respItems = [];
  complianceModel.getFieldByGroupID(GROUPID)
    .then((ITEMS) => {
      let tempObj = {};
      ITEMS.docs.forEach((item) => {
        tempObj = {};
        tempObj = {
          id: item['field-id'],
          name: item.name,
          value: item.value,
          desc: item.desc,
          slug: item.slug,
          testID: item['test-id'],
          order: item.order,
          group: item.name,
          fields: [],
          default: item.default,
          commentRequired: item.commentRequired,
        };
        respItems.push(checkSchema(tempObj, 'field'));
      });
      RES(respItems.sort(global.adp.dynamicSort('order')));
    })
    .catch((ERROR) => {
      adp.echoLog('Error calling [ complianceModel.getFieldByGroupID ]', ERROR, 500, packName, true);
      REJ(ERROR);
    });
});


/**
 * This function is used to fetch the compliance answer data
 * @returns {Promise} Resolves with the compliance options
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getComplianceAnswers = () => new Promise((RES, REJ) => {
  getDbRequest('answer', 'select-id')
    .then((answersResp) => {
      answers = answersResp;
      RES();
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ getComplianceAnswers ]', ERROR, 500, packName);
      REJ(ERROR);
    });
});

/**
 * This function is used to fetch the compliance settings data
 * @returns {Promise} Resolves with the compliance settings
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getComplianceSettings = () => new Promise((RES, REJ) => {
  getDbRequest('setting', '')
    .then((settingResp) => {
      settings = settingResp;
      RES();
    })
    .catch((ERROR) => {
      adp.echoLog('Error in [ getComplianceSettings ]', ERROR, 500, packName);
      REJ(ERROR);
    });
});
/**
 * This function is used to fetch the compliance options from database and
 * arranges in the appropriate format.
 * @returns {Promise} Resolves with the compliance options
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getComplainceOptionsFromDatabase = () => new Promise((RESOLVE, REJECT) => {
  answers = [];
  groups = [];
  settings = [];
  complianceOptionsSchema = global.adp.config.schema.complianceOptions;
  getDbRequest('group', 'group-id')
    .then((GROUPS) => {
      const promises = [];
      GROUPS.forEach((group) => {
        const obj = group;
        obj.fields = [];
        promises.push(new Promise((RES1, REJ1) => {
          getDbRequestByFieldAndGroupID(obj.id)
            .then((items) => {
              obj.fields = items;
              groups.push(obj);
              RES1(true);
            })
            .catch((ERROR) => {
              adp.echoLog('Error in [ getDbRequestByFieldAndGroupID ] from [ getComplainceOptionsFromDatabase ]', ERROR, 500, packName);
              REJ1(ERROR);
            });
        }));
      });
      promises.push(getComplianceAnswers());
      promises.push(getComplianceSettings());
      Promise.all(promises)
        .then(() => {
          const options = {
            groups,
            answers,
            settings,
          };
          const endTimer = (new Date()).getTime() - timer.getTime();
          adp.echoLog(`Returning Compliance Options from database in ${endTimer}ms!`, null, 200, packName);
          RESOLVE(JSON.stringify(options));
        })
        .catch((ERROR) => {
          adp.echoLog('Error on Promise.all:', ERROR, 500, packName, true);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      adp.echoLog('Error calling [ getDbRequest ] in [ getComplainceOptionsFromDatabase ]:', ERROR, 500, packName, true);
      REJECT(ERROR);
    });
});

/**
 * This function is used to fetch compliance options. If found in valid cache,
 * then cache will be returned else the options will be fetched from database
 * @returns {Promise} Resolves with the compliance options
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
const getComplianceOptions = () => new Promise((RESOLVE, REJECT) => {
  const cacheObject = 'COMPLIANCEOPTIONS';
  const cacheObjectID = 'CACHE';
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.complianceOptions * 1000;
  global.adp.masterCache.get(cacheObject, null, cacheObjectID)
    .then((CACHE) => {
      RESOLVE(CACHE);
    })
    .catch(() => {
      getComplainceOptionsFromDatabase()
        .then((RESULT) => {
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            RESULT,
            cacheHolderInMilliseconds,
          );
          RESOLVE(RESULT);
          global.adp.complianceOptions = {};
          global.adp.complianceOptions.cache = {};
          global.adp.complianceOptions.cache.options = RESULT;
        })
        .catch((ERROR) => {
          adp.echoLog('Error on getcomplianceOptionsFromDatabase:', ERROR, 500, packName);
          REJECT(ERROR);
        });
    });
});

module.exports = {
  getComplianceOptions,
};
