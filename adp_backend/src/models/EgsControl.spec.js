/**
* Unit test for [ adp.models.EgsControl ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

class MockEchoLog {
  createOne(MOCKJSON) {
    return new Promise((resolve) => {
      resolve({ ok: true, id: MOCKJSON.id });
    });
  }
}

describe('Testing [ adp.models.EgsControl ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.config = {};
    adp.check = {};

    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = (COLLECTION) => {
      adp.check.createIndexCollection = COLLECTION;
      return {
        createIndex() {
          return true;
        },
      };
    };


    adp.mockBehaviour = {
      update: true,
      create: true,
      updateMany: true,
    };

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;
    global.adp.echoLog = () => true;
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.slugIt = SOMETHING => SOMETHING;
    adp.db.updateMany = (dbName, filter, update, options = {}) => {
      adp.check.dbName = dbName;
      adp.check.filter = filter;
      adp.check.update = update;
      adp.check.options = options;
      if (adp.mockBehaviour.updateMany) {
        return new Promise(resolve => resolve(true));
      }
      const error = 'MockErroFromDbUpdateMany';
      return new Promise((resolve, reject) => reject(error));
    };
    adp.db.update = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      if (adp.mockBehaviour.update) {
        return new Promise(resolve => resolve(true));
      }
      const error = 'MockErroFromDbUpdate';
      return new Promise((resolve, reject) => reject(error));
    };
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;

      if (adp.mockBehaviour.create) {
        return new Promise(resolve => resolve(true));
      }
      const error = 'MockErroFromDbCreate';
      return new Promise((resolve, reject) => reject(error));
    };
    adp.db.find = (dbName, mongoQuery, mongoOption) => {
      if (dbName === 'egsControl' && mongoQuery !== undefined && mongoOption.limit === 3) {
        return new Promise(resolve => resolve([1, 2]));
      }
      return new Promise((resolve, reject) => reject());
    };
    adp.models.EgsControl = proxyquire('./EgsControl', {
      '../library/errorLog': mockErrorLog,
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  it('getByObjectIds: Should return a promise responding objectIds.', (done) => {
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.getByObjectIds([1, 2, 3])
      .then((response) => {
        expect(response).toEqual([1, 2]);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('insertOrUpdateEgsControlDocument: Should return a true for creating.', (done) => {
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.insertOrUpdateEgsControlDocument(['1', '2', '3'])
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('insertOrUpdateEgsControlDocument: Should return a true for updating.', (done) => {
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.insertOrUpdateEgsControlDocument({ _id: ['1', '2', '3'] })
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('insertOrUpdateEgsControlDocument: .Negative case when adp.db.create fails', (done) => {
    adp.mockBehaviour.create = false;
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.insertOrUpdateEgsControlDocument(['1', '2', '3'])
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('insertOrUpdateEgsControlDocument: .Negative case when adp.db.update fails', (done) => {
    adp.mockBehaviour.update = false;
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.insertOrUpdateEgsControlDocument({ _id: ['1', '2', '3'] })
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });

  it('setEgsControlAsSync: Should return a promise responding objectIds.', (done) => {
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.setEgsControlAsSync([1, 2, 3], 'MockStatus', 'MockMessage')
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('setEgsControlAsSync: Negative case when adp.db.updateMany fails.', (done) => {
    adp.mockBehaviour.updateMany = false;
    const egsControlModel = new adp.models.EgsControl();
    egsControlModel.setEgsControlAsSync([1, 2, 3], 'MockStatus', 'MockMessage')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        expect(ERROR.data.error).toBeDefined();
        done();
      });
  });
});
