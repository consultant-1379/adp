/**
 * Unit Tests for the realtime-contentsearch GET endpoint
 *
 * @author Michael Coughlan [zmiccou] | Ravikiran G [zgarsri]
 */
class MockESearchClass {
  realtimesearch(keyword, permission) {
    global.mockExpect.keyword = keyword;
    global.mockExpect.permission = permission;

    const result = require('./get.spec.json');

    return new Promise((resolve, reject) => {
      if (global.mockBehavior.contentSearchESearchClass === true) {
        resolve({ result });
        return;
      }

      const mockError = 'mockError';
      reject(mockError);
    });
  }
}

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

  setData(O) {
    this.templateJSON.data = O;
  }

  setLimit(N) {
    this.templateJSON.limit = N;
  }

  setMessage(S) {
    this.templateJSON.message = S;
  }

  setPage(N) {
    this.templateJSON.page = N;
  }

  setSize(N) {
    this.templateJSON.size = N;
  }

  setTime(N) {
    this.templateJSON.time = N;
  }

  setTotal(N) {
    this.templateJSON.total = N;
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

describe('Testing the behaviour of [ adp.endpoints.realtimeContentSearch.get ]', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    adp.config = {};

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.Answers = MockAnswersClass;
    adp.setHeaders = res => res;
    adp.getSizeInMemory = () => 1;

    adp.contentSearch = {};
    adp.contentSearch.ESearchClass = MockESearchClass;

    adp.endpoints = {};
    adp.endpoints.realtimeContentSearch = {};
    adp.endpoints.realtimeContentSearch.get = require('./get');

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.contentSearchESearchClass = true;

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    adp.masterCache = {};
    adp.masterCache.set = () => {};

    adp.masterCacheTimeOut = {};
    adp.masterCacheTimeOut.rbacPermissionIds = 60;
  });

  it('should throw an error if no signum is provided', (done) => {
    const response = {
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

    adp.endpoints.realtimeContentSearch.get({}, response);
  });

  it('should throw a 403 error if there are no permissions attached to this user', (done) => {
    const req = {
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: false,
          allowed: {
            contents: null,
          },
        },
      },
    };

    const res = {
      end(answer) {
        global.mockExpect.endResult = JSON.parse(answer);

        expect(global.mockExpect.endResult.code).toEqual(403);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.limit).toEqual(50);
        expect(global.mockExpect.endResult.total).toEqual(0);
        expect(global.mockExpect.endResult.message).toEqual('403 forbidden');
        expect(global.mockExpect.endResult.data.length).toEqual(0);

        done();
      },
    };

    adp.endpoints.realtimeContentSearch.get(req, res);
  });

  it('should successfully return results as an admin after searching', (done) => {
    const req = {
      query: {
        keyword: 'adp',
      },
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: true,
        },
      },
    };

    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(2);
        expect(global.mockExpect.endResult.data[0].filteredArray.length).toEqual(5);
        expect(global.mockExpect.endResult.data[1].filteredArray.length).toEqual(5);
        expect(global.mockExpect.keyword).toEqual('adp');
        expect(global.mockExpect.permission).toEqual([]);
        done();
      },
    };

    adp.endpoints.realtimeContentSearch.get(req, res);
  });

  it('should successfully return results as a regular user', (done) => {
    const req = {
      query: {
        keyword: 'adp',
      },
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: false,
          allowed: {
            contents: ['123', '456', '789'],
            assets: [
              '17e57f6cea1b5a673f8775e6cf023344',
              '45e7f4f992afe7bbb62a3391e500e71b',
              '45e7f4f992afe7bbb62a3391e5011e0p'],
          },
        },
      },
    };

    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.keyword).toEqual('adp');
        expect(global.mockExpect.permission).toEqual(['123', '456', '789', '17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e5011e0p']);
        done();
      },
    };

    adp.endpoints.realtimeContentSearch.get(req, res);
  });

  it('should return a 200 status code when no keyword is provided', (done) => {
    const request = {
      query: {},
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: true,
        },
      },
    };

    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(200);
        done();
      },
    };

    adp.endpoints.realtimeContentSearch.get(request, res);
  });

  it('should return an error if something breaks during the search', (done) => {
    const request = {
      query: {
        keyword: 'test',
      },
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: true,
        },
      },
    };

    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - An error occurred during the realtime search request');
        done();
      },
    };

    global.mockBehavior.contentSearchESearchClass = false;
    adp.endpoints.realtimeContentSearch.get(request, res);
  });

  it('should return an error if something breaks during the search for regular user', (done) => {
    const request = {
      query: {
        keyword: 'test',
      },
      userSignum: 'testUser',
      rbac: {
        testUser: {
          admin: false,
          allowed: {
            contents: ['123', '456', '789'],
            assets: [
              '17e57f6cea1b5a673f8775e6cf023344',
              '45e7f4f992afe7bbb62a3391e500e71b',
              '45e7f4f992afe7bbb62a3391e5011e0p'],
          },
        },
      },
    };

    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - An error occurred during the realtime search request');
        done();
      },
    };

    global.mockBehavior.contentSearchESearchClass = false;
    adp.endpoints.realtimeContentSearch.get(request, res);
  });
});
