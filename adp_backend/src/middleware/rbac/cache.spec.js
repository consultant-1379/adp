/**
 * Unit tests for the RBAC permissions cache middleware
 *
 * @author Michael Coughlan [zmiccou]
 */
class MockAnswersClass {
  constructor() {
    this.templateJSON = {
      code: 200,
      page: 0,
      limit: 50,
      total: 0,
      time: 0,
      size: 0,
      cache: '',
      message: '',
      warning: '',
      data: [],
    };
  }

  setCode(N) {
    this.templateJSON.code = N;
  }

  setCache(S) {
    this.templateJSON.cache = S;
  }

  setMessage(S) {
    this.templateJSON.message = S;
  }

  setTime(N) {
    this.templateJSON.time = N;
  }

  getCode() {
    return this.templateJSON.code;
  }

  getAnswer() {
    if (!Array.isArray(this.templateJSON.warning)) {
      delete this.templateJSON.warning;
    } else if (this.templateJSON.warning.length === 0) {
      delete this.templateJSON.warning;
    }
    return JSON.stringify(this.templateJSON);
  }
}

class MockEchoLog {
  createOne() {
    return new Promise(RES => RES());
  }
}

describe('Testing the behaviour of [ adp.middleware.rbac.cache ]', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    global.mockExpect = {};
    global.mockExpect.endResult = {};

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.masterCacheTimeOut = {};
    adp.masterCacheTimeOut.rbacPermissionIds = 60;

    adp.middleware = {};

    adp.setHeaders = RES => RES;
    adp.Answers = MockAnswersClass;

    adp.masterCache = {};
    adp.masterCache.mock = {};
    adp.masterCache.mock.isCacheAvailable = false;
    adp.masterCache.get = () => {
      if (!adp.masterCache.mock.isCacheAvailable) {
        return Promise.reject();
      }

      return Promise.resolve({
        epesuse: {
          admin: false,
          allowed: {
            assets: ['12', '34'],
            contents: ['56', '78'],
          },
          timerMS: 502,
        },
      });
    };
    adp.masterCache.set = () => {};
  });

  it('should throw an error if the user object isn\'t in the request', (done) => {
    adp.middleware.rbac = () => {};
    adp.middleware.rbac.cache = require('./cache');

    const res = {
      end(answer) {
        global.mockExpect.endResult = JSON.parse(answer);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.limit).toEqual(50);
        expect(global.mockExpect.endResult.total).toEqual(0);
        expect(global.mockExpect.endResult.message).toEqual('500 - Error occurred as the user is not defined');
        expect(global.mockExpect.endResult.data.length).toEqual(0);

        done();
      },
    };

    adp.middleware.rbac.cache({}, res, null);
  });

  it('should get the cache if the correct information is provided in the request', (done) => {
    adp.middleware.rbac = () => {};
    adp.middleware.rbac.cache = require('./cache');

    const request = {
      user: {
        docs: [{
          signum: 'testUser',
        }],
      },
    };

    adp.masterCache.mock.isCacheAvailable = true;

    const next = () => {
      expect(request.userSignum).toBe('testUser');
      expect(request.rbac).toEqual({
        epesuse: {
          admin: false,
          allowed: {
            assets: ['12', '34'],
            contents: ['56', '78'],
          },
          timerMS: 502,
        },
      });

      done();
    };

    adp.middleware.rbac.cache(request, {}, next);
  });

  it('should set the cache for the user', (done) => {
    adp.middleware.rbac = (request, response, rbacNext) => {
      expect(response).toEqual({});
      expect(request.userSignum).toBe('adminUser');
      rbacNext();
    };

    adp.middleware.rbac.cache = require('./cache');

    const req = {
      user: {
        docs: [{
          signum: 'adminUser',
        }],
      },
      rbac: {
        regularUser: {
          admin: false,
          allowed: {
            contents: ['1234', '5667', '9'],
          },
        },
      },
    };

    const next = () => done();

    adp.middleware.rbac.cache(req, {}, next);
  });
});
