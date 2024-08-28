// ============================================================================================= //
/**
* Unit test for [ permission.getAdminsByField ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
const permission = {};
let dbFindError = false;
const resultSuccessDb = {
  docs: [],
  totalInDatabase: 1,
};
let getUserMailError = false;
let resultSuccessGetMail = null;

class MockPermission {
  getAllPermissionsByField() {
    return new Promise((resolve, reject) => {
      if (dbFindError) {
        const errorResp = {
          code: 500,
        };
        return reject(errorResp);
      }
      return resolve(resultSuccessDb);
    });
  }
}

describe('Testing [ permission.getAdminsByField ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    // eslint-disable-next-line global-require
    permission.getAdminsByField = require('./getAdminsByField');
    global.adp.user = {};
    global.adp.user.getUserNameMail = () => new Promise((resolve, reject) => {
      if (getUserMailError) {
        const errorResp = {
          code: 500,
        };
        return reject(errorResp);
      }
      return resolve(resultSuccessGetMail);
    });

    dbFindError = false;
    getUserMailError = false;
    resultSuccessGetMail = {};
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should reject with error if field id is invalid', (done) => {
    const mockFieldId = null;
    const mockItemId = 1;
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toEqual(400);
        done();
      });
  });

  it('Should reject with error if item id is invalid', (done) => {
    const mockFieldId = 1;
    const mockItemId = null;
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toEqual(400);
        done();
      });
  });

  it('Should reject with error if unable to access db', (done) => {
    const mockFieldId = 1;
    const mockItemId = 1;
    dbFindError = true;
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeTruthy();
        done();
      });
  });

  it('Should send empty array if no admin user found', (done) => {
    const mockFieldId = 1;
    const mockItemId = 1;
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then((response) => {
        expect(response).toEqual([]);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should send empty array if email is not found for admin user', (done) => {
    const mockFieldId = 1;
    const mockItemId = 1;
    resultSuccessDb.docs = [{
      admin: {
        test1: {
          notification: [
            'update',
            'delete',
          ],
        },
        test2: {
          notification: [
            'create',
            'update',
            'delete',
          ],
        },
      },
    }];
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then((response) => {
        expect(response).toBeTruthy();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should send valid array of emails if found for admin user', (done) => {
    const mockFieldId = 1;
    const mockItemId = 1;
    resultSuccessDb.docs = [{
      admin: {
        test1: {
          notification: [
            'update',
            'delete',
          ],
        },
        test2: {
          notification: [
            'create',
            'update',
            'delete',
          ],
        },
      },
    }];
    resultSuccessGetMail = [
      {
        email: 'test@test.com',
      },
    ];
    permission.getAdminsByField.fetchAdmins(mockFieldId, mockItemId)
      .then((response) => {
        expect(response.length).toBeGreaterThan(0);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
