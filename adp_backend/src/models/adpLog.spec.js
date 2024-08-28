/**
* Unit test for [ adp.models.AdpLog ]
* @author Cein [edaccei]
*/

describe('Testing [ adp.models.AdpLog ], ', () => {
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
    adp.models.AdpLog = require('./AdpLog');
  });

  afterEach(() => {
    global.adp = null;
  });


  it('createOne: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.createOne({ json: true })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adplog');
        expect(adp.check.dbSelector).toEqual({ json: true });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLogByID: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getLogByID('mockUniqueID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adplog');
        expect(adp.check.dbSelector._id).toEqual('mockUniqueID');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLogs: Checking the syntax as MongoDB ( Admin Behavior ).', (done) => {
    adp.config.defaultDB = 'couchDB';
    const adpModel = new adp.models.AdpLog();
    adpModel.getLogs('mockSignum', 'mockType', 'mockAssetID', 10, 0, true)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adplog');
        expect(adp.check.dbSelector.type).toEqual('mockType');
        expect(adp.check.dbSelector.new._id).toEqual('mockAssetID');
        expect(adp.check.dbSelector.signum).toEqual('mockSignum');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLogs: Checking the syntax as MongoDB ( User Behavior ).', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getLogs('mockSignum', 'mockType', 'mockAssetID', 10, 0, false)
      .then((response) => {
        const short1 = adp.check.dbSelector.$or[0];
        const short2 = adp.check.dbSelector.$or[1];
        const short2A = short2.new.team.$elemMatch.$and[0];
        const short2B = short2.new.team.$elemMatch.$and[1];

        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adplog');
        expect(adp.check.dbSelector.type).toEqual('mockType');
        expect(adp.check.dbSelector.new._id).toEqual('mockAssetID');
        expect(short1.signum).toEqual('mockSignum');
        expect(short2A.signum).toEqual('mockSignum');
        expect(short2B.serviceOwner).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLogs: Checking the syntax as MongoDB ( Admin Behavior, No Optional Parameters ).', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getLogs(null, null, null, 10, 0, true)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('adplog');
        expect(adp.check.dbSelector.datetime.$gte).toEqual(0);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getLogs: Checking the syntax as MongoDB ( User Behavior, No Optional Parameters ).', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getLogs(null, null, null, 10, 0, false)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('index: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getNewOrUpdateByID: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getNewOrUpdateByID('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        expect(adp.check.dbSelector).toEqual({
          type: 'microservice',
          'new._id': 'MockID',
          deleted: { $exists: false },
          $or: [{ desc: 'new' }, { desc: 'update' }],
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllNew: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getAllNew()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbSelector).toEqual({ desc: { $eq: 'new' } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAllContributorsStatistics: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getAllContributorsStatistics()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'gerritContributorsStatistics' } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getContributorsStatisticsByModeID: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getContributorsStatisticsByModeID('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'gerritContributorsStatistics' }, $or: [{ mode: 'all' }, { mode: 'MockID' }], deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getAssetHistory: Should return a promise responding true.', (done) => {
    const adpModel = new adp.models.AdpLog();
    adpModel.getAssetHistory('MockID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toBe('adplog');
        expect(adp.check.dbSelector).toEqual({ $and: [{ type: { $eq: 'microservice' } }, { 'new._id': { $eq: 'MockID' } }] });
        expect(adp.check.dbOptions).toEqual({ limit: 99999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
