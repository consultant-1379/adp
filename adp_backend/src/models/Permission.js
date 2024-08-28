/**
* [ adp.models.Permission ]
* permission Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);


class Permission {
  constructor() {
    this.dbMongoCollection = 'permission';
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
   * Get permission of the field admin
   * @param {string} SIGNUM Unique user ID
   * @param {number} FIELDCODE Number to identify the field
   * @param {number} INTEMCODE Number to identify the item which belongs that field.
   * @param {number} [limit=999999] query limit value
   * @param {skip} [skip=0] query skip value
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getFieldAdminPermission(SIGNUM, FIELDCODE, ITEMCODE, limit = 999999, skip = 0) {
    const mongoQuery = { $and: [{ deleted: { $exists: false } }] };
    mongoQuery.$and.push({ 'group-id': { $eq: FIELDCODE } });
    mongoQuery.$and.push({ 'item-id': { $eq: ITEMCODE } });
    mongoQuery.$and.push({ [`admin.${SIGNUM}`]: { $exists: true } });
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit, skip },
    );
  }


  /**
   * Get all permissions of the field admin from a user/users
   * @param {string} SIGNUM Unique user ID. Could be an Array.
   * @param {number} [limit=999999] query limit value
   * @param {skip} [skip=0] query skip value
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getAllFieldAdminPermissionBySignum(SIGNUM, limit = 999999, skip = 0) {
    const mongoQuery = { $and: [{ deleted: { $exists: false } }] };
    if (Array.isArray(SIGNUM)) {
      const or = [];
      SIGNUM.forEach((ID) => {
        or.push({ [`admin.${ID}`]: { $exists: true } });
      });
      mongoQuery.$and.push({ $or: or });
    } else {
      mongoQuery.$and.push({ [`admin.${SIGNUM}`]: { $exists: true } });
    }
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      { limit, skip },
    );
  }

  /**
   * Get all permissions of requested field admin
   * @param {number} FIELDCODE Number to identify the field
   * @param {number} INTEMCODE Number to identify the item which belongs that field.
   * @returns {promise} response of the request
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getAllPermissionsByField(FIELDCODE, ITEMCODE) {
    const mongoQuery = { $and: [{ deleted: { $exists: false } }] };
    mongoQuery.$and.push({ 'group-id': { $eq: FIELDCODE } });
    mongoQuery.$and.push({ 'item-id': { $eq: ITEMCODE } });
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
   * Update  one object
   * @param {object} OBJ that needs to be updated
   * @returns {promise} response obj containing response of update
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  updateOne(OBJ) {
    return adp.db.update(this.dbMongoCollection, OBJ);
  }


  /**
   * Delete  one object
   * @param {string} ID that needs to be deleted
   * @returns {promise} response obj containing response of deletion
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  deleteOne(ID) {
    return adp.db.destroy(this.dbMongoCollection, ID);
  }
}


module.exports = Permission;
