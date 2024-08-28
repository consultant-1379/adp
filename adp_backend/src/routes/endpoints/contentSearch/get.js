// ============================================================================================= //
/**
* [ adp.endpoints.contentSearch.get ]
* This endpoint will validate some variables, check if RBAC objects are valid
* and then calls the class to execute the Elastic Search query.
*
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/**
 * @swagger
 * /contentSearch:
 *    get:
 *      description: This endpoint shows the searched keyword content in JSON on the browser
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
 *        - Search
 *    parameters:
 *      - name: keyword
 *        in: query
 *        description: Enter keyword to search
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: type
 *        in: query
 *        description: Enter type to filter search result
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: page
 *        in: query
 *        description: Number of the page to be skipped
 *        schema:
 *          type: integer
 *      - name: pagesize
 *        in: query
 *        description: Number of results to be shown per page
 *        schema:
 *          type: integer
 *      - name: title_slug
 *        in: query
 *        description: Microservice-Documentation title slug
 *      - name: asset_slug
 *        in: query
 *        description: Microservice name slug
 *      - name: version
 *        in: query
 *        description: Microservice-Documentation version
 */
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('./../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const res = adp.setHeaders(RES);
  const packName = 'adp.endpoints.contentSearch.get';

  const userRequestSignum = REQ
    && REQ.userRequest
    && REQ.userRequest.signum
    ? REQ.userRequest.signum
    : null;

  if (!userRequestSignum) {
    const errorCode = 500;
    const errorMessage = 'Error got on main function because the user is not defined.';
    const errorObject = {
      error: 'The signum of userRequest is undefined/null and the request cannot proceed.',
    };
    const errorOrigin = 'main';
    errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
    const answer = new adp.Answers();
    answer.setCode(errorCode);
    answer.setCache('Not from Cache');
    answer.setMessage(`${errorCode} - Unexpected Error`);
    answer.setTime((new Date()).getTime() - timer);
    res.statusCode = answer.getCode();
    const resAnswer = answer.getAnswer();
    res.end(resAnswer);
    return;
  }

  const theType = (REQ && REQ.query && REQ.query.type) && (REQ.query.type === 'page' || REQ.query.type === 'tutorials' || REQ.query.type === 'assets'
  || REQ.query.type === 'ms_documentation')
    ? REQ.query.type : 'all';

  const isAdmin = REQ
    && REQ.rbac
    && REQ.rbac[userRequestSignum]
    && REQ.rbac[userRequestSignum].admin
    ? REQ.rbac[userRequestSignum].admin
    : false;

  const microservices = REQ
    && REQ.rbac
    && REQ.rbac[userRequestSignum]
    && REQ.rbac[userRequestSignum].allowed
    && REQ.rbac[userRequestSignum].allowed.assets
    ? REQ.rbac[userRequestSignum].allowed.assets
    : null;
  const contents = REQ
    && REQ.rbac
    && REQ.rbac[userRequestSignum]
    && REQ.rbac[userRequestSignum].allowed
    && REQ.rbac[userRequestSignum].allowed.contents
    ? REQ.rbac[userRequestSignum].allowed.contents
    : null;


  let contentPermissionID = [];

  if (!isAdmin && (theType === 'assets' || theType === 'ms_documentation')) {
    contentPermissionID = microservices;
  } else if (!isAdmin && theType === 'all') {
    if (contents && microservices) {
      contentPermissionID = contents.concat(microservices);
    } else {
      contentPermissionID = null;
    }
  } else if (!isAdmin) {
    contentPermissionID = contents;
  }

  if (!contentPermissionID) {
    const errorCode = 403;
    const errorMessage = 'Error got on main function because the user permissions are not found.';
    const errorObject = {
      error: 'This user doesn`t have permission to access any content.',
    };
    const errorOrigin = 'main';
    errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
    const answer = new adp.Answers();
    answer.setCode(errorCode);
    answer.setCache('Not from Cache');
    answer.setMessage('403 forbidden');
    answer.setTime((new Date()).getTime() - timer);
    res.statusCode = answer.getCode();
    const resAnswer = answer.getAnswer();
    res.end(resAnswer);
    return;
  }

  const theKeyword = REQ && REQ.query && REQ.query.keyword
    ? REQ.query.keyword
    : '';

  const titleSlug = REQ && REQ.query && REQ.query.title_slug
    ? REQ.query.title_slug
    : '';

  const assetSlug = REQ && REQ.query && REQ.query.asset_slug
    ? REQ.query.asset_slug
    : '';

  const version = REQ && REQ.query && REQ.query.version
    ? REQ.query.version
    : '';

  const thePageSize = REQ && REQ.query && REQ.query.pagesize
    ? REQ.query.pagesize
    : 20;

  const thePage = REQ && REQ.query && REQ.query.page && REQ.query.page > 0
    ? REQ.query.page
    : 1;

  const skipDocuments = (thePage - 1) * thePageSize;

  const contentSearch = new adp.contentSearch.ESearchClass();
  contentSearch.search(
    theKeyword,
    contentPermissionID,
    theType,
    skipDocuments,
    thePageSize,
    true,
    titleSlug,
    assetSlug,
    version,
  )
    .then((RESULT) => {
      const answer = new adp.Answers();
      answer.setCode(200);
      answer.setCache('Not from Cache');
      answer.setMessage('200 - Search Successful');
      answer.setTotal(RESULT.total);
      answer.setData(RESULT.result);
      answer.setSize(adp.getSizeInMemory(RESULT.result));
      answer.setLimit(thePageSize);
      answer.setPage(thePage);
      answer.setTime((new Date()).getTime() - timer);
      res.statusCode = answer.getCode();
      const resAnswer = answer.getAnswer();
      res.end(resAnswer);
      adp.echoLog(`Elastic Search full process in ${((new Date()).getTime() - timer)}ms`, null, 200, packName, false);
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'Error got on main function';
      const errorObject = {
        error: ERROR,
        keyword: theKeyword,
        contentPermissionID,
        skipDocuments,
        pageSize: thePageSize,
        type: theType,
      };
      const errorOrigin = 'main';
      errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
      const answer = new adp.Answers();
      answer.setCode(errorCode);
      answer.setCache('Not from Cache');
      answer.setMessage(`${errorCode} - Unexpected Error`);
      answer.setTime((new Date()).getTime() - timer);
      res.statusCode = answer.getCode();
      const resAnswer = answer.getAnswer();
      res.end(resAnswer);
    });
};
// ============================================================================================= //
