/**
* [ adp.models.CommentsDL ]
* CommentsDL Database Model
* @author Rinosh Cherian [ zcherin ]
*/

// ============================================================================================= //
const { HTTP_STATUS } = require('./../library/utils/constants');
// ============================================================================================= //
class CommentsDL {
  constructor() {
    this.dbMongoCollection = 'commentsDL';
  }

  /**
   * Get all Inline Comments Mail DL configuration.
   * @returns {promise} response of the request.
   * @author Rinosh Cherian [ zcherin ]
   */
  getCommentsDL() {
    const mongoQuery = {};
    const mongoOptions = { limit: 999999, skip: 0 };
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
}

module.exports = CommentsDL;
