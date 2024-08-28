// ============================================================================================= //
/**
* [ global.adp.endpoints.microservices.getByOwner ]
* Without parameters, returns all <b>microservices</b> where the logged user is Owner.
* @return 200 - Shows Microservices by Owner.
* @return 500 - Internal Server Error.
* @group Microservices in Marketplace
* @route GET /microservices-by-owner
* @author Armando Schiavon Dias [escharm]
*/
/* eslint-disable prefer-destructuring */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
 * @swagger
 * /microservices-by-owner:
 *    post:
 *      description: Returns all the Assets which are shown on Services Admin page if available.
 *      responses:
 *        '200':
 *          description: Ok. Successfully displayed the version from package.json.
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Microservices By Owner
 */
// ============================================================================================= //
module.exports = (REQ, RES) => {
  // ------------------------------------------------------------------------------------------- //
  const timer = new Date().getTime();
  const packName = 'global.adp.endpoints.microservices.getByOwner';
  const { assetType } = REQ && REQ.body && REQ.body ? REQ.body : 'microservice';
  const { signum } = REQ && REQ.user && REQ.user.docs
    ? REQ.user.docs[0] : { role: null, signum: null };
  let user = null;
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');
  // ------------------------------------------------------------------------------------------- //
  const badRequest = () => {
    const answer = new global.adp.Answers();
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Logged User Object not found');
    res.statusCode = 400;
    res.end(answer);
    return false;
  };
  if (REQ.user === null || REQ.user === undefined) {
    badRequest();
    return false;
  }
  if (REQ.user.docs === null || REQ.user.docs === undefined) {
    badRequest();
    return false;
  }
  // ------------------------------------------------------------------------------------------- //
  user = REQ.user.docs[0];
  // ------------------------------------------------------------------------------------------- //
  const cacheObject = 'MSGETBYONWER';
  const cacheObjectID = `${user.signum.trim().toLowerCase()}.${user.role}`;
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.msListByOwner * 1000;
  return global.adp.masterCache.get(cacheObject, signum, cacheObjectID)
    .then((CACHE) => {
      res.statusCode = CACHE.getCode();
      const endTimer = (new Date()).getTime() - timer;
      CACHE.setTime(endTimer);
      res.end(CACHE.getAnswer());
      adp.echoLog(`Answer from [ adp.microservices.getByOwner ] in ${endTimer}ms - from cache`, null, 200, packName);
    })
    .catch(async () => {
      global.adp.microservices.getByOwner(user.signum.trim().toLowerCase(), user.role, assetType, REQ)
        .then((answerToCache) => {
          res.statusCode = answerToCache.getCode();
          answerToCache.setCache('Not from Cache');
          let endTimer = (new Date()).getTime() - timer;
          answerToCache.setTime(endTimer);
          res.end(answerToCache.getAnswer());
          answerToCache.setCache('From Cache');
          global.adp.masterCache.set(
            cacheObject,
            signum,
            cacheObjectID,
            answerToCache,
            cacheHolderInMilliseconds,
          );
          endTimer = (new Date()).getTime() - timer;
          adp.echoLog(`Answer from [ adp.microservices.getByOwner ] in ${endTimer}ms - not from cache`, null, 200, packName);
        });
    });
  // ------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
