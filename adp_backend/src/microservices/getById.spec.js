/* eslint-disable class-methods-use-this */
describe('Testing results of [ global.adp.microservices.getById ]', () => {
  let portalModelMock;
  class MockModel {
    async getMsById(msIdList) {
      return portalModelMock(msIdList);
    }
  }

  let assetIdTeamMock;
  class MockTeamController {
    static getListAssetIds(msList) {
      return assetIdTeamMock(msList);
    }
  }

  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.models = {};
    global.adp.models.Adp = MockModel;
    global.adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = MockTeamController;
    adp.teamHistory.TeamHistoryController = MockTeamController;
    global.adp.microservices = {};
    global.adp.microservices.getById = require('./getById');
    assetIdTeamMock = () => ({
      msIdList: [],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [],
    });
  });

  it('should ', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [{ _id: 'id123' }],
    });
    const answer = await global.adp.microservices.getById(['id123']);

    expect(answer.msList.length).toBeGreaterThan(0);
    expect(answer.errors.length).toBe(0);
    done();
  });

  it('simple search. should match an id found in history with one in portal db without errors', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
      ],
    });
    const answer = await global.adp.microservices.getById(['id123']);

    expect(answer.msList.length).toBeGreaterThan(0);
    expect(answer.errors.length).toBe(0);
    done();
  });

  it('simple search. should record an error if item is found in history but not portal db', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['x'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [],
    });
    const answer = await global.adp.microservices.getById(['id123']);

    expect(answer.msList.length).toBe(0);
    expect(answer.errors.length).toBe(1);
    done();
  });

  it('simple search. should match multiple ids found in history with one in portal db without errors', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123', 'id1234'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
        { _id: 'id1234' },
      ],
    });
    const answer = await global.adp.microservices.getById(['id123']);

    expect(answer.msList.length).toBeGreaterThan(0);
    expect(answer.errors.length).toBe(0);
    done();
  });

  it('simple search. should record an error if portal response is not in correct format', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123'],
      errors: [],
    });
    portalModelMock = () => ({
    });
    try {
      await global.adp.microservices.getById(['id123']);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should handle 0 length response from team history', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: [],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
      ],
    });
    try {
      await global.adp.microservices.getById(['id123']);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should handle exceptions querying portal', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123'],
      errors: [],
    });
    portalModelMock = () => {
      throw new Error('Unexpected');
    };
    try {
      await global.adp.microservices.getById(['id123']);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should gracefully handle invalid input (empty array)', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123', 'id1234'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
        { _id: 'id1234' },
      ],
    });
    try {
      await global.adp.microservices.getById([]);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should gracefully handle invalid input (null)', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123', 'id1234'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
        { _id: 'id1234' },
      ],
    });
    try {
      await global.adp.microservices.getById(null);
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should gracefully handle invalid input (undefined)', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123', 'id1234'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
        { _id: 'id1234' },
      ],
    });
    try {
      await global.adp.microservices.getById();
      done.fail();
    } catch (error) {
      done();
    }
  });

  it('simple search. should gracefully handle invalid input (string)', async (done) => {
    assetIdTeamMock = () => ({
      msIdList: ['id123', 'id1234'],
      errors: [],
    });
    portalModelMock = () => ({
      docs: [
        { _id: 'id123' },
        { _id: 'id1234' },
      ],
    });
    try {
      await global.adp.microservices.getById('text');
      done.fail();
    } catch (error) {
      done();
    }
  });
});
