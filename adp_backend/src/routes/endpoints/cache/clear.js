// ============================================================================================= //
/**
* [ global.adp.endpoints.cache.clear ]
* This endpoint clears the cache from outside, without restart the Backend
* You can use OBJECT names as URL Params: e.g. [Server Address]/api/clearcache/LISTOPTIONS
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /clearcache:
 *    get:
 *      description: This endpoint clears all the Backend cache
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Backend Cache System
 */
// ============================================================================================= //
/**
 * @swagger
 * /clearcache/{firstLevelObjectName}:
 *    get:
 *      description: This endpoint clears the specified first level key from the Backend cache
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Backend Cache System
 *    parameters:
 *      - name: firstLevelObjectName
 *        in: path
 *        description: Name of the First Level of the Cache Object ( UPPERCASE )
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const res = global.adp.setHeaders(RES);
  let parameterOne = null;
  if (REQ.params.obj !== null && REQ.params.obj !== undefined) {
    parameterOne = REQ.params.obj;
  }
  let obj = null;
  if (typeof parameterOne === 'string') {
    parameterOne = parameterOne.toUpperCase().trim();
    obj = global.adp.masterCache.clear(parameterOne);
  }
  if (obj === null) {
    obj = global.adp.masterCache.clear();
  }
  const answer = new global.adp.Answers();
  const bytes = global.adp.getSizeInMemory(obj);
  answer.setCode(200);
  res.statusCode = 200;
  const timerEnd = (new Date()).getTime() - timer.getTime();
  answer.setTime(timerEnd);
  answer.setSize(bytes);
  answer.setCache('The Cache Object');
  if (parameterOne === null) {
    if (obj) {
      answer.setMessage('200 Ok - All the cache was cleared and the Garbage Collector was requested.');
    } else {
      answer.setMessage('200 Ok - All the cache was cleared but the Garbage Collector was not available.');
    }
  } else if (parameterOne !== null) {
    if (obj) {
      answer.setMessage(`200 Ok - The cache of [ ${parameterOne} ] was cleared and the Garbage Collector was requested.`);
    } else {
      answer.setMessage(`200 Ok - The cache of [ ${parameterOne} ] was cleared but the Garbage Collector was not available.`);
    }
  }
  res.end(answer.getAnswer());
};
// ============================================================================================= //
