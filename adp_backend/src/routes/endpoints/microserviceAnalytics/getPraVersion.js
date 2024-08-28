// ============================================================================================= //
/**
* [ global.adp.endpoints.microserviceAnalytics.getPra ]
* Returns analytical details of one <b>microservice</b> following the Helm Chart Name.
* @param {String} inline MicroService Slug.
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/**
 * @swagger
 * /getPraVersion/{MicroserviceSlug}:
 *    get:
 *      description: Returns analytical details of one <b>microservice</b>
 *                   for the given microservice slug.
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Microservice
 *    parameters:
 *      - name: MicroserviceSlug
 *        in: path
 *        description: Enter Microservice Slug
 *        required: true
 *        schema:
 *          type: string
 *          format: string
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
    answer.setMessage('400 Bad Request - MicroService Slug is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.msSlug === null || REQ.params.msSlug === undefined) {
    return badRequest();
  }
  const microserviceSlug = REQ.params.msSlug;
  const cacheObject = 'GETPRAVERSION';
  const cacheObjectID = `${microserviceSlug}`;
  const cacheHolderInMilliseconds = global.adp.masterCacheTimeOut.PRAVersion * 1000;
  return global.adp.masterCache.get(cacheObject, null, cacheObjectID)
    .then((CACHE) => {
      CACHE.setTime(new Date() - timer);
      res.end(CACHE.getAnswer());
    })
    .catch(() => {
      global.adp.microserviceAnalytics.getPraVersion(microserviceSlug)
        .then((msLatestPRAVersion) => {
          answer.setCode(200);
          res.statusCode = 200;
          answer.setMessage('200 Ok');
          answer.setData(msLatestPRAVersion);
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
          answer.setData(null);
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
