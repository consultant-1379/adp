// ============================================================================================= //
/**
* Unit test for [ adp.db.find ]
* @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    return ({
      find: ((QUERY, PROJECTION) => {
        adp.mock.query = QUERY;
        adp.mock.projection = PROJECTION;
        return ({
          project: () => ({
            sort: () => ({
              skip: () => ({
                limit: () => ({
                  toArray: () => new Promise((res, rej) => {
                    if (adp.mongoBehaviorCrash === true) {
                      const mockError = 'Mock Error';
                      return rej(mockError);
                    }
                    if (adp.mongoBehaviorResponse === false) {
                      return res({});
                    }
                    const result = [
                      {
                        _id: '17e57f6cea1b5a673f8775e6cf023344',
                        approval: 'approved',
                        owner: 'esupuse',
                        name: 'Mock Document',
                        description: 'Mock Document Description',
                        inval_secret: 'abcdef',
                      },
                    ];
                    return res(result);
                  }),
                }),
              }),
            }),
          }),
        });
      }),
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.db.find ] ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mock = {};
    adp.mongoBehaviorResponse = true;
    adp.mongoBehaviorCrash = false;
    adp.mongoDatabase = new MockMongoObject();
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.config = {};
    adp.db = {};
    adp.db.checkID = (COL, OBJ) => OBJ;
    adp.db.find = require('./find');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('behavior in a successful case.', (done) => {
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    adp.db.find('dataBase', testJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('behavior if the QUERY is not an Object.', (done) => {
    const testJSON = true;
    adp.db.find('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch((errorArray) => {
        expect(Array.isArray(errorArray)).toBeTruthy();
        done();
      });
  });


  it('behavior if [ adp.mongoDatabase.collection().find().skip().limit().toArray() ] crashes.', (done) => {
    adp.mongoBehaviorCrash = true;
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    adp.db.find('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('behavior if [ adp.mongoDatabase.collection().find().skip().limit().toArray() ] not result in an Array.', (done) => {
    adp.mongoBehaviorResponse = false;
    const testJSON = {
      type: 'test',
      desc: 'This is only a test.',
      keepGoing: true,
    };
    adp.db.find('dataBase', testJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
