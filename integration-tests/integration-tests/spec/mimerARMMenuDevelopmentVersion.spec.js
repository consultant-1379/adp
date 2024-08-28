/* eslint-disable no-console */
/* eslint-disable jasmine/no-focused-tests */
const urljoin = require('url-join');
const request = require('request');
const apiQueueClass = require('./apiQueue');
const config = require('../test.config.js');
const { mockServer } = require('../test.config.js');
const login = require('../endpoints/login.js');
const {
  PortalPrivateAPI, PortalPublicAPI, configIntegration,
} = require('./apiClients');

const MimerTemplateClass = require('./mimerTemplates');
const ArmTemplateClass = require('./armTemplates');

const portalPublic = new PortalPublicAPI();
const portal = new PortalPrivateAPI();
const kernelQueue = new apiQueueClass.ApiQueue();

class MimerAPI {
  constructor(token) {
    this.mimerDeleteToken = 'mimer/deletetoken';
    this.mimerRefreshToken = 'mimer/refreshtoken';
    this.mimerUpdateDocument = 'mimer/updateDocumentMenu';
    this.mimerUpdateDocumentForSync = 'mimer/MimerSync';
    this.token = token;
    this.apiQueue = new apiQueueClass.ApiQueue();
  }

  mimerDeleteTkn(callback) {
    const options = {
      url: urljoin(config.baseUrl, this.mimerDeleteToken),
      json: true,
      headers: { Authorization: this.token },
      strictSSL: false,
    };
    return request.get(options, callback);
  }

  mimerRefreshTkn(refreshToken, callback) {
    const options = {
      url: urljoin(config.baseUrl, this.mimerRefreshToken),
      json: true,
      body: { token: refreshToken },
      headers: { Authorization: this.token },
      strictSSL: false,
    };
    return request.post(options, callback);
  }

  mimerAdminSetInitialTokenRefresh(callback) {
    const refreshToken = 'tokenRefreshTest';
    return portal.login()
      .then((TOKEN) => {
        const options = {
          url: urljoin(config.baseUrl, this.mimerRefreshToken),
          json: true,
          body: { token: refreshToken },
          headers: { Authorization: TOKEN },
          strictSSL: false,
        };
        return request.post(options, callback);
      });
  }

  mimerUpdateDoc(assetSlug, updateAll = false) {
    const url = urljoin(config.baseUrl, this.mimerUpdateDocument, `${assetSlug}?updateAll=${updateAll}`);
    const options = {
      url,
      json: true,
      strictSSL: false,
    };
    return new Promise((resolve, reject) => request.get(options, async (error, response, body) => {
      if (error) {
        const errorOBJ = { error, code: response.statusCode, body };
        reject(errorOBJ);
      } else if (body && body.status !== true && !body.queueStatusLink) {
        console.log('[ mimerUpdateDoc ] body ::', body);
        const errorOBJ = { error, code: response.statusCode, body };
        reject(errorOBJ);
      } else {
        const msData = response
          && response.body
          ? response.body
          : undefined;
        await this.apiQueue.queue(msData.queueStatusLink, msData);
        resolve({ code: response.statusCode, body });
      }
    }));
  }

  mimerUpdateDocForSync(password, updateAll = false) {
    const url = urljoin(config.baseUrl, this.mimerUpdateDocumentForSync, `?updateAll=${updateAll}&userPassword=${password}`);

    const options = {
      url,
      json: true,
      strictSSL: false,
    };
    return new Promise((resolve, reject) => request.get(options, async (error, response, body) => {
      if (error) {
        const errorOBJ = { error, code: response.statusCode, body };
        reject(errorOBJ);
      } else if (body && body.status !== true && !body.queueStatusLink) {
        console.log('[ mimerUpdateDocForSync ] body ::', body);
        const errorOBJ = { error, code: response.statusCode, body };
        reject(errorOBJ);
      } else {
        const msData = response
          && response.body
          ? response.body
          : undefined;
        await this.apiQueue.queue(msData.queueStatusLink, msData);
        resolve({ code: response.statusCode, body });
      }
    }));
  }
}

let token = 'Bearer ';
let mimer = null;
let mimer1 = null;

const mockaAuth = {
  httpRequest: {
    method: 'POST',
    path: '/mimerserver/authn/api/v2/refresh-token',
    body: { token: 'tokenRefreshTest' },
    headers: { 'Content-Type': ['application/json'], 'X-On-Behalf-Of': ['eadphub'] },
  },
  httpResponse: {
    statusCode: 200,
    body: JSON.stringify({
      results: [{
        operation: 'Authentication',
        code: 'OK',
        correlationId: '123',
        messages: [],
        data: {
          access_token: 'accessTokenTest',
          signum: 'eadphub',
          refresh_token: 'tokenRefreshTest',
          ext_expires_in: 1000,
          token_type: 'Bearer',
          expires_in: 1000,
        },
      }],
    }),
  },
  times: {
    unlimited: true,
  },
};

let originalValue;

// ============================================================================================= //
// ============================================================================================= //
// ============================================================================================= //

describe('Tests of Mimer and ARM Menu Documentation Category Rules', () => {
  beforeAll(async (done) => {
    const setupConfigIntegration = await configIntegration(config.baseUrl);
    this.mimerMockServer = setupConfigIntegration.body.mimerServer;
    this.muninMockServer = setupConfigIntegration.body.muninServer;
    this.eridocMockServer = setupConfigIntegration.body.eridocServer;
    this.primDDMockServer = setupConfigIntegration.body.primDDServer;
    this.mimerTemplates = new MimerTemplateClass.MimerTemplates(
      this.mimerMockServer,
      this.muninMockServer,
      this.eridocMockServer,
      this.primDDMockServer,
    );
    this.mockServer = setupConfigIntegration.body.mockServer;
    const mockServerLastChar = (`${this.mockServer}`)[(`${this.mockServer}`).length - 1];
    if (mockServerLastChar !== '/') {
      this.mockServer = `${this.mockServer}/`;
    }
    this.armTemplates = new ArmTemplateClass.ArmTemplates(
      this.mockServer,
    );
    this.integrationMockTestsPassword = setupConfigIntegration.body.integrationTestsPassword;
    request.post(login.optionsAdmin, async (error, response, body) => {
      token += login.callback(error, response, body);
      mimer = new MimerAPI(token);
      mimer1 = new MimerAPI();
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      await mimer.mimerAdminSetInitialTokenRefresh();
      await portal.login();
      done();
    });
  });

  // =========================================================================================== //

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  // =========================================================================================== //

  it('[[MIMERARMMENUDEV001]] Testing if development version is merged with the right version from Mimer.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUDEV001]] Testing if development version is merged with the right version from Mimer.');

    const assetName = 'Auto MS Mimer and ARM Merged Menu';
    const assetSlug = 'auto-ms-mimer-and-arm-merged-menu';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.6']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14, 'InWork'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.6', 14, 'InWork'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu User Guide', 'Auto MS Mimer and ARM Merged Menu User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu API Specification', 'Auto MS Mimer and ARM Merged Menu API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Application Developers Guide', 'Auto MS Mimer and ARM Merged Menu Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Contributing Guideline', 'Auto MS Mimer and ARM Merged Menu Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Test Specification', 'Auto MS Mimer and ARM Merged Menu Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Vulnerability Analysis Report', 'Auto MS Mimer and ARM Merged Menu Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Software Vendor List (SVL)', 'Auto MS Mimer and ARM Merged Menu Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment', 'Auto MS Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Report', 'Auto MS Mimer and ARM Merged Menu Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const apiToken = await portal.readAccessTokenForMS(assetSlug);
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    await mimer1.mimerUpdateDoc(assetSlug, true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(assetSlug);

    const docsDev = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering.development
      ? msObjectResponse.body.data.documentsForRendering.development
      : {};

    expect(docsDev
      && Array.isArray(docsDev.dpi)
      && docsDev.dpi[0]
      ? docsDev.dpi[0].approval_date
      : null)
      .withContext(`The document should contain approval_date :: ${(docsDev.dpi[0].approval_date)}`)
      .toEqual('2022-07-08');

    // Checking the version
    expect(docsDev.versionLabel)
      .withContext(`The [versionLabel] should be [development], got ${docsDev.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('development');

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docsDev
      && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] comes from [mimer]
    expect(userGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [User Guide] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Api Specification] from [dpi] category
    const apiSpecificationDocument = docsDev
      && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'api-specification')
      : {};

    // Checking if the [Api Specification] comes from [mimer]
    expect(apiSpecificationDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Application Developers Guide] from [dpi] category
    const applicationDevelopersGuideDocument = docsDev
      && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'application-developers-guide')
      : {};

    // Checking if the [Application Developers Guide] comes from [mimer]
    expect(applicationDevelopersGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Inner Source README] from [inner-source] category
    const innerSourceREADMEDocument = docsDev
      && Array.isArray(docsDev['inner-source'])
      ? docsDev['inner-source'].find(ITEM => ITEM.slug === 'inner-source-readme')
      : {};

    // Checking if the [Inner Source README] comes from [arm]
    expect(innerSourceREADMEDocument.document_server_source)
      .withContext(`The [document_server_source] from [Inner Source README] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // Retrieving [Contributing Guideline] from [inner-source] category
    const contributingGuidelineDocument = docsDev
      && Array.isArray(docsDev['inner-source'])
      ? docsDev['inner-source'].find(ITEM => ITEM.slug === 'contributing-guideline')
      : {};

    // Checking if the [Contributing Guideline] comes from [arm]
    expect(contributingGuidelineDocument.document_server_source)
      .withContext(`The [document_server_source] from [Contributing Guideline] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // [Release Documents] should contain only [mimer] documents.
    // Looking for [arm] misplaced documents.
    const releaseDocumentsAnyArm = docsDev
      && Array.isArray(docsDev['release-documents'])
      ? docsDev['release-documents'].find(ITEM => ITEM.document_server_source === 'arm')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(releaseDocumentsAnyArm)
      .withContext(`The [releaseDocumentsAnyArm] should be [undefined], got ${releaseDocumentsAnyArm} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // [Additional Documents] should contain only [arm] documents.
    // Looking for [mimer] misplaced documents.
    const additionalDocumentsAnyMimer = docsDev
      && Array.isArray(docsDev['additional-documents'])
      ? docsDev['additional-documents'].find(ITEM => ITEM.document_server_source === 'mimer')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(additionalDocumentsAnyMimer)
      .withContext(`The [additionalDocumentsAnyMimer] should be [undefined], got ${additionalDocumentsAnyMimer} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    await kernelQueue.isFree();

    const doc1 = await portal.documentGet(assetSlug, 'development', 'inner-source', 'inner-source-readme');
    const doc1Content = doc1
      && doc1.body
      && doc1.body.data
      && doc1.body.data.body
      ? doc1.body.data.body
      : '';

    expect(doc1Content.indexOf('/armserver/dev/custom_inner-source-readme.html'))
      .withContext(`The content of this document should contain specific strings :: ${JSON.stringify(doc1, null, 2)}`)
      .toBeGreaterThanOrEqual(0);

    const doc2 = await portal.documentGet(assetSlug, 'development', 'inner-source', 'contributing-guideline');
    const doc2Content = doc2
      && doc2.body
      && doc2.body.data
      && doc2.body.data.body
      ? doc2.body.data.body
      : '';

    expect(doc2Content.indexOf('/armserver/dev/custom_contributing-guideline.html'))
      .withContext(`The content of this document should contain specific strings :: ${JSON.stringify(doc2, null, 2)}`)
      .toBeGreaterThanOrEqual(0);

    await kernelQueue.isFree();

    done();
  });

  // =========================================================================================== //

  it('[[MIMERARMMENUDEV002]] Testing if development version is merged with a version older than the mimer_version_starter.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUDEV002]] Testing if development version is merged with the right version from Mimer.');

    const assetName = 'Auto MS Mimer and ARM Merged Menu';
    const assetSlug = 'auto-ms-mimer-and-arm-merged-menu';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory02');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.0', '1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.6']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.0', 14, 'InWork'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.1', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14, 'InWork'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.6', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu User Guide', 'Auto MS Mimer and ARM Merged Menu User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu API Specification', 'Auto MS Mimer and ARM Merged Menu API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Application Developers Guide', 'Auto MS Mimer and ARM Merged Menu Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Contributing Guideline', 'Auto MS Mimer and ARM Merged Menu Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Test Specification', 'Auto MS Mimer and ARM Merged Menu Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Vulnerability Analysis Report', 'Auto MS Mimer and ARM Merged Menu Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Software Vendor List (SVL)', 'Auto MS Mimer and ARM Merged Menu Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment', 'Auto MS Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Report', 'Auto MS Mimer and ARM Merged Menu Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const apiToken = await portal.readAccessTokenForMS(assetSlug);
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    await mimer1.mimerUpdateDoc(assetSlug, true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(assetSlug);

    const docsDev = msObjectResponse
        && msObjectResponse.body
        && msObjectResponse.body.data
        && msObjectResponse.body.data.documentsForRendering
        && msObjectResponse.body.data.documentsForRendering.development
      ? msObjectResponse.body.data.documentsForRendering.development
      : {};

    // Checking the version
    expect(docsDev.versionLabel)
      .withContext(`The [versionLabel] should be [development], got ${docsDev.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('development');

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docsDev
        && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] comes from [mimer]
    expect(userGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [User Guide] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Api Specification] from [dpi] category
    const apiSpecificationDocument = docsDev
        && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'api-specification')
      : {};

    // Checking if the [Api Specification] comes from [mimer]
    expect(apiSpecificationDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Application Developers Guide] from [dpi] category
    const applicationDevelopersGuideDocument = docsDev
        && Array.isArray(docsDev.dpi)
      ? docsDev.dpi.find(ITEM => ITEM.slug === 'application-developers-guide')
      : {};

    // Checking if the [Application Developers Guide] comes from [mimer]
    expect(applicationDevelopersGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Inner Source README] from [inner-source] category
    const innerSourceREADMEDocument = docsDev
        && Array.isArray(docsDev['inner-source'])
      ? docsDev['inner-source'].find(ITEM => ITEM.slug === 'inner-source-readme')
      : {};

    // Checking if the [Inner Source README] comes from [arm]
    expect(innerSourceREADMEDocument.document_server_source)
      .withContext(`The [document_server_source] from [Inner Source README] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // Retrieving [Contributing Guideline] from [inner-source] category
    const contributingGuidelineDocument = docsDev
        && Array.isArray(docsDev['inner-source'])
      ? docsDev['inner-source'].find(ITEM => ITEM.slug === 'contributing-guideline')
      : {};

    // Checking if the [Contributing Guideline] comes from [arm]
    expect(contributingGuidelineDocument.document_server_source)
      .withContext(`The [document_server_source] from [Contributing Guideline] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // [Release Documents] should contain only [mimer] documents.
    // Looking for [arm] misplaced documents.
    const releaseDocumentsAnyArm = docsDev
        && Array.isArray(docsDev['release-documents'])
      ? docsDev['release-documents'].find(ITEM => ITEM.document_server_source === 'arm')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(releaseDocumentsAnyArm)
      .withContext(`The [releaseDocumentsAnyArm] should be [undefined], got ${releaseDocumentsAnyArm} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // [Additional Documents] should contain only [arm] documents.
    // Looking for [mimer] misplaced documents.
    const additionalDocumentsAnyMimer = docsDev
        && Array.isArray(docsDev['additional-documents'])
      ? docsDev['additional-documents'].find(ITEM => ITEM.document_server_source === 'mimer')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(additionalDocumentsAnyMimer)
      .withContext(`The [additionalDocumentsAnyMimer] should be [undefined], got ${additionalDocumentsAnyMimer} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    await kernelQueue.isFree();

    const doc1 = await portal.documentGet(assetSlug, 'development', 'inner-source', 'inner-source-readme');
    const doc1Content = doc1
        && doc1.body
        && doc1.body.data
        && doc1.body.data.body
      ? doc1.body.data.body
      : '';

    expect(doc1Content.indexOf('/armserver/dev/custom_inner-source-readme.html'))
      .withContext(`The content of this document should contain specific strings :: ${JSON.stringify(doc1, null, 2)}`)
      .toBeGreaterThanOrEqual(0);

    const doc2 = await portal.documentGet(assetSlug, 'development', 'inner-source', 'contributing-guideline');
    const doc2Content = doc2
        && doc2.body
        && doc2.body.data
        && doc2.body.data.body
      ? doc2.body.data.body
      : '';

    expect(doc2Content.indexOf('/armserver/dev/custom_contributing-guideline.html'))
      .withContext(`The content of this document should contain specific strings :: ${JSON.stringify(doc2, null, 2)}`)
      .toBeGreaterThanOrEqual(0);

    await kernelQueue.isFree();

    done();
  });

  // =========================================================================================== //

  it('[[MIMERARMMENUDEV003]] Testing the approval date from Mimer.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUDEV003]] Testing the approval date from Mimer.');

    const assetName = 'Auto MS Approval Date from Mimer';
    const assetSlug = 'auto-ms-approval-date-from-mimer';

    await portal.login();

    const msObjectResponse = await portal.getMS(assetSlug);

    const docsDev = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering.development
      ? msObjectResponse.body.data.documentsForRendering.development
      : {};

    expect(docsDev && Array.isArray(docsDev.dpi) &&  docsDev.dpi[0] ? docsDev.dpi[0].approval_date : null ).withContext(`The document should contain approval_date :: ${(docsDev.dpi[0].approval_date)}`).toEqual('2022-07-08');

    done();
  });

  // =========================================================================================== //
});

module.exports = {
  MimerAPI,
};
