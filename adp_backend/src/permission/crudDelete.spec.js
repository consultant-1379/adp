// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.crudDelete ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
const mockPermRespDB = {};
const mockSignum = 'mockSignum';
let mockRole = 'mockRole';
const mockfieldID = 1;
const mockvalueID = 1;

class MockPermission {
  getAllPermissionsByField() {
    return new Promise((resolve) => {
      resolve(mockPermRespDB);
    });
  }

  deleteOne() {
    return new Promise((resolve) => {
      const createResp = {
        ok: true,
      };
      resolve(createResp);
    });
  }
}

describe('Testing [ global.adp.permission.crudDelete ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.crudDelete = require('./crudDelete'); // eslint-disable-line global-require
  });

  it('Should reject with error if permission db is empty', (done) => {
    mockPermRespDB.docs = [];
    global.adp.permission.crudDelete(mockSignum, mockRole, mockfieldID, mockvalueID)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('Cannot Delete! Permission does not exist!');
        done();
      });
  });

  it('Should delete the permission if role of user is admin', (done) => {
    mockPermRespDB.docs = [{ _id: 'something', _rev: 'something' }];
    mockRole = 'admin';
    global.adp.permission.crudDelete(mockSignum, mockRole, mockfieldID, mockvalueID)
      .then((RESP) => {
        expect(RESP.code).toBe(200);
        expect(RESP.msg).toEqual('Permission successful deleted!');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should delete the permission if role of user is admin of that field', (done) => {
    mockRole = 'notadmin';
    mockPermRespDB.docs = [{
      _id: 'something',
      _rev: 'something',
      admin: {
        mockSignum: 'notnull',
      },
    }];
    global.adp.permission.crudDelete(mockSignum, mockRole, mockfieldID, mockvalueID)
      .then((RESP) => {
        expect(RESP.code).toBe(200);
        expect(RESP.msg).toEqual('Permission successful deleted!');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should reject with error not delete the permission if role of user is not admin of that field', (done) => {
    mockRole = 'notadmin';
    mockPermRespDB.docs = [{
      _id: 'something',
      _rev: 'something',
    }];
    global.adp.permission.crudDelete(mockSignum, mockRole, mockfieldID, mockvalueID)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toBe(403);
        expect(err.msg).toBeDefined();
        done();
      });
  });
});
// ============================================================================================= //
