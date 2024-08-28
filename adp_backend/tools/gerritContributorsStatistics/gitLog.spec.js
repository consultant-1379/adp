// ============================================================================================= //
/**
* Unit test for [ cs.gitLog ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockGitStatusLogClass {
  createOne() {
    return new Promise((resolve, reject) => {
      if (cs.createOneCrash === false) {
        resolve();
        return;
      }
      const msg = 'MockError';
      reject(msg);
    });
  }
}
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.gitLog ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.models = {};
    adp.models.GitStatusLog = MockGitStatusLogClass;
    adp.teamHistory = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.fullClearLog = [];
    adp.echoLog = () => {};
    cs.gitLog = require('./gitLog');
    adp.db = {};
    adp.db.removeNumber2Behavior = true;
    adp.db.commitsBehavior = true;
    adp.db.findBehavior = true;
    adp.db.destroyBehavior = true;
    cs.createOneCrash = false;
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a simple successful case ( Success ).', async (done) => {
    cs.gitLog('message', { object: true }, 200, 'packName')
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('Testing a simple successful case ( Mock Error ).', async (done) => {
    cs.gitLog('message', { object: true }, 500, 'packName')
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('If [ gitStatusModel.createOne ] crashes.', async (done) => {
    cs.createOneCrash = true;
    cs.gitLog('message', { object: true }, 200, 'packName')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
