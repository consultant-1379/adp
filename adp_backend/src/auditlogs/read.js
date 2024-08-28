// ============================================================================================= //
/**
* [ global.adp.auditlogs.read ]
* Retrieve audit log/s related to type and can be refined by the given parameters.
* @param {string} typeoroption (optional) type is the database log type e.g microservice,
* option would be byusersignum then a signum must be supplied as the id
* @param {string} id the id of the log type which is optional, if a option is defined as
* byusersignum then a signum must be passed
* @param {string} optiontype (optional) only used for typeoroption defined as byusersignum,
* this will be the log type to filter by e.g microservice
* @param {string} optiontypeid (optional) only used for typeoroption defined as byusersignum,
* the type id will refine the log type by its id
* @return {JSON} Returns a JSON Object containing the information of the Log as requested.
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = REQ => new Promise(async (RESOLVE) => {
  const startedAt = new Date();
  const returnClass = new global.adp.Answers();
  const packName = 'global.adp.auditlogs.read';
  let resultOfQuery = [];
  let paginationSkip = 0;
  let paginationLimit = 9999999;
  let pageinationPage = 0;

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
    return '';
  };

  if (REQ.params === null || REQ.params === undefined) {
    return errorResponse({
      code: 400,
      message: '400 - Bad Request',
    });
  }

  let signum;
  let type;
  let assetID;
  if (REQ.params.typeoroption !== undefined && REQ.params.typeoroption !== null) {
    const typeOrOption = REQ.params.typeoroption;
    if (typeOrOption === 'byusersignum') {
      if (REQ.params.id !== undefined && REQ.params.id !== null) {
        signum = REQ.params.id.trim().toLowerCase();
        if (REQ.params.optiontype !== undefined && REQ.params.optiontype !== null) {
          type = REQ.params.optiontype;
          if (REQ.params.optiontypeid !== undefined && REQ.params.optiontypeid !== null) {
            assetID = { _id: REQ.params.optiontypeid };
          }
        }
      } else {
        return errorResponse({
          code: 400,
          message: '400 - Bad Request',
        });
      }
    } else {
      type = typeOrOption;
      if (REQ.params.id !== undefined && REQ.params.id !== null) {
        assetID = { _id: REQ.params.id };
      }
    }
  }

  // filters
  if (REQ.query !== null && REQ.query !== undefined) {
    if (REQ.query.limit !== undefined && REQ.query.limit !== null) {
      paginationLimit = parseInt(REQ.query.limit, 10);
    }
    if (REQ.query.page !== undefined && REQ.query.page !== null) {
      pageinationPage = parseInt(REQ.query.page, 10);
    }
  }
  if (paginationLimit !== 9999999 && pageinationPage !== 0) {
    paginationSkip = (pageinationPage - 1) * paginationLimit;
  }

  // - - - User Permission : BEGIN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  let notAdminSignum;
  let isAdmin = false;
  await global.adp.permission.canDoIt(REQ, null)
    .then(() => {
      isAdmin = true;
    })
    .catch(() => {
      notAdminSignum = REQ.user.docs[0]._id; // eslint-disable-line no-underscore-dangle
      if (signum !== null && signum !== undefined && signum !== '') {
        if (signum.trim().toLowerCase() !== notAdminSignum.trim().toLowerCase()) {
          return errorResponse({
            code: 401,
            message: `401 - Unauthorized - You cannot search by [ ${signum} ]`,
          });
        }
      }
      signum = notAdminSignum;
      return '';
    });
  // - - - User Permission : END - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

  const adpLogModel = new adp.models.AdpLog();
  await adpLogModel.getLogs(signum, type, assetID, paginationLimit, paginationSkip, isAdmin)
    .then((returnedLogData) => {
      resultOfQuery = returnedLogData.docs.sort(global.adp.dynamicSort('-datetime'));
      returnClass.setCode(200);
      returnClass.setCache('Not from Cache');
      returnClass.setMessage('200 - Search Successful');
      returnClass.setTotal(returnedLogData.resultsReturned);
      returnClass.setData(resultOfQuery);
      returnClass.setSize(global.adp.getSizeInMemory(resultOfQuery));
      returnClass.setLimit(paginationLimit);
      returnClass.setPage(pageinationPage);
      const theEndTime = new Date() - startedAt;
      returnClass.setTime(theEndTime);
      adp.echoLog(`Finish auditlog fetch in ${theEndTime}ms`, null, 200, packName);

      RESOLVE(returnClass);
    }).catch(ERROR => errorResponse({
      code: 500,
      message: ERROR,
    }));
  return false;
});
// ============================================================================================= //
