/**
* [ adp.models.EgsPayload ]
* EgsPayload Database Model
* @author Armando Dias [zdiaarm]
*/

const errorLog = require('./../library/errorLog');

class EgsPayload {
  constructor(QUEUEOBJECTIVE = null) {
    this.packName = 'adp.models.EgsPayload';
    this.dbMongoCollection = 'egsPayload';
    this.queueObjective = QUEUEOBJECTIVE;
  }


  addSenderToTheQueue(PAYLOADID) {
    if (!this.queueObjective) return new Promise(RES => RES());
    try {
      return new Promise(async (RESOLVE, REJECT) => {
        const nextIndex = await adp.queue.getNextIndex(this.queueObjective);
        await adp.queue.addJob(
          'egsSync',
          'egsSync',
          'adp.egsSync.egsSyncSendPayload',
          [PAYLOADID, this.queueObjective],
          this.queueObjective,
          nextIndex,
        )
          .then((RESULT) => {
            RESOLVE(RESULT);
          })
          .catch((ERROR) => {
            const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
            const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
            const errorObject = {
              error: ERROR,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'addSenderToTheQueue', this.packName));
          });
      });
    } catch (ERROR) {
      const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
      const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
      const errorObject = {
        error: ERROR,
      };
      return new Promise((RES, REJ) => REJ(errorLog(errorCode, errorMessage, errorObject, 'addSenderToTheQueue', this.packName)));
    }
  }


  /**
   * @param DOCTYPE type of the doc to be send in the payload
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  getTheOpenPayload(DOCTYPE) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        sync_status: {
          $eq: 0,
        },
        docType: {
          $eq: DOCTYPE,
        },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      const mongoProjection = { _id: 1, sync_status: 1, sizeinbytes: 1 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
        mongoProjection,
      )
        .then((SEARCHRESULT) => {
          if (SEARCHRESULT
            && Array.isArray(SEARCHRESULT.docs)
            && SEARCHRESULT.docs.length === 0) {
            const payloadObjectToSave = {
              sync_status: 0,
              sync_message: 'NONE',
              sync_date: 'WAITING',
              sizeinbytes: 0,
              queue_objective: this.queueObjective,
              payload: [],
              docType: DOCTYPE,
            };
            adp.db.create(this.dbMongoCollection, payloadObjectToSave)
              .then(async (CREATED) => {
                const payloadObject = {
                  _id: new adp.MongoObjectID(`${CREATED.id}`),
                  sync_status: 0,
                  sizeinbytes: 0,
                };
                await this.addSenderToTheQueue(`${CREATED.id}`);
                RESOLVE(payloadObject);
              })
              .catch((ERROR) => {
                const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
                const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
                const errorObject = {
                  error: ERROR,
                };
                REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTheOpenPayload', this.packName));
              });
          } else if (SEARCHRESULT
            && Array.isArray(SEARCHRESULT.docs)
            && SEARCHRESULT.docs.length === 1) {
            const payloadFromDatabase = SEARCHRESULT.docs[0];
            const payloadObject = {
              _id: payloadFromDatabase._id,
              sync_status: payloadFromDatabase.sync_status,
              sizeinbytes: payloadFromDatabase.sizeinbytes,
            };
            RESOLVE(payloadObject);
          } else {
            const errorCode = 500;
            const errorMessage = 'Internal Server Error';
            const errorObject = {
              error: 'Invalid result from database',
              result: SEARCHRESULT,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTheOpenPayload', this.packName));
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getTheOpenPayload', this.packName));
        });
    });
  }


  /**
   *
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  closePayloadAndGetANewOne(PAYLOADIDTOCLOSE, DOCTYPE) {
    return new Promise((RESOLVE, REJECT) => {
      const changes = {
        _id: PAYLOADIDTOCLOSE,
        sync_status: 1,
        docType: DOCTYPE,
      };
      adp.db.update(this.dbMongoCollection, changes)
        .then(() => {
          const payloadObjectToSave = {
            sync_status: 0,
            sync_message: 'NONE',
            sync_date: 'WAITING',
            sizeinbytes: 0,
            queue_objective: this.queueObjective,
            payload: [],
            docType: DOCTYPE,
          };
          adp.db.create(this.dbMongoCollection, payloadObjectToSave)
            .then(async (CREATED) => {
              const payloadObject = {
                _id: new adp.MongoObjectID(`${CREATED.id}`),
                sync_status: 0,
                sizeinbytes: 0,
              };
              await this.addSenderToTheQueue(`${CREATED.id}`);
              RESOLVE(payloadObject);
            })
            .catch((ERROR) => {
              const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
              const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
              const errorObject = {
                error: ERROR,
              };
              REJECT(errorLog(errorCode, errorMessage, errorObject, 'closePayloadAndGetANewOne', this.packName));
            });
        });
    });
  }


  /**
   *
   * @returns {promise} response of the request
   * @author Armando Dias [zdiaarm]
   */
  addToPayload(PAYLOADID, ESDOCUMENT) {
    return new Promise((RESOLVE, REJECT) => {
      const docDate = ESDOCUMENT.document_date
        ? new Date(ESDOCUMENT.document_date).toISOString() : null;
      const payloadDocument = {
        _id: ESDOCUMENT.external_id,
        title: ESDOCUMENT.title,
        tags: ['ADP', 'PORTAL', ESDOCUMENT.type.toUpperCase()],
        type: ESDOCUMENT.type,
        document_date: docDate,
        url: ESDOCUMENT.url,
        text: ESDOCUMENT.text,
        product_number: ESDOCUMENT.product_number,
        short_summary: ESDOCUMENT.short_summary,
      };
      Object.keys(payloadDocument).forEach((KEY) => {
        if (payloadDocument[KEY] === null || payloadDocument[KEY] === undefined) {
          delete payloadDocument[KEY];
        }
      });
      const thisDocumentSizeInBytes = adp.getSizeInMemory(payloadDocument);
      const payloadID = `${PAYLOADID}`;
      const filter = {
        _id: payloadID,
      };
      const update = {
        $inc: { sizeinbytes: thisDocumentSizeInBytes },
        $push: {
          array_ids: ESDOCUMENT.object_id,
          payload: payloadDocument,
        },
      };
      adp.db.updateMany(this.dbMongoCollection, filter, update)
        .then((UPDATERESULT) => {
          RESOLVE(UPDATERESULT.ok);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'addToPayload', this.packName));
        });
    });
  }


  closePayloadsToSend() {
    return new Promise((RESOLVE, REJECT) => {
      const filter = {
        queue_objective: this.queueObjective,
        sync_status: 0,
      };
      const update = {
        $set: { sync_status: 1 },
      };
      adp.db.updateMany(this.dbMongoCollection, filter, update)
        .then((UPDATERESULT) => {
          RESOLVE(UPDATERESULT.ok);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'closePayloadsToSend', this.packName));
        });
    });
  }

  getPayload(PAYLOADID) {
    return new Promise((RESOLVE, REJECT) => {
      const mongoQuery = {
        _id: { $eq: `${PAYLOADID}` },
      };
      const mongoOptions = { limit: 1, skip: 0 };
      adp.db.find(
        this.dbMongoCollection,
        mongoQuery,
        mongoOptions,
      )
        .then((PAYLOAD) => {
          if (PAYLOAD && Array.isArray(PAYLOAD.docs) && PAYLOAD.docs.length === 1) {
            RESOLVE(PAYLOAD.docs[0]);
          } else {
            const errorCode = 500;
            const errorMessage = 'Database response is unexpected';
            const errorObject = {
              databaseResponse: PAYLOAD,
            };
            REJECT(errorLog(errorCode, errorMessage, errorObject, 'getPayload', this.packName));
          }
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'getPayload', this.packName));
        });
    });
  }


  setEgsPayloadAsSync(PAYLOADID, STATUS, MESSAGE) {
    return new Promise((RESOLVE, REJECT) => {
      const filter = { _id: `${PAYLOADID}` };
      const update = {
        $set: {
          sync_status: STATUS,
          sync_date: new Date(),
          sync_message: MESSAGE,
        },
      };
      adp.db.updateMany(this.dbMongoCollection, filter, update)
        .then((RESULT) => {
          RESOLVE(RESULT.ok);
        })
        .catch((ERROR) => {
          const errorCode = ERROR && ERROR.code ? ERROR.code : 500;
          const errorMessage = ERROR && ERROR.message ? ERROR.message : 'Internal Server Error';
          const errorObject = {
            error: ERROR,
          };
          REJECT(errorLog(errorCode, errorMessage, errorObject, 'setEgsPayloadAsSync', this.packName));
        });
    });
  }
}

module.exports = EgsPayload;
