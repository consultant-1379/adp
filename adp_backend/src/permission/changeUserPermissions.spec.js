// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.changeUserPermissions ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.changeUserPermissions ] behavior.', () => {
  let isFieldAdminRespMock;
  let isFieldAdminRespMock1;
  let errorChangeUSer;
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.cache = {};
    global.adp.echoLog = () => true;
    global.adp.permission = {};
    global.adp.permission.changeUserPermissions = require('./changeUserPermissions'); // eslint-disable-line global-require
    global.adp.permission.isFieldAdminByUserID = SIGNUM => new Promise((RES) => {
      if (SIGNUM === 'mock') {
        RES(isFieldAdminRespMock);
      }
      if (SIGNUM === 'mock2') {
        RES(isFieldAdminRespMock1);
      }
    });
    global.adp.permission.changeUser = () => new Promise((RES, REJ) => {
      if (errorChangeUSer) {
        const err = {
          msg: 'someerror',
        };
        REJ(err);
      }
      RES();
    });
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RESOLVE) => {
      const respObj = '[{"id": 1, "slug": "testItem", "items": [{"id": "1", "name": "test" }]  },'
      + '{"id": 2, "slug": "testItem2", "items": [{"id": "1", "name": "test2" }]  }]';
      RESOLVE(respObj);
      return (respObj);
    });

    global.adp.user = {};
    global.adp.user.thisUserShouldBeInDatabase = ID => new Promise((RESOLVE, REJECT) => {
      if (ID === 'mock2') {
        const obj = {
          totalInDatabase: 5,
          limitOfThisResult: 999,
          offsetOfThisResult: 0,
          time: '1ms',
          docs: [
            {
              _id: 'mock2',
              signum: 'mock2',
              name: 'User Mock',
              email: 'messy-user-mock@adp-test.com',
              role: 'author',
              marketInformationActive: true,
              type: 'user',
              modified: 'Tue Nov 12 2019 09:13:42 GMT+0000 (Greenwich Mean Time)',
            },
          ],
        };
        RESOLVE(obj);
      } else {
        const error = { code: 404, message: '404 - User Not Found' };
        REJECT(error);
      }
    });

    isFieldAdminRespMock = [];
    isFieldAdminRespMock1 = [];
    errorChangeUSer = false;
  });

  it('should reject if no request PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = null;
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('No instructions was found');
        done();
      });
  });

  it('should reject if no request newuserpermissions in PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = null;
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('No instructions was found');
        done();
      });
  });

  it('should reject if no request newuserpermissions field in PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [
      {

      },
    ];
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('No field was found');
        done();
      });
  });

  it('should reject if no request newuserpermissions field items in PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [
      {
        field: 'testItem',
      }];
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('No items were found');
        done();
      });
  });

  it('should reject if no request targetsignum in PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [
      {
        field: 'testItem', items: ['test'],
      }];
    PARAMETERS.target = null;
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('Target signum not found');
        done();
      });
  });

  it('should reject if some problem with changing the permission of user.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [{
      field: 'testItem', items: ['test'],
    }];
    errorChangeUSer = true;
    PARAMETERS.target = 'mock2';
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('Forbidden');
        done();
      });
  });

  it('should remove all field permissions if user is to be made super admin as users role will be made admin.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'admin';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [{
      field: 'testItem', items: ['test'],
    }];
    PARAMETERS.target = 'mock2';
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp.code).toEqual(200);
        expect(resp.msg).toEqual('Permission updated successfully');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should add the permissions to the user.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {};
    PARAMETERS.newPermissions = [{
      field: 'testItem', items: ['test'],
    }];
    isFieldAdminRespMock = [];
    isFieldAdminRespMock1 = [];
    PARAMETERS.target = 'mock2';
    global.adp.permission.changeUserPermissions(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp.code).toEqual(200);
        expect(resp.msg).toEqual('Permission updated successfully');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
