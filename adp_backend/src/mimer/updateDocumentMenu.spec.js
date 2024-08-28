// ============================================================================================= //
/**
* Unit test for [ adp.mimer.updateDocumentMenu ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
  getAssetByIDorSLUG(SLUG) {
    if (adp.mockBehavior.getAssetByIDorSLUG === false) {
      const mockError = {
        code: 500,
        message: 'MockError',
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    let obj;
    switch (SLUG) {
      case 'mock-microservice-slug':
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
      case 'mock-microservice-not-found-slug':
        obj = {
          docs: [],
        };
        return new Promise(RES => RES(obj));
      default:
        obj = {
          error: 'MockError',
        };
        return new Promise((RES, REJ) => REJ(obj));
    }
  }
}
// ============================================================================================= //
class MockQueue {
  addJob() {
    if (adp.mockBehavior.adpQueueAddJob === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
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
      adpQueueAddJob: true,
      getAssetByIDorSLUG: true,
    };
    adp.queue = new MockQueue();
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.mimer = {};
    adp.mimer.updateDocumentMenu = proxyquire('./updateDocumentMenu', {
      './../library/errorLog': adp.erroLog,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, allVersions parameter as true.', (done) => {
    const msSlug = 'mock-microservice-slug';
    const allVersions = true;
    adp.mimer.updateDocumentMenu(msSlug, allVersions)
      .then((RES) => {
        expect(RES).toEqual('MockSuccess');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, allVersions parameter as default value (false).', (done) => {
    const msSlug = 'mock-microservice-slug';
    adp.mimer.updateDocumentMenu(msSlug)
      .then((RES) => {
        expect(RES).toEqual('MockSuccess');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case microservice doesn`t have product_number.', (done) => {
    const msSlug = 'mock-microservice-no-product-number-slug';
    adp.mimer.updateDocumentMenu(msSlug)
      .then((RES) => {
        expect(RES.code).toEqual(400);
        expect(RES.message).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case microservice was not found.', (done) => {
    const msSlug = 'mock-microservice-not-found-slug';
    adp.mimer.updateDocumentMenu(msSlug)
      .then((RES) => {
        expect(RES.code).toEqual(404);
        expect(RES.message).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ adp.queue.addJob ] rejects.', (done) => {
    adp.mockBehavior.adpQueueAddJob = false;
    const msSlug = 'mock-microservice-slug';
    adp.mimer.updateDocumentMenu(msSlug)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getAssetByIDorSLUG @ adp.models.Adp ] rejects.', (done) => {
    adp.mockBehavior.getAssetByIDorSLUG = false;
    const msSlug = 'mock-microservice-slug';
    adp.mimer.updateDocumentMenu(msSlug)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
