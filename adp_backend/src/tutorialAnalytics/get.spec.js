// ============================================================================================= //
/**
* Unit test for [ global.adp.tutorialAnalytics.get ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
let errorDbFind;
class MockUserProgress {
  getAllProgress() {
    const dbFindResp = {
      docs: [
        {
          signum: 'test_user_1',
          wid: 'tutorial_id_1',
        },
        {
          signum: 'test_user_2',
          wid: 'tutorial_id_2',
        },
      ],
    };
    return new Promise((resolve, reject) => {
      if (errorDbFind) {
        reject();
        return;
      }
      resolve(dbFindResp);
    });
  }
}


describe('Testing [ global.adp.tutorialAnalytics.get ] behavior.', () => {
  let labelSetCounter = 0;
  errorDbFind = false;

  let menuResp = {
    menu: [
      {
        menu_item_parent: '0',
        user_progress_status: 'read',
        object_id: '1',
        title: 'Menu one',
      },
      {
        menu_item_parent: '1',
        user_progress_status: 'read',
        object_id: '2',
        title: 'Menu two',
      },
      {
        menu_item_parent: '2',
        user_progress_status: 'read',
        object_id: '3',
        title: 'Menu three',
      },
    ],
  };

  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Userprogress = MockUserProgress;
    global.adp.metrics = {};
    global.adp.metrics.register = {};
    global.adp.metrics.register.TutorialRegistryClass = {};
    global.adp.metrics.register.TutorialRegistryClass.addTutorialMetricLabelByName = () => {
      labelSetCounter += 1;
    };
    global.customRegisters = {};
    global.customRegisters.tutorialRegistry = {};
    global.customRegisters.tutorialRegistry.resetMetrics = () => true;
    global.adp.masterCache = {};
    global.adp.masterCache.set = () => true;
    global.adp.masterCache.clear = () => true;
    global.adp.echoLog = () => true;
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.userProgressTutorials = 0;
    global.adp.tutorialsMenu = {};
    global.adp.tutorialsMenu.get = {};
    global.adp.tutorialsMenu.get.getTutorialsMenu = () => new Promise((RES) => {
      RES(menuResp);
    });
    global.adp.tutorialAnalytics = {};
    global.adp.tutorialAnalytics.get = require('./get');
    labelSetCounter = 0;
    errorDbFind = false;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('set the tutorial analytics data succesfully for 3 tutorials', (done) => {
    global.adp.tutorialAnalytics.get().then(() => {
      expect(labelSetCounter).toEqual(1);
      done();
    }).catch(error => done.fail(error));
  });

  it('reject if could not find userprogress', (done) => {
    errorDbFind = true;
    global.adp.tutorialAnalytics.get().then(() => {
      expect(true).toBeFalsy();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it('processMenu: remove the parent items those are without children', (done) => {
    menuResp = {
      menu: [
        {
          menu_item_parent: '0',
          user_progress_status: 'read',
          object_id: '1',
          title: 'Menu one',
        },
        {
          menu_item_parent: '0',
          user_progress_status: 'read',
          object_id: '2',
          title: 'Menu two',
        },
        {
          menu_item_parent: '1',
          user_progress_status: 'read',
          object_id: '3',
          title: 'Menu three',
        },
      ],
    };
    global.adp.tutorialAnalytics.get().then(() => {
      expect(labelSetCounter).toEqual(1);
      done();
    }).catch(done.fail);
  });

  it('processMenu: remove the parent items those are without children - case 2', (done) => {
    menuResp = {
      menu: [
        {
          menu_item_parent: '0',
          user_progress_status: 'read',
          object_id: '1',
          title: 'Menu one',
        },
        {
          menu_item_parent: '1',
          user_progress_status: 'read',
          object_id: '2',
          title: 'Menu two',
        },
        {
          menu_item_parent: '0',
          user_progress_status: 'read',
          object_id: '3',
          title: 'Menu three',
        },
      ],
    };
    global.adp.tutorialAnalytics.get().then(() => {
      expect(labelSetCounter).toEqual(1);
      done();
    }).catch(done.fail);
  });
});
// ============================================================================================= //
