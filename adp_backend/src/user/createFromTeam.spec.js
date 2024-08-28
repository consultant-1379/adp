// ============================================================================================= //
/**
* Unit test for [ global.adp.user.createFromTeam ]
* @author Armando Schiavon Dias [escharm], Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.user.createFromTeam ] is able to create a User (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = text => text;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.user = {};
    global.adp.user.createFromTeam = require('./createFromTeam'); // eslint-disable-line global-require
    global.adp.user.read = MOCKSIGNUM => new Promise((RESOLVE) => {
      let obj;
      switch (MOCKSIGNUM) {
        case 'IAMINDATABASE':
          obj = { docs: [{ uid: 'IAMINDATABASE', name: 'I am in Database', email: 'test1@test.com' }] };
          RESOLVE(obj);
          break;
        default:
          obj = { docs: [] };
          RESOLVE(obj);
          break;
      }
    });
    global.adp.userbysignum = {};
    global.adp.userbysignum.search = MOCKSIGNUM => new Promise((RESOLVE) => {
      let obj;
      switch (MOCKSIGNUM) {
        case 'IAMINLDAP':
          obj = [{ uid: 'IAMINLDAP', name: 'I am in LDAP', email: 'test2@test.com' }];
          RESOLVE(obj);
          break;
        default:
          obj = [];
          RESOLVE(obj);
          break;
      }
    });
    global.adp.user.create = () => new Promise((RESOLVE) => {
      RESOLVE();
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing if the Team Member is already in Database', async (done) => {
    const MockMS = {
      name: 'Test',
      team: [
        {
          signum: 'IAMINDATABASE',
        },
      ],
    };
    global.adp.user.createFromTeam(MockMS)
      .then(() => {
        expect(true).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing if Team Member is in LDAP', async (done) => {
    const MockMS = {
      name: 'Test',
      team: [
        {
          signum: 'IAMINLDAP',
        },
      ],
    };
    global.adp.user.createFromTeam(MockMS)
      .then(() => {
        expect(true).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
