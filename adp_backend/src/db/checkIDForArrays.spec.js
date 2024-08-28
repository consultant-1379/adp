/**
* Unit test for [ adp.db.checkIDForArrays ]
* @author Cein
*/
describe('Testing results of [ adp.db.checkIDForArrays  ] ', () => {
  class MockMongoObjectID {
    constructor(id) {
      if (id === 'fail') {
        throw Error();
      }
      return { id: `mongo${id}` };
    }
  }

  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.MongoObjectID = MockMongoObjectID;

    adp.checkIdForArrays = require('./checkIDForArrays');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should apply MongoObjectIds to all id in the array and trim the id', (done) => {
    const testId = 'testID';
    const testArr = [` ${testId} `];

    const result = adp.checkIdForArrays(testArr);

    expect(result[0].id).toBe(`mongo${testId}`);
    done();
  });

  it('Should not apply MongoObjectIds if the MongoObjectID class throws an error', (done) => {
    const testId = 'fail';

    const result = adp.checkIdForArrays([testId]);

    expect(result[0]).toBe(testId);
    done();
  });

  it('Should return the same param back if not type array', (done) => {
    const testObj = 'notArray';

    const result = adp.checkIdForArrays(testObj);

    expect(result).toBe(testObj);
    done();
  });
});
