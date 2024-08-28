// ============================================================================================= //
/**
* [ global.adp.endpoints.logged.get ]
* Just verify if the user is logged or not ( If Token is valid ).
* @return 200 - Logged
* @return 401 - Unauthorized
* @group Login
* @route GET /logged
* @author Armando Schiavon Dias [escharm]
*/
/**
 * @swagger
 * /logged:
 *    get:
 *      description: This endpoint shows if the user is logged or not ( If Token is valid ).
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
 *        - Logged User
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  const timer = new Date();
  const answer = new global.adp.Answers();
  const packName = 'global.adp.endpoints.logged.get';
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  const gotAnError = (ERROR) => {
    res.statusCode = 401;
    answer.setCode(ERROR.code);
    answer.setMessage(ERROR.message);
    answer.setTotal(0);
    answer.setData(null);
    answer.setSize(0);
    answer.setTime(new Date() - timer);
    res.end(answer.getAnswer());
    adp.echoLog(ERROR.message, ERROR, ERROR.code, packName, true);
  };
  const loggedInUser = REQ.user.docs.length ? REQ.user.docs[0] : null;
  if (loggedInUser) {
    global.adp.user.get(loggedInUser.signum)
      .then((FINALRESULT) => {
        const finalUser = FINALRESULT.docs[0];
        if (finalUser) {
          global.adp.permission.isFieldAdminByUserID(loggedInUser.signum)
            .then((PERMISSIONS) => {
              const domains = [];
              PERMISSIONS.forEach((ITEM) => { domains.push(ITEM.item); });
              if (domains.length > 0) {
                finalUser.permissions = domains;
              } else {
                finalUser.permissions = [];
              }
              const result = {
                logged: true,
                user: finalUser,
              };
              res.end(JSON.stringify(result));
            })
            .catch(ERROR => gotAnError(ERROR));
        }
      })
      .catch(ERROR => gotAnError(ERROR));
  } else {
    const result = {
      logged: true,
      user: {},
    };
    res.end(JSON.stringify(result));
  }
};
// ============================================================================================= //
