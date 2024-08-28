// ============================================================================================= //
/**
* [ adp.endpoints.mimer.updateDocumentMenu ]
* Trigger the update document menu.
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/updateDocumentMenu/{MSIDORSLUG}:
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
 *      - name: MSIDORSLUG
 *        in: path
 *        description: Microservice ID or Slug
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: specificVersion
 *        in: query
 *        description: Microservice version
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: updateAll
 *        in: query
 *        description: If <b>true</b> force the update of all versions.<br/>
 *          If <b>false</b> ( default option ), it will update only new versions.<br/>
 *        required: true
 *        default: false
 *        schema:
 *          type: boolean
 *          enum: [true, false]
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const ms = REQ && REQ.params && REQ.params.MSIDORSLUG ? REQ.params.MSIDORSLUG : null;
  const updateAll = REQ && REQ.query && REQ.query.updateAll ? REQ.query.updateAll : false;
  const specificVersion = REQ && REQ.query && REQ.query.specificVersion ? REQ.query.specificVersion : '';
  console.log(JSON.stringify(REQ.query));
  adp.mimer.updateDocumentMenu(ms, updateAll, specificVersion)
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
