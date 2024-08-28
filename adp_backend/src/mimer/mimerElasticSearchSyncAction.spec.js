// ============================================================================================= //
/**
* Unit test for [ adp.mimer.mimerElasticSearchSyncAction ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockMimerElasticSearchSync {
  sync(MSID, MSSLUG, MSNAME) {
    switch (adp.mockBehavior.syncAction) {
      case 1:
        return new Promise(RES => RES({
          code: 200,
          message: 'Document Updated',
          document: {
            asset_id: MSID,
            asset_name: MSNAME,
            asset_slug: MSSLUG,
            this_is_from_Mimer: true,
          },
        }));
      default:
        return new Promise((RES, REJ) => {
          const mockError = { code: 500, message: 'MockError' };
          REJ(mockError);
        });
    }
  }
}

// ============================================================================================= //
class MockQueue {
  addJobs() {
    if (adp.mockBehavior.adpQueueAddJobs === true) {
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

  getPayload() {
    return new Promise(RES => RES());
  }

  getNextIndex() {
    return new Promise(RES => RES(0));
  }

  addJob() {
    if (adp.mockBehavior.adpQueueAddJob === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}
// ============================================================================================= //

describe('Testing [ adp.mimer.mimerElasticSearchSyncAction ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp = {};
    adp.echoLog = () => {};
    adp.mockBehavior = {
      syncAction: 0,
    };
    adp.queue = new MockQueue();
    adp.mimer = {};
    adp.mimer.MimerElasticSearchSync = MockMimerElasticSearchSync;
    adp.mimer.mimerElasticSearchSyncAction = proxyquire('./mimerElasticSearchSyncAction', {
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case, Mimer Elatic search sync', (done) => {
    adp.mockBehavior.syncAction = 1;
    const mockMSID = '1234';
    const mockMSSLUG = 'sample-ms';
    const mockMSNAME = 'Sample Ms';
    const mockDocument = JSON.stringify({ data: 'data', name: 'name' });
    adp.mimer.mimerElasticSearchSyncAction(mockMSID, mockMSSLUG, mockMSNAME, mockDocument)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        expect(RES.message).toEqual('Document Updated');
        expect(RES.document.this_is_from_Mimer).toEqual(true);
        expect(RES.document.asset_name).toEqual('Sample Ms');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Error case, Mimer Elatic search sync', (done) => {
    adp.mockBehavior.syncAction = 0;
    const mockMSID = '1234';
    const mockMSSLUG = 'sample-ms';
    const mockMSNAME = 'Sample Ms';
    const mockDocument = JSON.stringify({ data: 'data', name: 'name' });
    adp.mimer.mimerElasticSearchSyncAction(mockMSID, mockMSSLUG, mockMSNAME, mockDocument)
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
