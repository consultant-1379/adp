// ============================================================================================= //
/**
* Unit test for [ adp.mimer.mimerElasticSearchSyncClear ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockMimerElasticSearchSync {
  clearElasticDocuments() {
    switch (adp.mockBehavior.deleteItem) {
      case 1:
        return new Promise(RES => RES({
          statusCode: 200,
          deleted_count: 10,
        }));
      case 2:
        return new Promise(RES => RES({
          statusCode: 200,
          deleted_count: 0,
        }));
      default:
        return new Promise((RES, REJ) => {
          const mockError = { code: 500, message: 'MockError' };
          REJ(mockError);
        });
    }
  }
}

describe('Testing [ adp.mimer.mimerElasticSearchSyncClear ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp = {};
    adp.mockBehavior = {
      deleteItem: 0,
    };
    adp.mimer = {};
    adp.mimer.MimerElasticSearchSync = MockMimerElasticSearchSync;
    adp.mimer.mimerElasticSearchSyncClear = proxyquire('./mimerElasticSearchSyncClear', {
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, clear some of the documents', (done) => {
    adp.mockBehavior.deleteItem = 1;
    adp.mimer.mimerElasticSearchSyncClear()
      .then((RES) => {
        expect(RES.statusCode).toEqual(200);
        expect(RES.deleted_count).toEqual(10);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, no documents are cleared', (done) => {
    adp.mockBehavior.deleteItem = 2;
    adp.mimer.mimerElasticSearchSyncClear()
      .then((RES) => {
        expect(RES.statusCode).toEqual(200);
        expect(RES.deleted_count).toEqual(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Error case, no documents are cleared', (done) => {
    adp.mockBehavior.deleteItem = 0;
    adp.mimer.mimerElasticSearchSyncClear()
      .then(() => {
        done.fail();
      })
      .catch((ERR) => {
        expect(ERR.code).toEqual(500);
        expect(ERR.message).toEqual('MockError');
        done();
      });
  });
});
