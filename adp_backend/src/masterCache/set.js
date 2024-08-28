/**
* Exported Method: [ global.adp.masterCache.set ]
* Set an value on cache for reuse while valid.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/


// Module Name
const moduleName = 'global.adp.masterCache.set';


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Private Method: [ checkParameters ]
* Synchronously check the parameters for the main function
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Any} DATA Data value to be cached. Cannot be null or undefined.
* @param {Number} SERVERSTATUS Optional, a number with the server status (Useful for endpoints).
* @param {String} CONTENTTYPE Optional, the content-type of the result (Useful for endpoints).
* @return {String} Returns null if everything is ok. Returns a string if there is an error.
* @author Armando Dias [zdiaarm]
*/
const checkParameters = (OBJ, SUBOBJ, ID, DATA, SERVERSTATUS, CONTENTTYPE) => {
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
  if (DATA === undefined || DATA === null) {
    return quickError('DATA', 'any', DATA, moduleName);
  }
  if (typeof SERVERSTATUS !== 'number' && SERVERSTATUS !== null && SERVERSTATUS !== undefined) {
    return quickError('SERVERSTATUS', 'number, null or undefined', SERVERSTATUS, moduleName);
  }
  if (typeof CONTENTTYPE !== 'string' && CONTENTTYPE !== null && CONTENTTYPE !== undefined) {
    return quickError('CONTENTTYPE', 'string, null or undefined', CONTENTTYPE, moduleName);
  }
  return null;
};


/**
* Exported Method: [ global.adp.masterCache.set ]
* If the use of [ global.adp.masterCache.get ] reject the promise, the code should go after the
* result. After this, [ global.adp.masterCache.set ] should be called, indicating Object, Item
* and the value to be cached.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Any} DATA Data value to be cached. Cannot be null or undefined.
* @param {Number} MS Number in milliseconds to hold this value in cache.
* @param {Number} SERVERSTATUS Optional, a number with the server status (Useful for endpoints).
* @param {String} CONTENTTYPE Optional, the content-type of the result (Useful for endpoints).
* @return {Boolean} Returns true if everything is fine or false if get an error.
* @author Armando Dias [zdiaarm]
*/
module.exports = (OBJ, SUBOBJ, ID, DATA, MS = 1000, SERVERSTATUS, CONTENTTYPE) => {
  const thereIsAnError = checkParameters(OBJ, SUBOBJ, ID, DATA, SERVERSTATUS, CONTENTTYPE);
  if (thereIsAnError !== null) {
    return thereIsAnError;
  }
  const { masterCache } = global.adp;
  if (masterCache.cache === undefined) {
    masterCache.cache = {};
  }
  let { cache } = masterCache;
  if (cache[OBJ] === undefined) {
    cache[OBJ] = {};
  }
  cache = cache[OBJ];
  if (SUBOBJ !== null && SUBOBJ !== undefined) {
    if (cache[SUBOBJ] === undefined) {
      cache[SUBOBJ] = {};
    }
    cache = cache[SUBOBJ];
  }
  const IDb64 = Buffer.from(`${ID}`).toString('base64');
  cache[IDb64] = new masterCache.CacheObjectClass(OBJ, IDb64, MS);
  cache = cache[IDb64];
  cache.setData(DATA);
  if (typeof SERVERSTATUS === 'number') {
    cache.setServerStatus(SERVERSTATUS);
  }
  if (typeof CONTENTTYPE === 'string') {
    cache.setContentType(CONTENTTYPE);
  }
  if (SUBOBJ === null) {
    return true;
  }
  return true;
};
