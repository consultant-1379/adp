const errorLog = require('../../../library/errorLog');
/**
* [ global.adp.endpoints.elasticSync.msDocForceSync ]
* Used for force sync of Microservice documentation
* @author Githu Jeeva Savy [zjeegit]
*/

// "List of objects with MicroService ID ( required ),
// Version ( optional ) and Document Slug ( optional ).<br/>
// You can use [{ "ids": ["all"] }] to trigger all."

/**
 * @swagger
 * /elasticSearchSync/msDocForceSync:
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
 *                example: { "ids": ["all"], "versionName": undefined, "docSlug": undefined }
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
 *          - ElasticSearch Microservice Documentation Sync
 *
 */

module.exports = async (REQ, RES) => {
  const packName = 'adp.endpoints.elasticSync.msDocForceSync';
  const { body } = REQ;
  const idsArray = body
    && body.ids
    ? body.ids
    : null;
  const versionName = body
    && body.versionName
    && body.versionName !== 'undefined'
    && body.versionName !== 'null'
    ? body.versionName
    : undefined;
  const docSlug = body
    && body.docSlug
    && body.docSlug !== 'undefined'
    && body.docSlug !== 'null'
    ? body.docSlug
    : undefined;

  let ids = null;
  let queueObjective;
  if (Array.isArray(idsArray) && idsArray[0] === 'all') {
    const adpModel = new adp.models.Adp();
    ids = await adpModel.indexAssetsGetOnlyIDs();
    ids = ids.docs;
    queueObjective = `allMicroservices__${(new Date()).getTime()}`;
  } else if (Array.isArray(idsArray) && idsArray.length === 1) {
    const adpModel = new adp.models.Adp();
    const ms = await adpModel.justAMicroserviceSlug(idsArray[0]);
    if (ms && Array.isArray(ms.docs) && ms.docs.length === 1 && ms.docs[0].slug) {
      queueObjective = `${ms.docs[0].slug}__${(new Date()).getTime()}`;
    } else {
      queueObjective = `${idsArray[0]}__${(new Date()).getTime()}`;
    }
    ids = [ms.docs[0]];
  } else if (Array.isArray(idsArray) && idsArray.length > 1) {
    queueObjective = `multipleMicroservices__${(new Date()).getTime()}`;
    ids = idsArray.map((ITEM) => {
      const obj = { _id: ITEM };
      return obj;
    });
  } else {
    const errorCode = 400;
    const errorMessage = 'Bad Request';
    errorLog(
      errorCode,
      errorMessage,
      { bodyRequest: body },
      'main',
      packName,
    );
    const res = adp.setHeaders(RES);
    res.statusCode = errorCode;
    res.end(JSON.stringify(errorMessage));
    return;
  }

  await adp.microservice.synchronizeDocumentsWithElasticSearch.add(
    ids, versionName, docSlug, queueObjective, 'ALL', 'syncIntegration', 'microserviceDocumentsElasticSync', 'microservice',
  )
    .then((RESULT) => {
      const res = adp.setHeaders(RES);
      res.statusCode = 200;
      res.end(JSON.stringify(RESULT));
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR.message ? ERROR.message : 'Unable to add this request to the queue';
      errorLog(
        errorCode,
        errorMessage,
        { error: ERROR, bodyRequest: body },
        'main',
        packName,
      );
      const res = adp.setHeaders(RES);
      res.statusCode = errorCode;
      res.end(JSON.stringify(errorMessage));
    });
};
