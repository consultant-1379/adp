// ============================================================================================= //
/**
* [ global.adp.endpoints.diskcachefiles.clear ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /cleardiskcachefiles:
 *    get:
 *      description: This endpoint removes the cached files in disk, older than one minute
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '429':
 *          description: 'Too Many Requests - You have to wait for some time before run this again.'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Backend Disk Cache System
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const res = global.adp.setHeaders(RES);
  global.adp.document.clearExpiredFilesFromArtifactory()
    .then((RESULT) => {
      if (RESULT.status) {
        const answer = new global.adp.Answers();
        answer.setCode(200);
        answer.setMessage('200 Ok');
        res.statusCode = 200;
        const timerEnd = (new Date()).getTime() - timer.getTime();
        answer.setTime(timerEnd);
        answer.setCache(false);
        answer.setData(RESULT.msg);
        res.end(answer.getAnswer());
      } else {
        const answer = new global.adp.Answers();
        answer.setCode(429);
        answer.setMessage('429 Too Many Requests');
        res.statusCode = 429;
        const timerEnd = (new Date()).getTime() - timer.getTime();
        answer.setTime(timerEnd);
        answer.setCache(false);
        answer.setData(RESULT.msg);
        res.end(answer.getAnswer());
      }
    })
    .catch((ERROR) => {
      const packName = 'global.adp.endpoints.diskcachefiles.clear';
      const errorText = 'Error in [ adp.document.clearExpiredFilesFromArtifactory ]';
      const errorOBJ = {
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      const answer = new global.adp.Answers();
      answer.setCode(500);
      answer.setMessage('500 Internal Server Error');
      res.statusCode = 500;
      const timerEnd = (new Date()).getTime() - timer.getTime();
      answer.setTime(timerEnd);
      answer.setCache(false);
      answer.setData('Please, contact the ADP Portal Team');
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
