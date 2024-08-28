// ============================================================================================= //
/**
* Unit test for [ adp.db.updateMany ]
* @author Veerender Voskula [zvosvee]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      updateMany() {
        if (adp.mongoDatabase_updateMany_BehaviorCrash === true) {
          const mockError = 'Mock Error';
          return new Promise((RESOLVE, REJECT) => REJECT(mockError));
        }
        if (adp.mongoDatabase_UpdateMany_ResultZero === true) {
          return new Promise(RESOLVE => RESOLVE({ result: { ok: 0 } }));
        }
        return new Promise(RESOLVE => RESOLVE({ result: { n: 6002, nModified: 1, ok: 1 } }));
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.updateMany ] behavior ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mongoDatabase_UpdateMany_BehaviorCrash = false;
    adp.mongoDatabase_UpdateMany_ResultZero = false;
    adp.mongoDatabase = new MockMongoObject();
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.UPDATE = { $pull: { rbac: { name: 'XID Group' } } };
    adp.FILTER = { type: 'user' };
    adp.DB = 'ADP';
    adp.db.updateMany = require('./updateMany');
  });


  afterEach(() => {
    global.adp = null;
  });

  it('in a successful case where the type is "user".', (done) => {
    adp.db.updateMany('dataBase', adp.FILTER, adp.UPDATE)
      .then((expectObjectAfterUpdate) => {
        expect(expectObjectAfterUpdate.ok).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('if [ adp.mongoDatabase.collection().UpdateMany() ] returns ok = 0.', (done) => {
    adp.mongoDatabase_UpdateMany_ResultZero = true;
    adp.db.updateMany('dataBase', adp.FILTER, adp.UPDATE)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('if [ adp.mongoDatabase.collection().UpdateMany() ] crashes.', (done) => {
    adp.mongoDatabase_UpdateMany_BehaviorCrash = true;
    adp.db.updateMany('dataBase', adp.FILTER, adp.UPDATE)
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('should return an error because the update parameter do not have an proper obj.', (done) => {
    const update = { pull: { rbac: { name: 'XID Group' } } };
    adp.mongoDatabase_updateMany_BehaviorCrash = true;
    adp.db.updateMany(adp.DB, adp.FILTER, update)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the filter parameter is null.', (done) => {
    adp.db.updateMany(adp.DB, null, adp.UPDATE)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the update parameter is null.', (done) => {
    adp.db.updateMany(adp.DB, adp.FILTER)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the collection is empty.', (done) => {
    adp.db.updateMany(undefined, adp.FILTER, adp.UPDATE)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is not an Object.', (done) => {
    adp.db.updateMany(adp.DB, 25, 25)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
