/**
* Exported Method: [ global.adp.masterCache.shortcut ]
* Creates a Shortcut in memory.
* Sometimes an Item is called by your database ID, sometimes by your slug. To avoid read
* huge loops when searching by slug, the [ global.adp.masterCache.shortcut ] should be called
* after [ global.adp.masterCache.set ] to generate a shortcut by slug where point to original
* Object/Item by database ID.
* Documentation: https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Backend+Cache+System
* @author Armando Dias [zdiaarm]
*/


// Module Name
const moduleName = 'global.adp.masterCache.shortcut';


// Necessary for Internal Documentation - https://localhost:9999/doc/
global.adp.docs.list.push(__filename);


/**
* Internal Method: [ checkParameters ]
* Synchronously check the parameters for the main function
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Any} DATA Data value to be cached. Cannot be null or undefined.
* @return {String} Returns null if everything is ok. Returns a string if there is an error.
* @author Armando Dias [zdiaarm]
*/
const checkParameters = (OBJ, SUBOBJ, ID, DATA) => {
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
  if (typeof DATA.slug !== 'string') {
    const errorMessage = 'There is no slug in the DATA object. Cannot create the Shortcut!';
    return errorMessage;
  }
  if (DATA.slug.trim().length === 0) {
    const errorMessage = 'Slug in the DATA object cannot be an empty string!';
    return errorMessage;
  }
  return null;
};


/**
* Exported Method: [ global.adp.masterCache.shortcut ]
* Creates a Shortcut in memory.
* @param {String} OBJ A String with the name of the Object.
* @param {String} SUBOBJ A String, usually NULL, with the name of the SubObject.
* @param {String} ID A String with the name of the Item inside of the Object.
* @param {Any} DATA Data value to be cached.
* @return {Boolean} Returns true if everything is fine or false if get an error.
* @author Armando Dias [zdiaarm]
*/
module.exports = (OBJ, SUBOBJ, ID, DATA) => {
  const thereIsAnError = checkParameters(OBJ, SUBOBJ, ID, DATA);
  if (thereIsAnError !== null) {
    return thereIsAnError;
  }
  const { masterCache } = global.adp;
  if (masterCache.cache === undefined) {
    masterCache.cache = {};
  }
  let { cache } = masterCache;
  const shortCutName = `${OBJ}SHORTCUT`;
  if (cache[shortCutName] === undefined) {
    cache[shortCutName] = {};
  }
  cache = cache[shortCutName];
  if (SUBOBJ !== null) {
    if (cache[SUBOBJ] === undefined) {
      cache[SUBOBJ] = {};
    }
    cache = cache[SUBOBJ];
  }
  const slug64 = `${Buffer.from(`${DATA.slug}`).toString('base64')}`;
  cache[slug64] = { obj: OBJ, id: ID, original: DATA.slug };
  return true;
};
