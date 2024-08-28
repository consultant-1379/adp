// ============================================================================================= //
/**
* [ global.adp.endpoints.tutorialsMenu.get ]
* Returns the tutorials menu.
* @param {String} Authorization as string on the header of the request.
* Add a header variable with the name <b>Authorization</b> with the string "Bearer <b>TOKEN</b>".
* <br/> Don't forget the space between the word <b>Bearer</b> and the <b>token</b>.
* @return {object} 200 - Returns a full Tutorials Menu Object,
* customized for the logged user (/userprogress).
* @return 500 - Internal Server Error
* @group userProgress
* @route GET /tutorialsmenu
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /tutorialsmenu:
 *    get:
 *      description: This endpoint will show the tutorials menu in JSON format on the browser
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
 *        - Tutorials Menu
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const startTimer = new Date();
  const packName = 'global.adp.endpoints.tutorialsMenu.get';
  const res = global.adp.setHeaders(RES);
  const answer = new global.adp.Answers();

  const alternativeMode = REQ && REQ.query && REQ.query.alternative ? REQ.query.alternative : false;

  global.adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      const { signum } = USER;
      global.adp.tutorialsMenu.get.getTutorialsMenu(signum, REQ.rbac, alternativeMode)
        .then((RESULT) => {
          const resultToSend = RESULT;
          answer.setCode(200);
          answer.setMessage('Tutorials Menu successful retrieved');
          const timer = (new Date()).getTime() - startTimer.getTime();
          if (resultToSend.fromCache === true) {
            answer.setCache(`Menu base from Cache - ${timer}ms`);
          } else {
            answer.setCache(`Menu base not from Cache - ${timer}ms`);
          }
          delete resultToSend.fromCache;
          answer.setData(resultToSend);
          res.statusCode = 200;
          res.end(answer.getAnswer());
        })
        .catch((ERROROBJ) => {
          const errorCode = ERROROBJ.code || 500;
          const errorMessage = ERROROBJ.message || 'Error when it was trying to get tutorials menu';
          const errorObject = {
            error: ERROROBJ,
            signum,
            rbac: REQ.rbac,
          };
          errorLog(errorCode, errorMessage, errorObject, 'main', packName);
          res.statusCode = ERROROBJ.code;
          answer.setCode(ERROROBJ.code);
          answer.setMessage(ERROROBJ.desc);
          answer.setData(ERROROBJ.data);
          res.end(answer.getAnswer());
        });
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error when it was trying to get user from request object';
      const errorObject = {
        error: ERROR,
        rbac: REQ.rbac,
      };
      errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      answer.setCode(500);
      answer.setMessage('500 Internal Server Error');
      res.statusCode = 500;
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
