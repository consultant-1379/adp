// ============================================================================================= //
/**
* Unit test for [ global.adp.login.ldap ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockUpdateUsersDataClass {
  updateAllThoseUsers() {
    return new Promise(RES => RES());
  }
}
// ============================================================================================= //
describe('Testing [ global.adp.login.ldap ] with expected and unexpected parameters.', () => {
  let forceThrowError;
  beforeEach(() => {
    forceThrowError = {
      bind: false,
      search: false,
      createClient: false,
      msg: '',
    };

    const mockBuffer = [
      {
        type: 'dn',
        _vals: Buffer.from('cn=etesuse,dc=example,dc=org'),
      },
      {
        type: 'objectClass',
        _vals: [
          Buffer.from([0x74, 0x6f, 0x70], 'hex'),
          Buffer.from([0x69, 0x6e, 0x65, 0x74, 0x4f, 0x72, 0x67, 0x50, 0x65, 0x72, 0x73, 0x6f,
            0x6e], 'hex'),
          Buffer.from([0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x62, 0x6c, 0x65, 0x4f, 0x62,
            0x6a, 0x65, 0x63, 0x74], 'hex'),
        ],
      },
      {
        type: 'cn',
        _vals: [
          Buffer.from([0x65, 0x74, 0x65, 0x73, 0x75, 0x73, 0x65], 'hex'),
        ],
      },
      {
        type: 'uid',
        _vals: [
          Buffer.from([0x65, 0x74, 0x65, 0x73, 0x75, 0x73, 0x65], 'hex'),
        ],
      },
      {
        type: 'userPassword',
        _vals: [
          Buffer.from([0x74, 0x65, 0x73, 0x74, 0x2d, 0x70, 0x61, 0x73, 0x73, 0x77, 0x6f, 0x72,
            0x64, 0x31], 'hex'),
        ],
      },
      {
        type: 'mail',
        _vals: [
          Buffer.from([0x74, 0x65, 0x73, 0x74, 0x2d, 0x75, 0x73, 0x65, 0x72, 0x40, 0x61, 0x64,
            0x70, 0x2d, 0x74, 0x65, 0x73, 0x74, 0x2e, 0x63, 0x6f, 0x6d], 'hex'),
        ],
      },
      {
        type: 'eriBirthName',
        _vals: [
          Buffer.from([0x54, 0x65, 0x73, 0x74], 'hex'),
        ],
      },
      {
        type: 'eriSn',
        _vals: [
          Buffer.from([0x55, 0x73, 0x65, 0x72], 'hex'),
        ],
      },
      {
        type: 'sn',
        _vals: [
          Buffer.from([0x55, 0x73, 0x65, 0x72], 'hex'),
        ],
      },
      {
        type: 'eriTelephoneNumber',
        _vals: [
          Buffer.from([0x2b, 0x33, 0x35, 0x33, 0x39, 0x30, 0x35, 0x34, 0x33, 0x32, 0x31,
            0x30], 'hex'),
        ],
      },
    ];
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.ldapNormalizer = {};
    global.adp.ldapNormalizer.analyse = require('../ldapNormalizer/analyse');
    global.adp.config = {};
    global.adp.config.ldap = {};
    global.adp.config.ldap.url = 'ldap://mock.address:9999';
    global.adp.config.ldap.bindDN = 'cn=mockadmin,dc=mockexample,dc=mockorg';
    global.adp.config.ldap.bindDN2 = 'cn=etesuse,dc=example,dc=org';
    global.adp.config.ldap.bindCredentials = 'mockadmin';
    global.adp.config.ldap.searchBase = 'dc=mockexample,dc=mockorg';
    global.adp.config.ldap.searchFilter = '(cn={{username}})';
    global.EventEmitter = require('events').EventEmitter;
    const clientOBJ = {
      bind: (bindDN, bindCredentials, callBackFunction) => {
        if (forceThrowError.bind) {
          throw new Error(forceThrowError.msg);
        }

        const situationA1 = (bindDN === global.adp.config.ldap.bindDN);
        const situationA2 = (bindDN === global.adp.config.ldap.bindDN2);
        if (!situationA1 && !situationA2) {
          callBackFunction('bindDN parameter is invalid!');
          return;
        }
        const situationB1 = (bindCredentials === global.adp.config.ldap.bindCredentials);
        const situationB2 = (bindCredentials === 'test-password1');
        const situationB3 = (bindCredentials === 'dGVzdC1wYXNzd29yZDE=');
        if (!situationB1 && !situationB2 && !situationB3) {
          callBackFunction('bindCredentials parameter is invalid!');
          return;
        }
        callBackFunction(null);
      },
      search: (searchBase, filter, callBackFunction) => {
        if (forceThrowError.search) {
          throw new Error(forceThrowError.msg);
        }

        const RESOBJ = new global.EventEmitter();
        if (searchBase !== global.adp.config.ldap.searchBase) {
          callBackFunction('searchBase parameter is invalid!', RESOBJ);
          return;
        }
        callBackFunction(null, RESOBJ);
        RESOBJ.emit('searchEntry', mockBuffer);
        RESOBJ.emit('end');
      },
      unbind: () => true,
    };
    global.base64 = {};
    global.base64.decode = S => S;
    global.ldapjs = {};
    global.ldapjs.createClient = () => {
      if (forceThrowError.createClient) {
        throw new Error(forceThrowError.msg);
      }
      return clientOBJ;
    };

    adp.users = {};
    adp.users.UpdateUsersDataClass = MockUpdateUsersDataClass;

    global.adp.login = {};
    global.adp.login.unbindClient = () => new Promise((resolve) => {
      resolve(true);
    });

    global.adp.auditlog = {};
    global.adp.auditlog.create = () => new Promise((resolve) => { resolve(); });

    global.adp.login.ldap = require('./ldap');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.login.ldap ] with a valid username and password. Should returns Code 200 Ok.', (done) => {
    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then((RES) => {
        expect(RES.code).toEqual(200);
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.login.ldap ] should reject if ldap can\'t unbind when login fails.', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'User') {
        reject(testError);
      } else {
        resolve();
      }
    });

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBe(testError);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a valid username but wrong password. Should returns Code 401 Unauthorized.', (done) => {
    global.adp.login.ldap('etesuse', 'test-password-wrong')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(401);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should reject if ldap can\'t unbind when login fails', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'User') {
        reject(testError);
      } else {
        resolve();
      }
    });


    global.adp.login.ldap('etesuse', 'test-password-wrong')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toEqual(testError);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a null username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(null, null)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with an undefined username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(undefined, undefined)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with an Array on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap([], [])
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with an Object on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap({}, {})
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a Number on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(25, 25)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a Boolean "true" value on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(true, true)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a Boolean "false" value on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(false, false)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] with a Function on username and password. Should returns Code 400 Bad Request.', (done) => {
    global.adp.login.ldap(() => {}, () => {})
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should not reject if the admin client can not unbind.', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'Admin') {
        reject(testError);
      } else {
        resolve();
      }
    });

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBe(testError);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should not reject if the bind throws an error.', (done) => {
    forceThrowError.bind = true;
    forceThrowError.msg = 'testError';

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(forceThrowError.msg);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should not reject if the search throws an error.', (done) => {
    forceThrowError.search = true;
    forceThrowError.msg = 'testError';

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(forceThrowError.msg);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should reject if the search throws an error and it fails to unbind.', (done) => {
    forceThrowError.search = true;
    forceThrowError.msg = 'testError';

    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'Admin') {
        reject(testError);
      } else {
        resolve();
      }
    });

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBe(testError);
        done();
      });
  });

  it('[ global.adp.login.ldap ] should reject when the createClient throws an error.', (done) => {
    forceThrowError.createClient = true;
    forceThrowError.msg = 'testError';

    global.adp.login.ldap('etesuse', 'dGVzdC1wYXNzd29yZDE=')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(forceThrowError.msg);
        done();
      });
  });
});
// ============================================================================================= //
