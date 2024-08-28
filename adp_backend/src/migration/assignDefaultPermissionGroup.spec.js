// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.assignDefaultPermissionGroup ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
const MockRBACGroups = class {
  getGroupsByName() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        const errResp = { msg: 'DB Error' };
        REJ(errResp);
        return;
      }
      const obj = [
        { name: 'Default Group' },
      ];
      RES({ docs: obj });
    });
  }
};

class MockGroupsController {
  // eslint-disable-next-line no-unused-vars
  getGroups(id, name) {
    if (adp.shouldCrash === false) {
      const obj = [{
        _id: '6045f5baea101b2f031a5e1c',
        type: 'group',
        name: 'Internal Users Group',
        undeletable: true,
      }];
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }
}

describe('Testing [ global.adp.migration.assignDefaultPermissionGroup ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.shouldCrash = false;
    global.adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.models = {};
    adp.models.RBACGroups = MockRBACGroups;
    adp.dbError = false;
    adp.getDefaultRBACGroupID = () => 'Internal Users Group';
    adp.echoLog = () => true;
    adp.migration = {};
    global.adp.rbac = {};
    global.adp.rbac.GroupsController = MockGroupsController;
    global.adp.getDefaultRBACGroupID = require('../library/getDefaultRBACGroupID');
    adp.migration.assignDefaultPermissionGroup = require('./assignDefaultPermissionGroup');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should add default group to user object.', async (done) => {
    const obj = {
      name: 'mockValidTest',
    };
    adp.shouldCrash = false;
    global.adp.migration.assignDefaultPermissionGroup(obj)
      .then((RESULT) => {
        expect(RESULT.rbac).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should not add default group to user object, because already have one.', async (done) => {
    const obj = {
      name: 'mockValidTest',
      rbac: { mockGroup: true },
    };
    adp.shouldCrash = false;
    global.adp.migration.assignDefaultPermissionGroup(obj)
      .then((RESULT) => {
        expect(RESULT).toBe(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should failed due to db error.', async (done) => {
    adp.shouldCrash = true;
    const obj = {
      name: 'mockValidTest',
    };
    adp.dbError = true;
    await adp.migration.assignDefaultPermissionGroup(obj)
      .then(() => {
        done.fail();
      })
      .catch((ERR) => {
        expect(ERR).toBeDefined();
        done();
      });
  });
});
// ============================================================================================= //
