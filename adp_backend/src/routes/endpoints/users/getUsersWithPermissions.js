// ============================================================================================= //
/**
* [ global.adp.endpoints.users.getUsersWithPermissions ]
* Returns all <b>usersWithPermissions</b> by default.<br/>
* @author Omkar Sadegaonkar [zsdgmkr]
*/

/**
 * @swagger
 * /usersWithPermissions:
 *    get:
 *      description: This endpoint retrives all users with permissions
 *      responses:
 *        '200':
 *          description: Ok. Success-Shows all users with permissions
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Users in Admin Area
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.users.getUsersWithPermissions';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  await global.adp.users.getUsersWithPermissions(REQ)
    .then((userData) => {
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setData(userData);
      answer.setLimit(999999);
      answer.setTotal(userData.length);
      answer.setPage(1);
      answer.setSize(userData.length);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return true;
    }).catch((error) => {
      const finalTimer = (new Date()).getTime() - timer.getTime();
      const errorText = `Error in [ adp.users.getUsersWithPermissions ] in ${finalTimer}ms`;
      const errorOBJ = {
        error,
        header: REQ.headers,
      };
      if (error && error.code && error.message) {
        adp.echoLog(errorText, errorOBJ, error.code, packName, true);
        answer.setCode(error.code);
        res.statusCode = error.code;
        answer.setMessage(error.message);
        answer.setTime(new Date() - timer);
        res.end(answer.getAnswer());
        return false;
      }
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      answer.setCode(500);
      res.statusCode = 500;
      answer.setMessage(`Error: ${error}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return false;
};
// ============================================================================================= //
