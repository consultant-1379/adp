// ============================================================================================= //
/**
* Unit test for [ adp.db.create ]
* @author Armando Schiavon Dias [escharm], Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
class MockMongoObjectId {
  constructor() {
    this.id = 1;
  }

  toString() {
    return `${this.id}`;
  }
}


describe('Testing [ adp.db.create ] ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.MongoObjectID = MockMongoObjectId;
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.db.create = require('./create');
    adp.db.checkID = (COL, OBJ) => OBJ;
    adp.mongoDatabaseErrorOnInsert = false;
    adp.mongoDatabaseCrashOnInsert = false;
    adp.mongoDatabase = {};
    const collectionFunctions = {
      insertOne() {
        if (adp.mongoDatabaseCrashOnInsert === true) {
          const mockError = 'Mock Error';
          return new Promise((RESOLVE, REJECT) => REJECT(mockError));
        }
        const obj = {
          result: {
            ok: 1,
          },
          insertedId: 'mockInsertedId',
        };
        if (adp.mongoDatabaseErrorOnInsert === false) {
          return new Promise(RESOLVE => RESOLVE(obj));
        }
        return new Promise(RESOLVE => RESOLVE({}));
      },
    };
    adp.mongoDatabase.collection = () => collectionFunctions;
  });


  afterEach(() => {
    global.adp = null;
  });


  it(' should return an error because the parameter is an empty Object.', (done) => {
    const testJSON = {};
    global.adp.db.create('dataBase', testJSON)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate).toBeDefined();
        done();
        return '';
      }).catch((errorArray) => {
        expect(Array.isArray(errorArray)).toBeTruthy();
        done();
        return '';
      });
  });


  it(' should return an error because the parameter is null.', (done) => {
    global.adp.db.create(null, null)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate).toBeDefined();
        done();
        return '';
      }).catch((errorArray) => {
        expect(Array.isArray(errorArray)).toBeTruthy();
        done();
        return '';
      });
  });


  it(' should return an error because the parameter is undefined.', (done) => {
    global.adp.db.create(undefined, undefined)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate).toBeDefined();
        done();
        return '';
      }).catch((errorArray) => {
        expect(Array.isArray(errorArray)).toBeTruthy();
        done();
        return '';
      });
  });


  it(' should return an error because the parameter is not an Object.', (done) => {
    global.adp.db.create(25, 25)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate).toBeTruthy();
        done();
        return '';
      }).catch((errorArray) => {
        expect(Array.isArray(errorArray)).toBeTruthy();
        done();
        return '';
      });
  });


  it(' should create a register in database.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    global.adp.db.create('dataBase', testJSON)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate.ok).toBeTruthy();
        done();
        return '';
      })
      .catch((error) => {
        done.fail(error);
        return '';
      });
  });


  it(' testing different values for object.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      emptyString: '',
      nullField: null,
      emptyArray: [],
      notEmptyArray: ['test'],
      keepGoing: true,
    };
    global.adp.db.create('dataBase', testJSON)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate.ok).toBeTruthy();
        done();
        return '';
      })
      .catch((error) => {
        done.fail(error);
        return '';
      });
  });


  it(' should create a register in database (type: microservice).', (done) => {
    const testJSON = {
      type: 'microservice',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    global.adp.db.create('dataBase', testJSON)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate.ok).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it(' should create a register with a defined id.', (done) => {
    const testJSON = {
      _id: 'fixedID',
      type: 'microservice',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    global.adp.db.create('dataBase', testJSON)
      .then((expectObjectAfterCreate) => {
        expect(expectObjectAfterCreate.ok).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it(' should return an error in case of failure in Insert.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    adp.mongoDatabaseErrorOnInsert = true;
    global.adp.db.create('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch((errorArray) => {
        expect(errorArray).toBeDefined();
        done();
      });
  });


  it(' should return an error in case of crash in Insert.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    adp.mongoDatabaseCrashOnInsert = true;
    global.adp.db.create('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch((errorArray) => {
        expect(errorArray).toBeDefined();
        done();
      });
  });
});
// ============================================================================================= //
