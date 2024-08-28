/**
 * Unit Test for [ global.adp.microservice.checkId ]
 * @author Omkar Sadegaonkar [zsdgmkr]
 */

describe('Testing [ global.adp.microservice.checkId ], ', () => {
  let errorDb = false;
  let resp = {
    resultsReturned: 1,
  };

  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => true;
    global.adp.models = {};
    global.adp.models.Adp = class Adp {
      constructor() {
        this.dbName = 'dataBase';
      }

      getById() {
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
    global.adp.microservice.checkId = require('./checkId');
    resp = {
      resultsReturned: 1,
    };
    errorDb = false;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getCommitsByAssetForPeriod: Should return a promise responding success.', (done) => {
    global.adp.microservice.checkId('id').then((response) => {
      expect(response).toBeTruthy();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('getCommitsByAssetForPeriod: Should reject promise in case of invalid id.', (done) => {
    resp = {
      resultsReturned: 0,
    };
    global.adp.microservice.checkId('id').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it('getCommitsByAssetForPeriod: Should reject promise in case of db error.', (done) => {
    resp = {
      resultsReturned: 1,
    };
    errorDb = true;
    global.adp.microservice.checkId('id').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });
});
