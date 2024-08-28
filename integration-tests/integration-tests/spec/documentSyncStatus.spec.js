/**
 * Testing DocumentSyncStatus /documentSyncStatus
 * @author zomelud
 */

const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');


const portal = new PortalPrivateAPI();


describe('Testing DocumentSyncStatus endpoint for admin user', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should request DocumentSyncStatus and check results', async (done) => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 25 documents or less: ${debug}`)
      .toBeLessThanOrEqual(25);

    expect(response.body.data[0].microservice)
      .withContext(`[ response.body.data[0].microservice ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].added)
      .withContext(`[ response.body.data[0].added ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].started)
      .withContext(`[ response.body.data[0].started ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].ended)
      .withContext(`[ response.body.data[0].ended ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].status)
      .withContext(`[ response.body.data[0].status ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].groupobjective)
      .withContext(`[ response.body.data[0].groupobjective ] should be defined: ${debug}`)
      .toBeDefined();

    done();
  });


  it('Should request DocumentSyncStatus without parameters and check results', async (done) => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSyncStatus'),
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain zero documents: ${debug}`)
      .toBeGreaterThan(0);

    done();
  });

  it('Should request DocumentSyncStatus without parameters and check results for particular MS', async (done) => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'DocumentSyncStatus'),
      },
      response,
    });

    let foundMsSueue = false;
    response.body.data.some((ITEM) => {
      if (ITEM.microservice === 'Document Refresh Microservice CPI true') {
        foundMsSueue = true;
      }
      return foundMsSueue;
    });

    expect(foundMsSueue)
      .withContext(`should find Microservice Document Refresh Microservice CPI true ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 25 documents or less: ${debug}`)
      .toBeLessThanOrEqual(25);

    done();
  });

  it('Should request DocumentSyncStatus without parameters and check results for particular MS(several results)', async (done) => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'DocumentSyncStatus'),
      },
      response,
    });
    const allItems = response.body.data;
    const foundMS = allItems.filter(item => (item.microservice === 'Auto MS with Mock Artifactory Doc 1'));


    let foundItem = false;
    allItems.filter((item) => {
      if (item.microservice === 'Auto MS with Mock Artifactory Doc 1') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS with Mock Artifactory Doc 1 name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(foundMS[0].added)
      .withContext(`[ foundMS.added ] should be defined: ${debug}`)
      .toBeDefined();

    expect(foundMS[0].started)
      .withContext(`[ foundMS.started ] should be defined: ${debug}`)
      .toBeDefined();

    expect(foundMS[0].ended)
      .withContext(`[ foundMS.ended ] should be defined: ${debug}`)
      .toBeDefined();

    expect(foundMS[0].status)
      .withContext(`[ foundMS.status] should be defined: ${debug}`)
      .toEqual('Completed');

    expect(foundMS[0].groupobjective)
      .withContext(`[ response.body.data[0].groupobjective ] should be defined: ${debug}`)
      .toBeDefined();


    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);
    done();
  });

  it('Request DocumentSyncStatus for admin for Document Refresh Microservice CPI true, should have access', async () => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.microservice === 'Document Refresh Microservice CPI true') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Document Refresh Microservice CPI true page ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);
  });
});

describe('Testing DocumentSyncStatus endpoint for test user without access', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTestUserEtapase);
    done();
  });


  it('Request DocumentSyncStatus for etapase', async () => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'DocumentSyncStatus'),
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.some((ITEM) => {
      if (ITEM.microservice === 'Document Refresh Microservice CPI true') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain Auto MS Mimer ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);
  });
});


describe('Testing DocumentSyncStatus endpoint for test user with access to some Microservices', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTestUserEtesase);
    done();
  });


  it('Request DocumentSyncStatus for etesuse for Auto MS with Mock Artifactory Doc 1, should not have access', async () => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'DocumentSyncStatus'),
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.some((ITEM) => {
      if (ITEM.microservice === 'Auto MS with Mock Artifactory Doc 1') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain Auto MS with Mock Artifactory Doc 1 ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);
  });

  it('Request DocumentSyncStatus for etesuse for Document Refresh Microservice CPI true, should have access', async () => {
    const response = await portal.documentSyncStatus();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.microservice === 'Document Refresh Microservice CPI true') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Document Refresh Microservice CPI true ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);
  });
});
