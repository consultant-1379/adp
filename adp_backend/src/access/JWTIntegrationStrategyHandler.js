/**
* [ global.adp.access.JWTIntegrationStrategyHandler ]
* Handler for JWTIntegrationStrategy Middleware.
* Runs every time a protected integration EndPoint is called.
*
* @params {obj} jwtPayload containing
* {str} msid the id of the microservice
* {str} inval_secret the validation string of the access_token
* @returns {obj} promise containing the fetched ms
* @author Cein [edaccei]
*/

global.adp.docs.list.push(__filename);

module.exports = async (jwtPayload, callBackFunction) => {
  const timer = (new Date()).getTime();
  const packName = 'global.adp.access.JWTIntegrationStrategyHandler';
  if (jwtPayload.msid && jwtPayload.inval_secret) {
    try {
      const requestFromDatabase = new adp.models.Adp();
      const fetchedMS = await requestFromDatabase.getMSByIdAndSecret(
        jwtPayload.msid,
        jwtPayload.inval_secret,
      );
      if (fetchedMS.docs && fetchedMS.docs.length > 0) {
        const targetMs = fetchedMS.docs[0];
        const systemUser = {
          signum: 'portalSystem',
          role: 'admin',
        };
        const permission = {
          user: systemUser,
          asset: targetMs,
        };
        return callBackFunction(null, permission);
      }

      adp.echoLog(`Invalid Token in ${(new Date()).getTime() - timer}ms`, null, 401, packName);
      return callBackFunction('Unauthorized');
    } catch (msFetchFail) {
      adp.echoLog(`Error on try/catch in ${(new Date()).getTime() - timer}ms`, msFetchFail, 500, packName, true);
      return callBackFunction('Unauthorized');
    }
  }
  adp.echoLog(`Invalid Token in ${(new Date()).getTime() - timer}ms`, null, 401, packName);
  return callBackFunction('Unauthorized');
};
