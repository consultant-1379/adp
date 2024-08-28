// ============================================================================================= //
/**
* [ global.adp.endpoints.diskcachefiles.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /diskcachefiles:
 *    get:
 *      description: This endpoint shows the cached files in disk
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
 *        - Backend Disk Cache System
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = new Date();
  const res = global.adp.setHeaders(RES);
  global.adp.document.showDiskCache()
    .then((ANSWEROBJ) => {
      const answer = new global.adp.Answers();
      answer.setCode(200);
      answer.setMessage('200 Ok');
      res.statusCode = 200;
      const timerEnd = (new Date()).getTime() - timer.getTime();
      answer.setTime(timerEnd);
      answer.setSize(global.adp.getSizeInMemory(ANSWEROBJ));
      answer.setCache(false);
      answer.setData(ANSWEROBJ);
      res.end(answer.getAnswer());
    })
    .catch((ERROR) => {
      const packName = 'global.adp.endpoints.diskcachefiles.get';
      const errorText = 'Error in [ adp.document.showDiskCache ]';
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
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
