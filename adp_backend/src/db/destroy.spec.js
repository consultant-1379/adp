// ============================================================================================= //
/**
* Unit test for [ adp.db.destroy ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      deleteOne(OBJ) {
        this.object = OBJ;
        return new Promise((RES, REJ) => {
          if (adp.mongoDatabaseResolve === true) {
            if (adp.mongoDatabaseResolveValidResponse === true) {
              RES({ result: { ok: 1 } });
            } else {
              RES({ result: { ok: 0 } });
            }
          } else {
            const errorText = 'MockError';
            REJ(errorText);
          }
        });
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.destroy ] with expected and unexpected parameters.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mongoDatabaseResolve = true;
    adp.mongoDatabaseResolveValidResponse = true;
    adp.mongoDatabase = new MockMongoObject();
    adp.masterCache = {};
    adp.masterCache.clearBecauseCUD = () => {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.db = {};
    adp.db.checkID = (COL, OBJ) => OBJ;
    adp.db.destroy = require('./destroy');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ adp.db.destroy ] should remove an register from Database.', (done) => {
    adp.db.destroy('dataBase', 'ID25')
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('[ adp.db.destroy ] should return an error because the parameter is an empty Object.', (done) => {
    adp.db.destroy({}, {})
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('[ adp.db.destroy ] should return an error because the parameter is null.', (done) => {
    adp.db.destroy(null, null)
      .then(() => {
        done.false();
      }).catch(() => {
        done();
      });
  });


  it('[ adp.db.destroy ] should return an error because the parameter is undefined.', (done) => {
    adp.db.destroy(undefined, undefined)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('[ adp.db.destroy ] should return an error because the parameter is not a String.', (done) => {
    adp.db.destroy(25, 25)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('[ adp.db.destroy ] should return an error because of failure of deleting in MongoDB.', (done) => {
    adp.db.destroy('dataBase', 'ID25')
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('[ adp.db.destroy ] behavior if the response is invalid.', (done) => {
    adp.mongoDatabaseResolve = true;
    adp.mongoDatabaseResolveValidResponse = false;
    adp.db.destroy('dataBase', 'ID25')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('[ adp.db.destroy ] behavior if the [ adp.mongoDatabase.collection().deleteOne() ] crashes.', (done) => {
    adp.mongoDatabaseResolve = false;
    adp.mongoDatabaseResolveValidResponse = false;
    adp.db.destroy('dataBase', 'ID25')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
