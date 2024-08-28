// ============================================================================================= //
/**
* [ global.adp.endpoints.users.get ]
This endpoint retrives all users from the database
* @author Armando Schiavon Dias [escharm]
*/

/**
 * @swagger
 * /users:
 *    get:
 *      description: This endpoint retrives all users from the database
 *      responses:
 *        '200':
 *          description: OK.Success- All users list
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
module.exports = (REQ, RES) => {
  global.adp.users.get(REQ)
    .then((ANSWER) => {
      const res = RES;
      res.statusCode = 200;
      res.end(ANSWER.getAnswer());
    })
    .catch((ERR) => {
      const packName = 'adp.endpoints.users.get';
      adp.echoLog('Error in [ adp.users.get ]', { error: ERR }, 500, packName, true);
    });
};
// ============================================================================================= //
