// ============================================================================================= //
/**
* [ adp.endpoints.mimer.token ]
* Mimer Development Support Endpoint.
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/refreshToken:
 *    post:
 *      description: This endpoint update the <b>Refresh Token</b>.
 *                   <br/>This endpoint require a valid <b>Super Admin Token</b>.
 *      requestBody:
 *          description: "Small JSON with the <b>Refresh Token</b>."
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
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
 *        - Mimer
 *
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const token = REQ && REQ.body && REQ.body.token ? REQ.body.token : null;
  const mimer = new adp.mimer.MimerControl();
  mimer.acceptRefreshToken(token)
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
