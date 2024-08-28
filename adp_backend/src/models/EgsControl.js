/**
* [ adp.models.EgsControl ]
* egsControl Database Model
* @author Armando Dias [zdiaarm]
*/

const errorLog = require('./../library/errorLog');

class EgsControl {
  constructor() {
    this.packName = 'adp.models.EgsControl';
    this.dbMongoCollection = 'egsControl';
  }


  /**
   * Retrieve documents from database based on object_id
   * @param {array} OBJECTIDS array of id strings
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getByObjectIds(OBJECTIDS) {
    let toSearch = OBJECTIDS;
    if (!Array.isArray(OBJECTIDS)) {
      toSearch = [OBJECTIDS];
    }
    const mongoQuery = {
      object_id: {
        $in: toSearch,
      },
      deleted: { $exists: false },
    };
    const mongoOptions = { limit: toSearch.length, skip: 0 };
    return adp.db.find(
      this.dbMongoCollection,
      mongoQuery,
      mongoOptions,
    );
  }


  /**
   * Retrieve documents from database based on object_id
   * @param {array} OBJECTIDS array of id strings
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  insertOrUpdateEgsControlDocument(DOCUMENT) {
    return new Promise((RESOLVE, REJECT) => {
      if (DOCUMENT && DOCUMENT._id) {
        adp.db.update(this.dbMongoCollection, DOCUMENT)
          .then((UPDATED) => {
            RESOLVE(UPDATED);
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
            const errorObject = {
              error: ERROR,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'insertOrUpdateEgsControlDocument', this.packName));
          });
      } else if (DOCUMENT && !DOCUMENT._id) {
        adp.db.create(this.dbMongoCollection, DOCUMENT)
          .then((CREATED) => {
            RESOLVE(CREATED);
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
            const errorObject = {
              error: ERROR,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'insertOrUpdateEgsControlDocument', this.packName));
          });
      }
    });
  }


  setEgsControlAsSync(ARRAYOBJECTIDS, STATUS, MESSAGE) {
    return new Promise((RESOLVE, REJECT) => {
      let objectIds = ARRAYOBJECTIDS;
      if (!Array.isArray(ARRAYOBJECTIDS)) {
        objectIds = [ARRAYOBJECTIDS];
      }
      const filter = { object_id: { $in: objectIds } };
      const update = {
        $set: {
          last_sync_status: STATUS,
          last_sync_date: new Date(),
          last_sync_status_message: MESSAGE,
        },
      };
      adp.db.updateMany(this.dbMongoCollection, filter, update)
        .then((RESULT) => {
          RESOLVE(RESULT);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'setEgsControlAsSync', this.packName));
        });
    });
  }
}

module.exports = EgsControl;
