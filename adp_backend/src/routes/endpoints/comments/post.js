// ============================================================================================= //
/**
 * [ adp.endpoints.comments.post ]
 * Create a new comment
 * @author Armando Dias [zdiaarm]
 *
 * @swagger
 * /comments:
 *    post:
 *      description: Create a new comment.<br/>
 *                   You should be logged ( <i>User Access Token</i> )<br/>
 *                   The token indicates who will be the owner of this new comment.<br/>
 *                   The user should has access (<b>RBAC</b>) to the
 *                   source indicated in <b>location_id</b>.<br/>
 *                   <b>location_id</b> example -
 *                   "<b>ms_45e7f4f992afe7bbb62a3391e500e71b_overview</b>"<br/>
 *                   <b>location_title</b> example -
 *                   "<b>location title of articles, tutorials, assets</b>"<br/>
 *                   <b>location_page</b> example -
 *                   "<b>h2-title-slug</b>"<br/>
 *                   <b>location_author</b> example -
 *                   ["<b>Super User</b>"]<br/>
 *                   <b>location_email</b> example -
 *                   ["<b>super-user@adp-test.com</b>"]<br/>
 *                   <b>location_signum</b> example -
 *                   ["<b>esupuse</b>"]<br/>
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
 *                        location_id, location_title, location_page, location_author, location_email, location_signum and comment_text"
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  location_id:
 *                    type: string
 *                    example: The location ID
 *                  location_title:
 *                    type: string
 *                    example: The location title
 *                  location_page:
 *                    type: string
 *                    example: The location of the comment in the page
 *                  location_author:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: The location author of the comment in the page
 *                  location_email:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: The location email of the comment in the page
 *                  location_signum:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: The location signum of the comment in the page
 *                  comment_text:
 *                    type: string
 *                    example: Comment Text
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./../../../library/utils/constants');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const packName = 'adp.endpoints.comments.post';
  const { body } = REQ;
  const { userRequest } = REQ;
  const { rbac } = REQ;

  const location_id = body
    && body.location_id
    ? body.location_id
    : undefined;
  const location_title = body
    && body.location_title
    ? body.location_title
    : undefined;
  const location_page = body
    && body.location_page
    ? body.location_page
    : undefined;
  const location_author = body
    && body.location_author
    ? body.location_author
    : undefined;
  const location_email = body
    && body.location_email
    ? body.location_email
    : undefined;
  const location_signum = body
    && body.location_signum
    ? body.location_signum
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

  if (!location_id || !location_title || !location_page || !location_author || !location_email || !location_signum || !comment_text) {
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    const errorObject = {
      errorLocationId: !location_id ? ERROR_MESSAGES.ERROR_LOCATION_ID : undefined,
      errorLocationTitle: !location_title ? ERROR_MESSAGES.ERROR_LOCATION_TITLE : undefined,
      errorLocationPage: !location_page ? ERROR_MESSAGES.ERROR_LOCATION_PAGE : undefined,
      errorLocationAuthor: !location_author ? ERROR_MESSAGES.ERROR_LOCATION_AUTHOR : undefined,
      errorLocationEmail: !location_email ? ERROR_MESSAGES.ERROR_LOCATION_EMAIL : undefined,
      errorLocationSignum: !location_signum ? ERROR_MESSAGES.ERROR_LOCATION_SIGNUM : undefined,
      errorLocationText: !comment_text ? ERROR_MESSAGES.ERROR_COMMENT_TEXT : undefined,
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
  comment.postComment(body, userRequest, rbac)
    .then((POSTRESULT) => {
      const res = adp.setHeaders(RES);
      res.statusCode = POSTRESULT.code;
      res.end(JSON.stringify(POSTRESULT));
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
