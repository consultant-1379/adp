// ============================================================================================= //
/**
* [ global.adp.migration.marketplaceUpliftDomain ]
* This migration script is used for migrating services domain field.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign                                                              */
/* eslint-disable camelcase */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((RESOLVE) => {
  let foundChange = false;
  if (MS.service_category === 1 || MS.service_category === 2) {
    MS.domain = 1;
    foundChange = true;
  } else if ((MS.service_category === 3 || MS.service_category === 4 || MS.service_category === 5)
   && (MS.domain === 1)) {
    MS.domain = 7;
    foundChange = true;
  }
  if (!foundChange) {
    RESOLVE(true);
  }
  RESOLVE(MS);
});
// ============================================================================================= //
