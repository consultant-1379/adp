// ============================================================================================= //
/**
* Unit test for [ adp.innerSource.deleteCommits ]
* @author Omkar Sadegaonkar [zsdgmk]
*/
// ============================================================================================= //
class MockAdpLog {
  createOne() {
    return new Promise((resolve, reject) => {
      if (adp.createLogError) {
        reject();
        return;
      }
      resolve();
    });
  }
}

class MockGitStatus {
  deleteCommit() {
    return new Promise((resolve, reject) => {
      if (adp.deleteCommitsError) {
        reject();
        return;
      }
      resolve({ ok: true });
    });
  }
}

describe('Testing [ adp.innerSource.deleteCommits ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    adp.models.Gitstatus = MockGitStatus;
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.createLogError = false;
    adp.deleteCommitsError = false;
    adp.innerSource = {};
    adp.innerSource.deleteCommits = require('./deleteCommits');
  });

  afterEach(() => {
    global.adp = null;
  });


  it('Rejects with error if startdate is in bad format', async (done) => {
    adp.innerSource.deleteCommits('bad-date')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.message).toEqual('startDate is required and should be in YYYY-MM-DD Format');
        done();
      });
  });

  it('Rejects with error when problem with deleting commits', async (done) => {
    adp.deleteCommitsError = true;
    adp.innerSource.deleteCommits('2020-10-10', '2020-10-10')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Responds succesfully if commits deleted and saved in log', async (done) => {
    adp.innerSource.deleteCommits('2020-10-10', '2020-10-10')
      .then(() => {
        expect(true).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
