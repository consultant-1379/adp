// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.canDoItUser ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.canDoItUser ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.db = {};
    global.adp.db.get = () => new Promise((RESOLVETHIS) => {
      const body = {
        docs: [{
          owner: 'eunittestuser',
        }],
      };
      RESOLVETHIS(body);
    });
    global.adp.permission = {};
    global.adp.permission.canDoItUser = require('./canDoItUser'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.canDoItUser ] if the user is "admin".', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'admin',
        }],
      },
    };
    const newUSer = {};
    newUSer.SIGNUM = null;
    global.adp.permission.canDoItUser(USERREQUEST, newUSer)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe('admin');
        done();
      });
  });

  it('[ global.adp.permission.canDoItUser ] if the user object belongs to itself.', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'author',
        }],
      },
    };
    const newUSer = {};
    newUSer.SIGNUM = 'eunittestuser';
    global.adp.permission.canDoItUser(USERREQUEST, newUSer)
      .then((expectReturn) => {
        expect(expectReturn).toBe('Owner');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe('No User ID/Signum');
        done();
      });
  });
});
// ============================================================================================= //
