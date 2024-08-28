// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.crudUpdate ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let mockPermDB = {};
class MockPermission {
  getAllPermissionsByField() {
    return new Promise((resolve) => {
      resolve(mockPermDB);
    });
  }

  updateOne() {
    return new Promise((resolve) => {
      const createResp = {
        ok: true,
      };
      resolve(createResp);
    });
  }
}

describe('Testing [ global.adp.permission.crudUpdate ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.permission = {};
    global.adp.permission.crudUpdate = require('./crudUpdate'); // eslint-disable-line global-require
  });

  it('Should reject with error if permission group id not found', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {};
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "group-id" was not found!');
        done();
      });
  });

  it('Should reject with error if permission group id not a number', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 'invalid',
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "group-id" should be a number!');
        done();
      });
  });

  it('Should reject with error if permission item id not found', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 1,
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "item-id" was not found!');
        done();
      });
  });

  it('Should reject with error if permission item id not a number', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 'invalid',
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "item-id" should be a number!');
        done();
      });
  });

  it('Should reject with error if permission admin field null or undefined', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "admin" was not found!');
        done();
      });
  });

  it('Should reject with error if permission databse entry already exists', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
      admin: 'valid',
    };
    mockPermDB = {
      docs: [],
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('Cannot Update! Permission does not exist!');
        done();
      });
  });

  it('Should update the permission if user is admin', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'admin';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
      admin: 'valid',
    };
    mockPermDB = {
      docs: [{
        _id: 1,
      }],
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then((resp) => {
        expect(resp.code).toBe(200);
        expect(resp.msg).toBe('Permission successful updated!');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should update the permission if user is not admin for that field', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'notadmin';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
      admin: mockSignum,
    };
    mockPermDB = {
      docs: [{
        _id: 1,
        admin: {
          mockSignum: 'has rights',
        },
      }],
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then((resp) => {
        expect(resp.code).toBe(200);
        expect(resp.msg).toBe('Permission successful updated!');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should reject with error if user is not admin and does not have permission on that field', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'notadmin';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
      admin: mockSignum,
    };
    mockPermDB = {
      docs: [{
        _id: 1,
      }],
    };
    global.adp.permission.crudUpdate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toBe(406);
        expect(err.msg).toBeDefined();
        done();
      });
  });
});
// ============================================================================================= //
