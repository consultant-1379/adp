// ============================================================================================= //
/**
* [global.adp.migration.generateIntegrationSecret]
* Generate the jwt secret for all existing services.
* @author John [xjohdol]
*/
// ============================================================================================= //
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = MS => new Promise((resolve) => {
  const asset = MS;
  if (typeof asset.inval_secret === 'undefined' || asset.inval_secret === null || asset.inval_secret === '') {
    asset.inval_secret = Math.random().toString(36).substring(3);
    resolve(asset);
  } else {
    resolve(true);
  }
});
