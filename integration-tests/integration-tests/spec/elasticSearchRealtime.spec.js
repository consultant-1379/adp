/**
 * Testing Elastic Search: /realtime-contentsearch
 * @author Ludmila Omelchenko
 */

const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();

describe('Testing Elastic Search realtime for admin user', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('Basic Successful search', async () => {
    const response = await portal.realTimeElasticSearch('adp roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'adp roadmaps',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data[0].filteredArray[0].object_id)
      .withContext(`[ response.body.data[0].filteredArray[0].object_id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].title)
      .withContext(`[ response.body.data[0].filteredArray[0].title ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].slug)
      .withContext(`[ response.body.data[0].filteredArray[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].category)
      .withContext(`[ response.body.data[0].filteredArray[0].category ] should be defined: ${debug}`)
      .toBeDefined();
  });

  it('Basic Successful realtime search, number of pages in responceshould be less or equal 5', async () => {
    const response = await portal.realTimeElasticSearch('Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'Roadmaps',
      },
      response,
    });

    const allItemsPage = response.body.data.filter(item => (item.post_type === 'page'));
    const allItemsPageCount = allItemsPage[0].filteredArray.length;

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(allItemsPageCount)
      .withContext(`all items page count should contain 5 documents or less: ${debug}`)
      .toBeLessThanOrEqual(5);
  });

  it('Basic Successful realtime search, number of tutorials in responceshould be less or equal 5', async () => {
    const response = await portal.realTimeElasticSearch('ADP');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'ADP',
      },
      response,
    });

    const allItemsPage = response.body.data.filter(item => (item.post_type === 'tutorials'));
    const allItemsPageCount = allItemsPage[0].filteredArray.length;

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(allItemsPageCount)
      .withContext(`all items page count should contain 5 documents or less: ${debug}`)
      .toBeLessThanOrEqual(5);
  });

  it('Basic Successful realtime search, number of microservices in response should be less or equal 2', async () => {
    const response = await portal.realTimeElasticSearch('Auto MS Restricted');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    const allItemsPage = response.body.data.filter(item => (item.post_type === 'microservice'));
    const allItemsPageCount = allItemsPage[0].filteredArray.length;

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(allItemsPageCount)
      .withContext(`all items MS count should contain 2 MS or less: ${debug}`)
      .toBeLessThanOrEqual(2);
  });

  it('Number of assemblies in response should be less or equal 2 when search by name', async () => {
    const response = await portal.realTimeElasticSearch('Assembly Max Report');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'Assembly Max Report',
      },
      response,
    });

    const allItemsPage = response.body.data.filter(item => (item.post_type === 'microservice'));
    const allItemsPageCount = allItemsPage[0].filteredArray.length;

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(allItemsPageCount)
      .withContext(`all items MS count should contain 2 MS or less: ${debug}`)
      .toBeLessThanOrEqual(2);
  });

  it('Number of microservices/assemblies in response should be less or equal 2 when search by product number', async () => {
    const response = await portal.realTimeElasticSearch('APR20132');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'APR20132',
      },
      response,
    });

    const allItemsPage = response.body.data.filter(item => (item.post_type === 'microservice'));
    const allItemsPageCount = allItemsPage[0].filteredArray.length;

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(allItemsPageCount)
      .withContext(`all items MS count should contain 2 MS/assemblies or less: ${debug}`)
      .toBeLessThanOrEqual(2);
  });

  it('Basic Successful search for assembly/microservice, should search by description', async () => {
    const response = await portal.realTimeElasticSearch('Man Assembly');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'party',
      },
      response,
    });
    let allItemsMS = response.body.data.filter(item => (item.post_type === 'microservice'));
    allItemsMS = allItemsMS[0].filteredArray;

    let foundItem = false;
    allItemsMS.filter((item) => {
      if (item.title === 'Assembly Create Max') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Assembly Create Max ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data[0].filteredArray[0].object_id)
      .withContext(`[ response.body.data[0].filteredArray[0].object_id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].title)
      .withContext(`[ response.body.data[0].filteredArray[0].name ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].slug)
      .withContext(`[ response.body.data[0].filteredArray[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].highlight)
      .withContext(`[ response.body.data[0].filteredArray[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].asset_document_fullurl)
      .withContext(`[ response.body.data[0].filteredArray[0].asset_document_fullurl ] should be defined: ${debug}`)
      .toBeDefined();
  });

  it('Basic Successful search for microservices, should search by based on', async () => {
    const response = await portal.realTimeElasticSearch('party');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'party',
      },
      response,
    });
    let allItemsMS = response.body.data.filter(item => (item.post_type === 'microservice'));
    allItemsMS = allItemsMS[0].filteredArray;

    let foundItem = false;
    allItemsMS.filter((item) => {
      if (item.title === 'Auto MS test 5') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS test 5 ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data[0].filteredArray[0].object_id)
      .withContext(`[ response.body.data[0].filteredArray[0].object_id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].title)
      .withContext(`[ response.body.data[0].filteredArray[0].name ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].slug)
      .withContext(`[ response.body.data[0].filteredArray[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].highlight)
      .withContext(`[ response.body.data[0].filteredArray[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].filteredArray[0].asset_document_fullurl)
      .withContext(`[ response.body.data[0].filteredArray[0].asset_document_fullurl ] should be defined: ${debug}`)
      .toBeDefined();
  });

  it('Successful search with minimum characters(2)', async () => {
    const response = await portal.realTimeElasticSearch('ad');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'adp',
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
      .withContext(`[ response.body.data ] should contain 8 documents or less: ${debug}`)
      .toBeLessThanOrEqual(8);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should have more than 0 documents: ${debug}`)
      .toBeGreaterThan(0);
  });

  it('Basic Successful Search with no parameters should return 0 results', async () => {
    const response = await portal.realTimeElasticSearch();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
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
      .toEqual(0);
  });

  it('Successful Search with emty string should return 0 results', async () => {
    const response = await portal.realTimeElasticSearch('');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
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
      .toEqual(0);
  });

  it('Successful Search with one character, should return 0 results', async () => {
    const response = await portal.realTimeElasticSearch('f');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
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
      .toEqual(0);
  });
});


describe('Testing Elastic Search for test user without access', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTestUserEtapase);
    done();
  });


  it('Basic Successful realtime search for etapase', async () => {
    const response = await portal.realTimeElasticSearch('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    let allItemsPage = response.body.data.filter(item => (item.post_type === 'page'));
    allItemsPage = allItemsPage[0].filteredArray;


    let foundItem = false;
    allItemsPage.filter((item) => {
      if (item.title === 'ADP Roadmaps') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain ADP Roadmaps title page ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 8 documents or less: ${debug}`)
      .toBeLessThanOrEqual(8);
  });


  it('Basic Successful realtime search for etapase, should not find microservice', async () => {
    const response = await portal.realTimeElasticSearch('Auto MS Restricted');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    let allItemsMS = response.body.data.filter(item => (item.post_type === 'microservice'));
    allItemsMS = allItemsMS[0].filteredArray;


    let foundItem = false;
    allItemsMS.filter((item) => {
      if (item.title === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain Auto MS Restricted ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });
});


describe('Testing Elastic Search for test user with access to the page', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTest);
    done();
  });


  it('Basic Successful realtime search for etesuse', async () => {
    const response = await portal.realTimeElasticSearch('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    let allItemsPage = response.body.data.filter(item => (item.post_type === 'page'));
    allItemsPage = allItemsPage[0].filteredArray;


    let foundItem = false;
    allItemsPage.filter((item) => {
      if (item.title === 'ADP Roadmaps') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain ADP Roadmaps title page ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 8 documents or less: ${debug}`)
      .toBeLessThanOrEqual(8);
  });

  it('Basic Successful realtime search for etapase, should find microservice', async () => {
    const response = await portal.realTimeElasticSearch('Auto MS Restricted');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'realtime-contentsearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    let allItemsMS = response.body.data.filter(item => (item.post_type === 'microservice'));
    allItemsMS = allItemsMS[0].filteredArray;

    let foundItem = false;
    allItemsMS.filter((item) => {
      if (item.title === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS Restricted ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });
});
