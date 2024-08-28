// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.crudCreate ]
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

  createOne() {
    return new Promise((resolve) => {
      const createResp = {
        ok: true,
      };
      resolve(createResp);
    });
  }
}

describe('Testing [ global.adp.permission.crudCreate ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Permission = MockPermission;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.db = {};
    global.adp.db.find = () => new Promise((RESOLVE) => {
      RESOLVE(mockPermDB);
    });
    global.adp.db.create = () => new Promise((RESOLVE) => {
      const createResp = {
        ok: true,
      };
      RESOLVE(createResp);
    });
    global.adp.permission = {};
    global.adp.permission.crudCreate = require('./crudCreate'); // eslint-disable-line global-require
  });

  it('Should reject with error if permission group id not found', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {};
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
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
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
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
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
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
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
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
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('The field "admin" was not found!');
        done();
      });
  });

  it('Should reject with error if permission already exists on database', (done) => {
    const mockSignum = 'mockSignum';
    const mockRole = 'mockRole';
    const mockPermObject = {
      'group-id': 1,
      'item-id': 1,
      admin: 'valid',
    };
    mockPermDB = {
      docs:
            [
              {
                'group-id': 1,
                'item-id': 1,
                admin: 'test',
              },
            ],
    };
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((err) => {
        expect(err.code).toEqual(400);
        expect(err.msg).toEqual('Permission already exists!');
        done();
      });
  });

  it('Should create permission database if it does not exist and permission object is valid', (done) => {
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
    global.adp.permission.crudCreate(mockSignum, mockRole, mockPermObject)
      .then((response) => {
        expect(response.code).toEqual(200);
        expect(response.msg).toEqual('Permission successful created!');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
