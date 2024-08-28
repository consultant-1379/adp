// ============================================================================================= //
/**
* Unit test for [ adp.db.createMany ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      insertMany() {
        if (adp.mongoDatabase_createMany_BehaviorCrash === true) {
          const mockError = 'Mock Error';
          return new Promise((RESOLVE, REJECT) => REJECT(mockError));
        }
        if (adp.mongoDatabase_createMany_ResultZero === true) {
          return new Promise(RESOLVE => RESOLVE({ result: { ok: 0 } }));
        }
        return new Promise(RESOLVE => RESOLVE({ result: { n: 6002, nModified: 1, ok: 1 } }));
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.createMany ] behavior ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mongoDatabase_createMany_BehaviorCrash = false;
    adp.mongoDatabase_createMany_ResultZero = false;
    adp.mongoDatabase = new MockMongoObject();
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.UPDATE = { $pull: { rbac: { name: 'XID Group' } } };
    adp.objectsToInsert = [{ mock: 1 }, { mock: 2 }, { mock: 3 }];
    adp.DB = 'ADP';
    adp.db.createMany = require('./createMany');
  });


  afterEach(() => {
    global.adp = null;
  });

  it('in a successful case where the type is "user".', (done) => {
    adp.db.createMany('dataBase', adp.objectsToInsert)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate.ok).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('if [ adp.mongoDatabase.collection().createMany() ] returns ok = false.', (done) => {
    adp.mongoDatabase_createMany_ResultZero = true;
    adp.db.createMany('dataBase', adp.objectsToInsert)
      .then((RESULT) => {
        expect(RESULT.ok).toEqual(false);
        done();
      }).catch(() => {
        done();
      });
  });


  it('if [ adp.mongoDatabase.collection().createMany() ] crashes.', (done) => {
    adp.mongoDatabase_createMany_BehaviorCrash = true;
    adp.db.createMany('dataBase', adp.objectsToInsert)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the update parameter do not have an proper obj.', (done) => {
    adp.mongoDatabase_createMany_BehaviorCrash = true;
    adp.db.createMany(adp.DB, adp.objectsToInsert)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the filter parameter is null.', (done) => {
    adp.db.createMany(adp.DB, null, adp.UPDATE)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the update parameter is null.', (done) => {
    adp.db.createMany(adp.DB, adp.FILTER)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the collection is empty.', (done) => {
    adp.db.createMany(undefined, adp.FILTER, adp.UPDATE)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is not an Object.', (done) => {
    adp.db.createMany(adp.DB, 25, 25)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
