// ============================================================================================= //
/**
* Unit test for [ global.adp.users.getUsersWithPermissions ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
let errorToFindAdminUsers = false;
let dbAdminUsersResp;
class MockAdpClass {
  getAllAdmin() {
    return new Promise((resolve, reject) => {
      if (errorToFindAdminUsers) {
        const emptyArray = [];
        reject(emptyArray);
        return;
      }
      resolve(dbAdminUsersResp);
    });
  }
}

describe('Testing [ global.adp.users.getUsersWithPermissions ] behavior.', () => {
  let REQ = {
    headers: {
      authorization: 'xxxxxxxxxxxxxxxxxxxxx',
    },
  };
  errorToFindAdminUsers = false;
  let errorInAuthorization = false;
  let respAuthorization;
  let errorDb = false;
  let mockRespUserAdminUser;
  let mockRespUser1;
  let mockRespUser2;
  let mockRespProfile;
  let permResp;
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdpClass;

    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => null;
    global.jsonwebtoken = {};
    global.jsonwebtoken.verify = () => {
      if (errorInAuthorization) {
        throw new Error('Unable to Authorize');
      }
      return respAuthorization;
    };
    global.adp.config = {};
    global.adp.config.jwt = {
      secret: 'someSecret',
    };
    global.adp.getSizeInMemory = () => 1024;
    global.adp.user = {};
    global.adp.user.get = signum => new Promise((res, rej) => {
      if (errorDb) {
        rej();
        return false;
      }
      if (signum === 'mockSignum') {
        res(mockRespUserAdminUser);
      }
      if (signum === 'fieldAdmin1') {
        res(mockRespUser1);
      }
      if (signum === 'fieldAdmin2') {
        res(mockRespUser2);
      }
      return true;
    });
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RESOLVE) => {
      const respObj = '[{"id": 1, "slug": "testItem", "items": [{"id": "1", "name": "test" }]  },'
      + '{"id": 1, "slug": "testItem", "items": [{"id": "1", "name": "test" }]  }]';
      RESOLVE(respObj);
      return (respObj);
    });
    global.adp.db = {};
    global.adp.db.get = () => new Promise((RESOLVETHISMOCK) => {
      RESOLVETHISMOCK(global.mockResult);
    });
    global.adp.db.find = () => new Promise((RESOLVE, REJECT) => {
      if (errorToFindAdminUsers) {
        const errorOBJ = { msg: 'error' };
        REJECT(errorOBJ);
        return false;
      }
      RESOLVE(dbAdminUsersResp);
      return true;
    });
    global.adp.permission = {};
    global.adp.permission.crudRead = () => new Promise((RESOLVE) => {
      RESOLVE(permResp);
      return true;
    });
    errorInAuthorization = false;
    errorToFindAdminUsers = false;
    REQ = {
      headers: {
        authorization: 'xxxxxxxxxxxxxxxxxxxxx',
      },
    };
    respAuthorization = {
      id: 'mockSignum',
    };
    errorDb = false;
    mockRespUserAdminUser = {
      docs: [
        {
          _id: 'mockSignum',
          role: 'admin',
          name: 'mock user',
          signum: 'mockSignum',
          email: 'mockuser@test.com',
        },
      ],
    };
    mockRespUser1 = {
      docs: [
        {
          _id: 'mockSignum1',
          role: 'author',
          name: 'mock user 1',
          signum: 'mockSignum1',
          email: 'mockuser1@test.com',
        },
      ],
    };
    mockRespUser2 = {
      docs: [
        {
          _id: 'mockSignum2',
          role: 'author',
          name: 'mock user 2',
          signum: 'mockSignum2',
          email: 'mockuser2@test.com',
        },
      ],
    };
    permResp = [];
    dbAdminUsersResp = {
      docs: [],
    };
    mockRespProfile = {
      role: 'Field Admin',
    };
    global.adp.profile = {};
    global.adp.profile.get = () => new Promise((RESOLVETHISMOCK) => {
      RESOLVETHISMOCK(mockRespProfile);
    });
    /* eslint-disable global-require */
    global.adp.Answers = require('./../answers/AnswerClass');
    global.adp.users = {};
    global.adp.users.getUsersWithPermissions = require('./getUsersWithPermissions');
    global.adp.dynamicSort = require('../library/dynamicSort');
    /* eslint-enable global-require */
  });


  it('Reject with error if request is not appropriate.', async (done) => {
    REQ = {};
    global.adp.users.getUsersWithPermissions(REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Unauthorized');
        done();
      });
  });

  it('Reject with error if user making request is unable not authorized.', async (done) => {
    errorInAuthorization = true;
    global.adp.users.getUsersWithPermissions(REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Unauthorized');
        done();
      });
  });

  it('Reject with error if some problem with fetching authorized user from DB.', async (done) => {
    errorDb = true;
    global.adp.users.getUsersWithPermissions(REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('User Not Found');
        done();
      });
  });

  it('Reject with error if some problem with reading admin users from the db.', async (done) => {
    errorToFindAdminUsers = true;
    global.adp.users.getUsersWithPermissions(REQ).then(() => {
      done.fail('Promise resolving unexpectedly');
    })
      .catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });

  it('Should send list of admins and no field admins as there is no field admin in the db if the logged in user is super admin user.', async (done) => {
    dbAdminUsersResp = {
      docs: [
        {
          signum: 'admin1',
        },
        {
          signum: 'admin2',
        },
      ],
    };
    global.adp.users.getUsersWithPermissions(REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.length).toBe(2);

      done();
    })
      .catch((error) => {
        done.fail(error);
      });
  });

  it('Should send list of admins and field admins as there are field admin in the db if the logged in user is super admin user.', async (done) => {
    dbAdminUsersResp = {
      docs: [
        {
          signum: 'admin1',
        },
        {
          signum: 'admin2',
        },
      ],
    };
    permResp = [
      {
        'group-id': 1,
        'item-id': 1,
        admin: {
          fieldAdmin1: {},
          fieldAdmin2: {},
        },
      },
    ];
    global.adp.users.getUsersWithPermissions(REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.length).toBe(4);
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should send list of field admins as there are field admin in the db if the logged in user is not super admin user.', async (done) => {
    dbAdminUsersResp = {
      docs: [
        {
          signum: 'admin1',
        },
        {
          signum: 'admin2',
        },
      ],
    };
    permResp = [
      {
        'group-id': 1,
        'item-id': 1,
        admin: {
          fieldAdmin1: {},
          fieldAdmin2: {},
        },
      },
    ];
    mockRespUserAdminUser = {
      docs: [
        {
          _id: 'mockSignum',
          role: 'author',
          name: 'mock user',
          signum: 'mockSignum',
          email: 'mockuser@test.com',
        },
      ],
    };
    global.adp.users.getUsersWithPermissions(REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.length).toBe(2);
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
// ============================================================================================= //
