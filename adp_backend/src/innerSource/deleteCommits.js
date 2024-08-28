const { startDateEndDateValidation } = require('../library/validations/index');

const packageName = 'adp.innersource.deleteCommits';

/**
 * This function is used to call db function in model which deletes the commits
 * Here, assumption is that the signum and msSLug are already validated in middleware,
 * so to reuse this method, middleware before that should be called and validated
 * @param {string} startdate from which commits to be deleted
 * @param {string} enddate till which commits to be deleted
 * @param {string} signum of user for which commits to be deleted
 * @param {string} msSlug of microservice for which commits to be deleted
 * @param {string} actionUser user that is performing the action
 * @returns DB function to delete commits from model
 * @author Omkar Sadegaonkar [zsdgmkr]
 */
module.exports = (startdate, enddate, signum, msSlug, actionUser) => new Promise((RES, REJ) => {
  const dateValidation = startDateEndDateValidation(startdate, enddate);
  if (dateValidation !== true) {
    const errResp = {
      code: 400,
      message: dateValidation,
    };
    REJ(errResp);
    adp.echoLog(
      errResp.message,
      {
        startdate, enddate, signum, msSlug, actionUser,
      },
      errResp.code,
      packageName,
    );
    return;
  }
  const dbModel = new adp.models.Gitstatus();
  dbModel.deleteCommit(startdate, enddate, signum, msSlug).then(() => {
    const dbModelAdplog = new adp.models.AdpLog();
    RES();
    const log = {
      type: 'innersourceDeleteCommits',
      actionUser,
      datetime: new Date(),
      signum,
      msSlug,
      startdate,
      enddate,
    };
    return dbModelAdplog.createOne(log)
      .then((expect) => {
        if (expect.ok === true) {
          return true;
        }
        return false;
      })
      .catch(() => false);
  })
    .catch((ERROR) => {
      const error = {
        message: '',
        code: 500,
      };
      error.message = ERROR && ERROR.message ? ERROR.message : 'Error while deleting commits';
      error.code = ERROR && ERROR.code ? ERROR.code : 500;
      REJ(error);
      const data = {
        startdate, enddate, signum, msSlug, origin: 'dbModel.deleteCommit',
      };
      adp.echoLog(error.message, data, error.code, packageName);
    });
});
