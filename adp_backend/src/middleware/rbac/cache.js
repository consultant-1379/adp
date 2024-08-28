/**
* [ adp.middleware.rbac.cache ]
* Middleware for caching the permission ids for a user
*
* @author Michael Coughlan [zmiccou]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES, NEXT) => {
  const packName = 'adp.middleware.rbac.cache';
  const res = adp.setHeaders(RES);
  const timer = (new Date()).getTime();

  // Retrieve the user signum
  const userRequestSignum = REQ
    && REQ.user
    && REQ.user.docs
    ? REQ.user.docs[0].signum
    : null;

  if (!userRequestSignum) {
    const errorCode = 500;
    const errorMessage = 'Error received on main function as the user is not defined.';
    const errorObject = {
      error: 'The signum of userRequest is undefined/null and the request cannot proceed.',
    };
    const errorOrigin = 'main';

    errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);

    const answer = new adp.Answers();
    answer.setCode(errorCode);
    answer.setCache('Not from Cache');
    answer.setMessage(`${errorCode} - Error occurred as the user is not defined`);
    answer.setTime((new Date()).getTime() - timer);
    res.statusCode = answer.getCode();
    const resAnswer = answer.getAnswer();
    RES.end(resAnswer);

    return;
  }

  // Prepare the request object and add the user's signum
  const cacheRequest = REQ;
  cacheRequest.userSignum = userRequestSignum;

  const cacheObject = 'RBAC_PERMISSION_IDS';
  const cacheObjectId = userRequestSignum;
  const cacheTimeout = global.adp.masterCacheTimeOut.rbacPermissionIds * 1000;

  global.adp.masterCache.get(cacheObject, null, cacheObjectId)
    .then((cachedRbac) => {
      // Add RBAC information to the request for the next middleware
      cacheRequest.rbac = cachedRbac;
      NEXT();
    })
    .catch(() => {
      // Run the RBAC middleware to add the RBAC data to the request
      const thisNext = () => {
        global.adp.masterCache.set(
          cacheObject,
          null,
          cacheObjectId,
          cacheRequest.rbac,
          cacheTimeout,
        );
        NEXT();
      };
      adp.middleware.rbac(cacheRequest, res, thisNext, true);
    });
};
