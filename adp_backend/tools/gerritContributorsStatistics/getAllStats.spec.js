// ============================================================================================= //
/**
* Unit test for [ cs.getAllStats ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
class Gitstatus {
  constructor() {
    this.dbName = 'dataBaseGitStatus';
  }

  getLatestCommitForAsset() {
    return new Promise((RES, REJ) => {
      if (adp.dataBaseGitStatusBehavior === true) {
        this.obj = {
          docs: [
            { date: '2020-10-01' }, { date: '2020-09-05' }, { date: '2020-08-05' },
          ],
        };
        RES(this.obj);
      } else {
        this.msg = 'MockError';
        REJ(this.msg);
      }
    });
  }
}
// ============================================================================================= //
class SaveThisMockClass {
  constructor(STARTER) {
    this.data = STARTER;
  }

  go() {
    return new Promise((RES, REJ) => {
      if (cs.saveThisBehavior === true) {
        RES();
      } else {
        this.msg = 'MockError';
        REJ(this.msg);
      }
    });
  }
}
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.getAllStats ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.docs = {};
    adp.docs.list = [];
    cs.cantChangeInitialDateIDs = [];
    adp.fullSuccessLog = [];
    adp.models = {};
    adp.models.Gitstatus = Gitstatus;
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    adp.config = {};
    adp.config.eadpusersPassword = 'mock@password';
    adp.config.contributorsStatistics = {};
    adp.config.contributorsStatistics.gerritApi = 'https://gerrit-gamma.gic.ericsson.se/a/changes/?o=DETAILED_ACCOUNTS&q=status:merged+branch:"master"+after:"|||:AFTERDATE:|||+00:00:00"+before:"|||:BEFOREDATE:|||+23:59:59"+project:"|||:PROJECTNAME:|||"';
    adp.config.innersourceLaunchDate = '2020-01-10';
    adp.dynamicSort = require('./../../src/library/dynamicSort');
    adp.MockList = require('./getAllStatsList.spec.json').docs;
    adp.MockAPI = require('./getAllStatsAPI.spec.json');
    adp.MockAPIString = `01234${JSON.stringify(adp.MockAPI)}`;
    cs.getAllStats = require('./getAllStats');
    cs.finalTimerLine = SOMETHING => SOMETHING;
    cs.executionTimer = SOMETHING => SOMETHING;
    adp.fullLog = [];
    adp.fullLogDetails = {};
    cs.logDetails = () => {};
    adp.echoLog = () => {};
    adp.echoDivider = () => {};
    adp.dateLogSystemFormat = (THEDATE) => {
      if (THEDATE === undefined || THEDATE === null) {
        const fixedDate = {
          y: '2020',
          m: '10',
          d: '05',
          fileName: '2020-10-05_08-30',
        };
        return fixedDate;
      }
      const fixedDate = {
        y: '2019',
        m: '10',
        d: '05',
        fileName: '2019-10-05_08-30',
      };
      return fixedDate;
    };
    adp.dataBaseGitStatus = {};
    adp.dataBaseGitStatusBehavior = true;
    adp.dataBaseGitStatus.find = () => new Promise((RES, REJ) => {
      if (adp.dataBaseGitStatusBehavior === true) {
        const obj = {
          docs: [
            { date: '2020-10-01' }, { date: '2020-09-05' }, { date: '2020-08-05' },
          ],
        };
        RES(obj);
      } else {
        const msg = 'MockError';
        REJ(msg);
      }
    });
    cs.saveThisBehavior = true;
    cs.SaveThis = SaveThisMockClass;
    global.request = {};
    global.request.get = (PARAM, CALLBACK) => {
      if (adp.MockAPI.length < 500) {
        adp.MockAPIString = `01234${JSON.stringify(adp.MockAPI)}`;
        CALLBACK(null, null, adp.MockAPIString);
      } else {
        const toSend = adp.MockAPI.splice(0, 500);
        adp.MockAPIString = `01234${JSON.stringify(toSend)}`;
        CALLBACK(null, null, adp.MockAPIString);
      }
    };
  });


  it('Testing a successful case.', async (done) => {
    cs.getAllStats(adp.MockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a successful case with 500 mock registers.', async (done) => {
    const randRange = (MIN, MAX) => {
      const min = Math.ceil(MIN);
      const max = Math.floor(MAX);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const mock0 = adp.MockAPI[0];
    const mock1 = adp.MockAPI[1];
    const mock2 = adp.MockAPI[2];
    const generatedObject = [];
    for (let index = 0; index < 500; index += 1) {
      const pickANumber = randRange(0, 2);
      if (pickANumber === 1) {
        generatedObject.push(mock1);
      } else if (pickANumber === 2) {
        generatedObject.push(mock2);
      } else {
        generatedObject.push(mock0);
      }
    }
    adp.MockAPI = generatedObject;
    adp.MockAPIString = `01234${JSON.stringify(adp.MockAPI)}`;
    cs.getAllStats(adp.MockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing a successful case with 1600 mock registers.', async (done) => {
    const randRange = (MIN, MAX) => {
      const min = Math.ceil(MIN);
      const max = Math.floor(MAX);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const mock0 = adp.MockAPI[0];
    const mock1 = adp.MockAPI[1];
    const mock2 = adp.MockAPI[2];
    const generatedObject = [];
    for (let index = 0; index < 1600; index += 1) {
      const pickANumber = randRange(0, 2);
      if (pickANumber === 1) {
        generatedObject.push(mock1);
      } else if (pickANumber === 2) {
        generatedObject.push(mock2);
      } else {
        generatedObject.push(mock0);
      }
    }
    generatedObject[0] = JSON.parse(JSON.stringify(generatedObject[0]));
    generatedObject[0].insertions = 'Invalid: ShouldBeAvoided';
    generatedObject[0].deletions = 'Invalid: ShouldBeAvoided';
    adp.MockAPI = generatedObject;
    adp.MockAPIString = `01234${JSON.stringify(adp.MockAPI)}`;
    cs.getAllStats(adp.MockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing different links for Gerrit which are covered.', async (done) => {
    const newMockList = [];
    newMockList.push({
      _id: 'mock-id-1',
      slug: 'mock-asset-1',
      giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/mock/project-name/',
    });
    newMockList.push({
      _id: 'mock-id-2',
      slug: 'mock-asset-2',
      giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/project-name/',
    });
    newMockList.push({
      _id: 'mock-id-3',
      slug: 'mock-asset-3',
      giturl: 'https://gerrit-gamma.gic.ericsson.se/#/q/project:project-name/',
    });
    newMockList.push({
      _id: 'mock-id-4',
      slug: 'mock-asset-4',
      giturl: 'https://gerrit-gamma.gic.ericsson.se:12345/project-name/',
    });
    newMockList.push({
      _id: 'mock-id-5',
      slug: 'mock-asset-5',
      giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/mock/project-name/+/master_mock_branch/',
    });
    newMockList.push({
      _id: 'mock-id-6',
      slug: 'mock-asset-6',
      giturl: 'https://unknown-link/project-name/+/master_mock_branch/',
    });
    cs.getAllStats(newMockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing behavior if [ cs.saveThis ] fails.', async (done) => {
    cs.saveThisBehavior = false;
    cs.getAllStats(adp.MockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Testing behavior if [ adp.dataBaseGitStatus.find ] fails.', async (done) => {
    adp.dataBaseGitStatusBehavior = false;
    cs.getAllStats(adp.MockList)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
