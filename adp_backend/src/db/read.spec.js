// ============================================================================================= //
/**
* Unit test for [ adp.db.read ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      findOne() {
        if (adp.mongoDatabaseBehaviorCrash === true) {
          const mockError = 'Mock Error';
          return new Promise((RESOLVE, REJECT) => REJECT(mockError));
        }
        const testJSON = {
          _id: 'ID25',
          type: 'test',
          desc: 'This is only a test.',
          thatsOk: true,
        };
        return new Promise(RESOLVE => RESOLVE(testJSON));
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.read ] behavior ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mongoDatabaseBehaviorCrash = false;
    adp.mongoDatabase = new MockMongoObject();
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.db.crud = {};
    adp.config = {};
    adp.db.checkID = (COL, OBJ) => OBJ;
    adp.db.read = require('./read');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('in a successful case.', (done) => {
    global.adp.db.read('dataBase', 'ID25')
      .then((expectObject) => {
        expect(expectObject.thatsOk).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('should return an error because the parameter is an empty Object.', (done) => {
    global.adp.db.read({}, {}).then((expectObject) => {
      expect(expectObject.thatsOk).toBeFalsy();
      done();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it('should return an error because the parameter is null.', (done) => {
    global.adp.db.read(null, null)
      .then((expectObject) => {
        expect(expectObject.thatsOk).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('should return an error because the parameter is undefined.', (done) => {
    global.adp.db.read(undefined, undefined)
      .then((expectObject) => {
        expect(expectObject.thatsOk).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('should return an error because the parameter is not a String.', (done) => {
    global.adp.db.read(25, 25)
      .then((expectObject) => {
        expect(expectObject.thatsOk).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });


  it('if [ adp.mongoDatabase.collection().findOne() ] crashes.', (done) => {
    adp.mongoDatabaseBehaviorCrash = true;
    global.adp.db.read('dataBase', 'ID25')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
