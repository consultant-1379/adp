/**
* [ adp.models.RBACGroups ]
* RBACGroups Database Model
* @author Omkar Sadegaonkar [zsdgmkr]
*/
adp.docs.list.push(__filename);

class RBACGroups {
  constructor() {
    this.dbMongoCollection = 'rbacgroups';
  }

  /**
   * Lists all groups objects
   * @returns {promise} response obj containing an array of all group objects
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  indexGroups() {
    const mongoQuery = { type: 'group' };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Get one object by name
   * @param {string} Name of the group
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getGroupsByName(name) {
    const mongoQuery = { name, type: 'group' };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Get one object by id
   * @param {string} _id of the group
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  getGroupById(_id) {
    const mongoQuery = { _id, type: 'group' };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Get group/s by a list of ids
   * @param {array} idArr of the group
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  getGroupByIds(idArr) {
    let ids = idArr;
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    const mongoQuery = {
      _id: { $in: ids },
      type: 'group',
    };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    );
  }

  /**
   * Update Group and check for duplicate name
   * @param {object} OBJ that needs to be updated
   * @returns {promise} response obj containing response of update
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  updateGroupIfPossible(OBJ) {
    const mongoQuery = { _id: OBJ._id, type: 'group' };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
    )
      .then((RESULT) => {
        const resultDocs = RESULT.docs;
        if (resultDocs.length === 0) {
          const errorCode = 404;
          const errorMessage = `Group with ID "${OBJ._id}" does not exists`;
          const errObj = { ok: false, code: errorCode, message: errorMessage };
          return new Promise((RES, REJ) => REJ(errObj));
        }
        return this.getGroupsByName(OBJ.name)
          .then((GROUPSRESULT) => {
            const docsGroups = GROUPSRESULT.docs;
            if (docsGroups.length === 0) {
              return adp.db.update(this.dbMongoCollection, OBJ);
            }
            if (docsGroups.length === 1) {
              if (docsGroups[0]._id.equals(OBJ._id)) {
                return adp.db.update(this.dbMongoCollection, OBJ);
              }
            }
            const errorCode = 400;
            const errorMessage = `Group with name "${OBJ.name}" Already exists`;
            const errObj = { ok: false, code: errorCode, message: errorMessage };
            return new Promise((RES, REJ) => REJ(errObj));
          })
          .catch(ERROR => new Promise((RES, REJ) => REJ(ERROR)));
      })
      .catch(ERROR => new Promise((RES, REJ) => REJ(ERROR)));
  }

  /**
   * Create Group if there is no group with same name
   * @param {object} OBJ that needs to be created
   * @returns {promise} response obj containing response of creation
   * @author Omkar Sadegaonkar [zsdgmkr]
   */
  createGroupIfPossible(OBJ) {
    return this.getGroupsByName(OBJ.name)
      .then((RESULT) => {
        const docsResp = RESULT.docs;
        if (docsResp.length) {
          const errorCode = 400;
          const errorMessage = `Group with name "${OBJ.name}" Already exists`;
          const errObj = { ok: false, code: errorCode, message: errorMessage };
          return new Promise((RES, REJ) => REJ(errObj));
        }
        return adp.db.create(this.dbMongoCollection, OBJ);
      })
      .catch(ERROR => new Promise((RES, REJ) => REJ(ERROR)));
  }

  /**
   * Delete one group, if possible.
   * @param {string} ID of the register that needs to be deleted
   * @param {Booleant} DELETEDEFAULT if true, skips the check to delete undeletable group
   * @returns {promise} db delete command
   * @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
   */
  deleteGroupIfPossible(ID, DELETEDEFAULT = null) {
    return this.getGroupById(ID)
      .then((RESULT) => {
        const doc = RESULT.docs[0];
        if (doc === undefined) {
          const errorCode = 404;
          const errorMessage = 'Not Found - Group does not exist in the database';
          const errObj = { ok: false, code: errorCode, message: errorMessage };
          return new Promise((RES, REJ) => REJ(errObj));
        }
        if (doc.undeletable && DELETEDEFAULT !== true) {
          const errorCode = 403;
          const errorMessage = 'Forbidden - You cannot delete a default group';
          const errObj = { ok: false, code: errorCode, message: errorMessage };
          return new Promise((RES, REJ) => REJ(errObj));
        }
        return adp.db.destroy(this.dbMongoCollection, ID);
      })
      .catch(ERROR => new Promise((RES, REJ) => REJ(ERROR)));
  }

  /**
   * Removes the given list of ObjectIds from all permission groups with type content
   * @param {string[]} wordpressIdsToDelete list of objectIds to remove
   * @returns {Promise<object>} the standard mongo updateMany response object
   * @author Omkar
   */
  cleanContentPermissions(wordpressIdsToDelete) {
    const filter = { type: 'group', 'permission.type': 'content', 'permission.static': { $in: wordpressIdsToDelete } };
    const update = { $pull: { 'permission.$.static': { $in: wordpressIdsToDelete } } };
    return adp.db.updateMany(this.dbMongoCollection, filter, update);
  }

  /**
   * Retrieve from database all the ObjectIDs from Static Content Permission Groups.
   * This result should be compared with the ObjectIDs from Wordpress (Remote).
   * @returns A promise with the result requested.
   * @author Armando Dias [zdiaarm]
   */
  getAllContentIDs() {
    const steps = [
      { $unwind: '$permission' },
      { $match: { 'permission.type': 'content' } },
      { $match: { 'permission.static': { $exists: true, $ne: [] } } },
      { $match: { 'permission.static': { $exists: true, $ne: null } } },
      { $project: { ids: { $setUnion: '$permission.static' } } },
      { $unwind: '$ids' },
      { $group: { _id: null, ids: { $addToSet: '$ids' } } },
    ];
    return adp.db.aggregate(this.dbMongoCollection, steps);
  }
}


module.exports = RBACGroups;
