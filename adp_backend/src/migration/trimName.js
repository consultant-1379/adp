// ============================================================================================= //
/**
* [ global.adp.migration.trimName ]
* Just trim the name of the Microservice
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign                                                              */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  if (MS.name === MS.name.trim()) {
    // Everything is right, no changes...
    RESOLVE(true);
  }
  MS.name = MS.name.trim();
  // Something is different, should update...
  RESOLVE(MS);
});
// ============================================================================================= //
