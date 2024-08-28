/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-promise-reject-errors */
describe('Testing results of [ adp.teamHistory.TeamHistoryController ]', () => {
  let portalModelMock;
  let adpIndexMicroservices;
  class MockModel {
    async getMsById(msIdList) {
      return portalModelMock(msIdList);
    }

    indexMicroservices() {
      return adpIndexMicroservices();
    }
  }

  let getResp;
  beforeEach(() => {
    getResp = {
      res: true,
      data: [],
    };
    global.adp = {};
    global.adp.echoLog = () => {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.db = {};
    global.adp.db.get = () => new Promise((resolve, reject) => {
      if (getResp.res) {
        resolve(getResp.data);
      } else {
        reject(getResp.data);
      }
    });
    global.adp.db.create = () => new Promise(resolve => resolve(true));
    global.adp.db.update = () => new Promise(resolve => resolve(true));
    global.adp.db.find = () => new Promise(resolve => resolve(true));
    global.adp.db.bulk = () => new Promise(resolve => resolve(true));
    global.adp.db.aggregate = () => new Promise(resolve => resolve(true));
    adpIndexMicroservices = () => new Promise(resolve => resolve(true));
    global.adp.microservices = {};
    global.adp.microservices.getById = () => new Promise(
      resolve => resolve({ msList: [], errors: [] }),
    );
    global.adp.config = {};
    global.adp.models = {};
    global.adp.models.Adp = MockModel;
    global.adp.models.TeamHistory = require('../models/TeamHistory');

    global.adp.teamHistory = {};
    global.adp.teamHistory.TeamHistoryController = require('./TeamHistoryController');
  });


  it('createSnapshot should succeed with valid parameters', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.createSnapshot('id', [], true);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('createSnapshot should catch issues during snapshot creation', async (done) => {
    global.adp.db.create = () => new Promise((resolve, reject) => reject(false));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.createSnapshot('id', [], true);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('createSnapshot should fail due to no parameters', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.createSnapshot();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('updateSnapshot should succeed with valid parameters', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.updateSnapshot([], 'lastSnapshotId');
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('updateSnapshot should fail with invalid parameters', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.updateSnapshot();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('updateSnapshot should fail with exception during update', async (done) => {
    global.adp.db.update = () => new Promise((resolve, reject) => reject('predicted'));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.updateSnapshot([], 'id');
      done.fail();
    } catch (error) {
      expect(error.data.error).toEqual('predicted');
      done();
    }
  });

  it('bulkSnapshotUpdateCreate should succeed with valid parameters', async (done) => {
    let caught;
    global.adp.db.bulk = (dbName, catchData) => {
      caught = catchData;
      return new Promise(resolve => resolve(true));
    };
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    const snapshot = {
      _id: 'id',
      _rev: 'rev',
      date_updated: 'notnull',
    };
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([snapshot]);

      expect(caught.length).toBe(1);
      expect(caught[0].date_updated).toBeTruthy();
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('bulkSnapshotUpdateCreate should succeed with valid parameters but no date_updated', async (done) => {
    let caught;
    global.adp.db.bulk = (dbName, catchData) => {
      caught = catchData;
      return new Promise(resolve => resolve(true));
    };
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    const snapshot = {
      _id: 'id',
      _rev: 'rev',
    };
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([snapshot]);

      expect(caught.length).toBe(1);
      expect(caught[0].date_updated).toBeTruthy();
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('bulkSnapshotUpdateCreate should create date_created if missing from a valid snapshot object', async (done) => {
    let caught;
    global.adp.db.bulk = (dbName, catchData) => {
      caught = catchData;
      return new Promise(resolve => resolve(true));
    };
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    const snapshot = {
      field: 'notnull',
    };
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([snapshot]);

      expect(caught.length).toBe(1);
      expect(caught[0].date_created).toBeTruthy();
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('bulkSnapshotUpdateCreate should fail with empty list', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([]);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('bulkSnapshotUpdateCreate should fail with invalid parameters', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('bulkSnapshotUpdateCreate should fail with exception during update', async (done) => {
    global.adp.db.bulk = () => new Promise((resolve, reject) => reject('predicted'));
    const snapshot = {
      _id: 'id',
      _rev: 'rev',
      date_updated: 'notnull',
    };
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([snapshot]);
      done.fail();
    } catch (error) {
      expect(error.data.error).toEqual('predicted');
      done();
    }
  });

  it('bulkSnapshotUpdateCreate should fail with invalid input data', async (done) => {
    global.adp.db.bulk = () => new Promise((resolve, reject) => reject('predicted'));
    const snapshot = 'invalid';
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.bulkSnapshotUpdateCreate([snapshot]);
      done.fail();
    } catch (error) {
      expect(Array.isArray(error.data.error)).toBe(true);
      done();
    }
  });

  it('getListAssetIds should succeed', async (done) => {
    try {
      const answer = adp.teamHistory.TeamHistoryController.getListAssetIds([{ _id: 'test' }]);

      expect(Array.isArray(answer.msIdList)).toBeTruthy();
      expect(answer.msIdList.length).toBe(1);
      expect(Array.isArray(answer.errors)).toBeTruthy();
      expect(answer.errors.length).toBe(0);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('getListAssetIds should succeed and dedupe', async (done) => {
    try {
      const answer = adp.teamHistory.TeamHistoryController.getListAssetIds([{ _id: 'test' }, { _id: 'test' }]);

      expect(Array.isArray(answer.msIdList)).toBeTruthy();
      expect(answer.msIdList.length).toBe(1);
      expect(Array.isArray(answer.errors)).toBeTruthy();
      expect(answer.errors.length).toBe(0);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('getListAssetIds should report errors for list items without _id', async (done) => {
    try {
      const answer = adp.teamHistory.TeamHistoryController.getListAssetIds([{}]);

      expect(Array.isArray(answer.msIdList)).toBeTruthy();
      expect(answer.msIdList.length).toBe(0);
      expect(Array.isArray(answer.errors)).toBeTruthy();
      expect(answer.errors.length).toBe(1);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('getListAssetIds should report errors for list items with non string _id', async (done) => {
    try {
      const answer = adp.teamHistory.TeamHistoryController.getListAssetIds([{ _id: 1 }]);

      expect(Array.isArray(answer.msIdList)).toBeTruthy();
      expect(answer.msIdList.length).toBe(0);
      expect(Array.isArray(answer.errors)).toBeTruthy();
      expect(answer.errors.length).toBe(1);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('getSnapshotsById should succeed with valid input list', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.getSnapshotsById([{ _id: '1' }]);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('getSnapshotsById should fail with invalid input list', async (done) => {
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.getSnapshotsById();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('fetchLastSnapshotByMsId should succeed with valid input list', async (done) => {
    global.adp.db.aggregate = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      const answer = await teamHistoryController.fetchLastSnapshotByMsId([{ _id: '1' }, { _id: '2' }]);

      expect(answer.lastSnapshotList).toBeTruthy();
      expect(answer.lastSnapshotList.length).toBe(2);
      const traceKeys = answer.lastSnapshotList.map(snap => snap.some_key);

      expect(traceKeys).toContain('a');
      expect(traceKeys).toContain('c');
      expect(traceKeys).not.toContain('b');
      expect(traceKeys).not.toContain('d');
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLastSnapshotByMsId should succeed with valid input list matching no history', async (done) => {
    global.adp.db.aggregate = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      const answer = await teamHistoryController.fetchLastSnapshotByMsId([{ _id: '3' }, { _id: '4' }]);

      expect(answer.lastSnapshotList).toBeTruthy();
      expect(answer.lastSnapshotList.length).toBe(0);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLastSnapshotByMsId should ignore 0 length history', async (done) => {
    global.adp.db.aggregate = () => new Promise(resolve => resolve({ docs: [] }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      const answer = await teamHistoryController.fetchLastSnapshotByMsId([{ _id: '1' }]);

      expect(answer.lastSnapshotList).toBeTruthy();
      expect(answer.lastSnapshotList.length).toBe(0);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLastSnapshotByMsId should fail with empty input list', async (done) => {
    global.adp.db.get = () => new Promise(resolve => resolve({ docs: [] }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLastSnapshotByMsId();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('fetchLastSnapshotByMsId should handle errors during history retrieval', async (done) => {
    global.adp.db.aggregate = () => new Promise((resolve, reject) => reject('predicted'));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLastSnapshotByMsId([{ _id: '1' }, { _id: '2' }]);
      done.fail();
    } catch (error) {
      expect(error.errors).toBeTruthy();
      expect(error.errors.length).toBe(1);
      expect(error.errors[0].data.error).toEqual('predicted');
      done();
    }
  });

  it('fetchLatestSnapshotsMsList should succeed with valid input list', async (done) => {
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([{ _id: '1' }, { _id: '2' }]);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLatestSnapshotsMsList should fail with empty input list', async (done) => {
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([]);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('fetchLatestSnapshotsMsList should raise error when none of the microservices in history are found by id in portal', async (done) => {
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([{ _id: '1' }, { _id: '2' }], true);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('fetchLatestSnapshotsMsList should succeed with valid input list forcing full ms objects but getbyid returns non empty', async (done) => {
    global.adp.microservices.getById = () => new Promise(resolve => resolve({
      msList: [{}], errors: [],
    }));
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([{ _id: '1' }, { _id: '2' }], true);
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLatestSnapshotsMsList should raise error if error occurs while querying services in portal', async (done) => {
    global.adp.microservices.getById = () => new Promise((resolve, reject) => reject('predicted'));
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([{ _id: '1' }, { _id: '2' }], true);
      done.fail();
    } catch (error) {
      expect(error.data.error).toBeTruthy();
      expect(error.data.error).toContain('predicted');
      done();
    }
  });

  it('fetchLatestSnapshotsMsList should handle db errors', async (done) => {
    global.adp.db.aggregate = () => new Promise((resolve, reject) => reject('predicted'));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsMsList([{ _id: '1' }, { _id: '2' }]);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('fetchLatestSnapshotsAllMs positive case', async (done) => {
    adpIndexMicroservices = () => new Promise(resolve => resolve({ docs: [{}] }));
    global.adp.microservices.getById = () => new Promise(resolve => resolve({
      msList: [{}], errors: [],
    }));
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [
        { asset_id: '1', some_key: 'a' },
        { asset_id: '1', some_key: 'b' },
        { asset_id: '2', some_key: 'c' },
        { asset_id: '2', some_key: 'd' },
      ],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsAllMs();
      done();
    } catch (error) {
      done.fail();
    }
  });

  it('fetchLatestSnapshotsAllMs should handle ms index errors', async (done) => {
    adpIndexMicroservices = () => new Promise((resolve, reject) => reject('predicted'));
    global.adp.microservices.getById = () => new Promise(resolve => resolve({
      msList: [], errors: [],
    }));
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsAllMs();
      done.fail();
    } catch (error) {
      expect(error.data.error).toBeTruthy();
      expect(error.data.error).toEqual('predicted');
      done();
    }
  });

  it('fetchLatestSnapshotsAllMs should handle errors during fetch latest snapshot', async (done) => {
    adpIndexMicroservices = () => new Promise(resolve => resolve({ docs: [{}] }));
    global.adp.microservices.getById = () => new Promise((resolve, reject) => reject('predicted'));
    global.adp.db.aggregate = () => new Promise((resolve, reject) => reject('predicted'));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsAllMs();
      done.fail();
    } catch (error) {
      expect(error.data.error).toBeTruthy();
      done();
    }
  });

  it('fetchLatestSnapshotsAllMs should error on empty response from db model', async (done) => {
    global.adp.microservices.getById = () => new Promise((resolve, reject) => reject('predicted'));
    global.adp.db.get = () => new Promise(resolve => resolve({
      docs: [],
    }));
    const teamHistoryController = new adp.teamHistory.TeamHistoryController();
    try {
      await teamHistoryController.fetchLatestSnapshotsAllMs();
      done.fail();
    } catch (error) {
      done();
    }
  });
});
