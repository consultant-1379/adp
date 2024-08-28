// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.crudRead ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let mockPermDB = {};

class MockPermission {
  index() {
    return new Promise(resolve => resolve(mockPermDB));
  }
}

describe('Testing [ global.adp.permission.crudRead ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.crudRead = require('./crudRead'); // eslint-disable-line global-require
  });

  it('Should reply with empty array if permission database is empty', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    mockPermDB = {
      docs: [],
    };
    global.adp.permission.crudRead(mockSignum, mockRole)
      .then((resp) => {
        expect(resp.length).toEqual(0);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should send the all permissions if user is admin', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'admin';
    mockPermDB = {
      docs: [
        {
          signum: 'exists',
        },
        {
          signum: 'valid',
        },
      ],
    };
    global.adp.permission.crudRead(mockSignum, mockRole)
      .then((resp) => {
        expect(resp).toEqual(mockPermDB.docs);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should send the only permission for which user is admin', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'notadmin';
    mockPermDB = {
      docs: [
        {
          admin: {
            mockSignum: 'exists',
          },
        },
        {
          admin: {
            signum: 'valid',
          },
        },
      ],
    };
    global.adp.permission.crudRead(mockSignum, mockRole)
      .then((resp) => {
        expect(resp.length).toEqual(1);
        expect(resp[0]).toEqual(mockPermDB.docs[0]);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should send empty response if user is not admin and does not have any permissions', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'notadmin';
    mockPermDB = {
      docs: [
        {
          admin: {
            signum: 'exists',
          },
        },
        {
          admin: {
            signum: 'valid',
          },
        },
      ],
    };
    global.adp.permission.crudRead(mockSignum, mockRole)
      .then((resp) => {
        expect(resp.length).toBe(0);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
