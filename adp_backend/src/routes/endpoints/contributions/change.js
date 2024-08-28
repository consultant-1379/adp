// ============================================================================================= //
/**
* [ global.adp.endpoints.contributions.change ]
* @route GET /contributions/change
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /contributions/mode/{collection}:
 *    get:
 *      description: changes the display rule of the InnerSource. Requires Super Admin Token.
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *      tags:
 *        - InnerSource Contributions
 *    parameters:
 *      - name: collection
 *        in: path
 *        description: String with one of two options.
 *        required: true
 *        schema:
 *          type: string
 *          enum: [gitstatus, gitstatusbytag]
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const res = global.adp.setHeaders(RES);
  adp.masterCache.clear('INNERSOURCECONTRIBS');

  adp.models.GitstatusCollectionControl = REQ.params.tag;

  let newMode = true;
  if (adp.models.GitstatusCollectionControl === 'gitstatus') {
    newMode = false;
  }
  const releaseSettings = new adp.releaseSettings.ReleaseSettingsController();
  releaseSettings.change('gitstatus-by-tag', newMode, 'backend', null)
    .then(() => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=us-ascii');
      res.end(`Reading InnerSource data from ${adp.models.GitstatusCollectionControl} collection.`);
    })
    .catch((ERROR) => {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Error when it was trying to update the release settings for "gitstatus-by-tag"';
      const errorObject = {
        error: ERROR,
      };
      errorLog(errorCode, errorMessage, errorObject, 'main', 'adp.endpoints.contributions.change');
      res.statusCode = errorCode;
      res.setHeader('Content-Type', 'text/plain; charset=us-ascii');
      res.end('Cannot set the release setting for "gitstatus-by-tag" into MongoDB.');
    });
};
// ============================================================================================= //
