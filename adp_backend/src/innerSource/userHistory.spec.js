// ============================================================================================= //
/**
* Unit test for [ adp.innerSource.userHistory ]
* @author Omkar Sadegaonkar [zsdgmkr], Veerender Voskula[zvosvee]
*/
// ============================================================================================= //
let dbError = false;
class MockInnersourceUserHistory {
  getUserSnapshot() {
    return new Promise((resolve, reject) => {
      if (dbError) {
        reject();
        return false;
      }
      const resp = { docs: [] };
      resolve(resp);
      return true;
    });
  }
}

describe('Testing [ adp.innerSource.userHistory ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.InnersourceUserHistory = MockInnersourceUserHistory;
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.innerSource = {};
    adp.innerSource.userHistory = require('./userHistory');
    dbError = false;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should fail if SIGNUM is invalid', async (done) => {
    const signum = null;
    const date = '';
    adp.innerSource.userHistory(signum, date)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR).toBeDefined();
        expect(ERROR.msg).toEqual('SIGNUM should be String');
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('Should fail if DATE variable is not string', async (done) => {
    const signum = 'test';
    const date = 2;
    adp.innerSource.userHistory(signum, date)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR).toBeDefined();
        expect(ERROR.msg).toEqual('DATE value should be String');
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('Should fail if DATE variable is not valid', async (done) => {
    const signum = 'test';
    const date = '202-01-01';
    adp.innerSource.userHistory(signum, date)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR).toBeDefined();
        expect(ERROR.msg).toEqual('DATE should be in YYYY-MM-DD Format or "all" or "latest"');
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('Should set date to all if DATE variable is not present', async (done) => {
    const signum = 'test';
    adp.innerSource.userHistory(signum)
      .then((RESP) => {
        expect(RESP).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Should fail if errors in DB Response', async (done) => {
    const signum = 'test';
    const date = '2020-01-01';
    dbError = true;
    adp.innerSource.userHistory(signum, date)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR).toBeDefined();
        expect(ERROR.msg).toEqual('Internal Server Error');
        expect(ERROR.code).toEqual(500);
        done();
      });
  });

  it('Should respond with success response', async (done) => {
    const signum = 'test';
    const date = '2020-01-01';
    adp.innerSource.userHistory(signum, date)
      .then((RESP) => {
        expect(RESP).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
