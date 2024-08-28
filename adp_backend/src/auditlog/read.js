// ============================================================================================= //
/**
* [ global.adp.auditlog.read ]
* Retrieve audit log by the given log id
* @param {String} id the id of the required log file
* @return {JSON} Returns a JSON Object containing the information of the single log.
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = REQ => new Promise(async (RESOLVE) => {
  const startedAt = new Date();
  const returnClass = new global.adp.Answers();
  const packName = 'global.adp.auditlog.read';
  let resultOfQuery = [];

  const errorResponse = (OBJ) => {
    returnClass.setCode(OBJ.code);
    returnClass.setCache('Not from Cache');
    returnClass.setMessage(OBJ.message);
    returnClass.setTotal(0);
    returnClass.setData(null);
    returnClass.setSize(0);
    returnClass.setLimit(0);
    returnClass.setPage(0);
    RESOLVE(returnClass);
  };

  if (REQ.params === null || REQ.params === undefined) {
    return errorResponse({
      code: 400,
      message: '400 - Bad Request',
    });
  }

  if (REQ.params.id === null || REQ.params.id === undefined) {
    return errorResponse({
      code: 400,
      message: '400 - Bad Request',
    });
  }

  const sendResult = (RETURNEDLOGDATA) => {
    returnClass.setCode(200);
    returnClass.setCache('Not from Cache');
    returnClass.setMessage('200 - Search Successful');
    returnClass.setTotal(RETURNEDLOGDATA.resultsReturned);
    returnClass.setData(resultOfQuery);
    returnClass.setSize(global.adp.getSizeInMemory(resultOfQuery));
    returnClass.setLimit(1);
    returnClass.setPage(1);
    const theEndTime = new Date() - startedAt;
    returnClass.setTime(theEndTime);
    adp.echoLog(`Finish auditlog fetch in ${theEndTime}ms`, null, 200, packName);
    RESOLVE(returnClass);
  };

  const adpLogModel = new adp.models.AdpLog();
  await adpLogModel.getLogByID(`${REQ.params.id}`)
    .then(async (returnedLogData) => {
      resultOfQuery = returnedLogData.docs;
      // - - - User Permission After Search : BEGIN - - - - - - - - - - - - - - - - - - - - - - -//
      await global.adp.permission.canDoIt(REQ, null)
        .then(() => {
          sendResult(resultOfQuery);
        })
        .catch(() => {
          const notAdminSignum = REQ.user.docs[0]._id; // eslint-disable-line no-underscore-dangle
          let isOwner = (resultOfQuery[0].signum.trim().toLowerCase() === notAdminSignum
            .trim().toLowerCase());
          if (!isOwner) {
            if (Array(resultOfQuery[0].new.team)) {
              resultOfQuery[0].new.team.forEach((e) => {
                if (e.signum.trim().toLowerCase() === notAdminSignum.trim().toLowerCase()
                  && e.serviceOwner === true) {
                  isOwner = true;
                }
              });
            }
          }
          if (isOwner) {
            sendResult(resultOfQuery);
          } else {
            return errorResponse({
              code: 401,
              message: '401 - Unauthorized',
            });
          }
          return '';
        });
      // - - - User Permission After Search : END - - - - - - - - - - - - - - - - - - - - - - - -//
    })
    .catch(ERROR => errorResponse({
      code: 500,
      message: ERROR,
    }));
  return false;
});
// ============================================================================================= //
