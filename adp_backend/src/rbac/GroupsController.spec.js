const proxyquire = require('proxyquire');
const getCopiedName = require('../library/getCopyName');
const schemaValidator = require('../common/validators/validator.jsonschema');
// ============================================================================================= //
/**
* Unit test for [ rbac-groupsController ]
* @author Armando Dias [zdiaarm], Omkar Sadegaonkar [zsdgmkr], Veerender
*/
// ============================================================================================= //
let GroupsController;
let cntrlObj;

class MockRBACGroups {
  getGroupByIds() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ();
        return false;
      }
      if (adp.emptyGroups) {
        RES({ ok: true, docs: [] });
      }
      RES({ ok: true, docs: [{ _id: 'mockid' }] });
      return true;
    });
  }

  createGroupIfPossible() {
    if (adp.createGroupIfPossibleCrash === false) {
      const obj = { ok: true };
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { ok: false, mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  deleteGroupIfPossible() {
    if (adp.shouldCrash === false) {
      const obj = { ok: true };
      return new Promise(resolve => resolve(obj));
    }
    if (adp.notOk === true) {
      const obj = {};
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { ok: false, mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  getGroupById() {
    if (adp.shouldCrash === false) {
      const obj = adp.emptyResp ? { docs: [] } : { docs: [{ mockValue: true }] };
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  getGroupsByName() {
    if (adp.shouldCrash === false) {
      const obj = adp.emptyResp ? [] : { docs: [{ mockValue: true }] };
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  indexGroups() {
    if (adp.shouldCrash === false) {
      const obj = adp.emptyResp ? { docs: [] } : {
        docs: [
          { _id: 'mockID', name: 'Name 1', permission: [{ _id: 'test' }] },
          { _id: 'mockID_1', name: 'Name 2 Long Long Long Long Long Long Long Long Long Long Name', permission: [{ _id: 'test2' }] },
          { mockValue: 'Name 3', permission: [{ _id: 'test3' }] },
        ],
      };
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  updateGroupIfPossible() {
    if (adp.shouldCrash === false) {
      const obj = { ok: true };
      return new Promise(resolve => resolve(obj));
    }
    if (adp.updateGroupNotOk) {
      const obj = { ok: false };
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { ok: false, mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }
}

class MockAdpLog {
  createOne() {
    return new Promise(resolve => resolve(true));
  }
}

class MockJsonschema {
  validate() {
    return adp.response;
  }
}

class MockMongoObjectId {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return `${this.id}`;
  }
}
class MockAdp {
  updateUserPermissionGroup() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ();
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  assignDefaultPermissionGroupToUsers() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  updateUserPermissionGroupIfRbacGroupUpdated() {
    return new Promise((RES, REJ) => {
      if (adp.dbUpdateGroupError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  deletePermissionGroupFromUsers() {
    return new Promise((RES, REJ) => {
      if (adp.dbError || adp.dbGroupFail) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  getUsersByPermissionGroup() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  updatePermissionGroupforMultipleUsers() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }
}

class MockRbacGroupsController {
  getGroups() {
    return new Promise((RES) => {
      RES([
        {
          name: 'Test',
          type: 'group',
        },
      ]);
    });
  }
}

class MockPermissionValidator {
  constructor(permArr) {
    this.permArr = permArr;
  }

  validate() {
    return new Promise((res, rej) => {
      if (adp.mockPermValidResp.res) {
        adp.mockPermValidResp.data.updatedPermissions = this.permArr;
        res(adp.mockPermValidResp.data);
      } else {
        rej(adp.mockPermValidResp.data);
      }
    });
  }
}

describe('Testing [ rbacGroupsController ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.docs.rest = [];
    adp.shouldCrash = false;
    adp.createGroupIfPossibleCrash = false;
    adp.shouldReturnSchemaError = false;
    adp.mockResp = { ok: true };
    adp.mockPermValidResp = {
      res: true,
      data: { valid: true },
    };
    adp.config = {};
    adp.config.schema = {};
    adp.config.schema.rbacGroup = {};
    global.Jsonschema = MockJsonschema;
    adp.mockREQ = {
      body: {
        type: 'group',
        name: 'Mock Name',
        description: 'Mock Description',
        permissions: [],
      },
    };
    adp.user = { signum: 'Mock_Signum', role: 'Mock_role' };
    adp.echoLog = text => text;
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.models.RBACGroups = MockRBACGroups;
    adp.models.AdpLog = MockAdpLog;
    adp.MongoObjectID = MockMongoObjectId;
    adp.rbac = {};
    adp.rbac.validateSchema = () => {
      if (adp.shouldReturnSchemaError === false) {
        return true;
      }
      return [{ mockError: true }];
    };
    adp.response = { errors: [] };
    adp.config = {};
    adp.config.schema = { rbacGroup: { properties: { name: {}, type: {}, permission: {} } } };
    adp.rbac = {};
    adp.rbac.GroupsController = MockRbacGroupsController;
    global.adp.getDefaultRBACGroupID = () => 'EID';
    GroupsController = proxyquire('./GroupsController', {
      './PermissionValidator': MockPermissionValidator,
      '../library/getCopyName': getCopiedName,
      '../common/validators/validator.jsonschema': schemaValidator,
    });
    cntrlObj = new GroupsController();
  });


  afterAll(() => {
    global.adp = null;
  });


  describe('Testing [ deleteGroup ] behavior', () => {
    beforeEach(() => {
      adp.groupId = 'mockID';
      adp.echoLog = text => text;
    });

    afterAll(() => {
      global.adp = null;
    });

    it('Successful case, sending the groupId parameter and delete the group.', (done) => {
      cntrlObj.deleteGroup(adp.groupId, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch((error) => {
          done.fail(error);
        });
    });

    it('Successful case, delete the group but failed to update user.', (done) => {
      adp.dbGroupFail = true;
      cntrlObj.deleteGroup(adp.groupId, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.code).toBe(500);
          done();
        });
    });

    it('Failed case, delete the group but DB response was not ok', (done) => {
      adp.notOk = true;
      cntrlObj.deleteGroup(adp.groupId, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch((error) => {
          done.fail(error);
        });
    });

    it('Negative case, if [ adp.models.RBACGroups ] crashes.', (done) => {
      adp.shouldCrash = true;
      cntrlObj.deleteGroup(adp.groupId, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });

    it('Negative case, if Bad ID is passed.', (done) => {
      adp.groupId = 123;
      cntrlObj.deleteGroup(adp.groupId, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });
  });

  describe('Testing [ getGroups ] behavior', () => {
    beforeEach(() => {
      adp.groupId = 'mockID';
      adp.echoLog = text => text;
      adp.queryParams = {};
    });

    afterAll(() => {
      global.adp = null;
    });

    it('Successful case, sending the id as parameter.', (done) => {
      adp.queryParams.id = 'valid';
      cntrlObj.getGroups(adp.queryParams.id)
        .then((RESULT) => {
          expect(RESULT).toEqual([{ mockValue: true }]);
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Successful case, sending the name as parameter.', (done) => {
      adp.queryParams.name = 'valid';
      cntrlObj.getGroups(null, adp.queryParams.name)
        .then((RESULT) => {
          expect(RESULT).toEqual([{ mockValue: true }]);
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Negative case, sending the wrong name as parameter.', (done) => {
      adp.emptyResp = true;
      adp.queryParams.name = true;
      cntrlObj.getGroups('id', adp.queryParams.name)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, sending the bad name as parameter.', (done) => {
      adp.emptyResp = true;
      adp.queryParams.name = 123;
      cntrlObj.getGroups(null, adp.queryParams.name)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, sending the bad ID as parameter.', (done) => {
      adp.emptyResp = true;
      adp.queryParams.id = 123;
      cntrlObj.getGroups(adp.queryParams.id)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Successful case, when not sending any parameter.', (done) => {
      cntrlObj.getGroups()
        .then((RESULT) => {
          expect(RESULT.length).toEqual(3);
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Negative case, if [ adp.models.RBACGroups ] model crashes.', (done) => {
      adp.shouldCrash = true;
      cntrlObj.getGroups()
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });
  });

  describe('Testing [ createGroup ] behavior', () => {
    beforeEach(() => {
      adp.wordpress = {};
      adp.wordpress.mockMenus = require('./GroupsController.spec.json');
      adp.wordpress.behavior = 0;
      adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
        if (adp.wordpress.behavior === 0) {
          RES(adp.wordpress.mockMenus);
        } else {
          const mockError = 'Mock Error';
          REJ(mockError);
        }
      });
      adp.groupObj = { name: 'Mock Name', type: 'Group' };
    });

    afterAll(() => {
      global.adp = null;
    });

    it('Successful case, sending the groupId object.', (done) => {
      adp.groupObj = { name: 'Mock Name', type: 'Group', permission: [] };
      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Successful case, sending the groupId object and exception permission.', (done) => {
      adp.groupObj = {
        name: 'Mock Name',
        type: 'Group',
        permission: [{
          type: 'content',
          exception: ['/main', '/footer'],
        }],
      };

      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Negative case, when __validateExceptionForContent fails', (done) => {
      adp.groupObj = {
        name: 'Mock Name',
        type: 'Group',
      };

      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });

    it('Negative case, if sending the groupId object with _id.', (done) => {
      adp.groupObj = { _id: 'some id', name: 'Mock Name', type: 'Group' };
      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, if group object is in bad format.', (done) => {
      adp.groupObj = { name: 'Mock Name', dirty: true };
      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, if [ adp.models.RBACGroups ] create crashes.', (done) => {
      adp.groupObj = { name: 'Mock Name', type: 'Group', permission: [] };
      adp.createGroupIfPossibleCrash = true;
      cntrlObj.createGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });

    it('Negative case, should reject if validator rejects.', (done) => {
      adp.mockPermValidResp.res = false;
      adp.mockPermValidResp.data = { code: 400 };
      adp.groupObj = { _id: 'mockID', name: 'group name', permission: [] };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, should reject if validator returns false.', (done) => {
      adp.mockPermValidResp.data = { valid: false };
      adp.groupObj = { _id: 'mockID', name: 'group name', permission: [] };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });
  });

  describe('Testing [ createDuplicateGroup ] behavior', () => {
    beforeEach(() => {
      adp.wordpress = {};
      adp.wordpress.mockMenus = require('./GroupsController.spec.json');
      adp.wordpress.behavior = 0;
      adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
        if (adp.wordpress.behavior === 0) {
          RES(adp.wordpress.mockMenus);
        } else {
          const mockError = 'Mock Error';
          REJ(mockError);
        }
      });
      adp.groupObj = {};
    });

    afterAll(() => {
      global.adp = null;
    });

    it('Successful case, sending the groupId object for duplication.', (done) => {
      adp.groupObj = { _id: 'mockID', permission: [{ _id: 'test' }] };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          expect(RESULT.name).toEqual('Name 1 Copy');
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Successful case, sending the groupId and name for duplication.', (done) => {
      adp.groupObj = { _id: 'mockID', name: 'group name' };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          expect(RESULT.name).toEqual(adp.groupObj.name);
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Negative case, sending the groupId and very long name for duplication.', (done) => {
      adp.groupObj = { _id: 'mockID_1' };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, sending the invalid groupId type.', (done) => {
      adp.groupObj = { _id: {} };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          expect(MOCKERROR.message).toEqual('Parameter ID is required');
          done();
        });
    });

    it('Negative case, sending the invalid group name.', (done) => {
      adp.groupObj = { _id: 'mockID', name: { type: 'group name' } };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          expect(MOCKERROR.message).toEqual('Parameter NAME should be of type STRING');
          done();
        });
    });

    it('Negative case, sending the invalid groupId for duplication.', (done) => {
      adp.groupObj = { _id: 'invalid' };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(404);
          done();
        });
    });

    it('Negative case, if [ adp.models.RBACGroups ] createduplicate crashes.', (done) => {
      adp.shouldCrash = true;
      adp.groupObj = { _id: 'invalid' };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });

    it('Negative case: should reject if validator rejects.', (done) => {
      adp.mockPermValidResp.res = false;
      adp.mockPermValidResp.data = { code: 400 };
      adp.groupObj = { _id: 'mockID', name: 'group name', permission: [] };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, should reject if validator returns false. while creatingDubplicateGroup', (done) => {
      adp.mockPermValidResp.data = { valid: false };
      adp.groupObj = { _id: 'mockID', name: 'group name', permission: [] };
      cntrlObj.createDuplicateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });
  });

  describe('Testing [ updateGroup ] behavior', () => {
    beforeEach(() => {
      adp.wordpress = {};
      adp.wordpress.mockMenus = require('./GroupsController.spec.json');
      adp.wordpress.behavior = 0;
      adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
        if (adp.wordpress.behavior === 0) {
          RES(adp.wordpress.mockMenus);
        } else {
          const mockError = 'Mock Error';
          REJ(mockError);
        }
      });
      adp.groupObj = { permission: [] };
    });

    afterAll(() => {
      global.adp = null;
    });

    it('Successful case, sending the group object.', (done) => {
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Successful case, sending the group object with exception array', (done) => {
      adp.groupObj = {
        permission: [{
          type: 'content',
          exception: null,
        }],
      };
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch(() => {
          done.fail();
        });
    });

    it('Failed case, db response not ok', (done) => {
      adp.shouldCrash = true;
      adp.updateGroupNotOk = true;
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.message).toBe('Error in [ fetchData ] - db call');
          done();
        });
    });

    it('Failed case, updateUserPermissionWhenGroupUpdates failed', (done) => {
      adp.dbUpdateGroupError = true;
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.message).toBe('internal server error');
          done();
        });
    });

    it('Failed case, invalid schema', (done) => {
      adp.dbError = true;
      adp.groupObj.description = 'xyz';
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.message).toBe('The field description is not part of the schema');
          done();
        });
    });

    it('Failed case, empty groups', (done) => {
      adp.shouldCrash = false;
      adp.emptyResp = true;
      adp.emptyGroups = true;
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.message).toBe('Group not found for given parameters');
          done();
        });
    });

    it('Negative case, if [ adp.models.RBACGroups ] update crashes.', (done) => {
      adp.shouldCrash = true;
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(500);
          done();
        });
    });

    it('Negative case, should reject if validator rejects on update.', (done) => {
      adp.mockPermValidResp.res = false;
      adp.mockPermValidResp.data = { code: 400 };
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });

    it('Negative case, should reject if validator returns false on update.', (done) => {
      adp.mockPermValidResp.data = { valid: false };
      cntrlObj.updateGroup(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((MOCKERROR) => {
          expect(MOCKERROR.code).toEqual(400);
          done();
        });
    });
  });

  describe('Testing [ fetchDefaultGroups ] behavior', () => {
    beforeEach(() => {
      adp.groupObj = {};
    });

    afterAll(() => {
      global.adp = null;
    });

    it('negative case, empty group.', (done) => {
      adp.emptyGroups = true;
      cntrlObj.fetchDefaultGroups(adp.groupObj, adp.user)
        .then(() => {
          done();
        })
        .catch((error) => {
          expect(error.message).toBe('No default groups were retrieved by given ids');
          done();
        });
    });

    it('Negative case, fetch groups db crashes.', (done) => {
      adp.dbError = true;
      cntrlObj.fetchDefaultGroups(adp.groupObj, adp.user)
        .then(() => {
          done.fail();
        })
        .catch((error) => {
          expect(error.message).toBe('Failure to fetch default groups');
          done();
        });
    });

    it('succes case, fetch groups from db.', (done) => {
      adp.dbError = false;
      adp.emptyGroups = false;
      cntrlObj.fetchDefaultGroups(adp.groupObj, adp.user)
        .then((RESULT) => {
          expect(RESULT).toBeTruthy();
          done();
        })
        .catch(() => {
          done.fail();
        });
    });
  });
});
// ============================================================================================= //
