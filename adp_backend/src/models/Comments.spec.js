/**
* Unit test for [ adp.models.Comments ]
* @author Vivek [ZMVIUKV]
*/

describe('Testing [ adp.models.Comments], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.db = {};
    adp.check = {};
    const mockData = [
      {
        _id: 'mock_commentID',
        location_id: 'mock_locationID',
        location_page: 'h1-the-framework',
        location_type: 'article',
        location_ms: {
          ms_id: '3346',
          ms_page: null,
        },
        dt_create: '2023-09-05T11:41:01.544Z',
        dt_last_update: '2023-09-05T11:41:01.544Z',
        signum: 'mock_SIGNUM',
        nm_author: 'Mock User',
        nm_email: 'mock-user@adp-test.com',
        desc_comment: 'sample comment 1',
      },
      {
        _id: '64f7222d1da044092c9a7849',
        location_id: 'mock_locationID',
        location_page: 'h1-micro-services',
        location_type: 'article',
        location_ms: {
          ms_id: '3346',
          ms_page: null,
        },
        dt_create: '2023-09-05T12:42:21.675Z',
        dt_last_update: '2023-09-05T12:42:21.675Z',
        signum: 'testsignum',
        nm_author: 'Test User',
        nm_email: 'test-user@adp-test.com',
        desc_comment: 'test sample comment',
      },
    ];
    adp.db.create = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise(async (resolve, reject) => {
        if (adp.check.dbSelector.location_id) {
          const result = mockData.filter(
            data => data.location_id === adp.check.dbSelector.location_id.$eq,
          );
          resolve(result);
        } else if (adp.check.dbSelector._id) {
          const result = mockData.filter(data => data._id === adp.check.dbSelector._id);
          resolve({ docs: result });
        } else {
          reject();
        }
      });
    };
    adp.models = {};
    adp.models.Comments = require('./Comments');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('createComment: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.createComment({ json: true })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector).toEqual({ json: true });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getCommentsByLocationID: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.getCommentsByLocationID('mock_locationID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector).toEqual({
          location_id: { $eq: 'mock_locationID' },
          deleted: { $exists: false },
        });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getCommentsByCommentID: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.getCommentsByCommentID('mock_commentID')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector).toEqual({ _id: 'mock_commentID' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateComment: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.updateComment('mock_commentID', 'mock_description', 'mock_SIGNUM')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteComment: Checking the syntax as MongoDB.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.deleteComment('mock_commentID', 'mock_SIGNUM')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateComment: Increasing code coverage for invalid signum.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.updateComment('mock_commentID', 'mock_description', 'mock_SIGNUM1')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateComment: Increasing code coverage for invalid comment ID.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.updateComment('mock_commentID1', 'mock_description', 'mock_SIGNUM')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID1');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteComment: Increasing code coverage for invalid signum.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.deleteComment('mock_commentID', 'mock_SIGNUM1')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteComment: Increasing code coverage for invalid comment ID.', (done) => {
    const adpModel = new adp.models.Comments();
    adpModel.deleteComment('mock_commentID1', 'mock_SIGNUM1')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID1');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('resolveComment: Successful case test.', (done) => {
    const adpModel = new adp.models.Comments();
    const user = { signum: 'mock_SIGNUM', name: 'mock_NAME', email: 'mock_EMAIL' };
    adpModel.resolveComment('mock_commentID', 'mock_desc', user)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID');
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('resolveComment: Negative case, if Comment id is invalid.', (done) => {
    const adpModel = new adp.models.Comments();
    const user = { signum: 'mock_SIGNUM', name: 'mock_NAME', email: 'mock_EMAIL' };
    adpModel.resolveComment('mock_commentID1', 'mock_desc', user)
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('comments');
        expect(adp.check.dbSelector._id).toEqual('mock_commentID1');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
