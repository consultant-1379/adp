// ============================================================================================= //
/**
* Unit test for [ cs.saveThis ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
class MockGitStatus {
  getById() {
    return new Promise((RES, REJ) => {
      const obj = adp.dataBaseGitStatus.findObject[`s${adp.dataBaseGitStatus.findIndex}`];
      if (obj !== null && obj !== undefined) {
        RES(obj);
      } else {
        const msg = 'MockError';
        REJ(msg);
      }
    });
  }

  createOne() {
    return new Promise((RES, REJ) => {
      if (adp.dataBaseGitStatus.insertBehavior === true) {
        const obj = { ok: true };
        RES(obj);
      } else {
        const msg = 'Mock Error';
        REJ(msg);
      }
    });
  }

  update() {
    return new Promise((RES, REJ) => {
      if (adp.dataBaseGitStatus.insertBehavior === true) {
        const obj = { ok: true };
        RES(obj);
      } else {
        const msg = 'Mock Error';
        REJ(msg);
      }
    });
  }
}

class MockUpdateUserData {
  update() {
    return new Promise((res, rej) => {
      if (cs.UpdateUserDataResp.res) {
        res(cs.UpdateUserDataResp.resp);
      } else {
        rej(cs.UpdateUserDataResp.resp);
      }
    });
  }
}

describe('[ gerritContributorsStatistics ] testing [ cs.saveThis ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Gitstatus = MockGitStatus;
    adp.config = {};
    adp.config.contributorsStatistics = {};
    adp.config.contributorsStatistics.gerritApiRevisionDetail = 'https://mock/a/changes/|||:COMMITID:|||/revisions/|||:COMMITREVISION:|||/commit/';
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.docs = {};
    adp.docs.list = [];
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.request = {};
    global.request.get = (PARAM, CALLBACK) => {
      const toSendObject = { message: 'something @innersource' };
      const toSend = `01234${JSON.stringify(toSendObject)}`;
      CALLBACK(null, null, toSend);
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.teamHistory = {};
    adp.teamHistory.MockIsExternalContributionClassResult = true;
    class MockIsExternalContributionClass {
      checkIt() {
        return new Promise((RESOLVE, REJECT) => {
          const verification = adp.teamHistory.MockIsExternalContributionClassResult;
          if (verification === true || verification === false) {
            RESOLVE(adp.teamHistory.MockIsExternalContributionClassResult);
          } else {
            const errorText = 'Mock Error Test';
            REJECT(errorText);
          }
        });
      }
    }
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.peoplefinder = {};
    adp.peoplefinder.BaseOperationsInstance = {};
    adp.peoplefinder.BaseOperationsInstanceResult = ['user'];
    adp.mockbehaviour = {};
    adp.mockbehaviour.searchpeopleBySignum = true;
    adp.peoplefinder.BaseOperationsInstance.searchPeopleBySignum = () => new Promise((RES, REJ) => {
      if (adp.mockbehaviour.searchpeopleBySignum === true) {
        if (Array.isArray(adp.peoplefinder.BaseOperationsInstanceResult)) {
          RES(adp.peoplefinder.BaseOperationsInstanceResult);
        } else {
          const mockError = 'mockError';
          REJ(mockError);
        }
      } else {
        const err = { code: 404 };
        REJ(err);
      }
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.teamHistory.IsExternalContribution = new MockIsExternalContributionClass();

    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    cs.SaveThis = require('./SaveThis');

    cs.UpdateUserData = MockUpdateUserData;
    cs.UpdateUserDataResp = {
      resp: true,
      res: true,
    };

    cs.logDetails = () => {};
    adp.fullLog = [];
    adp.fullLogDetails = {};
    cs.finalTimerLine = () => {};
    adp.echoLog = () => {};
    adp.MockList = require('./saveThisList.spec.json');
    adp.dataBaseGitStatus = {};
    adp.dataBaseGitStatus.findIndex = 0;
    adp.dataBaseGitStatus.findObject = require('./saveThisFind.spec.json');
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    cs.executionTimer = SOMETHING => SOMETHING;
    adp.dataBaseGitStatus.insertBehavior = true;

    adp.check = {};
    adp.db = {};
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ go() ] Testing a simple successful case.', async (done) => {
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.go()
      .then(() => done())
      .catch(() => done.fail());
  });

  it('Negative Test case for search people by Signum method', async (done) => {
    adp.mockbehaviour.searchpeopleBySignum = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningID = 'mockAsset';
    saveThisInstance.runningUserID = 'mockUser';
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.runningDaysArray = ['mockDate'];
    saveThisInstance.isValidInnerSourceUser()
      .then((ERROR) => {
        expect(ERROR).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ go() ] Testing a simple successful case, when [ isExternal.checkIt ] returns false.', async (done) => {
    adp.teamHistory.MockIsExternalContributionClassResult = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.go()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // it('[ go() ] Testing a simple successful case,
  // when [ isExternal.checkIt ] crashes.', async (done) => {
  //   adp.teamHistory.MockIsExternalContributionClassResult = 'crash';
  //   const saveThisInstance = new cs.SaveThis(adp.MockList);
  //   saveThisInstance.go()
  //     .then(() => {
  //       done.fail();
  //     })
  //     .catch(() => {
  //       done();
  //     });
  // });


  it('[ go() ] Testing a more complex successful case.', async (done) => {
    adp.dataBaseGitStatus.findIndex = 1;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.go()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ go() ] Testing behavior if send more than one microservice at time.', async (done) => {
    const list = {
      'asset-1': {},
      'asset-2': {},
    };
    const saveThisInstance = new cs.SaveThis(list);
    saveThisInstance.go()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ go() ] Testing error if variable is not a number.', async (done) => {
    adp.MockList['mock-microservice-id'].esupuse.day['2020-10-04'].commits = 'Invalid: ShouldBeAvoided';
    adp.MockList['mock-microservice-id'].esupuse.day['2020-10-04'].insertions = 'Invalid: ShouldBeAvoided';
    adp.MockList['mock-microservice-id'].esupuse.day['2020-10-04'].deletions = 'Invalid: ShouldBeAvoided';
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.go()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[ go() ] Should not fail if UpdateUserData rejects.', async (done) => {
    cs.UpdateUserDataResp.res = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.go()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ logThis() ] Testing specific possibilities.', async (done) => {
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.id = 'mock1';
    saveThisInstance.logThis('Message 1');
    saveThisInstance.logThis('Message 2');

    expect(cs.canAddToLogBecauseItIsUnique.length).toEqual(1);
    expect(cs.canAddToLogBecauseItIsUnique[0]).toEqual('mock1');
    done();
  });


  it('[ saveItNowUserLevel() ] Testing multiple situations.', async (done) => {
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.indexUserLevel = 0;
    saveThisInstance.users = ['mockUser1', undefined];
    saveThisInstance.exitPromiseResolve = () => {};
    saveThisInstance.saveItNowUserLevel();
    saveThisInstance.users = ['mockUser1', null];
    saveThisInstance.saveItNowUserLevel();
    done();
  });


  it('[ saveItInstanceLevel() ] Testing multiple situations.', async (done) => {
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    adp.teamHistory.MockIsExternalContributionClassResult = false;
    adp.peoplefinder.BaseOperationsInstanceResult = [];
    saveThisInstance.saveItInstanceLevel()
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });


  it('[ isValidInnerSourceUser() ] if [ peopleFinderOps.searchPeopleBySignum ] crashes.', async () => {
    adp.peoplefinder.BaseOperationsInstanceResult = 'crash';
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningID = 'mockAsset';
    saveThisInstance.runningUserID = 'mockUser';
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.runningDaysArray = ['mockDate'];
    saveThisInstance.isValidInnerSourceUser()
      .then((reason) => {
        fail(reason);
      })
      .catch(() => {
      });
  });


  it('[ isValidInnerSourceUser() ] if [ peopleFinderOps.searchPeopleBySignum ] returns functional user ( twice ).', async (done) => {
    adp.peoplefinder.BaseOperationsInstanceResult = [];
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningID = 'mockAsset';
    saveThisInstance.runningUserID = 'mockUser';
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.runningDaysArray = ['mockDate'];
    saveThisInstance.isValidInnerSourceUser()
      .then(() => {
        saveThisInstance.isValidInnerSourceUser()
          .then(() => {
            done();
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ checkIfAlreadyExists() ] if [ adp.dataBaseGitStatus.find ] crashes.', async (done) => {
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningStats = {};
    saveThisInstance.runningStats.checked = 0;
    saveThisInstance.runningStats.checktimer = 0;
    saveThisInstance.runningDaysArray = [];
    saveThisInstance.indexDaysLevel = 999999;
    adp.dataBaseGitStatus.findIndex = 999999;
    saveThisInstance.checkIfAlreadyExists()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ saveThisDay() ] and [ go() ] if [ adp.dataBaseGitStatus.insert ] crashes.', async (done) => {
    adp.dataBaseGitStatus.insertBehavior = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningUserDays = ['mock'];
    saveThisInstance.runningDaysArray = [0];
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.saveThisDay()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        saveThisInstance.go()
          .then(() => {
            done.fail();
          })
          .catch(() => {
            done();
          });
      });
  });


  it('[ updateThisDay() ] if [ adp.dataBaseGitStatus.insert ] crashes.', async (done) => {
    const obj1 = {
      id: 'mock',
      commits: 1,
      insertions: 2,
      deletions: 3,
    };
    const obj2 = {
      id: 'mock2',
      commits: 1,
      insertions: 4,
      deletions: 5,
    };
    adp.dataBaseGitStatus.insertBehavior = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningUserDays = [{ 'commit-id-list': [obj1] }];
    saveThisInstance.runningDaysArray = [0];
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.updateThisDay({ 'commit-id-list': [obj2] })
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ updateThisDay() ] if there is no changes.', async (done) => {
    const obj1 = {
      id: 'mock',
      commits: 1,
      insertions: 2,
      deletions: 3,
    };
    adp.dataBaseGitStatus.insertBehavior = false;
    const saveThisInstance = new cs.SaveThis(adp.MockList);
    saveThisInstance.runningUserDays = [{ 'commit-id-list': [obj1] }];
    saveThisInstance.runningDaysArray = [0];
    saveThisInstance.indexDaysLevel = 0;
    saveThisInstance.updateThisDay({ 'commit-id-list': [obj1] })
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
