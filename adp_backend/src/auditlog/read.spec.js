// ============================================================================================= //
/**
* Unit test for [ global.adp.auditlog.read ]
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.auditlog.read ] is able to read a mock auditlog', () => {
  class mockClass {
    getLogByID() {
      return new Promise((resolve, reject) => {
        if (adp.getLogByIDFail) {
          reject();
          return;
        }
        resolve(adp.dbFindReturnData);
      });
    }
  }
  beforeEach(() => {
    global.adp = {};
    adp.dbFindReturnData = { docs: [{ id: 1 }], totalInDatabase: 1 };
    adp.getLogByIDFail = false;
    adp.models = {};
    adp.models.AdpLog = mockClass;
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      REJECT(); // Always simulate there is no cache in Unit Test...
    });
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.auditlog = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    /* eslint-disable global-require */
    global.adp.auditlog.read = require('./read');
    global.adp.Answers = require('../answers/AnswerClass');
    /* eslint-enable global-require */
    global.adp.db = {};
    global.adp.db.find = (db, requestData) => new Promise((resolve, reject) => {
      if (requestData.selector._id === 'validLogId') { // eslint-disable-line 
        const result = { docs: [{ id: 1 }], totalInDatabase: 1 };
        resolve(result);
        return result;
      } else if( requestData.selector._id === 'invalidLogId' ) { // eslint-disable-line 
        const result = { docs: [], totalInDatabase: 1 };
        resolve(result);
        return result;
      }
      const error = [];
      reject(error);
      return error;
    });
    global.adp.getSizeInMemory = () => true;
    global.adp.echoLog = () => true;
    global.adp.permission = {};
    global.canDoItResult = true;
    global.adp.permission.canDoIt = () => new Promise((RESOLVE, REJECT) => {
      if (global.canDoItResult === true) {
        RESOLVE(true);
      } else {
        REJECT();
      }
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[global.adp.auditlog.read] should return code 400 if no params passed', async (done) => {
    await global.adp.auditlog.read({})
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(400);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlog.read] should return code 400 if params is passed but no id', async (done) => {
    await global.adp.auditlog.read({ params: {} })
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(400);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlog.read] should return id 1', async (done) => {
    await global.adp.auditlog.read({ params: { id: 'validLogId' } })
      .then((logResponse) => {
        expect(logResponse.templateJSON.data[0].id).toBe(1);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlog.read] should return empty array if the id does not exist', async (done) => {
    adp.dbFindReturnData = { docs: [], totalInDatabase: 1 };
    await global.adp.auditlog.read({ params: { id: 'invalidLogId' } })
      .then((logResponse) => {
        expect(logResponse.templateJSON.data.length).toBe(0);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlog.read] should return error code 500 if db fetch failure', async (done) => {
    adp.getLogByIDFail = true;
    await global.adp.auditlog.read({ params: { id: '' } })
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(500);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
