// ============================================================================================= //
/**
* [ global.adp.userBy.search ]
* @author Omkar Sadegaonkar [esdgmkr]
*/

// ============================================================================================= //
describe('Testing [ global.adp.userBy.search ] with expected and unexpected parameters.', () => {
  let forceThrowError;
  beforeEach(() => {
    forceThrowError = {
      bind: false,
      search: false,
      msg: '',
    };

    const mockBuffer = {
      attributes: [
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
          type: 'eriDisplayName',
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
      ],
    };
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.ldapNormalizer = {};
    global.adp.ldapNormalizer.analyse = require('../ldapNormalizer/analyse'); // eslint-disable-line global-require
    global.adp.config = {};
    global.adp.config.ldap = {};
    global.adp.config.ldap.url = 'ldap://mock.address:9999';
    global.adp.config.ldap.bindDN = 'cn=mockadmin,dc=mockexample,dc=mockorg';
    global.adp.config.ldap.bindDN2 = 'uid=etesuse,ou=Users,ou=Internal,o=ericsson';
    global.adp.config.ldap.bindCredentials = 'mockadmin';
    global.adp.config.ldap.searchBase = 'dc=mockexample,dc=mockorg';
    global.EventEmitter = require('events').EventEmitter; // eslint-disable-line global-require
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
        if (!situationB1 && !situationB2) {
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
    };
    global.ldapjs = {};
    global.ldapjs.createClient = () => clientOBJ;

    global.adp.login = {};
    global.adp.login.unbindClient = () => new Promise((resolve) => {
      resolve(true);
    });

    global.adp.auditlog = {};
    global.adp.auditlog.create = () => new Promise((resolve) => { resolve(); });

    global.adp.userBy = {};
    global.adp.userBy.search = require('./search'); // eslint-disable-line global-require
    global.adp.getSizeInMemory = () => 1;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.userBy.search ] with a valid search name. Should returns Code 200 Ok.', (done) => {
    global.adp.userBy.search('cn', 'Test')
      .then((RES) => {
        expect(RES.code).toEqual(200);
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.userBy.search ] should reject if ldap fails to unbind.', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'user') {
        reject(testError);
      } else {
        resolve();
      }
    });

    global.adp.userBy.search('cn', 'Test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBe(testError);
        done();
      });
  });

  it('[ global.adp.userBy.search ] should reject if the client search throws an error.', (done) => {
    forceThrowError.msg = 'test';
    forceThrowError.search = true;
    global.adp.userBy.search('cn', 'Test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(forceThrowError.msg);
        done();
      });
  });

  it('[ global.adp.userBy.search ] should reject if the client search throws an error and can\'t unbind.', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'user') {
        reject(testError);
      } else {
        resolve();
      }
    });
    forceThrowError.msg = 'test';
    forceThrowError.search = true;

    global.adp.userBy.search('cn', 'Test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(testError);
        done();
      });
  });

  it('[ global.adp.userBy.search ] should reject if the client bind throws an error.', (done) => {
    forceThrowError.msg = 'test';
    forceThrowError.bind = true;
    global.adp.userBy.search('cn', 'Test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(forceThrowError.msg);
        done();
      });
  });

  it('[ global.adp.userBy.search ] should reject if the client bind throws an error and can\'t unbind.', (done) => {
    const testError = 'test';
    global.adp.login.unbindClient = (client, msg) => new Promise((resolve, reject) => {
      if (msg === 'user') {
        reject(testError);
      } else {
        resolve();
      }
    });
    forceThrowError.msg = 'test';
    forceThrowError.bind = true;

    global.adp.userBy.search('cn', 'Test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(`${error}`).toContain(testError);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with a null search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search(null)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with an undefined search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search(undefined)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with an Array on search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search([], [])
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with an Object on search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search({}, {})
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with a Number on search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search(25, 25)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });

  it('[ global.adp.userBy.search ] with a Boolean "true" value on search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search(true, true)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });


  it('[ global.adp.userBy.search ] with a Function on search name. Should returns Code 400 Bad Request.', (done) => {
    global.adp.userBy.search(() => {}, () => {})
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        done();
      });
  });
});
// ============================================================================================= //
