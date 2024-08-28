// ============================================================================================= //
/**
* [ adp.endpoints.mimer.deleteToken ]
* Mimer Development Support Endpoint.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/deleteToken:
 *    get:
 *      description: This endpoint delete the <b>Refresh Token</b>.
 *                   <br/>This endpoint require a valid <b>Super Admin Token</b>.
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
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const mimer = new adp.mimer.MimerControl();
  mimer.deleteToken()
    .then((RESPONSE) => {
      const res = adp.setHeaders(RES);
      res.statusCode = 200;
      res.end(JSON.stringify(RESPONSE));
    })
    .catch((ERROR) => {
      const res = adp.setHeaders(RES);
      res.statusCode = 500;
      res.end(JSON.stringify(ERROR));
    });
};
// ============================================================================================= //
