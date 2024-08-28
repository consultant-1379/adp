/**
 * Testing Elastic Search: /searchcontent
 * @author Armando Dias [zdiaarm]
 */

const urljoin = require('url-join');
const { PortalPrivateAPI, MockArtifactory } = require('./apiClients');
const apiQueueClass = require('./apiQueue');
const login = require('../endpoints/login.js');
const data = require('../test.data.js');


let microserviceIDSearch;
let originalValue;

const portal = new PortalPrivateAPI();
const mockArtifactory = new MockArtifactory();
const kernelQueue = new apiQueueClass.ApiQueue();

describe('Testing Elastic Search', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[ES001]] Basic Successful Search Test', async (done) => {
    portal.startTestLog('[[ES001]]');

    const response = await portal.elasticSearchwithType('adp', 'page');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
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
      .withContext(`[ response.body.data ] should contain 20 documents or less: ${debug}`)
      .toBeLessThanOrEqual(20);

    expect(response.body.data[0].title)
      .withContext(`[ response.body.data[0].title ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].category)
      .withContext(`[ response.body.data[0].category ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].url)
      .withContext(`[ response.body.data[0].url ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });


  it('[[ES002]] Basic Successful Search Test with Pagination', async (done) => {
    portal.startTestLog('[[ES002]]');

    const response = await portal.elasticSearchwithType('adp', 'page', 1, 10);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'adp',
        page: 1,
        pagesize: 10,
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
      .withContext(`[ response.body.data ] should contain 10 documents or less: ${debug}`)
      .toBeLessThanOrEqual(10);

    expect(response.body.data[0].title)
      .withContext(`[ response.body.data[0].title ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].category)
      .withContext(`[ response.body.data[0].category ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].url)
      .withContext(`[ response.body.data[0].url ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });


  it('[[ES003]] Basic Successful Search with no parameters', async (done) => {
    portal.startTestLog('[[ES003]]');

    const response = await portal.elasticSearchwithType();
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
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

    await kernelQueue.isFree();
    done();
  });

  it('[[ES004]] Basic Successful Search Test with type = page, should not find category_slug=tutorials', async (done) => {
    portal.startTestLog('[[ES004]]');

    const response = await portal.elasticSearchwithType('adp', 'page');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'adp',
      },
      response,
    });

    let foundTypeTutorials = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.category.some(e => e.category_slug === 'tutorials')) {
        foundTypeTutorials = true;
      }
    });

    expect(foundTypeTutorials)
      .withContext(`should not find type Tutotrials ${debug}`)
      .toBeFalsy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 20 documents or less: ${debug}`)
      .toBeLessThanOrEqual(20);

    expect(response.body.data[0].object_id)
      .withContext(`[ response.body.data[0].object_id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].title)
      .withContext(`[ response.body.data[0].title ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].category)
      .withContext(`[ response.body.data[0].category ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].url)
      .withContext(`[ response.body.data[0].url ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });

  it('[[ES005]] Basic Successful Search Test with type = tutorials, should not find category_slug=articles', async (done) => {
    portal.startTestLog('[[ES005]]');

    const response = await portal.elasticSearchwithType('adp', 'tutorials');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'adp',
      },
      response,
    });
    let foundTypeArticles = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.category.some(e => e.category_slug === 'articles')) {
        foundTypeArticles = true;
      }
    });

    expect(foundTypeArticles)
      .withContext(`should not find type Articles ${debug}`)
      .toBeFalsy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data.length)
      .withContext(`[ response.body.data ] should contain 20 documents or less: ${debug}`)
      .toBeLessThanOrEqual(20);

    expect(response.body.data[0].object_id)
      .withContext(`[ response.body.data[0].object_id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].title)
      .withContext(`[ response.body.data[0].title ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].category)
      .withContext(`[ response.body.data[0].category ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].url)
      .withContext(`[ response.body.data[0].url ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });

  it('[[ES006]] Basic Successful Search Test with type = microservices, should not find category_slug=articles, tutorials', async (done) => {
    portal.startTestLog('[[ES006]]');

    const response = await portal.elasticSearchwithType('Auto MS Restricted', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });
    let foundTypeArticles = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'articles') {
        foundTypeArticles = true;
      }
    });

    let foundTypeTutorials = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'tutorials') {
        foundTypeTutorials = true;
      }
    });

    let foundTypeMicroservices = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'microservice') {
        foundTypeMicroservices = true;
      }
    });

    expect(foundTypeArticles)
      .withContext(`should not find type Articles ${debug}`)
      .toBeFalsy();


    expect(foundTypeTutorials)
      .withContext(`should not find type Tutorials ${debug}`)
      .toBeFalsy();

    expect(foundTypeMicroservices)
      .withContext(`should find type Microservices ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES007]] Basic Successful Search Test with type = microservices, should not find any results', async (done) => {
    portal.startTestLog('[[ES007]]');

    const response = await portal.elasticSearchwithType('sdfjghlskdhg', 'microservices');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'sdfjghlskdhg',
      },
      response,
    });
    let foundTypeArticles = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'articles') {
        foundTypeArticles = true;
      }
    });

    let foundTypeTutorials = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'tutorials') {
        foundTypeTutorials = true;
      }
    });

    let foundTypeMicroservices = false;
    response.body.data.forEach((ITEM) => {
      if (ITEM.type === 'microservice') {
        foundTypeMicroservices = true;
      }
    });

    expect(foundTypeArticles)
      .withContext(`should not find type Articles ${debug}`)
      .toBeFalsy();

    expect(foundTypeTutorials)
      .withContext(`should not find type Tutorials ${debug}`)
      .toBeFalsy();

    expect(foundTypeMicroservices)
      .withContext(`should find type Microservices ${debug}`)
      .toBeFalsy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES008]] Basic Successful Search Test with type = microservices, should find appropriate MS and fields', async (done) => {
    portal.startTestLog('[[ES008]]');

    const response = await portal.elasticSearchwithType('Auto MS Restricted', 'microservice', 1, 100);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS Restricted MS name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data[0]._id)
      .withContext(`[ response.body.data[0]._id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].name)
      .withContext(`[ response.body.data[0].name ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].description)
      .withContext(`[ response.body.data[0].description ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_fullurl)
      .withContext(`[ response.body.data[0].asset_fullurl ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_document_fullurl)
      .withContext(`[ response.body.data[0].asset_document_fullurl ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });

  it('[[ES009]] Basic Successful Search Test with type = microservices, should find appropriate MS with based On field = party', async (done) => {
    portal.startTestLog('[[ES009]]');

    const response = await portal.elasticSearchwithType('party', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'party',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS test 5') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS Restricted MS name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES010]] Should create MS and check if it is present in search results', async (done) => {
    portal.startTestLog('[[ES010]]');

    const msData = data.demoService_with_search;
    microserviceIDSearch = await portal.createMSAndWaitTheMSElasticQueue(msData);
    await new Promise(resolve => setTimeout(resolve, 5000));

    const response = await portal.elasticSearchwithType('SearchTr', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'SearchTr',
      },
      response,
    });

    const debug2 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'Create MS'),
        keyword: 'SearchTr',
      },
      microserviceIDSearch,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Test Automation SearchTr') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(microserviceIDSearch)
      .withContext(`Id should be defined ${debug2}`)
      .toBeDefined();

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Test Automation SearchTr microservice ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES011]] Should create MS and check if  document is present in search result', async (done) => {
    portal.startTestLog('[[ES011]]');

    const msData = data.demoService_with_search2;
    await mockArtifactory.setARMFolder('tc02', done);
    microserviceIDSearch = await portal.createMSAndWaitTheMSElasticQueue(msData);
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('guide', 'ms_documentation', 1, 20, 'test-auto-search-doc', 'troubleshooting-guide', '3.2.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'guide',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '3.2.1'
       && obj.asset_slug === 'test-auto-search-doc' && obj.title_slug === 'troubleshooting-guide');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 3.2.1 with asset slug test-auto-search-doc and troubleshooting-guide' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES011.1]] Should check if  document is present in search result for Assembly', async (done) => {
    portal.startTestLog('[[ES011.1]]');

    const response = await portal.documentElasticSearchOneResult('Assembly Documentation', 'ms_documentation', 1, 20, 'assembly-with-docs', 'service-overview', 'development');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Assembly Documentation',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === 'development'
       && obj.asset_slug === 'assembly-with-docs' && obj.title_slug === 'service-overview');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version In Devlopment with asset slug assembly-with-docs and service-overview' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES012]] Should update MS and check if  document is present in search result', async (done) => {
    portal.startTestLog('[[ES012]]');

    const msData = data.demoService_with_search2;
    msData.menu.manual.release[0].documents[0].name = 'TestNameToCheckUpdate';
    msData.menu.manual.release[0].documents[0].slug = 'testnametocheckupdate';
    const microserviceIDms = await portal.readMicroserviceId('test-auto-search-doc');
    await portal.updateMSAndWaitTheMSElasticQueue(msData, microserviceIDms);
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('guide', 'ms_documentation', 1, 20, 'test-auto-search-doc', 'testnametocheckupdate', '3.2.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'guide',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '3.2.1'
       && obj.asset_slug === 'test-auto-search-doc' && obj.title_slug === 'testnametocheckupdate');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 3.2.1 with asset slug testnametocheckupdate and troubleshooting-guide' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES013]] Should create MS and check if  document is present in search result with auto mode', async (done) => {
    portal.startTestLog('[[ES013]]');

    const msData = data.demoService_with_search3;
    const assetSlug = msData.slug;
    msData.repo_urls = {
      development: `${mockArtifactory.artifactoryReadFolderUrl}/`,
      release: `${mockArtifactory.artifactoryReadFolderUrl}/`,
    };

    await mockArtifactory.setARMFolder('tc01', done);

    microserviceIDSearch = await portal.createMSAndWaitTheMSElasticQueue(msData);
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('testing', 'ms_documentation', 1, 20, assetSlug, 'sample-2', '1.0.1');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '1.0.1'
       && obj.asset_slug === assetSlug && obj.title_slug === 'sample-2');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 1.0.1 with asset slug ${assetSlug} and sample-2' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES014]] Should check if document is present in search result for  ms_documentation with auto mode', async (done) => {
    portal.startTestLog('[[ES014]]');

    const response = await portal.elasticSearchwithType('testing', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.asset_slug === 'test-auto-search-ms-doc') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain test-auto-search-ms-doc asset_slug ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES014.1]] Should check if document is present in search result for  ms_documentation, check assembly', async (done) => {
    portal.startTestLog('[[ES014.1]]');

    const response = await portal.elasticSearchwithType('Assembly Documentation', 'ms_documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Assembly Documentation',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.asset_slug === 'assembly-with-docs') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain test-auto-search-ms-doc asset_slug ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });


  it('[[ES015]] Should update MS and check if  document is present in search result Auto mode', async (done) => {
    portal.startTestLog('[[ES015]]');
    const msData = data.demoService_with_search3;
    const assetSlug = msData.slug;
    msData.repo_urls = {
      development: '',
      release: `${mockArtifactory.artifactoryReadFolderUrl}/`,
    };
    await mockArtifactory.setARMFolder('tc02', done);
    const microserviceIDms = await portal.readMicroserviceId(assetSlug);
    await kernelQueue.isFree();
    await portal.updateMSAndWaitTheMSElasticQueue(msData, microserviceIDms);
    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');
    await kernelQueue.isFree();
    const response = await portal.documentElasticSearchOneResult('testing', 'ms_documentation', 1, 20, assetSlug, 'sample-4', '1.0.2');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'testing',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '1.0.2'
        && obj.asset_slug === assetSlug && obj.title_slug === 'sample-4');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 1.0.2 with asset slug ${assetSlug} and sample-4' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES016]] Should succesfully update MS with new Based On filed and check if it is appearing in search', async (done) => {
    portal.startTestLog('[[ES016]]');

    const msDataSearch = data.demoService_with_search;
    msDataSearch.based_on = 'SearchTest';
    const msUpdated = await portal.readMicroserviceId('test-automation-searchtr');
    const response = await portal.updateMSAndWaitTheMSElasticQueue(msDataSearch, msUpdated);
    await kernelQueue.isFree();

    const responseSearch = await portal.elasticSearchwithType('SearchTest', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'SearchTest',
      },
      response,
    });

    const allItems = responseSearch.body.data;

    let foundItemUpdate = false;
    allItems.filter((item) => {
      if (item.name === 'Test Automation SearchTr') {
        foundItemUpdate = true;
      }
      return foundItemUpdate;
    });

    expect(foundItemUpdate)
      .withContext(`[ response.body.data ] should contain Test Automation SearchT microservice ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES017]] Should succesfully delete MS  and check if it is not found in search', async (done) => {
    portal.startTestLog('[[ES017]]');

    const msDelete = await portal.readMicroserviceId('test-automation-searchtr');
    const response = await portal.deleteMSAndWaitTheMSElasticQueue(msDelete);
    await kernelQueue.isFree();

    expect(response.code).toBe(200);

    const responseSearch = await portal.elasticSearchwithType('SearchTr', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'SearchTest',
      },
      response,
    });

    const allItems = responseSearch.body.data;

    let foundItemMS = false;
    allItems.filter((item) => {
      if (item.name === 'Test Automation SearchTr') {
        foundItemMS = true;
      }
      return foundItemMS;
    });

    expect(foundItemMS)
      .withContext(`[ response.body.data ] should not contain Test Automation SearchTr ${allItems}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES018]] Basic Successful Search Test with type = microservices where assembly is checked, should find appropriate assembly and fields', async (done) => {
    portal.startTestLog('[[ES018]]');

    const response = await portal.elasticSearchwithType('Assembly Max Report', 'microservice', 1, 100);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Assembly Max Report',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Assembly Max Report') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Assembly Max Report MS name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    expect(response.body.data[0]._id)
      .withContext(`[ response.body.data[0]._id ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].name)
      .withContext(`[ response.body.data[0].name ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].slug)
      .withContext(`[ response.body.data[0].slug ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].description)
      .withContext(`[ response.body.data[0].description ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].highlight)
      .withContext(`[ response.body.data[0].highlight ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_fullurl)
      .withContext(`[ response.body.data[0].asset_fullurl ] should be defined: ${debug}`)
      .toBeDefined();

    expect(response.body.data[0].asset_document_fullurl)
      .withContext(`[ response.body.data[0].asset_document_fullurl ] should be defined: ${debug}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });

  it('[[ES019]] Basic Successful Search Test with type = microservices where assembly is checked, should find appropriate Assembly based on product number', async (done) => {
    portal.startTestLog('[[ES019]]');

    const response = await portal.elasticSearchwithType('APR20132', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'APR20132',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Assembly Update Test') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Assembly Update Test name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES020]] Basic Successful Search Test with type = microservices where assembly is checked, should find appropriate Assembly based on description', async (done) => {
    portal.startTestLog('[[ES019]]');

    const response = await portal.elasticSearchwithType('Assembly with documentation', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Assembly with documentation',
      },
      response,
    });
    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Assembly Max Report') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Assembly Max Report name ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });
});

describe('Testing Elastic Search for all tab', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });


  it('[[ES018]] Basic Successful Search Test, should find item from ms_documentation type', async (done) => {
    portal.startTestLog('[[ES018]]');

    const response = await portal.elasticSearch('Testing', 1, 100);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Testing',
      },
      response,
    });

    const allItems = response.body.data;
    let foundItem = false;
    allItems.filter((item) => {
      if (item.type === 'ms_documentation' && item.asset_slug === 'auto-ms-doc-sync-mock-artifactory' && item.version === '1.0.1') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain microservice documentation ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES019]] Basic Successful Search Test, should find item from microservice type', async (done) => {
    portal.startTestLog('[[ES019]]');

    const response = await portal.elasticSearch('Test', 1, 200);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Test',
      },
      response,
    });

    const allItems = response.body.data;
    let foundItem = false;
    allItems.filter((item) => {
      if (item.type === 'microservice' && item.slug === 'auto-ms-with-mock-artifactory') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain microservice auto-ms-with-mock-artifactory ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES020]] Basic Successful Search Test, should find item from content type', async (done) => {
    portal.startTestLog('[[ES020]]');

    const response = await portal.elasticSearch('ADP');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'ADP',
      },
      response,
    });

    const allItems = response.body.data;
    let foundItem = false;
    allItems.filter((item) => {
      if (item.type === 'page' && item.slug === 'adp_ci') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain page adp_ci ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES020.1]] Basic Successful Search Test, should find item from assembly_documentation type', async (done) => {
    portal.startTestLog('[[ES020.1]]');

    const response = await portal.elasticSearch('Assembly Documentation');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Assembly Documentation',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.type === 'assembly_documentation' && item.asset_slug === 'assembly-with-docs' && item.version === 'development') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain assembly documentation ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });
});

describe('Testing Elastic Search for test user without access', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTestUserEtapase);
    done();
  });


  it('[[ES021]] Basic Successful search for etapase', async (done) => {
    portal.startTestLog('[[ES021]]');

    const response = await portal.elasticSearchwithType('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
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

    await kernelQueue.isFree();
    done();
  });

  it('[[ES022]] Basic Successful Search Test, should find item from ms_documentation type for test user for all tab', async (done) => {
    portal.startTestLog('[[ES022]]');

    const response = await portal.elasticSearch('Testing');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Testing',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.type === 'ms_documentation' && item.asset_slug === 'auto-ms-with-docs' && item.version === '3.2.1') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain microservice documentation ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(Array.isArray(response.body.data))
      .withContext(`[ response.body.data ] should be an Array: ${debug}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES023]] Basic Successful search for etapase for all tab', async (done) => {
    portal.startTestLog('[[ES023]]');

    const response = await portal.elasticSearch('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'allSearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
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

    await kernelQueue.isFree();
    done();
  });

  it('[[ES024]] Basic Successful search for etapase for MS', async (done) => {
    portal.startTestLog('[[ES024]]');

    const response = await portal.elasticSearchwithType('Auto MS Restricted', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain Auto MS Restricted MS ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES025]] Basic Successful search for etapase for MS for all tab', async (done) => {
    portal.startTestLog('[[ES025]]');

    const response = await portal.elasticSearch('Auto MS Restricted');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'allSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should not contain Auto MS Restricted MS ${debug}`)
      .toEqual(false);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });
});


describe('Testing Elastic Search for test user with access to the page', () => {
  beforeAll(async (done) => {
    await portal.login(login.optionsTest);
    done();
  });


  it('[[ES026]] Basic Successful search for etesuse', async (done) => {
    portal.startTestLog('[[ES026]]');

    const response = await portal.elasticSearchwithType('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
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

    await kernelQueue.isFree();
    done();
  });

  it('[[ES027]] Basic Successful search for etesuse for all tab', async (done) => {
    portal.startTestLog('[[ES027]]');

    const response = await portal.elasticSearch('ADP Roadmaps');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'ADP Roadmaps',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
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

    await kernelQueue.isFree();
    done();
  });

  it('[[ES028]] Basic Successful search for etesuse for MS', async (done) => {
    portal.startTestLog('[[ES028]]');

    const response = await portal.elasticSearchwithType('Auto MS Restricted', 'microservice');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS Restricted MS ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[ES029]] Basic Successful search for etesuse for MS for all tab', async (done) => {
    portal.startTestLog('[[ES029]]');

    const response = await portal.elasticSearch('Auto MS Restricted', 1, 100);
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Auto MS Restricted',
      },
      response,
    });

    const allItems = response.body.data;

    let foundItem = false;
    allItems.filter((item) => {
      if (item.name === 'Auto MS Restricted') {
        foundItem = true;
      }
      return foundItem;
    });

    expect(foundItem)
      .withContext(`[ response.body.data ] should contain Auto MS Restricted MS ${debug}`)
      .toEqual(true);

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });
});
