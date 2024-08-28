// ============================================================================================= //
/**
* [ global.adp.listOptions.get ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise((MAINRESOLVE, MAINREJECT) => {
  const listoptionModel = new adp.models.Listoption();
  const timer = new Date();
  const packName = 'global.adp.listOptions.get';
  const getListOptionsFromDatabase = () => new Promise((RESOLVE, REJECT) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    let listOptionsSchema;
    if (global.adp.config !== undefined
      && global.adp.config !== null) {
      if (global.adp.config.schema !== undefined
        && global.adp.config.schema !== null) {
        if (global.adp.config.schema.listOptions !== undefined
          && global.adp.config.schema.listOptions !== null) {
          listOptionsSchema = global.adp.config.schema.listOptions.properties;
        }
      }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const checkSchema = (ITEMOBJECT) => {
      if (listOptionsSchema !== undefined && listOptionsSchema !== null) {
        const item = ITEMOBJECT;
        Object.keys(item).forEach((KEY) => {
          if (item[KEY] === undefined) {
            if (listOptionsSchema[KEY] !== undefined) {
              if (!listOptionsSchema[KEY].requiredFromDB) {
                if (listOptionsSchema[KEY].default !== undefined
                  && listOptionsSchema[KEY].default !== null) {
                  item[KEY] = listOptionsSchema[KEY].default;
                } else {
                  adp.echoLog(`The field [ ${KEY} ] doesn't have default value!`, null, 500, packName);
                }
              } else {
                adp.echoLog(`The field [ ${KEY} ] should be provided by the database!`, null, 500, packName);
              }
            }
          }
        });
        return item;
      }
      return ITEMOBJECT;
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    let options = [];
    listoptionModel.indexGroups()
      .then((GROUPS) => {
        const promises = [];
        GROUPS.docs.forEach((group) => {
          const obj = {
            id: group['group-id'],
            group: group.group,
            slug: group.slug,
            testID: group['test-id'],
            items: [],
            order: group.order,
            config: group.config,
            showAsFilter: group['show-as-filter'],
          };
          promises.push(new Promise((RES1, REJ1) => {
            listoptionModel.getItemsForGroup(obj.id)
              .then((ITEMS) => {
                ITEMS.docs.forEach((item) => {
                  const itemOBJ = {
                    id: item['select-id'],
                    documentationCategories: item['documentation-categories'],
                    name: item.name,
                    code: item.code,
                    desc: item.desc,
                    color: item.color,
                    testID: item['test-id'],
                    acceptancePercentage: item.acceptancePercentage,
                    iconFileName: item.iconFileName,
                    order: item.order,
                    adminOnly: item.adminOnly,
                    slug: item.slug,
                    default: item.default,
                    showAsDropdown: item.showAsDropdown,
                  };
                  obj.items.push(checkSchema(itemOBJ));
                });
                obj.items = obj.items.sort(global.adp.dynamicSort('order'));
                options.push(obj);
                RES1(true);
              })
              .catch((ERROR) => {
                adp.echoLog('adp.models.Listoption', ERROR, 500, packName, true);
                REJ1(ERROR);
              });
          }));
        });
        Promise.all(promises)
          .then(() => {
            options = options.sort(global.adp.dynamicSort('order'));
            global.adp.listOptions.cache.date = new Date();
            global.adp.listOptions.cache.options = JSON.stringify(options);
            const endTimer = (new Date()).getTime() - timer.getTime();
            adp.echoLog(`Returning List Options from database in ${endTimer}ms`, null, 200, packName);
            RESOLVE(global.adp.listOptions.cache.options);
          })
          .catch((ERROR) => {
            adp.echoLog('Error on [ Promise.all ]', { error: ERROR }, 500, packName, true);
            REJECT(ERROR);
          });
      })
      .catch((ERROR) => {
        const errorText = 'Error calling [ adp.models.Listoption ]';
        const errorOBJ = {
          database: 'dataBaseListOption',
          error: ERROR,
        };
        adp.echoLog(errorText, errorOBJ, 500, packName, true);
        REJECT(ERROR);
      });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  if (global.adp.listOptions.cache === undefined || global.adp.listOptions.cache === null) {
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = null;
    global.adp.listOptions.cache.date = null;
  }
  let requestFromDatabase = false;
  if (global.adp.listOptions.cache.date !== null) {
    const now = new Date();
    const diff = (now.getTime() - global.adp.listOptions.cache.date.getTime());
    if (diff < (global.adp.cache.timeInSecondsForDatabase * 1000)) {
      MAINRESOLVE(global.adp.listOptions.cache.options);
    } else {
      requestFromDatabase = true;
    }
  } else {
    requestFromDatabase = true;
  }
  if (requestFromDatabase) {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const cacheObject = 'LISTOPTIONS';
    const cacheObjectID = 'CACHE';
    const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.listOptions * 1000;
    global.adp.masterCache.get(cacheObject, null, cacheObjectID)
      .then((CACHE) => {
        global.adp.listOptions.cache.options = CACHE;
        MAINRESOLVE(global.adp.listOptions.cache.options);
      })
      .catch(() => {
        getListOptionsFromDatabase()
          .then((RESULT) => {
            global.adp.listOptions.cache.options = RESULT;
            global.adp.masterCache.set(
              cacheObject,
              null,
              cacheObjectID,
              RESULT,
              cacheHolderInMilliseconds,
            );
            global.adp.listOptions.cache.date = new Date();
            MAINRESOLVE(global.adp.listOptions.cache.options);
          })
          .catch((ERROR) => {
            adp.echoLog('Error on [ getListOptionsFromDatabase ]', ERROR, 500, packName);
            MAINREJECT(ERROR);
          });
      });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  }
});
// ============================================================================================= //
