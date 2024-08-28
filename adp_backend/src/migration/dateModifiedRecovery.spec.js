// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.dateModifiedRecovery ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
class MockAdpLog {
  getNewOrUpdateByID(ID) {
    return new Promise((resolve) => {
      let obj = null;
      switch (ID) {
        case 'ABC0001':
          obj = {
            docs: [
              { datetime: '2019-10-25T15:28:00.000Z' },
              { datetime: '2019-10-25T15:30:00.000Z' },
              { datetime: '2019-10-25T15:29:00.000Z' },
            ],
          };
          break;
        case 'ABC0003':
          obj = {
            docs: [
              { datetime: '2019-10-25T15:35:00.000Z' },
            ],
          };
          break;
        default:
          obj = {
            docs: [],
          };
          break;
      }
      resolve(obj);
    });
  }
}
describe('Testing [ global.adp.migration.dateModifiedRecovery ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.migration.dateModifiedRecovery = require('./dateModifiedRecovery');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Add the "date_modified" and pick the latest date from a list.', (done) => {
    const mockAsset = {
      _id: 'ABC0001',
      name: 'Teste 1',
    };
    global.adp.migration.dateModifiedRecovery(mockAsset)
      .then((RES) => {
        expect(RES.date_modified).toBe('2019-10-25T15:30:00.000Z');
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
  it('Add the "date_modified" using the default date, because there is no log.', (done) => {
    const mockAsset = {
      _id: 'ABC0002',
      name: 'Teste 2',
    };
    global.adp.migration.dateModifiedRecovery(mockAsset)
      .then((RES) => {
        expect(RES.date_modified).toBe('2018-02-01T00:00:00.000Z');
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
  it('Add the "date_modified" from an unique log register.', (done) => {
    const mockAsset = {
      _id: 'ABC0003',
      name: 'Teste 3',
    };
    global.adp.migration.dateModifiedRecovery(mockAsset)
      .then((RES) => {
        expect(RES.date_modified).toBe('2019-10-25T15:35:00.000Z');
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
  it('Do not add, because "date_modified" is already there.', (done) => {
    const mockAsset = {
      _id: 'ABC0004',
      name: 'Teste 4',
      date_modified: '2019-10-25T15:35:00.000Z',
    };
    global.adp.migration.dateModifiedRecovery(mockAsset)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      }, done.fail);
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
