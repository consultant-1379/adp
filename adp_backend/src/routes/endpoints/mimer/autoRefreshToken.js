// ============================================================================================= //
/**
* [ adp.endpoints.mimer.autoRefreshToken ]
* This endpoint trigger the auto refresh token.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/autorefreshtoken:
 *    get:
 *      description: This endpoint trigger the <b>auto refresh token</b>.
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
 *        - Mimer
 *
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const packName = 'adp.endpoints.mimer.autoRefreshToken';
  const res = adp.setHeaders(RES);
  adp.mimer.autoRefreshToken()
    .then(() => {
      res.end(JSON.stringify({
        code: 200,
        message: 'Token was successful updated!',
      }));
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error when trying to update the token';
      const errorObject = {
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      res.end(JSON.stringify({
        code: 500,
        message: 'Internal Server Error!',
      }));
    });
};
// ============================================================================================= //
