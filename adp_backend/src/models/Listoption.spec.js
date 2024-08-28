/**
* Unit test for [ adp.models.Listoption ]
* @author Armando Dias [zdiaarm]
*/

describe('Testing [ adp.models.Listoption ], ', () => {
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

    adp.mongoDatabase = {
      collection: (dbName) => {
        adp.check.dbName = dbName;
        return {
          aggregate: (query) => {
            adp.check.dbSelector = query;
            return {
              toArray: (() => Promise.resolve(true)),
            };
          },
        };
      },
    };

    adp.models = {};
    adp.models.Listoption = require('./Listoption');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('index: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.index()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('indexGroups: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.indexGroups()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'group' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('indexItems: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.indexItems()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ type: { $eq: 'item' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getById: Checking the syntax of the query.', async (done) => {
    const listOptionModel = new adp.models.Listoption();
    const testdata = ['test'];
    await listOptionModel.getById(testdata)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({
          _id: { $in: testdata }, deleted: { $exists: false },
        });

        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
      }).catch(() => {
        done.fail();
      });

    await listOptionModel.getById(testdata, true)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: testdata } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
      }).catch(() => {
        done.fail();
      });

    done();
  });


  it('getManyByGroupID: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.getManyByGroupID(['Mock1', 'Mock2'])
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ $or: [{ 'group-id': 'Mock1' }, { 'group-id': 'Mock2' }], deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('getItemsForGroup: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.getItemsForGroup('MockGroupID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ 'group-id': { $eq: 'MockGroupID' }, type: { $eq: 'item' }, deleted: { $exists: false } });
        expect(adp.check.dbOptions).toEqual({ limit: 9999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('createOne: Checking the syntax of the query.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.createOne({ mockObjectToInsert: 'Mock Object' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(adp.check.dbSelector).toEqual({ mockObjectToInsert: 'Mock Object' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('groupItemsByGroupId: Checking the syntax of the query with default param.', (done) => {
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.groupItemsByGroupId()
      .then((response) => {
        const [sortGroup, matchGroup, lookup] = adp.check.dbSelector;
        const { type: matchType, deleted: matchDeleted } = matchGroup.$match;
        const [lookupSort, lookupMatch] = lookup.$lookup.pipeline;

        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(sortGroup).toEqual({ $sort: { order: 1 } });
        expect(matchType).toBe('group');
        expect(matchDeleted.$exists).toBeFalsy();
        expect(lookup.$lookup.from).toEqual('listoption');
        expect(lookup.$lookup.let).toEqual({ groupId: '$group-id' });
        expect(lookupSort).toEqual({ $sort: { order: 1 } });
        expect(lookupMatch.$match.$expr.$and).toEqual(
          [
            { $eq: ['$group-id', '$$groupId'] },
            { $eq: ['$type', 'item'] },
          ],
        );
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('groupItemsByGroupId: Checking the syntax of the query with given array of ids.', (done) => {
    const testArr = ['id1', 'id2'];
    const listOptionModel = new adp.models.Listoption();
    listOptionModel.groupItemsByGroupId(testArr)
      .then((response) => {
        const [sortGroup, matchGroup, lookup] = adp.check.dbSelector;
        const [lookupSort, lookupMatch] = lookup.$lookup.pipeline;

        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('listoption');
        expect(sortGroup).toEqual({ $sort: { order: 1 } });
        expect(matchGroup.$match.$and).toEqual([
          { type: 'group' },
          { _id: { $in: testArr } },
          { deleted: { $exists: false } },
        ]);

        expect(lookup.$lookup.from).toEqual('listoption');
        expect(lookup.$lookup.let).toEqual({ groupId: '$group-id' });
        expect(lookupSort).toEqual({ $sort: { order: 1 } });
        expect(lookupMatch.$match.$expr.$and).toEqual(
          [
            { $eq: ['$group-id', '$$groupId'] },
            { $eq: ['$type', 'item'] },
          ],
        );
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
