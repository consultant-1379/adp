/**
* [ adp.models.AdpLog ]
* adpLog Database Model
* @author Armando Dias [zdiaarm]
*/
adp.docs.list.push(__filename);


class AdpLog {
  constructor() {
    this.dbMongoCollection = 'adplog';
  }


  /**
   * Lists all objects
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  index() {
    const mongoQuery = {};
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Get the latest restarts of the Backend ( Main or Worker )
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getLatestRestarts() {
    const mongoQuery = {
      type: 'server',
      environmentSetup: { $exists: true },
    };
    const mongoOptions = { limit: 10, skip: 0, sort: { datetime: -1 } };
    const mongoProjection = { datetime: 1, backend_mode: 1, desc: 1 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
      mongoProjection,
    );
  }


  /**
   * Get all new and updates registers, by Microservice ID
   * @param {string} ID String with the ID of the Microservice
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getNewOrUpdateByID(ID) {
    const mongoQuery = {
      type: 'microservice',
      'new._id': `${ID}`,
      deleted: { $exists: false },
      $or: [
        { desc: 'new' },
        { desc: 'update' },
      ],
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get all new registers
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllNew() {
    const mongoQuery = {
      desc: { $eq: 'new' },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get all gerritContributorsStatistics registers
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllContributorsStatistics() {
    const mongoQuery = {
      type: { $eq: 'gerritContributorsStatistics' },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all objects
   * @param {string} ID String with the ID of the Microservice
   * @returns {promise} response of the resquest
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getContributorsStatisticsByModeID(ID) {
    const mongoQuery = {
      type: { $eq: 'gerritContributorsStatistics' },
      $or: [
        { mode: 'all' },
        { mode: `${ID}` },
      ],
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Creates a log entry into database
   * @param {object} OBJ JSON Object with details
   * @author Armando Dias [zdiaarm]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }


  /**
   * Get a single log from database
   * @param {string} ID Unique Log ID
   * @returns {promise} With the request from database
   * @author Armando Dias [zdiaarm]
   */
  getLogByID(ID) {
    const mongoQuery = { _id: `${ID}`, deleted: { $exists: false } };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get a list of logs from database
   * @param {string} SIGNUM Unique User ID onwer of the log
   * @param {string} TYPE -
   * @param {string} ASSETID -
   * @param {string} LIMIT -
   * @param {string} SKIP -
   * @param {boolean} REQUESTEDBYANADMIN -
   * @returns {promise} With the request from database
   * @author Armando Dias [zdiaarm]
   */
  getLogs(SIGNUM, TYPE, ASSETID, LIMIT, SKIP, REQUESTEDBYANADMIN) {
    const mongoQuery = {};
    if (TYPE !== undefined && TYPE !== null) {
      mongoQuery.type = TYPE;
    }
    if (ASSETID !== undefined && ASSETID !== null) {
      mongoQuery.new = {};
      mongoQuery.new._id = ASSETID;
    }
    if (REQUESTEDBYANADMIN === true) {
      if (SIGNUM !== undefined && SIGNUM !== null) {
        mongoQuery.signum = SIGNUM;
      }
    } else {
      if (SIGNUM === undefined || SIGNUM === null) {
        const errorText = `Signum cannot be ${typeof SIGNUM} if user is not admin`;
        return new Promise((RES, REJ) => REJ(errorText));
      }
      mongoQuery.$or = [];
      mongoQuery.$or.push({ signum: SIGNUM });
      const teamOBJ = {};
      teamOBJ.new = {};
      teamOBJ.new.team = {};
      teamOBJ.new.team.$elemMatch = {};
      teamOBJ.new.team.$elemMatch.$and = [
        { signum: SIGNUM },
        { serviceOwner: true },
      ];
      mongoQuery.$or.push(teamOBJ);
    }
    if (Object.keys(mongoQuery).length === 0) {
      mongoQuery.datetime = { $gte: 0 };
    }
    const mongoOptions = { limit: LIMIT, skip: SKIP };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Fetch list of asset id
   * @param {string} msId microservice id
   * @author Omkar Sadegaonkar
   */
  getAssetHistory(msId) {
    const mongoQuery = {
      $and: [
        { type: { $eq: 'microservice' } },
        { 'new._id': { $eq: msId } },
      ],
    };
    const mongoOptions = { limit: 99999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }

  /**
   * Fetch list of new Assets by ID
   * @param {string} msId microservice id
   * @author Githu Jeeva Savy [zjeegit]
   */
  getNewAssetById(msId) {
    const mongoQuery = {
      $and: [
        { desc: { $eq: 'new' } },
        { 'new._id': { $eq: msId } },
      ],
    };
    const mongoOptions = { limit: 99999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }
}


module.exports = AdpLog;
