// ============================================================================================= //
/**
* [ adp.endpoints.microservices.get ]
* Without parameters, returns all <b>microservices</b> by default.
* Using <b>GET parameters</b>, is possible to <b>FILTER</b> the level 1 attributes from Schema.
* Schema file: <b>/src/setup/schema_microservice.json</b>
* <br/><b>Filtering:</b>
* Just add a valid Schema field inline.<br/>
* Example: Returns all microservices where alignment is 2
* <b>/?alignment=2</b><br/>
* Is possible use an Array to filter more than one situation.
* Example: Returns all microservices where alignment is 1 or 3
* <b>/?alignment=1,3</b><br/>
* In case of strings, filter only works with full string.
* Example: Returns all microservices from category "Check before reuse"
* <b>/?category=Check before reuse</b>
* <br/><b>Searching:</b>
* Use <b>search</b> to perform a partial string search for all microservice information.
* <b>Fieldnames</b> and fields where contains only <b>URL</b> are removed before this test.
* This <b>search</b> is case insensitive.<br/>
* Example: Returns all microservices which contains the word "base"
* <b>/?search=base</b><br/>
* Example: Returns all microservices where the user etesuse is mentioned
* <b>/?search=etesuse</b>
* <br/><b>Pagination:</b>
* Use <b>page</b> to indicate which page you want to display, and
* <b>limit</b> to indicate the size of the page.<br/>
* Example: Returns the second page, where the size of the page is 5 items at maximum.
* <b>/?page=1&limit=5</b>
* <br/><b>Sorting:</b>
* Use <b>sort</b> to indicate which fields from schema should be used to order the result.<br/>
* Example: Sort by category.
* <b>/?sort=category</b><br/>
* Example: Sort by category (DESC).
* <b>/?sort=-category</b><br/>
* Example: Sort by category and then, sort by name.
* <b>/?sort=category,name</b><br/>
* Example: Sort by category, by alignment (DESC) and then, sort by name.
* <b>/?sort=category,-alignment,name</b><br/>
* <br/><b>Showing only the necessary:</b>
* Use <b>show</b> to indicate which fields from schema should be displayed.<br/>
* Example: Returns only the name.
* <b>/?show=name</b><br/>
* Example: Returns the name and description.
* <b>/?show=name,description</b>
* <br/><b>Combine these Options:</b>
* You can combine then, just writing inline.<br/>
* Example: Retrieving the second page, 10 items per page, sorted by
* categoria (ASC) following by name (ASC) and sending only name, category and description.
* <b>/?page=2&limit=10&sort=category,name&show=name,category,description</b><br/>
* Example: Retrieving the first page, 5 items per page, only from category
* "Fully supported for reuse" sorting by name ( DESC ) and showing all fields.
* <b>/?category=Fully supported for reuse&page=1&limit=5&sort=category,-name</b><br/>
* Example: Retrieving the first page, 100 items per page, only where
* alignment is 2 or 3. Sort by alignment (DESC) and then, by name (ASC).
* <b>/?alignment=2,3&page=1&limit=100&sort=-alignment,name&show=name,description</b><br/>
* Example: Retrieving the first page, 999 items per page ( at maximum ),
* only where alignment is 3 and contains the word "ata". Sort by name (ASC), show
* name and description.
* <b>/?search=ata&alignment=3&sort=name&show=name,description</b><br/>
* Example: Bringing results which contains the word
* "base". Sort by name, show name and description.
* <b>/?search=base&sort=name&show=name,description</b>
* <br/>Keep an eye on "<b>message</b>" field, on JSON return. He can bring errors and/or
* warnings, as an example, if the field is ignored because he is not in the <b>schema</b>.
* <br/>This <b>endpoint</b> does not show deleted microservices (Soft-Delete).
*
* UPDATE [ADPPRG-18544] Marketplace Uplift : Add 'Group By' as the configurable parameter
*
* New feature ( groupby ) was added in our traditional micro services list.
* So, to call all assets by group, we have:
* Service Category
* .../microservices?groupby=service_category
* Reusability Level
* .../microservices?groupby=reusability_level
* Service Area
* .../microservices?groupby=serviceArea
* No grouping:
* .../microservices
* For the Backend, groupby should be one parameter (string) with the name of a field from
* Microservice Schema and this field should be a group in listOptions. In case you try
* groupby=domain, please notice one domain should be missing, because this contains the
* adminOnly flag on listOptions.
*
* This is compatible with previous parameters, as example:
* Searching Assets where service_maturity is 1 or 2, group by Service Area and display
* only name and service_maturity.
* .../microservices?show=name,service_maturity&service_maturity=1,2&groupby=serviceArea
*
* @return 200 - Shows Microservices which are matching the mentioned criterion (if any).
* @return 500 - Internal Server Error.
* @return 404 - Microservices not found for the mentioned criterion (if any).
* @group Microservices in Marketplace
* @route GET /microservices
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /microservices:
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
 *        - Microservice
 *    parameters:
 *      - name: search
 *        in: query
 *        description: Enter keyword to search for microservice
 *        schema:
 *          type: string
 *      - name: sort
 *        in: query
 *        description: Select options for sorting order
 *        schema:
 *          type: string
 *          enum: [-date_created,date_created,-date_modified,date_modified]
 *      - name: groupby
 *        in: query
 *        description: Select options for grouping order
 *        schema:
 *          type: string
 *          default: reusability_level
 *          enum: [service_category,reusability_level,serviceArea]
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //

const { customMetrics } = require('../../../metrics/register');

module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const packName = 'adp.endpoints.microservices.get';
  adp.echoLog('Starting [ adp.microservices.search ]', null, 200, packName);
  const { signum } = REQ && REQ.user && REQ.user.docs
    ? REQ.user.docs[0] : { role: null, signum: null };
  const cacheObject = 'MARKETPLACESEARCHS';
  const cacheObjectID = `${REQ.url}`;
  const cacheHolderInMilliseconds = adp.masterCacheTimeOut.marketPlaceSearch * 1000;
  const res = adp.setHeaders(RES);
  adp.masterCache.get(cacheObject, signum, cacheObjectID, true)
    .then((CACHE) => {
      res.statusCode = CACHE.getServerStatus();
      res.setHeader('Content-Type', 'application/json');
      res.end(CACHE.getData());
      const answerSize = adp.getSizeInMemory(CACHE.getData(), true);
      const endTimer = (new Date()).getTime() - timer;
      adp.echoLog(`Answer from [ adp.microservices.search ] (${answerSize}) in ${endTimer}ms - from cache`, null, 200, packName);
      customMetrics.microservicesRequestMonitoringHistogram.observe({ type: 'hit' }, endTimer);
    })
    .catch(() => {
      const answer = new adp.Answers();
      let answerSize = '';
      adp.microservices.search(REQ).then((searchResp) => {
        answerSize = adp.getSizeInMemory(searchResp.data.docs, true);
        if (searchResp.total) {
          answer.setCode(200);
          answer.setCache('Not from Cache');
          answer.setMessage('200 - Search Successful');
          answer.setTotal(searchResp.total);
          answer.setData(searchResp.data.docs);
          answer.setSize(adp.getSizeInMemory(searchResp.data.docs));
          answer.setLimit(searchResp.limit);
          answer.setPage(searchResp.page);
          answer.setTime((new Date()).getTime() - timer);
        } else {
          answer.setCode(404);
          answer.setCache('Not from Cache');
          answer.setMessage('Nothing was found using this criteria.');
          answer.setTotal(searchResp.total);
          answer.setData(searchResp.data.docs);
          answer.setSize(adp.getSizeInMemory(searchResp.data.docs));
          answer.setLimit(searchResp.limit);
          answer.setPage(searchResp.page);
          answer.setTime((new Date()).getTime() - timer);
        }
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = answer.getCode();
        const resAnswer = answer.getAnswer();
        res.end(resAnswer);
        answer.setTime((new Date()).getTime() - timer);
        answer.setCache('From Cache');
        const answerToCache = answer.getAnswer();
        adp.masterCache.set(
          cacheObject,
          signum,
          cacheObjectID,
          answerToCache,
          cacheHolderInMilliseconds,
          res.statusCode,
        );
        const endTimer = (new Date()).getTime() - timer;
        customMetrics.microservicesRequestMonitoringHistogram.observe({ type: 'miss' }, endTimer);
        adp.echoLog(`Answer from [ adp.microservices.search ] (${answerSize}) in ${endTimer}ms - not from cache`, null, 200, packName);
      }).catch((searchError) => {
        answer.setCode(searchError.code ? searchError.code : 500);
        answer.setCache('Not from Cache');
        answer.setMessage(searchError.message ? searchError.message : 'Failure during search query.');
        res.statusCode = answer.getCode();
        res.end(answer.getAnswer());
      });
    });
};
// ============================================================================================= //
