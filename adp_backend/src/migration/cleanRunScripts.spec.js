// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.cleanRunScripts ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
// ============================================================================================= //
class MockAdp {
  update(asset) {
    return new Promise((resolve) => {
      if (JSON.stringify(asset) === '{"_id":"MOCKID001","name":"Auto MS 001","slug":"mock-slug"}') {
        global.checkThis.situationOne = true;
      }
      if (JSON.stringify(asset) === '{"_id":"MOCKID002","name":"Auto MS 002","slug":"auto-ms-002"}') {
        global.checkThis.situationTwo = true;
      }
      if (JSON.stringify(asset) === '{"_id":"MOCKID003","name":"Auto MS 003","slug":"mock-slug"}') {
        global.checkThis.situationThree = true;
      }
      resolve();
    });
  }
}
describe('Testing [ global.adp.migration.cleanRunScripts ] Behavior.', () => {
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
    global.adp.migration.cleanUpdatePermissionToRun = () => new Promise(RES => RES());
    global.adp.migration.mockMarketplaceFilterValuesChange = () => new Promise(RES => RES());
    global.adp.migration.mockTrimName = ASSET => new Promise((RES) => {
      RES(ASSET);
    });
    global.adp.migration.mockSlugItNow = ASSET => new Promise((RES) => {
      RES(ASSET);
    });
    global.checkThis = {};
    global.checkThis.situationOne = false;
    global.checkThis.situationTwo = false;
    global.checkThis.situationThree = false;
    global.mockRulesAssets = {
      migrationscripts: {
        database: [
          {
            _id: 'MOCKID0001',
            _rev: 'MOCKREV0001',
            commandName: 'mockMarketplaceFilterValuesChange',
            version: '1.0.46',
            focus: 'asset',
            runOnce: true,
            lastRun: '2019-08-06T12:48:34.187Z',
            applyRule: false,
            followRule: 0,
            breakRule: 0,
          },
          {
            _id: 'MOCKID0002',
            _rev: 'MOCKREV0002',
            commandName: 'mockTrimName',
            version: '1.0.46',
            focus: 'asset',
            runOnce: false,
            lastRun: '2019-10-29T08:50:17.146Z',
            applyRule: true,
            followRule: 0,
            breakRule: 0,
          },
          {
            _id: 'MOCKID0003',
            _rev: 'MOCKREV0003',
            commandName: 'mockSlugItNow',
            version: '1.0.46',
            focus: 'asset',
            runOnce: false,
            lastRun: '2019-10-29T08:50:17.148Z',
            applyRule: true,
            followRule: 0,
            breakRule: 0,
          },
        ],
        doc: [],
      },
      allassets: [
        {
          _id: 'MOCKID001',
          _rev: 'MOCKREV001',
          name: '  Auto MS 001  ',
        },
        {
          _id: 'MOCKID002',
          _rev: 'MOCKREV002',
          name: 'Auto MS 002',
          slug: 'auto-ms-002',
        },
        {
          _id: 'MOCKID003',
          _rev: '   MOCKREV003',
          name: 'Auto MS 003',
        },
      ],
      allUsers: [
        {
          _id: 'MOCKID003',
          _rev: '   MOCKREV003',
          name: 'Auto MS 003',
        },
      ],
    };
    global.adp.migration.cleanRunScripts = require('./cleanRunScripts');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('If this script is able to execute some Mocks Migration Scripts.', (done) => {
    global.adp.migration.cleanRunScripts(global.mockRulesAssets)
      .then(() => {
        expect(global.checkThis.situationOne).toBeFalsy();
        expect(global.checkThis.situationTwo).toBeFalsy();
        expect(global.checkThis.situationThree).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
