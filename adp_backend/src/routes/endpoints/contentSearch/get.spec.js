// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.contentSearch.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.endpoints.contentSearch.get ] ', () => {
  // =========================================================================================== //


  class MockESearchClass {
    search(KEYWORD, PERMISSION, TYPE, SKIP, SIZE, HIGHLIGHTSIZE) {
      global.mockExpect.keyword = KEYWORD;
      global.mockExpect.permission = PERMISSION;
      global.mockExpect.type = TYPE;
      global.mockExpect.skip = SKIP;
      global.mockExpect.size = SIZE;
      global.mockExpect.highlightSize = HIGHLIGHTSIZE;
      const result = require('./get.spec.json');
      return new Promise((RES, REJ) => {
        if (global.mockBehavior.contentSearchESearchClass === true) {
          RES({ result });
          return;
        }
        const mockError = 'mockError';
        REJ(mockError);
      });
    }
  }


  class MockEchoLog {
    createOne() {
      return new Promise(RES => RES());
    }
  }


  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.contentSearchESearchClass = true;

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.setHeaders = RES => RES;

    adp.contentSearch = {};
    adp.contentSearch.ESearchClass = MockESearchClass;
    adp.Answers = require('./../../../answers/AnswerClass');
    adp.getSizeInMemory = () => 1;

    adp.endpoints = {};
    adp.endpoints.contentSearch = {};
    adp.endpoints.contentSearch.get = require('./get');
  });


  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case with admin user only with search keyword.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
      },
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

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('all');
        expect(global.mockExpect.permission).toEqual([]);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case with admin user without type parameter', (done) => {
    const req = {
      query: {
        keyword: 'ADPs',
        pagesize: 20,
        page: 1,
      },
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

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADPs');
        expect(global.mockExpect.type).toEqual('all');
        expect(global.mockExpect.permission).toEqual([]);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case with admin user with type not equal to default all.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
        type: 'tutorials',
      },
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

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('tutorials');
        expect(global.mockExpect.permission).toEqual([]);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case with admin user with type equal to microservice.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
        type: 'assets',
      },
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

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('assets');
        expect(global.mockExpect.permission).toEqual([]);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case for test user with only search keyword.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
      },
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['3365', '3570', '3630', '9463'],
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
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('all');
        expect(global.mockExpect.permission).toEqual(['3365', '3570', '3630', '9463', '17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e5011e0p']);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case for test user without type parameter', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
      },
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['3365', '3570', '3630', '9463'],
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
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('all');
        expect(global.mockExpect.permission).toEqual(['3365', '3570', '3630', '9463', '17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e5011e0p']);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case for test user with type parameter as page', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
        type: 'page',
      },
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['3365', '3570', '3630', '9463'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('page');
        expect(global.mockExpect.permission).toEqual(['3365', '3570', '3630', '9463']);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Successful case for test user with type parameter as microservice', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
        type: 'assets',
      },
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            assets: ['asfd', 'lushd', 'sdfhu'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.limit).toEqual(20);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(20);
        expect(global.mockExpect.keyword).toEqual('ADP');
        expect(global.mockExpect.type).toEqual('assets');
        expect(global.mockExpect.permission).toEqual(['asfd', 'lushd', 'sdfhu']);
        expect(global.mockExpect.skip).toEqual(0);
        expect(global.mockExpect.size).toEqual(20);
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });


  it('Negative case if is missing user request signum from RBAC.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['3365', '3570', '3630', '9463'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - Unexpected Error');
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });


  it('Negative case if a regular user doesn`t have RBAC Object.', (done) => {
    const req = {
      query: {
        keyword: 'ADP',
        pagesize: 20,
        page: 1,
      },
      userRequest: {
        signum: 'etest',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(403);
        expect(global.mockExpect.endResult.message).toEqual('403 forbidden');
        done();
      },
    };
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  it('Negative case if [ contentSearch.search @ adp.contentSearch.ESearchClass ] break.', (done) => {
    const req = {
      query: {},
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: ['3365', '3570', '3630', '9463'],
            assets: ['uey', 'shd', 'jd'],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - Unexpected Error');
        done();
      },
    };
    global.mockBehavior.contentSearchESearchClass = false;
    adp.endpoints.contentSearch.get(req, res);
    done();
  });

  // =========================================================================================== //
});
