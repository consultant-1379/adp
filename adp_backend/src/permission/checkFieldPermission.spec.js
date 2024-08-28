// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.checkFieldPermission ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.checkFieldPermission ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.checkFieldPermission = require('./checkFieldPermission'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.checkFieldPermission ] should return field admin list if the valid cache is present.', (done) => {
    const tempFieldID = 'tempFieldID';
    const tempOptionID = 'tempOptionID';
    global.adp.permission.checkFieldPermissionCache = {
      tempFieldID: {
        tempOptionID: {
          fieldAdministrators: 'adminsList',
        },
      },
    };
    global.adp.permission.checkFieldPermission(tempFieldID, tempOptionID)
      .then((expectReturn) => {
        expect(expectReturn).toBe('adminsList');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.checkFieldPermission ] should reject if the cache is null.', (done) => {
    const tempFieldID = 'tempFieldID';
    const tempOptionID = 'tempOptionID';
    global.adp.permission.checkFieldPermissionCache = null;
    global.adp.permission.checkFieldPermission(tempFieldID, tempOptionID)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.checkFieldPermission ] should reject if the cache is undefined.', (done) => {
    const tempFieldID = 'tempFieldID';
    const tempOptionID = 'tempOptionID';
    global.adp.permission.checkFieldPermissionCache = undefined;
    global.adp.permission.checkFieldPermission(tempFieldID, tempOptionID)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
