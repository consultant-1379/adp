// ============================================================================================= //
/**
* Unit test for [ adp.egsSync.egsSyncSetup ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

// ============================================================================================= //

class MockRBACClass {
  async processRBAC(previewREQ, res, callback) {
    adp.middleware.RBACClassMockResp.previewREQ = previewREQ;

    return callback({
      rbac: {
        preview: {
          '602e415e01f5f70007a0a950': {
            permission: {
              contents: [{ allowedAssetIDs: [1, 2, 3] }],
            },
          },
        },
      },
    });
  }
}

class MockAdpSetup {
  getSetupByName() {
    if (adp.mockBehavior.getSetupByName) {
      return new Promise(RES => RES(adp.mockBehavior.getSetupByNameResult));
    }
    const error = { errorObject: 'Mocked ' };
    return new Promise((RES, REJ) => REJ(error));
  }
}

describe('Testing [ adp.egsSync.egsSynccheckGroup ] Behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.config = {};
    global.adp.config.baseSiteAddress = 'https://base-address';
    adp.mockBehavior = {
      checkGroup: true,
      getSetupByName: true,
      WordpressMenu: true,
      wpMenuObj: {
        menus:
            [
              {
                items: [
                  {
                    object_id: '1',
                    portal_url: 'MockPortalUrl',
                    object: 'page',
                    slug: 'mockSlugWordpress',
                  },
                ],
              },
            ],
      },
      getSetupByNameResult: {
        docs: [{
          parameters: {
            egsSyncActive: true,
            egsSyncActiveTypes: [
              'article',
              'tutorial',
            ],
            egsSyncServerAddress: 'http://localhost:1080/egsSync/localhost/mockserver',
            egsSyncItemsPerRequest: 10,
            egsSyncMaxBytesSizePerRequest: 204800,
          },
          setup_name: 'egsSync',
        }],
      },
    };

    adp.middleware = {
      RBACClassMockResp: { previewREQ: null },
      RBACClass: MockRBACClass,
    };
    adp.rbac = {
      previewReqMockResp: {
        sourceUser: ['testSig2'], sourceGroup: null, target: [], preview: true, track: true, errorReason: 'ERR',
      },
      previewRequest: () => new Promise((res) => { res(adp.rbac.previewReqMockResp); }),
    };
    adp.wordpress = {};
    adp.wordpress.getMenus = () => {
      if (adp.mockBehavior.WordpressMenu) {
        return new Promise(RES => RES(adp.mockBehavior.wpMenuObj));
      }
      const errorObj = { error: 'MockError' };
      return new Promise((RES, REJ) => REJ(errorObj));
    };
    adp.echoLog = ERRORCODE => ERRORCODE;

    const mockErrorLog = (code, desc, error) => {
      adp.errorLog = { code, desc };
      return { code, desc, error };
    };

    adp.models = {};
    adp.models.AdpSetup = MockAdpSetup;
    adp.egsSync = {};
    adp.egsSync.egsSyncSetup = proxyquire('./egsSyncSetup', {
      './../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case', (done) => {
    adp.egsSync.egsSyncSetup()

      .then((RES) => {
        expect(RES.egsSyncActive).toBeTruthy();
        expect(RES.egsSyncActiveTypes).toBeDefined();
        expect(RES.egsSyncServerAddress).toBeDefined();
        expect(RES.egsSyncItemsPerRequest).toBe(10);
        expect(RES.egsSyncMaxBytesSizePerRequest).toBe(204800);
        expect(RES.rbacAccessPermissions).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Successful case when egsSyncActive is false', (done) => {
    adp.mockBehavior.getSetupByNameResult.docs[0].parameters.egsSyncActive = false;
    adp.egsSync.egsSyncSetup()

      .then((RES) => {
        expect(RES.egsSyncActive).toBeFalsy();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Negative case', (done) => {
    adp.mockBehavior.getSetupByName = false;
    adp.egsSync.egsSyncSetup()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Database Error');
        expect(ERROR.error).toBeDefined();
        done();
      });
  });
});
