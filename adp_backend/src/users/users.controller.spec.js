class MockAdp {
  getUsersById() {
    return new Promise((res, rej) => {
      if (adp.models.AdpTest.res) {
        res(adp.models.AdpTest.data);
      } else {
        rej(adp.models.AdpTest.data);
      }
    });
  }
}

describe('Testing results of [ adp.users.UserController]', () => {
  beforeEach(() => {
    adp = {};
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    global.adp.masterCacheResp = {
      res: true,
      data: [],
    };
    global.adp.masterCache = {
      get: () => {},
      set: () => {
        if (global.adp.masterCacheResp.res) {
          return Promise.resolve(global.adp.masterCacheResp.data);
        }
        return Promise.reject(global.adp.masterCacheResp.data);
      },
    };
    global.adp.masterCacheTimeOut = { allusers: 10 };

    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.models.AdpTest = {
      res: true,
      data: { docs: [] },
    };

    adp.promiseAllSettledRes = [];
    adp.promiseAllSettled = () => Promise.resolve(adp.promiseAllSettledRes);

    adp.users = {};
    adp.users.UserController = require('./Users.controller');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('getUsersFromCache: should resolve users from cache and not in cache', (done) => {
    const cachedUser = 'cachedSig';
    const notInCachedUser = 'notCachedSig';
    adp.promiseAllSettledRes = [
      {
        status: 'fulfilled',
        value: {
          value: {
            docs: [{
              _id: cachedUser,
              signum: cachedUser,
              rbac: 'rbacTest',
            }],
          },
        },
      },
      {
        status: 'rejected',
        reason: 'test',
      },
    ];

    const userContr = new adp.users.UserController();
    userContr.getUsersFromCache([cachedUser, notInCachedUser]).then((result) => {
      const { cachedUsers, usersNotInCache } = result;

      expect(cachedUsers[0]._id).toBe(cachedUser);
      expect(cachedUsers[0].rbac).toBeUndefined();
      expect(cachedUsers.length).toBe(1);

      expect(usersNotInCache[0]).toBe(notInCachedUser);
      expect(usersNotInCache.length).toBe(1);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('getUsersFromCache: should resolve with all users in usersNotInCache if the cache object is of incorrect structure', (done) => {
    const cachedUser = 'cachedSig';
    adp.promiseAllSettledRes = [
      {
        status: 'fulfilled',
        value: {
          value: {
            docs: {},
          },
        },
      },
    ];

    const userContr = new adp.users.UserController();
    userContr.getUsersFromCache([cachedUser]).then((result) => {
      const { cachedUsers, usersNotInCache } = result;

      expect(cachedUsers.length).toBe(0);

      expect(usersNotInCache[0]).toBe(cachedUser);
      expect(usersNotInCache.length).toBe(1);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('getUsersFromCache: should resolve an empty array if no signums were given', (done) => {
    adp.promiseAllSettledRes = [];

    const userContr = new adp.users.UserController();
    userContr.getUsersFromCache([]).then((result) => {
      const { cachedUsers, usersNotInCache } = result;

      expect(cachedUsers.length).toBe(0);
      expect(usersNotInCache.length).toBe(0);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('dbGetBySignum: should resolve successfully with userdata', (done) => {
    const testObj = { user: 'testName' };
    adp.models.AdpTest.data.docs = [testObj];

    const userContr = new adp.users.UserController();
    userContr.dbGetBySignum(['test']).then((result) => {
      expect(result[0].user).toBe(testObj.user);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('dbGetBySignum: should reject if model returns incorrect data type', (done) => {
    const testObj = { user: 'testName' };
    adp.models.AdpTest.data.docs = testObj;

    const userContr = new adp.users.UserController();
    userContr.dbGetBySignum(['test']).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('dbGetBySignum: should reject if full model failure', (done) => {
    const testObj = { user: 'testName' };
    adp.models.AdpTest.data.docs = [testObj];
    adp.models.AdpTest.res = false;

    const userContr = new adp.users.UserController();
    userContr.dbGetBySignum(['test']).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('addUsersToAllUsersCache: should resolve true if an item is added to the cache', (done) => {
    const testUser = {
      _id: 'userSig',
      signum: 'userSig',
    };
    global.adp.masterCacheResp.data = [true];

    const userContr = new adp.users.UserController();
    userContr.addUsersToAllUsersCache([testUser]).then((result) => {
      expect(result[0]).toBeTruthy();
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('addUsersToAllUsersCache: should reject if array not give, array does not contain at least one user object', (done) => {
    const userContr = new adp.users.UserController();

    userContr.addUsersToAllUsersCache(2).then(() => {
      done.fail();
    }).catch((errNotArr) => {
      expect(errNotArr.code).toBe(500);
      expect(errNotArr.message).toContain('User object Array');

      userContr.addUsersToAllUsersCache([]).then(() => {
        done.fail();
      }).catch((errEmptyArr) => {
        expect(errEmptyArr.code).toBe(500);
        expect(errEmptyArr.message).toContain('User object list');

        userContr.addUsersToAllUsersCache([{ signum: 'sig' }]).then(() => {
          done.fail();
        }).catch((errNoSignum) => {
          expect(errNoSignum.code).toBe(500);
          expect(errNoSignum.message).toContain('User Id');
          done();
        });
      });
    });
  });

  it('addUsersToAllUsersCache: should reject if the cache fails to set', (done) => {
    global.adp.masterCacheResp.res = false;
    const testUser = {
      _id: 'userSig',
      signum: 'userSig',
    };
    global.adp.masterCacheResp.data = 'errorMessage';

    const userContr = new adp.users.UserController();
    userContr.addUsersToAllUsersCache([testUser]).then(() => {
      done.fail();
    }).catch((result) => {
      expect(result.message).toContain('Failure to set');
      expect(result.code).toBe(500);
      done();
    });
  });

  it('getBySignum: should resolve with a matched user list', (done) => {
    const cachedUser = 'cachedSig';
    const notInCachedUser = 'notCachedSig';
    adp.promiseAllSettledRes = [
      {
        status: 'fulfilled',
        value: {
          value: {
            docs: [{
              _id: cachedUser,
              signum: cachedUser,
              rbac: 'rbacTest',
            }],
          },
        },
      },
      {
        status: 'rejected',
        reason: 'test',
      },
    ];

    const testObj = { _id: notInCachedUser, signum: notInCachedUser };
    adp.models.AdpTest.data.docs = [testObj];

    const userContr = new adp.users.UserController();
    userContr.getBySignum([cachedUser, cachedUser, notInCachedUser, '']).then((result) => {
      const [userFromCache, userFromDB] = result;

      expect(userFromCache._id).toBe(cachedUser);
      expect(userFromDB._id).toBe(notInCachedUser);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('getBySignum: should resolve with an empty array if no user were given', (done) => {
    adp.promiseAllSettledRes = [];
    adp.models.AdpTest.data.docs = [];

    const userContr = new adp.users.UserController();
    userContr.getBySignum([]).then((result) => {
      expect(result.length).toBe(0);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('getBySignum: should reject if the database rejects', (done) => {
    adp.promiseAllSettledRes = [];
    global.adp.masterCacheResp.res = false;
    adp.models.AdpTest.res = false;

    const userContr = new adp.users.UserController();
    userContr.getBySignum(['notCachedSig']).then(() => {
      done.fail();
    }).catch((errDB) => {
      expect(errDB.message).toContain('Model failure');
      expect(errDB.code).toBe(500);
      done();
    });
  });
});
