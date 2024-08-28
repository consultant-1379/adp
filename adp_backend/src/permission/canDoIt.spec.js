// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.canDoIt ]
* @author Armando Schiavon Dias [escharm]
*/
/* eslint-disable no-underscore-dangle */
// ============================================================================================= //
class MockAdp {
  getById(KEY) {
    return new Promise((resolve) => {
      let body = {};
      const ID = KEY;
      if (ID === 'TestWithOwner') {
        body = {
          docs: [{
            ID: 'TestWithOwner',
            team: [
              {
                signum: 'eunittestuser',
                serviceOwner: true,
              },
            ],
          }],
        };
        resolve(body);
      }
      body = {
        docs: [{
          owner: 'eunittestuser',
        }],
      };
      resolve(body);
    });
  }
}

describe('Testing [ global.adp.permission.canDoIt ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.db = {};

    global.adp.permission = {};
    global.adp.permission.getUserFromRequestObject = MOCKUSER => new Promise((MOCKRES1) => {
      const obj = {
        signum: MOCKUSER.user.docs[0]._id,
        role: MOCKUSER.user.docs[0].role,
      };
      MOCKRES1(obj);
    });
    global.adp.permission.fieldListWithPermissions = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.checkFieldPermissionCacheIt = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.canDoIt = require('./canDoIt'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.canDoIt ] if the user is "admin".', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'admin',
        }],
      },
    };
    const MS = null;
    global.adp.permission.canDoIt(USERREQUEST, MS)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done();
      }).catch((ERROR) => {
        expect(ERROR).toBe('admin');
        done.fail(ERROR);
      });
  });

  it('[ global.adp.permission.canDoIt ] if the user is "author", expected access denied because no MicroService ID was informed.', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'author',
        }],
      },
    };
    const MS = null;
    global.adp.permission.canDoIt(USERREQUEST, MS)
      .then((expectReturn) => {
        expect(expectReturn).toBe('admin');
        done.fail(expectReturn);
      }).catch((ERROR) => {
        expect(ERROR).toBe('No MicroService ID');
        done();
      });
  });

  it('[ global.adp.permission.canDoIt ] if the user is "author", expected access because he is MicroService owner.', (done) => {
    const USERREQUEST = {
      user: {
        docs: [{
          _id: 'eunittestuser',
          role: 'author',
        }],
      },
    };
    const MS = 'TestWithOwner';
    global.adp.permission.canDoIt(USERREQUEST, MS)
      .then((expectReturn) => {
        expect(expectReturn).toBe('Owner of the MicroService');
        done();
      }).catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
