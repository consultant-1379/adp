/**
* Unit test for [ adp.models.InnersourceUserHistory ]
* @author Veerender Voskula[zvosvee]
*/

describe('Testing [ adp.models.InnersourceUserHistory ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.check = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.models = {};
    adp.models.InnersourceUserHistory = require('./InnersourceUserHistory');
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
  });

  afterEach(() => {
    global.adp = null;
  });


  it('getUserSnapshot with signum and snapshot_date : Should return a promise responding true', (done) => {
    const adpModel = new adp.models.InnersourceUserHistory();
    adpModel.getUserSnapshot('esupuse', '2021-01-23')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('innersourceuserhistory');
        expect(adp.check.dbSelector[0].$match.$and[0].signum.$eq).toBe('esupuse');
        expect(adp.check.dbSelector[0].$match.$and[1].snapshot_date.$lte).toBeDefined();
        expect(adp.check.dbOptions).toBeUndefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getUserSnapshot with signum and snapshot_date as latest: Should return a promise responding true', (done) => {
    const adpModel = new adp.models.InnersourceUserHistory();
    adpModel.getUserSnapshot('espuse', 'latest')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('innersourceuserhistory');
        expect(adp.check.dbOptions).toBeUndefined();
        expect(adp.check.dbSelector[0].$match.$and.length).toBe(1);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getUserSnapshot with signum and no snapshot_date: Should return a promise responding true', (done) => {
    const adpModel = new adp.models.InnersourceUserHistory();
    adpModel.getUserSnapshot('espuse')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('innersourceuserhistory');
        expect(adp.check.dbOptions).toBeUndefined();
        expect(adp.check.dbSelector[0].$match.$and.length).toBe(1);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('createUserSnapshot: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.InnersourceUserHistory();

    adpModel.createUserSnapshot('espuse', 'Super User', 'super@test.com', 'test org')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('innersourceuserhistory');
        expect(adp.check.dbID.signum).toBe('espuse');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
