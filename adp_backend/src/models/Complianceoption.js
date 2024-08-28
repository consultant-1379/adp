/**
* [ adp.models.Complianceoption ]
* complianceoption Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);


class Complianceoption {
  constructor() {
    this.dbMongoCollection = 'complianceoption';
  }


  /**
   * Fetch all permission object
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
   * Get by Type
   * @param {string} TYPE string with the type
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getByType(TYPE) {
    const mongoQuery = {
      type: { $eq: TYPE },
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
   * Get fields by group
   * @param {string} GROUPID string with the Group ID
   * @returns {promise} response of the object
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getFieldByGroupID(GROUPID) {
    const mongoQuery = {
      'group-id': { $eq: GROUPID },
      type: { $eq: 'field' },
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
   * Create one object
   * @param {object} OBJ that needs to be created
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createOne(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }
}


module.exports = Complianceoption;
