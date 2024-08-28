/**
* Unit test for [ adp.models.Migrationscripts ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Migrationscripts ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};
    adp.db.create = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
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
    adp.models.Migrationscripts = require('./Migrationscripts');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const migrationModel = new adp.models.Migrationscripts();
    migrationModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('migrationscripts');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByName: Checking the syntax of the query.', (done) => {
    const migrationModel = new adp.models.Migrationscripts();
    migrationModel.getByName('Mock Name')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('migrationscripts');
        expect(adp.check.dbSelector).toEqual({ commandName: { $eq: 'Mock Name' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 1, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Checking the syntax of the query.', (done) => {
    const migrationModel = new adp.models.Migrationscripts();
    migrationModel.createOne({ id: 'MockID' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('migrationscripts');
        expect(adp.check.dbSelector).toEqual({ id: 'MockID' });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('update: Checking the syntax of the query.', (done) => {
    const migrationModel = new adp.models.Migrationscripts();
    migrationModel.update({ id: 'MockID' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('migrationscripts');
        expect(adp.check.dbID).toEqual({ id: 'MockID' });
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
