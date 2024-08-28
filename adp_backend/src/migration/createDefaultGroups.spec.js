// ============================================================================================= //
/**
* Unit test for [ adp.migration.createDefaultGroups ]
* @author Omkar Sadegaonkar [zsdgmkr], Veerender
*/
// ============================================================================================= //
class MockMongoObjectId {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return `${this.id}`;
  }
}

describe('Testing [ adp.migration.createDefaultGroups ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.MongoObjectID = MockMongoObjectId;
    adp.docs = {};
    adp.docs.list = [];
    adp.dbError = false;
    adp.echoLog = () => true;
    global.adp.config = {};
    adp.mongoDatabase = {};
    adp.mongoDatabase.collection = () => ({
      drop: () => new Promise((RES, REJ) => {
        if (adp.dbError) {
          const errResp = { msg: 'DB Error' };
          REJ(errResp);
          return;
        }
        const obj = [
          { name: 'Default Group' },
        ];
        RES({ docs: obj });
      }),
      insertOne: () => new Promise((RES, REJ) => {
        if (adp.dbError) {
          REJ();
          return;
        }
        RES({});
      }),
    });
    adp.mongoDatabase.createCollection = () => (new Promise((RES) => {
      RES();
    }));
    adp.migration = {};
    adp.migration.createDefaultGroups = require('./createDefaultGroups');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should add default group to user object.', (done) => {
    const obj = {
      name: 'mockValidTest',
    };
    adp.migration.createDefaultGroups(obj)
      .then(() => {
        expect(true).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should failed due to db error.', (done) => {
    const obj = {
      name: 'mockValidTest',
    };
    adp.dbError = true;
    adp.migration.createDefaultGroups(obj)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
