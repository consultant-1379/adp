// ============================================================================================= //
/**
* [ global.adp.access.JWTStrategyHandler ]
* Handler for JWTStrategy Middleware. Runs every time a protected EndPoint is called.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (jwtPayload, callBackFunction) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.access.JWTStrategyHandler';
  const userName = jwtPayload.id.toLowerCase();

  return adp.user.thisUserShouldBeInDatabase(userName)
    .then((USER) => {
      callBackFunction(null, USER);
    })
    .catch((ERROR) => {
      const errorText = 'Caught an error in [ adp.user.get ]';
      const errorObj = {
        signum: userName,
        timer: (new Date()).getTime() - timer,
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName);
      return callBackFunction(ERROR);
    });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
};
// ============================================================================================= //
