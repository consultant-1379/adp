/**
* Unit test for [ adp.models.CommentsDL ]
* @author Rinosh Cherian [ zcherin ]
*/

describe('Testing [ adp.models.CommentsDL], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.db = {};
    adp.check = {};
    const mockData = [
      {
        dlName: ['PDLADPFRAM'],
        dlEmail: ['PDLADPFRAM@pdl.internal.ericsson.com'],
        type: 'page',
        active: true,
      },
      {
        dlName: ['PDLADPUNIC'],
        dlEmail: ['PDLADPUNIC@pdl.internal.ericsson.com'],
        type: 'tutorials',
        active: true,
      },
    ];
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(async (resolve) => {
        resolve(mockData);
      });
    };
    adp.models = {};
    adp.models.CommentsDL = require('./CommentsDL');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getCommentsDL: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.CommentsDL();
    adpModel.getCommentsDL()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('commentsDL');
        expect(adp.check.dbSelector).toEqual({});
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
