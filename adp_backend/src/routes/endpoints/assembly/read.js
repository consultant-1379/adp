// ============================================================================================= //
/**
* [ global.adp.endpoints.assembly.read ]
* Returns one <b>assembly</b> following the ID.
* @param {String} inline ID of the Assembly. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f</b>
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
/**
 * @swagger
 * /assembly/{AssemblySlug/ID}:
 *    get:
 *      description: Gives assembly details response object for the given Assembly slug / ID
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
 *        - Assembly
 *    parameters:
 *      - name: AssemblySlug/ID
 *        in: path
 *        description: Enter Assembly Slug / ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.assembly.read';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - Assembly ID is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return badRequest();
  }
  const myAssemblyID = REQ.params.id;

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let userObject;
  if (REQ && REQ.headers.authorization) {
    const token = REQ.headers.authorization.substring(6, REQ.headers.authorization.length).trim();
    try {
      const decoded = await global.jsonwebtoken.verify(token, global.adp.config.jwt.secret);
      const signum = decoded.id;
      await global.adp.user.get(signum)
        .then((USER) => {
          if (USER) {
            if (USER.docs) {
              if (Array.isArray(USER.docs)) {
                userObject = {
                  signum: USER.docs[0]._id,
                  role: USER.docs[0].role,
                };
              }
            }
          }
        })
        .catch((ERROR) => {
          userObject = undefined;
          const errorText = 'Error in [ adp.user.get ]';
          const errorOBJ = {
            signum,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
        });
    } catch (ERROR) {
      userObject = undefined;
      const errorText = 'Error in try/catch block on verify Token';
      const errorOBJ = {
        token,
        original: REQ.headers.authorization,
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
    }
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  await global.adp.assembly.read(myAssemblyID, userObject)
    .then((myAssembly) => {
      if (myAssembly._id === undefined || myAssembly._id === null) {
        answer.setCode(404);
        res.statusCode = 404;
        answer.setMessage('404 Assembly not found');
        answer.setTime(new Date() - timer);
        answer.setSize(0);
        res.end(answer.getAnswer());
        const msg = `Assembly not found in ${(new Date()).getTime() - timer.getTime()}ms`;
        const errorObject = {
          assemblyId: myAssemblyID,
          response: myAssembly,
        };
        adp.echoLog(msg, errorObject, 404, packName, true);
        return false;
      }
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(myAssembly.totalInDatabase);
      answer.setSize(global.adp.getSizeInMemory(myAssembly));
      answer.setData(myAssembly);
      const endTimer = (new Date()).getTime() - timer.getTime();
      answer.setTime(endTimer);
      if (endTimer > 4) {
        const msg = `Assembly [ ${myAssembly.slug} ] read in ${endTimer}ms`;
        adp.echoLog(msg, null, 200, packName);
      }
      res.end(answer.getAnswer());
      return true;
    }).catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || `Error in [ adp.assembly.read ] in ${(new Date()).getTime() - timer.getTime()}ms`;
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
// ============================================================================================= //
