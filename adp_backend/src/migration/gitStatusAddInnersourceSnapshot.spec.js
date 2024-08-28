// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.gitStatusAddInnersourceSnapshot ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

const MockGitstatusModel = class {
  index() {
    return new Promise((RES, REJ) => {
      if (global.behavior.MockGitstatusModelAction === 0) {
        const successfulAnswer = {
          docs: [
            { user_id: 'etesuse', date: '2021-09-15' },
          ],
        };
        RES(successfulAnswer);
      } else if (global.behavior.MockGitstatusModelAction === 1) {
        const mockCrashError = { code: 0, desc: 'mockCrashError' };
        REJ(mockCrashError);
      } else {
        const emptyAnswer = {
          docs: [],
        };
        RES(emptyAnswer);
      }
    });
  }

  update() {
    return new Promise((RES, REJ) => {
      if (global.behavior.MockGitstatusModelUpdateAction === 0) {
        const obj = { ok: 1 };
        RES(obj);
      } else if (global.behavior.MockGitstatusModelUpdateAction === 1) {
        REJ();
      } else {
        const obj = {};
        RES(obj);
      }
    });
  }
};

const MockInnersourceUserHistoryContr = class {
  getClosestSnapshot(A, B) {
    return new Promise((RES, REJ) => {
      if (global.behavior.MockInnersourceUserHistoryContrAction === 0) {
        const obj = { user_id: A, desc: B, updated: true };
        RES(obj);
      } else if (global.behavior.MockInnersourceUserHistoryContrAction === 1) {
        REJ();
      } else {
        const obj = { user_id: A, desc: B };
        RES(obj);
      }
    });
  }
};

describe('Testing [ global.adp.migration.gitStatusAddInnersourceSnapshot ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.config = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.models = {};
    adp.models.GitstatusCollectionControl = 'gitstatus';
    global.behavior = {};
    global.behavior.MockGitstatusModelAction = 0;
    global.behavior.MockGitstatusModelUpdateAction = 0;
    global.behavior.MockInnersourceUserHistoryContrAction = 0;

    const mockErrorLog = (A, B) => {
      const obj = { code: A, desc: B };
      return obj;
    };
    const mockEchoLog = () => {};

    adp.migration = {};
    adp.migration.gitStatusAddInnersourceSnapshot = proxyquire('./gitStatusAddInnersourceSnapshot', {
      './../library/errorLog': mockErrorLog,
      './../library/echoLog': mockEchoLog,
      './../models/Gitstatus': MockGitstatusModel,
      './../innerSource/InnersourceUserHistory.controller': MockInnersourceUserHistoryContr,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing a successful case.', async (done) => {
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then((RESULT) => {
        expect(RESULT).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing an error case: If [ index @ GitstatusModel ] returns empty.', async (done) => {
    global.behavior.MockGitstatusModelAction = 2;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Testing an error case: If [ index @ GitstatusModel ] crashes.', async (done) => {
    global.behavior.MockGitstatusModelAction = 1;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Testing an error case: If [ update @ GitstatusModel ] doesn`t update.', async (done) => {
    global.behavior.MockGitstatusModelUpdateAction = 2;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Testing an error case: If [ update @ GitstatusModel ] crashes.', async (done) => {
    global.behavior.MockGitstatusModelUpdateAction = 1;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Testing an error case: If [ getClosestSnapshot @ InnersourceUserHistoryContr ] crashes.', async (done) => {
    global.behavior.MockInnersourceUserHistoryContrAction = 1;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Testing if [ getClosestSnapshot @ InnersourceUserHistoryContr ] fail, is not considered as an error.', async (done) => {
    global.behavior.MockInnersourceUserHistoryContrAction = 2;
    adp.migration.gitStatusAddInnersourceSnapshot()
      .then((RESULT) => {
        expect(RESULT).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
