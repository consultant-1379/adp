const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();


describe('Testing asset type = assembly', () => {
  beforeAll(async () => {
    await portal.login();
  });

  it('should check if assemblies are sorted by default', async (done) => {
    const assemblyObjectResponse = await portal.searchMS('?assetType=assembly');

    const responseassemblies = assemblyObjectResponse.body.data[0].microservices;
    const sortedModifiedDate = responseassemblies.sort((MS1, MS2) => (
      new Date(MS1.date_modified) - new Date(MS2.date_modified)));

    const assemblyResponse = assemblyObjectResponse
      && assemblyObjectResponse.body
      && assemblyObjectResponse.body.data
      && assemblyObjectResponse.body.data[0]
      ? assemblyObjectResponse.body.data[0].microservices
      : null;


    expect(responseassemblies)
      .withContext(`Sorting inside assemblies should be by date_modified got  ${responseassemblies}`)
      .toEqual(sortedModifiedDate);

    expect(assemblyResponse)
      .withContext(`Expect a assembly object with assemblies, got null instead. ${assemblyResponse}`)
      .not.toBeNull();
    done();
  });


  it('should try to find assembly for the user, assembly-auto-doc', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly');
    const res = msObjectResponse.body.data[0].microservices;
    const result = res.filter(obj => obj.slug === 'assembly-auto-doc');

    expect(res).not.toEqual([]);
    expect(result).not.toEqual([]);
    expect(msObjectResponse.code).toBe(200);
    done();
  });

  it('should try to find assembly for the user, assembly-min', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly');
    const res = msObjectResponse.body.data[0].microservices;
    const result = res.filter(obj => obj.slug === 'assembly-min');

    expect(res).not.toEqual([]);
    expect(result).not.toEqual([]);
    expect(msObjectResponse.code).toBe(200);
    done();
  });

  it('should try to find asset with not existing type', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=test');

    expect(msObjectResponse.body.data).toEqual([]);
    expect(msObjectResponse.code).toBe(404);
    done();
  });
});

describe('for Etasase admin user in No Perm Group', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTestUserEtasase);
  });

  it('should try to find assembly for user, asset belongs to that group', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly');
    const res = msObjectResponse.body.data[0].microservices;
    const result = res.filter(obj => obj.slug === 'assembly-min');

    expect(res).not.toEqual([]);
    expect(result).not.toEqual([]);
    expect(msObjectResponse.code).toBe(200);
    done();
  });
});

// Sort By Tests
describe('Testing the response of sort by options on marketplace for assembly', () => {
  beforeAll(async () => {
    await portal.login();
  });

  it('should check if microservices are sorted by date modified asc', async (done) => {
    const msObjectResponse = await portal.searchMS('?sort=-date_modified&assetType=assembly');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const sortedModifiedDate = responseAssemblies.sort((MS1, MS2) => (
      new Date(MS1.date_modified) - new Date(MS2.date_modified)));

    const MSResponse = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data[0]
      ? msObjectResponse.body.data[0].microservices
      : null;


    expect(responseAssemblies)
      .withContext(`Sorting for assemblies should be by date_modified got  ${responseAssemblies}`)
      .toEqual(sortedModifiedDate);

    expect(MSResponse)
      .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
      .not.toBeNull();
    done();
  });

  it('should  check if assemblies are sorted by date modified desc', async (done) => {
    const msObjectResponse = await portal.searchMS('?sort=date_modified&assetType=assembly&domain=3');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const sortedModifiedDate = responseAssemblies.sort((MS1, MS2) => (
      new Date(MS2.date_modified) - new Date(MS1.date_modified)));

    const MSResponse = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data[0]
      ? msObjectResponse.body.data[0].microservices
      : null;


    expect(responseAssemblies)
      .withContext(`Sorting inside domain bss should by date_modified got  ${responseAssemblies}`)
      .toEqual(sortedModifiedDate);

    expect(MSResponse)
      .withContext(`Expect a microservice object with microservices, got null instead. ${MSResponse}`)
      .not.toBeNull();

    expect(msObjectResponse.code)
      .withContext(`The server code should be 200: ${msObjectResponse.code}`)
      .toEqual(200);
    done();
  });

  it('should check if assiblies are sorted by date created asc', async (done) => {
    const msObjectResponse = await portal.searchMS('?sort=-date_created&assetType=assembly');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const sortedModifiedDate = responseAssemblies.sort((MS1, MS2) => (
      new Date(MS1.date_created) - new Date(MS2.date_created)));

    const MSResponse = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data[0]
      ? msObjectResponse.body.data[0].microservices
      : null;


    expect(responseAssemblies)
      .withContext(`Sorting should be by date_modified got  ${responseAssemblies}`)
      .toEqual(sortedModifiedDate);

    expect(MSResponse)
      .withContext(`Expect a assembly object with assembly, got null instead. ${MSResponse}`)
      .not.toBeNull();
    done();
  });

  it('should try check if assemblies are sorted by date created desc', async (done) => {
    const msObjectResponse = await portal.searchMS('?sort=date_created&assetType=assembly');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const sortedModifiedDate = responseAssemblies.sort((MS1, MS2) => (
      new Date(MS2.date_created) - new Date(MS1.date_created)));

    const MSResponse = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data[0]
      ? msObjectResponse.body.data[0].microservices
      : null;


    expect(responseAssemblies)
      .withContext(`Sorting asseblies should  be by date_created got  ${responseAssemblies}`)
      .toEqual(sortedModifiedDate);

    expect(MSResponse)
      .withContext(`Expect an object with assemblies, got null instead. ${MSResponse}`)
      .not.toBeNull();
    done();
  });
});


describe('Testing assemlies filtering and sorting', () => {
  beforeAll(async () => {
    await portal.login();
  });


  it('should get Assemblies where assembly category is Common Assembly', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly&assembly_category=1');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.filter(obj => obj.assembly_category !== 1);

    expect(result).withContext(`Expect an empty array of assemblies, got. ${responseAssemblies}`).toEqual([]);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });


  it('should get Assemblies where assembly category is Common Assembly or Domain Specific Assembly', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly&assembly_category=1,2');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.filter(obj => obj.assembly_category !== 1 && obj.assembly_category !== 2);

    expect(result).withContext(`Expect an empty array of assemblies, got. ${responseAssemblies}`).toEqual([]);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should get Assemblies where assembly category is Common Assembly ans domain ', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly&assembly_category=1&domain=3');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.filter(obj => obj.assembly_category !== 1 && obj.domain !== 3);

    expect(result).withContext(`Expect an empty oarray with assemblies, got. ${responseAssemblies}`).toEqual([]);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should get Assemblies where assembly maturity is Development Started', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly&assembly_maturity=1');

    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.filter(obj => obj.assembly_maturity !== 1);

    expect(result).withContext(`Expect an empty oarray with assemblies, got. ${responseAssemblies}`).toEqual([]);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should return Microservices only which containing "mandatory" word in any field', async (done) => {
    const msObjectResponse = await portal.searchMS('?search=mandatory&assetType=assembly');
    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.every(obj => JSON.stringify(obj).includes('mandatory'));

    expect(result).withContext('Expect to have all microservices include word mandatory').toBe(true);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should return assemblies where category is common assembly and has word Update', async (done) => {
    const msObjectResponse = await portal.searchMS('?search=update&assetType=assembly&assembly_category=1');
    const responseAssemblies = msObjectResponse.body.data[0].microservices;
    const result = responseAssemblies.every(obj => JSON.stringify(obj).includes('update'));

    expect(result).withContext('Expect to have all microservices include word Update').toBe(true);
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should return 404 when category is common assembly  and domain is msra', async (done) => {
    const msObjectResponse = await portal.searchMS('?assetType=assembly&assembly_category=1&domain=9');

    expect(msObjectResponse.code).withContext(`The code should be 400. Got ${msObjectResponse}`).toBe(404);
    done();
  });

  it('should search by name and return appropriate result', async (done) => {
    const msObjectResponse = await portal.searchMS('?search=Assembly Auto Doc&assetType=assembly');
    const responseAssemblies = msObjectResponse.body.data[0].microservices;     
    const result = responseAssemblies.find(obj => obj.name === 'Assembly Auto Doc');

    expect(result).withContext('Expect to find Assembly Auto Doc in a search').toBeDefined();
    expect(msObjectResponse.code).withContext(`The code should be 200. Got ${responseAssemblies}`).toBe(200);
    done();
  });

  it('should get Assemblies grouped by Assembly Category', async (done) => {
    const msObjectResponse = await portal.searchMS('?groupby=assembly_category&assetType=assembly');

    const responseAssemblies = msObjectResponse.body.data;

    let foundGroup = false;
    responseAssemblies.forEach((GROUP) => {
      if (GROUP.groupType === true && GROUP.groupHeader === 'Common Assembly') {
        foundGroup = true;
      }
    });

    expect(foundGroup).withContext('Expect to find a group Common Assembly').toBeTruthy();
    done();
  });

  it('should get Assemblies grouped by Assembly Maturity', async (done) => {
    const msObjectResponse = await portal.searchMS('?groupby=assembly_maturity&assetType=assembly');

    const responseAssemblies = msObjectResponse.body.data;

    let foundGroup = false;
    responseAssemblies.forEach((GROUP) => {
      if (GROUP.groupType === true && GROUP.groupHeader === 'Development Started') {
        foundGroup = true;
      }
    });

    expect(foundGroup).withContext('Expect to find assembly maturity development started').toBeTruthy();
    done();
  });

  it('should get Assemblies grouped by Assembly Maturity where category is Common Assembly', async (done) => {
    const msObjectResponse = await portal.searchMS('?groupby=assembly_maturity&assetType=assembly&assembly_category=1');

    const responseAssemblies = msObjectResponse.body.data;

    let foundGroup = false;
    responseAssemblies.forEach((GROUP) => {
      if (GROUP.groupType === true && GROUP.groupHeader === 'Development Started') {
        foundGroup = true;
      }
    });

    expect(foundGroup).withContext('Expect to find assembly maturity development started where group group Common Assembly ').toBeTruthy();
    done();
  });
});
