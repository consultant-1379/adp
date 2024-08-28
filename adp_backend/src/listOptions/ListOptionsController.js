/**
 * Listoptions main controller
 * [ adp.listOptions.ListOptionsController ]
 * @author Cein
 */
adp.docs.list.push(__filename);

class ListOptionsController extends adp.models.Listoption {
  constructor() {
    super();
    this.packName = 'adp.listOptions.ListOptionsController';
    this.listOptsNormalisedCacheSettings = {
      cacheObject: 'LISTOPTIONSNORMALISED',
      durationSec: adp.masterCacheTimeOut.listOptionsNormalised,
    };
  }

  /**
   * Validates if the list of normalised listoptions are in the listoptions db
   * @param {array<strings>} listOptsIds list of listoption ids
   * @returns {promise<boolean|object>} if true the ids match successfully
   * if returnData is true, an object will be returned:
   * obj.valid {boolean} if true the ids match successfully
   * obj.data {array} list of match listoptions items
   * @author Cein
   */
  validateIds(listOptsIds, returnData = false) {
    return this.getById(listOptsIds).then((respListOps) => {
      if (Array.isArray(respListOps) && respListOps.length === listOptsIds.length) {
        if (returnData) {
          return { valid: true, data: respListOps };
        }
        return true;
      }
      const error = { message: 'One or more Listoption\'s id is not valid', code: 400, data: { respListOps, listOptsIds, origin: 'validateIds' } };
      return Promise.reject(error);
    }).catch(errGetById => Promise.reject(errGetById));
  }

  /**
   * Sets a list of normalised listoption cache items
   * @param {array<object>} listoptionList list of normalised listoption objects
   * @returns {promise<boolean>} true if the cache insertion was successful
   * @author Cein
   */
  setNormalisedCache(listoptionList) {
    return new Promise((res, rej) => {
      const { error: valErr } = global.joi.array().min(1).label('ListOptions array').items(
        global.joi.object({
          _id: global.joi.string().trim().min(1).label('Listoption Id')
            .required(),
        }).unknown().required(),
      )
        .required()
        .validate(listoptionList);

      if (!valErr) {
        const promiseArr = [];
        listoptionList.forEach(listOptObj => promiseArr.push(global.adp.masterCache.set(
          this.listOptsNormalisedCacheSettings.cacheObject,
          null,
          listOptObj._id,
          listOptObj,
          this.listOptsNormalisedCacheSettings.durationSec,
        )));

        Promise.all(promiseArr).then(() => res(true)).catch((errOnCache) => {
          const error = { message: 'Failure setting normalised List Options cache', code: 500, data: { error: errOnCache, listoptionList, origin: 'setNormalisedCache' } };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          rej(error);
        });
      } else {
        const error = { message: valErr.message, code: 400, data: { error: valErr, listoptionList, origin: 'setNormalisedCache' } };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        rej(error);
      }
    });
  }

  /**
   * Fetches the normalised listoption objects by a given list of listoption ids
   * @param {array<string>} idArr list of list options ids
   * @returns {promise<object>} obj.cachedItems {array<object>} all items found in the cache
   * obj.notCachedItems {array<object>} all items that were not found in the cache
   * @author Cein
   */
  getNormalisedCacheById(idArr) {
    return new Promise((res, rej) => {
      const { error: valErr } = global.joi.array().min(1).label('ListOptions array').items(
        global.joi.string().trim().min(1).label('Listoption Id')
          .required(),
      )
        .required()
        .validate(idArr);

      const respObj = { cachedItems: [], notCachedItems: [] };

      if (!valErr) {
        const promiseArr = [];
        idArr.forEach((listOptId) => {
          promiseArr.push(
            global.adp.masterCache.get(
              this.listOptsNormalisedCacheSettings.cacheObject, null, listOptId,
            ).then((cachedResp) => {
              if (typeof cachedResp === 'object' && cachedResp !== null) {
                respObj.cachedItems.push(cachedResp);
              } else {
                respObj.notCachedItems.push(listOptId);
              }
            }).catch(() => {
              respObj.notCachedItems.push(listOptId);
            }),
          );
        });

        Promise.all(promiseArr).then(() => res(respObj)).catch(errCacheGet => rej(errCacheGet));
      } else {
        const error = { message: valErr.message, code: 400, data: { error: valErr, idArr, origin: 'getNormalisedCacheById' } };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        rej(error);
      }
    });
  }

  /**
   * get a list of normalised listoption by id
   * @param {array} idArr list of microservice ids objects
   * @returns {promise<array>} array of fetched listoptions
   * @author Cein
   */
  getById(idArr) {
    return new Promise((res, rej) => {
      this.getNormalisedCacheById(idArr).then((cacheObj) => {
        const listOptList = cacheObj.cachedItems;
        if (cacheObj.notCachedItems.length) {
          super.getById(cacheObj.notCachedItems).then((listOptsResp) => {
            if (listOptsResp.docs.length) {
              listOptList.push(...listOptsResp.docs);
              this.setNormalisedCache(listOptsResp.docs).catch(() => false);
            }
            res(listOptList);
          })
            .catch((errGetById) => {
              const error = { message: 'Listoptions fetch by id model failure.', code: 500, data: { error: errGetById, idArr, origin: 'getById' } };
              adp.echoLog(error.message, error.data, error.code, this.packName);
              rej(error);
            });
        } else {
          res(listOptList);
        }
      }).catch(errGetCache => rej(errGetCache));
    });
  }

  /**
   * fetches denormalised group to child items listoption data by one or more group id.
   * If no id is given all groups will be returned
   * @param {string[]} [idArr] list of listoption group ids, will index all if nothing is given
   * @return {Promise<object[]>} list of listoption groups denormalised with related items
   * @author Cein
   */
  async groupItemsByGroupId(idArr = []) {
    try {
      const respListops = await super.groupItemsByGroupId(idArr);
      if (respListops.length) {
        return respListops;
      }
      const err = {
        message: 'Listoption data returned empty',
        code: 500,
        data: { respListops, idArr, origin: 'index' },
      };
      adp.echoLog(err.message, err.data, err.code, this.packName);
      return Promise.reject(err);
    } catch (error) {
      const err = {
        message: 'Failure to fetch denormalised listoptions data',
        code: 500,
        data: { error, idArr, origin: 'index' },
      };
      adp.echoLog(err.message, err.data, err.code, this.packName);
      return Promise.reject(err);
    }
  }
}

module.exports = ListOptionsController;
