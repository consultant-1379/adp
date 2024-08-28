// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.cleanGetAllAssets ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockAdp {
  index() {
    return new Promise((RESOLVE) => {
      const testObj = {
        docs: [
          { test: 'test0', type: 'microservice' },
          { test: 'test1', type: 'microservice' },
          { test: 'test2', type: 'user' },
        ],
      };
      RESOLVE(testObj);
    });
  }
}
describe('Testing [ global.adp.migration.cleanGetAllAssets ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.cleanGetAllAssets = require('./cleanGetAllAssets');
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing if is building the object with returned data.', (done) => {
    const processObj = {};
    global.adp.migration.cleanGetAllAssets(processObj)
      .then((RES) => {
        const assets = RES.allassets;
        const user = RES.allUsers;

        expect(assets[0].test).toBe('test0');
        expect(assets[1].test).toBe('test1');
        expect(user[0].test).toBe('test2');
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
