/**
* Unit test for [ adp.models.TeamHistory ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
describe('Testing [ adp.models.TeamHistory ], ', () => {
  let getResp;
  beforeEach(() => {
    getResp = {
      res: true,
      data: [],
    };

    const respMock = () => new Promise((resolve, reject) => {
      if (getResp.res) {
        resolve(getResp.data);
      } else {
        reject(getResp.data);
      }
    });

    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};

    adp.db.get = respMock;
    adp.db.create = () => new Promise(resolve => resolve(true));
    adp.db.update = () => new Promise(resolve => resolve(true));
    adp.db.find = () => new Promise(resolve => resolve(true));
    adp.db.bulk = () => new Promise(resolve => resolve(true));
    adp.db.aggregate = respMock;
    adp.config = {};
    adp.models = {};
    adp.models.TeamHistory = require('./TeamHistory');
  });

  afterEach(() => {
    global.adp = null;
  });


  it('createSnapshot: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.createSnapshot('id', '')
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('updateSnapshot: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.updateSnapshot('id', '')
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('bulkCreateUpdate: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.bulkCreateUpdate([])
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('bulkCreateUpdate: Should return a promise responding true, even without parameter.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.bulkCreateUpdate()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('getSnapshotByAssetId: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.getSnapshotByAssetId(['id'])
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('getLastSnapshotByAssetId: Should return data without duplicate asset_ids and that are items in the given id list.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    const testId1 = '1';
    const testId2 = '2';
    const testId3 = '3';
    getResp.data = {
      docs: [
        { asset_id: testId1 },
        { asset_id: testId1 },
        { asset_id: testId2 },
        { asset_id: testId3 },
      ],
    };
    teamHistoryModel.getLastSnapshotByAssetId([testId1, testId2])
      .then((response) => {
        expect(response.docs.length).toBe(2);
        expect(response.docs[0].asset_id).toBe(testId1);
        expect(response.docs[1].asset_id).toBe(testId2);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('getLastSnapshotByAssetId: Behavior if [ adp.db.aggregate ] returns empty.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    const testId1 = '1';
    const testId2 = '2';
    const testId3 = '3';
    getResp.data = {
      docs: [
        { asset_id: testId1 },
        { asset_id: testId1 },
        { asset_id: testId2 },
        { asset_id: testId3 },
      ],
    };
    adp.db.aggregate = () => new Promise((RESOLVE) => {
      RESOLVE({});
    });
    teamHistoryModel.getLastSnapshotByAssetId([testId1, testId2])
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLastSnapshotByAssetId: should throw error if get rejects.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    const testError = 'error';
    getResp.res = false;
    getResp.data = testError;

    teamHistoryModel.getLastSnapshotByAssetId([])
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(testError).toContain(error);
        done();
      });
  });


  it('getAllSnapshots: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.getAllSnapshots()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('getById: Should return a promise responding true.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    teamHistoryModel.getById()
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('If [ getByAssetIDSignumDate ] can build a query.', (done) => {
    const teamHistoryModel = new adp.models.TeamHistory();
    const msId = 'MockID';
    const commitDate = '2020-12-01';
    adp.db.aggregate = (DBNAME, DBQUERY) => new Promise((RESOLVE) => {
      adp.db.query = DBQUERY;
      RESOLVE();
    });

    teamHistoryModel.getByAssetIDSignumDate(msId, commitDate)
      .then(() => {
        const { query } = adp.db;

        expect(query[0]).toBeDefined();
        expect(query[0].$match.$and[0]).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
