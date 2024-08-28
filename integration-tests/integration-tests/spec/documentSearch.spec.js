const urljoin = require('url-join');

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
const login = require('../endpoints/login.js');

describe('ElasticSearch testing Elastic Search for admin user', () => {
  beforeAll(async () => {
    await portal.login();
    await portal.microserviceDocumentationSyncReport(['45e7f4f992afe7bbb62a3391e50160e5']);
    await portal.microserviceDocumentationSyncReport(['45e7f4f992afe7bbb62a3391e50171e2']);
    await portal.microserviceDocumentationSyncReport(['17e57f6cea1b5a673f8775e6cf023344']);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await portal.microserviceDocumentationSyncReport(['45e7f4f992afe7bbb62a3391e5011e0p']);
    await portal.microserviceDocumentationSyncReport(['45e7f4f992afe7bbb62a3391e5014a41']);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  it('[Documentation Search] Testing a successful case of document search without optional paramenters', async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await portal.elasticSearchwithType('testing', 'microservice_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
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
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(2);
  });

  it('[Documentation Search] Testing a successful case of document search with match from title ', async () => {
    const response = await portal.elasticSearchwithType('Sample 1', 'microservice_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Sample 1',
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
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(2);
  });


  it('[Documentation Search] Testing a successful case of sync with document search with empty string', async () => {
    const response = await portal.elasticSearchwithType('', 'microservice_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSearch'),
        keyword: '',
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


  it('[Documentation Search] Basic Successful Search Test with Pagination', async () => {
    const response = await portal.elasticSearchwithType('testing', 'ms_documentation', 1, 5);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
        page: 1,
        pagesize: 5,
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
      .withContext(`[ response.body.data ] should contain 5 documents or less: ${debug}`)
      .toBeLessThanOrEqual(5);

    expect(response.body.data[0].title_slug)
      .withContext(`[ response.body.data[0].title_slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_slug)
      .withContext(`[ response.body.data[0].asset_slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].category_slug)
      .withContext(`[ response.body.data[0].category_slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].link)
      .withContext(`[ response.body.data[0].link ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].versions)
      .withContext(`[ response.body.data[0].versions ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].versions)
      .withContext(`[ response.body.data[0].versions ] should be defined: ${debug}`)
      .toBeDefined();
  });

  it('[Documentation Search] Basic Successful Search with one result: version, microservice slug and document slug as parameters, one result in response', async () => {
    const response = await portal.documentElasticSearchOneResult('External', 'ms_documentation', 1, 20, 'auto-ms-test-2', 'an-external', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '1.0.1'
      && obj.asset_slug === 'auto-ms-test-2' && obj.title_slug === 'an-external');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 1.0.1 and  asset_slug 'auto-ms-test-3',
     title_slug === 'sample-2' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(response.body.data[0].title_slug)
      .withContext(`[ response.body.data[0].title_slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_slug)
      .withContext(`[ response.body.data[0].asset_slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].version)
      .withContext(`[ response.body.data[0].version ] should be defined: ${debug}`)
      .toBeDefined();
  });

  it('[Documentation Search] Basic Successful Search with one result: version, microservice slug and document slug as parameters, zero result in response', async () => {
    const response = await portal.documentElasticSearchOneResult('Externalrt', 'ms_documentation', 1, 20, 'auto-ms-test-2', 'an-external', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(0);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });

  it('[Documentation Search] Basic Successful Search, should check if all results in responce have microservice-documentation type', async () => {
    const response = await portal.elasticSearchwithType('External', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.type === 'ms_documentation');

    expect(result)
      .withContext(`Should find only type microservice_documentation' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });

  it('[Documentation Search] Basic Successful Search, should check if all results in responce have microservice-documentation type [ Test 2 ]', async () => {
    const response = await portal.elasticSearchwithType('testing', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.type === 'ms_documentation');

    expect(result)
      .withContext(`Should find only type microservice_documentation' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });

  it('[Documentation Search] Basic Successful Search, should check if external document has restricted field and external link', async () => {
    const response = await portal.elasticSearchwithType('External', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'External',
      },
      response,
    });

    const result = response.body.data.find(obj => obj.restricted === false && obj.link === 'https://www.ericsson.se');

    expect(result)
      .withContext(`Should find only type microservice_documentation' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);
  });
});


describe('ElasticSearch testing Elastic Search for test user without access', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTestUserEtapase);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });


  it('[Documentation Search] Testing a case of document search for user without access to appropriate documents', async () => {
    const response = await portal.elasticSearchwithType('Sample 1', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Sample 1',
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
      .withContext(`[ response.body.data ] should contain 0 documents: ${debug}`)
      .toEqual(0);
  });
});


describe('Testing Elastic Search for test user with access to the page', () => {
  beforeAll(async () => {
    await portal.login(login.optionsTest);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });


  it('[Documentation Search] Testing a successful case of document search without optional paramenters for test user', async () => {
    const response = await portal.elasticSearchwithType('testing', 'microservice_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
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
      .withContext(`[ response.body.data ] should contain 4 documents or more: ${debug}`)
      .toBeGreaterThan(4);
  });

  it('[Documentation Search] Testing a successful case of document search with match from title for test user', async () => {
    const response = await portal.elasticSearchwithType('Sample 1', 'microservice_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'documentSearch'),
        keyword: 'testing',
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
      .withContext(`[ response.body.data ] should contain 2 documents or more: ${debug}`)
      .toBeGreaterThan(2);
  });
});
