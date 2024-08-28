// ============================================================================================= //
/**
* Unit test for [ global.adp.userProgress.delete ]
* @author Armando Dias [escharm]
*/
// ============================================================================================= //
class MockUserProgress {
  getByQuery(selector) {
    return new Promise((resolve, reject) => {
      let error;
      let mockTarget;
      let mockResult;
      switch (global.mockBehavior) {
        case 'crash':
          error = 'mockCrashError';
          reject(error);
          break;
        default:
          mockTarget = `${selector.type.$eq}_${global.mockBehavior}_find`;
          mockResult = global.mockAnswers[mockTarget];
          if (mockResult.crash === true) {
            reject(mockResult);
          } else {
            resolve(mockResult);
          }
          break;
      }
    });
  }

  getBySignumAndWordpressID(SIGNUM, WID) {
    const selector = {
      signum: { $eq: SIGNUM },
      wid: { $eq: WID },
      type: { $eq: 'progress' },
    };
    return new Promise((resolve, reject) => {
      let error;
      let mockTarget;
      let mockResult;
      switch (global.mockBehavior) {
        case 'crash':
          error = 'mockCrashError';
          reject(error);
          break;
        default:
          mockTarget = `${selector.type.$eq}_${global.mockBehavior}_find`;
          mockResult = global.mockAnswers[mockTarget];
          if (mockResult.crash === true) {
            reject(mockResult);
          } else {
            resolve(mockResult);
          }
          break;
      }
    });
  }

  deleteOne() {
    return new Promise((resolve, reject) => {
      let error;
      let mockTarget;
      let mockResult;
      switch (global.mockBehavior) {
        case 'crash':
          error = 'mockCrashError';
          reject(error);
          break;
        default:
          mockTarget = `progress_${global.mockBehavior}_destroy`;
          mockResult = global.mockAnswers[mockTarget];
          if (mockResult.crash === true) {
            reject(mockResult);
          } else {
            resolve(mockResult);
          }
          break;
      }
    });
  }
}

describe('Testing [ global.adp.userProgress.delete ] behavior.', () => {
  beforeEach(() => {
    global.Jsonschema = require('jsonschema').Validator; // eslint-disable-line global-require

    global.adp = {};
    adp.models = {};
    adp.models.Userprogress = MockUserProgress;
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;

    global.adp.tutorialsMenu = {};
    global.adp.tutorialsMenu.break = false;
    global.adp.tutorialsMenu.get = {};
    global.adp.tutorialsMenu.get.getTutorialsMenu = () => new Promise((RESOLVE, REJECT) => {
      if (global.adp.tutorialsMenu.break === true) {
        const mockError = 'mockError';
        REJECT(mockError);
      } else {
        const mockReturn = {
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
    });

    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};

    global.mockAnswers = require('./delete.spec.json'); // eslint-disable-line global-require
    global.mockBehavior = 'success';


    global.adp.userProgress = {};
    global.adp.userProgress.cleaner = () => {
      const mockObj = {
        ID: 8755,
        user_progress_status: 'not-read',
      };
      return mockObj;
    };
    global.adp.userProgress.delete = require('./delete'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });

  it('Should resolve successful this request.', (done) => {
    global.adp.userProgress.delete.deleteRecord('mockUser', '3129A')
      .then((RESULT) => {
        expect(RESULT.signum).toBe('mockUser');
        expect(RESULT.wid).toBe('3129A');
        expect(RESULT.chapter_completed).toBeDefined();
        expect(RESULT.chapter_total).toBeDefined();
        expect(RESULT.chapter_percentage).toBeDefined();
        expect(RESULT.lesson_completed).toBeDefined();
        expect(RESULT.lesson_total).toBeDefined();
        expect(RESULT.lesson_percentage).toBeDefined();
        expect(RESULT.chapter_object).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Should reject if [global.adp.tutorialsMenu.get] crashes.', (done) => {
    global.adp.tutorialsMenu.break = true;
    global.adp.userProgress.delete.deleteRecord('mockUser', '3129A')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Should reject if [global.adp.db.destroy] fails.', (done) => {
    global.mockBehavior = 'destroyfail';
    global.adp.userProgress.delete.deleteRecord('mockUser', '3129A')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.msg).toBeDefined();
        expect(ERROR.data).toBeDefined();
        done();
      });
  });


  it('Should reject if [global.adp.db.destroy] crash.', (done) => {
    global.mockBehavior = 'destroycrash';
    global.adp.userProgress.delete.deleteRecord('mockUser', '3129A')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Should reject if [global.adp.db.find] fails (404 Not Found).', (done) => {
    global.mockBehavior = 'findfail';
    global.adp.userProgress.delete.deleteRecord('mockUser', '3129A')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(404);
        done();
      });
  });


  it('Should reject if [global.adp.db.find] crash.', (done) => {
    const obj = {
      wid: '3129A',
      url: 'https://adp.ericsson.se/tutorials/test1',
      date_content: '2020-05-27T11:00:11.672Z',
    };
    global.mockBehavior = 'findcrash';
    global.adp.userProgress.delete.deleteRecord('mockUser', obj)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        done();
      });
  });
});
// ============================================================================================= //
