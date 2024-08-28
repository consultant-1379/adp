// ============================================================================================= //
/**
* [ adp.innerSource.userHistory ]
* Retrieve the last reading commit status of selected Asset.
* @param {String} SIGNUM of user
* @param {String} DATE for which snapshot is to be fetched
* @return {JSON} Returns a JSON Object containing the information.
* @author Omkar
*/
// ============================================================================================= //
global.adp.docs.list.push(__filename);
// ============================================================================================= //
module.exports = (SIGNUM, DATE) => new Promise((RESOLVE, REJECT) => {
  const rejectResp = (msg, code = 500) => {
    const rejRep = {
      msg,
      code,
    };
    REJECT(rejRep);
    return false;
  };
  let date = 'all';

  if (!SIGNUM || typeof SIGNUM !== 'string') {
    return rejectResp('SIGNUM should be String', 400);
  }
  if (DATE) {
    if (typeof DATE !== 'string') {
      return rejectResp('DATE value should be String', 400);
    }
    if (!/^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/gi.test(DATE) && DATE !== 'all' && DATE !== 'latest') {
      return rejectResp('DATE should be in YYYY-MM-DD Format or "all" or "latest"', 400);
    }
    date = DATE.toLowerCase().trim();
  }

  const signum = SIGNUM.toLowerCase().trim();
  const dbModel = new adp.models.InnersourceUserHistory();
  const timer = new Date();
  const packName = 'adp.innerSource.userHistory';
  return dbModel.getUserSnapshot(signum, date)
    .then((SNAPSHOTRESP) => {
      RESOLVE(SNAPSHOTRESP.docs);
    })
    .catch((ERROR) => {
      const errorText = `Error in [ dbModel.getUserSnapshot] in ${(new Date()) - timer}ms`;
      const errorObj = {
        params: { signum, date },
        error: ERROR,
      };
      adp.echoLog(errorText, errorObj, 500, packName, true);
      rejectResp('Internal Server Error', 500);
    });
});
// ============================================================================================= //
