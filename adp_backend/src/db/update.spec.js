// ============================================================================================= //
/**
* Unit test for [ adp.db.update ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      replaceOne() {
        if (adp.mongoDatabase_ReplaceOne_BehaviorCrash === true) {
          const mockError = 'Mock Error';
          return new Promise((RESOLVE, REJECT) => REJECT(mockError));
        }
        if (adp.mongoDatabase_ReplaceOne_ResultZero === true) {
          return new Promise(RESOLVE => RESOLVE({ result: { ok: 0 } }));
        }
        return new Promise(RESOLVE => RESOLVE({ result: { ok: 1 } }));
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.update ] behavior ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mongoDatabase_ReplaceOne_BehaviorCrash = false;
    adp.mongoDatabase_ReplaceOne_ResultZero = false;
    adp.mongoDatabase = new MockMongoObject();
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.db.update = require('./update');
    adp.db.checkID = (COL, OBJ) => OBJ;

    adp.dbRead_BehaviorCrash = false;
    adp.db.read = () => {
      if (adp.dbRead_BehaviorCrash === true) {
        return new Promise((RES, REJ) => {
          const mockError = 'Mock Error';
          REJ(mockError);
        });
      }
      const readMockResult = [{
        _id: 'ID25',
        type: 'test',
        desc: 'This is only a test retrieved from the Mock Database.',
      }];
      return new Promise(RES => RES(readMockResult));
    };
  });


  afterEach(() => {
    global.adp = null;
  });


  it('in a successful case.', (done) => {
    const testJSON = {
      _id: 'ID25',
      type: 'test',
      desc: 'This is only a test.',
    };
    adp.db.update('dataBase', testJSON)
      .then((expectObjectAfterUpdate) => {
        expect(expectObjectAfterUpdate.ok).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('in a successful case where the type is "microservice".', (done) => {
    const testJSON = {
      _id: 'ID25',
      type: 'microservice',
      desc: 'This is only a test.',
    };
    adp.db.update('dataBase', testJSON)
      .then((expectObjectAfterUpdate) => {
        expect(expectObjectAfterUpdate.ok).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('in a successful case, but testing extra types of attributes inside.', (done) => {
    const testJSON = {
      _id: 'ID25',
      type: 'test',
      desc: 'This is only a test.',
      emptyArray: [],
      nonEmptyArray: ['Test'],
      nullField: null,
      undefinedField: undefined,
      emptyString: '',
    };
    adp.db.update('dataBase', testJSON)
      .then((expectObjectAfterUpdate) => {
        expect(expectObjectAfterUpdate.ok).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('if [ adp.db.read ] crashes.', (done) => {
    adp.dbRead_BehaviorCrash = true;
    const testJSON = {
      _id: 'ID25',
      type: 'test',
      desc: 'This is only a test.',
      emptyArray: [],
      nonEmptyArray: ['Test'],
      nullField: null,
      undefinedField: undefined,
      emptyString: '',
    };
    adp.db.update('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('if [ adp.mongoDatabase.collection().replaceOne() ] returns ok = 0.', (done) => {
    adp.mongoDatabase_ReplaceOne_ResultZero = true;
    const testJSON = {
      _id: 'ID25',
      type: 'test',
      desc: 'This is only a test.',
      emptyArray: [],
      nonEmptyArray: ['Test'],
      nullField: null,
      undefinedField: undefined,
      emptyString: '',
    };
    adp.db.update('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('if [ adp.mongoDatabase.collection().replaceOne() ] crashes.', (done) => {
    adp.mongoDatabase_ReplaceOne_BehaviorCrash = true;
    const testJSON = {
      _id: 'ID25',
      type: 'test',
      desc: 'This is only a test.',
      emptyArray: [],
      nonEmptyArray: ['Test'],
      nullField: null,
      undefinedField: undefined,
      emptyString: '',
    };
    adp.db.update('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter do not have an "_id" property.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
    };
    adp.db.update('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is an empty Object.', (done) => {
    const testJSON = {};
    adp.db.update({}, testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is null.', (done) => {
    adp.db.update(null, null)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is undefined.', (done) => {
    adp.db.update(undefined, undefined)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('should return an error because the parameter is not an Object.', (done) => {
    adp.db.update(25, 25)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
