// ============================================================================================= //
/**
* Unit test for [ global.adp.profile.update ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
class MockAdpLog {
  createOne() {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}

describe('Testing results of [ global.adp.profile.update ]', () => {
  // =========================================================================================== //
  let REQ = {
    headers: {
      authorization: 'xxxxxxxxxxxxxxxxxxxxx',
    },
  };
  let errorInAuthorization = false;
  let errorDb = false;
  let errorDb2 = false;
  let errAuditLogs = false;
  let errIsFieldAdmin = false;
  let errUserUpdate = false;
  let errSchemaValidation = false;
  let mockRespUserAdminUser;
  let mockRespUser;
  let mockRespReqUser;
  let respAuditLogs;
  let respIsFieldAdmin;
  let respSchema;
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.masterCache.clearBecauseCUD = () => {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      REJECT(); // Always simulate there is no cache in Unit Test...
    });
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.user = {};
    global.adp.user.get = signum => new Promise((res, rej) => {
      if (errorDb) {
        rej();
        return false;
      }
      if (signum === 'mockSignum') {
        res(mockRespUserAdminUser);
      }
      if (signum === 'mockSignum2') {
        res(mockRespUser);
      }
      if (signum === 'someuser' && !errorDb2) {
        const mockRespReqUser2 = {
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
        res(mockRespReqUser2);
      } else if (errorDb2) {
        rej();
        return false;
      }
      return true;
    });

    global.adp.user.update = () => new Promise((resolve, reject) => {
      if (errUserUpdate) {
        const err = {
          message: 'Could not be updated',
        };
        reject(err);
        return false;
      }
      const noerr = {
        message: 'updated',
      };
      resolve(noerr);
      return true;
    });
    global.adp.user.validateSchema = () => {
      if (errSchemaValidation) {
        return [];
      }
      return true;
    };
    global.adp.clone = () => respSchema;
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.user = {};
    global.adp.auditlogs = {};
    global.adp.auditlogs.read = () => new Promise((res, rej) => {
      if (errAuditLogs) {
        rej();
        return false;
      }
      res(respAuditLogs);
      return true;
    });
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
    global.adp.permission.getUserFromRequestObject = () => new Promise((res, rej) => {
      if (errorInAuthorization) {
        rej();
        return false;
      }
      res(mockRespReqUser);
      return true;
    });
    // eslint-disable-next-line global-require
    global.adp.profile.update = require('./update');
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
      _id: 'someuser',
      role: 'author',
      name: 'some user',
      signum: 'someuser',
      email: 'someuser@test.com',
    };
    respAuditLogs = {
      templateJSON: {
        data: [
          {
            type: 'microservice',
            new: {
              name: 'Test Service',
            },
            desc: 'create',
            datetime: 'somedate1',
          },
          {
            type: 'microservice',
            new: {
              name: 'Test Service',
            },
            desc: 'update',
            datetime: 'somedate2',
            changes: {},
          },
          {
            type: 'microservice',
            new: {
              name: 'Test Service',
            },
            desc: 'delete',
            datetime: 'somedate2',
            changes: {},
          },
        ],
      },
    };
    respIsFieldAdmin = [
      {
        field: 'fields1', item: 'item1',
      },
      {
        field: 'fields2', item: 'item2',
      },
    ];
    respSchema = {
      id: '/user',
      type: 'object',
      properties: {
        _id: {
          description: '_id for the User',
          type: 'string',
          readOnly: true,
        },
        signum: {
          description: 'Signum for the User',
          type: 'string',
          readOnly: true,
        },
        name: {
          description: 'The Name of the User',
          type: 'string',
          readOnly: true,
        },
        email: {
          description: 'The Email of the User',
          type: 'string',
          readOnly: true,
        },
        role: {
          description: 'The Role of the User',
          type: 'string',
          readOnly: true,
        },
        marketInformationActive: {
          description: 'Show or not show the Marketplace PopUp Window',
          type: 'boolean',
        },
        devteam: {
          description: 'If user belongs to the DevTeam',
          type: 'boolean',
        },
      },
      required: ['signum', 'name', 'email'],
    };
    errorInAuthorization = false;
    errorDb = false;
    errorDb2 = false;
    errAuditLogs = false;
    errIsFieldAdmin = false;
    errUserUpdate = false;
    errSchemaValidation = false;
  });
  // =========================================================================================== //


  // =========================================================================================== //
  it('Reject with error if user making request is unable not authorized.', async (done) => {
    const mockUser = 'someuser';
    const mockUSerObjectToUpdate = {};
    errorInAuthorization = true;
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Unauthorized');
        done();
      });
  });

  it('Reject with error if request user is not admin and updating data of other user.', async (done) => {
    const mockUSerObjectToUpdate = {};
    const mockUser = 'someuser1';
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
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
    const mockUSerObjectToUpdate = {};
    const mockUser = 'someuser';
    errorDb = false;
    errorDb2 = true;
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('User Not Found');
        done();
      });
  });

  it('Reject with error user who is updating is not an admin user and updating for some other user.', async (done) => {
    const mockUSerObjectToUpdate = {};
    const mockUser = 'someuser1';
    mockRespReqUser = {
      _id: 'someuser',
      role: 'author',
      name: 'some user',
      signum: 'someuser',
      email: 'someuser@test.com',
    };
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
      done();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Unauthorized');
        done();
      });
  });

  it('Reject with appropariate errors if trying to update readonly data', async (done) => {
    const mockUSerObjectToUpdate = {
      _id: 'mockSignum2',
      role: 'author',
      name: 'mock user 2',
      signum: 'mockSignum2',
      email: 'mockuser2@test123.com',
    };
    const mockUser = 'mockSignum2';
    mockRespReqUser.role = 'admin';
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
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.code).toEqual(400);
        expect(err.message).toEqual('field is/are read only: email');
        done();
      });
  });

  it('Reject with appropariate errors if trying to update data with incorrect datatype', async (done) => {
    errSchemaValidation = true;
    const mockUSerObjectToUpdate = {
      _id: 'mockSignum2',
      role: 'author',
      name: 'mock user 2',
      signum: 'mockSignum2',
      email: 'mockuser2@test.com',
      marketInformationActive: 'true',
    };
    const mockUser = 'mockSignum2';
    mockRespReqUser.role = 'admin';
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
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.code).toEqual(400);
        done();
      });
  });

  it('Reject with errors if problem with updating user data', async (done) => {
    const mockUSerObjectToUpdate = {
      _id: 'mockSignum2',
      role: 'author',
      name: 'mock user 2',
      signum: 'mockSignum2',
      email: 'mockuser2@test.com',
      marketInformationActive: true,
    };
    errUserUpdate = true;
    const mockUser = 'mockSignum2';
    mockRespReqUser.role = 'admin';
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
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then(() => {
      expect(true).toBeFalsy();
    })
      .catch((err) => {
        expect(err).toBeDefined();
        expect(err.message).toEqual('Could not be updated');
        done();
      });
  });

  it('Should update data if data is valid and appropriate user is updating the data', async (done) => {
    const mockUSerObjectToUpdate = {
      _id: 'mockSignum2',
      role: 'author',
      name: 'mock user 2',
      signum: 'mockSignum2',
      email: 'mockuser2@test.com',
      marketInformationActive: true,
    };
    const mockUser = 'mockSignum2';
    mockRespReqUser.role = 'admin';
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
    global.adp.profile.update(mockUser, mockUSerObjectToUpdate, REQ).then((resp) => {
      expect(resp).toBeDefined();
      expect(resp.message).toEqual('updated');
      done();
    })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
