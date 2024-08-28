// ============================================================================================= //
/**
* [ global.adp.permission.checkFieldPermission ]
* Return if the user is or not an Admin on Field Based.
* @param {Object} FIELDID The id of the field ( From the endpoint "/listoption" ).
* @param {Object} OPTIONID The id of the option ( From the endpoint "/listoption" ).
* @return This functions is a <b>Promise</b>.
* Returns in the <b>Then</b> block what this function found.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (FIELDID, OPTIONID) => new Promise((RESOLVE, REJECT) => {
  const packName = 'global.adp.permission.checkFieldPermission';
  const cache = global.adp.permission.checkFieldPermissionCache;
  if (cache !== undefined && cache !== null) {
    if (cache[FIELDID] !== undefined && cache[FIELDID] !== null) {
      if (cache[FIELDID][OPTIONID] !== undefined && cache[FIELDID][OPTIONID] !== null) {
        RESOLVE(cache[FIELDID][OPTIONID].fieldAdministrators);
      } else {
        RESOLVE(); // No Rules for this Value Field
      }
    } else {
      RESOLVE(); // No Rules for this Field
    }
  } else {
    const errorText = 'ERROR :: You should run [ adp.permission.checkFieldPermissionCacheIt ] before this function!';
    adp.echoLog(errorText, null, 500, packName, true);
    REJECT(errorText);
  }
});
// ============================================================================================= //
