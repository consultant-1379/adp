// ============================================================================================= //
/**
* [ global.adp.endpoints.cache.get ]
* This endpoint shows the JSON CACHE Object on the browser
* To get the resume:
*   [Server Address]/api/cache
*   [Server Address]/api/cache/[Object Name]
* To get the full object:
*   [Server Address]/api/fullcache
*   [Server Address]/api/fullcache/[Object Name]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /cache:
 *    get:
 *      description: This endpoint shows the Short Version of JSON CACHE Object on the browser
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
 * /cache/{firstLevelObjectName}:
 *    get:
 *      description: This endpoint shows the Short Version of JSON CACHE Object on the browser
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
/**
 * @swagger
 * /fullcache:
 *    get:
 *      description: This endpoint shows the Full Version of JSON CACHE Object on the browser
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
 * /fullcache/{firstLevelObjectName}:
 *    get:
 *      description: This endpoint shows the Full Version of JSON CACHE Object on the browser
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
module.exports = (REQ, RES, SHOWALL) => {
  const timer = new Date();
  const res = global.adp.setHeaders(RES);
  if (global.adp.masterCache.cache === undefined) {
    global.adp.masterCache.cache = {};
  }
  let parameterOne = null;
  let parameterTwo = null;
  if (REQ.params.obj !== null && REQ.params.obj !== undefined) {
    parameterOne = REQ.params.obj;
  }
  if (REQ.params.item !== null && REQ.params.item !== undefined) {
    parameterTwo = Buffer.from(`${REQ.params.item}`).toString('base64');
  }
  let obj = null;
  if (parameterOne !== null && parameterTwo !== null) {
    obj = {};
    obj[parameterOne] = {};
    obj[parameterOne][parameterTwo] = global.adp.masterCache.cache[parameterOne][parameterTwo];
  }
  if (parameterOne !== null) {
    obj = {};
    obj[parameterOne] = global.adp.masterCache.cache[parameterOne];
  }
  if (obj === null) {
    obj = global.adp.masterCache.cache;
  }
  const bytes = global.adp.getSizeInMemory(obj);
  if (SHOWALL !== true) {
    obj = JSON.parse(JSON.stringify(obj));
    Object.keys(obj).forEach((key) => {
      Object.keys(obj[key]).forEach((subkey) => {
        if (obj[key][subkey].cache !== undefined) {
          obj[key][subkey].cache.data = '[[ Removed for performance - Use /fullcache/ to load everything ]]';
        } else {
          Object.keys(obj[key][subkey]).forEach((subkey2) => {
            if (obj[key][subkey][subkey2].cache !== undefined) {
              obj[key][subkey][subkey2].cache.data = '[[ Removed for performance - Use /fullcache/ to load everything ]]';
            }
          });
        }
      });
    });
  }
  const answer = new global.adp.Answers();
  answer.setCode(200);
  answer.setMessage(`200 Ok ( ${global.adp.friendlyBytes(bytes)} )`);
  res.statusCode = 200;
  const timerEnd = (new Date()).getTime() - timer.getTime();
  answer.setTime(timerEnd);
  answer.setSize(bytes);
  answer.setCache('The Cache Object');
  answer.setData(obj);
  res.end(answer.getAnswer());
};
// ============================================================================================= //
