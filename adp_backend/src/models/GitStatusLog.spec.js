/**
* Unit test for [ adp.models.GitStatusLog ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.GitStatusLog ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.config = {};
    adp.check = {};
    adp.slugIt = SOMETHING => SOMETHING;
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.EchoLog = require('./GitStatusLog');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const echoLogModel = new adp.models.EchoLog();
    echoLogModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('gitstatuslog');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
