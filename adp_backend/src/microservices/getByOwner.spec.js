// ============================================================================================= //
/**
* Unit test for [ global.adp.microservices.getByOwner ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdp {
  allAssetsForRBAC() {
    return new Promise((RESOLVE) => {
      RESOLVE(global.adp.mock.commandFindAnwser);
    });
  }
}

describe('Analysing [ global.adp.microservices.getByOwner ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.jsonwebtoken = {};
    global.jsonwebtoken.sign = () => 'newToken';
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.db = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.jwtIntegration = {};
    global.adp.config.jwtIntegration.secret = '';
    global.adp.getSizeInMemory = () => 123456;
    global.adp.permission = {};
    global.adp.permission.fieldListWithPermissions = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.checkFieldPermissionCacheIt = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.isFieldAdmin = (signum, ms) => new Promise((MOCKRES1) => {
      if (ms.name === 'Test 1') {
        MOCKRES1(global.adp.mock.commandFindAnwser.docs[0]);
        return global.adp.mock.commandFindAnwser.docs[0];
      }
      MOCKRES1();
      return false;
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.microservices = {};
    global.adp.microservices.getByOwner = require('./getByOwner');
    global.adp.Answers = require('../answers/AnswerClass');
    global.adp.dynamicSort = require('../library/dynamicSort');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.mock = {};
    global.adp.mock.commandFindAnwser = {
      docs: [
        {
          _id: 'test1',
          inval_secret: 'teststring1',
          name: 'Test 1',
          team: [
            { signum: 'etesuse', serviceOwner: true },
            { signum: 'mockuser1', serviceOwner: false },
            { signum: 'mockuser2', serviceOwner: false },
          ],
        },
        {
          _id: 'test2',
          name: 'Test 2',
          team: [
            { signum: 'etesuse', serviceOwner: false },
            { signum: 'mockuser1', serviceOwner: false },
            { signum: 'mockuser2', serviceOwner: true },
          ],
        },
        {
          _id: 'test3',
          inval_secret: 'teststring3',
          name: 'Test 3',
          team: [
            { signum: 'mockuser1', serviceOwner: true },
            { signum: 'mockuser2', serviceOwner: false },
          ],
        },
      ],
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.db.find = () => new Promise((RESOLVE) => {
      RESOLVE(global.adp.mock.commandFindAnwser);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // =========================================================================================== //


  // =========================================================================================== //
  afterEach(() => {
    global.adp = null;
  });
  // =========================================================================================== //


  // =========================================================================================== //
  it('Reading all registers, because the user is admin.', async (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: {},
    };
    const expectedOBJ = await global.adp.microservices.getByOwner('esupuse', 'admin', 'microservice', mockRequest);
    const expectedAnswer = '[{"_id":"test1","name":"Test 1","access_token":"newToken"},{"_id":"test2","name":"Test 2"},{"_id":"test3","name":"Test 3","access_token":"newToken"}]';

    expect(JSON.stringify(expectedOBJ.templateJSON.data)).toEqual(expectedAnswer);
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Reading only authorized registers, because the user is author of one item.', async (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'etesuse', role: 'author' }] },
      rbac: { etesuse: { admin: false, allowed: { assets: ['MockID'] } } },
      query: {},
    };
    const expectedOBJ = await global.adp.microservices.getByOwner('etesuse', 'author', 'microservice', mockRequest);
    const expectedAnswer = '[{"_id":"test1","name":"Test 1","access_token":"newToken"}]';

    expect(JSON.stringify(expectedOBJ.templateJSON.data)).toEqual(expectedAnswer);
    done();
  });

  // =========================================================================================== //
  it('Reading only authorized registers, because the user is author of one item ( Alternative behavior because RBAC ).', async (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'etesuse', role: 'author' }] },
      rbac: { etesuse: { admin: false, allowed: { } } },
      query: {},
    };
    const expectedOBJ = await global.adp.microservices.getByOwner('etesuse', 'author', 'microservice', mockRequest);
    const expectedAnswer = '[{"_id":"test1","name":"Test 1","access_token":"newToken"}]';

    expect(JSON.stringify(expectedOBJ.templateJSON.data)).toEqual(expectedAnswer);
    done();
  });
  // =========================================================================================== //

  it('Should include the access_token to microservice that have inval_secret set.', async (done) => {
    const mockRequest = {
      user: { docs: [{ signum: 'esupuse', role: 'admin' }] },
      rbac: { esupuse: { admin: true } },
      query: {},
    };
    const expectedOBJ = await global.adp.microservices.getByOwner('esupuse', 'admin', 'microservice', mockRequest);

    const result = expectedOBJ.templateJSON.data;

    expect(result[0].access_token).toBeDefined();
    expect(result[1].access_token).not.toBeDefined();
    done();
  });
});
// ============================================================================================= //
