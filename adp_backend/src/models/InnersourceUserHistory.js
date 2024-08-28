/**
* [ adp.models.InnersourceUserHistory ]
* innersourceuserhistory Database Model
* @author Armando Dias [zdiaarm]
*/
adp.docs.list.push(__filename);

class InnersourceUserHistory {
  constructor() {
    this.dbMongoCollection = 'innersourceuserhistory';
  }

  /**
   * Create User Snapshot in innersourceuserhistory Collection
   * @param {string} SIGNUM User's Signum
   * @param {string} NAME User's Name
   * @param {string} EMAIL User's Email
   * @param {string} ORGANISATION User's Department/Organisation
   * @param {object} PEOPLEFINDERUSERDATA the peoplefinder object from the people endpoint
   * @returns {promise} response obj to confirm the creation.
   * @author Armando Dias [zdiaarm]
   */
  createUserSnapshot(SIGNUM, NAME, EMAIL, ORGANISATION, PEOPLEFINDERUSERDATA) {
    const toCreate = {
      signum: SIGNUM,
      name: NAME,
      email: EMAIL,
      organisation: ORGANISATION,
      peopleFinder: PEOPLEFINDERUSERDATA,
      snapshot_date: new Date(),
    };
    return adp.db.create(this.dbMongoCollection, toCreate);
  }


  /**
   * Retrieve a valid snapshot for user
   * @param {string} SIGNUM the signum of the user.
   * @param {date} DATE for a valid snapshot on the specific date ( OPTIONAL ).
   * Accepted values will be 'all','latest', or date string in 'YYYY-MM-DD.
   * This method will ignore Hours/Minutes/Seconds/Milliseconds.
   * @returns {Promise<array>}  A promise that contains the user's snapshot
   * when fulfilled.
   * @author Veerender Voskula[zvosvee]
   */
  getUserSnapshot(SIGNUM, DATE = 'all') {
    const mongoQuery = { $and: [{ signum: { $eq: (`${SIGNUM}`).toLowerCase().trim() } }] };
    const limit = 999999;
    if (/^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/gi.test(DATE)) {
      mongoQuery.$and.push({
        snapshot_date: {
          $lte: new Date(`${DATE}T23:59:59.999Z`),
          $gte: new Date(`${DATE}T00:00:00.000Z`),
        },
      });
    }
    const mongoPipeline = [
      {
        $match: mongoQuery,
      },
      { $sort: { snapshot_date: -1 } },
      { $limit: DATE === 'latest' ? 1 : limit },
      { $skip: 0 },
    ];
    return adp.db.aggregate(
      this.dbMongoCollection,
      mongoPipeline,
    );
  }

  /**
   * Fetches the snapshot before or equal to a given date for a user
   * @param {string} signum users signum
   * @param {object} date date object to collect from
   * @returns {Promise<array>} array with the closest snapshot before or equal the
   * given date for a user
   * @author Cein
   */
  getUserSnapshotLessEqualDate(signum, date) {
    return adp.db.aggregate(
      this.dbMongoCollection,
      [
        {
          $match: {
            signum: signum.toLowerCase().trim(),
            snapshot_date: { $lte: date },
          },
        },
        {
          $sort: { snapshot_date: -1 },
        },
        {
          $limit: 1,
        },
      ],
    );
  }

  /**
   * Fetches the next snapshot after a specific date for a user
   * @param {string} signum users signum
   * @param {object} date date object to collect from
   * @returns {Promise<array>} array with the closest snapshot after the given date for a user
   * @author Cein
   */
  getUserSnapshotAfterDate(signum, date) {
    return adp.db.aggregate(
      this.dbMongoCollection,
      [
        {
          $match: {
            signum: signum.toLowerCase().trim(),
            snapshot_date: { $gt: date },
          },
        },
        {
          $sort: { snapshot_date: 1 },
        },
        {
          $limit: 1,
        },
      ],
    );
  }
}

module.exports = InnersourceUserHistory;
