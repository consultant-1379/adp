// ============================================================================================= //
/**
* Unit test for [ cs.cleanWrongCommits ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockExternalContributionClass {
  checkIt(ID, SIGNUM) {
    if (cs.isExternalCheckItCrash === false) {
      return new Promise((RESOLVE) => {
        if (SIGNUM === 'signum2' && adp.db.removeNumber2Behavior === true) {
          RESOLVE(false);
        } else {
          RESOLVE(true);
        }
      });
    }
    return new Promise((RESOLVE, REJECT) => { REJECT(); });
  }
}
// ============================================================================================= //
class MockGitStatusClass {
  deleteOne() {
    return new Promise((resolve, reject) => {
      if (cs.deleteOneCrash === false) {
        cs.advanceStep += 1;
        resolve();
        return;
      }
      const msg = 'MockError';
      reject(msg);
    });
  }

  getCommitsSequentially(QUANT, SKIP) {
    if (cs.getCommitsSequentiallyCrash === false) {
      return new Promise((RESOLVE, REJECT) => {
        if (adp.db.commitsBehavior === false) {
          const mockErrorText = 'Mock Error';
          REJECT(mockErrorText);
        } else {
          let obj = [];
          const index = (SKIP + cs.advanceStep);
          if (cs.templateArray.length > index) {
            obj = [cs.templateArray[index]];
          }
          RESOLVE({ docs: obj });
        }
      });
    }
    return new Promise((RESOLVE, REJECT) => { REJECT(); });
  }
}

class MockBaseOperations {
  constructor() {
    this.signumLookup = {};
  }

  searchPeopleBySignum(signum) {
    return new Promise((res, rej) => {
      if (adp.peoplefinder.mockResp.res) {
        this.signumLookup[signum] = (this.signumLookup[signum] ? this.signumLookup[signum] + 1 : 1);
        adp.peoplefinder.mockResp.signumLookup = this.signumLookup;
        res([{ signum }]);
      } else {
        rej(adp.peoplefinder.mockResp.data);
      }
    });
  }
}

class MockUpdateUserData {
  update() {
    return new Promise((res, rej) => {
      if (cs.UpdateUserDataResp.res) {
        res();
      } else {
        rej();
      }
    });
  }
}
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.cleanWrongCommits ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.advanceStep = 0;
    cs.templateArray = [
      {
        _id: '[id1]',
        asset_id: 'asset1',
        user_id: 'signum1',
        date: '2021-01-01',
      },
      {
        _id: '[id2]',
        asset_id: 'asset2',
        user_id: 'signum2',
        date: '2021-01-02',
      },
      {
        _id: '[id3]',
        asset_id: 'asset3',
        user_id: 'signum3',
        date: '2021-01-03',
      },
      {
        _id: '[id3]',
        asset_id: 'asset3',
        user_id: 'signum3',
        date: '2021-01-04',
      },
    ];
    adp.models = {};
    adp.models.Gitstatus = MockGitStatusClass;
    adp.teamHistory = {};
    adp.teamHistory.IsExternalContribution = new MockExternalContributionClass();

    adp.peoplefinder = {};
    adp.peoplefinder.BaseOperations = MockBaseOperations;
    adp.peoplefinder.mockResp = {
      data: [],
      res: true,
      signumLookup: {},
    };

    cs.gitLog = () => new Promise((RESOLVE, REJECT) => {
      if (cs.gitLogShouldCrash === true) {
        REJECT();
      } else {
        RESOLVE(true);
      }
    });
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    adp.docs = {};
    adp.docs.list = [];
    adp.fullClearLog = [];
    adp.echoLog = () => {};
    adp.dateLogSystemFormat = require('./../../src/library/dateLogSystemFormat');
    cs.cleanWrongCommits = require('./cleanWrongCommits');
    adp.db = {};
    adp.db.removeNumber2Behavior = true;
    adp.db.commitsBehavior = true;
    adp.db.findBehavior = true;
    adp.db.destroyBehavior = true;
    cs.gitLogShouldCrash = false;
    cs.deleteOneCrash = false;
    cs.isExternalCheckItCrash = false;
    cs.getCommitsSequentiallyCrash = false;

    cs.UpdateUserData = MockUpdateUserData;
    cs.UpdateUserDataResp = { res: true };
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a simple successful case, removing one register.', async (done) => {
    cs.cleanWrongCommits()
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });

  it('Should not run a signum twice through the innersource user history update.', async (done) => {
    cs.cleanWrongCommits()
      .then(() => {
        expect(adp.peoplefinder.mockResp.signumLookup.signum3).toBe(1);
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('Testing a simple successful case, not removing registers.', async (done) => {
    adp.db.removeNumber2Behavior = false;
    cs.cleanWrongCommits()
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('If [ cs.gitLog ] crashes.', (done) => {
    cs.gitLogShouldCrash = true;
    cs.cleanWrongCommits()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If [ dbModelGitstatus.deleteOne ] crashes.', (done) => {
    cs.deleteOneCrash = true;
    cs.cleanWrongCommits()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If [ IsExternal.checkIt ] crashes.', (done) => {
    cs.isExternalCheckItCrash = true;
    cs.cleanWrongCommits()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('If [ dbModelGitstatus.getCommitsSequentially ] crashes.', (done) => {
    cs.getCommitsSequentiallyCrash = true;
    cs.cleanWrongCommits()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Should not fail the process if the peoplefinder controller and UpdateUserData rejects .', async (done) => {
    cs.UpdateUserDataResp.res = false;
    adp.peoplefinder.mockResp.res = false;

    cs.cleanWrongCommits()
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });
});
// ============================================================================================= //
