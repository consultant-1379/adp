/**
* Unit test for [ global.adp.db.bulk ]
* @author Cein-Sven Da Costa [edaccei]
*/
class MockMongoObjectId {
  constructor() {
    this.id = 1;
  }

  toString() {
    return `${this.id}`;
  }
}
describe('Testing [ global.adp.db.bulk ] ', () => {
  let dbBulkResp;
  beforeEach(() => {
    dbBulkResp = { res: true, data: true };

    global.adp = {};
    adp.MongoObjectID = MockMongoObjectId;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.config = {};

    global.adp.echoLog = () => {};

    const bulkResp = query => new Promise((res, rej) => {
      dbBulkResp.query = query;
      if (dbBulkResp.res) {
        res(dbBulkResp.data);
      } else {
        rej(dbBulkResp.data);
      }
    });

    global.adp.dataBase = {};
    global.adp.dataBase.bulk = bulkResp;

    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = () => ({ bulkWrite: bulkResp });

    global.adp.db = {};
    global.adp.db.bulk = require('./bulk');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should reject if an empty array is given.', (done) => {
    global.adp.db.bulk('dataBase', [])
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error.length).toBeTruthy();
        done();
      });
  });

  it('should reject if the array param is not of type array.', (done) => {
    global.adp.db.bulk('dataBase', 1)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error.length).toBeTruthy();
        done();
      });
  });

  describe('For MongoDb', () => {
    beforeEach(() => {
      global.adp.config.defaultDB = 'mongoDB';
    });

    it('should resolve and the query should contain a insert and a update.', (done) => {
      const testInsert = { toInsert: true };
      const testToUpdate = { _id: 'test', toUpdate: true };
      global.adp.db.bulk('dataBase', [testInsert, testToUpdate])
        .then((resp) => {
          const updateQuery = dbBulkResp.query[1].updateOne;

          expect(resp).toBeTruthy();
          expect(dbBulkResp.query[0].insertOne.document.toInsert).toBeTruthy();
          expect(updateQuery.filter._id).toBe(testToUpdate._id);
          expect(updateQuery.update.$set.toUpdate).toBeTruthy();
          expect(updateQuery.upsert).toBeTruthy();
          done();
        }).catch(() => {
          expect(false).toBeTruthy();
          done();
        });
    });

    it('should resolve and return in a couch layout if COUCHFORMAT is true.', (done) => {
      const testInsertId = 'testInsert';
      const testInsert = { toInsert: true };
      const testToUpdate = { _id: 'testUpdate', toUpdate: true };

      dbBulkResp.data = {
        insertedCount: 1,
        result: {
          insertedIds: [{ _id: testInsertId }],
          writeErrors: [],
          writeConcernErrors: [],
        },
      };

      global.adp.db.bulk('dataBase', [testInsert, testToUpdate], true)
        .then((resp) => {
          const updatedResult = resp[0];
          const upsertedResult = resp[1];

          expect(updatedResult.ok).toBeTruthy();
          expect(updatedResult.id).toBe(testToUpdate._id);
          expect(upsertedResult.ok).toBeTruthy();
          expect(upsertedResult.id).toBe(testInsertId);
          done();
        }).catch(() => {
          expect(false).toBeTruthy();
          done();
        });
    });

    it('should reject if there are mongo errors if COUCHFORMAT is true.', (done) => {
      const testInsert = { toInsert: true };

      dbBulkResp.data = {
        insertedCount: 0,
        result: {
          insertedIds: [],
          writeErrors: ['writeErrors'],
          writeConcernErrors: ['writeConcernErrors'],
        },
      };

      global.adp.db.bulk('dataBase', [testInsert], true)
        .then(() => {
          expect(false).toBeTruthy();
          done();
        }).catch((error) => {
          expect(error.result.writeErrors.length).toBeGreaterThan(0);
          expect(error.result.writeConcernErrors.length).toBeGreaterThan(0);
          done();
        });
    });

    it('should resolve even if insertedCount is zero.', (done) => {
      const testInsert = { toInsert: true };
      const testToUpdate = { _id: 'testUpdate', toUpdate: true };

      dbBulkResp.data = {
        insertedCount: 0,
        result: {
          insertedIds: [],
          writeErrors: [],
          writeConcernErrors: [],
        },
      };

      global.adp.db.bulk('dataBase', [testInsert, testToUpdate], true)
        .then(() => {
          done();
        }).catch(() => {
          done.fail();
        });
    });

    it('should reject with a 500 code if mongo db reject.', (done) => {
      dbBulkResp.res = false;

      global.adp.db.bulk('dataBase', [{ test: 'test' }])
        .then(() => {
          expect(false).toBeTruthy();
          done();
        }).catch((error) => {
          expect(error.code).toBe(500);
          done();
        });
    });
  });
});
