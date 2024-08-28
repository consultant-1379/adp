// ============================================================================================= //
/**
* Unit test for [ global.adp.user.update ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdp {
  update() {
    return new Promise(resolve => resolve({ ok: true }));
  }
}
describe('Testing if [ global.adp.user.update ] is able to update a User (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = text => text;
    global.adp.docs = {};
    global.adp.user = {};
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.masterCache.clearBecauseCUD = () => {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      REJECT(); // Always simulate there is no cache in Unit Test...
    });
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.db = {};
    global.adp.docs.list = [];
    global.adp.user.validateSchema = MOCKJSON => MOCKJSON;
    global.adp.user.thisUserShouldBeInDatabase = SELECTOR => new Promise((RESOLVE, REJECT) => {
      if (SELECTOR === 'MOCKVALIDID') {
        const obj = {
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
        };
        const objArray = [obj];
        RESOLVE({ docs: objArray, totalInDatabase: 10 });
      } else {
        const errorOBJ = {};
        REJECT(errorOBJ);
      }
    });
    global.adp.db.update = () => new Promise((RESOLVE) => {
      RESOLVE({ ok: true });
    });
    global.adp.user.update = require('./update'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing with a valid mock ID and JSON.', async (done) => {
    const userInAction = {
      signum: 'testUser',
      role: 'admin',
    };
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = { somethingToUpdate: true };
    const expectedOBJ = await global.adp.user.update(validMockID, validMockJSON, userInAction);
    if (expectedOBJ === 200) {
      expect(expectedOBJ).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('Testing with a invalid mock ID and JSON. Should return 404.', async (done) => {
    const userInAction = {
      signum: 'testUser',
      role: 'admin',
    };
    const validMockID = 'MOCKINVALIDID';
    const validMockJSON = { somethingToUpdate: false };
    const expectedOBJ = await global.adp.user.update(validMockID, validMockJSON, userInAction);
    if (expectedOBJ === 404) {
      expect(expectedOBJ).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });
});
// ============================================================================================= //
