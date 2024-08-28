// ============================================================================================= //
/**
* Unit test for [ adp.mimer.updateDocumentMenuForSync ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
  getAllWithMimerVersionStarter() {
    let obj;
    switch (adp.mockBehavior.getAllWithMimerVersionStarter) {
      case false:
        obj = {
          code: 500,
          message: 'MockError from getAllMimerVersionStarter()',
        };
        return new Promise((RES, REJ) => REJ(obj));
      case 'mock-microservice-no-product-number-slug':
        obj = {
          docs: [
            {
              _id: 'mockMicroserviceNoProductNumberID',
              slug: 'mock-microservice-no-product-number-slug',
            },
          ],
        };
        return new Promise(RES => RES(obj));
      default:
        obj = {
          docs: [
            {
              _id: 'mockMicroserviceID',
              slug: 'mock-microservice-slug',
              product_number: 'ADPMimerProductNumber',
              mimer_version_starter: '0.0.0',
              menu_auto: true,
            },
          ],
        };
        return new Promise(RES => RES(obj));
    }
  }
}

class MockQueue {
  addJobs() {
    if (adp.mockBehavior.adpQueueAddJobs === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError from addJobs()' };
      REJ(mockError);
    });
  }

  setPayload() {
    return new Promise(RES => RES());
  }
}
// ============================================================================================= //
describe('Testing [ adp.mimer.updateDocumentMenu ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      adpQueueAddJobs: true,
      getAllWithMimerVersionStarter: true,
    };
    adp.queue = new MockQueue();
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });
    adp.mimer = {};
    adp.mimer.updateDocumentMenuForSync = proxyquire('./updateDocumentMenuForSync', {
      './../library/errorLog': adp.mockErrorLog,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, allVersions parameter as true.', (done) => {
    const allVersions = true;
    adp.mimer.updateDocumentMenuForSync(allVersions)
      .then((RES) => {
        expect(RES).toEqual('MockSuccess');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successfull case where Microservice does not have 3 product number, menu_auto and mimer_version_started', (done) => {
    adp.mockBehavior.getAllWithMimerVersionStarter = 'mock-microservice-no-product-number-slug';
    adp.mimer.updateDocumentMenuForSync()
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('When getAllWithMimerVersionStarter() sends error', (done) => {
    adp.mockBehavior.getAllWithMimerVersionStarter = false;
    adp.mimer.updateDocumentMenuForSync()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('MockError from getAllMimerVersionStarter()');
        expect(ERROR.data).toBeDefined();
        done();
      });
  });

  it('When adp.queue.addJobs() sends error', (done) => {
    adp.mockBehavior.adpQueueAddJobs = false;
    adp.mimer.updateDocumentMenuForSync()
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('MockError from addJobs()');
        expect(ERROR.data).toBeDefined();
        done();
      });
  });
});
// ============================================================================================= //
