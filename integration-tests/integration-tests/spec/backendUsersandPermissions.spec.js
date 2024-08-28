// ============================================================================================= //
/**
* [ Integration tests to validate Backend Users & Permissions ]
* @author Akshay Mungekar
*/
const urljoin = require('url-join');
const request = require('request');
const config = require('../test.config.js');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
const login = require('../endpoints/login.js');
const promiseWrapper = require('./promiseWrapper');

let groupNameZUpdated3;
let groupNameRUpdated3;
const groupNameUpdated = 'EPermissions Group 3 Update';
const groupNameUpdatedX = 'XPermissions update Group 3';
const groupNameXPerm3 = 'XPermissions Testing Group 3';
const groupNameEPerm3 = 'EPermissions Test Group 3';
const groupNameZPerm3 = 'ZPermissions Testing Group 3';
const groupNameRPerm3 = 'RPermissions Testing Group 3';
const groupIntUser = 'Internal Users Group';

let token1 = 'Bearer ';
const contentEmptyPermession = {
  type: 'content',
  dynamic: null,
  exception: null,
  static: [],
};

describe('Tests to validate assigning of existing/new users with permissions', () => {
  beforeAll(() => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token1 += login.callback(error, response, body);
    });
  });

  // Creates nine custom Test Groups. Example: EPermissions Test Group 1
  beforeAll(async () => {
    await portal.login();

    // Creates EPermissions Test Group for Eid users
    const groupName1 = 'EPermissions Test Group 1';
    const groupData1 = {
      name: groupName1,
      description: 'Description for Custom Group 1',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData1);

    const groupName2 = 'EPermissions Test Group 2';
    const groupData2 = {
      name: groupName2,
      description: 'Description for Custom Group 2',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData2);

    const groupName8 = 'EPermissions Test Group 3';
    const groupData8 = {
      name: groupName8,
      description: 'Description for Custom Group 3',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData8);

    // Creates XPermissions Test Group for Xid users
    const groupName3 = 'XPermissions Test Group 1';
    const groupData3 = {
      name: groupName3,
      description: 'Description for Custom Group 1',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData3);

    const groupName4 = 'XPermissions Test Group 2';
    const groupData4 = {
      name: groupName4,
      description: 'Description for Custom Group 2',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData4);

    const groupName10 = 'XPermissions Testing Group 3';
    const groupData10 = {
      name: groupName10,
      description: 'Description for Custom Group 3',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData10);

    // Creates ZPermissions Test Group for Zid users
    const groupName5 = 'ZPermissions Test Group 1';
    const groupData5 = {
      name: groupName5,
      description: 'Description for Custom Group 1',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData5);

    const groupName6 = 'ZPermissions Test Group 2';
    const groupData6 = {
      name: groupName6,
      description: 'Description for Custom Group 2',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData6);

    const groupName9 = 'ZPermissions Testing Group 3';
    const groupData9 = {
      name: groupName9,
      description: 'Description for Custom Group 3',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData9);


    // Creates RPermissions Test Group for Rid users
    const groupName11 = 'RPermissions Test Group 1';
    const groupData11 = {
      name: groupName11,
      description: 'Description for Custom Group 1',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData11);

    const groupName12 = 'RPermissions Test Group 2';
    const groupData12 = {
      name: groupName12,
      description: 'Description for Custom Group 2',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData12);

    const groupName13 = 'RPermissions Testing Group 3';
    const groupData13 = {
      name: groupName13,
      description: 'Description for Custom Group 3',
      type: 'group',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        contentEmptyPermession,
      ],
    };
    await portal.createPermissionGroup(groupData13);
  });

  describe('Eid users permissions tests.', () => {
  // Tests to validate new eid user with appropriate permission groups
    it('Creates a new user with eid', async () => {
      const saveOptions1 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'POST',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
      {
        signum: 'eidpermuser',
        name: 'eidpermuser User',
        marketInformationActive: true,
        email: 'eidpermuser-user@adp-test.com',
      },
      };
      const saveResponse1 = await promiseWrapper(saveOptions1);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        saveResponse1,
      });

      expect(saveResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new user with eid', async () => {
      const getOptions1 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse1 = await promiseWrapper(getOptions1);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getResponse1,
      });

      expect(getResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      const allBodyData = JSON.parse(getResponse1.body);
      const bodyData = allBodyData.data.rbac;
      const defaultGroup = bodyData[0].name === groupIntUser;

      expect(bodyData.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);

      expect(defaultGroup)
        .withContext(`[ response.body.data.rbac ] should contain group name: ${groupIntUser} ${debug}`)
        .toBeTruthy();
    });

    it('Updates the new eid user with the updated custom group 1', async () => {
      const groupName1 = 'EPermissions Test Group 1';
      const custGroupID1 = await portal.getPermissionGroupID(groupName1);
      const saveOptions2 = {
        url: `${config.baseUrl}users/eidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID1],
      };
      const saveResponse2 = await promiseWrapper(saveOptions2);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/eidpermuser/permissions'),
        },
        saveResponse2,
      });

      expect(saveResponse2.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new eid user with the updated custom group 1', async () => {
      const getOptions3 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse3 = await promiseWrapper(getOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getResponse3,
      });

      expect(getResponse3.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      const allBodyData1 = JSON.parse(getResponse3.body);
      const bodyData1 = allBodyData1.data.rbac;
      const customGroup = bodyData1[0].name === 'EPermissions Test Group 1';

      expect(customGroup)
        .withContext(`[ response.body.data.rbac ] should contain name EPermissions Test Group 1 ${debug}`)
        .toBeTruthy();

      expect(bodyData1.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Updates the new eid user with the updated custom group 2', async () => {
      const groupName2 = 'EPermissions Test Group 2';
      const custGroupID2 = await portal.getPermissionGroupID(groupName2);
      const saveOptions3 = {
        url: `${config.baseUrl}users/eidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID2],
      };
      const getResponse4 = await promiseWrapper(saveOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/eidpermuser/permissions'),
        },
        getResponse4,
      });

      expect(getResponse4.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new eid user with the updated custom group 2', async () => {
      const getOptions4 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse5 = await promiseWrapper(getOptions4);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getResponse5,
      });

      expect(getResponse5.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      const allBodyData55 = JSON.parse(getResponse5.body);
      const bodyData5 = allBodyData55.data.rbac;
      const customGroup5 = bodyData5[0].name === 'EPermissions Test Group 2';

      expect(customGroup5)
        .withContext(`[ response.body.data.rbac ] should contain name EPermissions Test Group 2 ${debug}`)
        .toBeTruthy();

      expect(bodyData5.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Deletes the custom group 2 assigned to the new eid user', async () => {
      const groupNameDelete = 'EPermissions Test Group 2';
      const groupIDDeleted = await portal.getPermissionGroupID(groupNameDelete);
      const responseGroupDelete = await portal.deletePermissionGroup(groupIDDeleted);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group', groupIDDeleted),
          request: 'delete',
        },
        responseGroupDelete,
      });

      expect(responseGroupDelete.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads the new eid user to validate the default group after deletion of only custom group', async () => {
      const getoptions5 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse6 = await promiseWrapper(getoptions5);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getResponse6,
      });

      const allBodyData3 = JSON.parse(getResponse6.body);
      const bodyData3 = allBodyData3.data.rbac;
      const defaultGroup3 = bodyData3[0].name === groupIntUser;

      expect(getResponse6.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup3)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData3.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    // EPermissions Test Group 3
    it('Get permission GroupID EPermissions Test Group 3', async () => {
      const custEPermGroupID3 = await portal.getPermissionGroupID(groupNameEPerm3);
      const saveEPermOptions3 = {
        url: `${config.baseUrl}users/eidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
          [custEPermGroupID3],
      };
      const getEPermResponse = await promiseWrapper(saveEPermOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/eidpermuser/permissions'),
        },
        getEPermResponse,
      });

      expect(getEPermResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Get the eid user information', async () => {
      const getoptions50 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse60 = await promiseWrapper(getoptions50);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getResponse60,
      });

      const allBodyData30 = JSON.parse(getResponse60.body);
      const bodyData30 = allBodyData30.data.rbac;
      const defaultGroup30 = bodyData30[0].name === groupNameEPerm3;

      expect(getResponse60.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup30)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupNameEPerm3} ${debug}`)
        .toBeTruthy();

      expect(bodyData30.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Updates the eid user with the EPermissions Test Group 3', async () => {
      const groupDescriptionUpdated = 'Description for Group existing 3';
      const groupID = await portal.getPermissionGroupID(groupNameEPerm3);
      const groupData = {
        _id: groupID,
        name: groupNameUpdated,
        description: groupDescriptionUpdated,
        type: 'group',
        permission: [
          {
            type: 'asset',
            name: 'Selective allowed',
            dynamic: null,
            exception: null,
            static: [
              '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
              '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
          },
          contentEmptyPermession,
        ],
      };
      const responseGroupPut = await portal.updatePermissionGroup(groupData);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group'),
          request: 'put',
        },
        responseGroupPut,
      });

      expect(responseGroupPut.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Check if the eid user with the EPermissions Test Group 3', async () => {
      const getOptions66 = {
        url: `${config.baseUrl}user/eidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse66 = await promiseWrapper(getOptions66);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/eidpermuser'),
        },
        getUserResponse66,
      });

      const allBodyData56 = JSON.parse(getUserResponse66.body);
      const bodyData56 = allBodyData56.data.rbac;
      const customGroup56 = bodyData56[0].name === groupNameUpdated;

      expect(getUserResponse66.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup56)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupNameUpdated} ${debug}`)
        .toBeTruthy();

      expect(bodyData56.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });
  });

  describe('Xid users permissions tests.', () => {
    it('Creates a new user with xid', async () => {
      const saveOptions = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'POST',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
      {
        signum: 'xidpermuser',
        name: 'xidpermuser User',
        marketInformationActive: true,
        email: 'xidpermuser-user@adp-test.com',
      },
      };
      const saveResponse = await promiseWrapper(saveOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        saveResponse,
      });

      expect(saveResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new user with xid', async () => {
      const getOptions = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse = await promiseWrapper(getOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        getResponse,
      });

      const allBodyData = JSON.parse(getResponse.body);
      const bodyData = allBodyData.data.rbac;
      const defaultGroup = bodyData[0].name === groupIntUser;

      expect(getResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Updates the new xid user with the updated custom group 1', async () => {
      const groupName1 = 'XPermissions Test Group 1';
      const custGroupID1 = await portal.getPermissionGroupID(groupName1);
      const saveUserOptions = {
        url: `${config.baseUrl}users/xidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID1],
      };
      const saveResponse1 = await promiseWrapper(saveUserOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/xidpermuser/permissions'),
        },
        saveResponse1,
      });

      expect(saveResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new xid user with the updated custom group 1', async () => {
      const userOptions2 = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse1 = await promiseWrapper(userOptions2);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        getUserResponse1,
      });

      const allBodyData1 = JSON.parse(getUserResponse1.body);
      const bodyData1 = allBodyData1.data.rbac;
      const customGroup = bodyData1[0].name === 'XPermissions Test Group 1';

      expect(getUserResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup)
        .withContext(`[ response.body.data.rbac ] should contain name XPermissions Test Group 1 ${debug}`)
        .toBeTruthy();

      expect(bodyData1.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Updates the new xid user with the updated custom group 2', async () => {
      const groupName2 = 'XPermissions Test Group 2';
      const custGroupID2 = await portal.getPermissionGroupID(groupName2);
      const createOptions = {
        url: `${config.baseUrl}users/xidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID2],
      };
      const getUserResponse3 = await promiseWrapper(createOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/xidpermuser/permissions'),
        },
        getUserResponse3,
      });

      expect(getUserResponse3.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new xid user with the updated custom group 2', async () => {
      const getOptions5 = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse5 = await promiseWrapper(getOptions5);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        getUserResponse5,
      });

      const allBodyData55 = JSON.parse(getUserResponse5.body);
      const bodyData5 = allBodyData55.data.rbac;
      const customGroup5 = bodyData5[0].name === 'XPermissions Test Group 2';

      expect(getUserResponse5.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup5)
        .withContext(`[ response.body.data.rbac ] should contain name XPermissions Test Group 1 ${debug}`)
        .toBeTruthy();

      expect(bodyData5.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Deletes the custom group 2 assigned to the new xid user', async () => {
      const groupNameDelete = 'XPermissions Test Group 2';
      const groupIDDeleted = await portal.getPermissionGroupID(groupNameDelete);
      const responseGroupDelete = await portal.deletePermissionGroup(groupIDDeleted);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group', groupIDDeleted),
          request: 'delete',
        },
        responseGroupDelete,
      });

      expect(responseGroupDelete.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads the new xid user to validate the default group after deletion of only custom group', async () => {
      const options11 = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse6 = await promiseWrapper(options11);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        getUserResponse6,
      });

      const allBodyData3 = JSON.parse(getUserResponse6.body);
      const bodyData3 = allBodyData3.data.rbac;
      const defaultGroup3 = bodyData3[0].name === groupIntUser;

      expect(getUserResponse6.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup3)
        .withContext(`[ response.body.data.rbac ] should contain name ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData3.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Updates the xid user with the XPermissions Testing Group 3', async () => {
      const custXPermGroupID3 = await portal.getPermissionGroupID(groupNameXPerm3);
      const saveXPermOptions3 = {
        url: `${config.baseUrl}users/xidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
          [custXPermGroupID3],
      };
      const getXPermResponse = await promiseWrapper(saveXPermOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/xidpermuser/permissions'),
        },
        getXPermResponse,
      });

      expect(getXPermResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Updates XPermissions Testing Group 3', async () => {
      const groupDescriptionUpdated = 'Description for Group 3 Updated';
      const groupID = await portal.getPermissionGroupID(groupNameXPerm3);
      const groupData = {
        _id: groupID,
        name: groupNameUpdatedX,
        description: groupDescriptionUpdated,
        type: 'group',
        permission: [
          {
            type: 'asset',
            name: 'Selective allowed',
            dynamic: null,
            exception: null,
            static: [
              '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
              '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
          },
          contentEmptyPermession,
        ],
      };
      const responseGroupPut = await portal.updatePermissionGroup(groupData);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group'),
          request: 'put',
        },
        responseGroupPut,
      });

      expect(responseGroupPut.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should check if user was updated with new data for the group', async () => {
      const getOptions66 = {
        url: `${config.baseUrl}user/xidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse66 = await promiseWrapper(getOptions66);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/xidpermuser'),
        },
        getUserResponse66,
      });

      const allBodyData56 = JSON.parse(getUserResponse66.body);
      const bodyData56 = allBodyData56.data.rbac;
      const customGroup56 = bodyData56[0].name === groupNameUpdatedX;

      expect(getUserResponse66.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup56)
        .withContext(`[ response.body.data.rbac ] should contain name ${groupNameUpdatedX} ${debug}`)
        .toBeTruthy();

      expect(bodyData56.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });
  });

  describe('zid users permissions tests.', () => {
    it('Should creates a new user with zid', async () => {
      const saveOptions = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'POST',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
      {
        signum: 'zidpermuser',
        name: 'zidpermuser User',
        marketInformationActive: true,
        email: 'zidpermuser-user@adp-test.com',
      },
      };
      const saveResponse = await promiseWrapper(saveOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        saveResponse,
      });

      expect(saveResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Reads and validates the new user with zid', async () => {
      const getOptions = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse = await promiseWrapper(getOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        getResponse,
      });

      const allBodyData = JSON.parse(getResponse.body);
      const bodyData = allBodyData.data.rbac;
      const defaultGroup = bodyData[0].name === groupIntUser;

      expect(getResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup)
        .withContext(`[ response.body.data.rbac ] should contain name ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should updates the new zid user with the updated custom group 1', async () => {
      const groupName1 = 'ZPermissions Test Group 1';
      const custGroupID1 = await portal.getPermissionGroupID(groupName1);
      const saveUserOptions = {
        url: `${config.baseUrl}users/zidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID1],
      };
      const saveResponse1 = await promiseWrapper(saveUserOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/zidpermuser/permissions'),
        },
        saveResponse1,
      });

      expect(saveResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should Reads and validates the new zid user with the updated custom group 1', async () => {
      const userOptions2 = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse1 = await promiseWrapper(userOptions2);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        getUserResponse1,
      });

      const allBodyData1 = JSON.parse(getUserResponse1.body);
      const bodyData1 = allBodyData1.data.rbac;
      const customGroup = bodyData1[0].name === 'ZPermissions Test Group 1';

      expect(getUserResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup)
        .withContext(`[ response.body.data.rbac ] should contain name: ZPermissions Test Group 1 ${debug}`)
        .toBeTruthy();

      expect(bodyData1.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should Updates the new zid user with the updated custom group 2', async () => {
      const groupName2 = 'ZPermissions Test Group 2';
      const custGroupID2 = await portal.getPermissionGroupID(groupName2);
      const createOptions = {
        url: `${config.baseUrl}users/zidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID2],
      };
      const getUserResponse3 = await promiseWrapper(createOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/zidpermuser/permissions'),
        },
        getUserResponse3,
      });

      expect(getUserResponse3.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should Reads and validates the new zid user with the updated custom group 2', async () => {
      const getOptions5 = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse5 = await promiseWrapper(getOptions5);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        getUserResponse5,
      });

      const allBodyData55 = JSON.parse(getUserResponse5.body);
      const bodyData5 = allBodyData55.data.rbac;
      const customGroup5 = bodyData5[0].name === 'ZPermissions Test Group 2';

      expect(getUserResponse5.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup5)
        .withContext(`[ response.body.data.rbac ] should contain name: ZPermissions Test Group 2 ${debug}`)
        .toBeTruthy();

      expect(bodyData5.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should Deletes the custom group 2 assigned to the new zid user', async () => {
      const groupNameDelete = 'ZPermissions Test Group 2';
      const groupIDDeleted = await portal.getPermissionGroupID(groupNameDelete);
      const responseGroupDelete = await portal.deletePermissionGroup(groupIDDeleted);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group', groupIDDeleted),
          request: 'delete',
        },
        responseGroupDelete,
      });

      expect(responseGroupDelete.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should Reads the new zid user to validate the default group after deletion of only custom group', async () => {
      const options11 = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse7 = await promiseWrapper(options11);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        getUserResponse7,
      });

      const allBodyData3 = JSON.parse(getUserResponse7.body);
      const bodyData3 = allBodyData3.data.rbac;
      const defaultGroup3 = bodyData3[0].name === groupIntUser;

      expect(getUserResponse7.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup3)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData3.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it(' Should get permission Group id for ZPermissions Testing Group 3', async () => {
      const custEPermGroupID3 = await portal.getPermissionGroupID(groupNameZPerm3);
      const saveEPermOptions3 = {
        url: `${config.baseUrl}users/zidpermuser/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
          [custEPermGroupID3],
      };
      const getEPermResponse = await promiseWrapper(saveEPermOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/zidpermuser/permissions'),
        },
        getEPermResponse,
      });

      expect(getEPermResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('ZPermissions Testing Group 3. Should Updates the eid user with the ZPermissions Testing Group 3', async () => {
      groupNameZUpdated3 = 'ZPermissions update Group 3';
      const groupDescriptionUpdated = 'Description for Group 3 Updated';
      const groupID = await portal.getPermissionGroupID('ZPermissions Testing Group 3');
      const groupData = {
        _id: groupID,
        name: groupNameZUpdated3,
        description: groupDescriptionUpdated,
        type: 'group',
        permission: [
          {
            type: 'asset',
            name: 'Selective allowed',
            dynamic: null,
            exception: null,
            static: [
              '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
              '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
          },
          contentEmptyPermession,
        ],
      };
      const responseGroupPut = await portal.updatePermissionGroup(groupData);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group'),
          request: 'Put',
        },
        responseGroupPut,
      });

      expect(responseGroupPut.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('ZPermissions Testing Group 3. Should check if the eid user with the ZPermissions Testing Group 3 was updated', async () => {
      const getOptions66 = {
        url: `${config.baseUrl}user/zidpermuser`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse66 = await promiseWrapper(getOptions66);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/zidpermuser'),
        },
        getUserResponse66,
      });

      const allBodyData56 = JSON.parse(getUserResponse66.body);
      const bodyData56 = allBodyData56.data.rbac;
      const customGroup56 = bodyData56[0].name === groupNameZUpdated3;

      expect(getUserResponse66.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup56)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupNameZUpdated3} ${debug}`)
        .toBeTruthy();

      expect(bodyData56.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });
  });

  describe('rid users permissions tests.', () => {
    it('Should not create a new user if it already exists', async () => {
      const saveOptions = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'POST',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
      {
        signum: 'rtesuse',
        name: 'Rtest User',
        marketInformationActive: true,
        email: 'rtest-user@adp-test.com',
      },
      };
      const saveResponse = await promiseWrapper(saveOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        saveResponse,
      });

      expect(saveResponse.statusCode)
        .withContext(`The server code should be 400: ${debug}`)
        .toBe(400);
    });

    it('Reads and validates the new user with rid', async () => {
      const getOptions = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getResponse = await promiseWrapper(getOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        getResponse,
      });

      const allBodyData = JSON.parse(getResponse.body);
      const bodyData = allBodyData.data.rbac;
      const defaultGroup = bodyData[0].name === groupIntUser;

      expect(getResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup)
        .withContext(`[ response.body.data.rbac ] should contain name ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should update the new rid user with the updated custom group 1', async () => {
      const groupName1 = 'RPermissions Test Group 1';
      const custGroupID1 = await portal.getPermissionGroupID(groupName1);
      const saveUserOptions = {
        url: `${config.baseUrl}users/rtesuse/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID1],
      };
      const saveResponse1 = await promiseWrapper(saveUserOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/rtesuse/permissions'),
        },
        saveResponse1,
      });

      expect(saveResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should Read and validate the new rid user with the updated custom group 1', async () => {
      const userOptions2 = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse1 = await promiseWrapper(userOptions2);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        getUserResponse1,
      });

      const allBodyData1 = JSON.parse(getUserResponse1.body);
      const bodyData1 = allBodyData1.data.rbac;
      const customGroup = bodyData1[0].name === 'RPermissions Test Group 1';

      expect(getUserResponse1.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup)
        .withContext(`[ response.body.data.rbac ] should contain name: RPermissions Test Group 1 ${debug}`)
        .toBeTruthy();

      expect(bodyData1.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should update the new rid user with the updated custom group 2', async () => {
      const groupName2 = 'RPermissions Test Group 2';
      const custGroupID2 = await portal.getPermissionGroupID(groupName2);
      const createOptions = {
        url: `${config.baseUrl}users/rtesuse/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
        [custGroupID2],
      };
      const getUserResponse3 = await promiseWrapper(createOptions);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/rtesuse/permissions'),
        },
        getUserResponse3,
      });

      expect(getUserResponse3.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should read and validate the new rid user with the updated custom group 2', async () => {
      const getOptions5 = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse5 = await promiseWrapper(getOptions5);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        getUserResponse5,
      });

      const allBodyData55 = JSON.parse(getUserResponse5.body);
      const bodyData5 = allBodyData55.data.rbac;
      const customGroup5 = bodyData5[0].name === 'RPermissions Test Group 2';

      expect(getUserResponse5.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup5)
        .withContext(`[ response.body.data.rbac ] should contain name: RPermissions Test Group 2 ${debug}`)
        .toBeTruthy();

      expect(bodyData5.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should delete the custom group 2 assigned to the new rid user', async () => {
      const groupNameDelete = 'RPermissions Test Group 2';
      const groupIDDeleted = await portal.getPermissionGroupID(groupNameDelete);
      const responseGroupDelete = await portal.deletePermissionGroup(groupIDDeleted);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group', groupIDDeleted),
          request: 'delete',
        },
        responseGroupDelete,
      });

      expect(responseGroupDelete.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Should read the new rid user to validate the default group after deletion of only custom group', async () => {
      const options11 = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getUserResponse11 = await promiseWrapper(options11);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        getUserResponse11,
      });

      const allBodyData3 = JSON.parse(getUserResponse11.body);
      const bodyData3 = allBodyData3.data.rbac;
      const defaultGroup3 = bodyData3[0].name === groupIntUser;

      expect(getUserResponse11.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(defaultGroup3)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupIntUser} ${debug}`)
        .toBeTruthy();

      expect(bodyData3.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });

    it('Should get permission Group id for RPermissions Testing Group 3', async () => {
      const custRPermGroupID3 = await portal.getPermissionGroupID(groupNameRPerm3);
      const saveRPermOptions3 = {
        url: `${config.baseUrl}users/rtesuse/permissions`,
        method: 'PUT',
        headers: { Authorization: token1 },
        strictSSL: false,
        json:
          [custRPermGroupID3],
      };
      const getEPermResponse = await promiseWrapper(saveRPermOptions3);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'users/rtesuse/permissions'),
        },
        getEPermResponse,
      });

      expect(getEPermResponse.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Permissions Testing Group 3. Should update the rid user with the RPermissions Testing Group 3', async () => {
      groupNameRUpdated3 = 'RPermissions update Group 3';
      const groupDescriptionUpdated = 'Description for Group 3 Updated';
      const groupID = await portal.getPermissionGroupID('RPermissions Testing Group 3');
      const groupData = {
        _id: groupID,
        name: groupNameRUpdated3,
        description: groupDescriptionUpdated,
        type: 'group',
        permission: [
          {
            type: 'asset',
            name: 'Selective allowed',
            dynamic: null,
            exception: null,
            static: [
              '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
              '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
          },
          contentEmptyPermession,
        ],
      };
      const responseGroupPut = await portal.updatePermissionGroup(groupData);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'rbac/group'),
          request: 'Put',
        },
        responseGroupPut,
      });

      expect(responseGroupPut.code)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);
    });

    it('Permissions Testing Group 3. Should check if the rid user with the ZPermissions Testing Group 3 was updated', async () => {
      const getOptionsRuser = {
        url: `${config.baseUrl}user/rtesuse`,
        method: 'GET',
        headers: { Authorization: token1 },
        strictSSL: false,
      };
      const getOptionsRuserResponce = await promiseWrapper(getOptionsRuser);
      const debug = portal.answer({
        param: {
          url: urljoin(portal.baseUrl, 'user/rtesuse'),
        },
        getOptionsRuserResponce,
      });

      const allBodyData = JSON.parse(getOptionsRuserResponce.body);
      const bodyData = allBodyData.data.rbac;
      const customGroup = bodyData[0].name === groupNameRUpdated3;

      expect(getOptionsRuserResponce.statusCode)
        .withContext(`The server code should be 200: ${debug}`)
        .toBe(200);

      expect(customGroup)
        .withContext(`[ response.body.data.rbac ] should contain name: ${groupNameRUpdated3} ${debug}`)
        .toBeTruthy();

      expect(bodyData.length)
        .withContext(`[ response.body.data.rbac ] should contain 1 record: ${debug}`)
        .toBe(1);
    });
  });
});
