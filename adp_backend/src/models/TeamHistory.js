/**
* [ adp.models.TeamHistory ]
* TeamHistory Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);

class TeamHistory {
  constructor() {
    this.dbMongoCollection = 'teamhistory';
  }


  /**
   * Create team details snapshot
   * @param {string} assetId the microservice ID
   * @param {array} team the list of team member objects
   * @returns {promise} db create command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createSnapshot(assetId, team) {
    const snapshotObj = {
      asset_id: assetId,
      team,
      date_created: new Date(),
      date_updated: '',
    };
    return adp.db.create(this.dbMongoCollection, snapshotObj);
  }


  /**
   * Update team details snapshot
   * @param {string} snapshotId the id of the snapshot to update
   * @param {array} team the list of team member objects
   * @returns {promise} db update command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  updateSnapshot(snapshotId, team) {
    const snapshotObj = {
      _id: snapshotId,
      team,
      date_updated: new Date(),
    };
    return adp.db.update(this.dbMongoCollection, snapshotObj);
  }


  /**
   * Bulk create or update,
   * To update the snapshot _id and _rev must be included in the object
   * else it will create the object
   * @param {array} snapshotList of snapshot objects
   * @param {boolean} [returnAsCouchFormat=false] formats mongo responses as a couch response
   * @param {boolean} return bulk response in the same format as couch - only for mongo
   * @returns {promise<object>} Mongo - object of bulk operations
   * Couch - array of document ids and responses
   * @author Cein
   */
  bulkCreateUpdate(snapshotList, returnAsCouchFormat = false) {
    const snapshotArr = (Array.isArray(snapshotList) ? snapshotList : []);
    return adp.db.bulk(
      this.dbMongoCollection, snapshotArr, returnAsCouchFormat,
    );
  }


  /**
   * Get team history information for a microservice
   * @param {string} assetIdArr the microservice IDs Array
   * @returns {promise} db get command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getSnapshotByAssetId(assetIdArr) {
    const mongoQuery = {
      asset_id: {
        $in: assetIdArr,
      },
    };
    const mongoOptions = { limit: 99999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get team history information for a microservice
   * @param {string} assetId the microservice ID
   * @returns {promise} db get command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getLastSnapshotByAssetId(assetIdArr) {
    const mongoPipeline = [
      {
        $match: {
          asset_id: {
            $in: assetIdArr,
          },
        },
      },
      { $sort: { date_created: -1 } },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
      { allowDiskUse: true },
    ).then((snapshotResp) => {
      const updatedSnapshotResp = snapshotResp;
      if (Array.isArray(snapshotResp.docs) && snapshotResp.docs.length) {
        const assetIdTracker = {};
        const lastOnlyDocs = [];
        snapshotResp.docs.forEach((docObj) => {
          const assetId = docObj.asset_id;
          if (assetId && !assetIdTracker[assetId]) {
            if (assetIdArr.includes(assetId)) {
              lastOnlyDocs.push(docObj);
            }
            assetIdTracker[assetId] = true;
          }
        });
        updatedSnapshotResp.docs = lastOnlyDocs;
      }
      return updatedSnapshotResp;
    }).catch((errorFetchSnapshots) => {
      throw errorFetchSnapshots;
    });
  }


  /**
   * Get team history information for all microservices
   * @returns {promise} db get command
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getAllSnapshots() {
    const mongoQuery = {};
    const mongoOptions = { limit: 99999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Finds snapshots by id
   * @param {array} snapshotIdArr list of snapshot Ids
   * @author Cein
   */
  getById(snapshotIdArr) {
    const mongoQuery = {
      _id: {
        $in: snapshotIdArr,
      },
    };
    const mongoOptions = { limit: 99999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Retrieve the latest snapshot for a microservice at a specific date
   * @param {string} msId microservice Id.
   * @param {string} commitDate Date of the Commit
   * @returns {promise} will return the result of the request
   * @author Armando Dias [ zdiaarm ]
   */
  getByAssetIDSignumDate(msId, commitDate) {
    const mongoPipeline = [
      {
        $match: {
          $and: [
            { asset_id: msId },
            {
              $or: [
                { date_created: { $lte: new Date(`${commitDate}T23:59:59.999Z`) } },
                { date_created: { $lte: `${commitDate}T23:59:59.999Z` } }],
            },
          ],
        },
      },
      { $sort: { date_created: -1 } },
      { $limit: 1 },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }
}


module.exports = TeamHistory;
