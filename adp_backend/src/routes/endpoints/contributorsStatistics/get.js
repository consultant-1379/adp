// ============================================================================================= //
/**
* [ adp.endpoints.contributorsStatistics.get ]
* Returns one <b>microservice</b> following the ID.
* @param {String} inline ID or slug of the MicroService.
* @return {object} Result of the request.
* @group ContributorsStatistics
* @route GET /contributorsstatistics
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
// /**
//  * @swagger
//  * /contributorsStatistics/{ID / Slug}:
//  *    get:
//  *      description: Gets contribution statistics based on the given microservice ID or Slug
//  *      responses:
//  *        '200':
//  *          $ref: '#/components/responses/Ok'
//  *        '401':
//  *          $ref: '#/components/responses/Unauthorized'
//  *        '403':
//  *          $ref: '#/components/responses/Forbidden'
//  *        '500':
//  *          $ref: '#/components/responses/InternalServerError'
//  *      tags:
//  *        - InnerSource Contributions
//  *    parameters:
//  *      - name: ID / Slug
//  *        in: path
//  *        description: Enter Microservice ID / Slug
//  *        required: true
//  *        schema:
//  *          type: string
//  *          format: string
//  */
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
const contributorsStatistics = require('./../../../../tools/gerritContributorsStatistics/startFunction');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.contributorsStatistics.get';
  const res = global.adp.setHeaders(RES);
  let myMicroServiceID = null;
  if (REQ.params !== undefined && REQ.params !== null) {
    if (REQ.params.id !== undefined && REQ.params.id !== null) {
      myMicroServiceID = `${REQ.params.id}`;
    }
  }
  if (myMicroServiceID === null || myMicroServiceID === undefined) {
    const answer = new adp.Answers();
    answer.setCode(400);
    res.statusCode = 400;
    answer.setMessage('400 Bad Request');
    answer.setTotal(0);
    answer.setCache('Not from Cache');
    answer.setSize(0);
    answer.setData('Bad Request Error: The id/slug of the Asset cannot be null or undefined');
    answer.setTime((new Date()).getTime() - timer);
    res.end(answer.getAnswer());
    adp.echoLog('Bad Request Error', { id: `${myMicroServiceID}`, typeOfId: `${typeof myMicroServiceID}` }, 400, packName, false);
    return;
  }
  const executionID = adp.dateFormat(new Date(), true);
  adp.contributions.progress(myMicroServiceID, executionID, 'START', 'SELF')
    .then((RESULTID) => {
      const progress = {
        progress_id: RESULTID,
        progress_status: adp.contributions.contributorsStatisticsProgress[RESULTID],
        progress_message: `Use the endpoint '(...)/contributorsstatisticsprogress/${RESULTID}' to check the updates from this process or just '(...)/contributorsstatisticsprogress' to request all.`,
      };
      const answer = new adp.Answers();
      answer.setCode(200);
      res.statusCode = 200;
      answer.setMessage('200 Ok');
      answer.setTotal(Object.keys(progress).length);
      answer.setCache('Not from Cache');
      answer.setSize(adp.getSizeInMemory(progress));
      answer.setData(progress);
      answer.setTime((new Date()).getTime() - timer);
      res.end(answer.getAnswer());

      contributorsStatistics(myMicroServiceID)
        .then(() => {
          const endTimer = (new Date()).getTime() - timer;
          adp.echoLog(`Contributors Statistics script done in ${endTimer}ms`, null, 200, packName, false);
          adp.contributions.progress(myMicroServiceID, executionID, 'END');
        })
        .catch((ERROR) => {
          const errorText = 'Error in [ contributorsStatistics ]';
          const errorOBJ = {
            parameter: myMicroServiceID,
            error: ERROR,
          };
          adp.echoLog(errorText, errorOBJ, 500, packName, true);
          adp.contributions.progress(myMicroServiceID, executionID, 'CRASH');
        });
    })
    .catch((ERROR) => {
      const errorText = 'Error in [ adp.contributions.progress ]';
      const errorOBJ = {
        myMicroServiceID,
        executionID,
        status: 'START',
        target: 'SELF',
        error: ERROR,
      };
      adp.echoLog(errorText, errorOBJ, 500, packName, true);
      adp.contributions.progress(myMicroServiceID, executionID, 'CRASH');
    });
};
// ============================================================================================= //
