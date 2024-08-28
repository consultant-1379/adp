// ============================================================================================= //
/**
* [ global.adp.endpoints.clientDocs.getDocumentList ]
* Returns a list of documents for the <b>microservice</b>
* @param {String} inline ID/Slug of the MicroService. After the URL, add a slash and the ID.
* Example: <b>/03a6c2af-36da-430f-842c-84176fd54c0f/alarm-handler</b>
* @param {String} inline Version of the MicroService. After the ID/Slug, add a slash and the version.
* Example: <b>/2.0.0</b>
* @author Githu Jeeva Savy[zjeegit]
// ============================================================================================= //
/**
 * @swagger
 * /clientDocs/microservice/{MicroserviceSlug/ID}/{DocumentVersion}:
 *    get:
 *      description: Gives Documentation details for the given Microservice slug/ID and the version<br>
 *                   <strong>The request has to be authorized using the token generated from the login end point.</strong> <br>
 *                   <strong>The Microservice ID can be copied from the URL while opening it in Edit mode from the Admin area.</strong><br>
 *                   <strong>The Microservice slug can be copied from the URL while opening it from the marketplace.</strong><br>
 *                   If the requested version or microservice is not found it will give <strong>404 Not Found </strong> error.<br>
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *        '401':
 *          $ref: '#/components/responses/Unauthorized'
 *        '403':
 *          $ref: '#/components/responses/Forbidden'
 *        '404':
 *          $ref: '#/components/responses/NotFound'
 *        '500':
 *          $ref: '#/components/responses/InternalServerError'
 *      tags:
 *        - Client Docs
 *    parameters:
 *      - name: MicroserviceSlug/ID
 *        in: path
 *        description: Enter Microservice Slug / ID
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: DocumentVersion
 *        in: path
 *        description: Enter Microservice Document version
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 */
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'global.adp.endpoints.clientDocs.getDocumentList';
  const answer = new global.adp.Answers();
  const res = global.adp.setHeaders(RES);
  const badRequest = () => {
    answer.setCode(400);
    answer.setMessage('400 Bad Request - MicroService ID is NULL or UNDEFINED...');
    res.statusCode = 400;
    res.end(answer.getAnswer());
    return false;
  };

  if (REQ.params === null || REQ.params === undefined) {
    return badRequest();
  }
  if (REQ.params.id === null || REQ.params.id === undefined) {
    return badRequest();
  }
  if (REQ.params.version === null || REQ.params.version === undefined) {
    return badRequest();
  }
  const myMicroServiceID = REQ.params.id;
  const requestedVersion = REQ.params.version;
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let userObject;
  let documentData;
  const documentList = [];

  await global.adp.microservice.read(myMicroServiceID, userObject, requestedVersion)
    .then((myMicroService) => {
      if (myMicroService._id === undefined || myMicroService._id === null) {
        answer.setCode(404);
        res.statusCode = 404;
        answer.setMessage('404 Microservice not found');
        answer.setTime(new Date() - timer);
        answer.setSize(0);
        const msg = `Microservice not found in ${(new Date()).getTime() - timer.getTime()}ms`;
        const errorObject = {
          microserviceId: myMicroServiceID,
          response: myMicroService,
        };
        adp.echoLog(msg, errorObject, 404, packName, true);
        return false;
      }
      if (myMicroService && myMicroService.documentsForRendering) {
        if (myMicroService.documentsForRendering[requestedVersion]) {
          documentData = myMicroService.documentsForRendering[requestedVersion];
        } else {
          answer.setCode(404);
          res.statusCode = 404;
          answer.setMessage('404 Requested Version not found');
          answer.setTime(new Date() - timer);
          answer.setSize(0);
          res.end(answer.getAnswer());
          const msg = `Requested Version not found in ${(new Date()).getTime() - timer.getTime()}ms`;
          const errorObject = {
            microserviceId: myMicroServiceID,
            response: myMicroService.documentsForRendering[requestedVersion],
          };
          adp.echoLog(msg, errorObject, 404, packName, true);
          return false;
        }
        const checkPvi = myMicroService.check_pvi;
        const documentSource = (myMicroService.menu_auto) ? 'Artifactory' : 'Gerrit';
        const categories = Object.keys(documentData);
        categories.forEach((item) => {
          if (Array.isArray(documentData[item])) {
            documentData[item].forEach((document) => {
              const documentItem = {};
              documentItem['Document Name'] = document.name;
              documentItem.Source = (document.mimer_source) ? 'Mimer' : documentSource;
              documentItem['Category Name'] = document.category_name;
              if (document.mimer_source) {
                documentItem['Document Number'] = document.mimer_document_number;
              }
              documentList.push(documentItem);
            });
          }
        });
        if (checkPvi) {
          const addPviReport = {};
          addPviReport['Document Name'] = "PVI Report";
          addPviReport.Source = "ADP Portal";
          addPviReport['Category Name'] = "Release Documents";
          const indexOfReleasedoc = documentList.findIndex(checkIndex => checkIndex['Category Name'] === 'Release Documents');
          if (indexOfReleasedoc !== -1) {
            documentList.splice(indexOfReleasedoc, 0, addPviReport);
          }
        }
      }
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(myMicroService.totalInDatabase);
      answer.setSize(global.adp.getSizeInMemory(myMicroService));
      answer.setData(documentList);
      const endTimer = (new Date()).getTime() - timer.getTime();
      answer.setTime(endTimer);
      const msg = `Microservice [ ${myMicroService.slug} ] read in ${endTimer}ms`;
      adp.echoLog(msg, null, 200, packName);
      res.end(answer.getAnswer());
      return true;
    }).catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || `Error in [ adp.microservice.read ] in ${(new Date()).getTime() - timer.getTime()}ms`;
      const errorObject = {
        error: ERROR,
      };
      const finalError = errorLog(errorCode, errorMessage, errorObject, 'main', packName);
      answer.setCode(finalError.code);
      res.statusCode = finalError.code;
      answer.setMessage(`Error: ${finalError.desc}`);
      answer.setTime(new Date() - timer);
      res.end(answer.getAnswer());
      return false;
    });
  return false;
};
// ============================================================================================= //
