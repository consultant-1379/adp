/**
* [ adp.models.Tags ]
* listoption Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);


class Tag {
  constructor() {
    this.dbMongoCollection = 'tag';
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
   * Lists all groups objects
   * @returns {promise} response obj containing an array of all group objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  indexGroups() {
    const mongoQuery = { type: { $eq: 'group' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Lists all tags objects
   * @returns {promise} response obj containing an array of all group objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  indexTags() {
    const mongoQuery = { type: { $eq: 'tag' }, deleted: { $exists: false } };
    const mongoOptions = { limit: 9999999, skip: 0 };
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
    const mongoQuery = { tag: { $eq: Name }, deleted: { $exists: false } };
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
}


module.exports = Tag;
