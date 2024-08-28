// ============================================================================================= //
/**
* Unit test for [ global.adp.user.create ]
* @author Armando Schiavon Dias [escharm], Veerender
*/
// ============================================================================================= //
class MockAdp {
  createOne(MOCKJSON) {
    return new Promise(resolve => resolve({ ok: MOCKJSON.return, id: MOCKJSON.id }));
  }

  updateUserPermissionGroup() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ();
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }
}

class MockRBACGroupClass {
  getGroups() {
    return new Promise((RES) => {
      RES(adp.mockRespGroups.docs);
      return true;
    });
  }
}

// eslint-disable-next-line jasmine/no-focused-tests
describe('Testing if [ global.adp.user.create ] is able to create a User (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = text => text;
    adp.GroupName = 'Internal Users Group';
    adp.getDefaultRBACGroupID = () => adp.GroupName;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    adp.rbac = {};
    adp.rbac.GroupsController = MockRBACGroupClass;
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.masterCache.clearBecauseCUD = () => {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      REJECT(); // Always simulate there is no cache in Unit Test...
    });
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.user = {};
    global.adp.user.read = () => new Promise((RESOLVE) => {
      const obj = { docs: [] };
      RESOLVE(obj);
    });
    global.adp.user.create = require('./create'); // eslint-disable-line global-require
    global.adp.user.checkName = () => new Promise((RESOLVE) => {
      RESOLVE(true);
    });
    global.adp.db = {};
    global.adp.db.create = (MOCKDB, MOCKJSON) => new Promise((RESOLVE) => {
      RESOLVE({ ok: MOCKJSON.return, id: MOCKJSON.id });
    });
    global.adp.mockRbac = [{ _id: 'mockId', name: 'mock name', type: 'group' }];
    global.adp.mockResp = { ok: true };
    global.adp.mockRespGroups = { docs: [{ _id: 'mockId', name: 'mock name', type: 'group' }] };
    global.adp.user.validateSchema = MOCKJSON => MOCKJSON.return;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing with a valid mock JSON.', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      return: true,
    };
    const expectedOBJ = await global.adp.user.create(validMockJSON);
    if (expectedOBJ === 500) {
      done.fail(expectedOBJ);
    } else {
      expect(expectedOBJ).toBeDefined();
      done();
    }
  });

  it('Testing with a invalid mock JSON.', async (done) => {
    const validMockJSON = {
      name: 'test',
      return: false,
    };
    const expectedOBJ = await global.adp.user.create(validMockJSON);
    if (expectedOBJ === 500) {
      expect(false).toBeTruthy();
      done();
    } else {
      expect(true).toBeTruthy();
      done();
    }
  });
});
// ============================================================================================= //
