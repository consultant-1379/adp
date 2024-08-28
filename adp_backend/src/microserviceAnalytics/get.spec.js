// ============================================================================================= //
/**
* Unit test for [ global.adp.microserviceAnalytics.get ]
* @author Omkar Sadegaonkar [esdgmkr]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class MockPreparedStatement {
  constructor(pool) {
    this.pool = pool;
    this.inputCalled = false;
    this.prepareCalled = false;
    this.executeCalled = false;
    this.unpreparedCalled = false;
  }

  input() {
    this.inputCalled = true;
  }

  prepare(state, callback) {
    this.prepareCalled = true;
    if (global.mssql.passPrepareCallback) {
      return callback(null, {});
    }
    throw Error();
  }

  execute(pipelineName, callback) {
    this.executeCalled = true;
    if (global.mssql.passExecuteCallback) {
      return callback(null, global.mssql.executeResponseData);
    }
    throw Error();
  }

  unprepare() {
    this.unpreparedCalled = false;
  }
}

let msReadPass;
let msData;


describe('Testing [ global.adp.microserviceAnalytics.get ] ', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;

    global.adp.microservice = {};
    msReadPass = true;
    msData = {
      helm_chartname: 'test',
    };
    global.adp.microservice.read = () => new Promise((resolve, reject) => {
      if (msReadPass) {
        resolve(msData);
      } else {
        reject();
      }
    });

    global.adp.config = {};
    global.adp.config.mssqldb = {
      user: 'test',
      password: 'test',
      server: 'test',
      encrypt: true,
      database: 'test',
    };
    global.mssql = {};
    global.mssql.close = () => true;
    global.mssql.connect = config => new Promise((RES, REJ) => {
      if (config && config.user === 'test' && config.password === 'test') {
        RES([]);
      } else {
        const error = {
          msg: 'wrong credentials',
        };
        REJ(error);
      }
    });
    global.mssql.VarChar = () => {};
    global.mssql.PreparedStatement = MockPreparedStatement;
    global.mssql.passPrepareCallback = true;
    global.mssql.executeResponseData = { recordset: '' };
    global.mssql.passExecuteCallback = true;

    global.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.mockMetrics = {
      customMetrics: {
        ciTableauRequestMonitoringHistogram: {
          observe: () => {},
        },
        externalErrorCounter: {
          inc: () => {},
        },
      },
    };

    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.microserviceAnalytics = {};
    global.adp.microserviceAnalytics.get = proxyquire('./get', {
      '../library/errorLog': global.mockErrorLog,
      '../metrics/register': global.mockMetrics,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should send valid response if the tableau server sends valid data', async (done) => {
    const expectedValue = 'testVal';
    global.mssql.executeResponseData.recordset = expectedValue;

    await global.adp.microserviceAnalytics.get('test')
      .then((result) => {
        expect(result.First_Spinnaker_Pipeline_Trigger).toBe(expectedValue);
        expect(result.Last_Spinnaker_Pipeline_Success).toBe(expectedValue);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should send valid response if helm not set', async (done) => {
    const expectedValue = 'testVal';
    msData = {};
    global.mssql.executeResponseData.recordset = expectedValue;

    await global.adp.microserviceAnalytics.get('test')
      .then((result) => {
        expect(result.First_Spinnaker_Pipeline_Trigger).toBe(expectedValue);
        expect(result.Last_Spinnaker_Pipeline_Success).toBe(expectedValue);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should send valid response if microservice read fails', async (done) => {
    const expectedValue = 'testVal';
    msReadPass = false;
    global.mssql.executeResponseData.recordset = expectedValue;

    await global.adp.microserviceAnalytics.get('test')
      .then((result) => {
        expect(result.First_Spinnaker_Pipeline_Trigger).toBe(expectedValue);
        expect(result.Last_Spinnaker_Pipeline_Success).toBe(expectedValue);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should reject with error if the tableau server credentials are wrong', async (done) => {
    global.adp.config.mssqldb.password = 'wrongpassword';
    await global.adp.microserviceAnalytics.get('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });

  it('should reject with error if the query can\'t be prepared.', async (done) => {
    global.mssql.passPrepareCallback = false;
    await global.adp.microserviceAnalytics.get('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });

  it('should reject with error if the query execution fails.', async (done) => {
    global.mssql.passExecuteCallback = false;
    await global.adp.microserviceAnalytics.get('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });

  it('should send empty response if did not find any data', async (done) => {
    global.mssql.executeResponseData = {};
    await global.adp.microserviceAnalytics.get('test')
      .then((resp) => {
        expect(resp).toEqual([]);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
