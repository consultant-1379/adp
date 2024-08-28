const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
const name = 'group?name=';

describe('Tests to validate backend permissions when criteria mode is true', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a permission group with everything allowed, and return an appropriate response', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Everything allowed mode true',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
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
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'rbac/group'),
      },
      responseGroupPost,
    });

    expect(responseGroupPost.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    done();
  });

  it('Should return the requested permission group details where everything allowed and no exceptions', async (done) => {
    const groupName = 'Everything allowed mode true';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();
    let foundPermission = false;

    const permissions = responseGroupGet.body.data[0].permission;
    permissions.forEach((obj) => {
      if ((JSON.stringify(obj.dynamic) === JSON.stringify([]))
        && (JSON.stringify(obj.exception) === JSON.stringify([]))
        && (obj.static === null)) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should create a permission group with selective permissions based on criteria, and return an appropriate response', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Allow selective assets mode true',
      permission: [
        {
          type: 'asset',
          name: 'Allow selective assets',
          dynamic: [
            {
              _id: '49bfab89e2ab4b291d84b4dd7c058f1f',
              items: [{ _id: '49bfab89e2ab4b291d84b4dd7c031078' }, { _id: '49bfab89e2ab4b291d84b4dd7c03256c' }],
            },
          ],
          exception: ['1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea2199761011f968'],
          static: null,

        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should return the requested permission group details where selective permissions are allowed by criteria', async (done) => {
    const groupName = 'Allow selective assets mode true';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();

    let foundPermission = false;
    responseGroupGet.body.data[0].permission.forEach((obj) => {
      if ((obj.dynamic !== [])
           && (JSON.stringify(obj.exception) === JSON.stringify([
             '1a319091a57a0586ea219976100a1065',
             '1a319091a57a0586ea2199761011f968',
           ])) && (obj.static === null)) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });
});


describe('Tests to validate backend permissions when criteria mode is false', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a permission group with selective permissions allowed and return an appropriate response', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Selective allowed mode false',
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
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should return the requested permission group details where selective permissions allowed', async (done) => {
    const groupName = 'Selective allowed mode false';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();

    let foundPermission = false;
    responseGroupGet.body.data[0].permission.forEach((obj) => {
      if ((obj.dynamic === null)
          && (obj.exception === null)
          && (JSON.stringify(obj.static) === JSON.stringify([
            '1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'])
          )) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should create a permission group with selective permissions allowed including Assembly', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Selective allowed mode false with Assembly',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500eaui',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should return the requested permission group details where selective permissions allowed including Assembly', async (done) => {
    const groupName = 'Selective allowed mode false with Assembly';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();

    let foundPermission = false;
    responseGroupGet.body.data[0].permission.forEach((obj) => {
      if ((obj.dynamic === null)
          && (obj.exception === null)
          && (JSON.stringify(obj.static) === JSON.stringify([
            '45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500eaui',
            '1a319091a57a0586ea21997610116e78', '1a319091a57a0586ea2199761011f968'])
          )) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should create a permission group with selective permissions allowed including Assembly only', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Selective allowed mode false Assembly only',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: [
            '45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500eaui'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should return the requested permission group details where selective permissions allowed Assembly only', async (done) => {
    const groupName = 'Selective allowed mode false Assembly only';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();

    let foundPermission = false;
    responseGroupGet.body.data[0].permission.forEach((obj) => {
      if ((obj.dynamic === null)
          && (obj.exception === null)
          && (JSON.stringify(obj.static) === JSON.stringify([
            '45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500eaui'])
          )) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should create a permission group with no permissions allowed, and return an appropriate response', async (done) => {
    const groupData = {
      type: 'group',
      name: 'No permissoin allowed mode false',
      permission: [
        {
          type: 'asset',
          name: 'No Assets allowed',
          dynamic: null,
          exception: null,
          static: [],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should return the requested permission group details where no permissions allowed', async (done) => {
    const groupName = 'No permissoin allowed mode false';
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'asset');

    expect(assetresult).toBeTruthy();

    let foundPermission = false;
    responseGroupGet.body.data[0].permission.forEach((obj) => {
      if ((obj.dynamic === null)
        && (obj.exception === null)
        && (JSON.stringify(obj.static) === JSON.stringify([]))) {
        foundPermission = true;
      }
    });

    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should fail to create a permission group with static containing not existing msID/assemblyID', async (done) => {
    const groupData = {
      type: 'group',
      name: 'should fail with not existing ID',
      permission: [
        {
          type: 'asset',
          name: 'Selective allowed',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a44444', '1a319091a57a0586ea2199761011f968'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });
});

describe('Tests to validate backend permissions after updating the criteria when criteria mode is on', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Tests to validate backend permissions after updating the criteria when criteria mode is true', async (done) => {
    const groupName = 'Allow new assets with exceptions';
    const groupData = {
      _id: '603e4dd7369e66969a7bffdd',
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
              items: [{ _id: '49bfab89e2ab4b291d84b4dd7c031078' }, { _id: '49bfab89e2ab4b291d84b4dd7c03256c' }],
            },
          ],
          exception: ['17e57f6cea1b5a673f8775e6cf023344'],
          static: null,
        },
        {
          _id: '60acea3ad682a7000791c235',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '3344', '8928', '5946', '3483', '3570', '8932', '8933', '130', '139', '92', '8936',
            '3374', '3553', '3365', '8919', '95', '93', '8945', '3435', '94', '3501', '8590', '3509', '102',
            '10078', '102', '8918', '8951', '127', '9631', '9629', '9627', '9727', '123', '9623', '3346', '3570', '3365',
            '124', '9691', '100', '9623', '6138',
          ],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.dynamic !== [])
      && (obj.exception !== []) && (obj.static === null)));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('17e57f6cea1b5a673f8775e6cf023344'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });

  it('Update the already existing permission group by updating the criteria mode to false, and return an appropriate response', async (done) => {
    const groupName = 'Allow new assets with exceptions';
    const groupData = {
      _id: '603e4dd7369e66969a7bffdd',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Switch the criteria mode from true to false',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790'],
        },
        {
          _id: '60acea3ad682a7000791c235',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '3344', '8928', '5946', '3483', '3570', '8932', '8933', '130', '139', '92', '8936',
            '3374', '3553', '3365', '8919', '95', '93', '8945', '3435', '94', '3501', '8590', '3509', '102',
            '10078', '102', '8918', '8951', '127', '9631', '9629', '9627', '9727', '123', '9623', '3346', '3570', '3365',
            '124', '9691', '100', '9623', '6138',
          ],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.dynamic === null)
      && (obj.exception === null) && (obj.static !== [])));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('1a319091a57a0586ea219976100a1065', '1a319091a57a0586ea21997610402790', '45e7f4f992afe7bbb62a3391e500egpd'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });


  it('Tests to change data for permission back to its initial state', async (done) => {
    const groupName = 'Allow new assets with exceptions';
    const groupData = {
      _id: '603e4dd7369e66969a7bffdd',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: [],
          exception: ['17e57f6cea1b5a673f8775e6cf023344',
            '45e7f4f992afe7bbb62a3391e500e71b',
            '45e7f4f992afe7bbb62a3391e5011e0p',
            '45e7f4f992afe7bbb62a3391e500egpd'],
          static: null,
        },
        {
          _id: '60acea3ad682a7000791c235',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '3344', '8928', '5946', '3483', '3570', '8932', '8933', '130', '139', '92', '8936',
            '3374', '3553', '3365', '8919', '95', '93', '8945', '3435', '94', '3501', '8590', '3509', '102',
            '10078', '102', '8918', '8951', '127', '9631', '9629', '9627', '9727', '123', '9623', '3346', '3570', '3365',
            '124', '9691', '100', '9623', '6138',
          ],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.exception !== [])
      && (obj.static === null)));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e5011e0p', '45e7f4f992afe7bbb62a3391e500egpd'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBeTruthy();
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });
});

describe('Tests to validate backend permissions after updating the criteria when criteria mode is off', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should update the already existing permission group with updated criteria, and return an appropriate response', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupData = {
      _id: '603e4ed5369e66969a7c003e',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow only specific assets',
          dynamic: null,
          exception: null,
          static: ['17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500egpd'],
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          name: 'Allow specific content items',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.dynamic === null)
      && (obj.exception === null) && (obj.static !== [])));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('17e57f6cea1b5a673f8775e6cf023344'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });

  it('Update the already existing permission group by updating the criteria mode to true, and return an appropriate response', async (done) => {
    const groupName = 'Allow only specific assets';
    const groupData = {
      _id: '603e4ed5369e66969a7c003e',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow only specific assets',
          dynamic: [
            {
              _id: '49bfab89e2ab4b291d84b4dd7c058f1f',
              items: [{ _id: '49bfab89e2ab4b291d84b4dd7c031078' }, { _id: '49bfab89e2ab4b291d84b4dd7c03256c' }],
            },
          ],
          exception: ['1a319091a57a0586ea21997610405678'],
          static: null,
        },
        {
          _id: '60acea97d682a7000791c237',
          type: 'content',
          name: 'Allow specific content items',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '130', '139', '92', '95', '93', '8945', '8951', '127',
            '9371', '9375', '9377', '124', '9631', '9629', '9627'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.dynamic !== [])
      && (obj.exception !== []) && (obj.static === null)));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('1a319091a57a0586ea21997610405678'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });

  it('Another test to change data for permission back to its initial state', async (done) => {
    const groupName = 'Allow new assets with exceptions';
    const groupData = {
      _id: '603e4dd7369e66969a7bffdd',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e4e07369e66969a7bfff2',
          type: 'asset',
          name: 'Allow new assets with exceptions perm',
          dynamic: null,
          exception: null,
          static: ['17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e5011e0p', '45e7f4f992afe7bbb62a3391e500egpd'],
        },
        {
          _id: '60acea3ad682a7000791c235',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['91', '3346', '3344', '8928', '5946', '3483', '3570', '8932', '8933', '130', '139', '92', '8936',
            '3374', '3553', '3365', '8919', '95', '93', '8945', '3435', '94', '3501', '8590', '3509', '102',
            '10078', '102', '8918', '8951', '127', '9631', '9629', '9627', '9727', '123', '9623', '3346', '3570', '3365',
            '124', '9691', '100', '9623', '6138',
          ],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermission = assetresult.some(obj => ((obj.dynamic === null)
      && (obj.exception === null) && (obj.static !== [])));

    const staticresult = assetresult.every(obj => JSON.stringify(obj).includes('17e57f6cea1b5a673f8775e6cf023344', '45e7f4f992afe7bbb62a3391e500e71b', '45e7f4f992afe7bbb62a3391e500egpd'));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    expect(staticresult).toBeTruthy();
    done();
  });
});


describe('Tests to validate negative scenarios for asset permissions', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should fail to create permission with dynamic and exception is null', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Everything allowed exeption null mode true',
      permission: [
        {
          type: 'asset',
          name: 'Everything allowed exeption null',
          dynamic: [],
          exception: null,
          static: null,
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with dynamic and exception containing not existing msID', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail not existing id',
      permission: [
        {
          type: 'asset',
          name: 'Should fail by not existing exception',
          dynamic: [],
          exception: ['1a319091a57a0586ea219976100a44444'],
          static: null,
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with type different from asset', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail not existing id',
      permission: [
        {
          type: 'notasset',
          name: 'Should fail by not existing exception',
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
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with more than one permission with type asset', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail double asset permission',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'asset',
          name: 'Allow all Assets 2',
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
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with empty permission array', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail empty permission',
      permission: [],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission without dynamic, exception and static fields', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail without dynamic static',
      permission: [
        {
          type: 'asset',
          name: 'without dynamic static',
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission without wrong MSid', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail without dynamic static',
      permission: [
        {
          type: 'asset',
          name: 'without dynamic static',
          dynamic: null,
          exception: null,
          static: ['17e57f6cea1b5a673f8775e6cf023333'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });


  it('Should fail to create permission with exception field only', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail exception only',
      permission: [
        {
          type: 'asset',
          name: 'exception only',
          exception: [],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'rbac/group'),
      },
      responseGroupPost,
    });

    expect(responseGroupPost.code)
      .withContext(`The server code should be 400: ${debug}`)
      .toBe(400);

    done();
  });

  it('Should fail to create permission with static and exception array', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail static with exception',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: null,
          exception: [],
          static: [],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });
});

describe('Tests to validate backend permissions for type "content"', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a permission group with type content and one page allowed', async (done) => {
    const groupName = 'Content permission one creation group';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [
            '137',
          ],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);

    // Should return the requested permission group details where selective permissions allowed
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();

    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((obj.dynamic === null)
            && (obj.exception === null)
            && (JSON.stringify(obj.static) === JSON.stringify(['137'])
            )) {
        foundPermission = true;
      }
    });

    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should create a permission group with type content and several pages allowed', async (done) => {
    const groupName = 'Content permission two creation group';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          name: 'asset permission',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [
            '137',
            '9824',
            '6138',
          ],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);

    // Should return the requested permission group details where selective permissions allowed
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();
    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((obj.dynamic === null)
            && (obj.exception === null)
            && (JSON.stringify(obj.static) === JSON.stringify(['137', '9824', '6138'])
            )) {
        foundPermission = true;
      }
    });

    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });


  it('Update already existing content permission group by adding content pages', async (done) => {
    const groupName = 'Content permission group 1';
    const groupData = {
      _id: '6093c47aa0e3570006a772f3',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe7e',
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          _id: '60aceb04d682a7000791c239',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['137', '9824'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const resultContent = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');
    const resultAsset = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'asset');

    const foundPermissionContent = resultContent.some(obj => (
      (obj.dynamic === null)
        && (obj.exception === null)
        && (JSON.stringify(obj.static) === JSON.stringify(['137', '9824']))));

    const foundPermissionAsset = resultAsset.some(obj => (
      (JSON.stringify(obj.dynamic) === JSON.stringify([]))
       && (JSON.stringify(obj.exception) === JSON.stringify([]))
       && (obj.static === null)));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermissionContent).toBe(true);
    expect(foundPermissionAsset).toBe(true);
    done();
  });


  it('Update already existing content permission group by changing both content and asset permission', async (done) => {
    const groupName = 'Content permission group 1';
    const groupData = {
      _id: '6093c47aa0e3570006a772f3',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe7e',
          type: 'asset',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          _id: '60aceb04d682a7000791c239',
          type: 'content',
          dynamic: null,
          exception: null,
          static: ['9824', '6138'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermission = assetresult.some(obj => (
      (obj.dynamic === null)
        && (obj.exception === null)
        && (JSON.stringify(obj.static) === JSON.stringify(['9824', '6138']))));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    done();
  });

  it('Update already existing content permission group by removing content permission(empty permission)', async (done) => {
    const groupName = 'Content permission group 1';
    const groupData = {
      _id: '6093c47aa0e3570006a772f3',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe7e',
          type: 'asset',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          _id: '60aceb04d682a7000791c239',
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermission = assetresult.some(obj => (
      (obj.dynamic === null)
        && (obj.exception === null)
        && (JSON.stringify(obj.static) === JSON.stringify([]))));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    done();
  });
});

describe('Tests to validate backend permissions for type "content" with Auto-All exception', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a AutoAll permission group with type content', async (done) => {
    const groupName = 'Content permission Auto-all creation group';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: [],
          exception: ['/main'],
          static: ['91',
            '3344',
            '3346',
            '3483'],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);

    // Should return the requested permission group details where selective permissions allowed
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();

    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((JSON.stringify(obj.dynamic) === JSON.stringify([]))
            && (JSON.stringify(obj.exception) === JSON.stringify(['/main']))
            && (JSON.stringify(obj.static) === JSON.stringify(['91',
              '3344',
              '3346',
              '3483'])
            )) {
        foundPermission = true;
      }
    });

    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });


  it('Update already existing AutoAll content permission group by adding content pages', async (done) => {
    const groupName = 'Content permission AutoAll';
    const groupData = {
      _id: '624c33c19951490007864fac',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe55',
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          _id: '60aceb04d682a7000791c345',
          type: 'content',
          dynamic: [],
          exception: ['/main'],
          static: ['91',
            '3344',
            '3346',
            '3483'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const resultContent = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermissionContent = resultContent.some(obj => (
      (JSON.stringify(obj.dynamic) === JSON.stringify([]))
        && (JSON.stringify(obj.exception) === JSON.stringify(['/main']))
        && (JSON.stringify(obj.static) === JSON.stringify(['91',
          '3344',
          '3346',
          '3483'])
        )));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermissionContent).toBe(true);
    done();
  });

  it('Update already existing AutoAll content by removing not existing menus', async (done) => {
    const groupName = 'Content permission AutoAll';
    const groupData = {
      _id: '624c33c19951490007864fac',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe55',
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          _id: '60aceb04d682a7000791c345',
          type: 'content',
          dynamic: [],
          exception: ['/main', '/notExistingMenu'],
          static: ['91',
            '3344',
            '3346',
            '3483'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const resultContent = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermissionContent = resultContent.some(obj => (
      (JSON.stringify(obj.dynamic) === JSON.stringify([]))
        && (JSON.stringify(obj.exception) === JSON.stringify(['/main']))
        && (JSON.stringify(obj.static) === JSON.stringify(['91',
          '3344',
          '3346',
          '3483'])
        )));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermissionContent).toBe(true);
    done();
  });




  it('Update already existing content AutoAll group by changing both content and asset permission', async (done) => {
    const groupName = 'Content permission AutoAll';
    const groupData = {
      _id: '624c33c19951490007864fac',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe55',
          type: 'asset',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          _id: '60aceb04d682a7000791c345',
          type: 'content',
          dynamic: [],
          exception: ['/main', '/footer'],
          static: ['91',
            '3344',
            '3346',
            '3483'],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const resultContent = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermissionContent = resultContent.some(obj => (
      (JSON.stringify(obj.dynamic) === JSON.stringify([]))
        && (JSON.stringify(obj.exception) === JSON.stringify(['/main', '/footer']))
        && (JSON.stringify(obj.static) === JSON.stringify(['91',
          '3344',
          '3346',
          '3483'])
        )));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermissionContent).toBe(true);
    done();
  });

  it('Update already existing content AutoAll group by removing content permission(empty permission)', async (done) => {
    const groupName = 'Content permission AutoAll';
    const groupData = {
      _id: '624c33c19951490007864fac',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '603e49f6369e66969a7bfe55',
          type: 'asset',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          _id: '60aceb04d682a7000791c345',
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const assetresult = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    const foundPermission = assetresult.some(obj => (
      (obj.dynamic === null)
        && (obj.exception === null)
        && (JSON.stringify(obj.static) === JSON.stringify([]))));

    expect(responseGroupPut.code).toBe(200);
    expect(responseGroupGet.code).toBe(200);
    expect(foundPermission).toBe(true);
    expect(assetresult).not.toEqual([]);
    done();
  });
});

describe('Tests to validate negative scenarios for content permissions', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a permission group with type content and not existing page object_id, will be cleaned after with new menu', async (done) => {
    const groupName = 'Content permission with not existing page';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [
            '137888',
          ],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });

  it('Should create a permission group with type content and duplicated group id should be removed', async (done) => {
    const groupName = 'Content permission with duplicated group id';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [
            '137', '137', '137',
          ],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);

    // Should return the requested permission group details
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();
    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((obj.dynamic === null)
            && (obj.exception === null)
            && (JSON.stringify(obj.static) === JSON.stringify(['137'])
            )) {
        foundPermission = true;
      }
    });

    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should fail to create permission with type content and type string for values', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm without dynamic',
      permission: [
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
          static: [123],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should not fail to create permission with three empty arrays for the content', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm AuthoAll2',
      permission: [
        {
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: [],
          exception: [],
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);
    done();
  });


  it('Should fail to create permission with two empty arrays for the content  and exception having values', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm AuthoAll2',
      permission: [
        {
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: [],
          exception: ['/main'],
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with exception and dynamic having values', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm AuthoAll',
      permission: [
        {
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: ['123'],
          exception: ['/main'],
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });


  it('Should fail to create permission with type content boolean as a value in static array', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm without dynamic',
      permission: [
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
          static: [true],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with type different from content', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail to create content perm wrong type',
      permission: [
        {
          type: 'asset',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'contentFail',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create permission with more than one permission with type content', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail double asset permission',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
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
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create content permission without static field', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail without dynamic static',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create content permission with static and exception array', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail static with exception',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: null,
          exception: [],
          static: [],
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });
});


describe('Tests to validate scenarios for dynamic content permissions', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should create a permission group with type content dynamic all and check if it is created', async (done) => {
    const groupName = 'Content permission dynamic all group';
    const groupData = {
      type: 'group',
      name: groupName,
      permission: [
        {
          type: 'asset',
          name: 'asset permission',
          dynamic: null,
          exception: null,
          static: ['1a319091a57a0586ea219976100a1065'],
        },
        {
          type: 'content',
          dynamic: [],
          exception: [],
          static: null,
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(200);

    // Should return the requested permission group details where all permissions allowed
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();
    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((JSON.stringify(obj.dynamic) === JSON.stringify([]))
      && (obj.static === null)
      && (JSON.stringify(obj.exception) === JSON.stringify([]))) {
        foundPermission = true;
      }
    });

    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    done();
  });

  it('Should check if created group has access to items in menus', async (done) => {
    const groupName = 'Content permission dynamic all group';
    const groupID = await portal.getPermissionGroupID(groupName);
    const responsePreviewPost = await portal.rbacPreview(groupID);
    const allowedContents = responsePreviewPost.body.data.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedAContentID3 = allowedContents.includes('9822');
    const allowedContentID4 = allowedContents.includes('9221');


    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedAContentID3).toBe(true);
    expect(allowedContentID4).toBe(true);
    expect(allowedContents.length).toBeGreaterThan(30);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });


  it('Should check if created group has access to items in pages-not-on-any-menu', async (done) => {
    const groupName = 'Content permission dynamic all group';
    const groupID = await portal.getPermissionGroupID(groupName);
    const responsePreviewPost = await portal.rbacPreview(groupID);
    const allowedContents = responsePreviewPost.body.data.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedAContentID3 = allowedContents.includes('9822');
    const allowedContentID4 = allowedContents.includes('9221');


    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedAContentID3).toBe(true);
    expect(allowedContentID4).toBe(true);
    expect(allowedContents.length).toBeGreaterThan(30);
    expect(responsePreviewPost.code).toBe(200);
    done();
  });

  it('Should update a static permission group and change it to dynamic, check results', async (done) => {
    const groupName = 'Content permission static to dynamic';
    const groupData = {
      _id: '60f8032b0c3de50007adb97b',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '60f8038d0c3de50007adb97d',
          type: 'asset',
          name: 'Allow only specific assets',
          dynamic: null,
          exception: null,
          static: [],
        },
        {
          _id: '60f803b70c3de50007adb97f',
          type: 'content',
          name: 'Allow specific content items',
          dynamic: [],
          exception: [],
          static: null,
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();
    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((JSON.stringify(obj.dynamic) === JSON.stringify([]))
      && (obj.static === null)
      && (JSON.stringify(obj.exception) === JSON.stringify([]))) {
        foundPermission = true;
      }
    });

    const responsePreviewPost = await portal.rbacPreview('60f8032b0c3de50007adb97b');
    const allowedContents = responsePreviewPost.body.data.allowed.contents;
    const allowedContentID1 = allowedContents.includes('137');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedAContentID3 = allowedContents.includes('9822');
    const allowedContentID4 = allowedContents.includes('9221');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(true);
    expect(allowedAContentID3).toBe(true);
    expect(allowedContentID4).toBe(true);
    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPut.code).toBe(200);
    done();
  });

  it('Should update a dynamic permission group and change it to static, check results', async (done) => {
    const groupName = 'Content permission static to dynamic';
    const groupData = {
      _id: '60f8032b0c3de50007adb97b',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '60f8038d0c3de50007adb97d',
          type: 'asset',
          name: 'Allow only specific assets',
          dynamic: null,
          exception: null,
          static: [],
        },
        {
          _id: '60f803b70c3de50007adb97f',
          type: 'content',
          name: 'Allow specific content items',
          dynamic: null,
          exception: null,
          static: ['3346'],
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentresult = responseGroupGet.body.data[0].permission.some(obj => obj.type === 'content');

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentresult).toBeTruthy();
    let foundPermission = false;
    contentResultFilter.forEach((obj) => {
      if ((JSON.stringify(obj.static) === JSON.stringify(['3346']))
      && (obj.dynamic === null)
      && (obj.exception === null)) {
        foundPermission = true;
      }
    });

    const responsePreviewPost = await portal.rbacPreview('60f8032b0c3de50007adb97b');
    const allowedContents = responsePreviewPost.body.data.allowed.contents;
    const allowedContentID1 = allowedContents.includes('3346');
    const allowedContentID2 = allowedContents.includes('9824');
    const allowedAContentID3 = allowedContents.includes('9822');

    expect(allowedContentID1).toBe(true);
    expect(allowedContentID2).toBe(false);
    expect(allowedAContentID3).toBe(false);
    expect(contentResultFilter.length).toBe(1);
    expect(foundPermission).toBe(true);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPut.code).toBe(200);
    done();
  });

  it('Should fail to create content permission with dynamic and exception is null', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail static with exception null',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: [],
          exception: null,
          static: null,
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should fail to create content permission with dynamic and exception having some values', async (done) => {
    const groupData = {
      type: 'group',
      name: 'Should fail static with exception equal null',
      permission: [
        {
          type: 'asset',
          name: 'Allow all Assets',
          dynamic: [],
          exception: [],
          static: null,
        },
        {
          type: 'content',
          dynamic: ['3346'],
          exception: ['9824'],
          static: null,
        },
      ],
    };
    const responseGroupPost = await portal.createPermissionGroup(groupData);

    expect(responseGroupPost.code).toBe(400);
    done();
  });

  it('Should update a static permission group back to dynamic, check results', async (done) => {
    const groupName = 'Content permission static to dynamic';
    const groupData = {
      _id: '60f8032b0c3de50007adb97b',
      type: 'group',
      name: groupName,
      permission: [
        {
          _id: '60f8038d0c3de50007adb97d',
          type: 'asset',
          name: 'Allow only specific assets',
          dynamic: null,
          exception: null,
          static: [],
        },
        {
          _id: '60f803b70c3de50007adb97f',
          type: 'content',
          name: 'Allow specific content items',
          dynamic: [],
          exception: [],
          static: null,
        },
      ],
    };

    const responseGroupPut = await portal.updatePermissionGroup(groupData);
    const responseGroupGet = await portal.getPermissionGroup(name + groupName);

    const contentResultFilter = responseGroupGet.body.data[0].permission.filter(obj => obj.type === 'content');

    expect(contentResultFilter.length).toBe(1);
    expect(responseGroupGet.code).toBe(200);
    expect(responseGroupPut.code).toBe(200);
    done();
  });
});


// =========================================================================================== //

describe('Developer [ zdiaarm ] testing permission type "content"', () => {
  beforeAll((done) => {
    portal.login()
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // CREATE/READ/UPDATE/DELETE Developer Tests
  it('[ Successful Case ] Testing the CRUD for Content Permission Type.', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
        {
          type: 'content',
          dynamic: null,
          exception: null,
          static: [
            '123654',
            '789546',
            '456987',
          ],
        },
      ],
    };
    const groupDataToUpdate = {
      _id: null,
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
        {
          type: 'content',
          name: 'Picking a few pages',
          dynamic: null,
          exception: null,
          static: [
            '123654',
            '789546',
            '456987',
            '989898',
            '121212',
          ],
        },
      ],
    };
    let idFromTheLastCreatedGroup;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    // Reading (YEAH, AGAIN) the created group after the deletion. Should not find it.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action6 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(404);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Deleting the created group
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action5 = () => {
      portal.deletePermissionGroup(idFromTheLastCreatedGroup)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action6();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Reading (AGAIN) the created group after update
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action4 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action5();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Updating the created group
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action3 = () => {
      groupDataToUpdate._id = idFromTheLastCreatedGroup;
      portal.updatePermissionGroup(groupDataToUpdate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action4();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Reading the created group
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action2 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action3();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with two permissions ( asset & content )
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          idFromTheLastCreatedGroup = responseGroupPost.body.data._id;

          expect(responseGroupPost.code).toBe(200);
          action2();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  // Negative CREATE Developer Tests
  it('[ Negative Case ] If there is no Content Permission should get a 400 ', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Error Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
      ],
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with one permission - should get a 400 Bad Request
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(400);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  // CREATE/READ/Negative UPDATE/DELETE Developer Tests
  it('[ Negative Case ] Testing a fail update behavior.', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
        {
          type: 'content',
          name: 'Picking a few pages',
          dynamic: null,
          exception: null,
          static: [
            '123654',
            '789546',
            '456987',
          ],
        },
      ],
    };
    const groupDataToUpdate = {
      _id: null,
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
      ],
    };
    let idFromTheLastCreatedGroup;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    // Reading (YEAH, AGAIN) the created group after the deletion. Should not find it.
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action6 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(404);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Deleting the created group
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action5 = () => {
      portal.deletePermissionGroup(idFromTheLastCreatedGroup)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action6();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Reading (AGAIN) the created group after update
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action4 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action5();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Updating the created group - should get a 400 Bad Request Error
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action3 = () => {
      groupDataToUpdate._id = idFromTheLastCreatedGroup;
      portal.updatePermissionGroup(groupDataToUpdate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(400);
          action4();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Reading the created group
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action2 = () => {
      portal.getPermissionGroup(`${name}${`Testing Group ${global.randomName}`}`)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(200);
          action3();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with two permissions ( asset & content )
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          idFromTheLastCreatedGroup = responseGroupPost.body.data._id;

          expect(responseGroupPost.code).toBe(200);
          action2();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  // Negative CREATE ( Schema Error ) Developer Tests
  it('[ Negative Case ] If the schema of content permission is wrong should get a 404 ', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: [
            '1a319091a57a0586ea219976100a1065',
            '1a319091a57a0586ea21997610402790',
            '1a319091a57a0586ea21997610116e78',
          ],
        },
        {
          type: 'content',
          name: 'Picking a few pages',
        },
      ],
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with one permission - should get a 400 Bad Request
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(400);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  // Negative CREATE ( Schema Error ) Developer Tests
  it('[ Negative Case ] If the schema of content permission contain wrong types should get a 400 ', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: ['45e7f4f992afe7bbb62a3391e500ffb1'],
        },
        {
          type: 'content',
          name: 'Picking a few wrong pages',
          dynamic: null,
          exception: null,
          static: [true, undefined, null],
        },
      ],
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with one permission - should get a 400 Bad Request
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(400);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  // Negative CREATE ( Schema Error ) Developer Tests
  it('[ Negative Case ] Forcing a wrong type in static should get a 400 ', (done) => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.randomName = `TEST_${(new Date()).getTime()}_${Math.floor(Math.random() * (999 - 0 + 1))}`;
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const groupDataToCreate = {
      type: 'group',
      name: `Testing Group ${global.randomName}`,
      permission: [
        {
          type: 'asset',
          name: 'Picking a few assets',
          dynamic: null,
          exception: null,
          static: 'This is NOT Ok!',
        },
        {
          type: 'content',
          name: 'Picking a few wrong pages',
          dynamic: null,
          exception: null,
          static: ['This is Ok!'],
        },
      ],
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
      // Creating a new group with one permission - should get a 400 Bad Request
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    const action1 = () => {
      portal.createPermissionGroup(groupDataToCreate)
        .then((responseGroupPost) => {
          expect(responseGroupPost.code).toBe(400);
          done();
        })
        .catch(() => {
          done.fail();
        });
    };
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    action1();
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
});
// =========================================================================================== //
