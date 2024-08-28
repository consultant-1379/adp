// ============================================================================================= //
/**
* [ global.adp.migration.reusabilityIsNoneIfServiceIsSpecific ]
* If "Service Category" is "ADP Application Specific Services" (id: 4) means
* "Reusability Level" should be "none" (id: 4).
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable no-param-reassign                                                              */
/* The mission of this method is rewrite the original object to update                           */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  if (MS.service_category === 4) {
    if (MS.reusability_level !== 4) {
      MS.reusability_level = 4;
      RESOLVE(MS);
      return;
    }
  }
  RESOLVE(true);
});
// ============================================================================================= //
