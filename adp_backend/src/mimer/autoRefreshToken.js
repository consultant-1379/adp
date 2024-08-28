// ============================================================================================= //
/**
* [ adp.mimer.autoRefreshToken ]
* To refresh token after being called by a endpoint.
* @return {Promise} Resolve if successful, reject if fails.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
module.exports = () => {
  const mimerControl = new adp.mimer.MimerControl();
  return mimerControl.autoRefreshToken();
};
