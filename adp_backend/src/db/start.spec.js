// ============================================================================================= //
/**
* Unit test for [ adp.db.start ]
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
class MockMongoObject {
  constructor() {
    this.ObjectID = 'Object ID Loaded';
    this.client = {
      db() {
        return new Promise(RES => RES(true));
      },
    };
  }

  connect() {
    return new Promise((RES, REJ) => {
      if (adp.db.mockConnectBehavior_InvalidResponse === true) {
        RES(false);
        return;
      }
      if (adp.db.mockConnectBehavior_ShouldCrash === true) {
        const mockError = 'Mock Error';
        REJ(mockError);
        return;
      }
      RES(true);
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.start ] behavior', () => {
  beforeAll(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.config = {};
    adp.echoLog = () => true;
    adp.timeStepNext = () => true;
    adp.db = {};
    adp.db.mockConnectBehavior_InvalidResponse = false;
    adp.db.mockConnectBehavior_ShouldCrash = false;
    adp.db.Mongo = MockMongoObject;
    adp.db.start = require('./start');
  });

  afterAll(() => {
    global.adp = null;
  });

  it('in a successful case.', (done) => {
    adp.db.start()
      .then(() => {
        expect(adp.MongoObjectID).toBe('Object ID Loaded');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('if [ adp.mongoConnection.connect() ] crashes.', (done) => {
    adp.db.mockConnectBehavior_ShouldCrash = true;
    adp.db.start()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('if [ adp.mongoConnection.connect() ] returns an invalid response.', (done) => {
    adp.db.mockConnectBehavior_InvalidResponse = true;
    adp.db.start()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
