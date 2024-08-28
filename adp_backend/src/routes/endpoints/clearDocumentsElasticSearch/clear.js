// ============================================================================================= //
/**
* [ global.adp.endpoints.clearDocumentsElasticSearch.clear ]
* Returns one <b>microservice</b> following the ID.
* @param {String} inline ID of the MicroService. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f</b>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /clearDocumentsElasticSearch/{ID}:
 *    get:
 *      description: Clears documents in ElasticSearch Database for the given Microservice slug / ID
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
 *        - ElasticSearch Clear Documents
 *    parameters:
 *      - name: ID
 *        in: path
 *        description: Enter Microservice Slug / ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.elasticSync.msDocForceSync';
  const idsArray = REQ.params
  && REQ.params.id
    ? REQ.params.id
    : null;
  const res = global.adp.setHeaders(RES);
  const answer = new global.adp.Answers();
  const elasticSync = new adp.mimer.MimerElasticSearchSync();
  await elasticSync.clearElasticDocuments(idsArray)
    .then((SUCCESS) => {
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(SUCCESS.totalInDatabase);
      answer.setSize(global.adp.getSizeInMemory(SUCCESS));
      answer.setData(SUCCESS);
      const endTimer = (new Date()).getTime() - timer.getTime();
      answer.setTime(endTimer);
      if (endTimer > 4) {
        const msg = `Microservice [ ${idsArray} ] read in ${endTimer}ms`;
        adp.echoLog(msg, null, 200, packName);
      }
      res.end(answer.getAnswer());
      return true;
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || `Error in [ adp.mimer.mimerElasticSearchSyncClear ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorObject = {
        error: ERROR,
      };
      const finalError = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      answer.setCode(finalError.code);
      res.statusCode = finalError.code;
      answer.setMessage(`Error: ${finalError.desc}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return false;
};
