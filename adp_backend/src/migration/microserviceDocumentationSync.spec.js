const proxyquire = require('proxyquire');

class MockAdp {
  indexAssetsGetOnlyIDsAndSlugs() {
    return new Promise((RES, REJ) => {
      let error;
      let file;
      let mockError = null;
      switch (adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs) {
        case 0:
          file = require('../microservice/synchronizeWithElasticSearch-allIDs.spec.json');
          RES({ docs: file });
          break;
        case 1:
          RES([]);
          break;
        case 2:
          error = { code: 900, message: 'Mocked Error message for indexAssetsGetOnlyIDs' };
          REJ(error);
          break;
        default:
          mockError = 'indexAssetsGetOnlyIDs MockError';
          REJ(mockError);
          break;
      }
    });
  }
}

const mockErrorLog = (code, desc, data, origin, packName) => {
  if (data && data.error && data.error.code) {
    return data.error;
  }
  return {
    code,
    message: desc,
    error: data,
    origin,
    packName,
  };
};
const microserviceDocumentationSync = proxyquire('./microserviceDocumentationSync', {
  '../library/errorLog': mockErrorLog,
});
describe('Testing [ adp.microservice.synchronizeWithElasticSearch ] behavior.', () => {
  beforeEach(() => {
    adp = {};
    adp.queue = {};
    adp.queue.addJobs = () => {
      if (adp.mockBehavior.addJobs === 1) {
        return new Promise((RES, REJ) => REJ());
      }
      return new Promise(RES => RES());
    };
    adp.queue.startJobs = () => {
      if (adp.mockBehavior.startJobs === 1) {
        return new Promise((RES, REJ) => REJ());
      }
      return new Promise(RES => RES());
    };
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.echoLog = () => {};
    adp.mockBehavior = {
      MockAdp_indexAssetsGetOnlyIDs: 0,
      addJobs: 0,
      startJobs: 0,
    };
    adp.mockSyncBehavior = 0;
  });


  afterEach(() => {
    adp = null;
  });

  // it('Testing whether indexAssetsGetOnlyIDs returns all IDs.', (done) => {
  //   microserviceDocumentationSync()
  //     .then(() => {
  //       done();
  //     })
  //     .catch(() => {
  //       done.fail();
  //     });
  // });

  it('Testing whether indexAssetsGetOnlyIDs returns error', (done) => {
    adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs = -1;
    microserviceDocumentationSync()
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('Testing if indexAssetsGetOnlyIDs returns custome error.', (done) => {
    adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs = 2;
    microserviceDocumentationSync()
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(900);
        done();
      });
  });

  it('Testing when indexAssetsGetOnlyIDs returns incorrect data', (done) => {
    adp.mockBehavior.MockAdp_indexAssetsGetOnlyIDs = 1;
    microserviceDocumentationSync()
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });
});
