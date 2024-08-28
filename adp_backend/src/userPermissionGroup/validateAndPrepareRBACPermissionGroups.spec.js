// ============================================================================================= //
/**
* Unit test for [ adp.validations.validateAndPrepareRBACPermissionGroups ]
* @author Veerender Voskula [zvosvee]
*/

// ============================================================================================= //
class MockRBACGroups {
  indexGroups() {
    if (adp.shouldCrash === false) {
      const obj = {
        docs: [{
          _id: '6045f5baea101b2f031a5e1c',
          type: 'group',
          name: 'Internal Users Group',
          undeletable: true,
        }],
      };
      if (adp.emptyResult === true) {
        return new Promise(resolve => resolve([]));
      }
      if (adp.noGroupFound === true) {
        const mockError = { mockError: true, message: 'Group not found for given parameters with id 6045f5baea101b2f031a5e1c', code: 404 };
        return new Promise((resolve, reject) => reject(mockError));
      }
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true, message: 'db fetch failed', code: 500 };
    return new Promise((resolve, reject) => reject(mockError));
  }
}

class MockGroupsController {
  getGroups() {
    if (adp.shouldCrash === false) {
      const obj = [{
        _id: '6045f5baea101b2f031a5e1c',
        type: 'group',
        name: 'Internal Users Group',
        undeletable: true,
      }];
      return new Promise(resolve => resolve(obj));
    }
    if (adp.emptyResult === true) {
      return new Promise(resolve => resolve([]));
    }
    const mockError = { mockError: true, message: 'db fetch failed', code: 500 };
    return new Promise((resolve, reject) => reject(mockError));
  }
}

describe('Testing [ validateAndPrepareRBACPermissionGroups ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.shouldCrash = false;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.models = {};
    global.adp.models.RBACGroups = MockRBACGroups;
    global.adp.rbac = {};
    global.adp.rbac.GroupsController = MockGroupsController;
    adp.echoLog = text => text;
    adp.GroupName = 'Internal Users Group';
    adp.getDefaultRBACGroupID = () => '606ed2a1aaf1c32a0c73f9b0';
    global.validateAndPrepareRBACPermissionGroups = require('./validateAndPrepareRBACPermissionGroups');
  });


  afterEach(() => {
    global.adp = null;
  });

  it('should Fail:sending empty OBJ', async (done) => {
    await global.validateAndPrepareRBACPermissionGroups().then(() => {
      done.fail();
    })
      .catch((error) => {
        expect(error.code).toEqual(400);
        expect(error.message).toBe('Input data not found for validating against schema');
        done();
      });
  });

  it('should Fail: sending empty array', async (done) => {
    await global.validateAndPrepareRBACPermissionGroups([])
      .then(() => {
        done.fail();
      })
      .catch((error) => {
        expect(error.code).toEqual(400);
        expect(error.message).toBe('"RBAC permission group array" does not contain [Group Id]');
        done();
      });
  });

  it('should Fail: invalid group id', async (done) => {
    const rbacGroup = [{ _id: '123', type: 'group', name: 'xyz group' }];
    global.adp.shouldCrash = false;
    await global.validateAndPrepareRBACPermissionGroups(rbacGroup).then(() => {
      done.fail();
    })
      .catch((error) => {
        expect(error.code).toEqual(400);
        expect(error.message).toBe('"Group Id" must be a string');
        done();
      });
  });

  it('should Fail: invalid group id length', async (done) => {
    const rbacGroup = ['6045f5baea101b2f031a5e1'];
    global.adp.shouldCrash = false;
    await global.validateAndPrepareRBACPermissionGroups(rbacGroup).then(() => {
      done.fail();
    })
      .catch((error) => {
        expect(error.code).toEqual(400);
        expect(error.message).toBe('"Group Id" length must be at least 24 characters long');
        done();
      });
  });


  it('should Fail: group not found', async (done) => {
    const rbacGroup = ['6045f5baea101b2f031a5e1c'];
    global.adp.noGroupFound = true;
    await global.validateAndPrepareRBACPermissionGroups(rbacGroup).then(() => {
      done();
    })
      .catch((error) => {
        expect(error.code).toEqual(404);
        expect(error.message).toBe(`Group not found for given parameters with id ${rbacGroup[0]}`);
        done();
      });
  });

  it('should Fail: unable to fetch rbac groups, throw error', async (done) => {
    const rbacGroup = ['6045f5baea101b2f031a5e1c'];
    global.adp.shouldCrash = true;
    await global.validateAndPrepareRBACPermissionGroups(rbacGroup).then(() => {
      done.fail();
    })
      .catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toBe('db fetch failed');
        done();
      });
  });

  it('should success: fetch rbac groups', async (done) => {
    const rbacGroup = ['6045f5baea101b2f031a5e1c'];
    global.adp.shouldCrash = false;
    await global.validateAndPrepareRBACPermissionGroups(rbacGroup).then((RESULT) => {
      expect(Array.isArray(RESULT)).toBeTruthy();
      expect(RESULT.length).toEqual(1);
      done();
    })
      .catch((error) => {
        done.fail(error);
      });
  });
});
// ============================================================================================= //
