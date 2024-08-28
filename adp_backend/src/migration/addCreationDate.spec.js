// ============================================================================================= //
/**
* Unit tests for [ global.adp.migration.addCreationDate ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
class MockAdpLog {
  getNewAssetById(ID) {
    return new Promise((resolve) => {
      let obj = null;
      switch (ID) {
        case 'ABC0001':
          obj = {
            resultsReturned: 1,
            docs: [
              { datetime: '2019-10-25T15:28:00.000Z' },
            ],
          };
          break;
        case 'ERROR':
          obj = {
            docs: [],
          };
          break;
        default:
          obj = {
            resultsReturned: 0,
            docs: [],
          };
          break;
      }
      resolve(obj);
    });
  }
}
describe('Testing [ global.adp.migration.addCreationDate ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.migration = {};
    global.adp.migration.addCreationDate = require('./addCreationDate'); // eslint-disable-line global-require

    global.adp.models = {};
    global.adp.models.AdpLog = MockAdpLog;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should get a creation date from the audit logs for the microservice.', (done) => {
    const mockAsset = {
      _id: 'ABC0001',
    };
    global.adp.migration.addCreationDate(mockAsset)
      .then((RES) => {
        expect(RES.date_created).toEqual(new Date('2019-10-25T15:28:00.000Z'));
        done();
      }, done.fail);
  });

  it('Should get set default creation date for the microservice.', (done) => {
    const mockAsset = {
      _id: 'ABC',
    };
    global.adp.migration.addCreationDate(mockAsset)
      .then((RES) => {
        expect((RES.date_created)).toEqual(new Date('2019-03-01T12:00:00.000Z'));
        done();
      }, done.fail);
  });

  it('Should throw error if migration script is not successful.', (done) => {
    const mockAsset = {
      _id: 'ERROR',
    };
    global.adp.migration.addCreationDate(mockAsset)
      .then(() => {
        done.fail();
      })
      .catch((RES) => {
        expect(RES.code).toBe(500);
        done();
      });
  });

  it('Should update date_modified string date to ISO date format.', (done) => {
    const mockAsset = {
      _id: 'ABCss',
      date_modified: '2022-05-08T12:00:00.000Z',
    };
    global.adp.migration.addCreationDate(mockAsset)
      .then((RES) => {
        expect((RES.date_modified)).toEqual(new Date('2022-05-08T12:00:00.000Z'));
        done();
      }, done.fail);
  });
});
