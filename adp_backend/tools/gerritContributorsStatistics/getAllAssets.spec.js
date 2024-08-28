// ============================================================================================= //
/**
* Unit test for [ cs.getAllAssets ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
let getLogsFail;
let mockLoggerResponse;

class MockAdpLogClass {
  getAssetHistory() {
    return new Promise((RS, RJ) => {
      if (adp.db.getBehaviorIfDataBaseLog === 0) {
        const obj = {
          docs: [
            {
              new: { giturl: 'something_new' },
              old: { giturl: '' },
            },
          ],
        };
        RS(obj);
      } else if (adp.db.getBehaviorIfDataBaseLog === 1) {
        const obj = {
          docs: [
            {
              new: { giturl: 'something_new' },
              old: { giturl: 'something_old' },
            },
          ],
        };
        RS(obj);
      } else if (adp.db.getBehaviorIfDataBaseLog === 2) {
        const obj = {
          docs: [
            {
              new: { giturl: '' },
              old: { giturl: 'something_old' },
            },
          ],
        };
        RS(obj);
      } else if (adp.db.getBehaviorIfDataBaseLog === 3) {
        const obj = {};
        RS(obj);
      } else {
        const mockError = 'MOCK TEST ERROR';
        RJ(mockError);
      }
    });
  }
}

let getByQueryResponse;
let getByQueryFail;

class MockAdpClass {
  getAssetByIDorSLUG() {
    return new Promise((resolve, reject) => {
      if (!adp.db.setResult) {
        const error = 'MOCK TEST ERROR';
        reject(error);
        return;
      }
      if (adp.db.getBehavior === 0) {
        resolve(cs.getAllAssetsMockFindAnswer);
        return;
      }
      resolve({ docs: [] });
    });
  }
}

describe('[ gerritContributorsStatistics ] testing [ cs.getAllAssets ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLogClass;
    adp.models.Adp = MockAdpClass;
    mockLoggerResponse = { docs: [] };
    getLogsFail = false;
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.fullLog = [];
    adp.fullLogDetails = {};
    adp.echoDivider = () => {};
    cs.finalTimerLine = SOMETHING => SOMETHING;
    cs.executionTimer = SOMETHING => SOMETHING;
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    cs.getAllAssets = require('./getAllAssets');
    cs.getAllAssetsMockFindAnswer = require('./getAllAssets.spec.json');
    getByQueryResponse = cs.getAllAssetsMockFindAnswer;
    getByQueryFail = false;
    adp.echoLog = () => {};
    cs.logDetails = () => {};
    adp.db = {};
    adp.db.setResult = true;
    adp.db.getBehavior = 0;
    adp.db.getBehaviorIfDataBaseLog = 0;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing a successful case.', async (done) => {
    cs.getAllAssets()
      .then((ANSWER) => {
        expect(ANSWER['mock-id-1'].slug).toBe('mock-asset-1');
        expect(ANSWER['mock-id-2'].slug).toBe('mock-asset-2');
        expect(adp.fullLog[0].asset_id).toBe('mock-id-3');
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('Testing a successful case, but with parameter.', async (done) => {
    cs.getAllAssets('mock-asset-slug')
      .then((ANSWER) => {
        expect(ANSWER['mock-id-1'].slug).toBe('mock-asset-1');
        expect(ANSWER['mock-id-2'].slug).toBe('mock-asset-2');
        expect(adp.fullLog[0].asset_id).toBe('mock-id-3');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing if parameter returns no Asset.', async (done) => {
    adp.db.getBehavior = 1;
    cs.getAllAssets('mock-no-asset')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('Testing if parameter returns an Asset with different logs.', async (done) => {
    adp.db.getBehaviorIfDataBaseLog = 1;
    cs.getAllAssets('mock-asset-slug')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing if parameter returns an Asset with different logs (another).', async (done) => {
    adp.db.getBehaviorIfDataBaseLog = 2;
    cs.getAllAssets('mock-asset-slug')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing if parameter returns an Asset without logs.', async (done) => {
    adp.db.getBehaviorIfDataBaseLog = 3;
    cs.getAllAssets('mock-asset-slug')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing if parameter returns an Asset with crashed logs.', async (done) => {
    adp.db.getBehaviorIfDataBaseLog = 4;
    cs.getAllAssets('mock-asset-slug')
      .then((error) => {
        done.fail(error);
      })
      .catch(() => {
        done();
      });
  });


  it('Testing a negative case.', async (done) => {
    adp.db.setResult = false;
    cs.getAllAssets()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
