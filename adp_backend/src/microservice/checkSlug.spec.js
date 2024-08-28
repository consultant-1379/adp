/**
 * Unit Test for [ global.adp.microservice.checkSlug ]
 * @author Omkar Sadegaonkar [zsdgmkr]
 */

describe('Testing [ global.adp.microservice.checkSlug ], ', () => {
  let errorDb = false;
  let resp = {
    resultsReturned: 1,
  };

  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => true;
    adp.models = {};
    adp.models.Adp = class Adp {
      constructor() {
        this.dbName = 'dataBase';
      }

      getByMSSlug() {
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
    adp.microservice = {};
    adp.microservice.checkSlug = require('./checkSlug');
    resp = {
      resultsReturned: 1,
    };
    errorDb = false;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return a promise responding success if slug is valid.', (done) => {
    global.adp.microservice.checkSlug('slug').then((response) => {
      expect(response).toBeTruthy();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done.fail();
    });
  });

  it('Should reject promise in case of invalid slug.', (done) => {
    resp = {
      resultsReturned: 0,
    };
    global.adp.microservice.checkSlug('slug').then(() => {
      expect(false).toBeTruthy();
      done.fail();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });

  it('Should reject promise in case of db error.', (done) => {
    resp = {
      resultsReturned: 1,
    };
    errorDb = true;
    global.adp.microservice.checkSlug('id').then(() => {
      expect(false).toBeTruthy();
      done.fail();
    }).catch(() => {
      expect(true).toBeTruthy();
      done();
    });
  });
});
