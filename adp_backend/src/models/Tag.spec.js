/**
* Unit test for [ adp.models.Tag ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Tag ], ', () => {
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
    adp.models.Tag = require('./Tag');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const tagModel = new adp.models.Tag();
    tagModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('tag');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexGroups: Checking the syntax of the query.', (done) => {
    const tagModel = new adp.models.Tag();
    tagModel.indexGroups()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('tag');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'group' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexTags: Checking the syntax of the query.', (done) => {
    const tagModel = new adp.models.Tag();
    tagModel.indexTags()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('tag');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'tag' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByName: Checking the syntax of the query.', (done) => {
    const tagModel = new adp.models.Tag();
    tagModel.getByName('MockTagName')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('tag');
        expect(adp.check.dbSelector).toEqual({ tag: { $eq: 'MockTagName' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const tagModel = new adp.models.Tag();
    tagModel.createOne('mockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('tag');
        expect(adp.check.dbID).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
