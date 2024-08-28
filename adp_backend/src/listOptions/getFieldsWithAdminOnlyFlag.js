// ============================================================================================= //
/**
* [ global.adp.listoptions.getFieldsWithAdminOnlyFlag ]
* Retrieve a list of fields from listoptions which have adminOnly flag
* @return {Array} Returns a fields with adminOnly flag
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = () => new Promise(async (RESOLVE) => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  const cacheObject = 'LISTOPTIONS';
  const cacheObjectID = 'CACHEADMINONLY';
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.listOptionsAdminOnly * 1000;
  global.adp.masterCache.get(cacheObject, null, cacheObjectID)
    .then((CACHE) => {
      RESOLVE(CACHE);
    })
    .catch(() => {
      global.adp.listOptions.get()
        .then((RESULT) => {
          const listOptionArray = JSON.parse(RESULT);
          const response = [];
          listOptionArray.forEach((listOption) => {
            if (listOption.items && listOption.items.length > 0) {
              listOption.items.forEach((item) => {
                let tempObject;
                if (item.adminOnly) {
                  tempObject = {
                    fieldName: listOption.slug,
                    item: item.id,
                    itemName: item.name,
                  };
                  response.push(tempObject);
                }
              });
            }
          });
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            response,
            cacheHolderInMilliseconds,
          );
          RESOLVE(response);
        });
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
