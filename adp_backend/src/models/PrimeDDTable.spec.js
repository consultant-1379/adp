/**
* Unit test for [ adp.models.PrimeDDTable ]
* @author Tirth [zpiptir]
*/

describe('Testing [ adp.models.PrimeDDTable ]', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(resolve => resolve(true));
    };

    adp.models = {};
    adp.models.PrimeDDTable = require('./PrimeDDTable');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getAll: Checking the syntax of the query.', (done) => {
    const tagModel = new adp.models.PrimeDDTable();
    tagModel.getAll()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('primeDDTable');
        expect(adp.check.dbSelector).toEqual({});
        expect(adp.check.dbOptions).toEqual({ limit: 999999, skip: 0 });
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
