const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

const contentEmptyPermission = {
  type: 'content',
  dynamic: null,
  exception: null,
  static: [],
};
const contentEmptyPermissionUpdate = {
  _id: '6093f7e50806000008e20127',
  type: 'content',
  dynamic: null,
  exception: null,
  static: [],
};
const assetEmptyPermission = {
  type: 'asset',
  name: 'No assets allowed perm',
  dynamic: null,
  exception: null,
  static: [],
};
const assetEmptyPermissionUpdate = {
  _id: '603e4c9e369e66969a7bff4e',
  type: 'asset',
  name: 'No assets allowed perm',
  dynamic: null,
  exception: null,
  static: [],
};

describe('Testing permissions groups logic', () => {
  const name = 'group?name=';
  const id = 'group?id=';

  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Should create new group with unique name and description, check on GET if group is created', async (done) => {
    const groupName = 'Test Group Name 1';
    const groupData = {
      name: groupName,
      description: 'Description for Group name 1',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const groupFound = responseGroupGet.body.data.some(group => group.name === groupName && group.description === 'Description for Group name 1');

    expect(groupFound).toBeTruthy();
    expect(responseGroupGet.body.data.length).toBe(1);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should create new group with unique name and without description, check on GET if group is created, no description field', async (done) => {
    const groupName = 'Test Group Name 2';
    const groupData = {
      name: groupName,
      description: '',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);


    const groupFound = responseGroupGet.body.data.some(group => group.name === groupName);
    const filteredGroup = responseGroupGet.body.data.filter(group => group.name === groupName);
    const grouphasDescription = filteredGroup[0].hasOwnProperty('description');

    expect(grouphasDescription).toBeFalsy();
    expect(groupFound).toBeTruthy();
    expect(filteredGroup.length).toBe(1);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should create new group with unique name and  already  existing description, check on GET if group is created', async (done) => {
    const groupName = 'Test Group Name 3';
    const groupData = {
      name: groupName,
      description: 'Description for Group name 1',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const groupFound = responseGroupGet.body.data.some(group => group.name === groupName && group.description === 'Description for Group name 1');

    expect(groupFound).toBeTruthy();
    expect(responseGroupGet.body.data.length).toBe(1);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPost.code).toBe(200);
    done();
  });


  it('Should create new group with unique name and description, check on GET if group is created for next tests', async (done) => {
    const groupName = 'Test Group Name 4';
    const groupData = {
      name: groupName,
      description: 'Description for Group name 4',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const groupFound = responseGroupGet.body.data.some(group => group.name === groupName && group.description === 'Description for Group name 4');

    expect(groupFound).toBeTruthy();
    expect(responseGroupGet.body.data.length).toBe(1);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should fail to create new group with name>50 characters', async (done) => {
    const groupName = 'Test Group Name Long Long Long Long Name Should Fail';
    const groupData = {
      name: groupName,
      description: 'Description for Group Name Should Fail',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create new group  with existing name', async (done) => {
    const groupName = 'Group existing 2';
    const groupData = {
      name: groupName,
      description: 'Description for Group with Existing Name',
      type: 'group',
      permission: [
        assetEmptyPermission,
        contentEmptyPermission,
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create new group  without name', async (done) => {
    const groupData = {};
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should update group with name and description, check on GET if group is updated', async (done) => {
    const groupName = 'Group existing 3';
    const groupNameUpdated = 'Group existing 3 Updated';
    const groupDescriptionUpdated = 'Description for Group existing 3 Updated';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupData = {
      _id: groupID,
      name: groupNameUpdated,
      description: groupDescriptionUpdated,
      type: 'group',
      permission: [
        assetEmptyPermissionUpdate,
        contentEmptyPermissionUpdate,
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(id + groupID);

    const groupFound = responseGroupGet.body.data.some(group => group.name === groupNameUpdated && group.description === groupDescriptionUpdated);

    expect(groupFound).toBeTruthy();
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPut.code).toBe(200);
    done();
  });

  it('Should update group with removed description, check on GET if group is updated', async (done) => {
    const groupName = 'Group existing 4 with desc';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupData = {
      _id: groupID,
      name: groupName,
      description: '',
      type: 'group',
      permission: [
        assetEmptyPermissionUpdate,
        contentEmptyPermissionUpdate,
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(id + groupID);

    const groupFound = responseGroupGet.body.data.some(group => group.name === groupName);
    const filteredGroup = responseGroupGet.body.data.filter(group => group.name === groupName);
    const grouphasDescription = filteredGroup[0].hasOwnProperty('description');

    expect(grouphasDescription).toBeFalsy();
    expect(groupFound).toBeTruthy();
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPut.code).toBe(200);
    done();
  });

  it('Should fail to update group without "type" field', async (done) => {
    const groupName = 'Group existing 4 with desc';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupData = {
      _id: groupID,
      name: groupName,
      permission: [
        assetEmptyPermissionUpdate,
        contentEmptyPermissionUpdate,
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(400);
    done();
  });

  it('Should fail to delete name for already existing group', async (done) => {
    const groupName = 'Group existing 2';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupData = {
      _id: groupID,
      type: 'group',
      permission: [
        assetEmptyPermissionUpdate,
        contentEmptyPermissionUpdate,
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(400);
    done();
  });

  it('Should fail to update name for not existing group', async (done) => {
    const groupName = 'Test Group Name 5';
    const groupData = {
      _id: '12345',
      name: groupName,
      type: 'group',
      permission: [
        assetEmptyPermissionUpdate,
        contentEmptyPermissionUpdate,
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(404);
    done();
  });


  it('Should delete group, check on GET if group is deleted', async (done) => {
    const groupName = 'Group existing 1';
    const groupIDDeleted = await portal.getPermissionGroupID(groupName);
    const responseGroupDelete = await portal.deletePermissionGroup(groupIDDeleted);
    const responseGroupGet = await portal.getPermissionGroup(id + groupIDDeleted);

    expect(responseGroupDelete.code).toBe(200);
    expect(responseGroupGet.code).toBe(404);
    done();
  });

  it('Should fail to delete group with none existing id', async (done) => {
    const responseGroupDelete = await portal.deletePermissionGroup('12345');

    expect(responseGroupDelete.code).toBe(404);
    done();
  });

  it('Should fail to delete default group Internal Users Group', async (done) => {
    const groupID = await portal.getPermissionGroupID('Internal Users Group');
    const responseGroupDelete = await portal.deletePermissionGroup(groupID);

    expect(responseGroupDelete.code).toBe(403);
    done();
  });

  it('Should duplicate group, check on GET if group is created', async (done) => {
    const groupName = 'Group existing 2';
    const groupNameDuplicated = 'Group existing 2 Duplicated';

    const groupID = await portal.getPermissionGroupID(groupName);
    const responseGroupDuplicate = await portal.duplicatePermissionGroup(groupID, groupNameDuplicated);
    const responseGroupduplicateGet = await portal.getPermissionGroup('group');
    const groupFound = responseGroupduplicateGet.body.data.some(group => group.name === groupNameDuplicated);

    expect(groupFound).toBeTruthy();
    expect(responseGroupduplicateGet.code).toBe(200);
    expect(responseGroupDuplicate.code).toBe(200);
    done();
  });

  it('Should duplicate group without name provided, check on GET if group is created', async (done) => {
    const groupName = 'Group existing 2';
    const groupNameDuplicated = 'Group existing 2 Copy';

    const groupID = await portal.getPermissionGroupID(groupName);
    const responseGroupDuplicate = await portal.duplicatePermissionGroup(groupID, null);
    const responseGroupduplicateGet = await portal.getPermissionGroup('group');
    const groupFound = responseGroupduplicateGet.body.data.some(group => group.name === groupNameDuplicated);

    expect(groupFound).toBeTruthy();
    expect(responseGroupduplicateGet.code).toBe(200);
    expect(responseGroupDuplicate.code).toBe(200);
    done();
  });

  it('Should fail to duplicate group for non existing ID', async (done) => {
    const responseGroupDuplicate = await portal.duplicatePermissionGroup('123456', null);

    expect(responseGroupDuplicate.code).toBe(404);
    done();
  });

  it('Should fail to duplicate group when name is not provided and existing name is about 50 characters', async (done) => {
    const groupName = 'Group existing with really really really long name';

    const groupID = await portal.getPermissionGroupID(groupName);
    const responseGroupDuplicate = await portal.duplicatePermissionGroup(groupID, null);

    expect(responseGroupDuplicate.code).toBe(400);
    done();
  });
});
