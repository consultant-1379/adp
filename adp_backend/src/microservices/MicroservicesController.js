const errorLog = require('../library/errorLog');
const updateAssetDocSettings = require('../microservice/updateAssetDocSettings');

/**
 * Microservices main controller
 * [ adp.microservices.MicroservicesController ]
 * @author Cein
 */
adp.docs.list.push(__filename);

class MicroservicesController {
  constructor() {
    this.packName = 'adp.microservices.MicroservicesController';
    this.normalisedCacheSetting = {
      cacheObject: 'ALLASSETSNORMALISED',
      durationSec: adp.masterCacheTimeOut.allAssetsNormalised,
    };
  }

  /**
   * Checks if the list of give ms ids are in the db/cache.
   * @param {array<string>} msIdList list of microservices
   * @param {boolean} [includeDeletedServices=false] if deleted services should be included
   * @returns {promise<boolean>} true if they are all in the db/cache
   * @author Cein
   */
  validateListOfMSIds(msIdList, includeDeletedServices = false) {
    return this.getById(msIdList, includeDeletedServices).then((assetsResp) => {
      if (assetsResp.length === msIdList.length) {
        return true;
      }

      const serviceNotFound = assetsResp.filter(assetObj => (!assetsResp.includes(assetObj._id)));
      const error = {
        message: 'One or more Microservice\'s id is not valid',
        code: 400,
        data: {
          serviceNotFound, msIdList, includeDeletedServices, origin: 'validateListOfMSIds',
        },
      };
      return Promise.reject(error);
    }).catch(error => Promise.reject(error));
  }

  /**
   * Fetches cached ms objects by a given list of ms ids
   * @param {array} msIdList list of strings of microservice ids
   * @retuns {promise<object>} obj.cachedMs {array} list of microservices objects from the cache
   * obj.msNotInCache {array} list of microservices ids that were not found in the cache
   * @author Cein
   */
  getNomalisedCacheByMsId(msIdList) {
    return new Promise((res, rej) => {
      const respObj = { cachedMs: [], msNotInCache: [] };

      const { error: valErr } = global.joi.array().min(1).label('Microservice Id array').items(
        global.joi.string().trim().min(1).label('Microservice Id')
          .required(),
      )
        .required()
        .validate(msIdList);

      if (!valErr) {
        const promiseArr = [];
        msIdList.forEach((msId) => {
          promiseArr.push(global.adp.masterCache.get(
            this.normalisedCacheSetting.cacheObject, null, msId,
          ).then((cachedResp) => {
            if (typeof cachedResp === 'object' && cachedResp !== null) {
              respObj.cachedMs.push(cachedResp);
            } else {
              respObj.msNotInCache.push(msId);
            }
          }).catch(() => {
            respObj.msNotInCache.push(msId);
          }));
        });

        Promise.all(promiseArr).then(() => res(respObj)).catch(errGetCache => respObj(errGetCache));
      } else {
        const error = { message: valErr.message, code: 400, data: { error: valErr, msIdList, origin: 'getNomalisedCacheByMsId' } };
        adp.echoLog(error.message, error.data, error.code, this.packName);
        rej(error);
      }
    });
  }

  /**
   * Adds a list of microservices to the ALLASSETSNORMALISED cache
   * @param {array<object>} msArr list of microservice objects to add to the Normalised cache
   * @return {promise<boolean>}  true if cache was successfully updated
   * @author Cein
   */
  addMsToNormalisedCache(msArr) {
    return new Promise((res, rej) => {
      const { error: valErr } = global.joi.array().min(1).label('Array of Microservices').items(
        global.joi.object({
          _id: global.joi.string().trim().label('Microservice Id').required(),
        }).label('Microservice').unknown().required(),
      )
        .required()
        .validate(msArr);

      if (valErr) {
        const error = { message: valErr.message, code: 400, data: { error: valErr, msArr, origin: 'addMsToCache' } };
        adp.echoLog(error.message, error.data, error.code, this.packName, true);
        rej(error);
      } else {
        const promiseArr = [];
        msArr.forEach(msObj => promiseArr.push(global.adp.masterCache.set(
          this.normalisedCacheSetting.cacheObject,
          null,
          msObj._id,
          msObj,
          this.normalisedCacheSetting.durationSec,
        )));

        Promise.all(promiseArr).then(() => res(true)).catch((errSettingCache) => {
          const error = { message: `Failure to set ${this.normalisedCacheSetting.cacheObject} Cache`, code: 500, data: { error: errSettingCache, msArr, origin: 'addMsToNormalisedCache' } };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          rej(error);
        });
      }
    });
  }

  /**
   * Fetch a list of normalised microservices by id.
   * @param {array} msIdList list of microservice ids strings
   * @param {boolean} [includeDeletedServices=false] include deleted microservices
   * @return {promise<array>} array of matched microservices
   * @author Cein
   */
  getById(msIdList, includeDeletedServices = false) {
    return new Promise((res, rej) => {
      const { error: msListErr } = global.joi.array().min(1).label('List of Microservice Ids').items(
        global.joi.string().trim().min(1).label('Microservice Id')
          .required(),
      )
        .required()
        .validate(msIdList);
      if (typeof msListErr === 'undefined') {
        this.getNomalisedCacheByMsId(msIdList).then((cacheCheckObj) => {
          const { cachedMs, msNotInCache } = cacheCheckObj;
          if (msNotInCache.length) {
            const adpModel = new adp.models.Adp();
            adpModel.getMsById(msNotInCache, includeDeletedServices).then((msResp) => {
              if (msResp.docs && msResp.docs.length) {
                this.addMsToNormalisedCache(msResp.docs)
                  .then(() => res([...cachedMs, ...msResp.docs]))
                  .catch(errCacheUpdate => rej(errCacheUpdate));
              } else {
                res(cachedMs);
              }
            }).catch((errFetchMs) => {
              const error = {
                message: 'Failure fetching microservices from model.',
                code: 500,
                data: {
                  error: errFetchMs, msNotInCache, msIdList, origin: 'getById',
                },
              };
              adp.echoLog(error.message, error.data, error.code, this.packName);
              rej(error);
            });
          } else {
            res(cachedMs);
          }
        }).catch((errorCacheCheck) => {
          const error = { message: `Error while trying to check the ${this.normalisedCacheSetting.cacheObject} Cache`, code: 500, data: { error: errorCacheCheck, msIdList, origin: 'getById' } };
          adp.echoLog(error.message, error.data, error.code, this.packName);
          rej(error);
        });
      } else {
        const error = { message: msListErr.message, code: 400, data: { error: msListErr, msIdList, origin: 'getById' } };
        rej(error);
      }
    });
  }

  /**
   * Fetch microservices by ms id while adding denormalised documentation
   * @param {string[]} microservicesIdList list of microservices ids fetch
   * @returns {Promise<Mircroservice[]>} list of denormalised microservices
   * @author Cein
   */
  async getDenormalisedDocumentsById(microservicesIdList) {
    const adpModel = new adp.models.Adp();
    try {
      const denormMsList = await Promise.all(
        await adpModel.getMsById(microservicesIdList, true).then(
          (msList) => {
            const { docs } = msList;
            return docs.map(msObj => updateAssetDocSettings(msObj));
          },
        ),
      );

      if (denormMsList.length === 0) {
        const msg = 'No microservices found by give id list.';
        return Promise.reject(errorLog(
          400,
          msg,
          { error: msg, microservicesIdList },
          '_fetchDenormMsById',
          this.packName,
        ));
      }
      return denormMsList;
    } catch (error) {
      return Promise.reject(errorLog(
        error && error.code ? error.code : 500,
        error && error.message ? error.message : 'Failure to retrieved denormalised microservices by given microservice id list',
        { error, microservicesIdList },
        '_fetchDenormMsById',
        this.packName,
      ));
    }
  }
}

module.exports = MicroservicesController;
