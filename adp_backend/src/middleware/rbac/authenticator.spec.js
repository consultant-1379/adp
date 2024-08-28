// ============================================================================================= //
/**
* Unit test for [ adp.rbac.authenticator ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
class MockAnswers {
  setCode(code) { return code; }

  setMessage(msg) { return msg; }

  getAnswer() { return {}; }
}

describe('Testing if [ adp.rbac.authenticator ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.shouldCrash = false;
    adp.mockREQ = { singum: 'TEST', role: 'no admin' };
    adp.mockRES = {};
    adp.mockNEXT = () => true;
    adp.echoLog = text => text;
    adp.Answers = MockAnswers;
    adp.setHeaders = () => ({ end() { return true; } });
    adp.permission = {};
    adp.permission.getUserFromRequestObject = () => new Promise((RES, REJ) => {
      const Error = { code: 500, Message: 'Some Error' };
      return adp.shouldCrash ? REJ(Error) : RES(adp.mockREQ);
    });
    adp.rbac = {};
    adp.rbac.authenticator = require('./authenticator');
  });


  afterEach(() => {
    global.adp = null;
  });

  it('Successful case, do not proceed further if user not admin.', (done) => {
    adp.rbac.authenticator(adp.mockREQ, adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case, proceed further if user is admin.', (done) => {
    adp.mockREQ = { singum: 'TEST', role: 'admin' };
    adp.rbac.authenticator(adp.mockREQ, adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case, if [ adp.models.RBACGroups ] crashes.', (done) => {
    adp.shouldCrash = true;
    adp.mockREQ = { singum: 'TEST', role: 'admin' };
    adp.rbac.authenticator(adp.mockREQ, adp.mockRES, adp.mockNEXT)
      .then((RESULT) => {
        expect(RESULT).toBeFalsy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
