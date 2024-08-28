/* eslint-disable no-console */
/* eslint-disable jasmine/no-focused-tests */
const request = require('request');
const config = require('../test.config.js');
const urljoin = require('url-join');
const apiQueueClass = require('./apiQueue');
const { mockServer } = require('../test.config.js');
const login = require('../endpoints/login.js');
const {
  PortalPrivateAPI,
  PortalPublicAPI,
  MockArtifactory,
  configIntegration,
} = require('./apiClients');

const portalPublic = new PortalPublicAPI();
const mockArtifactory = new MockArtifactory();
const portal = new PortalPrivateAPI();
const kernelQueue = new apiQueueClass.ApiQueue();
const ArmTemplateClass = require('./armTemplates');

let originalValue;


const setArtifactoryMockFolder = async (FOLDERNAME, DONE) => {
  const mockArtifactoryReturn = await mockArtifactory.setFolder(FOLDERNAME);
  const expectedMockArtifactoryAnswer = `set folder of ${mockArtifactory.environmentTag} to ${FOLDERNAME}`;
  if (mockArtifactoryReturn !== expectedMockArtifactoryAnswer) {
    expect(mockArtifactoryReturn)
      .withContext(`The mockArtifactory should answer with '${expectedMockArtifactoryAnswer}', got ' ${mockArtifactoryReturn}' instead.`)
      .toEqual(expectedMockArtifactoryAnswer);
    DONE.fail();
  }
};


describe('ARM Document Refresh with parameter', () => {
  beforeAll(async (done) => {
    const setupConfigIntegration = await configIntegration(config.baseUrl);
    this.mockServer = setupConfigIntegration.body.mockServer;
    await portal.clearCache('ALLASSETS');
    await portal.login(login.optionsAdmin);
    request.post(login.optionsAdmin, async () => {
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
      done();
    });
  });


  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });


  it('[[ARMDR001]] Document Refresh should add a specific version without update other versions.', async (done) => {
    portal.startTestLog('[[ARMDR001]]');

    const msSlug = 'auto-ms-arm-parameter-test';
    await setArtifactoryMockFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken, '1.0.1');

    const debug0 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const statusCode = response
      && response.status
      ? response.status
      : null;

    expect(statusCode)
      .withContext(`The server code should be 200, got ${statusCode} instead: ${debug0}`)
      .toBe(200);

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const ms = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    // Checking the documents which should not be updated //

    const dev1 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][0]
      && ms.development['additional-documents'][0].slug
      ? ms.development['additional-documents'][0].slug
      : null;

    expect(dev1)
      .withContext(`Development slug document 1 should be [ original-dev-mock-document-1 ], found [ ${dev1} ] instead.`)
      .toEqual('original-dev-mock-document-1');

    const dev2 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][1]
      && ms.development['additional-documents'][1].slug
      ? ms.development['additional-documents'][1].slug
      : null;

    expect(dev2)
      .withContext(`Development slug document 2 should be [ original-dev-mock-document-2 ], found [ ${dev2} ] instead.`)
      .toEqual('original-dev-mock-document-2');

    const releaseV2D1 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][0]
      && ms['1.0.2']['additional-documents'][0].slug
      ? ms['1.0.2']['additional-documents'][0].slug
      : null;

    expect(releaseV2D1)
      .withContext(`Release slug document 1 should be [ original-release-mock-document-1 ], found [ ${releaseV2D1} ] instead.`)
      .toEqual('original-release-mock-document-1');

    const releaseV2D2 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][1]
      && ms['1.0.2']['additional-documents'][1].slug
      ? ms['1.0.2']['additional-documents'][1].slug
      : null;

    expect(releaseV2D2)
      .withContext(`Release slug document 2 should be [ original-release-mock-document-2 ], found [ ${releaseV2D2} ] instead.`)
      .toEqual('original-release-mock-document-2');

    // Checking the documents from the 1.0.1 version added by this test //

    const releaseV1D1 = ms
      && ms['1.0.1']
      && ms['1.0.1']['additional-documents']
      && ms['1.0.1']['additional-documents'][0]
      && ms['1.0.1']['additional-documents'][0].slug
      ? ms['1.0.1']['additional-documents'][0].slug
      : null;

    expect(releaseV1D1)
      .withContext(`Release slug document 1 added should be [ sample-1 ], found [ ${releaseV1D1} ] instead.`)
      .toEqual('sample-1');

    const releaseV1D2 = ms
      && ms['1.0.1']
      && ms['1.0.1']['additional-documents']
      && ms['1.0.1']['additional-documents'][1]
      && ms['1.0.1']['additional-documents'][1].slug
      ? ms['1.0.1']['additional-documents'][1].slug
      : null;

    expect(releaseV1D2)
      .withContext(`Release slug document 2 added should be [ sample-2 ], found [ ${releaseV1D2} ] instead.`)
      .toEqual('sample-2');

    await kernelQueue.isFree();
    done();
  });

  it('[[ARMDR002]] Document Refresh should not update not existing version', async (done) => {
    portal.startTestLog('[[ARMDR002]]');

    const msSlug = 'auto-ms-arm-parameter-test';
    await setArtifactoryMockFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken, '1.0.99');

    const debug0 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const statusCode = response
      && response.status
      ? response.status
      : null;

    expect(statusCode)
      .withContext(`The server code should be 404, got ${statusCode} instead: ${debug0}`)
      .toBe(404);

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const ms = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    // Checking the documents which should not be updated //

    const dev1 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][0]
      && ms.development['additional-documents'][0].slug
      ? ms.development['additional-documents'][0].slug
      : null;

    expect(dev1)
      .withContext(`Development slug document 1 should be [ original-dev-mock-document-1 ], found [ ${dev1} ] instead.`)
      .toEqual('original-dev-mock-document-1');

    const dev2 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][1]
      && ms.development['additional-documents'][1].slug
      ? ms.development['additional-documents'][1].slug
      : null;

    expect(dev2)
      .withContext(`Development slug document 2 should be [ original-dev-mock-document-2 ], found [ ${dev2} ] instead.`)
      .toEqual('original-dev-mock-document-2');

    const releaseV2D1 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][0]
      && ms['1.0.2']['additional-documents'][0].slug
      ? ms['1.0.2']['additional-documents'][0].slug
      : null;

    expect(releaseV2D1)
      .withContext(`Release slug document 1 should be [ original-release-mock-document-1 ], found [ ${releaseV2D1} ] instead.`)
      .toEqual('original-release-mock-document-1');

    const releaseV2D2 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][1]
      && ms['1.0.2']['additional-documents'][1].slug
      ? ms['1.0.2']['additional-documents'][1].slug
      : null;

    expect(releaseV2D2)
      .withContext(`Release slug document 2 should be [ original-release-mock-document-2 ], found [ ${releaseV2D2} ] instead.`)
      .toEqual('original-release-mock-document-2');

    await kernelQueue.isFree();
    done();
  });


  it('[[ARMDR003]] Document Refresh should update the development version without update other versions.', async (done) => {
    portal.startTestLog('[[ARMDR003]]');

    const msSlug = 'auto-ms-arm-parameter-test-alternative-mock-source';

    await mockServer.clear({ path: '.*' });
    this.armTemplates = new ArmTemplateClass.ArmTemplates(this.mockServer);
    await this.armTemplates.mockArmObject(mockServer, 'tc02');

    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDQueue(apiToken, 'development');

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const ms = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    // Checking the documents which should not be updated //

    const releaseV2D1 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][0]
      && ms['1.0.2']['additional-documents'][0].slug
      ? ms['1.0.2']['additional-documents'][0].slug
      : null;

    expect(releaseV2D1)
      .withContext(`Release slug document 1 should be [ original-release-mock-document-1 ], found [ ${releaseV2D1} ] instead.`)
      .toEqual('original-release-mock-document-1');

    const releaseV2D2 = ms
      && ms['1.0.2']
      && ms['1.0.2']['additional-documents']
      && ms['1.0.2']['additional-documents'][1]
      && ms['1.0.2']['additional-documents'][1].slug
      ? ms['1.0.2']['additional-documents'][1].slug
      : null;

    expect(releaseV2D2)
      .withContext(`Release slug document 2 should be [ original-release-mock-document-2 ], found [ ${releaseV2D2} ] instead.`)
      .toEqual('original-release-mock-document-2');

    // Checking the documents from the 1.0.1 version added by this test //

    const dev1 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][0]
      && ms.development['additional-documents'][0].slug
      ? ms.development['additional-documents'][0].slug
      : null;

    expect(dev1)
      .withContext(`Development slug document 1 should be [ sample-1 ], found [ ${dev1} ] instead.`)
      .toEqual('sample-1');

    const dev2 = ms
      && ms.development
      && ms.development['additional-documents']
      && ms.development['additional-documents'][1]
      && ms.development['additional-documents'][1].slug
      ? ms.development['additional-documents'][1].slug
      : null;

    expect(dev2)
      .withContext(`Development slug document 2 should be [ sample-2 ], found [ ${dev2} ] instead.`)
      .toEqual('sample-2');

    await kernelQueue.isFree();
    done();
  });

  it('[[ARMDR004]] Document Refresh should not update when version is string', async (done) => {
    portal.startTestLog('[[ARMDR004]]');

    const msSlug = 'auto-ms-arm-parameter-test';
    await setArtifactoryMockFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken, 'true');

    const debug0 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const statusCode = response
      && response.status
      ? response.status
      : null;

    expect(statusCode)
      .withContext(`The server code should be 404, got ${statusCode} instead: ${debug0}`)
      .toBe(404);

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const ms = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    // Checking the documents which should not be updated //

    const releaseV2D1 = ms
     && ms['1.0.2']
     && ms['1.0.2']['additional-documents']
     && ms['1.0.2']['additional-documents'][0]
     && ms['1.0.2']['additional-documents'][0].slug
      ? ms['1.0.2']['additional-documents'][0].slug
      : null;

    expect(releaseV2D1)
      .withContext(`Release slug document 1 should be [ original-release-mock-document-1 ], found [ ${releaseV2D1} ] instead.`)
      .toEqual('original-release-mock-document-1');

    const releaseV2D2 = ms
     && ms['1.0.2']
     && ms['1.0.2']['additional-documents']
     && ms['1.0.2']['additional-documents'][1]
     && ms['1.0.2']['additional-documents'][1].slug
      ? ms['1.0.2']['additional-documents'][1].slug
      : null;

    expect(releaseV2D2)
      .withContext(`Release slug document 2 should be [ original-release-mock-document-2 ], found [ ${releaseV2D2} ] instead.`)
      .toEqual('original-release-mock-document-2');

    await kernelQueue.isFree();
    done();
  });
});
