// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.cleanGetPermissionToRun ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //

class MockMigrationScripts {
  index() {
    return new Promise((RESOLVE) => {
      const testObj = {
        docs: [
          {
            _id: 'SOME-RANDOM-ID-0001',
            _rev: 'SOME-RANDOM-REVISION-ID-0001',
            commandName: 'testOne',
            version: 'BACKEND-VERSION-ID-0001',
            focus: 'asset',
            runOnce: false,
            lastRun: null,
          },
          {
            _id: 'SOME-RANDOM-ID-0002',
            _rev: 'SOME-RANDOM-REVISION-ID-0002',
            commandName: 'testTwo',
            version: 'BACKEND-VERSION-ID-0002',
            runOnce: true,
            lastRun: null,
          },
          {
            _id: 'SOME-RANDOM-ID-0003',
            _rev: 'SOME-RANDOM-REVISION-ID-0003',
            commandName: 'testThree',
            version: 'BACKEND-VERSION-ID-0003',
            runOnce: true,
            lastRun: 'NOT-NULL-SOME-DATE-HERE',
          },
          {
            _id: 'SOME-RANDOM-ID-0001',
            _rev: 'SOME-RANDOM-REVISION-ID-0001',
            commandName: 'testFour',
            version: 'BACKEND-VERSION-ID-0001',
            runOnce: true,
            lastRun: null,
            focus: 'database',
          },
        ],
      };
      RESOLVE(testObj);
    });
  }
}

describe('Testing [ global.adp.migration.cleanGetPermissionToRun ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.Migrationscripts = MockMigrationScripts;
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.migration.cleanGetPermissionToRun = require('./cleanGetPermissionToRun');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing if is building the object with returned data.', (done) => {
    const processObj = {};
    global.adp.migration.cleanGetPermissionToRun(processObj)
      .then((RES) => {
        const assetMS = RES.migrationscripts.doc;

        expect(assetMS[0]._id).toBe('SOME-RANDOM-ID-0001');
        expect(assetMS[0]._rev).toBe('SOME-RANDOM-REVISION-ID-0001');
        expect(assetMS[0].commandName).toBe('testOne');
        expect(assetMS[0].version).toBe('BACKEND-VERSION-ID-0001');
        expect(assetMS[0].runOnce).toBeFalsy();
        expect(assetMS[0].lastRun).toBeNull();
        expect(assetMS[0].applyRule).toBeTruthy();
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
