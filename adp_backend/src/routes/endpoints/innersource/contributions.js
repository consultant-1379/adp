// ============================================================================================= //
/**
* [ adp.endpoints.innersource.contributions ]
* returns top <b>contributors</b> or <b>organisations</b> based on innersourceCategory
* key(organisation or cntributors)for all services based on filters passed as query params
* sample urls
* /innersource/organisations?startDate=2021-02-02&endDate=2021=04-05&domain=1&service_category=1,2
* /innersource/contributors?startDate=2021-02-02&endDate=2021=04-05&domain=1&service_category=1,2
* @return 200 - Shows top contributors/organisations for all services matching the search criteria.
* @return 500 - Internal Server Error.
* @return 404 - Contributors/Organisations not found for the mentioned criterion (if any).
* @group InnerSource
* @author Veerender Voskula
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const innersourceContributions = require('../../../innerSource/contributions.controller');
// ============================================================================================= //
// ============================================================================================= //
/**
 * @swagger
 * /innersource/contributors:
 *    get:
 *      description: Gives all the microservices as response object, By default groupby is
 *                   given with the reusablity level, and sort by is given with Default option
 *                   (Default is the service maturity latest and name from [A-z, a-z]).
 *                   If "No Grouping" in Group By and Default in Sort By options
 *                   are exempted from the below request as they
 *                   serve with null. These values (No grouping in groupby and Default in sort)
 *                  are equal to /microservices with out any parameters.
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
 *        - Innersource
 *    parameters:
 *      - name: fromDate
 *        in: query
 *        description: Enter fromDate
 *        schema:
 *          type: string
 *      - name: toDate
 *        in: query
 *        description: Enter toDate
 *        schema:
 *          type: string
 *      - name: service_category
 *        in: query
 *        description: Service category
 *        schema:
 *          type: string
 *          default: 1,2
 */
// ============================================================================================= //
/** returns prepared Answers with response, code, message and start timer
 * @param  {string} statusCode
 * @param  {object} searchResp
 * @param  {date} startTimer
 * @param  {string} message
 * @param  {string} cacheText
 * @returns {Answers} prepared answer
 * @author Veerender
 */
const prepareAnswerWith = (statusCode, searchResp, startTimer, message, cacheText) => {
  const answer = new adp.Answers();
  answer.setCode(statusCode);
  answer.setCache(cacheText);
  answer.setMessage(message);
  answer.setTotal(searchResp.total);
  answer.setData(searchResp.data);
  answer.setSize(adp.getSizeInMemory(searchResp.data));
  answer.setLimit(searchResp.limit);
  answer.setPage(searchResp.page);
  answer.setTime((new Date()).getTime() - startTimer.getTime());
  return answer;
};

module.exports = (REQ, RES, innersourceCategory) => {
  const startTimer = new Date();
  const packName = 'adp.endpoints.innersource.contributions';
  const cacheObject = 'INNERSOURCECONTRIBS';
  const cacheObjectID = `${REQ.url}`;
  const {
    setHeaders, echoLog, masterCacheTimeOut: { innersourceContribsSearch }, masterCache,
  } = adp;
  const cacheHolderInMilliseconds = innersourceContribsSearch * 1000;
  const res = setHeaders(RES);

  masterCache.get(cacheObject, null, cacheObjectID, true)
    .then((CACHE) => {
      // Cache was found for innersource organisations
      res.statusCode = CACHE.getServerStatus();
      res.setHeader('Content-Type', 'application/json');
      res.end(CACHE.getData());
      const endTimer = (new Date()).getTime() - startTimer.getTime();
      const text = `Answer from [ adp.innersource.contributions ] in ${endTimer}ms - from cache`;
      const successOBJ = { cacheObjectID, origin: 'endpoints.innersource.contributions' };
      echoLog(text, successOBJ, 200, packName);
    })
    .catch(async () => {
      const queryParams = REQ.query;
      await innersourceContributions.contributions(queryParams, innersourceCategory)
        .then((searchResp) => {
          let answer = {};
          if (searchResp.total) {
            answer = prepareAnswerWith(200, searchResp, startTimer, '200 - Search Successful', 'Not from Cache');
          } else {
            answer = prepareAnswerWith(404, searchResp, startTimer, 'Nothing was found using this criteria.', 'Not from Cache');
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = answer.getCode();
          const resAnswer = answer.getAnswer();
          res.end(resAnswer);
          answer.setTime((new Date()).getTime() - startTimer.getTime());
          answer.setCache('From Cache');
          const answerToCache = answer.getAnswer();
          masterCache.set(
            cacheObject,
            null,
            cacheObjectID,
            answerToCache,
            cacheHolderInMilliseconds,
            res.statusCode,
          );
          const endTimer = (new Date()).getTime() - startTimer.getTime();
          echoLog(`Answer from [ adp.innersource.contributions ] in ${endTimer}ms - not from cache`, null, 200, packName);
        }).catch((error) => {
          const { code, message } = error;
          const answer = new adp.Answers();
          answer.setCode(code);
          answer.setCache('Not from Cache');
          answer.setMessage(message);
          const endTimer = (new Date()).getTime() - startTimer.getTime();
          answer.setTime(endTimer);
          adp.echoLog(message, { queryParams, origin: 'endpoints.innersource.contributions' }, code, packName);
          res.end(answer.getAnswer());
        });
    });
};
