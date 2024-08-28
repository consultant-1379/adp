/**
* [ adp.models.Migrationscripts ]
* migrationscripts Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);


class Migrationscripts {
  constructor() {
    this.dbMongoCollection = 'migrationscripts';
  }


  /**
   * Lists all objects
   * @returns {promise} response obj containing an array of all objects
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
   * Get one object
   * @param {object} OBJ that needs to be created
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getByName(Name) {
    const mongoQuery = { commandName: { $eq: Name }, deleted: { $exists: false } };
    const mongoOptions = { limit: 1, skip: 0 };
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
   * Update object
   * @param {object} OBJ that needs to be updated
   * @returns {promise} response obj containing response of update
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  update(OBJ) {
    return adp.db.update(this.dbMongoCollection, OBJ);
  }
}


module.exports = Migrationscripts;
