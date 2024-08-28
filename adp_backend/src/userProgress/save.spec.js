// ============================================================================================= //
/**
* Unit test for [ global.adp.userProgress.save ]
* @author Armando Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
class MockUserProgress {
  getTheProgressFromThisUserAndThisPage() {
    return new Promise((resolve, reject) => {
      if (global.mockDatabaseFindScenario === 'crash') {
        const mockError = 'mockFindError';
        reject(mockError);
      } else {
        const mockValueName = `find_${global.mockDatabaseFindScenario}_${global.mockDatabaseFindScenarioStep}`;
        const value = global.mockDatabase[mockValueName];
        global.mockDatabaseFindScenarioStep += 1;
        resolve(value);
      }
    });
  }

  createOne() {
    return new Promise((resolve, reject) => {
      if (global.mockDatabaseCreateScenario === 'crash') {
        const mockError = 'mockCreateError';
        reject(mockError);
      } else {
        const mockValueName = `create_${global.mockDatabaseCreateScenario}_${global.mockDatabaseCreateScenarioStep}`;
        const value = global.mockDatabase[mockValueName];
        global.mockDatabaseCreateScenarioStep += 1;
        resolve(value);
      }
    });
  }

  updateOne() {
    return new Promise((resolve, reject) => {
      if (global.mockDatabaseUpdateScenario === 'crash') {
        const mockError = 'mockUpdateError';
        reject(mockError);
      } else {
        const mockValueName = `update_${global.mockDatabaseUpdateScenario}_${global.mockDatabaseUpdateScenarioStep}`;
        const value = global.mockDatabase[mockValueName];
        global.mockDatabaseUpdateScenarioStep += 1;
        resolve(value);
      }
    });
  }
}

describe('Testing [ global.adp.userProgress.save ] behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.Userprogress = MockUserProgress;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};

    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.mockDatabase = require('./save-mockDatabase.spec.json');

    global.mockDatabaseFindScenario = 'success';
    global.mockDatabaseFindScenarioStep = 1;

    global.mockDatabaseCreateScenario = 'success';
    global.mockDatabaseCreateScenarioStep = 1;

    global.mockDatabaseUpdateScenario = 'success';
    global.mockDatabaseUpdateScenarioStep = 1;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.tutorialsMenu = {};
    global.adp.tutorialsMenu.menuEssentials = require('./save-mockEssentials.spec.json').mockEssentials;
    global.adp.tutorialsMenu.menuEssentialsAlternative = require('./save-mockEssentials.spec.json').mockEssentials;
    global.adp.tutorialsMenu.behavior = 'success';
    global.adp.tutorialsMenu.step = 1;
    global.adp.tutorialsMenu.get = {};
    global.adp.tutorialsMenu.get.getTutorialsMenu = () => new Promise((RESOLVE, REJECT) => {
      let mockError = null;
      let mockReturn = null;
      const { behavior } = global.adp.tutorialsMenu;
      const { step } = global.adp.tutorialsMenu;
      if (behavior === 'success' || (behavior === 'secondcrash' && step === 1)) {
        global.adp.tutorialsMenu.menuEssentials = require('./save-mockEssentials.spec.json').mockEssentials;
        mockReturn = {
          chapter_completed: 1,
          chapter_total: 10,
          chapter_percentage: '10.00',
          lesson_completed: 10,
          lesson_total: 100,
          lesson_percentage: '10.00',
          menu: {},
        };
        RESOLVE(mockReturn);
      }
      if ((behavior === 'crash' && step === 1) || (behavior === 'secondcrash' && step === 2)) {
        mockError = 'MockError: global.adp.tutorialsMenu.get crashed!';
        REJECT(mockError);
      }
      global.adp.tutorialsMenu.step += 1;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.userProgress = {};
    global.adp.userProgress.cleaner = () => {
      const mockObj = {
        ID: 8755,
        user_progress_status: 'not-read',
      };
      return mockObj;
    };
    global.adp.userProgress.save = require('./save');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Successful case inserting a new user progress into Database.', (done) => {
    global.adp.userProgress.save('mockUser', '8722')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.wid).toBe('8722');
        expect(EXPECTEDRESPONSE.date_progress).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Successful case inserting a new user progress into Database (ALTERNATIVE).', (done) => {
    global.adp.userProgress.save('mockUser', '8722', [], true)
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.wid).toBe('8722');
        expect(EXPECTEDRESPONSE.date_progress).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Error case menuEssentialsAlternative is invalid (ALTERNATIVE).', (done) => {
    global.adp.tutorialsMenu.menuEssentialsAlternative = null;
    global.adp.userProgress.save('mockUser', '8722', [], true)
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(404);
        done();
      });
  });


  it('Successful case updating an user progress into Database.', (done) => {
    global.mockDatabaseFindScenario = 'successwithreturn';
    global.mockDatabaseUpdateScenario = 'successwithreturn';
    global.adp.userProgress.save('mockUser', '8722')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.wid).toBe('8722');
        expect(EXPECTEDRESPONSE.date_progress).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Successful case even if [global.adp.tutorialsMenu.menuEssentials] is empty.', (done) => {
    global.adp.tutorialsMenu.menuEssentials = null;
    global.adp.userProgress.save('mockUser', '8722')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.wid).toBe('8722');
        expect(EXPECTEDRESPONSE.date_progress).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Negative case when [global.adp.tutorialsMenu.menuEssentials] is empty and the first [global.adp.tutorialsMenu.get] crashes.', (done) => {
    global.adp.tutorialsMenu.menuEssentials = null;
    global.adp.tutorialsMenu.behavior = 'crash';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when [global.adp.tutorialsMenu.menuEssentials] is empty and the second [global.adp.tutorialsMenu.get] crashes.', (done) => {
    global.adp.tutorialsMenu.menuEssentials = null;
    global.adp.tutorialsMenu.behavior = 'secondcrash';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when the [global.adp.db.find] crashes.', (done) => {
    global.mockDatabaseFindScenario = 'crash';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when the [global.adp.db.update] crashes.', (done) => {
    global.mockDatabaseFindScenario = 'successwithreturn';
    global.mockDatabaseUpdateScenario = 'crash';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when the [global.adp.db.create] crashes.', (done) => {
    global.mockDatabaseCreateScenario = 'crash';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when the [global.adp.db.update] returns an invalid answer.', (done) => {
    global.mockDatabaseFindScenario = 'successwithreturn';
    global.mockDatabaseUpdateScenario = 'notok';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case when the [global.adp.db.create] returns an invalid answer.', (done) => {
    global.mockDatabaseCreateScenario = 'notok';
    global.adp.userProgress.save('mockUser', '8722')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
