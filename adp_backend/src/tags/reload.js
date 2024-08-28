// ============================================================================================= //
/**
* [ adp.tags.reload ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
adp.docs.list.push(__filename);
// =========================================================================================== //


// =========================================================================================== //
const packName = 'adp.tags.reload';
// =========================================================================================== //


// =========================================================================================== //
const reloadNow = () => new Promise((RESOLVE, REJECT) => {
  const timerStart = new Date();
  const tagModel = new adp.models.Tag();
  tagModel.indexGroups()
    .then((RES) => {
      const groupTempArray = [];
      RES.docs.forEach((item) => {
        const group = {
          group: item._id,
          name: item.name,
          tags: [],
        };
        groupTempArray.push(group);
      });
      adp.tags.groups = groupTempArray;

      tagModel.indexTags()
        .then((RES1) => {
          const tagTempArray = [];

          RES1.docs.forEach((item) => {
            const obj = {
              id: item._id,
              group: item.group,
              tag: item.tag,
              order: item.order,
            };
            tagTempArray.push(obj);
            adp.tags.groups.forEach((g) => {
              if (g.group === item.group) {
                g.tags.push(obj);
              }
            });
          });

          adp.tags.groups.forEach((g) => {
            const group = g;
            group.tags = group.tags.sort(adp.dynamicSort('order', 'tag'));
          });

          if (Array.isArray(tagTempArray)) {
            if (tagTempArray.length > 0) {
              adp.tags.items = tagTempArray;
              adp.tags.itemsTimeStamp = (new Date()).getTime();
            } else if (!Array.isArray(adp.tags.items)) {
              adp.tags.items = [];
            }
          }

          const timerEnd = new Date();
          const getMemorySize = adp.getSizeInMemory(adp.tags.groups, false)
            + adp.getSizeInMemory(adp.tags.items, false);
          const size = adp.friendlyBytes(getMemorySize);
          adp.echoLog(`Groups and Tags Cache ( ${size} ) updated in ${timerEnd - timerStart}ms!`, null, 200, packName);
          adp.tags.updated = new Date();
          RESOLVE(adp.tags.items);
        })
        .catch((ERROR) => {
          const errorText = 'Error at [ tagModel.indexTags ] in [ reloadNow ]';
          const errorObj = {
            error: ERROR,
          };
          adp.echoLog(errorText, errorObj, 500, packName, false);
          REJECT(ERROR);
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error at [ tagModel.indexGroups ] in [ reloadNow ]';
      const errorObj = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, false);
      REJECT(ERROR);
    });
});
// ============================================================================================= //


// ============================================================================================= //
module.exports = FORCEREFRESH => new Promise((RESOLVE, REJECT) => {
  // ------------------------------------------------------------------------------------------- //
  const cacheObject = 'TAGS';
  const cacheObjectID = 'CACHE';
  if (FORCEREFRESH === true) {
    reloadNow()
      .then((RESULT) => {
        adp.tags.items = RESULT;
        const cacheHolderInMilliseconds = adp.masterCacheTimeOut.tagsReload * 1000;
        adp.masterCache.set(cacheObject, null, cacheObjectID, RESULT, cacheHolderInMilliseconds);
        RESOLVE(true);
      })
      .catch((ERROR) => {
        REJECT(ERROR);
      });
  }

  let retrieveFromDatabase = false;
  const isInvalid = !Array.isArray(adp.tags.items);
  if (isInvalid) {
    retrieveFromDatabase = true;
  }
  if (typeof adp.tags.itemsTimeStamp === 'number') {
    const cacheExpired = ((new Date()).getTime() - adp.tags.itemsTimeStamp) > (1000 * 5);
    if (cacheExpired) {
      retrieveFromDatabase = true;
    }
  } else {
    retrieveFromDatabase = true;
  }

  if (retrieveFromDatabase) {
    const cacheHolderInMilliseconds = adp.masterCacheTimeOut.tagsReload * 1000;
    adp.masterCache.get(cacheObject, null, cacheObjectID)
      .then((CACHE) => {
        adp.tags.items = CACHE;
        RESOLVE();
      })
      .catch(() => {
        reloadNow()
          .then((RESULT) => {
            adp.tags.items = RESULT;
            adp.masterCache.set(
              cacheObject,
              null,
              cacheObjectID,
              RESULT,
              cacheHolderInMilliseconds,
            );
            RESOLVE(true);
          })
          .catch((ERROR) => {
            REJECT(ERROR);
          });
      });
  } else {
    RESOLVE(true);
  }
});
// ============================================================================================= //
