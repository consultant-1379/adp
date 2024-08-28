// ============================================================================================= //
/**
* Unit test for [ cs.clearOldData ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
class MockGitStatusClass {
  deleteOne() {
    return new Promise((resolve, reject) => {
      if (adp.db.destroyBehavior) {
        resolve();
        return;
      }
      const msg = 'MockError';
      reject(msg);
    });
  }

  getAssetOlderThanSpecificDate() {
    return new Promise((resolve, reject) => {
      if (adp.db.findBehavior) {
        const now = new Date();
        const today = adp.dateLogSystemFormat(now).simple;
        const nowLastMonth = (new Date((now).setMonth((now).getMonth() - 1)));
        const lastMonth = adp.dateLogSystemFormat(nowLastMonth).simple;
        const nowLastYear = (new Date((now).setFullYear((now).getFullYear() - 1)));
        const lastYear = adp.dateLogSystemFormat(nowLastYear).simple;
        const mockDates = [
          { date: `${today}` },
          { date: `${lastMonth}` },
          { date: `${lastYear}` },
          { date: `${lastYear}` },
        ];
        resolve({ docs: mockDates });
      } else {
        const msg = 'MockError';
        reject(msg);
      }
    });
  }
}

describe('[ gerritContributorsStatistics ] testing [ cs.clearOldData ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    adp.models = {};
    adp.models.Gitstatus = MockGitStatusClass;
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
    adp.docs = {};
    adp.docs.list = [];
    adp.fullClearLog = [];
    adp.echoLog = () => {};
    adp.dateLogSystemFormat = require('./../../src/library/dateLogSystemFormat');

    cs.clearOldData = require('./clearOldData');
    adp.db = {};
    adp.db.findBehavior = true;
    adp.db.destroyBehavior = true;
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a simple successful case.', async (done) => {
    cs.clearOldData()
      .then(() => {
        done();
      })
      .catch((error) => {
        done.fail(error);
      });
  });


  it('Testing if [ adp.db.find ] fails.', async (done) => {
    adp.db.findBehavior = false;
    cs.clearOldData()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('Testing if [ adp.db.destroy ] fails.', async (done) => {
    adp.db.destroyBehavior = false;
    cs.clearOldData()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
