// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.cleanUpdatePermissionToRun ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
class MockMigrationscriptsModel {
  getByName() {
    return new Promise((resolve) => {
      const testObj = {
        docs: [
          {
            _id: 'SOME-RANDOM-ID-0001',
            _rev: 'SOME-RANDOM-REVISION-ID-0001',
            commandName: 'testOne',
            version: 'BACKEND-VERSION-ID-0001',
            runOnce: false,
            lastRun: null,
          },
        ],
      };
      resolve(testObj);
    });
  }

  update(VALUE) {
    return new Promise((resolve) => {
      if (VALUE.commandName === 'testOne') {
        global.adp.checkThis.updateIsRight = true;
      }
      resolve();
    });
  }
}

describe('Testing [ global.adp.migration.cleanUpdatePermissionToRun ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.Migrationscripts = MockMigrationscriptsModel;
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.migration.cleanUpdatePermissionToRun = require('./cleanUpdatePermissionToRun');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp.checkThis = {};
    global.adp.checkThis.updateIsRight = false;
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing if is able to update lastRun when necessary.', (done) => {
    const names = ['testOne', 'testTwo'];
    global.adp.migration.cleanUpdatePermissionToRun(names)
      .then(() => {
        expect(global.adp.checkThis.updateIsRight).toBeTruthy();
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
