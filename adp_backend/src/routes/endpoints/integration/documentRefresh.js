// ============================================================================================= //
/**
* [ global.adp.endpoints.integration.documentRefresh ]
* Triggers the cache update to ensure portal is serving
* the latest documents and menus on the marketplace.
* @param {String} access_token The JWT token which secures
*  the endpoint and identifies the target microservice.
* @return {object} 200  - Identifies the target microservice
* @return 401 - For an invalid token
* @return 500 - Internal Server Error
* @route POST /integration/{version}/microservice/documentrefresh
* @author John Dolan [xjohdol]
*/
// ============================================================================================= //
/**
 * @swagger
 * /integration/v3/microservice/documentrefresh/{SpecificVersion}:
 *    post:
 *      description: Trigger the update of documents using YAML files on Artfactory.<br/>
 *        <b>DO NOT USE THE USER ACCESS TOKEN.</b><br/>
 *        The unique token should be the <b>Microservice Access Token</b>
 *        on the <b>access_token</b> field.
 *      responses:
 *        '200':
 *          $ref: '#/components/responses/Ok'
 *      tags:
 *        - Document Refresh
 *    parameters:
 *      - name: access_token
 *        in: query
 *        description: Token which belongs to a specific microservice.
 *        required: true
 *        schema:
 *          type: string
 *      - name: SpecificVersion
 *        in: path
 *        description: Enter a string with the version label,<br/>
 *          the keyword <b>development</b><br/>
 *          or leave it blank/empty string to trigger the synchronization of all versions.<br/>
 *        default: development
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *
 */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //

module.exports = async (REQ, RES) => {
  const timer = new Date();
  const packName = 'adp.endpoints.integration.documentRefresh';
  const res = global.adp.setHeaders(RES);
  const { asset } = REQ.user;
  const docSyncAfterRefreshKey = 'documentSyncAfterDocumentRefresh';
  let docSyncAfterRefreshRunStatus = false;
  let authorisationToRun = false;
  const specificVersion = REQ
    && REQ.params
    && REQ.params.versionTarget
    && (`${REQ.params.versionTarget}`).trim().length > 0
    && (`${REQ.params.versionTarget}`).indexOf('Specific Version') === -1
    ? REQ.params.versionTarget
    : 'ALL';
  // Authorisation to run - BEGIN
  const releaseSettings = new adp.models.ReleaseSettings();

  await releaseSettings.getReleaseSettings('releaseDocumentRefreshIntegration')
    .then((AUTHORISATION) => {
      if (Array.isArray(AUTHORISATION.docs) && AUTHORISATION.docs.length === 1) {
        const authorisation = AUTHORISATION.docs[0];
        authorisationToRun = authorisation.isEnabled;
        if (authorisationToRun === false) {
          res.statusCode = 405;
          res.end(JSON.stringify(authorisation.value.message));
          const endTimer = new Date();
          const endMessage = 'Document Refresh Integration does not have authorisation to run';
          const endObject = {
            asset_id: asset._id,
            asset_name: asset.name,
            totalTimer: `${endTimer.getTime() - timer.getTime()}ms`,
            asset,
          };
          adp.echoLog(endMessage, endObject, 405, packName, true);
        }
      }
    })
    .catch((ERROR) => {
      const endTimer = new Date();
      const endMessage = 'Document Refresh End ( Error )';
      const endObject = {
        asset_id: asset._id,
        asset_name: asset.name,
        error: ERROR,
        origin: 'releaseSettings.getReleaseSettings @ adp.models.ReleaseSettings',
        totalTimer: `${endTimer.getTime() - timer.getTime()}ms`,
        asset,
      };
      adp.echoLog(endMessage, endObject, 500, packName, true);
    });
  // Authorisation to run - END

  // Fetching Status whether to run Document Sync After Document Refresh
  await releaseSettings.getReleaseSettings(docSyncAfterRefreshKey)
    .then((docSyncAfterRefresh) => {
      if (Array.isArray(docSyncAfterRefresh.docs) && docSyncAfterRefresh.docs.length === 1) {
        const permissionToRun = docSyncAfterRefresh.docs[0];
        docSyncAfterRefreshRunStatus = permissionToRun.isEnabled;
      } else {
        const error = 'No documentSyncAfterDocumentRefresh Object Found';
        errorLog(
          500,
          error,
          { error, key: docSyncAfterRefreshKey, docSyncAfterRefresh },
          'documentRefresh',
          this.packname,
        );
      }
    }).catch((error) => {
      errorLog(
        error.code || 500,
        error.message || 'Failed to fetch documentSyncAfterDocumentRefresh setting',
        { error, key: docSyncAfterRefreshKey },
        'documentRefresh',
        this.packname,
      );
    });

  if (authorisationToRun) {
    const uniqueJobGroupObjective = `${asset.slug}__${(new Date()).getTime()}`;
    const objectiveForDocRefresh = `documentRefresh_${uniqueJobGroupObjective}`;
    const objectiveForDocSync = `documentSync_${uniqueJobGroupObjective}`;
    const objectiveForMimerSync = `mimerDocumentSync_${uniqueJobGroupObjective}`;

    adp.queue.addJob(
      'documentRefresh',
      asset._id,
      'adp.integration.documentRefresh.update',
      [asset, objectiveForDocRefresh, specificVersion],
      objectiveForDocRefresh,
    )
      .then(async (RESULT) => {
        const returnData = {
          // eslint-disable-next-line no-underscore-dangle
          status: 200,
          id: asset._id,
          name: asset.name,
          message: RESULT.statusMessage ? RESULT.statusMessage : 'The request to update the documents of this microservice was inserted in our queue.',
          queueStatusLink: RESULT.queueStatusLink,
          queueStatusLinkMimerSync: null,
          queueStatusLinkDocSync: null,
          errors: {
            development: [],
            release: [],
          },
          quant_errors: 0,
          warnings: {
            development: [],
            release: [],
          },
          quant_warnings: 0,
        };
        await adp.queue.startJobs()
          .catch((ERROR) => {
            const errorCode = ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.queue.startJobs ]';
            const errorData = {
              error: ERROR,
              asset,
            };
            errorLog(errorCode, errorMessage, errorData, 'main', packName);
          });
        if (docSyncAfterRefreshRunStatus !== true) {
          res.statusCode = 200;
          delete returnData.queueStatusLinkDocSync;
          const mimerQueue = await adp.mimer.updateDocumentMenu(asset._id, specificVersion === 'ALL' ? true : false, specificVersion, objectiveForMimerSync);
          if (mimerQueue && mimerQueue.queueStatusLink) {
            returnData.queueStatusLinkMimerSync = mimerQueue.queueStatusLink;
          }
          res.end(JSON.stringify(returnData));
        } else {
          const mimerQueue = await adp.mimer.updateDocumentMenu(asset._id, specificVersion === 'ALL' ? true : false, specificVersion, objectiveForMimerSync);
          if (mimerQueue && mimerQueue.queueStatusLink) {
            returnData.queueStatusLinkMimerSync = mimerQueue.queueStatusLink;
          }
          //const queueObjective = `${asset.slug}__${(new Date()).getTime()}`;
          const mission = 'microserviceDocumentsElasticSync';
          const target = asset._id;
          const command = 'adp.microservice.synchronizeDocumentsWithElasticSearch.add';
          const params = [[asset._id], null, null, objectiveForDocSync, specificVersion, 'syncIntegration', 'microserviceDocumentsElasticSync', 'microservice'];
          await adp.queue.addJob(mission, target, command, params, objectiveForDocSync, 0, 1)
            .then((AFTERJOBADDED) => {
              returnData.queueStatusLinkDocSync = adp.queue
                .obtainObjectiveLink(AFTERJOBADDED.queue, true);
              res.statusCode = 200;
              res.end(JSON.stringify(returnData));
              adp.queue.startJobs()
                .catch((ERROR) => {
                  errorLog(
                    ERROR && ERROR.code ? ERROR.code : 500,
                    ERROR && ERROR.message ? ERROR.message : 'Unable to start the queue',
                    { id: asset._id, error: ERROR },
                    'updateAfterDocumentRefresh',
                    packName,
                  );
                });
            })
            .catch((ERROR) => {
              errorLog(
                ERROR && ERROR.code ? ERROR.code : 500,
                ERROR && ERROR.message ? ERROR.message : 'Unable to add a JOB to the queue',
                { id: asset._id, error: ERROR },
                'updateAfterDocumentRefresh',
                packName,
              );
            });
        }
      })
      .catch((ERROR) => {
        const errorCode = ERROR.code ? ERROR.code : 500;
        const errorMessage = ERROR.message ? ERROR.message : 'Error on [ adp.queue.addJob ]';
        const errorData = {
          error: ERROR,
          asset,
        };
        errorLog(errorCode, errorMessage, errorData, 'main', packName);
        const returnData = {
          status: errorCode,
          id: asset._id,
          name: asset.name,
          message: 'Internal Server Error',
        };
        res.statusCode = 500;
        res.end(JSON.stringify(returnData));
      });
  }
};
