// ============================================================================================= //
/**
* Unit test for [ global.adp.tutorialsMenu.get ]
* @author Armando Dias [escharm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockUserProgress {
  getAllProgressFromThisUser() {
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
}

describe('Testing [ global.adp.tutorialsMenu.get ] behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.Userprogress = MockUserProgress;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.masterCache = {};
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.config = {};
    global.adp.config.wordpress = {};
    global.adp.config.wordpress.tutorials = {};
    global.adp.config.wordpress.tutorials.link = 'http://mockLinkForUnitTests/mockMenu';
    global.adp.config.wordpress.tutorials.requestTimeOutInSeconds = 3;
    global.adp.config.wordpress.tutorials.cacheTimeOutInSeconds = 60;
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.userProgressTutorials = 60;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.mockDatabase = require('./get-mockDatabase.spec.json');
    global.mockDatabaseFindScenario = 'success';
    global.mockDatabaseFindScenarioStep = 1;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.db = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.masterCache.behavior = 'empty';
    global.adp.masterCache.get = ID => new Promise((RESOLVE, REJECT) => {
      if (global.adp.masterCache.behavior === 'cached' && ID === 'WORDPRESS') {
        const menuFromMockWordpress = require('./get-tutorialsLocalMockLink.spec.json').response;
        const result = {
          chapter_completed: null,
          chapter_total: null,
          chapter_percentage: null,
          lesson_completed: null,
          lesson_total: null,
          lesson_percentage: null,
          menu: menuFromMockWordpress.menus[0].items,
        };
        RESOLVE(result);
      } else if (global.adp.masterCache.behavior === 'cached' && ID === 'TUTORIALSPROGRESS') {
        const result = global.mockDatabase.find_success_1;
        RESOLVE(result);
      } else {
        REJECT();
      }
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.masterCache.set = () => {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.requestBehavior = 'success';
    global.request = (SETUPOBJ, CALLBACK) => {
      if (global.requestBehavior === 'success') {
        const menuFromMockWordpress = require('./get-tutorialsLocalMockLink.spec.json').response;
        const menuFromMockWordpressAsString = JSON.stringify(menuFromMockWordpress);
        CALLBACK(undefined, { body: menuFromMockWordpressAsString });
      } else if (global.requestBehavior === 'invalidAnswer') {
        CALLBACK(undefined, { body: '}ERROR{' });
      } else {
        CALLBACK('MockErrorOnRequest', undefined);
      }
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.tutorialsMenu = {};

    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.tutorialsMenu.get = proxyquire('./get', {
      '../library/errorLog': mockErrorLog,
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    adp.wordpress = {};
    adp.wordpress.getMenusBehavior = 0;
    adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
      if (adp.wordpress.getMenusBehavior === 0) {
        RES(require('./get-tutorialsLocalMockLink.spec.json'));
        return;
      }
      if (adp.wordpress.getMenusBehavior === 1) {
        RES([]);
      }
      const mockError = { code: 500, message: 'mockError' };
      REJ(mockError);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Successful case with three lessons and one chapter complete.', (done) => {
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.chapter_completed).toBe(1);
        expect(EXPECTEDRESPONSE.chapter_total).toBe(14);
        expect(EXPECTEDRESPONSE.chapter_percentage).toBe('7.14');
        expect(EXPECTEDRESPONSE.lesson_completed).toBe(3);
        expect(EXPECTEDRESPONSE.lesson_total).toBe(56);
        expect(EXPECTEDRESPONSE.lesson_percentage).toBe('5.36');
        EXPECTEDRESPONSE.menu.forEach((MENUITEM) => {
          switch (MENUITEM.ID) {
            case 4827:

              expect(MENUITEM.user_progress_status).toBe('not-read');
              expect(MENUITEM.object_id).toBe('4799');

              break;
            case 4835:

              expect(MENUITEM.user_progress_status).toBe('read');
              expect(MENUITEM.object_id).toBe('4785');

              break;
            case 4834:

              expect(MENUITEM.user_progress_status).toBe('read');
              expect(MENUITEM.object_id).toBe('4787');

              break;
            case 4833:

              expect(MENUITEM.user_progress_status).toBe('read');
              expect(MENUITEM.object_id).toBe('4789');

              break;
            case 4832:

              expect(MENUITEM.user_progress_status).toBe('read');
              expect(MENUITEM.object_id).toBe('4791');

              break;
            default:

              expect(MENUITEM.user_progress_status).toBe('not-read');

              break;
          }
        });
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Successful case with three lessons and one chapter complete. (ALTERNATIVE)', (done) => {
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser', { mockUser: { admin: true } }, true)
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Testing the [ userProgressConversion ] function. (ALTERNATIVE)', async (done) => {
    const obj = require('./get-objForUserProgressConversion.spec.json');
    const result = require('./get-progressForUserProgressConversion.spec.json');
    delete obj.progress;
    await adp.tutorialsMenu.get.userProgressConversion(obj);
    const { progress } = obj;

    expect(progress).toEqual(result);
    done();
  });


  it('Successful case with one lesson and one chapter marked as "read-again".', (done) => {
    global.mockDatabaseFindScenario = 'readagain';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.chapter_completed).toBe(0);
        expect(EXPECTEDRESPONSE.chapter_total).toBe(14);
        expect(EXPECTEDRESPONSE.chapter_percentage).toBe('0.00');
        expect(EXPECTEDRESPONSE.lesson_completed).toBe(0);
        expect(EXPECTEDRESPONSE.lesson_total).toBe(56);
        expect(EXPECTEDRESPONSE.lesson_percentage).toBe('0.00');
        EXPECTEDRESPONSE.menu.forEach((MENUITEM) => {
          switch (MENUITEM.ID) {
            case 7951:

              expect(MENUITEM.user_progress_status).toBe('read-again');
              expect(MENUITEM.object_id).toBe('7867');

              break;
            case 7952:

              expect(MENUITEM.user_progress_status).toBe('read-again');
              expect(MENUITEM.object_id).toBe('7872');

              break;
            default:

              expect(MENUITEM.user_progress_status).toBe('not-read');

              break;
          }
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful case with no lessons complete.', (done) => {
    global.mockDatabaseFindScenario = 'empty';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.chapter_completed).toBe(0);
        expect(EXPECTEDRESPONSE.chapter_total).toBe(14);
        expect(EXPECTEDRESPONSE.chapter_percentage).toBe('0.00');
        expect(EXPECTEDRESPONSE.lesson_completed).toBe(0);
        expect(EXPECTEDRESPONSE.lesson_total).toBe(56);
        expect(EXPECTEDRESPONSE.lesson_percentage).toBe('0.00');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful case with cached values.', (done) => {
    global.adp.masterCache.behavior = 'cached';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.chapter_completed).toBe(1);
        expect(EXPECTEDRESPONSE.chapter_total).toBe(14);
        expect(EXPECTEDRESPONSE.chapter_percentage).toBe('7.14');
        expect(EXPECTEDRESPONSE.lesson_completed).toBe(3);
        expect(EXPECTEDRESPONSE.lesson_total).toBe(56);
        expect(EXPECTEDRESPONSE.lesson_percentage).toBe('5.36');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Negative case if [global.adp.db.find] returns an invalid answer.', (done) => {
    global.mockDatabaseFindScenario = 'invalid';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case if [global.adp.db.find] crashes.', (done) => {
    global.mockDatabaseFindScenario = 'crash';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case if [global.request] crashes.', (done) => {
    global.requestBehavior = 'crash';
    global.mockDatabaseFindScenario = 'empty';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Negative case if [global.request] returns an invalid response.', (done) => {
    global.requestBehavior = 'invalidAnswer';
    global.mockDatabaseFindScenario = 'empty';
    global.adp.tutorialsMenu.get.getTutorialsMenu('mockUser')
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
