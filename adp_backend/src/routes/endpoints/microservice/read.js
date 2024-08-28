// ============================================================================================= //
/**
* [ global.adp.endpoints.microservice.read ]
* Returns one <b>microservice</b> following the ID.
* @param {String} inline ID of the MicroService. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f</b>
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservice/{MicroserviceSlug/ID}:
 *    get:
 *      description: Gives microservice details response object for the given Microservice slug / ID
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
 *        - Microservice
 *    parameters:
 *      - name: MicroserviceSlug/ID
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
  const packName = 'global.adp.endpoints.microservice.read';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - MicroService ID is NULL or UNDEFINED...');
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
  const myMicroServiceID = REQ.params.id;

  let optimized = null;
  if (REQ && REQ.query && REQ.query.optimized) {
    optimized = `${REQ.query.optimized}`;
  }

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
  await global.adp.microservice.read(myMicroServiceID, userObject)
    .then((MYASSET) => {
      const myMicroService = adp.clone(MYASSET);
      if (myMicroService._id === undefined || myMicroService._id === null) {
        answer.setCode(404);
        res.statusCode = 404;
        answer.setMessage('404 Microservice not found');
        answer.setTime(new Date() - timer);
        answer.setSize(0);
        res.end(answer.getAnswer());
        const msg = `Microservice not found in ${(new Date()).getTime() - timer.getTime()}ms`;
        const errorObject = {
          microserviceId: myMicroServiceID,
          response: myMicroService,
        };
        adp.echoLog(msg, errorObject, 404, packName, true);
        return false;
      }
      if (optimized === 'overview') {
        delete myMicroService.menu;
      }
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(myMicroService.totalInDatabase);
      answer.setSize(global.adp.getSizeInMemory(myMicroService));
      answer.setData(myMicroService);
      const endTimer = (new Date()).getTime() - timer.getTime();
      answer.setTime(endTimer);
      if (endTimer > 4) {
        const msg = `Microservice [ ${myMicroService.slug} ] read in ${endTimer}ms`;
        adp.echoLog(msg, null, 200, packName);
      }
      res.end(answer.getAnswer());
      return true;
    }).catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || `Error in [ adp.microservice.read ] in ${(new Date()).getTime() - timer.getTime()}ms`;
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
