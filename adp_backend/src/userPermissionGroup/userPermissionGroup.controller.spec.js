// ============================================================================================= //
/**
* Unit test for [ adp.userPermissionGroup.userPermissionGroup.controller ]
* @author Omkar Sadegaonkar [zsdgmkr], Veerender Voskula
*/
// ============================================================================================= //
class MockAdpClass {
  updateUserPermissionGroup() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockAdpResp.updateUserPermissionGroup);
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
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }

  deletePermissionGroupFromUsers() {
    return new Promise((RES, REJ) => {
      if (adp.dbError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockResp);
      return true;
    });
  }


  getUsersByPermissionGroup() {
    return new Promise((RES, REJ) => {
      if (adp.dbUsersByPermGroupError) {
        REJ(new Error('Model Failure during fetch of users that have no permission groups'));
        return false;
      }
      RES(adp.mockAdpResp.getUsersByPermissionGroup);
      return true;
    });
  }

  updatePermissionGroupforMultipleUsers() {
    return new Promise((RES, REJ) => {
      if (!adp.mockAdpResp.updatePermissionGroupforMultipleUsers.res) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockAdpResp.updatePermissionGroupforMultipleUsers.data);
      return true;
    });
  }
}

class MockRBACClass {
  indexGroups() {
    return new Promise((RES) => {
      RES(adp.mockRespGroups);
      return true;
    });
  }
}

class MockRBACGroupClass {
  getGroups() {
    return new Promise((RES, REJ) => {
      if (adp.dbGroupFetchError) {
        REJ(new Error('internal server error'));
        return false;
      }
      RES(adp.mockRespGroups.docs);
      return true;
    });
  }

  fetchDefaultGroups() {
    return new Promise((RES, REJ) => {
      if (adp.dbDefaultGroupsFetchError) {
        REJ(new Error('Failure when fetching the default permission groups'));
        return false;
      }
      RES(adp.mockRespGroups.docs);
      return true;
    });
  }
}

describe('Testing [ adp.userPermissionGroup.userPermissionGroup.controller ] behavior.', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.models.RBACGroups = MockRBACClass;
    adp.echoLog = text => text;
    adp.mockRbac = [{ _id: '606ed2a1aaf1c32a0c73f9b0', name: 'mock name', type: 'group' }];
    adp.mockAdpResp = {
      updateUserPermissionGroup: { ok: true },
      getUsersByPermissionGroup: { docs: [{ _id: 'esupse' }] },
      updatePermissionGroupforMultipleUsers: {
        res: true,
        data: { ok: true, modifiedCount: 1 },
      },
    };
    adp.mockResp = { ok: true };
    adp.GroupName = '606ed2a1aaf1c32a0c73f9b0';
    adp.getDefaultRBACGroupID = () => adp.GroupName;
    adp.mockGroupIds = ['606ed2a1aaf1c32a0c73f9b0'];
    adp.mockRespGroups = { docs: [{ _id: 'mockId', name: 'mock name', type: 'group' }] };
    adp.rbac = {};
    adp.rbac.GroupsController = MockRBACGroupClass;
    adp.controller = require('./userPermissionGroup.controller');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('updateUserPermissionGroup: should resolve with the user group being successfully updated', async (done) => {
    adp.mockRespGroups = { docs: [{ _id: 'mo606ed2a1aaf1c32a0c73f9b0ckId', name: 'mock name', type: 'group' }] };
    await adp.controller.updateUserPermissionGroup('mockID', ['606ed2a1aaf1c32a0c73f9b0'])
      .then((result) => {
        expect(result.ok).toBeTruthy();
        done();
      }).catch(() => done.fail());
  });

  it('updateUserPermissionGroup: should reject with error code 500 when the user group update indicates the update did not occur', async (done) => {
    adp.mockRespGroups = { docs: [{ _id: '606ed2a1aaf1c32a0c73f9b0', name: 'mock name', type: 'group' }] };
    adp.mockAdpResp.updateUserPermissionGroup.ok = false;
    await adp.controller.updateUserPermissionGroup('mockID', adp.mockGroupIds)
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('updateUserPermissionGroup: error response in update if group id is invalid', async (done) => {
    adp.mockRespGroups = { docs: [{ _id: 'mockId', name: 'mock name', type: 123 }] };
    await adp.controller.updateUserPermissionGroup('mockID', ['mock'])
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(400);
        done();
      });
  });

  it('updateUserPermissionGroup: error response in update: db error', async (done) => {
    adp.mockResp = { ok: false };
    adp.dbError = true;
    await adp.controller.updateUserPermissionGroup('mockID', adp.mockGroupIds)
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUserPermissionGroup: error response if no group present', async (done) => {
    adp.mockResp = { ok: false };
    adp.mockRbac = [];
    await adp.controller.updateUserPermissionGroup('mockID', [])
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(400);
        done();
      });
  });

  it('updateUserPermissionGroup: error response problem with db', async (done) => {
    adp.dbError = true;
    await adp.controller.updateUserPermissionGroup('mockID', adp.mockGroupIds)
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: error response problem with db', async (done) => {
    adp.dbError = true;
    await adp.controller.updateUsersPermissionGroup('mockID')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: error response problem with deleting groups', async (done) => {
    adp.dbGroupFetchError = true;
    adp.dbError = true;
    await adp.controller.updateUsersPermissionGroup('mockRbacID')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: error response in update', async (done) => {
    adp.mockResp = { ok: false };
    await adp.controller.updateUsersPermissionGroup('mockID')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: failed return update response', async (done) => {
    adp.getDefaultRBACGroupID = () => 'wrong';
    await adp.controller.updateUsersPermissionGroup('mockID')
      .then((EXPECTEDRESPONSE) => {
        expect(EXPECTEDRESPONSE.ok).toBeTruthy();
        done.fail();
      }).catch((error) => {
        expect(error.message).toBe('Failure to match a default group to a user');
        done(error);
      });
  });

  it('updateUsersPermissionGroup: error response if no group present', async (done) => {
    adp.mockResp = { ok: false };
    adp.mockRbac = [];
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: error response from setDefaultsUserWithoutGroup', async (done) => {
    adp.mockResp = { ok: false };
    adp.mockRbac = [];
    adp.dbUsersByPermGroupError = true;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('Error in [ dbModel.deletePermissionGroupFromUsers ]');
        done();
      });
  });

  it('updateUsersPermissionGroup: error response from alignUserWithNoGroupToDefaultGroups', async (done) => {
    adp.mockResp = { ok: false };
    adp.mockRbac = [];
    adp.dbDefaultGroupsFetchError = true;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('Error in [ dbModel.deletePermissionGroupFromUsers ]');
        done();
      });
  });

  it('updateUsersPermissionGroup: Failure to match a default group to a user', async (done) => {
    adp.mockResp = { ok: true };
    adp.mockRbac = [];
    adp.getDefaultRBACGroupID = () => 'wrong';
    await adp.controller.updateUsersPermissionGroup('ckId')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('Failure to match a default group to a user');
        done();
      });
  });

  it('updateUsersPermissionGroup:  match a default group to a user but unable to update', async (done) => {
    adp.mockResp = { ok: true };
    adp.mockRbac = [];
    adp.dbError = true;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('internal server error');
        done();
      });
  });

  it('updateUsersPermissionGroup:  match a default group to a user and able to update', async (done) => {
    adp.mockResp = { ok: true };
    adp.mockRbac = [];
    adp.getDefaultRBACGroupID = () => 'mockId';
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => {
        done();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        expect(error.message).toEqual('Model Failure during fetch of users that have no permission groups');
        done();
      });
  });

  it('updateUsersPermissionGroup: Should resolve successfully if no users were found without a permission group.', async (done) => {
    adp.mockAdpResp.getUsersByPermissionGroup = { docs: [] };
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then((result) => {
        expect(result.ok).toBeTruthy();
        expect(result.usersFoundWithoutGroups).toBeFalsy();
        expect(result.modifiedCount).toBe(0);
        done();
      }).catch(() => done.fail());
  });

  it('updateUsersPermissionGroup: Should reject with error code 500 if Adp model getUsersByPermissionGroup rejects.', async (done) => {
    adp.dbUsersByPermGroupError = true;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: Should reject with error code 500 if the group controller fetchDefaultGroups rejects.', async (done) => {
    adp.dbDefaultGroupsFetchError = true;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: Should reject with error code 500 if the Adp Model updatePermissionGroupforMultipleUsers response that no update occurred.', async (done) => {
    adp.mockAdpResp.updatePermissionGroupforMultipleUsers.data = { ok: false, modifiedCount: 0 };
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('updateUsersPermissionGroup: Should reject with error code 500 if the Adp Model updatePermissionGroupforMultipleUsers rejects.', async (done) => {
    adp.mockAdpResp.updatePermissionGroupforMultipleUsers.res = false;
    await adp.controller.updateUsersPermissionGroup('mockId')
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });

  it('updateUserPermissionWhenGroupUpdates: error when no group passed', async (done) => {
    adp.mockResp = { ok: false };
    await adp.controller.updateUserPermissionWhenGroupUpdates()
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(400);
        expect(error.message).toEqual('Missing Group data');
        done();
      });
  });

  it('updateUserPermissionWhenGroupUpdates: error response in update', async (done) => {
    adp.mockResp = { ok: false };
    await adp.controller.updateUserPermissionWhenGroupUpdates(adp.mockRbac[0])
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('updateUserPermissionWhenGroupUpdates: success response', async (done) => {
    adp.mockResp = { ok: true };
    await adp.controller.updateUserPermissionWhenGroupUpdates(adp.mockRbac[0])
      .then(() => {
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('updateUserPermissionWhenGroupUpdates: Should reject with error code 500 if the Adp Model updateUserPermissionGroupIfRbacGroupUpdated rejects.', (done) => {
    adp.dbError = true;
    adp.controller.updateUserPermissionWhenGroupUpdates({})
      .then(() => done.fail()).catch((error) => {
        expect(error.code).toBe(500);
        done();
      });
  });
});
// ============================================================================================= //
