const proxyquire = require('proxyquire');

/**
 * unit tests for adp.innerSource.InnersourceUserHistory
 * @author Cein
 */

class MockInnersourceUserHistoryModel {
  getUserSnapshotAfterDate() {
    if (adp.innersourceUserHistoryModel.getUserSnapshotAfterDate.res) {
      return Promise.resolve(
        { docs: adp.innersourceUserHistoryModel.getUserSnapshotAfterDate.data },
      );
    }
    return Promise.reject(adp.innersourceUserHistoryModel.getUserSnapshotAfterDate.data);
  }

  getUserSnapshotLessEqualDate() {
    if (adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.res) {
      return Promise.resolve(
        { docs: adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.data },
      );
    }
    return Promise.reject(adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.data);
  }
}

const mockErrorLog = (code, desc, error) => {
  adp.errorLog = { code, desc };
  return { code, desc, error };
};

describe('Testing [ adp.innerSource.InnersourceUserHistory ] behavior', () => {
  let InnersourceUserHistoryContr;
  beforeEach(() => {
    adp = {
      docs: { list: [] },
      innersourceUserHistoryModel: {
        getUserSnapshotAfterDate: {
          res: true,
          data: null,
        },
        getUserSnapshotLessEqualDate: {
          res: true,
          data: null,
        },
      },
      errorLog: {},
    };
    InnersourceUserHistoryContr = proxyquire('./InnersourceUserHistory.controller', {
      '../models/InnersourceUserHistory': MockInnersourceUserHistoryModel,
      '../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    adp = null;
  });

  it('getClosestSnapshot: Should return successfully with a single snapshot before a given date.', (done) => {
    const modelResp = {
      signum: 'etest',
      organisation: 'testOrg',
      snapshot_date: '2021-06-29T23:02:01.518Z',
    };
    adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.data = [modelResp];

    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshot(modelResp.signum, '2021-06-29').then((resp) => {
      expect(resp.signum).toBe(modelResp.signum);
      expect(resp.organisation).toBe(modelResp.organisation);
      expect(resp.snapshot_date).toBe(modelResp.snapshot_date);
      done();
    }).catch(() => done.fail());
  });

  it('getClosestSnapshot: Should return successfully with a single snapshot after a given date.', (done) => {
    const modelResp = {
      signum: 'etest',
      organisation: 'testOrg',
      snapshot_date: '2021-06-29T23:02:01.518Z',
    };
    adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.data = [];
    adp.innersourceUserHistoryModel.getUserSnapshotAfterDate.data = [modelResp];

    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshot(modelResp.signum, '2021-06-29').then((resp) => {
      expect(resp.signum).toBe(modelResp.signum);
      expect(resp.organisation).toBe(modelResp.organisation);
      expect(resp.snapshot_date).toBe(modelResp.snapshot_date);
      done();
    }).catch(() => done.fail());
  });

  it('getClosestSnapshot: Should reject if no snapshots are found.', (done) => {
    const signum = 'fakeUser';
    const NOW = new Date();
    const currentMonth = (NOW.getMonth() + 1).toString().padStart(2, 0);
    const currentDate = NOW.getDate().toString().padStart(2, 0);
    const todaysDate = `${NOW.getFullYear()}-${currentMonth}-${currentDate}`;

    adp.innersourceUserHistoryModel.getUserSnapshotLessEqualDate.data = [];
    adp.innersourceUserHistoryModel.getUserSnapshotAfterDate.data = [];

    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshot(signum, todaysDate)
      .then(() => done.fail())
      .catch((errorResponse) => {
        const descriptionText = 'No innersourceUserHistory snapshot found for user fakeUser';

        expect(errorResponse.code).toBe(404);
        expect(errorResponse.desc.indexOf(descriptionText)).toBeGreaterThan(-1);
        expect(errorResponse.error.signum).toBe(signum);
        expect(errorResponse.error.date).toBe(todaysDate);
        expect(errorResponse.error.error.code).toBe(404);
        expect(errorResponse.error.error.desc.indexOf(descriptionText)).toBeGreaterThan(-1);

        done();
      });
  });

  it('getClosestSnapshotBefore: Should reject if the there is no date or signum.', (done) => {
    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshotBefore(null, null)
      .then(() => done.fail())
      .catch((errorResponse) => {
        expect(errorResponse.code).toBe(500);
        expect(errorResponse.desc).toBe('Given signum or date are not of the correct type');
        expect(errorResponse.error.signum).toBeFalsy();
        expect(errorResponse.error.error).toBe('Given signum or date are not of the correct type');

        done();
      });
  });

  it('getClosestSnapshotAfter: Should reject if the there is no date or signum.', (done) => {
    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshotAfter(null, null)
      .then(() => done.fail())
      .catch((errorResponse) => {
        expect(errorResponse.code).toBe(500);
        expect(errorResponse.desc).toBe('Given signum or date are not of the correct type');
        expect(errorResponse.error.signum).toBeFalsy();
        expect(errorResponse.error.error).toBe('Given signum or date are not of the correct type');

        done();
      });
  });

  it('getClosestSnapshot: Should reject if the there is no date or signum.', (done) => {
    const innerContr = new InnersourceUserHistoryContr();
    innerContr.getClosestSnapshot(null, null)
      .then(() => done.fail())
      .catch((errorResponse) => {
        expect(errorResponse.code).toBe(500);
        expect(errorResponse.desc).toBe('Given signum or date are not of the correct type');
        expect(errorResponse.error.signum).toBeFalsy();
        expect(errorResponse.error.date).toBeFalsy();

        done();
      });
  });
});
