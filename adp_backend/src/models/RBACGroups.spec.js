/**
* Unit test for [ adp.models.RBACGroups ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/

describe('Testing [ adp.models.RBACGroups ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};
    adp.db.checkIDForArrays = ARRAY => ARRAY;
    adp.db.create = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.findResp = true;
    adp.findFails = false;
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise((resolve, reject) => (adp.findFails ? reject : resolve)(adp.findResp));
    };
    adp.db.aggregate = (dbName, dbSelector) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      return new Promise(resolve => resolve(true));
    };
    adp.db.destroy = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.update = (dbName, dbID) => {
      adp.check.dbName = dbName;
      adp.check.dbID = dbID;
      return new Promise(resolve => resolve(true));
    };
    adp.db.updateMany = (dbName, filter, update, options = {}) => {
      adp.check.dbName = dbName;
      adp.check.filter = filter;
      adp.check.update = update;
      adp.check.options = options;
      return new Promise(resolve => resolve(true));
    };
    adp.models = {};
    adp.models.RBACGroups = require('./RBACGroups');
    adp.ObjectID = require('mongodb').ObjectID;
  });


  afterEach(() => {
    global.adp = null;
  });


  it('indexGroups: Checking the syntax of the query.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    rbacGroupsModel.indexGroups()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('rbacgroups');
        expect(adp.check.dbSelector).toEqual({ type: 'group' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getGroupsByName: Checking the syntax of the query.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    rbacGroupsModel.getGroupsByName('MockName')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('rbacgroups');
        expect(adp.check.dbSelector).toEqual({ name: 'MockName', type: 'group' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getGroupById: Checking the syntax of the query.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    rbacGroupsModel.getGroupById('MockName')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('rbacgroups');
        expect(adp.check.dbSelector).toEqual({ _id: 'MockName', type: 'group' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('getGroupByIds: Checking the syntax of the query.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    rbacGroupsModel.getGroupByIds('MockName')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('rbacgroups');
        expect(adp.check.dbSelector).toEqual({ _id: { $in: ['MockName'] }, type: 'group' });
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('updateGroupIfPossible: fails if document does not exist.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1' };
    adp.findResp = { docs: [] };
    rbacGroupsModel.updateGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp.code).toEqual(404);
        expect(errResp.ok).toEqual(false);
        done();
      });
  });

  it('updateGroupIfPossible: fails if find error.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1' };
    adp.findResp = { docs: [] };
    adp.findFails = true;
    rbacGroupsModel.updateGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        done();
      });
  });

  it('updateGroupIfPossible: fails document exists with same name.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1' };
    adp.findResp = { docs: [{ _id: new adp.ObjectID() }] };
    adp.findFails = false;
    rbacGroupsModel.updateGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        expect(errResp.code).toEqual(400);
        done();
      });
  });

  it('updateGroupIfPossible: update document succesfully.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: '602e415e01f5f70007a0a950' };
    adp.findResp = { docs: [{ _id: new adp.ObjectID('602e415e01f5f70007a0a950') }] };
    adp.findFails = false;
    rbacGroupsModel.updateGroupIfPossible(mockObj)
      .then((resp) => {
        expect(resp).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('createGroupIfPossible: fails if find error.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [] };
    adp.findFails = true;
    rbacGroupsModel.createGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        done();
      });
  });

  it('createGroupIfPossible: fails document exists with same name.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [{}] };
    adp.findFails = false;
    rbacGroupsModel.createGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        expect(errResp.code).toEqual(400);
        done();
      });
  });

  it('createGroupIfPossible: create document succesfully.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    adp.findResp = { docs: [] };
    const mockObj = { _id: '602e415e01f5f70007a0a950' };
    rbacGroupsModel.createGroupIfPossible(mockObj)
      .then((resp) => {
        expect(resp).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteGroupIfPossible: fails if find error.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [] };
    adp.findFails = true;
    rbacGroupsModel.deleteGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        done();
      });
  });

  it('deleteGroupIfPossible: fails document does not exist.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [] };
    adp.findFails = false;
    rbacGroupsModel.deleteGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        expect(errResp.code).toEqual(404);
        done();
      });
  });

  it('deleteGroupIfPossible: fails document is not deletable.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [{ _id: 'id-1', undeletable: true }] };
    adp.findFails = false;
    rbacGroupsModel.deleteGroupIfPossible(mockObj)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        expect(errResp.code).toEqual(403);
        done();
      });
  });

  it('deleteGroupIfPossible: deletes default group document successfully if DELETEDEFAULT parameter is false.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: '602e415e01f5f70007a0a950' };
    adp.findResp = { docs: [{ _id: 'id-1', undeletable: true }] };
    rbacGroupsModel.deleteGroupIfPossible(mockObj, true)
      .then((resp) => {
        expect(resp).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('deleteGroupIfPossible: fails document does not exist with Delete default parameter is true', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const mockObj = { _id: 'id-1', name: 'mockName' };
    adp.findResp = { docs: [] };
    adp.findFails = false;
    rbacGroupsModel.deleteGroupIfPossible(mockObj, true)
      .then(() => {
        done.fail();
      }).catch((errResp) => {
        expect(errResp).toBeDefined();
        expect(errResp.code).toEqual(404);
        done();
      });
  });

  it('deleteGroupIfPossible: delete document succesfully.', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    adp.findResp = { docs: [{ _id: 'id-1', undeletable: false }] };
    const mockObj = { _id: '602e415e01f5f70007a0a950' };
    rbacGroupsModel.deleteGroupIfPossible(mockObj)
      .then((resp) => {
        expect(resp).toBeDefined();
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('cleanContentPermissions: should return successfully, with query param contain objectIds to remove for permission type content static array from type content', (done) => {
    const rbacGroupsModel = new adp.models.RBACGroups();
    const testObjIdArr = ['0', '1'];
    rbacGroupsModel.cleanContentPermissions(testObjIdArr)
      .then(() => {
        expect(true).toBeTruthy();
        expect(adp.check.dbName).toBe('rbacgroups');

        const { type, 'permission.type': permType, 'permission.static': permStatic } = adp.check.filter;

        expect(type).toBe('group');
        expect(permType).toBe('content');
        expect(permStatic.$in[0]).toBe(testObjIdArr[0]);
        expect(permStatic.$in[1]).toBe(testObjIdArr[1]);

        const updateStaticArr = adp.check.update.$pull['permission.$.static'].$in;

        expect(updateStaticArr[0]).toBe(testObjIdArr[0]);
        expect(updateStaticArr[1]).toBe(testObjIdArr[1]);

        done();
      }).catch(() => done.fail());
  });
});
