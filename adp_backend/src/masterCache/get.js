/**
* Exported Method: [ global.adp.masterCache.get ]
* Request the cache value. If doesn't exist, returns a rejected empty promise.
* If exist, check possible shortcuts, if already is in progress, if is not
* expired. If everything is ok, returns the value of the cache and resolve the promise.
* In case of error, the rejected promise will contain a string with the error.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/


// Module Name
const moduleName = 'global.adp.masterCache.get';


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Private Method: [ checkParameters ]
* Synchronously check the parameters for the main function
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Boolean} RETURNTHECLASS should be true, if you want the class in the return.
* Could be null or undefined to get only the content.
* @return {String} Returns null if everything is ok. Returns a string if there is an error.
* @author Armando Dias [zdiaarm]
*/
const checkParameters = (OBJ, SUBOBJ, ID, RETURNTHECLASS) => {
  const quickError = global.adp.quickTypeErrorMessage;
  if (typeof OBJ !== 'string') {
    return quickError('OBJ', 'string', OBJ, moduleName);
  }
  if (SUBOBJ !== null && typeof SUBOBJ !== 'string') {
    return quickError('SUBOBJ', 'string or null', SUBOBJ, moduleName);
  }
  if (typeof ID !== 'string') {
    return quickError('ID', 'string', ID, moduleName);
  }
  if (RETURNTHECLASS !== null && RETURNTHECLASS !== undefined && typeof RETURNTHECLASS !== 'boolean') {
    return quickError('RETURNTHECLASS', 'boolean, null or undefined', RETURNTHECLASS, moduleName);
  }
  return null;
};


/**
* Private Method: [ searchForShortcutIfExists ]
* Check if there is a Shortcut in Cache Memory for
* the requested object. This is used for Microservices, where have Shortcuts
* using slugs while the main object uses the ids.
* The rule about SUBOBJ is still valid for Shortcuts in memory.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID64 A String with the base64 of the Item's name inside of the Object.
* @param {Reference} CURRENTCACHE Address for the current target level.
* @param {Reference} ORIGINALCACHE Address for the root of Cache Object in memory.
* @return {String} Returns null if everything is ok. Returns a string if there is an error.
* @author Armando Dias [zdiaarm]
*/
const searchForShortcutIfExists = (OBJ, SUBOBJ, ID64, CURRENTCACHE, ORIGINALCACHE) => {
  let shortCutObject = ORIGINALCACHE[`${OBJ}SHORTCUT`];
  if (shortCutObject === undefined) {
    return undefined;
  }
  if (SUBOBJ !== null) {
    if (shortCutObject[SUBOBJ] === undefined) {
      return undefined;
    }
    shortCutObject = shortCutObject[SUBOBJ];
  }
  if (shortCutObject[ID64] === undefined) {
    return undefined;
  }
  const IDfromShortcut = shortCutObject[ID64].id;
  if (CURRENTCACHE[IDfromShortcut] === undefined) {
    delete shortCutObject[ID64];
    return undefined;
  }
  return CURRENTCACHE[IDfromShortcut];
};


/**
* Exported Method: [ global.adp.masterCache.get ]
* Request the cache value. If doesn't exist, create a Object which one will receive the value and
* reject the promise. If exist, check possible shortcuts, if already is in progress, is not
* expired. If everything is ok, returns the value of the cache and resolve the promise.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Boolean} RETURNTHECLASS should be true, if you want the class in the return.
* Could be null or undefined to get only the content.
* @return {Any} Returns the value of the cache or reject the promise to indicate
* that there is no cache. Please, keep in mind: If REJECT() is empty, should trigger
* the process. If contains a string, means an ERROR happened.
* @author Armando Dias [zdiaarm]
*/
module.exports = (OBJ, SUBOBJ, ID, RETURNTHECLASS) => new Promise((RESOLVE, REJECT) => {
  const { masterCache } = global.adp;
  const thereIsAnError = checkParameters(OBJ, SUBOBJ, ID, RETURNTHECLASS);
  if (thereIsAnError !== null) {
    REJECT(thereIsAnError);
    return;
  }
  if (masterCache.cache === undefined) {
    masterCache.cache = {};
  }
  if (masterCache.cache[OBJ] === undefined || masterCache.cache[OBJ] === null) {
    masterCache.cache[OBJ] = {};
  }
  let cache = masterCache.cache[OBJ];
  if (SUBOBJ !== null && SUBOBJ !== undefined) {
    if (cache[SUBOBJ] !== null && cache[SUBOBJ] !== undefined) {
      cache = cache[SUBOBJ];
    } else {
      cache[SUBOBJ] = {};
    }
  }
  const ID64 = Buffer.from(`${ID}`).toString('base64');

  if (cache[ID64] !== undefined && cache[ID64] !== null) {
    cache = cache[ID64];
  } else {
    const cacheFromShortcut = searchForShortcutIfExists(
      OBJ,
      SUBOBJ,
      ID64,
      cache,
      masterCache.cache,
    );
    if (cacheFromShortcut !== undefined && cacheFromShortcut !== null) {
      cache = cacheFromShortcut;
    }
  }

  if (cache !== undefined && cache !== null) {
    let isInProgressStatus = false;
    if (cache.isInProgress !== undefined) {
      isInProgressStatus = cache.isInProgress();
    }
    let isExpiredStatus = true;
    if (cache.isExpired !== undefined) {
      isExpiredStatus = cache.isExpired();
    }
    if (isInProgressStatus) {
      const waitingPromise = cache.getWait();
      Promise.all([waitingPromise])
        .then(() => {
          if (RETURNTHECLASS === true) {
            RESOLVE(cache);
          } else {
            RESOLVE(cache.getData());
          }
        })
        .catch(() => {
          REJECT();
        });
    } else if (isExpiredStatus) {
      REJECT();
    } else if (RETURNTHECLASS === true) {
      RESOLVE(cache);
    } else {
      RESOLVE(cache.getData());
    }
  } else {
    cache[ID64] = new masterCache.CacheObjectClass(OBJ, ID64, 10000);
    REJECT();
  }
});
