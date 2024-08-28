// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.clean ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.clean ] Migration Rule Control Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.migration.clean = require('./clean');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.migration.cleanGetPermissionToRun = () => new Promise((RESOLVE) => {
      RESOLVE('SOMETHING_FOR_TEST');
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.migration.cleanGetAllAssets = () => new Promise((RESOLVE) => {
      RESOLVE('SOMETHING_FOR_TEST');
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.migration.cleanRunScripts = () => new Promise((RESOLVE) => {
      RESOLVE('SOMETHING_FOR_TEST');
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing if the Promise Chain can fulfill the main Promise.', (done) => {
    global.adp.migration.clean()
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
