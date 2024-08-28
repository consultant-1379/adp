// ============================================================================================= //
/**
 * [ adp.endpoints.comments.put ]
 * Updates a specific comment
 * @author Armando Dias [zdiaarm]
 *
 *
 *
 * @swagger
 * /comments:
 *    put:
 *      description: Updates a specific comment.<br/>
 *                   You should be logged ( <i>User Access Token</i> )<br/>
 *                   The token should belongs to the owner of the comment to be successful.<br/>
 *                   <b>Super Admin</b> cannot update comments which belongs to other users.<br/>
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
 *      requestBody:
 *          description: "Add a JSON on the Raw Body with the
 *                        comment_id and comment_text"
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  comment_id:
 *                    type: string
 *                    example: The location ID
 *                  comment_text:
 *                    type: string
 *                    example: The Updated Comment Text
 */

// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./../../../library/utils/constants');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const packName = 'adp.endpoints.comments.put';
  const { body } = REQ;
  const { userRequest } = REQ;

  const comment_id = body
    && body.comment_id
    ? body.comment_id
    : undefined;
  const comment_text = body
    && body.comment_text
    ? body.comment_text
    : undefined;

  const signum = userRequest
    && userRequest.signum
    ? userRequest.signum
    : undefined;
  const name = userRequest
    && userRequest.name
    ? userRequest.name
    : undefined;
  const email = userRequest
    && userRequest.email
    ? userRequest.email
    : undefined;

  if (!comment_id || !comment_text) {
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    const errorObject = {
      errorCommentId: !comment_id ? ERROR_MESSAGES.ERROR_COMMENT_ID : undefined,
      errorCommentText: !comment_text ? ERROR_MESSAGES.ERROR_COMMENT_TEXT : undefined,
    };
    errorLog(errorCode, errorMessage, errorObject, 'main', packName);
    const res = adp.setHeaders(RES);
    res.statusCode = errorCode;
    res.end(JSON.stringify({ code: errorCode, message: errorMessage }));
    return;
  }
  if (!signum || !name || !email) {
    const errorCode = 400;
    const errorMessage = 'Missing User Data';
    const errorObject = {
      errorSignum: `${signum}`,
      errorName: `${name}`,
      errorEmail: `${email}`,
    };
    errorLog(errorCode, errorMessage, errorObject, 'main', packName);
    const res = adp.setHeaders(RES);
    res.statusCode = errorCode;
    res.end(JSON.stringify({ code: errorCode, message: errorMessage }));
    return;
  }

  const comment = new adp.comments.CommentsClass();
  comment.putComment(body, userRequest)
    .then((PUTRESULT) => {
      const res = adp.setHeaders(RES);
      res.statusCode = PUTRESULT.code;
      res.end(JSON.stringify(PUTRESULT));
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
