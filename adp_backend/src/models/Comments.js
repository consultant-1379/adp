/**
* [ adp.models.Comments ]
* Comments Database Model
* @author Armando Dias [ zdiaarm ]
*/

// ============================================================================================= //
const { HTTP_STATUS } = require('./../library/utils/constants');
// ============================================================================================= //
class Comments {
  constructor() {
    this.dbMongoCollection = 'comments';
  }

  /**
   * Creates a comment entry into database.
   * @param {object} OBJ JSON Object with details.
   * @returns {promise} response with the
   * confirmation of the creation.
   * @author Armando Dias [ zdiaarm ]
   */
  createComment(OBJ) {
    return adp.db.create(this.dbMongoCollection, OBJ);
  }

  /**
   * Get all comments under the same Location ID.
   * @param {string} locationId The Location ID of the comments.
   * @returns {promise} response of the request.
   * @author Armando Dias [zdiaarm]
   */
  getCommentsByLocationID(locationId) {
    const mongoQuery = {
      location_id: { $eq: locationId },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: 999999, skip: 0, sort: { dt_create: 1, signum: 1 } };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    ).then(RESULT => RESULT)
      .catch((ERROR) => {
        const obj = {
          code: 500,
          desc: HTTP_STATUS['500'],
          data: ERROR,
        };
        return obj;
      });
  }

  /**
   * Get comment under the same Comment ID.
   * @param {string} COMMENTID The Comment ID of the comment.
   * @returns {promise} response of the request.
   * @author Rinosh Cherian [zcherin]
   */
  getCommentsByCommentID(COMMENTID) {
    const mongoQuery = { _id: COMMENTID };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    ).then(RESULT => RESULT)
      .catch((ERROR) => {
        const obj = {
          code: 500,
          desc: HTTP_STATUS['500'],
          data: ERROR,
        };
        return obj;
      });
  }

  /**
   * Update a specific comment, if user is the owner.
   * @param {string} COMMENTID The unique comment ID.
   * @param {string} DESCCOMMENT The description of
   * the comment.
   * @param {string} SIGNUM The signum of who is
   * responsible for this request.
   * @returns {promise} response with the
   * confirmation of the update.
   * @author Armando Dias [zdiaarm]
   */
  updateComment(COMMENTID, DESCCOMMENT, SIGNUM) {
    const mongoQuery = { _id: COMMENTID };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(this.dbMongoCollection, mongoQuery, mongoOptions)
      .then((RESULT) => {
        const objectToUpdate = RESULT
          && Array.isArray(RESULT.docs)
          && RESULT.docs[0]
          ? RESULT.docs[0]
          : null;
        if (objectToUpdate) {
          if (objectToUpdate.signum === SIGNUM) {
            objectToUpdate.dt_last_update = new Date();
            objectToUpdate.desc_comment = DESCCOMMENT;
            return adp.db.update(this.dbMongoCollection, objectToUpdate);
          }
          return { code: 403, desc: 'Forbidden', data: `[ ${SIGNUM} ] can't update comment from a different owner [ ${objectToUpdate.signum} ]` };
        }
        return { code: 400, desc: `Comment id [ ${COMMENTID} ] is invalid!`, data: RESULT };
      })
      .catch((ERROR) => {
        const obj = {
          code: 500,
          desc: HTTP_STATUS['500'],
          data: ERROR,
        };
        return obj;
      });
  }

  /**
   * Soft-Delete a specific comment, if user is the owner.
   * @param {string} COMMENTID The unique comment ID.
   * @param {string} SIGNUM The signum of who is
   * responsible for this request.
   * @returns {promise} response with the
   * confirmation of the soft-delete.
   * @author Armando Dias [zdiaarm]
   */
  deleteComment(COMMENTID, SIGNUM) {
    const mongoQuery = { _id: COMMENTID };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(this.dbMongoCollection, mongoQuery, mongoOptions)
      .then((RESULT) => {
        const objectToSoftDelete = RESULT
          && Array.isArray(RESULT.docs)
          && RESULT.docs[0]
          ? RESULT.docs[0]
          : null;
        if (objectToSoftDelete) {
          if (objectToSoftDelete.signum === SIGNUM) {
            objectToSoftDelete.dt_deleted = new Date();
            objectToSoftDelete.deleted = true;
            return adp.db.update(this.dbMongoCollection, objectToSoftDelete);
          }
          return { code: 403, desc: 'Forbidden', data: `[ ${SIGNUM} ] can't delete comment from a different owner [ ${objectToSoftDelete.signum} ]` };
        }
        return { code: 400, desc: `Comment id [ ${COMMENTID} ] is invalid!`, data: RESULT };
      })
      .catch((ERROR) => {
        const obj = {
          code: 500,
          desc: HTTP_STATUS['500'],
          data: ERROR,
        };
        return obj;
      });
  }

  /**
   * Resolve a specific comment, if user is the owner.
   * @param {string} COMMENTID The unique comment ID.
   * @param {string} DESCCOMMENT The description of
   * the comment.
   * @param {string} USER The signum of who is
   * responsible for this request.
   * @returns {promise} response with the
   * confirmation of the update.
   * @author Rinosh Cherian [zcherin]
   */
  resolveComment(COMMENTID, DESCRESOLVE, USER) {
    const mongoQuery = { _id: COMMENTID };
    const mongoOptions = { limit: 1, skip: 0 };
    return adp.db.find(this.dbMongoCollection, mongoQuery, mongoOptions)
      .then((RESULT) => {
        const objectToUpdate = RESULT
          && Array.isArray(RESULT.docs)
          && RESULT.docs[0]
          ? RESULT.docs[0]
          : null;
        if (objectToUpdate) {
          // if (objectToUpdate.signum === SIGNUM) {
          objectToUpdate.resolve = true;
          objectToUpdate.dt_resolve = new Date();
          objectToUpdate.desc_resolve = DESCRESOLVE;
          objectToUpdate.resolve_signum = USER.signum;
          objectToUpdate.resolve_author = USER.name;
          objectToUpdate.resolve_email = USER.email;
          return adp.db.update(this.dbMongoCollection, objectToUpdate);
          // }
        }
        return { code: 400, desc: `Comment id [ ${COMMENTID} ] is invalid!`, data: RESULT };
      })
      .catch((ERROR) => {
        const obj = {
          code: 500,
          desc: HTTP_STATUS['500'],
          data: ERROR,
        };
        return obj;
      });
  }
}

module.exports = Comments;
