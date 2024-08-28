// ============================================================================================= //
/**
* Unit test for [ adp.users.UpdateUsersDataClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockAdpClass {
  updateTeamMails() {
    return new Promise((RES, REJ) => {
      if (adp.behavior.adpmodels_updateTeamMails === 0) {
        RES();
      } else {
        REJ();
      }
    });
  }

  update() {
    return new Promise((resolve) => {
      resolve({ ok: true });
    });
  }

  getNameEmailAndSignumBySignum() {
    const mockResultChangeAll = {
      docs: [
        {
          _id: 'etesuse',
          signum: 'ETESUSE',
          name: 'Etesuse Outdated Name',
          email: 'outdated@email.com',
        },
      ],
    };
    const mockResultOnlySignumChange = {
      docs: [
        {
          _id: 'etesuse',
          signum: 'ETESUSE',
          name: 'Test User',
          email: 'test-user@adp-test.com',
        },
      ],
    };
    const mockResultOnlyNameChange = {
      docs: [
        {
          _id: 'etesuse',
          signum: 'etesuse',
          name: 'Etesuse Outdated Name',
          email: 'test-user@adp-test.com',
        },
      ],
    };
    const mockResultOnlyEmailChange = {
      docs: [
        {
          _id: 'etesuse',
          signum: 'etesuse',
          name: 'Test User',
          email: 'outdated@email.com',
        },
      ],
    };
    return new Promise((resolve) => {
      switch (adp.behavior.getNameEmailAndSignumBySignum) {
        case 1:
          resolve(mockResultOnlySignumChange);
          break;
        case 2:
          resolve(mockResultOnlyNameChange);
          break;
        case 3:
          resolve(mockResultOnlyEmailChange);
          break;
        default:
          resolve(mockResultChangeAll);
          break;
      }
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.users.UpdateUsersDataClass ] behavior', () => {
  beforeEach(() => {
    global.EventEmitter = require('events').EventEmitter;
    global.adp = {};
    adp.setHeaders = OBJ => OBJ;
    adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLogErrors = [];
    adp.echoLog = ((T1, T2) => {
      adp.echoLogErrors.push({ message: T1, object: T2 });
    });
    adp.Answers = {};
    adp.Answers.answerWith = (CODE, RES, TIMER, TEXT) => {
      adp.Answers.gotCode = CODE;
      adp.Answers.gotRES = RES;
      adp.Answers.gotTEXT = TEXT;
    };
    adp.behavior = {};
    adp.behavior.getNameEmailAndSignumBySignum = 0;
    adp.behavior.ldapjs_bind = 0;
    adp.behavior.ldapjs_createClient = 0;
    adp.behavior.login_unbindClient = 0;
    adp.behavior.adpmodels_updateTeamMails = 0;
    adp.behavior.searchEntry = 0;

    adp.ldapNormalizer = {};
    adp.ldapNormalizer.analyse = require('../ldapNormalizer/analyse');
    global.ldapjs = {
      createClient() {
        if (adp.behavior.ldapjs_createClient !== 0) {
          return new Error('mockError');
        }
        return {
          bind(V1, V2, CALLBACK) {
            if (adp.behavior.ldapjs_bind === 0) {
              CALLBACK(null);
            } else {
              CALLBACK('MockError');
            }
          },
          search(V1, V2, CALLBACK) {
            const mockBuffer = {
              attributes: [
                {
                  type: 'dn',
                  _vals: Buffer.from('cn=etesuse,dc=example,dc=org'),
                },
                {
                  type: 'objectClass',
                  _vals: [
                    Buffer.from([0x74, 0x6f, 0x70], 'hex'),
                    Buffer.from([0x69, 0x6e, 0x65, 0x74, 0x4f, 0x72, 0x67, 0x50, 0x65, 0x72,
                      0x73, 0x6f, 0x6e], 'hex'),
                    Buffer.from([0x65, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x62, 0x6c, 0x65,
                      0x4f, 0x62, 0x6a, 0x65, 0x63, 0x74], 'hex'),
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
                    Buffer.from([0x74, 0x65, 0x73, 0x74, 0x2d, 0x70, 0x61, 0x73, 0x73, 0x77,
                      0x6f, 0x72, 0x64, 0x31], 'hex'),
                  ],
                },
                {
                  type: 'mail',
                  _vals: [
                    Buffer.from([0x74, 0x65, 0x73, 0x74, 0x2d, 0x75, 0x73, 0x65, 0x72, 0x40,
                      0x61, 0x64, 0x70, 0x2d, 0x74, 0x65, 0x73, 0x74, 0x2e, 0x63, 0x6f, 0x6d], 'hex'),
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
              ],
            };
            const RESOBJ = new global.EventEmitter();
            CALLBACK(null, RESOBJ);
            if (adp.behavior.searchEntry === 0) {
              RESOBJ.emit('searchEntry', mockBuffer);
            }
            RESOBJ.emit('end');
          },
        };
      },
    };
    adp.login = {};
    adp.login.unbindClient = () => new Promise((RES, REJ) => {
      if (adp.behavior.login_unbindClient === 0) {
        RES();
      } else {
        REJ();
      }
    });
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.masterCache = {};
    adp.masterCache.clear = () => {};

    adp.config = {};
    adp.config.ldap = {};
    adp.config.ldap.url = 'http://mockURL/';
    adp.config.ldap.bindDN = 'mockBindDN';
    adp.config.ldap.bindCredentials = 'mockBindCredentials';
    adp.config.ldap.searchBase = 'mockSearchBase';
    adp.users = {};
    adp.users.UpdateUsersDataClass = require('./UpdateUsersDataClass');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ UpdateUsersDataClass ] Successful case, updating name, email and signum.', (done) => {
    adp.behavior.getNameEmailAndSignumBySignum = 0;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers('etesuse')
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        expect(adp.echoLogErrors[1].message).toEqual('User updated');
        expect(adp.echoLogErrors[1].object._id).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousSignum).toEqual('ETESUSE');
        expect(adp.echoLogErrors[1].object.updatedSignum).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousName).toEqual('Etesuse Outdated Name');
        expect(adp.echoLogErrors[1].object.updatedName).toEqual('Test User');
        expect(adp.echoLogErrors[1].object.previousEmail).toEqual('outdated@email.com');
        expect(adp.echoLogErrors[1].object.updatedEmail).toEqual('test-user@adp-test.com');
        expect(adp.echoLogErrors[1].object.processTimer).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ UpdateUsersDataClass ] Successful case, updating just the signum.', (done) => {
    adp.behavior.getNameEmailAndSignumBySignum = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers('etesuse')
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        expect(adp.echoLogErrors[1].message).toEqual('User updated');
        expect(adp.echoLogErrors[1].object._id).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousSignum).toEqual('ETESUSE');
        expect(adp.echoLogErrors[1].object.updatedSignum).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousName).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedName).toBeUndefined();
        expect(adp.echoLogErrors[1].object.previousEmail).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedEmail).toBeUndefined();
        expect(adp.echoLogErrors[1].object.processTimer).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ UpdateUsersDataClass ] Successful case, updating just the name.', (done) => {
    adp.behavior.getNameEmailAndSignumBySignum = 2;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        expect(adp.echoLogErrors[1].message).toEqual('User updated');
        expect(adp.echoLogErrors[1].object._id).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousSignum).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedSignum).toBeUndefined();
        expect(adp.echoLogErrors[1].object.previousName).toEqual('Etesuse Outdated Name');
        expect(adp.echoLogErrors[1].object.updatedName).toEqual('Test User');
        expect(adp.echoLogErrors[1].object.previousEmail).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedEmail).toBeUndefined();
        expect(adp.echoLogErrors[1].object.processTimer).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ UpdateUsersDataClass ] Successful case, updating just the email.', (done) => {
    adp.behavior.getNameEmailAndSignumBySignum = 3;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers('etesuse')
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        expect(adp.echoLogErrors[1].message).toEqual('User updated');
        expect(adp.echoLogErrors[1].object._id).toEqual('etesuse');
        expect(adp.echoLogErrors[1].object.previousSignum).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedSignum).toBeUndefined();
        expect(adp.echoLogErrors[1].object.previousName).toBeUndefined();
        expect(adp.echoLogErrors[1].object.updatedName).toBeUndefined();
        expect(adp.echoLogErrors[1].object.previousEmail).toEqual('outdated@email.com');
        expect(adp.echoLogErrors[1].object.updatedEmail).toEqual('test-user@adp-test.com');
        expect(adp.echoLogErrors[1].object.processTimer).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ connectOnLDAP ] If LDAP Bind fails.', (done) => {
    adp.behavior.ldapjs_bind = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toEqual('ERROR :: LDAP failed on BIND using the bindCredentials from config.json');
        expect(adp.echoLogErrors[0].object.url).toEqual('http://mockURL/');
        expect(adp.echoLogErrors[0].object.bindDN).toEqual('mockBindDN');
        expect(adp.echoLogErrors[0].object.error).toEqual('MockError');
        expect(adp.echoLogErrors[1].message).toEqual('Error caught on [ this.connectOnLDAP() ] at [ updateUsers ]');
        expect(adp.echoLogErrors[1].object.origin).toEqual('updateUsers');
        done();
      });
  });


  it('[ connectOnLDAP ] If LDAP Bind fails and unbindClient fails too.', (done) => {
    adp.behavior.ldapjs_bind = 1;
    adp.behavior.login_unbindClient = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toEqual('ERROR :: LDAP failed on BIND using the bindCredentials from config.json');
        expect(adp.echoLogErrors[0].object.url).toEqual('http://mockURL/');
        expect(adp.echoLogErrors[0].object.bindDN).toEqual('mockBindDN');
        expect(adp.echoLogErrors[0].object.error).toEqual('MockError');
        expect(adp.echoLogErrors[1].message).toEqual('Error caught on [ this.connectOnLDAP() ] at [ updateUsers ]');
        expect(adp.echoLogErrors[1].object.origin).toEqual('updateUsers');
        done();
      });
  });


  it('[ connectOnLDAP ] If LDAP createClient crashes.', (done) => {
    adp.behavior.ldapjs_bind = 1;
    adp.behavior.login_unbindClient = 1;
    adp.behavior.ldapjs_createClient = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.echoLogErrors.length).toEqual(2);
        expect(adp.echoLogErrors[0].message).toEqual('Caught an error on try/catch block on [ connectOnLDAP ]');
        expect(adp.echoLogErrors[0].object.origin).toEqual('connectOnLDAP');
        expect(adp.echoLogErrors[0].object.error).toBeDefined();
        expect(adp.echoLogErrors[1].message).toEqual('Error caught on [ this.connectOnLDAP() ] at [ updateUsers ]');
        expect(adp.echoLogErrors[1].object).toBeDefined();
        done();
      });
  });


  it('[ disconnectFromLDAP ] If LDAP unbindClient fails only at the end.', (done) => {
    adp.behavior.login_unbindClient = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();
    updateUsersData.disconnectFromLDAP()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.echoLogErrors.length).toEqual(1);
        expect(adp.echoLogErrors[0].message).toEqual('Caugth an error on [ adp.login.unbindClient ] at [ disconnectFromLDAP ]');
        expect(adp.echoLogErrors[0].object.origin).toEqual('disconnectFromLDAP');
        done();
      });
  });


  it('[ disconnectFromLDAP ] If timerLDAPQueries is bigger than one.', (done) => {
    const updateUsersData = new adp.users.UpdateUsersDataClass();
    updateUsersData.timerLDAPConnection = new Date();
    updateUsersData.timerLDAPQueries = 2;
    updateUsersData.disconnectFromLDAP()
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(1);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ updateAllTeamMails ] If [ updateTeamMails @ adp.models.Adp ] crashes.', (done) => {
    adp.behavior.adpmodels_updateTeamMails = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();
    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(5);
        expect(adp.echoLogErrors[1].message).toEqual('User updated');
        expect(adp.echoLogErrors[2].message).toEqual('Caugth an error on [ adpModel.updateTeamMails @ adp.models.Adp ] at [ updateAllTeamMails ]');
        expect(adp.echoLogErrors[2].object.origin).toEqual('updateAllTeamMails');
        expect(adp.echoLogErrors[3].message).toEqual('Error in [ this.updateAllTeamMails ] at [ updateAllThoseUsers ]');
        expect(adp.echoLogErrors[4].message).toEqual('Caugth an error on [ Promise.all() ] at [ updateAllThoseUsers ]');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ checkIfOk ] all possible situations.', (done) => {
    const updateUsersData = new adp.users.UpdateUsersDataClass();

    expect(updateUsersData.checkIfOk('etesuse')).toEqual(true);
    expect(updateUsersData.checkIfOk(123)).toEqual(false);
    expect(updateUsersData.checkIfOk('   ')).toEqual(false);
    expect(updateUsersData.checkIfOk('undefined')).toEqual(false);
    expect(updateUsersData.checkIfOk('null')).toEqual(false);
    done();
  });


  it('[ retrieveFromLDAP ] if this.client is null.', (done) => {
    const updateUsersData = new adp.users.UpdateUsersDataClass();
    updateUsersData.retrieveFromLDAP('etesuse')
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(adp.echoLogErrors.length).toEqual(1);
        expect(adp.echoLogErrors[0].message).toEqual('Caught an Error on [ retrieveFromLDAP ]');
        expect(adp.echoLogErrors[0].object.code).toEqual(500);
        expect(adp.echoLogErrors[0].object.error).toEqual('this.client is null');
        expect(adp.echoLogErrors[0].object.signum).toEqual('etesuse');
        expect(adp.echoLogErrors[0].object.origin).toEqual('retrieveFromLDAP');
        done();
      });
  });


  it('[ retrieveFromLDAP ] If get nothing from searchEntry.', (done) => {
    adp.behavior.searchEntry = 1;
    const updateUsersData = new adp.users.UpdateUsersDataClass();
    updateUsersData.updateUsers(['etesuse'])
      .then(() => {
        expect(adp.echoLogErrors.length).toEqual(1);
        expect(adp.echoLogErrors[0].message).toBeDefined();
        expect(adp.echoLogErrors[0].object).toBeNull();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
