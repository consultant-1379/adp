// ============================================================================================= //
/**
* Unit test for [ global.adp.profile.get ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
describe('Testing results of [ global.adp.profile.get ]', () => {
  // =========================================================================================== //
  let REQ = {
    headers: {
      authorization: 'xxxxxxxxxxxxxxxxxxxxx',
    },
  };
  let errorInAuthorization = false;
  let errorDb = false;
  let errorDb2 = false;
  let errIsFieldAdmin = false;
  let mockRespUserAdminUser;
  let mockRespUser;
  let respAuthorization;
  let mockRespReqUser;
  let respIsFieldAdmin;
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.jsonwebtoken = {};
    global.jsonwebtoken.verify = () => {
      if (errorInAuthorization) {
        throw new Error('Unable to Authorize');
      }
      return respAuthorization;
    };
    global.adp.user = {};
    global.adp.user.get = signum => new Promise((res, rej) => {
      if (errorDb) {
        rej();
        return false;
      }
      if (signum === 'mockSignum') {
        res(mockRespUserAdminUser);
      }
      if (signum === 'mockSignum1') {
        res(mockRespUser);
      }
      if (signum === 'someuser' && !errorDb2) {
        res(mockRespReqUser);
      } else if (errorDb2) {
        rej();
        return false;
      }
      return true;
    });
    global.adp.config = {};
    global.adp.config.jwt = {
      secret: 'someSecret',
    };
    global.adp.profile = {};
    global.adp.permission = {};
    global.adp.permission.isFieldAdminByUserID = () => new Promise((res, rej) => {
      if (errIsFieldAdmin) {
        rej();
        return false;
      }
      res(respIsFieldAdmin);
      return true;
    });
    // eslint-disable-next-line global-require
    global.adp.profile.get = require('./get');
    errorInAuthorization = false;
    REQ = {
      headers: {
        authorization: 'xxxxxxxxxxxxxxxxxxxxx',
      },
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
    mockRespUser = {
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
    mockRespReqUser = {
      docs: [
        {
          _id: 'someuser',
          role: 'author',
          name: 'some user',
          signum: 'someuser',
          email: 'someuser@test.com',
        },
      ],
    };
    respAuthorization = {
      id: 'mockSignum',
    };
    respIsFieldAdmin = [
      {
        field: 'fields1', item: 'item1',
      },
      {
        field: 'fields2', item: 'item2',
      },
    ];
    errorInAuthorization = false;
    errorDb = false;
    errorDb2 = false;
    errIsFieldAdmin = false;
  });
  // =========================================================================================== //


  // =========================================================================================== //
  it('Reject with error if request is not appropriate.', async (done) => {
    const mockUser = 'someuser';
    REQ = {};
    global.adp.profile.get(mockUser, REQ).then(() => {
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
    const mockUser = 'someuser';
    errorInAuthorization = true;
    global.adp.profile.get(mockUser, REQ).then(() => {
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
    const mockUser = 'someuser';
    errorDb = true;
    global.adp.profile.get(mockUser, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('User Not Found');
        done();
      });
  });

  it('Reject with error if request user is not admin and fetching data for other user.', async (done) => {
    respAuthorization.id = 'mockSignum1';
    const mockUser = 'someuser';
    global.adp.profile.get(mockUser, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Unauthorized');
        done();
      });
  });

  it('Reject with error if unable to fetch data for a user.', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    errorDb = false;
    errorDb2 = true;
    global.adp.profile.get(mockUser, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('User Not Found');
        done();
      });
  });

  it('Reject with error if found more than one documents in the database for the user.', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    mockRespReqUser = {
      docs: [
        {
          _id: 'mockSignum2',
          role: 'author',
        },
        {
          _id: 'mockSignum3',
          role: 'author',
        },
      ],
    };
    global.adp.profile.get(mockUser, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('User Not Found');
        done();
      });
  });

  it('Should not send field admin related details if have some problem with checking if the user is field admin.', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    errIsFieldAdmin = true;
    global.adp.profile.get(mockUser, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.signum).toEqual(mockUser);
      expect(resp.role).toEqual('');
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Successfully send data if the user is admin and fetching data for himself', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'mockSignum';
    mockRespReqUser.docs[0].role = 'admin';
    global.adp.profile.get(mockUser, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.signum).toEqual(mockUser);
      expect(resp.role).toEqual('Admin');
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Successfully send data if the user is admin and fetching data for other user who is not field admin', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    respIsFieldAdmin = [];
    global.adp.profile.get(mockUser, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.signum).toEqual(mockUser);
      expect(resp.role).toEqual('');
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Successfully send data if the user is admin and fetching data for other user who is field admin', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    global.adp.profile.get(mockUser, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.signum).toEqual(mockUser);
      expect(resp.role).toEqual('Field Admin');
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Successfully send data if the user is not admin and fetching data for himself', async (done) => {
    respAuthorization.id = 'mockSignum';
    const mockUser = 'someuser';
    mockRespReqUser.docs[0].role = 'admin';
    global.adp.profile.get(mockUser, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.signum).toEqual(mockUser);
      expect(resp.role).toEqual('Admin');
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
