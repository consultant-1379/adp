// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.checkFieldPermissionCacheIt ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
class MockPermission {
  index() {
    return new Promise((resolve) => {
      const mockPermDB = {
        docs:
          [
            {
              'group-id': 1,
              'item-id': 1,
              admin: 'test',
            },
          ],
      };
      return resolve(mockPermDB);
    });
  }
}
describe('Testing [ global.adp.permission.checkFieldPermissionCacheIt ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.cache = {};
    global.adp.echoLog = () => true;
    global.adp.cache.timeInSecondsForDatabase = 10;
    global.adp.db = {};
    global.adp.db.find = () => new Promise((RESOLVE) => {
      const mockPermDB = {
        docs:
          [
            {
              'group-id': 1,
              'item-id': 1,
              admin: 'test',
            },
          ],
      };
      RESOLVE(mockPermDB);
    });
    global.adp.permission = {};
    global.adp.permission.checkFieldPermissionCacheIt = require('./checkFieldPermissionCacheIt'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.checkFieldPermissionCacheIt ] should return same cache if its already present.', (done) => {
    global.adp.permission.checkFieldPermissionCache = {
      date: new Date(),
    };
    global.adp.permission.checkFieldPermissionCacheIt()
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(Object.keys(expectReturn)).toContain('date');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.checkFieldPermissionCacheIt ] should return from database if cache is null or undefined.', (done) => {
    global.adp.permission.checkFieldPermissionCache = null;
    global.adp.permission.checkFieldPermissionCacheIt()
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(Object.keys(expectReturn)).toContain('date');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.checkFieldPermissionCacheIt ] should return from database if cache is old.', (done) => {
    const oldCache = {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    };
    global.adp.permission.checkFieldPermissionCache = oldCache;
    global.adp.permission.checkFieldPermissionCacheIt()
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(Object.keys(expectReturn)).toContain('date');
        expect(expectReturn).not.toEqual(oldCache);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
