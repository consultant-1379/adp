/**
* Unit test for [ adp.models.Complianceoption ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Complianceoption ], ', () => {
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
    adp.models.Complianceoption = require('./Complianceoption');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const complianceOptionModel = new adp.models.Complianceoption();
    complianceOptionModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('complianceoption');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getByType: Checking the syntax of the query.', (done) => {
    const complianceOptionModel = new adp.models.Complianceoption();
    complianceOptionModel.getByType('mockTest')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('complianceoption');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'mockTest' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getFieldByGroupID: Checking the syntax of the query.', (done) => {
    const complianceOptionModel = new adp.models.Complianceoption();
    complianceOptionModel.getFieldByGroupID('mockGroupID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('complianceoption');
        expect(adp.check.dbSelector).toEqual({ 'group-id': { $eq: 'mockGroupID' }, type: { $eq: 'field' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Checking the syntax of the query.', (done) => {
    const complianceOptionModel = new adp.models.Complianceoption();
    complianceOptionModel.createOne({ mockObjectToInsert: 'Mock Object' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('complianceoption');
        expect(adp.check.dbSelector).toEqual({ mockObjectToInsert: 'Mock Object' });
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
