// ============================================================================================= //
/**
* [ global.adp.migration.marketplaceUpliftServiceCategoryReusability ]
* Temporary solution
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign                                                              */
/* eslint-disable camelcase */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  const packName = '...migration.marketplace...';
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const cacheChanges = () => new Promise((RES1, REJ1) => {
    global.adp.listOptions.get()
      .then(() => {
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
        const cache = global.adp.migration.memoryCache.marketplaceUpliftServiceCategoryReusability;
        if (cache !== undefined && cache !== null) {
          RES1();
        } else {
          const csvPath = `${global.adp.path}/migration/marketplaceUpliftServiceCategoryReusability.csv`;
          if (global.fs.existsSync(csvPath)) {
            const theFile = global.fs.readFileSync(csvPath, 'utf-8');
            const linesArray = theFile.split('\n');
            const valuesToCache = {};
            linesArray.forEach((LINE) => {
              const itemArray = LINE.split(',');
              const id = itemArray[0].trim();
              let scItem = itemArray[14];
              if (scItem !== null && scItem !== undefined) {
                scItem = scItem.trim();
              }
              let rlItem = itemArray[15];
              if (rlItem !== null && rlItem !== undefined) {
                rlItem = rlItem.trim();
              }
              const serviceCategory = scItem;
              const reusabilityLevel = rlItem;
              if (id.length > 10) {
                valuesToCache[id] = {};
                valuesToCache[id].reusability_level = reusabilityLevel;
                valuesToCache[id].service_category = serviceCategory;
                const normalize = global.adp.migration.dataNormalize(valuesToCache[id]);
                if (normalize !== false) {
                  valuesToCache[id] = normalize;
                  const rlIsNumber = typeof normalize.reusability_level === 'number';
                  const scIsNumber = typeof normalize.service_category === 'number';
                  if (!(rlIsNumber) || !(scIsNumber)) {
                    adp.echoLog(`Caching ID [${id}] RL [${rlItem} as ${normalize.reusability_level}] and SC [${scItem} as ${normalize.service_category}] `, null, 500, packName, true);
                  }
                } else {
                  const errorText = `Caching ID [${id}] failed for RL [${rlItem}] and SC [${scItem}]. Error on Migration List. Cannot normalize the values.`;
                  const obj = {
                    values: valuesToCache[id],
                  };
                  adp.echoLog(errorText, obj, 500, packName, true);
                }
              }
            });
            global.adp.migration.memoryCache
              .marketplaceUpliftServiceCategoryReusability = valuesToCache;
            RES1(valuesToCache);
          } else {
            const errorMSG = `File not found: ${csvPath}`;
            adp.echoLog('Error in [ global.fs.existsSync(csvPath) ] ', errorMSG, 500, packName, true);
            REJ1(errorMSG);
          }
        }
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      })
      .catch((ERROR) => {
        REJ1(ERROR);
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const doTheChanges = () => new Promise((RES2, REJ2) => {
    const cache = global.adp.migration.memoryCache.marketplaceUpliftServiceCategoryReusability;
    if (cache !== undefined) {
      const id = MS._id;
      const cacheItem = cache[id];
      if (cacheItem === undefined || cacheItem === null) {
        MS.reusability_level = 4; // "None" by Default
        MS.service_category = 5; // "Non-ADP Services"

        let errorText = 'Not found on Migration List:';
        errorText = `${errorText} [ ${id} ] - ${MS.name}`;
        errorText = `${errorText} Previous category value: ${MS.category}`;
        errorText = `${errorText} Previous alignment value: ${MS.alignment}`;
        errorText = `${errorText} Please, check values manually for "Reusability Level" and "Service Category"`;
        adp.echoLog('Error detected', errorText, 500, packName, true);
      } else {
        Object.keys(cacheItem).forEach((ITEMKEY) => {
          MS[ITEMKEY] = cacheItem[ITEMKEY];
        });
      }
      const tempOldCategory = MS.category;
      const tempOldAlignment = MS.alignment;
      delete MS._rev;
      let found_reusability_level_problem = false;
      let found_service_category_problem = false;
      if (typeof MS.reusability_level !== 'number') {
        found_reusability_level_problem = true;
      }
      if (typeof MS.service_category !== 'number') {
        found_service_category_problem = true;
      }
      if (found_reusability_level_problem || found_service_category_problem) {
        let errorText = 'Problems on Migration List:';
        errorText = `${errorText} Asset: [ ${id} ] - ${MS.name}`;
        errorText = `${errorText} Previous category value: ${tempOldCategory}`;
        errorText = `${errorText} Previous alignment value: ${tempOldAlignment}`;
        if (found_reusability_level_problem) {
          MS.reusability_level = 4; // "None" by Default
          errorText = `${errorText} Using '${MS.reusability_level}' as Reusability Level, changed to '4'`;
        }
        if (found_service_category_problem) {
          MS.service_category = 5; // "Non-ADP Services"
          errorText = `${errorText} Using '${MS.service_category}' as Service Category, changed to '5'`;
        }
        adp.echoLog('Error detected', errorText, 500, packName, true);
      }
      delete MS.category;
      delete MS.alignment;
      RES2(MS);
    } else {
      const errorMSG = 'ERROR: "global.adp.migration.memoryCache.marketplaceUpliftServiceCategoryReusability" can`t be undefined...';
      REJ2(errorMSG);
    }
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const check1 = (MS.reusability_level !== undefined) && (MS.reusability_level !== null);
  const check2 = (MS.service_category !== undefined) && (MS.service_category !== null);
  if (!check1 && !check2) {
    cacheChanges()
      .then(() => doTheChanges())
      .then((RESULT) => {
        RESOLVE(RESULT);
      })
      .catch((ERROR) => {
        adp.echoLog('Error in [ cacheChanges ]', ERROR, 500, packName, true);
      });
  } else {
    RESOLVE(true);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
