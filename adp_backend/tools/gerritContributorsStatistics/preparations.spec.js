// ============================================================================================= //
/**
* Unit test for [ cs.preparations ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //

class MockGitStatus {
  getJustOneToCheckIfIsEmpty() {
    return new Promise((resolve, reject) => {
      if (adp.db.findCodeBehavior === 0) {
        // Success, database is empty...
        const obj = { resultsReturned: 0 };
        resolve(obj);
      } else if (adp.db.findCodeBehavior === 1) {
        // Success, database is not empty...
        const obj = { resultsReturned: 1 };
        resolve(obj);
      } else {
        // Error
        const msg = 'Mock Error';
        reject(msg);
      }
    });
  }
}

class mockTeamHistory {
  fetchLatestSnapshotsAllMs() {
    this.something = 1;
    return new Promise((RES) => {
      this.something = 1;
      return RES([]);
    });
  }
}

describe('[ gerritContributorsStatistics ] testing [ cs.preparations ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.models = {};
    adp.models.Gitstatus = MockGitStatus;
    adp.config = {};
    adp.config.contributorsStatistics = {};
    adp.config.contributorsStatistics.gerritApiRevisionDetail = 'https://mock/a/changes/|||:COMMITID:|||/revisions/|||:COMMITREVISION:|||/commit/';
    adp.docs = {};
    adp.docs.list = [];
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    cs.executionTimer = SOMETHING => SOMETHING;
    cs.preparations = require('./preparations');
    cs.finalTimerLine = () => {};
    adp.fullLog = [];
    adp.echoLog = () => {};
    adp.echoDivider = () => {};
    adp.timeStepStart = () => {};
    adp.setup = {};
    adp.setup.loadFromFile = () => {};
    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = mockTeamHistory;
    adp.db = {};
    adp.db.start = () => {};
    adp.db.findCodeBehavior = 0;
    adp.db.find = () => new Promise((RES, REJ) => {
      if (adp.db.findCodeBehavior === 0) {
        // Success, database is empty...
        const obj = { resultsReturned: 0 };
        RES(obj);
      } else if (adp.db.findCodeBehavior === 1) {
        // Success, database is not empty...
        const obj = { resultsReturned: 1 };
        RES(obj);
      } else {
        // Error
        const msg = 'Mock Error';
        REJ(msg);
      }
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a simple successful case, where the database is empty.', async (done) => {
    adp.db.findCodeBehavior = 0;
    cs.preparations()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a simple successful case, where the database is not empty.', async (done) => {
    adp.db.findCodeBehavior = 1;
    cs.preparations()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing the behavior if [ adp.db.find ] fails.', async (done) => {
    adp.db.findCodeBehavior = 2;
    cs.preparations()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
