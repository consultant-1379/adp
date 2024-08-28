// ============================================================================================= //
/**
* [ adp.endpoints.mimer.mimerSync ]
* Trigger the update document menu for synchronizing.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
/**
 * @swagger
 * /mimer/mimerSync:
 *    get:
 *      description: This endpoint triggers the <b>Update Document Menu For Sync</b>.
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
 *      - name: updateAll
 *        in: query
 *        description: If <b>true</b> force the update of all versions.<br/>
 *          If <b>false</b> ( default option ), it will update only new versions.<br/>
 *        required: true
 *        default: false
 *        schema:
 *          type: boolean
 *          enum: [true, false]
 *      - name: userPassword
 *        in: query
 *        description: Functional User Password to validate and execute Mimer Synchronization.
 *        required: true
 *        schema:
 *          type: string
 */
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  let authentication = !!(REQ && REQ.query && REQ.query.userPassword
    && REQ.query.userPassword === adp.config.functionalUserPassword);

  if (!authentication && adp && adp.config && adp.config.integrationTestsPassword) {
    authentication = REQ
      && REQ.query
      && REQ.query.userPassword
      ? REQ.query.userPassword === adp.config.integrationTestsPassword
      : false;
  }

  const updateAll = REQ && REQ.query && REQ.query.updateAll ? REQ.query.updateAll : false;
  if (authentication) {
    adp.mimer.updateDocumentMenuForSync(updateAll)
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
  } else {
    const res = adp.setHeaders(RES);
    res.statusCode = 401;
    const ERROR = {};
    ERROR.statusCode = 401;
    ERROR.message = 'Forbidden Access due to incorrect User Password.';
    res.end(JSON.stringify(ERROR));
  }
};
// ============================================================================================= //
