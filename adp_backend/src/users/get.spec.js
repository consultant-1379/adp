// ============================================================================================= //
/**
* Unit test for [ global.adp.users.get ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdp {
  indexUsers() {
    return new Promise((resolve) => {
      resolve({
        docs: [
          {
            name: 'test1',
            email: 'test1@test.com',
          },
          {
            name: 'test2',
            email: 'test2@test.com',
          },
        ],
      });
    });
  }
}

describe('Testing [ global.adp.users.get ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => null;
    global.adp.getSizeInMemory = () => 1024;
    global.adp.db = {};
    global.adp.db.get = () => new Promise((RESOLVETHISMOCK) => {
      RESOLVETHISMOCK(global.mockResult);
    });
    global.mockResult = {
      docs: [
        {
          name: 'test1',
          email: 'test1@test.com',
        },
        {
          name: 'test2',
          email: 'test2@test.com',
        },
      ],
    };
    global.adp.getPostParameter = () => null;
    global.adp.Answers = require('./../answers/AnswerClass'); // eslint-disable-line global-require
    global.adp.users = {};
    global.adp.users.get = require('./get'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Checking if is returning a mock user list.', (done) => {
    global.adp.users.get({})
      .then((expectReturn) => {
        expect(expectReturn.getData()).toEqual(global.mockResult.docs);
        done();
      }).catch((ERROR) => {
        expect(ERROR).toEqual('true');
        done();
      });
  });
});
// ============================================================================================= //
