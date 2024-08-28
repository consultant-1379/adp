const LatestSnapshotController = require('./LatestSnapshotController');
/**
 * [ adp.teamHistory.TeamHistoryController ]
 * team history base operations controller
 * @author Cein-Sven Da Costa [edaccei]
 */
adp.docs.list.push(__filename);

class TeamHistoryController extends global.adp.models.TeamHistory {
  constructor() {
    super();
    this.package = 'adp.teamHistory.TeamHistoryController';
  }


  /**
   * Creates a single teamHistory snapshot
   * @param {string} msId microservice Id
   * @param {array} mergedTeamList team list that is ready for the new snapshot
   * @param {boolean} launchDatePassed true if the launch data has passed,
   * see global.adp.config.innersourceLaunchDate
   * @returns {promise} the teamhistory create snapshot db response.
   * @author Cein
   */
  createSnapshot(msId, mergedTeamList, launchDatePassed) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(mergedTeamList) && (typeof msId === 'string' && msId.trim())) {
        const currentDate = new Date();
        const dateToSet = (launchDatePassed === true ? currentDate : new Date('January 1, 2020 00:00:00'));
        super.createSnapshot(msId, mergedTeamList, dateToSet).then((createSnapshotResp) => {
          resolve(createSnapshotResp);
        }).catch((errorCreateSnapshot) => {
          const error = { message: 'Bad request team history snapshot not created due to Incorrect params given.', code: 400 };
          error.data = {
            error: errorCreateSnapshot, msId, mergedTeamList, origin: 'createSnapshot',
          };
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(error);
        });
      } else {
        const error = { message: 'Bad request team history snapshot not created due to Incorrect params given.', code: 400 };
        error.data = {
          msId, mergedTeamList, origin: 'createSnapshot',
        };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Update a single team history snapshot
   * @param {array} mergedTeamList array of snapshot ready team member objects
   * @param {string} lastSnapshotId the id of the snapshot to update
   * @returns {promise} the team history snapshot updated db reponse
   * @author Cein
   */
  updateSnapshot(mergedTeamList, lastSnapshotId) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(mergedTeamList) && typeof lastSnapshotId === 'string' && lastSnapshotId.trim()) {
        super.updateSnapshot(lastSnapshotId, mergedTeamList).then((updateResp) => {
          resolve(updateResp);
        }).catch((errorUpdatingSnapshot) => {
          const error = { message: 'Failure to update team history snapshot.', code: 500 };
          error.data = {
            error: errorUpdatingSnapshot, mergedTeamList, lastSnapshotId, origin: 'updateSnapshot',
          };
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(error);
        });
      } else {
        const error = { message: 'Bad request update snapshot parameters are incorrect.', code: 400, data: { mergedTeamList, lastSnapshotId, origin: 'updateSnapshot' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Bulk insert and update for the team history snapshots
   * @param {array} snapshotList list of snapshot objects to insert or update.
   * Update requires _id & _rev to be present in the object
   * @returns {promise} bulk response
   * @author Cein
   */
  bulkSnapshotUpdateCreate(snapshotList) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(snapshotList) && snapshotList.length) {
        const errors = [];
        snapshotList.map((snapshotObj) => {
          const updatedSnapshot = snapshotObj;
          if (typeof snapshotObj === 'object' && Object.keys(snapshotObj).length !== 0) {
            if (snapshotObj._id && !snapshotObj.date_updated) {
              updatedSnapshot.date_updated = new Date();
            } else if (!snapshotObj._id && !snapshotObj.date_created) {
              updatedSnapshot.date_created = new Date();
            }
          } else {
            const error = { message: 'Bulk create/update was given an item that is not type object or is empty', code: 400, data: { snapshotObj, snapshotList, origin: 'bulkSnapshotUpdateCreate' } };
            errors.push(error);
          }
          return updatedSnapshot;
        });

        if (errors.length > 0) {
          const error = { message: 'Bulk create/update failure due to one or more error.', code: 500, data: { error: errors, snapshotList, origin: 'bulkSnapshotUpdateCreate' } };
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(error);
        } else {
          const timer = (new Date()).getTime();
          super.bulkCreateUpdate(snapshotList, true).then((bulkResp) => {
            adp.echoLog(`Team history Bulk create/update completed in ${(new Date()).getTime() - timer}ms `, null, 200, this.package);
            resolve(bulkResp);
          }).catch((errorBulk) => {
            const error = { message: 'Bulk create/update failure.', code: 500, data: { error: errorBulk, snapshotList, origin: 'bulkSnapshotUpdateCreate' } };
            const errorText = 'Catch an error on [ super.bulkCreateUpdate() ] at [ bulkSnapshotUpdateCreate ]';
            const errorObject = {
              snapshotList,
              returnAsCouchFormat: true,
              error: errorBulk,
            };
            adp.echoLog(errorText, errorObject, error.code, this.package);
            reject(error);
          });
        }
      } else {
        const error = { message: 'Given snapshot list is empty or not of type array', code: 400, data: { snapshotList, origin: 'bulkSnapshotUpdateCreate' } };
        reject(error);
      }
    });
  }

  /**
 * validates each microservice ids form and removes duplicates
 * @param {array} msList list of microservice objects containing at least the microservice _id
 * @returns {object} obj.msIdList {array} list of strings which are microservice ids
 * obj.errors list of validation errors.
 * @author Cein
 */
  static getListAssetIds(msList) {
    const respObj = { msIdList: [], errors: [] };
    const msDupTracker = {};
    msList.forEach((msObj) => {
      const msId = msObj._id;
      if (typeof msId === 'string' && msId.trim()) {
        if (!msDupTracker[msId]) {
          respObj.msIdList.push(msId);
          msDupTracker[msId] = true;
        }
      } else {
        respObj.errors.push({ message: `Microservice id ${msId} is empty or is not type string.`, code: 400, data: { msList, origin: '_getListAssetIds' } });
      }
    });

    return respObj;
  }

  /**
   * Fetches the team history snapshot by id
   * @param {array} idList array of snapshot ids.
   * @returns {promise} the team history db response of all the snapshots requested
   * @author Cein
   */
  getSnapshotsById(idList) {
    if (Array.isArray(idList)) {
      return super.getById(idList);
    }
    const error = { message: 'Given id list is not of type array', code: 400, data: { idList, origin: 'getSnapshotsById' } };
    return Promise.reject(error);
  }

  /**
   * Fetches the last team history snapshot for a team, does not check for team updates
   * @param {array} msList array of strings of mircoservice ids, which to fetch the last team
   * history snapshot of.
   * @returns {object} obj.lastSnapshot {object|null} the last found snapshot object,
   * null if no snapshot.
   * obj.errors {array} any errors found along the way.
   * @author Cein
   */
  fetchLastSnapshotByMsId(msList) {
    return new Promise((resolve, reject) => {
      const respObj = { lastSnapshotList: [], errors: [] };
      if (Array.isArray(msList) && msList.length) {
        const { msIdList, errors } = TeamHistoryController.getListAssetIds(msList);
        respObj.errors.push(...errors);
        const timer = (new Date()).getTime();
        super.getLastSnapshotByAssetId(msIdList).then((snapshotResp) => {
          adp.echoLog(`Team history last snapshot list fetch completed in ${(new Date()).getTime() - timer}ms`, null, 200, this.package);
          if (Array.isArray(snapshotResp.docs) && snapshotResp.docs.length) {
            respObj.lastSnapshotList = snapshotResp.docs;
          }
          resolve(respObj);
        }).catch((errorSnapshotFetch) => {
          const error = { message: 'Last Team history snapshot fetch failure', code: 500 };
          error.data = {
            error: errorSnapshotFetch, msList, msIdList, origin: 'fetchLastSnapshotByMsId',
          };
          respObj.errors.push(error);
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(respObj);
        });
      } else {
        const error = { message: 'Given microservice list is empty or is not type array.', code: 400, data: { msList, origin: 'fetchLastSnapshotByMsId' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }

  /**
   * Checks for portal team and mailer team member changes and returns the latest team snapshots
   * for the given microservices. This includes teams that have not changed.
   * @param {array} msList list of microservice objects
   * @param {boolean} fetchFullMsObjs if false this operation will not refetch the microservice
   * objects given in the msList
   * @param {boolean} forceLaunchDate if true it will force the launch date to be before today.
   * this is used for testing.
   * @returns {promise<object>}{array} obj.latestSnapshots list of the latest snapshot objects
   * {array} obj.errors list of errors that occurred along the way
   * @author Cein
   */
  fetchLatestSnapshotsMsList(msList, fetchFullMsObjs = false, forceLaunchDate = false) {
    return new Promise(async (resolve, reject) => {
      const timer = new Date();
      if (Array.isArray(msList) && msList.length > 0) {
        let msListToFetch = msList;
        const respObj = { latestSnapshots: [], errors: [] };
        if (fetchFullMsObjs) {
          msListToFetch = await adp.microservices.getById(msList).then((msListResp) => {
            const { msList: dbMsList, errors } = msListResp;
            respObj.errors.push(...errors);
            if (Array.isArray(dbMsList) && dbMsList.length) {
              return dbMsList;
            }
            return [];
          }).catch((errorFetchingServices) => {
            respObj.errors.push(errorFetchingServices);
            return [];
          });
        }

        if (msListToFetch.length) {
          const latestSnapshot = new LatestSnapshotController(msListToFetch, forceLaunchDate);
          latestSnapshot.fetchLatestSnapshots().then((lastestSnapshotResp) => {
            adp.echoLog(`Fetched lastest snapshots in ${(new Date() - timer)}ms`, null, 200, this.package);
            const { latestSnapshots, errors } = lastestSnapshotResp;
            respObj.latestSnapshots = latestSnapshots;
            respObj.errors.push(...errors);
            resolve(respObj);
          }).catch((errorFetchLatestSnapshots) => {
            reject(errorFetchLatestSnapshots);
          });
        } else {
          const error = { message: 'All given microservices are either not active or don\'t exist by their id\'s.', code: 400 };
          error.data = {
            error: respObj.errors, msListToFetch, msList, fetchFullMsObjs, origin: 'fetchLatestSnapshotsMsList',
          };
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(error);
        }
      } else {
        const error = { message: 'The given microservice Id list is of not type array or is empty.', code: 400 };
        error.data = { msIdList: this.msIdList, origin: 'fetchLatestSnapshotsMsList' };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      }
    });
  }


  /**
   * Checks for portal team and mailer team member changes and returns the lastest
   * team snapshots for all active microservices
   * @returns {*}
   * @author Cein
   */
  fetchLatestSnapshotsAllMs(forceLaunchDate = false) {
    return new Promise((resolve, reject) => {
      const adpModel = new global.adp.models.Adp();
      const timer = (new Date()).getTime();
      adpModel.indexMicroservices().then((msListResp) => {
        adp.echoLog(`Fetch all microservices in ${(new Date()).getTime() - timer}ms`, null, 200, this.package);
        if (msListResp.docs && msListResp.docs.length) {
          this.fetchLatestSnapshotsMsList(msListResp.docs, false, forceLaunchDate)
            .then((lastestSnapShotResp) => {
              resolve(lastestSnapShotResp);
            }).catch((errorlastestSnapshot) => {
              const error = { message: 'Failure to fetch all lastest team snapshots.', code: 500, data: { error: errorlastestSnapshot, origin: 'fetchLatestSnapshotsAllMs' } };
              adp.echoLog(error.message, error.data, error.code, this.package);
              reject(error);
            });
        } else {
          const error = { message: 'Failure to index all microservices, response is empty.', code: 500, data: { resp: msListResp, origin: 'fetchLatestSnapshotsAllMs' } };
          adp.echoLog(error.message, error.data, error.code, this.package);
          reject(error);
        }
      }).catch((errorFetchingServices) => {
        const error = { message: 'Failure to index all microservices.', code: 500, data: { error: errorFetchingServices, origin: 'fetchLatestSnapshotsAllMs' } };
        adp.echoLog(error.message, error.data, error.code, this.package);
        reject(error);
      });
    });
  }
}

module.exports = TeamHistoryController;
