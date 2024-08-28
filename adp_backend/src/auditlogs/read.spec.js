// ============================================================================================= //
/**
* Unit test for [ global.adp.auditlogs.read ]
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.auditlogs.read ] is able to read mock auditlogs', () => {
  class mockAdpLogClass {
    getLogs(SIGNUM, TYPE, ASSET, LIMIT, SKIP, ISADMIN) {
      global.compareData = {};
      global.compareData.signum = SIGNUM;
      global.compareData.type = TYPE;
      global.compareData.asset = ASSET;
      global.compareData.limit = LIMIT;
      global.compareData.skip = SKIP;
      global.compareData.isadmin = ISADMIN;
      return new Promise((resolve, reject) => {
        if (adp.getLogsFail) {
          reject();
          return;
        }
        resolve(adp.dbFindReturnData);
      });
    }
  }
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = mockAdpLogClass;
    adp.getLogsFail = false;
    adp.dbFindReturnData = { docs: [{ datetime: '2020-12-23' }, { datetime: '2020-12-25' }] };
    global.adp.auditlogs = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    /* eslint-disable global-require */
    global.adp.auditlogs.read = require('./read');
    global.adp.Answers = require('../answers/AnswerClass');
    global.adp.dynamicSort = require('../library/dynamicSort');
    /* eslint-enable global-require */
    global.adp.db = {};
    global.adp.db.find = (db, requestData) => new Promise((resolve, reject) => {
      if (requestData.selector.type === 'mockFail') {
        return reject();
      }
      const resultSuccess = { docs: [requestData.selector], totalInDatabase: 1 };
      return resolve(resultSuccess);
    });
    global.adp.getSizeInMemory = () => true;
    global.adp.echoLog = () => true;
    global.adp.permission = {};
    global.adp.permission.canDoIt = () => new Promise((RESOLVE) => {
      RESOLVE(true);
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[global.adp.auditlogs.read] should return code 400 if no params passed', async (done) => {
    await global.adp.auditlogs.read({})
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(400);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return only datetime object if empty params obj is passed', async (done) => {
    await global.adp.auditlogs.read({ params: {} })
      .then((logResponse) => {
        const builtQuery = logResponse.templateJSON.data[0];

        expect(Object.keys(builtQuery).length).toBe(1);
        expect(global.compareData.signum).toBe(undefined);
        expect(global.compareData.type).toBe(undefined);
        expect(global.compareData.asset).toBe(undefined);
        expect(global.compareData.limit).toBe(9999999);
        expect(global.compareData.skip).toBe(0);
        expect(global.compareData.isadmin).toBe(true);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return type of mocktype if passed as typeoroption', async (done) => {
    const mockType = 'anyOptionType';
    await global.adp.auditlogs.read({ params: { typeoroption: mockType } })
      .then(() => {
        expect(global.compareData.type).toBe(mockType);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return mocktype and mocktypeId as type and new._id respectively', async (done) => {
    const mockType = 'anyOptionType';
    const mockTypeId = 1;
    await global.adp.auditlogs.read({ params: { typeoroption: mockType, id: mockTypeId } })
      .then(() => {
        expect(global.compareData.type).toBe(mockType);
        expect(global.compareData.asset._id).toBe(mockTypeId);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return error code 400 if a byusersignum is passed only', async (done) => {
    await global.adp.auditlogs.read({ params: { typeoroption: 'byusersignum' } })
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(400);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlogs.read] should return signum of the passed mocksignum if typeoroption is byusersignum and mocksignum as id', async (done) => {
    const mockSignum = 'anysignum';
    await global.adp.auditlogs.read({ params: { typeoroption: 'byusersignum', id: mockSignum } })
      .then(() => {
        expect(global.compareData.signum).toBe(mockSignum);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return signum & type related to the mock data passed as id and optiontype respectively', async (done) => {
    const mockSignum = 'anysignum';
    const mockType = 'anyType';
    await global.adp.auditlogs.read({ params: { typeoroption: 'byusersignum', id: mockSignum, optiontype: mockType } })
      .then(() => {
        expect(global.compareData.type).toBe(mockType);
        expect(global.compareData.signum).toBe(mockSignum);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('[global.adp.auditlogs.read] should return signum, type and new._id as the mock data passed through id,optiontype and optiontypeid repectively', async (done) => {
    const mockSignum = 'anysignum';
    const mockType = 'anyType';
    const mockTypeId = 'anyTypeId';
    await global.adp.auditlogs.read(
      {
        params: {
          typeoroption: 'byusersignum',
          id: mockSignum,
          optiontype: mockType,
          optiontypeid: mockTypeId,
        },
      },
    ).then(() => {
      expect(global.compareData.signum).toBe(mockSignum);
      expect(global.compareData.type).toBe(mockType);
      expect(global.compareData.asset._id).toBe(mockTypeId);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('[global.adp.auditlogs.read] should return mocklimit and page must be zero', async (done) => {
    const mockLimit = 10;
    await global.adp.auditlogs
      .read({ params: {}, query: { limit: mockLimit } }).then((logResponse) => {
        expect(logResponse.templateJSON.limit).toBe(mockLimit);
        expect(logResponse.templateJSON.page).toBe(0);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlogs.read] should return mocklimit and page must not be zero', async (done) => {
    const mockLimit = 10;
    const mockPage = 10;
    await global.adp.auditlogs
      .read({ params: {}, query: { limit: mockLimit, page: mockPage } }).then((logResponse) => {
        expect(logResponse.templateJSON.limit).toBe(mockLimit);
        expect(logResponse.templateJSON.page).toBe(mockPage);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[global.adp.auditlogs.read] should return error code 500 on database fail', async (done) => {
    adp.getLogsFail = true;
    await global.adp.auditlogs.read({ params: { typeoroption: 'mockFail' } })
      .then((logResponse) => {
        expect(logResponse.templateJSON.code).toBe(500);
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
