// ============================================================================================= //
/**
* [ global.adp.endpoints.assembly.getComponentServicesFromAssembly ]
* Returns one <b>assembly</b> following the ID.
* @param {String} inline ID of the Assembly. After the URL, add a slash and the ID.
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
/**
 * @swagger
 * /assembly/getComponentServicesFromAssembly:
 *    post:
 *      description: This endpoint is used for force sync of Microservice documentation
 *      requestBody:
 *          description:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *                example: { "idsOrSlugs": ["45e7f4f992afe7bbb62a3391e500ekod"] }
 *      responses:
 *        '200':
 *          description: Report of the Forced synchronization of microservice documentation
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *          - Assembly
 */

const errorLog = require('../../../library/errorLog');

module.exports = async (REQ, RES) => {
  const packName = 'adp.endpoints.assembly.getComponentServicesFromAssembly';
  const { body } = REQ;
  const idsSlugArray = body
    && body.idsOrSlugs
    ? body.idsOrSlugs
    : null;

  if (Array.isArray(idsSlugArray) && idsSlugArray.length > 0) {
    const adpModel = new adp.models.Adp(['assembly']);
    adpModel.getAssemblyByIDorSLUG(idsSlugArray).then((ASSEMBLYDATA) => {
      adp.assembly.getComponentServicesFromAssembly(ASSEMBLYDATA.docs).then((ASSEMBLYMS) => {
        const sortedAssemblies = ASSEMBLYMS.sort((a1, a2) => (a1.name > a2.name) ? 1 : (a1.name < a2.name) ? -1 : 0);
        const res = adp.setHeaders(RES);
        res.statusCode = 200;
        res.end(JSON.stringify(sortedAssemblies));
      }).catch((ERROR) => {
        const res = adp.setHeaders(RES);
        res.statusCode = ERROR.errorcode;
        res.end(JSON.stringify(ERROR));
      });
    }).catch((ERROR) => {
      const res = adp.setHeaders(RES);
      res.statusCode = ERROR.errorcode;
      res.end(JSON.stringify(ERROR));
    });
  }
};
