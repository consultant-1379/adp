/**
* [ adp.models.Userprogress ]
* userprogress Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);

class Permission {
  constructor() {
    this.dbMongoCollection = 'userprogress';
  }


  /**
   * Fetch all userprogress object
   * @returns {promise} response obj containing an array with
   * the related object
   * @author Omkar Sadegaonkar [zsdgmkr]
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
   * Get all progress registers from the database.
   * @returns {promise} response from the request.
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllProgress() {
    const query = {
      $and: [
        { type: { $eq: 'progress' } },
        { deleted: { $exists: false } },
      ],
    };
    const mongoQuery = query;
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get all progress registers from the database, from a specific user.
   * @param {string} SIGNUM Unique ID of a user
   * @param {Array} PERMISSIONIDS Array of available IDs (RBAC Based)
   * @returns {promise} response from the request.
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllProgressFromThisUser(SIGNUM, PERMISSIONIDS) {
    const mongoQuery = {
      $and: [
        { signum: { $eq: SIGNUM } },
        { type: { $eq: 'progress' } },
        { deleted: { $exists: false } },
      ],
    };
    if (Array.isArray(PERMISSIONIDS)) {
      mongoQuery.$and.push({ wid: { $in: PERMISSIONIDS } });
    }
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Get the progress from a specific user and specific page.
   * @param {string} SIGNUM Unique ID of a user
   * @param {string} WID Wordpress ID
   * @returns {promise} response from the request.
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getTheProgressFromThisUserAndThisPage(SIGNUM, WID) {
    const mongoQuery = {
      signum: { $eq: SIGNUM },
      wid: { $eq: WID },
      type: { $eq: 'progress' },
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
   * Fetch userprogress object based on Signum and Wordpress ID
   * @param {string} SIGNUM Unique ID of a user
   * @param {string} WORDPRESSID ID from Wordpress Page
   * @returns {promise} response obj containing an array with
   * the related object
   * @author Armando Dias [zdiaarm]
   */
  getBySignumAndWordpressID(SIGNUM, WORDPRESSID) {
    const mongoQuery = {
      signum: { $eq: SIGNUM },
      wid: { $eq: WORDPRESSID },
      type: { $eq: 'progress' },
    };
    const mongoOptions = { limit: 999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Create one object
   * @param {object} OBJ that needs to be created
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }


  /**
   * Update one object
   * @param {object} OBJ that needs to be updated
   * @returns {promise} response obj containing response of update
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  updateOne(OBJ) {
    return adp.db.update(this.dbMongoCollection, OBJ);
  }


  /**
   * Delete one object
   * @param {string} ID that needs to be deleted
   * @returns {promise} response obj containing response of deletion
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  deleteOne(ID) {
    return adp.db.destroy(this.dbMongoCollection, ID);
  }
}


module.exports = Permission;
