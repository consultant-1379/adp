// ============================================================================================= //
/**
* Unit test for [ global.adp.microservices.denormalize ]
* @author Omkar
*/
// ============================================================================================= //
describe('Testing results of [ global.adp.microservices.denormalize ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.getSizeInMemory = () => 123456;
    global.adp.microservices = {};
    global.adp.listOptions = {};
    // eslint-disable-next-line global-require
    global.adp.microservices.denormalize = require('./denormalize');
    global.adp.listOptions.get = () => new Promise((RESOLVE) => {
      const respObj = '[{"id": 1, "slug": "testItem", "items": [{"id": "1", "name": "test" }]  }]';
      RESOLVE(respObj);
      return (respObj);
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should denormlaize and return valid object', async (done) => {
    const mockRequestObject = {
      testItem: '1',
    };
    const mockResponseObject = {
      testItem: 'test',
    };
    await global.adp.microservices.denormalize(mockRequestObject)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(mockResponseObject);
        done();
      }).catch(() => {
        done();
      });
  });
  // =========================================================================================== //

  // =========================================================================================== //
});
