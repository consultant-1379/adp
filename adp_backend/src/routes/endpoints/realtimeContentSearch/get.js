/**
* [ adp.endpoints.realtimeContentSearch.get ]
* Realtime Content Search validates the keyword and then sends a
* request to Elasticsearch with the search token
*
* @route GET /realtime-contentsearch
* @author Michael Coughlan [zmiccou]
*/
// ============================================================================================= //
adp.docs.rest.push(__filename);
// ============================================================================================= //
const errorLog = require('../../../library/errorLog');
// ============================================================================================= //
module.exports = (REQ, RES) => {
  const timer = (new Date()).getTime();
  const res = adp.setHeaders(RES);
  const packName = 'adp.endpoints.realtimeContentSearch.get';
  const endpointRequest = REQ;

  // Retrieve the user signum
  const userRequestSignum = endpointRequest
    && endpointRequest.userSignum
    ? endpointRequest.userSignum
    : null;

  if (!userRequestSignum) {
    const errorCode = 500;
    const errorMessage = 'Error received on main function as the user is not defined.';
    const errorObject = {
      error: 'The signum of userRequestSignum is undefined/null and the request cannot proceed.',
    };
    const errorOrigin = 'main';

    errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);

    const answer = new adp.Answers();
    answer.setCode(errorCode);
    answer.setCache('Not from Cache');
    answer.setMessage(`${errorCode} - Error occurred as the user is not defined`);
    answer.setTime((new Date()).getTime() - timer);
    res.statusCode = answer.getCode();
    const resAnswer = answer.getAnswer();
    RES.end(resAnswer);

    return;
  }

  // Check if the authenticated user is an admin
  const isAdmin = endpointRequest
    && endpointRequest.rbac
    && endpointRequest.rbac[userRequestSignum]
    && endpointRequest.rbac[userRequestSignum].admin
    ? endpointRequest.rbac[userRequestSignum].admin
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

  // If the user is not an admin, populate their allowed content array
  let contentPermissionID = [];

  if (!isAdmin) {
    if (contents && microservices) {
      contentPermissionID = contents.concat(microservices);
    } else {
      contentPermissionID = null;
    }
  }

  // If the user has no permissions associated with their account, return a 403 error
  if (!contentPermissionID) {
    const errorCode = 403;
    const errorMessage = 'Error on main function as the user permissions were not found.';
    const errorObject = {
      error: 'This user doesn\'t have permission to access any content.',
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
    RES.end(resAnswer);
    return;
  }

  const searchToken = REQ && REQ.query && REQ.query.keyword
    ? REQ.query.keyword
    : '';

  if (searchToken.length <= 1) {
    const answer = new adp.Answers();
    answer.setCode(200);
    answer.setCache('Not from Cache');
    answer.setMessage('200 - Search Successful');
    answer.setTotal(0);
    answer.setData([]);
    answer.setSize(adp.getSizeInMemory([]));
    answer.setLimit(8);
    answer.setPage(1);
    answer.setTime((new Date()).getTime() - timer);
    res.statusCode = answer.getCode();
    const resAnswer = answer.getAnswer();
    res.end(resAnswer);
    adp.echoLog(`Realtime Content Search process in ${((new Date()).getTime() - timer)}ms`, null, 200, packName, false);
    return;
  }

  const realtimeContentSearch = new adp.contentSearch.ESearchClass();

  realtimeContentSearch.realtimesearch(searchToken, contentPermissionID)
    .then((RESULT) => {
      const answer = new adp.Answers();
      answer.setCode(200);
      answer.setCache('Not from Cache');
      answer.setMessage('200 - Search Successful');
      answer.setTotal(RESULT.total);
      answer.setData(RESULT.result);
      answer.setSize(adp.getSizeInMemory(RESULT.result));
      answer.setTime((new Date()).getTime() - timer);
      res.statusCode = answer.getCode();
      const resAnswer = answer.getAnswer();
      res.end(resAnswer);
      adp.echoLog(`Realtime Content Search process in ${((new Date()).getTime() - timer)}ms`, null, 200, packName, false);
    })
    .catch((ERROR) => {
      const errorCode = ERROR.code || 500;
      const errorMessage = ERROR.message || 'This error occurred during the realtime search request.';
      const errorObject = {
        error: ERROR,
        keyword: searchToken,
        contentPermissionID: REQ.contentPermissionID,
      };

      const errorOrigin = 'main';
      errorLog(errorCode, errorMessage, errorObject, errorOrigin, packName);
      const answer = new adp.Answers();
      answer.setCode(errorCode);
      answer.setCache('Not from Cache');
      answer.setMessage(`${errorCode} - An error occurred during the realtime search request`);
      answer.setTime((new Date()).getTime() - timer);
      res.statusCode = answer.getCode();
      const resAnswer = answer.getAnswer();
      res.end(resAnswer);
    });
};
// ============================================================================================= //
