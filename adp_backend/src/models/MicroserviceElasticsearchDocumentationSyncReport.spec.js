/**
* Unit test for [ adp.models.MicroserviceElasticsearchDocumentationSyncReport ]
* @author Tirth Pipalia [zpiptir]
*/

describe('Testing [ adp.models.MicroserviceElasticsearchDocumentationSyncReport ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.config = {};
    adp.check = {};

    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = (COLLECTION) => {
      adp.check.createIndexCollection = COLLECTION;
      return {
        createIndex() {
          return true;
        },
      };
    };

    adp.slugIt = SOMETHING => SOMETHING;
    adp.db.create = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.MicroserviceElasticsearchDocumentationSyncReport = require('./MicroserviceElasticsearchDocumentationSyncReport');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('createOne: Should return a promise responding true.', (done) => {
    const syncReportModel = new adp.models.MicroserviceElasticsearchDocumentationSyncReport();
    syncReportModel.createOne({ mockObject: 'mockID' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.createIndexCollection).toBe('microserviceElasticsearchDocumentationSyncReport');
        expect(adp.check.dbName).toBe('microserviceElasticsearchDocumentationSyncReport');
        expect(adp.check.dbID.mockObject).toBe('mockID');
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
