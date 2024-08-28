// ============================================================================================= //
/**
* [ global.adp.endpoints.microserviceAnalytics.get ]
* Returns analytical details of one <b>microservice</b> following the ms slug.
* @param {String} slug of the MicroService.
* Example: <b>microserviceAnalytics/alarm-handler</b>
* @return {object} 200  - Shows requested Microservice Analytical details
* @return 404 - Microservice not found
* @return 500 - Internal Server Error
* @route GET /microserviceAnalytics
* @author Omkar Sadegaonkar [esdgmkar]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - The microService slug must be a valid string.');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }

  const { msSlug } = REQ.params;
  if (typeof msSlug !== 'string' || msSlug.trim() === '') {
    return badRequest();
  }

  const cacheObject = 'MSANALYTICS';
  const cacheObjectID = `${msSlug}`;
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.msAnalytics * 1000;
  return global.adp.masterCache.get(cacheObject, null, cacheObjectID)
    .then((CACHE) => {
      CACHE.setTime(new Date() - timer);
      res.end(CACHE.getAnswer());
    })
    .catch(() => {
      global.adp.microserviceAnalytics.get(msSlug)
        .then((microServiceData) => {
          answer.setCode(200);
          res.statusCode = 200;
          answer.setMessage('200 Ok');
          answer.setData(microServiceData);
          answer.setCache('Not from Cache');
          answer.setTime(new Date() - timer);
          res.end(answer.getAnswer());
          answer.setCache('From Cache');
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            answer,
            cacheHolderInMilliseconds,
          );
          return true;
        }).catch((error) => {
          answer.setCode(error.code);
          res.statusCode = error.code;
          answer.setMessage(`Error: ${error.message}`);
          answer.setCache('Not from Cache');
          answer.setTime(new Date() - timer);
          res.end(answer.getAnswer());
          answer.setCache('From Cache');
          global.adp.masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            answer,
            cacheHolderInMilliseconds,
          );
          return false;
        });
    });
};
// ============================================================================================= //
