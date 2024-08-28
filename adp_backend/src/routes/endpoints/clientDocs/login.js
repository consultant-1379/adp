// ============================================================================================= //
/**
* [ global.adp.endpoints.clientDocs.login ]
* @author Ravikiran [zgarsri]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
/**
 * @swagger
 * /clientDocs/login:
 *    post:
 *      description: This endpoint authorize the given input and a Token is given in the response.
 *      requestBody:
 *          description: "Enter your username and password."
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
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
 *        - Client Docs
 *
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.clientDocs.login';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  res.setHeader('Content-Type', 'application/json');

  const gotAnError = (MSG, ERROR) => {
    res.statusCode = ERROR.code;
    answer.setCode(ERROR.code);
    answer.setMessage(ERROR.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    adp.echoLog(MSG, ERROR, ERROR.code, packName, true);
  };

  const isABadRequest = (ERRORMESSAGE) => {
    const foundErrorOBJ = {
      code: 400,
      message: '400 - Bad Request',
    };
    adp.echoLog(ERRORMESSAGE, foundErrorOBJ, 400, packName);
    gotAnError(ERRORMESSAGE, foundErrorOBJ);
  };

  if (REQ.body === null || REQ.body === undefined) {
    isABadRequest('ERROR :: Body of Request cannot be null or undefined!');
    return;
  }

  let myJSON = REQ.body;
  const situationOne = (myJSON.username === null) || (myJSON.username === undefined);
  const situationTwo = (myJSON.password === null) || (myJSON.password === undefined);
  if (situationOne || situationTwo) {
    if (Object.keys(REQ.body).length !== 1) {
      isABadRequest('ERROR :: Username or Password is missing on Request!');
      return;
    }
    let keyFromBody = '';
    Object.keys(REQ.body).forEach((k) => {
      keyFromBody = k;
    });
    myJSON = JSON.parse(keyFromBody);
  }

  const { username } = myJSON;
  const { password } = myJSON;

  const successfulLogin = (FINALRESULT) => {
    res.statusCode = FINALRESULT.code;
    answer.setCode(FINALRESULT.code);
    answer.setTotal(1);
    answer.setMessage('200 - Login successful');
    answer.setData({ token: FINALRESULT.data.token });
    answer.setSize(global.adp.getSizeInMemory(FINALRESULT.data));
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    adp.echoLog(FINALRESULT.message, null, 200, packName);
  };

  global.adp.login.ldap(username, global.base64.encode(password))
    .then((RESULT) => {
      global.adp.login.checkdb(RESULT.user)
        .then((FINALRESULT) => {
          successfulLogin(FINALRESULT);
        })
        .catch(ERROR => gotAnError('Error in [ adp.login.checkdb ]', ERROR));
    })
    .catch(ERROR => gotAnError('Error in [ adp.login.ldap ]', ERROR));
};
