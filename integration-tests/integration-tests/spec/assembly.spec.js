/* eslint-disable array-callback-return */
const data = require('../test.data.js');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Tests to check creation of assembly for admin user', () => {
  beforeAll(async () => {
    await portal.login();
    const assemblyData = data.assemblyUpdateTest;
    await portal.createAssembly(assemblyData);

    const assemblyData2 = data.assemblyUpdateTest4;
    await portal.createAssembly(assemblyData2);

    const assemblyData3 = data.assemblyAutoDoc;
    await portal.createAssembly(assemblyData3);

    const assemblyData4 = data.assemblyMin;
    await portal.createAssembly(assemblyData4);
  });

  it('Update assembly(domain) with minimum data on it', async (done) => {
    const assemblyData = data.assemblyAuto3;
    const assemblyID = await portal.readAssemblyId('assembly-update-test');

    const response = await portal.updateAssembly(assemblyData, assemblyID);

    expect(response.code)
      .withContext(`The server code should be 200. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(200);
    done();
  });

  it('Create assembly with minimum data', async (done) => {
    const assemblyData = data.assemblyAutoCreate;
    const assemblyID = await portal.createAssembly(assemblyData);

    const assemblyObjectResponse = await portal.getAssembly('assembly-min-create');

    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    expect(assemblyObjectResponse.code)
      .withContext(`The code should be 200. Got ${JSON.stringify(assemblyObjectResponse, null, 2)}`)
      .toBe(200);
    done();
  });

  it('Should fail to create assembly with existing microservice name', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail1;
    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);
    done();
  });

  it('Should fail to create assembly with existing assembly name', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail1;
    assemblyData.name = 'Assembly Min';
    assemblyData.slug = 'assembly-min';
    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);
    done();
  });

  it('Should fail to create assembly without Helm information when Assembly Maturity is Ready for commercial', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail2;
    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);

    expect(assemblyID.body.data)
      .withContext(`Message should be [helm_chartname] is mandatory if [assembly_maturity] === 2. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toEqual(['[helm_chartname] is mandatory if [assembly_maturity] === 2.']);
    done();
  });

  it('Should fail to update assembly where git information was removed', async (done) => {
    const assemblyData = data.assemblyAuto3;
    assemblyData.giturl = undefined;
    const assemblyID = await portal.readAssemblyId('assembly-update-test');

    const response = await portal.updateAssembly(assemblyData, assemblyID);

    expect(response.code)
      .withContext(`The server code should be 400. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(400);

    expect(response.body.data)
      .withContext(`Message should be [giturl] is mandatory when creating Assembly. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(['[giturl] is mandatory when creating Assembly']);
    done();
  });

  it('Should fail to update assembly only with Restriction=other without Restriction reason', async (done) => {
    const assemblyData = data.assemblyAuto3;
    assemblyData.giturl = 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp';
    assemblyData.restricted = 1;
    assemblyData.restricted_description = undefined;
    const assemblyID = await portal.readAssemblyId('assembly-update-test');

    const response = await portal.updateAssembly(assemblyData, assemblyID);

    expect(response.code)
      .withContext(`The server code should be 400. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(400);

    expect(response.body.data)
      .withContext(`Message should be [restricted_description] is mandatory if [restricted] === 1. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(['[restricted_description] is mandatory if [restricted] === 1.']);
    done();
  });

  it('Should fail to create assembly where assembly_category is Common assembly and domain is set', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail5;
    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);

    expect(assemblyID.body.data)
      .withContext(`Message should be "Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toEqual(['"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".']);
    done();
  });

  it('Should fail to create assembly where assembly_category is different from Common Assembly and domain is set to Common Asset', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail3;
    assemblyData.domain = 1;
    assemblyData.assembly_category = 2;
    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);

    expect(assemblyID.body.data)
      .withContext(`Message should be "Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly". Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toEqual(['"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".']);
    done();
  });

  it('Should  create assembly where assembly_category is Common Assembly and domain is set to Common Asset', async (done) => {
    const assemblyData = data.assemblyAutoCreate2;
    assemblyData.domain = 1;
    assemblyData.assembly_category = 1;
    const assemblyID = await portal.createAssembly(assemblyData);

    const assemblyObjectResponse = await portal.getAssembly('assembly-create-2');

    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    expect(assemblyObjectResponse.code)
      .withContext(`The code should be 200. Got ${JSON.stringify(assemblyObjectResponse, null, 2)}`)
      .toBe(200);
    done();
  });


  it('Create assembly with maximum data', async (done) => {
    const assemblyData = data.assemblyAutoCreateMax;
    const assemblyID = await portal.createAssembly(assemblyData);

    const assemblyObjectResponse = await portal.getAssembly('assembly-create-max');

    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    expect(assemblyObjectResponse.code)
      .withContext(`The code should be 200. Got ${JSON.stringify(assemblyObjectResponse, null, 2)}`)
      .toBe(200);
    done();
  });


  it('Should fail to create assembly with duplicated component services items', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail3;
    assemblyData.component_service = ['45e7f4f992afe7bbb62a3391e500e71b', '17e57f6cea1b5a673f8775e6cf023352', '45e7f4f992afe7bbb62a3391e500e71b'];

    const assemblyID = await portal.createAssemblyFail(assemblyData);

    expect(assemblyID.code)
      .withContext(`The code should be 400. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toBe(400);

    expect(assemblyID.body.data)
      .withContext(`Message should be component_service contains duplicate item. Got ${JSON.stringify(assemblyID, null, 2)}`)
      .toEqual(['component_service contains duplicate item']);
    done();
  });

  it('Should create assembly with deleted component services items and should remove them', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail6;
    assemblyData.name = 'Assembly create 6';

    assemblyData.component_service = ['33c39ceb47b28842c3a728c89300026f', '45e7f4f992afe7bbb62a3391e500e71b'];
    const assemblyID = await portal.createAssembly(assemblyData);

    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    const assemblyObjectResponse = await portal.getAssembly('assembly-create-6');

    expect(assemblyObjectResponse.body.data.component_service)
      .withContext(`Component service should have 45e7f4f992afe7bbb62a3391e500e71b value. Got ${JSON.stringify(assemblyObjectResponse.body.data.component_service, null, 2)}`)
      .toEqual(['45e7f4f992afe7bbb62a3391e500e71b']);
    done();
  });

  it('Should create assembly with  component services items with assembly type', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail6;
    assemblyData.name = 'Assembly create 7';

    assemblyData.component_service = ['45e7f4f992afe7bbb62a3391e500egpd', '45e7f4f992afe7bbb62a3391e500e71b'];
    const assemblyID = await portal.createAssembly(assemblyData);


    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    const assemblyObjectResponse = await portal.getAssembly('assembly-create-7');

    expect(assemblyObjectResponse.body.data.component_service)
      .withContext(`The code should be 200. Got ${JSON.stringify(assemblyObjectResponse.body.data.component_service, null, 2)}`)
      .toEqual(['45e7f4f992afe7bbb62a3391e500e71b']);
    done();
  });

  it('Should fail to create assembly with items with not existing ids', async (done) => {
    const assemblyData = data.assemblyAutoCreateFail6;
    assemblyData.name = 'Assembly create 8';

    assemblyData.component_service = ['45e7f4f992afe7bbb62a3391e500notexistingID', '45e7f4f992afe7bbb62a3391e500e71b'];
    const assemblyID = await portal.createAssembly(assemblyData);


    expect(assemblyID)
      .withContext('should create assembly')
      .toBeDefined();

    const assemblyObjectResponse = await portal.getAssembly('assembly-create-8');

    expect(assemblyObjectResponse.body.data.component_service)
      .withContext(`The code should be 200. Got ${JSON.stringify(assemblyObjectResponse.body.data.component_service, null, 2)}`)
      .toEqual(['45e7f4f992afe7bbb62a3391e500e71b']);
    done();
  });

  it('Should fail to create assembly on MS endpoint', async () => {
    const msData = data.assemblyAutoCreate5;
    const microserviceID = await portal.createMS(msData);

    expect(microserviceID)
      .withContext('should not create MS')
      .toBeUndefined();
  });


  it('Should fail to update assembly on microservice endpoint', async (done) => {
    const assemblyData = data.assemblyAuto4;
    const assemblyID = await portal.readAssemblyId('assembly-update-test-4');

    const response = await portal.updateMS(assemblyData, assemblyID);

    expect(response.code)
      .withContext(`The server code should be 400. Got ${JSON.stringify(response, null, 2)}`)
      .toEqual(400);
    done();
  });
});

describe('Tests to check deletion of assembly for admin user', () => {
  beforeAll(async () => {
    await portal.login();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  it('Should delete created Assemblies and check if they were deleted assembly-min-create', async (done) => {
    const assemblyID1 = await portal.readAssemblyId('assembly-min-create');
    const assemblyIDdelete1 = await portal.deleteAssembly(assemblyID1);

    expect(assemblyIDdelete1.code).toBe(200);
    done();
  });

  it('Should delete created Assemblies and check if they were deleted assembly-create-2', async (done) => {
    const assemblyID2 = await portal.readAssemblyId('assembly-create-2');
    const assemblyIDdelete2 = await portal.deleteAssembly(assemblyID2);

    expect(assemblyIDdelete2.code).toBe(200);
    done();
  });

  it('Should delete created Assemblies and check if they were deleted assembly-create-6', async (done) => {
    const assemblyID3 = await portal.readAssemblyId('assembly-create-6');
    const assemblyIDdelete3 = await portal.deleteAssembly(assemblyID3);

    expect(assemblyIDdelete3.code).toBe(200);
    done();
  });

  it('Should delete created Assemblies and check if they were deleted assembly-create-7', async (done) => {
    const assemblyID5 = await portal.readAssemblyId('assembly-create-7');
    const assemblyIDdelete5 = await portal.deleteAssembly(assemblyID5);

    expect(assemblyIDdelete5.code).toBe(200);
    done();
  });

  it('Should delete created Assemblies and check if they were deleted assembly-create-8', async (done) => {
    const assemblyID6 = await portal.readAssemblyId('assembly-create-8');
    const assemblyIDdelete6 = await portal.deleteAssembly(assemblyID6);

    expect(assemblyIDdelete6.code).toBe(200);
    done();
  });
});
