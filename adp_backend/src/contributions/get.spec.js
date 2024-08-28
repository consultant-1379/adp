/**
 * Unit Test for [ global.adp.contributions.get ]
 * @author Omkar Sadegaonkar [zsdgmkr]
 */

describe('Testing [ global.adp.contributions.get ], ', () => {
  let errorDb = false;
  let errorCheckId = false;
  const resp = {
    docs: [
      {
        commits: 1,
        deletions: 10,
        insertions: 10,
        name: 'Test User 1',
        email: 'test@test.com',
        signum: 'test',
      },
      {
        commits: 3,
        deletions: 40,
        insertions: 50,
        name: 'Test User 1',
        email: 'test@test.com',
        signum: 'test',
      },
      {
        commits: 2,
        deletions: 20,
        insertions: 30,
        name: 'Test User 2',
        email: 'test2@test.com',
        signum: 'test2',
      },
    ],
  };

  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => true;
    global.adp.models = {};
    global.adp.dynamicSort = require('../library/dynamicSort');
    global.adp.models.Gitstatus = class Gitstatus {
      constructor() {
        this.dbName = 'gitStatus';
      }

      getCommitsByAssetForPeriod() {
        return new Promise((resolve, reject) => {
          if (errorDb) {
            reject();
          } else {
            resolve(resp);
          }
          return this.dbName;
        });
      }
    };
    global.adp.microservice = {};
    global.adp.microservice.checkId = () => new Promise((resolve, reject) => {
      if (errorCheckId) {
        reject();
      } else {
        resolve();
      }
    });
    global.adp.contributions = {};
    global.adp.contributions.get = require('./get');
    errorDb = false;
    errorCheckId = false;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getContributors: Should return a promise responding list of contributors.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        users: '100',
      },
    };
    global.adp.contributions.get.getContributors(mockReq).then((response) => {
      expect(response.dateFrom).toBeDefined();
      expect(response.dateTo).toBeDefined();
      expect(response.contributors).toBeDefined();
      expect(response.contributors.length).toEqual(2);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getContributors: Should return a promise responding list of contributors for a week.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        days: 7,
      },
    };
    global.adp.contributions.get.getContributors(mockReq).then((response) => {
      expect(response.dateFrom).toBeDefined();
      expect(response.dateTo).toBeDefined();
      expect(response.contributors).toBeDefined();
      expect(response.contributors.length).toEqual(2);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getContributors: Should return a promise responding list of contributors for a month.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        days: 30,
      },
    };
    global.adp.contributions.get.getContributors(mockReq).then((response) => {
      expect(response.dateFrom).toBeDefined();
      expect(response.dateTo).toBeDefined();
      expect(response.contributors).toBeDefined();
      expect(response.contributors.length).toEqual(2);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getContributors: Should return a promise responding list of contributors for 9 months.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        days: 270,
      },
    };
    global.adp.contributions.get.getContributors(mockReq).then((response) => {
      expect(response.dateFrom).toBeDefined();
      expect(response.dateTo).toBeDefined();
      expect(response.contributors).toBeDefined();
      expect(response.contributors.length).toEqual(2);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getContributors: Should return a promise responding list of contributors for a year.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        days: 270,
      },
    };
    global.adp.contributions.get.getContributors(mockReq).then((response) => {
      expect(response.dateFrom).toBeDefined();
      expect(response.dateTo).toBeDefined();
      expect(response.contributors).toBeDefined();
      expect(response.contributors.length).toEqual(2);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getContributors: Should reject a promise in case of validating ms id.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
      },
    };
    errorCheckId = true;
    global.adp.contributions.get.getContributors(mockReq).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.msg).toEqual('Invalid Microservice ID');
      expect(error.code).toEqual(400);
      done();
    });
  });

  it('getContributors: Should reject a promise in case of db error.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
      },
    };
    errorDb = true;
    global.adp.contributions.get.getContributors(mockReq).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.msg).toEqual('Error while accessing Database');
      expect(error.code).toEqual(500);
      done();
    });
  });

  it('getContributors: Should reject a promise in case of missing query parameters.', (done) => {
    const mockReq = {
      query: {},
    };
    errorDb = true;
    global.adp.contributions.get.getContributors(mockReq).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.msg).toEqual('Microservice id is required');
      expect(error.code).toEqual(400);
      done();
    });
  });

  it('getContributors: Should reject a promise in case of wrong asset id.', (done) => {
    const mockReq = {
      query: {
        asset: 1,
      },
    };
    errorDb = true;
    global.adp.contributions.get.getContributors(mockReq).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.msg).toEqual('Microservice id should be of type String');
      expect(error.code).toEqual(400);
      done();
    });
  });

  it('getContributors: Should reject a promise in case of missing query parameters with invalid days.', (done) => {
    const mockReq = {
      query: {
        asset: 'id',
        days: 2,
      },
    };
    errorDb = true;
    global.adp.contributions.get.getContributors(mockReq).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.msg).toEqual('Invalid value for Days');
      expect(error.code).toEqual(400);
      done();
    });
  });
});
