// ============================================================================================= //
/**
* [ global.adp.endpoints.userProgress.delete ]
* Delete a specific status of progress for a specific user
* @param {String} Authorization as string on the header of the request.
* Add a header variable with the name <b>Authorization</b> with the string "Bearer <b>TOKEN</b>".
* <br/> Don't forget the space between the word <b>Bearer</b> and the <b>token</b>.
* @param {String} Header Add "Content-Type" on Header with the value " application/json ".
* The WID should be sent in the url: /api/userprogress/WID
* Examples:
* /api/userprogress/8125
* /api/userprogress/16
* /api/userprogress/7159
* @return 201 - Status deleted successfully
* @return 400 - Bad Request
* @return 500 - Internal Server Error
* @group userProgress
* @route DELETE /userprogress
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
global.adp.docs.rest.push(__filename);
// ============================================================================================= //
module.exports = async (REQ, RES) => {
  const startTimer = new Date();
  const packName = 'global.adp.endpoints.userProgress.delete';
  const res = global.adp.setHeaders(RES);
  const answer = new global.adp.Answers();
  let { wid } = REQ.params;
  if (wid === undefined || wid === null || wid === '' || wid === {} || Array.isArray(wid)) {
    const errorText = 'Bad Request: wid is not valid';
    const errorObject = {
      wid,
      widType: `${typeof wid}`,
      params: REQ.params,
    };
    adp.echoLog(errorText, errorObject, 400, packName, true);
    res.statusCode = 400;
    answer.setCode(400);
    answer.setMessage('Bad Request');
    res.end(answer.getAnswer());
    return;
  }
  const { alternative } = REQ.query;
  let alternativeMode = false;
  if (alternative === true || alternative === 'true') {
    alternativeMode = true;
  }
  wid = `${wid}`;
  global.adp.permission.getUserFromRequestObject(REQ)
    .then((USER) => {
      const { signum } = USER;
      global.adp.userProgress.delete.deleteRecord(signum, wid, REQ.rbac, alternativeMode)
        .then((RESULT) => {
          answer.setCode(200);
          answer.setData(RESULT);
          answer.setMessage('Progress successful deleted!');
          const timer = (new Date()).getTime() - startTimer.getTime();
          answer.setCache(`Not from Cache - ${timer}ms`);
          res.statusCode = 200;
          res.end(answer.getAnswer());
        })
        .catch((ERROROBJ) => {
          adp.echoLog('Error calling [ global.adp.userProgress.delete ]', { error: ERROROBJ }, 500, packName, true);
          res.statusCode = ERROROBJ.code;
          answer.setCode(ERROROBJ.code);
          answer.setMessage(ERROROBJ.msg);
          answer.setData(ERROROBJ.data);
          res.end(answer.getAnswer());
        });
    })
    .catch((ERROR) => {
      adp.echoLog('Error calling [ global.adp.permission.getUserFromRequestObject ]', { error: ERROR }, 500, packName, true);
      answer.setCode(500);
      answer.setMessage('500 Internal Server Error');
      res.statusCode = 500;
      res.end(answer.getAnswer());
    });
};
// ============================================================================================= //
