// ============================================================================================= //
/**
* Unit test for [ global.adp.auditlog.create ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.auditlog.create ]', () => {
  class mockAdpLog {
    createOne(OBJ) {
      global.mockResult = {};
      global.mockResult.obj = OBJ;
      if (adp.models.AdpLogMockError === true) {
        return new Promise((RES, REJ) => REJ());
      }
      return new Promise(RES => RES());
    }
  }
  beforeEach(() => {
    global.adp = {};
    global.adp.auditlog = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    /* eslint-disable global-require */
    global.adp.auditlog.create = require('./create');
    /* eslint-enable global-require */
    global.adp.db = {};
    global.adp.db.create = (DB, OBJ) => new Promise((RESOLVE) => {
      global.mockResult = OBJ;
      RESOLVE();
    });
    adp.models = {};
    adp.models.AdpLog = mockAdpLog;
    adp.models.AdpLogMockError = false;
    global.adp.echoLog = () => true;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Simulate the saving of a log in database, following the template', async (done) => {
    const obj = { errorObject: 'mockError' };
    await global.adp.auditlog.create(obj)
      .then(() => {
        expect(global.mockResult.obj).toEqual(obj);
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('Simulate an error when trying to save a log in database', async (done) => {
    const obj = { errorObject: 'mockError' };
    adp.models.AdpLogMockError = true;
    await global.adp.auditlog.create(obj)
      .then(() => {
        done.fail();
      }).catch(() => {
        expect(global.mockResult.obj).toEqual(obj);
        done();
      });
  });
});
// ============================================================================================= //
