// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.changeUser ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let isFieldAdminRespMock;
let isFieldAdminRespMock1;
let errorDbFind;
let errorCrudUpdate;
let errorCrudCreate;
let dbFindResp;
class MockPermission {
  getFieldAdminPermission() {
    return new Promise((resolve, reject) => {
      if (errorDbFind) {
        const error = {
          code: 500,
          msg: 'error',
        };
        reject(error);
      }
      const resp = {
        docs: dbFindResp,
      };
      resolve(resp);
    });
  }
}
describe('Testing [ global.adp.permission.changeUser ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    adp.config = {};
    adp.config.defaultDB = 'mongoDB';
    global.adp.docs.list = [];
    global.adp.cache = {};
    global.adp.echoLog = () => true;
    global.adp.db = {};
    global.adp.permission = {};
    global.adp.permission.changeUser = require('./changeUser'); // eslint-disable-line global-require
    global.adp.permission.isFieldAdminByUserID = SIGNUM => new Promise((RES) => {
      if (SIGNUM === 'mock') {
        RES(isFieldAdminRespMock);
      }
      if (SIGNUM === 'mock2') {
        RES(isFieldAdminRespMock1);
      }
    });
    global.adp.permission.crudCreate = () => new Promise((RES, REJ) => {
      if (errorCrudCreate) {
        const error = {
          code: 500,
          msg: 'error',
        };
        REJ(error);
      }
      const resp = {
        docs: ['something'],
      };
      RES(resp);
    });
    global.adp.permission.crudUpdate = () => new Promise((RES, REJ) => {
      if (errorCrudUpdate) {
        const error = {
          code: 500,
          msg: 'error',
        };
        REJ(error);
      }
      const resp = {
        docs: ['something'],
      };
      RES(resp);
    });

    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RESOLVE) => {
      const respObj = '[{"id": 1, "slug": "testItem", "items": [{"id": "1", "name": "test" }]  },'
        + '{"id": 2, "slug": "testItem2", "items": [{"id": "1", "name": "test2" }]  }]';
      RESOLVE(respObj);
      return (respObj);
    });
    isFieldAdminRespMock = [];
    isFieldAdminRespMock1 = [];
    errorDbFind = false;
    errorCrudUpdate = false;
    errorCrudCreate = false;
    dbFindResp = ['something'];
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should reject if no PARAMETERS found.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = null;
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('No instructions was found');
        done();
      });
  });

  it('should reject if fieldcode is not a number.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 'not a number',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('The field "fieldcode" should be a number!');
        done();
      });
  });

  it('should reject if itemcode is not a number.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 'not a number',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('The field "itemCode" should be a number!');
        done();
      });
  });

  it('should reject if action is not a string.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 2,
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('The field "action" should be a string ( read, add or remove )!');
        done();
      });
  });

  it('should reject if action is not a appropriate string.', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'wrong',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('The field "action" should be a string ( read, add or remove )!');
        done();
      });
  });

  it('should reject if target is not provided', (done) => {
    const SIGNUM = 'mock';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'add',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('The field "target" should be a provided!');
        done();
      });
  });

  it('should reject if operating user does not have enought permissions to read', (done) => {
    errorDbFind = true;
    const SIGNUM = 'operator';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'read',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('Read fail for [operator/author] - Forbidden');
        done();
      });
  });

  it('should reject if operating user does not have enought permissions to add', (done) => {
    errorDbFind = true;
    const SIGNUM = 'operator';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'add',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('Add fail for [operator/author] - Forbidden');
        done();
      });
  });

  it('should reject if operating user does not have enought permissions to remove', (done) => {
    errorDbFind = true;
    const SIGNUM = 'operator';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'remove',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err).toBeDefined();
        expect(err.msg).toEqual('Remove fail for [operator/author] - Forbidden');
        done();
      });
  });

  it('should respond with permissions if operation is read and user has access to read', (done) => {
    errorDbFind = false;
    const SIGNUM = 'operator';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'read',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('Read successful for [operator/author]');
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('should respond with appropriate message if does not find unique permission in db', (done) => {
    errorDbFind = false;
    dbFindResp = ['1', '2'];
    const SIGNUM = 'operator';
    const ROLE = 'author';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'add',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('unique permission not found for [operator/author]');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should create permission if already not present in db', (done) => {
    errorDbFind = false;
    dbFindResp = [];
    const SIGNUM = 'operator';
    const ROLE = 'admin';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'add',
      target: 'mock',
    };
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('Added successfully for [mock]');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should update permission if already present in db', (done) => {
    errorDbFind = false;
    const SIGNUM = 'operator';
    const ROLE = 'admin';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'add',
      target: 'mock',
    };
    dbFindResp = [
      { data: 'something', admin: {} },
    ];
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('Added successfully for [mock]');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should respond with message if no permission found', (done) => {
    errorDbFind = false;
    const SIGNUM = 'operator';
    const ROLE = 'admin';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'remove',
      target: 'mock',
    };
    dbFindResp = [];
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('permission not found for [operator/admin]');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should delete permission if exists in db', (done) => {
    errorDbFind = false;
    const SIGNUM = 'operator';
    const ROLE = 'admin';
    const PARAMETERS = {
      fieldcode: 1,
      itemcode: 1,
      action: 'remove',
      target: 'mock',
    };
    dbFindResp = [
      {
        admin: {
          mock: {

          },
        },
      },
    ];
    global.adp.permission.changeUser(SIGNUM, ROLE, PARAMETERS)
      .then((resp) => {
        expect(resp).toBeDefined();
        expect(resp.msg).toEqual('Removed successful for [mock]');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
