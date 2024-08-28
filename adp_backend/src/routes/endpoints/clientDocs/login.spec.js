// ============================================================================================= //
/**
* Unit test for [ global.adp.endpoints.clientDocs.login ]
* @author Ravikiran/Tirth [zgarsri/zpiptir]
*/
// ============================================================================================= //
class MockEchoLog {
  createOne() {
    return new Promise(RES => RES());
  }
}

describe('Testing [ global.adp.endpoints.clientDocs.login ] with expected and unexpected username & password.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.checkDB = true;
    global.mockBehavior.login = true;

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.setHeaders = RES => RES;
    global.base64 = {};
    global.base64.encode = () => 'testpassword';

    global.adp.getSizeInMemory = () => 1234;

    adp.Answers = require('./../../../answers/AnswerClass');
    adp.getSizeInMemory = () => 1;
    adp.endpoints = {};
    adp.endpoints.clientDocs = {};
    adp.endpoints.clientDocs.login = require('./login.js');

    global.adp.login = {};
    global.adp.login.ldap = (username, password) => new Promise((MOCKRES, MOCKREJ) => {
      if (username === 'testuser' && password === 'testpassword' && global.mockBehavior.login) {
        MOCKRES(
          {
            code: 200,
            message: 'User can Bind with LDAP. Login and Password are correct. Login for [ esupuse ] successful!',
            user: {
              uid: 'testuser',
              signum: 'testuser',
              name: 'User',
              email: 'super-user@adp-test.com',
            },
          },
        );
      }
      const error = {
        code: 400,
        message: 'Login or Password are invalid. Cannot try to login.',
        data: null,
      };
      MOCKREJ(error);
    });

    global.adp.login.checkdb = user => new Promise((MOCKRES, MOCKREJ) => {
      if (user.signum === 'testuser' && global.mockBehavior.checkDB) {
        MOCKRES(
          {
            code: 200,
            message: 'User login [ testuser ] successful!',
            data: {
              signum: 'testuser',
              name: 'User',
              email: 'super-user@adp-test.com',
              role: 'admin',
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImV0ZXN1c2UiLCJtYWlsIjoidGVzdC11c2VyQGFkcC10ZXN0LmNvbSIsImlhdCI6MTU0NzA0Nzg5N30.wdhgPwp-3W8jE3-Ko4vQdfTSM_lEIrVpLXXLhqQ6PL4',
            },
          },
        );
      }
      const error = {
        code: 400,
        message: 'Error in login.checkdb',
        data: null,
      };
      MOCKREJ(error);
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successfull case if username and password are not null or undifined', (done) => {
    const req = {
      username: 'testuser',
      password: 'testpassword',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(1);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Login successful');
        expect(global.mockExpect.endResult.data.token).toBeDefined();
        done();
      },
    };
    res.setHeader = () => {};
    adp.endpoints.clientDocs.login(req, res);
    done();
  });

  it('Should show error message if username and password are null', (done) => {
    const req = {
      username: '',
      password: '',
      body: {
        username: '',
        password: '',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(0);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.code).toEqual(400);
        expect(global.mockExpect.endResult.message).toEqual('Login or Password are invalid. Cannot try to login.');
        expect(global.mockExpect.endResult.data).toBeNull();
        done();
      },
    };
    res.setHeader = () => {};
    adp.endpoints.clientDocs.login(req, res);
    done();
  });

  it('Should show error message if username is undifined', (done) => {
    const req = {
      password: 'mockedPassword',
      body: {
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(0);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.code).toEqual(400);
        expect(global.mockExpect.endResult.message).toEqual('400 - Bad Request');
        expect(global.mockExpect.endResult.data).toBeNull();
        done();
      },
    };
    res.setHeader = () => {};
    adp.endpoints.clientDocs.login(req, res);
    done();
  });

  it('Should show error message if body is not present in request', (done) => {
    const req = {
      user: 'mockedUser',
      password: 'mockedPassword',
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(0);
        expect(global.mockExpect.endResult.page).toEqual(0);
        expect(global.mockExpect.endResult.code).toEqual(400);
        expect(global.mockExpect.endResult.message).toEqual('400 - Bad Request');
        expect(global.mockExpect.endResult.data).toBeNull();
        done();
      },
    };
    res.setHeader = () => {};
    global.mockBehavior.checkDB = false;
    adp.endpoints.clientDocs.login(req, res);
    done();
  });
});
// ============================================================================================= //
