// ============================================================================================= //
/**
* Unit test for [ adp.middleware.isUserInDB ]
* @author Veerender Voskula [zvosvee], Omkar [zsdgmkr]
*/
// ============================================================================================= //
describe('Testing  [ adp.middleware.isUserInDB ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.mockRES = {};
    global.adp.mockNEXT = () => true;
    global.adp.echoLog = text => text;
    global.adp.setHeaders = () => ({ end() { return true; } });
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.Answers = require('../answers/AnswerClass');
    global.adp.user = {};
    global.adp.user.read = USR => new Promise((RESOLVE) => {
      const user = {
        docs: [
          {
            signum: 'test',
            name: 'test name',
            email: 'test mail',
            role: 'user',
          },
        ],
      };
      if (USR === 'validuser') {
        RESOLVE(user);
        return user;
      }
      RESOLVE({ docs: [] });
      return { docs: [] };
    });
    adp.middleware = {};
    adp.middleware.isUserInDB = require('./isUserInDB');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should test for User is not in DB;Block action and do not proceed further', (done) => {
    adp.mockREQ = 'abcd';
    adp.middleware.isUserInDB(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should test for User Signum is provided;Block action and do not proceed further', (done) => {
    adp.mockREQ = null;
    adp.middleware.isUserInDB(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should test for User in DB;Normal flow and proceed further', async (done) => {
    adp.mockREQ = 'validuser';
    adp.middleware.isUserInDB(adp.mockREQ, global.adp.mockRES, global.adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
