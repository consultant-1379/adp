// ============================================================================================= //
/**
 * [ adp.endpoints.comments.get ]
 * Retrieve all comments from a specific location
 * @author Armando Dias [zdiaarm]
 *
 * @swagger
 * /comments:
 *    get:
 *      description: Retrieve all comments from a specific location.<br/>
 *                   <b>location_id</b> example -
 *                   "<b>ms_45e7f4f992afe7bbb62a3391e500e71b_overview</b>"<br/>
 *                   You should be logged ( <i>User Access Token</i> )<br/>
 *      parameters:
 *        - name: location_id
 *          in: query
 *          description: Location id of the comments
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *      responses:
 *        '200':
 *          description: Ok.
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '400':
 *          $ref: '#/components/responses/BadRequest'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Comments
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
const { HTTP_STATUS } = require('./../../../library/utils/constants');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const packName = 'adp.endpoints.comments.get';
  const comment = new adp.comments.CommentsClass();
  comment.getComment(REQ)
    .then((GETRESULT) => {
      const res = adp.setHeaders(RES);
      res.statusCode = GETRESULT.code;
      res.end(JSON.stringify(GETRESULT));
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.desc ? ERROR.desc : HTTP_STATUS['500'];
      const errorObject = { error: ERROR };
      errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      const res = adp.setHeaders(RES);
      res.statusCode = errorCode;
      res.end(JSON.stringify({ code: errorCode, message: errorMessage }));
    });
};
// ============================================================================================= //
