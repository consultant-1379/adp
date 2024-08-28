/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
/**
* Unit test for [ global.adp.user.thisUserShouldBeInDatabase ]
* @author Omkar Sadegaonkar [zsdgmkr], Veerender
*/
// ============================================================================================= //
class MockRBACGroups {
  getGroupsByName() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        const errResp = { msg: 'DB Error' };
        REJ(errResp);
        return;
      }
      const obj = [
        { _id: 'test id', name: 'Test Group', type: 'Group' },
      ];
      RES({ docs: obj });
    });
  }

  indexGroups() {
    return new Promise((RES) => {
      RES({ docs: [{ _id: 'test id', name: 'Test Group', type: 'Group' }] });
    });
  }
}

class MockRBACGroupClass {
  getGroups() {
    return new Promise((RES) => {
      RES(adp.mockRespGroups);
    });
  }
}

describe('Testing [ global.adp.user.thisUserShouldBeInDatabase ] ', () => {
  let schemaValidationError = false;
  beforeEach(() => {
    global.adp = {};
    global.adp.getSizeInMemory = () => {};
    global.adp.testModelData = { docs: [] };
    adp.rbac = {};
    adp.rbac.GroupsController = MockRBACGroupClass;
    global.adp.clone = J => JSON.parse(JSON.stringify(J));
    global.adp.echoLog = text => text;
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {
      mockCache: null,
      set: () => {},
      get: () => new Promise((RESOLVE, REJECT) => {
        if (global.adp.masterCache.mockCache) {
          RESOLVE(global.adp.masterCache.mockCache);
        } else {
          REJECT();
        }
      }),
    };
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.thisUserShouldBeInDatabase = 60;
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.user = {};
    global.adp.user.validateSchema = (MOCKJSON) => {
      if (MOCKJSON._id === 'mockvalidid1' && !schemaValidationError) {
        return true;
      }
      return false;
    };
    global.adp.models = {};
    global.adp.models.AdpMockRes = {
      indexUsers: true,
      createOne: { res: true, data: { ok: true } },
      updateUserPermissionGroup: { res: true, data: { ok: true } },
      getById: true,
    };
    global.adp.models.Adp = class Adp {
      indexUsers() {
        return new Promise((resolve, reject) => {
          if (global.adp.models.AdpMockRes.indexUsers) {
            resolve(global.adp.testModelData);
          } else {
            reject(global.adp.testModelData);
          }
        });
      }

      createOne(userObj) {
        return new Promise((resolve, reject) => {
          if (global.adp.models.AdpMockRes.createOne.res) {
            global.adp.testModelData.docs.push(userObj);
            resolve(global.adp.models.AdpMockRes.createOne.data);
          } else {
            reject(global.adp.models.AdpMockRes.createOne.data);
          }
        });
      }

      updateUserPermissionGroup() {
        return new Promise((resolve, reject) => {
          if (global.adp.models.AdpMockRes.updateUserPermissionGroup.res) {
            resolve(global.adp.models.AdpMockRes.updateUserPermissionGroup.data);
          } else {
            reject(global.adp.models.AdpMockRes.updateUserPermissionGroup.data);
          }
        });
      }

      getById() {
        return new Promise((resolve, reject) => {
          if (global.adp.models.AdpMockRes.getById) {
            resolve(global.adp.testModelData);
          } else {
            reject(global.adp.testModelData);
          }
        });
      }
    };
    adp.models.RBACGroups = MockRBACGroups;
    global.adp.db = {};
    global.adp.db.find = () => new Promise((RESOLVE) => {
      const obj = {
        _id: 'MOCKVALIDID',
        _rev: 'ABC',
      };
      const objArray = [obj];
      RESOLVE({ docs: objArray, totalInDatabase: 10 });
    });
    global.adp.db.create = (DB, userObj) => new Promise((RESOLVE) => {
      global.adp.testModelData.docs.push(userObj);
      RESOLVE({ ok: true });
    });
    adp.getDefaultRBACGroupID = () => '606ed2a1aaf1c32a0c73f9b0';
    global.adp.userbysignum = {};
    global.adp.userbysignum.search = ID => new Promise((RESOLVE) => {
      if (ID === 'mockvalidid1' || ID === 'MOCKVALIDID1') {
        const obj = {
          uid: 'MOCKVALIDID1',
          signum: 'MOCKVALIDID1',
          name: 'MOCKVALIDID1',
          email: 'MOCKVALIDID1@mail.com',
        };
        const objArray = [obj];
        RESOLVE({ data: { usersFound: objArray } });
      } else {
        RESOLVE({ data: {} });
      }
    });
    schemaValidationError = false;
    adp.mockRespGroups = [{ _id: 'mock_id', name: 'Mock Group', type: 'group' }];
    global.adp.user.thisUserShouldBeInDatabase = require('./thisUserShouldBeInDatabase');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return user object if found in database, when the cache ALLUSERS cache is not set.', async (done) => {
    const validMockID = 'MOCKVALIDID';
    global.adp.testModelData.docs = [
      {
        _id: 'MOCKVALIDID',
        signum: 'MOCKVALIDID',
        name: 'MOCKVALIDID',
        email: 'MOCKVALIDID1@mail.com',
      },
    ];

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then((RESPUSER) => {
      expect(RESPUSER).toBeDefined();
      expect(RESPUSER.docs.length).toBeGreaterThan(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should return user object if found in database, when the cache ALLUSERS cache is set.', async (done) => {
    global.adp.testModelData.docs = [
      {
        _id: 'MOCKVALIDID',
        signum: 'MOCKVALIDID',
        name: 'MOCKVALIDID',
        email: 'MOCKVALIDID1@mail.com',
      },
    ];
    adp.masterCache.cache = {
      ALLUSERS: [
        {
          _id: 'otherUser',
          signum: 'otherUser',
          name: 'otherUser',
          email: 'otherUser@mail.com',
        },
      ],
    };
    const validMockID = 'MOCKVALIDID';

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then((RESPUSER) => {
      expect(RESPUSER).toBeDefined();
      expect(RESPUSER.docs.length).toBeGreaterThan(0);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('Should return user object if not found in the db but found in ldap.', async (done) => {
    const validMockID = 'MOCKVALIDID1';
    global.adp.testModelData.docs = [
      {
        _id: 'SHOULDNOTMATCH',
        signum: 'SHOULDNOTMATCH',
        name: 'SHOULDNOTMATCH',
        email: 'SHOULDNOTMATCH',
      },
    ];

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then((RESPUSER) => {
      expect(RESPUSER).toBeDefined();
      expect(RESPUSER.docs.length).toBeGreaterThan(0);
      done();
    }).catch((error) => {
      done.fail(error);
    });
  });

  it('Should reject with error if user could not found in db and ldap.', async (done) => {
    const validMockID = 'MOCKVALIDID2';
    global.adp.testModelData.docs = [
      {
        _id: 'SHOULDNOTMATCH',
        signum: 'SHOULDNOTMATCH',
        name: 'SHOULDNOTMATCH',
        email: 'SHOULDNOTMATCH',
      },
    ];

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((RESPUSER) => {
      expect(RESPUSER).toContain('not found');
      done();
    });
  });

  it('Should reject with error if could not validate object with user schema.', async (done) => {
    const validMockID = 'MOCKVALIDID1';
    global.adp.testModelData.docs = [
      {
        _id: 'SHOULDNOTMATCH',
        signum: 'SHOULDNOTMATCH',
        name: 'SHOULDNOTMATCH',
        email: 'SHOULDNOTMATCH',
      },
    ];

    schemaValidationError = true;
    global.adp.user.thisUserShouldBeInDatabase(validMockID).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((RESPUSER) => {
      expect(RESPUSER).toContain('USER MOCKVALIDID1 scheme is invalid');
      done();
    });
  });

  it('Should reject if userbysignum search rejects', (done) => {
    const testErr = { code: 500, message: 'ldap error' };
    spyOn(global.adp.userbysignum, 'search').and.returnValue(Promise.reject(testErr));

    const validMockID = 'MOCKVALIDID2';
    global.adp.testModelData.docs = [
      {
        _id: 'SHOULDNOTMATCH',
        signum: 'SHOULDNOTMATCH',
        name: 'SHOULDNOTMATCH',
        email: 'SHOULDNOTMATCH',
      },
    ];

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(testErr.code);
      expect(err.message).toBe(testErr.message);
      done();
    });
  });

  it('Should solve succesfully if the mastercache is set', (done) => {
    const mockCache = { resolve: true, value: { docs: [{ signum: 'mock', rbac: [] }] } };
    global.adp.masterCache.mockCache = mockCache;

    global.adp.user.thisUserShouldBeInDatabase('test').then((resp) => {
      expect(resp).toBe(mockCache.value);
      done();
    }).catch(() => done.fail());
  });

  it('Should reject if the mastercache has no resolve', (done) => {
    const mockCache = { resolve: false, value: 'test' };
    global.adp.masterCache.mockCache = mockCache;


    global.adp.user.thisUserShouldBeInDatabase('test').then(() => done.fail()).catch((err) => {
      expect(err).toBe(mockCache.value);
      done();
    });
  });

  it('Should reject the user object if the model rejects when getById is called.', async (done) => {
    global.adp.models.AdpMockRes.getById = false;
    const testErr = 'TestErr';
    global.adp.testModelData.docs = testErr;
    adp.masterCache.cache = {
      ALLUSERS: [
        {
          _id: 'otherUser',
          signum: 'otherUser',
          name: 'otherUser',
          email: 'otherUser@mail.com',
        },
      ],
    };
    const validMockID = 'MOCKVALIDID';

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then(() => done.fail()).catch((err) => {
      expect(err.docs).toBe(testErr);
      done();
    });
  });

  it('Should reject if getById response successfully as not type array.', async (done) => {
    global.adp.testModelData.docs = '';
    adp.masterCache.cache = {
      ALLUSERS: [
        {
          _id: 'otherUser',
          signum: 'otherUser',
          name: 'otherUser',
          email: 'otherUser@mail.com',
        },
      ],
    };
    const validMockID = 'MOCKVALIDID';

    global.adp.user.thisUserShouldBeInDatabase(validMockID).then(() => done.fail()).catch((err) => {
      expect(err).toContain('Failed to fetch');
      done();
    });
  });
});
// ============================================================================================= //
