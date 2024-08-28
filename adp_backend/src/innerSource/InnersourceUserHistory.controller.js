const InnerSourceUserHistoryModel = require('../models/InnersourceUserHistory');
const errorLog = require('../library/errorLog');
const echoLog = require('../library/echoLog');

/**
 * [adp.innerSource.InnersourceUserHistory]
 * InnersourceUserHistory controller
 * @author Cein
 */
class InnersourceUserHistory {
  constructor() {
    this.packName = 'adp.innerSource.InnersourceUserHistory';
  }

  /**
   * Fetches a single snapshot after given date for a given user signum.
   * @param {string} signum user signum
   * @param {string} date date to start from in format YYYY-MM-DD
   * @returns {Promise<object>} the matched snapshot Object
   * @author Cein
   */
  getClosestSnapshotAfter(signum, date) {
    if (signum && date) {
      const innerHistModel = new InnerSourceUserHistoryModel();
      const dateObj = new Date(`${date}T23:59:59.999Z`);

      return innerHistModel.getUserSnapshotAfterDate(signum, dateObj)
        .then((respSnapshot) => {
          if (Array.isArray(respSnapshot.docs) && respSnapshot.docs.length) {
            echoLog(`InnersourceUserHistory snapshot found for user ${signum} after date ${dateObj}`, null, 200, this.packName);
            return respSnapshot.docs[0];
          }
          const msg = `No innersourceUserHistory snapshot found for user ${signum} after date ${dateObj}.`;
          return Promise.reject(errorLog(
            404,
            msg,
            { error: msg, signum, dateObj },
            'getClosestSnapshot',
            this.packName,
          ));
        }).catch(error => Promise.reject(errorLog(
          error.code || 500,
          error.desc || 'Failure to fetch given user\'s innersourceUserHistory snapshot at the given time.',
          { error, signum, dateObj },
          'getClosestSnapshot',
          this.packName,
        )));
    }

    const msg = 'Given signum or date are not of the correct type';
    return Promise.reject(errorLog(
      500,
      msg,
      { error: msg, signum, date },
      'getClosestSnapshotBefore',
      this.packName,
    ));
  }

  /**
   * Fetches a single snapshot before and equal to given specific date for a give user signum.
   * @param {string} signum user signum
   * @param {string} date date to start from in format YYYY-MM-DD
   * @returns {Promise<object>} the matched snapshot Object
   * @author Cein
   */
  getClosestSnapshotBefore(signum, date) {
    if (signum && date) {
      const innerHistModel = new InnerSourceUserHistoryModel();
      const dateObj = new Date(`${date}T23:59:59.999Z`);

      return innerHistModel.getUserSnapshotLessEqualDate(signum, dateObj)
        .then((respSnapshot) => {
          if (Array.isArray(respSnapshot.docs) && respSnapshot.docs.length) {
            echoLog(`InnersourceUserHistory snapshot found for user ${signum} before date ${dateObj}`, null, 200, this.packName);
            return respSnapshot.docs[0];
          }

          const msg = `No innersourceUserHistory snapshot found for user ${signum} before date ${dateObj}.`;
          return Promise.reject(errorLog(
            404,
            msg,
            { error: msg, signum, dateObj },
            'getClosestSnapshotBefore',
            this.packName,
          ));
        }).catch(error => Promise.reject(errorLog(
          error.code || 500,
          error.desc || 'Failure to fetch given user\'s innersourceUserHistory snapshot at the given time.',
          { error, signum, dateObj },
          'getClosestSnapshotBefore',
          this.packName,
        )));
    }

    const msg = 'Given signum or date are not of the correct type';
    return Promise.reject(errorLog(
      500,
      msg,
      { error: msg, signum, date },
      'getClosestSnapshotBefore',
      this.packName,
    ));
  }

  /**
   * gets the closest snapshot to a given date for a user signum
   * taken before and equal to the date as preference
   * @param {string} signum user signum
   * @param {string} date date to start from in format YYYY-MM-DD
   * @returns {Promise<object>} the matched snapshot Object
   * @author Cein
   */
  getClosestSnapshot(signum, date) {
    return this.getClosestSnapshotBefore(signum, date)
      .then(snapshotResp => snapshotResp).catch((errorBeforeSnap) => {
        if (errorBeforeSnap.code === 404) {
          return this.getClosestSnapshotAfter(signum, date)
            .then(snapshotResult => snapshotResult).catch(errorAfterSnap => Promise.reject(errorLog(
              errorAfterSnap.code || 500,
              errorAfterSnap.desc || `Faiure to fetch a snapshot after date ${date} for user signum ${signum}`,
              { error: errorAfterSnap, signum, date },
              'getClosestSnapshot',
              this.packName,
              true,
            )));
        }

        return Promise.reject(errorLog(
          errorBeforeSnap.code || 500,
          errorBeforeSnap.desc || `Faiure to fetch a snapshot before date ${date} for user signum ${signum}`,
          { error: errorBeforeSnap, signum, date },
          'getClosestSnapshot',
          this.packName,
        ));
      });
  }
}

module.exports = InnersourceUserHistory;
