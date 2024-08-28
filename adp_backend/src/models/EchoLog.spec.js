/**
* Unit test for [ adp.models.EchoLog ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.EchoLog ], ', () => {
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

    adp.slugIt = SOMETHING => SOMETHING;
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.EchoLog = require('./EchoLog');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const echoLogModel = new adp.models.EchoLog();
    echoLogModel.createOne({ mockObject: 'mockID' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.createIndexCollection).toBe('echoLog');
        expect(adp.check.dbName).toBe('echoLog');
        expect(adp.check.dbID.mockObject).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
