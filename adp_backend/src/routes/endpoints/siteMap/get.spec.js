// ============================================================================================= //
/**
* Unit test for [ adp.routes.endpoints.siteMap.get ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.routes.endpoints.siteMap.get ] ', () => {
  // =========================================================================================== //
  class MockEchoLog {
    createOne() {
      return new Promise(RES => RES());
    }
  }

  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    global.mockExpect = {};
    global.mockExpect.endResult = {};

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];
    adp.setHeaders = RES => RES;
    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    adp.Answers = {};
    adp.Answers.answerWith = (errorCode, RES, TIMER, errorText, siteMap) => {
      const messageObject = {
        code: errorCode,
        message: errorText,
        data: siteMap,
      };
      RES.end(JSON.stringify(messageObject));
    };

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    adp.wordpress = {};
    adp.wordpress.mockMenus = require('./get.spec.json');
    adp.wordpress.behavior = 0;
    adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
      if (adp.wordpress.behavior === 0) {
        RES(adp.wordpress.mockMenus);
      } else {
        const mockError = 'Mock Error';
        REJ(mockError);
      }
    });
    adp.getSizeInMemory = () => 1;
    adp.routes = {};
    adp.routes.endpoints = {};
    adp.routes.endpoints.siteMap = {};
    adp.routes.endpoints.siteMap.get = require('./get');
  });


  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case with admin user.', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: true,
          allowed: {
            contents: [],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.message).toEqual('From Wordpress');
        expect(global.mockExpect.endResult.data.length).toEqual(11);
        done();
      },
    };
    adp.routes.endpoints.siteMap.get(req, res);
  });

  it('Successful case when user is not admin.', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: [],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.message).toEqual('From Wordpress');
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.data.length).toEqual(0);
        done();
      },
    };
    adp.routes.endpoints.siteMap.get(req, res);
  });

  it('Successful case when user is not admin and RBAC content permissionare respected', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['91', '3346', '3344'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.message).toEqual('From Wordpress');
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.data.length).toEqual(1);
        done();
      },
    };
    adp.routes.endpoints.siteMap.get(req, res);
  });

  it('Successful case when user is not admin and RBAC content permissionare respected for category->category->page', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['91', '3346', '3344', '130', '139', '10044', '9990'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.message).toEqual('From Wordpress');
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.data.length).toEqual(2);
        done();
      },
    };
    adp.routes.endpoints.siteMap.get(req, res);
  });

  it('Negative case where adp.wordpress.getMenus() sents error', (done) => {
    adp.wordpress.behavior = 1;
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: true,
          allowed: {
            contents: [],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.message).toEqual('Unexpected Error occurred while Getting Menus');
        expect(global.mockExpect.endResult.code).toEqual(500);
        done();
      },
    };
    adp.routes.endpoints.siteMap.get(req, res);
  });
});
