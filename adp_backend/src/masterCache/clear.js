/**
* Exported Method: [ global.adp.masterCache.clear ]
* Clears the cache. Could clear everything ( no parameters ) or target the clear process in
* an Object or Item from an Object.
* Automatically clears the Shortcut Object of the target, if exists.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/


// Module Name
const moduleName = 'global.adp.masterCache.clear';


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Private Method: [ checkParameters ]
* Synchronously check the parameters for the main function
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ITEM A String with the name of the Item inside of the Object.
* @param {Boolean} GC True if you want the Garbage Collector. Otherwise use False, Null or Undefined
* @return {Any} Returns null if everything is ok. Returns a string if there is an error.
* @author Armando Dias [zdiaarm]
*/
const checkParameters = (OBJ, SUBOBJ, ITEM, GC) => {
  const quickError = global.adp.quickTypeErrorMessage;
  if (OBJ !== null && OBJ !== undefined && typeof OBJ !== 'string') {
    return quickError('OBJ', 'string, null or undefined', OBJ, moduleName);
  }
  if (SUBOBJ !== null && SUBOBJ !== undefined && typeof SUBOBJ !== 'string') {
    return quickError('SUBOBJ', 'string, null or undefined', SUBOBJ, moduleName);
  }
  if (ITEM !== null && ITEM !== undefined && typeof ITEM !== 'string') {
    return quickError('ITEM', 'string, null or undefined', ITEM, moduleName);
  }
  if (GC !== null && GC !== undefined && typeof GC !== 'boolean') {
    return quickError('GC', 'boolean, null or undefined', GC, moduleName);
  }
  if ((OBJ === null || OBJ === undefined)
    && ((SUBOBJ !== null && SUBOBJ !== undefined)
    || (ITEM !== null && ITEM !== undefined))) {
    const errorMessage = 'OBJ cannot be null/undefined if SUBOBJ and/or ITEM are not null/undefined.';
    return errorMessage;
  }
  return null;
};


/**
* Private Method: [ garbageCollectorIfNecessary ]
* Function to call the Garbage Collector if necessary
* No parameters, "return" is used only to end process early when possible.
* @param {Boolean} GC True if you want the Garbage Collector. Otherwise use False, Null or Undefined
* @return {Boolean} Returns true if Garbage Collector was called or false if don't.
* @author Armando Dias [zdiaarm]
*/
const garbageCollectorIfNecessary = (GC) => {
  if (GC === false || GC === null || GC === undefined) {
    return false;
  }
  if (global.gc) {
    const timer = global.adp.masterCache;
    if (timer.gcMinimalTimer === undefined) {
      timer.gcMinimalTimer = 0;
    }
    if (timer.gcMinimalTimer < (new Date()).getTime()) {
      const echo = adp.echoLog;
      echo('<< Garbage Collector Request >>', null, 200, moduleName);
      const timeToWait = global.adp.masterCacheTimeOut.minimumGarbageCollectorCall * 1000;
      timer.gcMinimalTimer = (new Date()).getTime() + timeToWait;
      global.gc();
      return true;
    }
  }
  return false;
};


/**
* Private Method: [ clearIt ]
* Proceed to find the object in memory and clear it.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ITEM A String with the name of the Item inside of the Object.
* @return {Void} Returns is used only to end the process as soon as posible.
* @author Armando Dias [zdiaarm]
*/
const clearIt = (OBJ, SUBOBJ, ITEM) => {
  const { masterCache } = global.adp;
  if (OBJ === undefined || OBJ === null) {
    delete masterCache.cache;
    return;
  }
  let { cache } = masterCache;
  let target = OBJ;
  if (cache[target] === undefined) {
    return;
  }
  if (SUBOBJ !== null && SUBOBJ !== undefined) {
    if (cache[OBJ][SUBOBJ] === undefined) {
      return;
    }
    cache = cache[OBJ];
    target = SUBOBJ;
  }
  if (ITEM !== null && ITEM !== undefined) {
    const ITEM64 = `${Buffer.from(ITEM).toString('base64')}`;
    if (cache[target][ITEM64] === undefined) {
      const shortObject = cache[target];
      Object.keys(shortObject).forEach((KEY) => {
        if (shortObject[KEY].id === ITEM) {
          delete shortObject[KEY];
        }
      });
      return;
    }
    cache = cache[target];
    target = ITEM64;
  }
  delete cache[target];
};


/**
* Exported Method: [ global.adp.masterCache.clear ]
* Clears the cache. Could clear everything ( no parameters ) or target the clear process in
* an Object or Item from an Object.
* Automatically clears the Shortcut Object of the target, if exists.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ITEM A String with the name of the Item inside of the Object.
* @param {Boolean} GC True if you want the Garbage Collector. Otherwise use False, Null or Undefined
* @return {Boolean} Returns true if Garbage Collector was called or false if don't.
* @author Armando Dias [zdiaarm]
*/
module.exports = (OBJ, SUBOBJ, ITEM, GC) => {
  const thereIsAnError = checkParameters(OBJ, SUBOBJ, ITEM, GC);
  if (thereIsAnError !== null) {
    return thereIsAnError;
  }
  if (global.adp.masterCache.cache === undefined) {
    return false;
  }
  clearIt(OBJ, SUBOBJ, ITEM);
  if (typeof OBJ === 'string') {
    clearIt(`${OBJ}SHORTCUT`, SUBOBJ, ITEM);
  }
  return garbageCollectorIfNecessary(GC);
};
