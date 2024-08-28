const joi = require('joi');
const proxyquire = require('proxyquire');

/**
* Unit test for [ adp.rbac.PermissionValidator ]
* @author Cein
*/

class MockMongoObjectId {
  constructor(id = Math.random().toString(36).substring(2, 15)) {
    this.id = id;
  }

  equals(id) {
    return this.id === id;
  }
}

class MockAssetPermissionValidator {
  constructor(permObj) {
    this.permObj = permObj;
  }

  validate() {
    return new Promise((res, rej) => {
      if (global.adp.MockPermVal.validateRes) {
        if (global.adp.MockPermVal.validateData === false) {
          res({ valid: true, updatedPermission: this.permObj });
        } else {
          res(global.adp.MockPermVal.validateIdsData);
        }
      } else {
        rej(global.adp.MockPermVal.validateIdsData);
      }
    });
  }
}

describe('Testing results of [ adp.rbac.AssetPermissionValidator ] ', () => {
  beforeAll(() => {
    global.joi = joi;
  });

  beforeEach(() => {
    adp = {};

    global.adp = {};
    global.adp.MongoObjectID = MockMongoObjectId;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.MockPermVal = {
      validateRes: true,
      validateData: false,
    };

    adp.rbac = {
      PermissionValidator: proxyquire('./PermissionValidator', {
        './AssetPermissionValidator': MockAssetPermissionValidator,
      }),
    };
  });

  afterEach(() => {
    global.adp = null;
  });

  it('validate: should return valid permission and add an Id to the permission', (done) => {
    const permArray = [{
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: [],
      static: null,
    },
    {
      type: 'content',
      dynamic: null,
      exception: null,
      static: [],
    }];
    const permVal = new adp.rbac.PermissionValidator(permArray);

    permVal.validate().then((result) => {
      const newPerm = result.updatedPermissions[0];

      expect(result.valid).toBeTruthy();
      expect((typeof newPerm._id === 'object' && newPerm._id !== null)).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validate: should successful match a permission with a given id that is a string and convert the string to an object', (done) => {
    const permObj = {
      _id: 'testId',
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: [],
      static: null,
    };
    const permObj2 = {
      _id: 'testId2',
      type: 'content',
      name: 'test2',
      dynamic: null,
      exception: null,
      static: [],
    };

    const permVal = new adp.rbac.PermissionValidator(
      [permObj, permObj2], [{ ...permObj }, { ...permObj2 }],
    );

    permVal.validate().then((result) => {
      const newPerm = result.updatedPermissions[0];

      expect(result.valid).toBeTruthy();
      expect((typeof newPerm._id === 'object' && newPerm._id !== null)).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validate: should reject if the given permission _ids does not match the dbPermissionArr _ids', (done) => {
    const permObj = {
      _id: new MockMongoObjectId('testId'),
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: [],
      static: null,
    };

    const permVal = new adp.rbac.PermissionValidator([permObj], [{ _id: 'doesNotMatch' }]);

    permVal.validate().then(() => done.fail())
      .catch((err) => {
        expect(err.code).toBe(400);
        done();
      });
  });

  it('validate: should reject if permission _ids are passed but the dbPermissionArr was not', (done) => {
    const permObj = {
      _id: 'testId',
      type: 'asset',
      name: 'test',
      dynamic: [],
      exception: [],
      static: null,
    };

    const permVal = new adp.rbac.PermissionValidator([permObj]);

    permVal.validate().then(() => done.fail())
      .catch((err) => {
        expect(err.code).toBe(400);
        done();
      });
  });

  it('validate: should reject if incorrect param data is passed.', async (done) => {
    let permVal = new adp.rbac.PermissionValidator('notArr');

    await permVal.validate().then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });

    permVal = new adp.rbac.PermissionValidator([]);

    await permVal.validate().then(() => done.fail()).catch((errArrSize) => {
      expect(errArrSize.code).toBe(400);
    });

    permVal = new adp.rbac.PermissionValidator([{}]);

    await permVal.validate().then(() => done.fail()).catch((errEmptyObj) => {
      expect(errEmptyObj.code).toBe(400);
    });

    permVal = new adp.rbac.PermissionValidator([{ name: true }]);

    await permVal.validate().then(() => done.fail()).catch((errIdNotStr) => {
      expect(errIdNotStr.code).toBe(400);
    });

    permVal = new adp.rbac.PermissionValidator([{ name: 'test', type: 'notAsset' }]);

    await permVal.validate().then(() => done.fail()).catch((errNotTypeAsset) => {
      expect(errNotTypeAsset.code).toBe(400);
    });

    permVal = new adp.rbac.PermissionValidator([{ name: 'test', type: 'asset' }, { name: 'test', type: 'asset' }]);

    await permVal.validate().then(() => done.fail()).catch((errUniqueName) => {
      expect(errUniqueName.code).toBe(400);
    });

    done();
  });

  it('validate: should reject if the asset permission validator fails', (done) => {
    const permObj = [
      {
        type: 'asset',
        dynamic: [],
        exception: [],
        static: null,
      },
      {
        type: 'content',
        dynamic: null,
        exception: null,
        static: [],
      },
    ];
    global.adp.MockPermVal.validateRes = false;
    global.adp.MockPermVal.validateIdsData = { code: 500 };
    const permVal = new adp.rbac.PermissionValidator(permObj);

    permVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('validate: should reject if there are more than one type asset permission', (done) => {
    const permVal = new adp.rbac.PermissionValidator([
      {
        type: 'asset',
        name: 'test',
        dynamic: [],
        exception: [],
        static: null,
      },
      {
        type: 'asset',
        name: 'test2',
        dynamic: [],
        exception: [],
        static: null,
      },
    ]);

    permVal.validate().then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
      done();
    });
  });

  it('validatePermIds: should reject if the given permIdArr is not an array', () => {
    const permVal = new adp.rbac.PermissionValidator([]);

    const result = permVal.validatePermIds(true);

    expect(result.valid).toBeFalsy();
    expect(result.error.code).toBe(400);
  });
});
