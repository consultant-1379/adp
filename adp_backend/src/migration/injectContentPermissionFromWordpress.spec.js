// ============================================================================================= //
/**
* Unit test for [ adp.migration.injectContentPermissionFromWordpress ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
const { ObjectID } = require('mongodb');
// ============================================================================================= //
const mockGroupFromDBObject = [
  {
    _id: new ObjectID('602e415e01f5f70007a0a950'),
    type: 'group',
    name: 'Internal Users Group',
    permission: [
      {
        _id: new ObjectID('603e49f6369e66969a7bfe7e'),
        type: 'asset',
        name: 'Allow all assets perm',
        dynamic: [],
        exception: [],
        static: null,
      },
    ],
    undeletable: true,
  },
  {
    _id: new ObjectID('602e440d01f5f70007a0a952'),
    type: 'group',
    name: 'XID Group',
    permission: [
      {
        _id: new ObjectID('603e4c9e369e66969a7bff4e'),
        type: 'asset',
        name: 'No assets allowed perm',
        dynamic: null,
        exception: null,
        static: [],
      },
    ],
    undeletable: true,
  },
];
// ============================================================================================= //
const mockGroupFromDBObjectNotDefault = [
  {
    _id: new ObjectID('603e4d7e369e66969a7bffac'),
    type: 'group',
    name: 'allow All Assets',
    permission: [
      {
        _id: new ObjectID('603e49f6369e66969a7bfe7e'),
        type: 'asset',
        name: 'Allow all assets perm',
        dynamic: [],
        exception: [],
        static: null,
      },
    ],
  },
  {
    _id: new ObjectID('6093c47aa0e3570006a772f3'),
    type: 'group',
    name: 'Content permission group 1',
    permission: [
      {
        _id: new ObjectID('603e49f6369e66969a7bfe7e'),
        type: 'asset',
        dynamic: [],
        exception: [],
        static: null,
      },
    ],
  },
];
// ============================================================================================= //
class MockGroupsController {
  // eslint-disable-next-line no-unused-vars
  getGroups(id, name) {
    if (adp.shouldCrash === false) {
      const obj = [{
        _id: '6045f5baea101b2f031a5e1c',
        type: 'group',
        name: 'Internal Users Group',
        permission: [],
        undeletable: true,
      }];
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  fetchDefaultGroups() {
    if (adp.shouldCrash.fetchDefaultGroups === false) {
      const obj = [{
        _id: '6045f5baea101b2f031a5e1c',
        type: 'group',
        name: 'Internal Users Group',
        permission: [],
        undeletable: true,
      }];
      return new Promise(resolve => resolve(obj));
    }
    const mockError = { mockError: true };
    return new Promise((resolve, reject) => reject(mockError));
  }

  updateGroup() {
    if (adp.shouldCrash.GroupsControllerUpdateGroup) {
      return new Promise((resolve, reject) => reject());
    }
    return new Promise(resolve => resolve());
  }
}
// ============================================================================================= //
const MockRBACGroups = class {
  indexGroups() {
    if (adp.shouldCrash.RBACGroupsIndexGroups) {
      const errResp = { msg: 'DB Error' };
      return new Promise((RES, REJ) => REJ(errResp));
    }
    const concatedArray = JSON.parse(JSON.stringify(mockGroupFromDBObject))
      .concat(JSON.parse(JSON.stringify(mockGroupFromDBObjectNotDefault)));
    return new Promise(RES => RES({ docs: concatedArray }));
  }

  getGroupByIds() {
    if (adp.shouldCrash.RBACGroupsGetGroupByIds) {
      const errResp = { msg: 'DB Error' };
      return new Promise((RES, REJ) => REJ(errResp));
    }
    if (adp.alternativeAnswer.RBACGroupsGetGroupByIds === 0) {
      return new Promise(RES => RES({ docs: mockGroupFromDBObject }));
    }
    const reversedArray = JSON.parse(JSON.stringify(mockGroupFromDBObject)).reverse();
    return new Promise(RES => RES({ docs: reversedArray }));
  }
};
// ============================================================================================= //
const MockADPModel = class {
  checkIfPermissionGroupsAreNotReal() {
    if (adp.shouldCrash.modelsADPcheckIfPermissionGroupsAreNotReal) {
      const errResp = { msg: 'DB Error' };
      return new Promise((RES, REJ) => REJ(errResp));
    }
    if (adp.alternativeAnswer.modelsADPcheckIfPermissionGroupsAreNotReal === 0) {
      return new Promise(RES => RES({ docs: mockGroupFromDBObjectNotDefault }));
    }
    return new Promise(RES => RES({ docs: [] }));
  }
};
// ============================================================================================= //
describe('Testing [ adp.migration.injectContentPermissionFromWordpress ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.db = {};

    adp.shouldCrash = {};
    adp.shouldCrash.fetchDefaultGroups = false;
    adp.shouldCrash.wordpressGetMenus = false;
    adp.shouldCrash.GroupsControllerUpdateGroup = false;
    adp.shouldCrash.RBACGroupsIndexGroups = false;
    adp.shouldCrash.RBACGroupsGetGroupByIds = false;
    adp.shouldCrash.modelsADPcheckIfPermissionGroupsAreNotReal = false;
    adp.alternativeAnswer = {};
    adp.alternativeAnswer.modelsADPcheckIfPermissionGroupsAreNotReal = 0;
    adp.alternativeAnswer.RBACGroupsGetGroupByIds = 0;

    adp.clone = (JSONObject) => { JSON.parse(JSON.stringify(JSONObject)); };

    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};

    adp.MongoObjectID = ObjectID;

    adp.rbac = {};
    adp.rbac.GroupsController = MockGroupsController;

    adp.models = {};
    adp.models.RBACGroups = MockRBACGroups;
    adp.models.Adp = MockADPModel;

    adp.wordpress = {};
    adp.wordpress.getMenusBehavior = 0;
    adp.wordpress.getMenus = () => new Promise((RES, REJ) => {
      if (adp.shouldCrash.wordpressGetMenus === false) {
        const obj = {
          menus: [
            { items: [{ object_id: 1 }, { object_id: 2 }] },
            { items: [{ object_id: 3 }] },
            { items: [{ object_id: 3 }, { object_id: 4 }, { object_id: 5 }] },
          ],
        };
        RES(obj);
      }
      const mockError = 'mockError';
      REJ(mockError);
    });

    adp.migration = {};
    adp.migration.injectContentPermissionFromWordpress = require('./injectContentPermissionFromWordpress');
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  afterEach(() => {
    global.adp = null;
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('A simple successful case.', (done) => {
    adp.migration.injectContentPermissionFromWordpress()
      .then((ACTION) => {
        expect(ACTION).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ adp.wordpress.getMenus ] crashes.', (done) => {
    adp.shouldCrash.wordpressGetMenus = true;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ updateGroup @ adp.rbac.GroupsController ] crashes.', (done) => {
    adp.shouldCrash.GroupsControllerUpdateGroup = true;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ indexGroups @ adp.models.RBACGroups ] crashes.', (done) => {
    adp.shouldCrash.RBACGroupsIndexGroups = true;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ fetchDefaultGroups @ adp.rbac.GroupsController ] crashes.', (done) => {
    adp.shouldCrash.fetchDefaultGroups = true;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ getGroupByIds @ adp.models.RBACGroups ] returns with a different sort.', (done) => {
    adp.alternativeAnswer.RBACGroupsGetGroupByIds = 1;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ modelsADPcheckIfPermissionGroupsAreNotReal @ adp.models.Adp ] crashes.', (done) => {
    adp.shouldCrash.modelsADPcheckIfPermissionGroupsAreNotReal = true;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('If [ modelsADPcheckIfPermissionGroupsAreNotReal @ adp.models.Adp ] returns empty.', (done) => {
    adp.alternativeAnswer.modelsADPcheckIfPermissionGroupsAreNotReal = 1;
    adp.migration.injectContentPermissionFromWordpress()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
