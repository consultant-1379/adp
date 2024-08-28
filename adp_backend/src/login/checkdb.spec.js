// ============================================================================================= //
/**
* Unit test for [ global.adp.login.checkdb ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdp {
  async createOne() {
    return true;
  }
}

describe('Testing [ global.adp.login.checkdb ] with expected and unexpected parameters.', () => {
  beforeEach(() => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV0ZXN1c2UiLCJtYWlsIjoidGVzdC11c2VyQGFkcC10ZXN0LmNvbSIsImlhdCI6MTU0NzA0Nzg5N30.wdhgPwp-3W8jE3-Ko4vQdfTSM_lEIrVpLXXLhqQ6PL4';
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.jwt = {};
    global.adp.config.jwt.secret = 'test_secret';
    global.jsonwebtoken = {};
    global.jsonwebtoken.sign = () => testToken;
    global.adp.user = {};
    global.adp.user.get = userName => new Promise((RS1) => {
      let objectToReturn = null;
      if (userName === 'etesuse') {
        objectToReturn = {
          docs: [{
            signum: 'etesuse',
            name: 'Test',
            email: 'test-user@adp-test.com',
            role: 'author',
          }],
        };
      } else {
        objectToReturn = {
          docs: [],
        };
      }
      RS1(objectToReturn);
    });
    global.adp.login = {};
    global.adp.login.checkdb = require('./checkdb'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.login.checkdb ] with a valid user object and simulating that this user already exists on database. Should returns Code 200 Ok.', (done) => {
    const validUser = {
      objectClass: 'top,inetOrgPerson,extensibleObject',
      cn: 'etesuse',
      uid: 'etesuse',
      mail: 'test-user@adp-test.com',
      eriBirthName: 'Test',
      eriSn: 'User',
      sn: 'User',
      eriTelephoneNumber: '+35390543210',
    };
    global.adp.login.checkdb(validUser)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.login.checkdb ] with a valid user object and simulating that this user is new. Should returns Code 200 Ok.', (done) => {
    const validUser = {
      objectClass: 'top,inetOrgPerson,extensibleObject',
      cn: 'esupuse',
      uid: 'esupuse',
      mail: 'test-user@adp-test.com',
      eriBirthName: 'Super Test',
      eriSn: 'SuperUser',
      sn: 'SuperUser',
      eriTelephoneNumber: '+35390543210',
    };
    global.adp.login.checkdb(validUser)
      .then((RES) => {
        expect(RES.code).toEqual(200);
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.login.checkdb ] with an invalid user object. Should returns Code 400 Bad Request.', (done) => {
    const validUser = {
      objectClass: 'top,inetOrgPerson,extensibleObject',
      cn: 'esupuse',
      mail: 'test-user@adp-test.com',
      eriBirthName: 'Super Test',
      eriSn: 'SuperUser',
      sn: 'SuperUser',
      eriTelephoneNumber: '+35390543210',
    };
    global.adp.login.checkdb(validUser)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERR) => {
        expect(ERR.code).toEqual(400);
        done();
      });
  });
});
// ============================================================================================= //
