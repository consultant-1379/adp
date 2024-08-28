const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const data = require('../test.data.js');

const portal = new PortalPrivateAPI();

describe('Testing preview of Rbac logic for users', () => {
  let microserviceIDServiceOwner;

  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('User from default Zid group, on preview should return empty array of MS', async () => {
    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAssets = responsePreviewPost.body.data.etarase.allowed.assets;

    expect(allowedAssets.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Assigning admin user to default Zid group, on preview should return he is an admin', async () => {
    const responsePreviewPost = await portal.rbacPreview('etasase');
    const userisAdmin = responsePreviewPost.body.data.etasase.admin;

    expect(responsePreviewPost.code).toBe(200);
    expect(userisAdmin).toBe(true);
  });

  it('Assigning user of default Zid group domain admin rights, on preview should return list of MS from that domain', async () => {
    const groupData = {
      'group-id': 3,
      'item-id': 4,
      admin: {
        etarase: {
          notification: [
            'create',
            'update',
          ],
        },
      },
    };
    const assignDomainAdmin = await portal.createDomainPermissionforUser(groupData);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedDomainAssets = responsePreviewPost.body.data.etarase.allowed.assets.includes('45e7f4f992afe7bbb62a3391e500ffb1');

    expect(assignDomainAdmin.code).toBe(200);
    expect(responsePreviewPost.code).toBe(200);
    expect(allowedDomainAssets).toBe(true);
  });


  it('Create MS which belongs to COS domain, user in Zid group, on preview should have access to new MS', async () => {
    const msData = data.demoService_Owner_Test;
    microserviceIDServiceOwner = await portal.createMS(msData);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAssets = responsePreviewPost.body.data.etarase.allowed.assets
      .includes(microserviceIDServiceOwner);

    expect(responsePreviewPost.code).toBe(200);
    expect(allowedAssets).toBe(true);
  });

  it('Update MS change domain from COS, user in Zid group, on preview should not have access to new MS', async () => {
    const msData = data.demoService_Owner_Test;
    msData.domain = 3;
    const microserviceID = await portal.readMicroserviceId('test-ms-service-owner');
    microserviceIDServiceOwner = await portal.updateMS(msData, microserviceID);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAssets = responsePreviewPost.body.data.etarase.allowed.assets
      .includes(microserviceID);

    expect(microserviceIDServiceOwner.code).toBe(200);
    expect(responsePreviewPost.code).toBe(200);
    expect(allowedAssets).toBe(false);
  });


  it('Delete domain user rights from user in Zid group, on preview should not find MS related to that domain', async () => {
    const groupData = {
      'group-id': 3,
      'item-id': 4,
      admin: {
        etarase: {
          notification: [
            'create',
            'update',
          ],
        },
      },
    };
    const deleteDomainAdmin = await portal.deleteDomainPermissionforUser(groupData);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAssets = responsePreviewPost.body.data.etarase.allowed.assets.includes('45e7f4f992afe7bbb62a3391e500ffb1');

    expect(deleteDomainAdmin.code).toBe(200);
    expect(responsePreviewPost.code).toBe(200);
    expect(allowedAssets).toBe(false);
  });

  it('Update MS add service owner rights, user in Zid group, on preview should have access to MS', async () => {
    const msData = data.demoService_Owner_Test;
    msData.team = [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'etarase',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('test-ms-service-owner');
    const microserviceIDOwner = await portal.updateMS(msData, microserviceID);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAssets = responsePreviewPost.body.data.etarase.allowed.assets
      .includes(microserviceID);


    expect(microserviceIDOwner.code).toBe(200);
    expect(responsePreviewPost.code).toBe(200);
    expect(allowedAssets).toBe(true);
  });

  it('Update MS remove service owner rights, user in Zid group, on preview should have access to MS', async () => {
    const msData = data.demoService_Owner_Test;
    msData.team = [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'etesuse',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('test-ms-service-owner');
    const microserviceIDOwner = await portal.updateMS(msData, microserviceID);

    const responsePreviewPost = await portal.rbacPreview('etarase');
    const allowedAsset = responsePreviewPost.body.data.etarase.allowed.assets
      .includes(microserviceID);


    expect(microserviceIDOwner.code).toBe(200);
    expect(responsePreviewPost.code).toBe(200);
    expect(allowedAsset).toBe(false);
  });

  it('User from static group, on preview should get access to Assembly from that group', async () => {
    const groupName = 'Allow only specific assets with Assembly';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '64072257da70c7000745ca00',
          type: 'asset',
          name: 'Allow new assets with static perm incl assembly',
          dynamic: null,
          exception: null,
          static: ['17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500eaui'],
        },
        {
          _id: '6093f7e50806000008e20127',
          type: 'content',
          name: 'Allow content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(200);

    await portal.updateUserWithPermissionGroup([groupID], 'wtesuse');
    const responsePreviewPost = await portal.rbacPreview('wtesuse');
    const allowedAssets = responsePreviewPost.body.data.wtesuse.allowed.assets;

    const allowedAutoAssembly = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500eaui');

    expect(allowedAutoAssembly).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500eaui: ${JSON.stringify(allowedAssets)}`).toBe(true);

    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Update group to remove assebmly, user on preview should should not get access to assembly', async (done) => {
    const groupName = 'Allow only specific assets with Assembly';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '64072257da70c7000745ca00',
          type: 'asset',
          name: 'Allow new assets with static perm incl assembly',
          dynamic: null,
          exception: null,
          static: ['17e57f6cea1b5a673f8775e6cf023344'],
        },
        {
          _id: '6093f7e50806000008e20127',
          type: 'content',
          name: 'Allow content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };


    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'wtesuse');

    expect(responseGroupPut.code)
      .withContext(`Expecting a 200 Server Status Code when updating a group, got ${responseGroupPut.code} :: ${JSON.stringify(responseGroupPut)}`)
      .toBe(200);

    const responsePreviewPost = await portal.rbacPreview('wtesuse');
    const allowedAssets = responsePreviewPost.body.data.wtesuse.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoAsset = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500eaui');

    expect(allowedAutoMSID1)
      .withContext(`The allowedAssets should includes 17e57f6cea1b5a673f8775e6cf023344 :: ${JSON.stringify(allowedAssets)}`)
      .toBe(true);

    expect(allowedAutoAsset)
      .withContext(`The allowedAssets should includes 45e7f4f992afe7bbb62a3391e500eaui :: ${JSON.stringify(allowedAssets)}`)
      .toBe(false);

    expect(allowedAssets.length)
      .withContext(`The allowedAssets length should be greater than zero :: ${JSON.stringify(allowedAssets)}`)
      .toBeGreaterThan(0);

    expect(responsePreviewPost.code)
      .withContext(`Expecting a 200 Server Status Code when access rbacPreview of etapase, got ${responsePreviewPost.code} :: ${JSON.stringify(responsePreviewPost)}`)
      .toBe(200);

    done();
  });

  it('User from default Internal Users Group(eterase), on preview should return array of MS', async () => {
    const groupName = 'Internal Users Group';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'eterase');
    const responsePreviewPost = await portal.rbacPreview('eterase');
    const allowedAssets = responsePreviewPost.body.data.eterase.allowed.assets;

    const allowedAutoMSMin = allowedAssets.includes('1a319091a57a0586ea21997610402790');
    const allowedAutoMSMax = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500ffb1');

    expect(allowedAutoMSMin).withContext(`The return should be Truthy for  1a319091a57a0586ea21997610402790: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAutoMSMax).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500ffb1: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });


  it('User from default Internal Users Group(wtesuse), on preview should return array of MS/Assemblies', async () => {
    const groupName = 'allow All Assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe7e',
          type: 'asset',
          name: 'Allow all assets perm',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          _id: '6093f7e50806000008e20127',
          type: 'content',
          name: 'Allow content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'wtesuse');

    expect(responseGroupPut.code)
      .withContext(`Expecting a 200 Server Status Code when updating a group, got ${responseGroupPut.code} :: ${JSON.stringify(responseGroupPut)}`)
      .toBe(200);
    const responsePreviewPost = await portal.rbacPreview('wtesuse');

    const allowedAssets = responsePreviewPost.body.data.wtesuse.allowed.assets;

    const allowedAutoMSMin = allowedAssets.includes('1a319091a57a0586ea21997610402790');
    const allowedAutoMSMax = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500ffb1');
    const allowedAutoAssembly = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500eaui');

    expect(allowedAutoMSMin).withContext(`The return should be Truthy for  1a319091a57a0586ea21997610402790: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAutoMSMax).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500ffb1: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAutoAssembly).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500eaui: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Update user to permission group with exceptions, on preview should not get assembly', async (done) => {
    const groupName = 'Allow new assets with exc incl assembly';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '64072244da70c7000745c9fe',
          type: 'asset',
          name: 'Allow new assets with exc incl assembly',
          dynamic: [],
          exception: ['17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500eaui'],
          static: null,
        },
        {
          _id: '6093f7e50806000008e20127',
          type: 'content',
          name: 'Allow content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };


    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'wtesuse');

    expect(responseGroupPut.code)
      .withContext(`Expecting a 200 Server Status Code when updating a group, got ${responseGroupPut.code} :: ${JSON.stringify(responseGroupPut)}`)
      .toBe(200);

    const responsePreviewPost = await portal.rbacPreview('wtesuse');
    const allowedAssets = responsePreviewPost.body.data.wtesuse.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoAsset = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500eaui');

    expect(allowedAutoMSID1)
      .withContext(`The allowedAssets should not includes 17e57f6cea1b5a673f8775e6cf023344 :: ${JSON.stringify(allowedAssets)}`)
      .toBe(false);

    expect(allowedAutoAsset)
      .withContext(`The allowedAssets should not includes 45e7f4f992afe7bbb62a3391e500eaui :: ${JSON.stringify(allowedAssets)}`)
      .toBe(false);

    expect(allowedAssets.length)
      .withContext(`The allowedAssets length should be greater than zero :: ${JSON.stringify(allowedAssets)}`)
      .toBeGreaterThan(0);

    expect(responsePreviewPost.code)
      .withContext(`Expecting a 200 Server Status Code when access rbacPreview of etapase, got ${responsePreviewPost.code} :: ${JSON.stringify(responsePreviewPost)}`)
      .toBe(200);

    done();
  });

  it('Update group with with exceptions, on preview should get assembly', async (done) => {
    const groupName = 'Allow new assets with exc incl assembly';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '64072244da70c7000745c9fe',
          type: 'asset',
          name: 'Allow new assets with exceptions perm incl assembly',
          dynamic: [],
          exception: ['17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500egpd'],
          static: null,
        },
        {
          _id: '6093f7e50806000008e20127',
          type: 'content',
          name: 'Allow content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };


    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'wtesuse');

    expect(responseGroupPut.code)
      .withContext(`Expecting a 200 Server Status Code when updating a group, got ${responseGroupPut.code} :: ${JSON.stringify(responseGroupPut)}`)
      .toBe(200);

    const responsePreviewPost = await portal.rbacPreview('wtesuse');
    const allowedAssets = responsePreviewPost.body.data.wtesuse.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoAsset = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500eaui');

    expect(allowedAutoMSID1)
      .withContext(`The allowedAssets should not includes 17e57f6cea1b5a673f8775e6cf023344 :: ${JSON.stringify(allowedAssets)}`)
      .toBe(false);

    expect(allowedAutoAsset)
      .withContext(`The allowedAssets should includes 45e7f4f992afe7bbb62a3391e500eaui :: ${JSON.stringify(allowedAssets)}`)
      .toBe(true);

    expect(allowedAssets.length)
      .withContext(`The allowedAssets length should be greater than zero :: ${JSON.stringify(allowedAssets)}`)
      .toBeGreaterThan(0);

    expect(responsePreviewPost.code)
      .withContext(`Expecting a 200 Server Status Code when access rbacPreview of etapase, got ${responsePreviewPost.code} :: ${JSON.stringify(responsePreviewPost)}`)
      .toBe(200);

    done();
  });

  it('User from default Eid(etesuse) group removed from service owners, on preview should have access to that MS', async () => {
    const msData = data.demoService_Owner_Test;
    msData.team = [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('test-ms-service-owner');
    await portal.updateMS(msData, microserviceID);

    const responsePreviewPost = await portal.rbacPreview('etesuse');
    const allowedAssets = responsePreviewPost.body.data.etesuse.allowed.assets;
    const allowedAsset = allowedAssets.includes(microserviceID);

    expect(allowedAsset).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('User from static group, on preview should get access to MS from that group', async () => {
    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');

    expect(allowedAutoMSID1).withContext(`The return should be Truthy for  17e57f6cea1b5a673f8775e6cf023344: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAutoMSID2).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500e71b: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });

  it('Remove MS from static group, user on preview should not get access to removed MS', async () => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: [
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
          ],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'etapase');

    expect(responseGroupPut.code).toBe(200);

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');

    expect(allowedAutoMSID1).withContext(`The return should be Truthy for  17e57f6cea1b5a673f8775e6cf023344: ${JSON.stringify(allowedAssets)}`).toBe(false);
    expect(allowedAutoMSID2).withContext(`The return should be Truthy for  45e7f4f992afe7bbb62a3391e500e71b: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);
  });


  it('Remove Assembly from static group, user on preview should not get access to removed assembly', async () => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: [
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
          ],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).withContext(`The return code should be 200, got  ${JSON.stringify(responseGroupPut.code)}`).toBe(200);

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');
    const allowedAutoAssembly = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500egpd');

    expect(allowedAutoMSID1).withContext(`The return should be Falsy for 17e57f6cea1b5a673f8775e6cf023344: ${JSON.stringify(allowedAssets)}`).toBe(false);
    expect(allowedAutoMSID2).withContext(`The return should be Truthy for 45e7f4f992afe7bbb62a3391e500e71b: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAutoAssembly).withContext(`The return should be Falsy for 45e7f4f992afe7bbb62a3391e500egpd: ${JSON.stringify(allowedAssets)}`).toBe(false);
    expect(allowedAssets.length).not.toBe(0);
  });

  it('Delete MS which belongs to static group, user on preview should get 404 as MS was deleted', async () => {
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-deleted');
    const microserviceIDdelete = await portal.deleteMS(microserviceID);

    const responsePreviewPost = await portal.rbacPreviewforTarget('etapase', '45e7f4f992afe7bbb62a3391e5011e0p');

    expect(responsePreviewPost.code).toBe(404);
    expect(microserviceIDdelete.code).toBe(200);
  });


  it('Update group to dynamic, user on preview should get access to appropriate MS', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: [
            {
              _id: '49bfab89e2ab4b291d84b4dd7c058f1f',
              'group-id': 2,
              group: 'Service Category',
              slug: 'service_category',
              type: 'group',
              'test-id': 'group-service-category',
              order: 1,
              'show-as-filter': true,
              items: [
                {
                  _id: '49bfab89e2ab4b291d84b4dd7c031078',
                  'select-id': 2,
                  type: 'item',
                  name: 'ADP Reusable Services',
                  desc: 'Microservices providing complementary functions that different applications could benefit from. They are NOT directly developed and maintained by the ADP Program.',
                  'group-id': 2,
                  'test-id': 'filter-adp-reusable-services',
                  order: 2,
                },
                {
                  _id: '49bfab89e2ab4b291d84b4dd7c03256c',
                  'select-id': 3,
                  type: 'item',
                  name: 'ADP Domain Specific Services',
                  desc: 'Microservices providing functions that are considered common in a specific application domain. They can be used by multiple applications within the same domain.',
                  'group-id': 2,
                  'test-id': 'filter-adp-domain-specific-services',
                  order: 3,
                },
              ],
            },
          ],
          exception: ['17e57f6cea1b5a673f8775e6cf023344'],
          static: null,
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(200);

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500ffb1');

    expect(allowedAutoMSID1).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('User on preview should not get access to MS from exeption in dynamic group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;
    const allowedAutoMSID2 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');

    expect(allowedAutoMSID2).toBe(false);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('Change Service category for MS so now it is not in a dynamic group, on preview should not have access to that MS', async (done) => {
    const msData = data.autoMSTestChangeCategory;
    msData.service_category = 5;
    msData.domain = 4;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-change-category');
    await portal.updateMS(msData, microserviceID);

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;
    const allowedAsset = allowedAssets.includes(microserviceID);

    expect(allowedAsset).toBe(false);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('User on preview should not get access to deleted MS from dynamic group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e5011e0p');

    expect(allowedAutoMSID2).toBe(false);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('Update group to static, user on preview should get access to appropriate MS and assembly', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: [
            '17e57f6cea1b5a673f8775e6cf023344',
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
          ],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };


    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    await portal.updateUserWithPermissionGroup([groupID], 'etapase');

    expect(responseGroupPut.code)
      .withContext(`Expecting a 200 Server Status Code when updating a group, got ${responseGroupPut.code} :: ${JSON.stringify(responseGroupPut)}`)
      .toBe(200);

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');

    expect(allowedAutoMSID1)
      .withContext(`The allowedAssets should includes 17e57f6cea1b5a673f8775e6cf023344 :: ${JSON.stringify(allowedAssets)}`)
      .toBe(true);

    expect(allowedAssets.length)
      .withContext(`The allowedAssets length should be greater than zero :: ${JSON.stringify(allowedAssets)}`)
      .toBeGreaterThan(0);

    expect(responsePreviewPost.code)
      .withContext(`Expecting a 200 Server Status Code when access rbacPreview of etapase, got ${responsePreviewPost.code} :: ${JSON.stringify(responsePreviewPost)}`)
      .toBe(200);

    done();
  });


  it('When User belongs to two groups he should have access to all items from all groups', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('etapaze');
    const allowedAssets = responsePreviewPost.body.data.etapaze.allowed.assets;
    const allowedAutoMSID2 = allowedAssets.includes('bc997cfa3d699fb03b7561c9c1002df3');
    const allowedAutoMSID3 = allowedAssets.includes('419b7f75c7ab2427937eec161d0ea844');

    expect(allowedAutoMSID2).toBe(true);
    expect(allowedAutoMSID3).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });


  it('When user belongs to two groups with exceptions on one of them, he should have access to those assets', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('etapaze');
    const allowedAssets = responsePreviewPost.body.data.etapaze.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');

    expect(allowedAutoMSID1).toBe(true);
    expect(allowedAutoMSID2).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('Remove MS from static group, user with two groups should have access to updated items', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: [
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
          ],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(200);

    const responsePreviewPost = await portal.rbacPreview('etapaze');
    const allowedAssets = responsePreviewPost.body.data.etapaze.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');
    const allowedAutoAssembly = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500egpd');
    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');
    const allowedAutoMSID3 = allowedAssets.includes('bc997cfa3d699fb03b7561c9c1002df3');
    const allowedAutoMSID4 = allowedAssets.includes('419b7f75c7ab2427937eec161d0ea844');


    expect(allowedAutoMSID1).toBe(false);
    expect(allowedAutoAssembly).toBe(false);
    expect(allowedAutoMSID2).toBe(true);
    expect(allowedAutoMSID3).toBe(true);
    expect(allowedAutoMSID4).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('Another Update group to static, user on preview should get access to appropriate MS', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupID = await portal.getPermissionGroupID(groupName);

    const groupData = {
      _id: groupID,
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: [
            '17e57f6cea1b5a673f8775e6cf023344',
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
          ],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);

    expect(responseGroupPut.code).toBe(200);
    await portal.updateUserWithPermissionGroup([groupID], 'etapase');

    const responsePreviewPost = await portal.rbacPreview('etapase');
    const allowedAssets = responsePreviewPost.body.data.etapase.allowed.assets;
    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');

    expect(allowedAutoMSID1).withContext(`The return should be Truthy for  17e57f6cea1b5a673f8775e6cf023344: ${JSON.stringify(allowedAssets)}`).toBe(true);
    expect(allowedAssets.length).not.toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('User assigned to a group with limited permission, on preview should get items from that group', async (done) => {
    const groupName = 'Allow specific content';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedAContentID3 = allowedContents.includes('9822');
    const allowedContentID4 = allowedContents.includes('9221');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedAContentID3).toBe(true);
    expect(allowedContentID4).toBe(false);
    expect(allowedContents.length).toBe(3);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('User assigned to a group without content permissions, on preview should get empty array of permissions', async (done) => {
    const groupName = 'No assets allowed';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');

    expect(allowedContentID1).toBe(false);
    expect(allowedContentID2).toBe(false);
    expect(allowedContents.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);

    done();
  });

  it('User assigned to a without content permissions, on preview should not allowed to see item', async (done) => {
    const responsePreviewPost = await portal.rbacPreviewforTarget('emesuse', '9824');

    expect(responsePreviewPost.code).toBe(403);
    done();
  });

  it('User assigned to two groups: without content permissions and with permissions, on preview should get list of IDs', async (done) => {
    const groupNameNoPerm = 'No assets allowed';
    const groupNamePerm = 'Allow specific content';
    const groupIDNoPerm = await portal.getPermissionGroupID(groupNameNoPerm);
    const groupIDPerm = await portal.getPermissionGroupID(groupNamePerm);
    await portal.updateUserWithPermissionGroup([groupIDNoPerm, groupIDPerm], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedContentID3 = allowedContents.includes('9221');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContentID3).toBe(false);
    expect(allowedContents.length).toBe(3);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to  one AutoAll group, on preview should get list of IDs', async (done) => {
    const groupNamePerm = 'Content permission AutoAll 1';
    const groupIDPerm = await portal.getPermissionGroupID(groupNamePerm);
    await portal.updateUserWithPermissionGroup([groupIDPerm], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('91');
    const allowedContentID2 = allowedContents.includes('3344');
    const allowedContentID3 = allowedContents.includes('9221');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContentID3).toBe(true);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to two groups: without content permissions and with permissions auto all, on preview should get list of IDs', async (done) => {
    const groupNameNoPerm = 'No assets allowed';
    const groupNamePerm = 'Content permission AutoAll 1';
    const groupIDNoPerm = await portal.getPermissionGroupID(groupNameNoPerm);
    const groupIDPerm = await portal.getPermissionGroupID(groupNamePerm);
    await portal.updateUserWithPermissionGroup([groupIDNoPerm, groupIDPerm], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('91');
    const allowedContentID2 = allowedContents.includes('3344');
    const allowedContentID3 = allowedContents.includes('9221');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContentID3).toBe(true);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to a Internal Users Group with all permissions and AutoAll group, on preview should get list of items allowed', async (done) => {
    const groupName = 'Internal Users Group';
    const groupNamePerm = 'Content permission AutoAll 1';
    const groupID = await portal.getPermissionGroupID(groupName);
    const groupIDPerm = await portal.getPermissionGroupID(groupNamePerm);
    await portal.updateUserWithPermissionGroup([groupID, groupIDPerm], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedContentID3 = allowedContents.includes('91');
    const allowedContentID4 = allowedContents.includes('3344');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContentID3).toBe(true);
    expect(allowedContentID4).toBe(true);
    expect(allowedContents.length).toBeGreaterThan(50);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to a Internal Users Group with all permissions, on preview should get list of items allowed', async (done) => {
    const groupName = 'Internal Users Group';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContents.length).toBeGreaterThan(50);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to a Internal Users Group with all permissions, on preview should get allowed to see content items', async (done) => {
    const responsePreviewPost = await portal.rbacPreviewforTarget('emesuse', '9824');

    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to a group with dynamic all content permissions, on preview should get list of items allowed', async (done) => {
    const groupName = 'Content permission static to dynamic';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedContentID3 = allowedContents.includes('3346');
    const allowedContentID4 = allowedContents.includes('9824');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedContentID3).toBe(true);
    expect(allowedContentID4).toBe(true);
    expect(allowedContents.length).toBeGreaterThan(50);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('User assigned to a group without content permissions static, on preview should get empty array of permissions', async (done) => {
    const groupName = 'No assets allowed';
    const groupID = await portal.getPermissionGroupID(groupName);
    await portal.updateUserWithPermissionGroup([groupID], 'emesuse');
    const responsePreviewPost = await portal.rbacPreview('emesuse');
    const allowedContents = responsePreviewPost.body.data.emesuse.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');

    expect(allowedContentID1).toBe(false);
    expect(allowedContentID2).toBe(false);
    expect(allowedContents.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });
});

describe('Testing preview of Rbac logic for the groups', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Preview for default Zid group should return empty array of MS', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('61f269c678d99c0007f79db3');

    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    expect(allowedAssets.length).toBe(0);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for default Internal Users Group should return array of MS', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('602e415e01f5f70007a0a950');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID2 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e500e71b');
    const allowedAutoMSID3 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e5011ff8');

    expect(allowedAssets.length).toBeGreaterThan(0);
    expect(allowedAutoMSID2).toBe(true);
    expect(allowedAutoMSID3).toBe(true);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for group with exception should reject with 403 when trying to target that asset ', async (done) => {
    const responsePreviewPost = await portal.rbacPreviewforTarget('6065a54b9dadae00068c2e57', '45e7f4f992afe7bbb62a3391e500e71b');


    expect(responsePreviewPost.code).toBe(403);
    done();
  });

  it('Preview for for  static group should allow items inside of the group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('603e4ed5369e66969a7c003e');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('17e57f6cea1b5a673f8775e6cf023344');

    expect(allowedAutoMSID1).toBe(true);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for for static group should not allow items outside of the group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('603e4ed5369e66969a7c003e');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e5010c3b');

    expect(allowedAutoMSID1).toBe(false);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for for dynamic group should allow items inside of the group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('603e4fb4369e66969a7c00a5');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('ceb54fdc6969a28152cad144b32d39f8');

    expect(allowedAutoMSID1).toBe(true);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for for dynamic group should not allow items outside of the group', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('603e4fb4369e66969a7c00a5');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('45e7f4f992afe7bbb62a3391e5011e0d');

    expect(allowedAutoMSID1).toBe(false);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for for dynamic group should not allow items from exceptions', async (done) => {
    const responsePreviewPost = await portal.rbacPreview('603e4fb4369e66969a7c00a5');
    const allowedAssets = responsePreviewPost.body.data.allowed.assets;

    const allowedAutoMSID1 = allowedAssets.includes('5e73aca053e6f18355ebd74b11028818');

    expect(allowedAutoMSID1).toBe(false);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for default Internal Users Group should return full array of content permissions', async (done) => {
    const groupName = 'Internal Users Group';
    const groupID = await portal.getPermissionGroupID(groupName);
    const responsePreviewPost = await portal.rbacPreview(groupID);
    const allowedAssets = responsePreviewPost.body.data.allowed.contents;

    expect(allowedAssets.length).toBeGreaterThan(50);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for group with limitet content permission, should allow to see item in the group', async (done) => {
    const groupName = 'Allow specific content';
    const groupID = await portal.getPermissionGroupID(groupName);
    const responsePreviewPost = await portal.rbacPreviewforTarget(groupID, '9824');


    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Preview for group with limitet content permission, should not allow to see item outside of the group', async (done) => {
    const groupName = 'Allow specific content';
    const groupID = await portal.getPermissionGroupID(groupName);
    const responsePreviewPost = await portal.rbacPreviewforTarget(groupID, '9221');


    expect(responsePreviewPost.code).toBe(403);
    done();
  });
});
