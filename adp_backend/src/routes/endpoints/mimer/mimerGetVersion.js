// ============================================================================================= //
/**
* [ adp.endpoints.mimer.mimerGetVersion ]
* Trigger the update document menu for synchronizing.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/mimerGetVersion/{PRODUCTNUMBER}:
 *    get:
 *      description: This endpoint triggers the <b>Update Document Menu</b>.
 *                  <br/>This endpoint returns a <b>Queue Link</b> ( <b>queueStatusLink</b> ).
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
 *    parameters:
 *      - name: PRODUCTNUMBER
 *        in: path
 *        description: Mimer Product Number
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  let PRODUCTNUMBER = REQ && REQ.params
    && REQ.params.PRODUCTNUMBER ? REQ.params.PRODUCTNUMBER : null;
  const mimerController = new adp.mimer.MimerControl();
  PRODUCTNUMBER = PRODUCTNUMBER.replace(/\s/g, '');
  mimerController.getProduct(PRODUCTNUMBER)
    .then((VERSIONRESPONSE) => {
      VERSIONRESPONSE.sort(global.adp.versionSort('-version'));
      const SORTEDVERSION = VERSIONRESPONSE.map(({ version }) => version);
      const res = adp.setHeaders(RES);
      res.statusCode = 200;
      res.end(JSON.stringify(SORTEDVERSION));
    })
    .catch((ERROR) => {
      const res = adp.setHeaders(RES);
      res.statusCode = ERROR.code || 500;
      res.end(JSON.stringify(ERROR));
    });
};
// ============================================================================================= //
