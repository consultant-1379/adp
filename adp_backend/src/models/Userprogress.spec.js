/**
* Unit test for [ adp.models.Userprogress ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Userprogress ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};
    adp.db.create = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(resolve => resolve(true));
    };
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.destroy = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.update = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.Userprogress = require('./Userprogress');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('userprogress');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllProgress: Checking the syntax of the query.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.getAllProgress()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('userprogress');
        expect(adp.check.dbSelector).toEqual({ $and: [{ type: { $eq: 'progress' } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllProgressFromThisUser: Checking the syntax of the query.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.getAllProgressFromThisUser('MockSignum')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('userprogress');
        expect(adp.check.dbSelector).toEqual({ $and: [{ signum: { $eq: 'MockSignum' } }, { type: { $eq: 'progress' } }, { deleted: { $exists: false } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getTheProgressFromThisUserAndThisPage: Checking the syntax of the query.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.getTheProgressFromThisUserAndThisPage('MockSignum', 'MockWID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('userprogress');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        expect(adp.check.dbSelector).toEqual({
          signum: { $eq: 'MockSignum' },
          wid: { $eq: 'MockWID' },
          type: { $eq: 'progress' },
          deleted: { $exists: false },
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getBySignumAndWordpressID: Checking the syntax of the query.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.getBySignumAndWordpressID('MockSignum', 'MockWID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('userprogress');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        expect(adp.check.dbSelector).toEqual({
          signum: { $eq: 'MockSignum' },
          wid: { $eq: 'MockWID' },
          type: { $eq: 'progress' },
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('deleteOne: Should return a promise responding true.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.deleteOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('userprogress');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('updateOne: Should return a promise responding true.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.updateOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('userprogress');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const userprogressModel = new adp.models.Userprogress();
    userprogressModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('userprogress');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
