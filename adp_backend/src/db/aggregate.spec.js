// ============================================================================================= //
/**
* Unit test for [ global.adp.db.aggregate ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockMongoObject {
  collection(COL) {
    this.collection = COL;
    const obj = {
      aggregate(STEPS, OPTIONS, CALLBACK) {
        this.steps = STEPS;
        CALLBACK(adp.mockError, adp.mockDocs);
      },
    };
    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ global.adp.db.aggregate ] ', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.mongoDatabase = new MockMongoObject();
    adp.mockError = null;
    adp.mockDocs = [
      { _id: 1, name: 'Mock1', mockDocument: true },
      { _id: 2, name: 'Mock2', mockDocument: true },
      { _id: 3, name: 'Mock3', mockDocument: true },
    ];
    global.adp.db = {};
    global.adp.db.aggregate = require('./aggregate');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Behavior if COLLECTION parameter is not a String', (done) => {
    adp.db.aggregate(null, null)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(Array.isArray(ERROR)).toBeTruthy();
        done();
      });
  });


  it('Behavior if COLLECTION parameter is an empty String', (done) => {
    adp.db.aggregate('', null)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(Array.isArray(ERROR)).toBeTruthy();
        done();
      });
  });


  it('Behavior if STEPS parameter is not an Array', (done) => {
    adp.db.aggregate('mockCollection', null)
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(Array.isArray(ERROR)).toBeTruthy();
        done();
      });
  });


  it('Behavior if Database return an error', (done) => {
    adp.mockError = { ERROR: 'MockError' };
    const steps = [];
    steps.push({ $match: { type: 'microservice' } });
    steps.push({ $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } });
    steps.push({ $match: { count: { $gt: 1 } } });
    steps.push({ $sort: { count: -1 } });
    adp.db.aggregate('mockCollection', steps)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Behavior in a successful case', (done) => {
    const steps = [];
    steps.push({ $match: { type: 'microservice' } });
    steps.push({ $group: { _id: { name: '$name' }, ids: { $addToSet: '$_id' }, count: { $sum: 1 } } });
    steps.push({ $match: { count: { $gt: 1 } } });
    steps.push({ $sort: { count: -1 } });
    adp.db.aggregate('mockCollection', steps, {})
      .then((RESULT) => {
        expect(Array.isArray(RESULT.docs)).toBeTruthy();
        expect(RESULT.docs.length).toBe(3);
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
