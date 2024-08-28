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

  it('[[MIMERARMMENUCAT001]] Testing Microservice if documents from a merged menu are in the right category.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT001]] Testing Microservice if documents from a merged menu are in the right category.');

    const assetName = 'Auto MS Mimer and ARM Merged Menu';
    const assetSlug = 'auto-ms-mimer-and-arm-merged-menu';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14));
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

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

    // Checking the version
    expect(docs103.versionLabel)
      .withContext(`The [versionLabel] should be [1.0.3], got ${docs103.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('1.0.3');

    // Checking the CPI
    expect(docs103.isCpiUpdated)
      .withContext(`The [isCpiUpdated] should be [true], got ${docs103.isCpiUpdated} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(true);

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] comes from [mimer]
    expect(userGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [User Guide] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Api Specification] from [dpi] category
    const apiSpecificationDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'api-specification')
      : {};

    // Checking if the [Api Specification] comes from [mimer]
    expect(apiSpecificationDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Application Developers Guide] from [dpi] category
    const applicationDevelopersGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'application-developers-guide')
      : {};

    // Checking if the [Application Developers Guide] comes from [mimer]
    expect(applicationDevelopersGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Inner Source README] from [inner-source] category
    const innerSourceREADMEDocument = docs103
      && Array.isArray(docs103['inner-source'])
      ? docs103['inner-source'].find(ITEM => ITEM.slug === 'inner-source-readme')
      : {};

    // Checking if the [Inner Source README] comes from [arm]
    expect(innerSourceREADMEDocument.document_server_source)
      .withContext(`The [document_server_source] from [Inner Source README] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // Retrieving [Contributing Guideline] from [inner-source] category
    const contributingGuidelineDocument = docs103
      && Array.isArray(docs103['inner-source'])
      ? docs103['inner-source'].find(ITEM => ITEM.slug === 'contributing-guideline')
      : {};

    // Checking if the [Contributing Guideline] comes from [arm]
    expect(contributingGuidelineDocument.document_server_source)
      .withContext(`The [document_server_source] from [Contributing Guideline] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // [Release Documents] should contain only [mimer] documents.
    // Looking for [arm] misplaced documents.
    const releaseDocumentsAnyArm = docs103
      && Array.isArray(docs103['release-documents'])
      ? docs103['release-documents'].find(ITEM => ITEM.document_server_source === 'arm')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(releaseDocumentsAnyArm)
      .withContext(`The [releaseDocumentsAnyArm] should be [undefined], got ${releaseDocumentsAnyArm} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // [Additional Documents] should contain only [arm] documents.
    // Looking for [mimer] misplaced documents.
    const additionalDocumentsAnyMimer = docs103
      && Array.isArray(docs103['additional-documents'])
      ? docs103['additional-documents'].find(ITEM => ITEM.document_server_source === 'mimer')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(additionalDocumentsAnyMimer)
      .withContext(`The [additionalDocumentsAnyMimer] should be [undefined], got ${additionalDocumentsAnyMimer} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MIMERARMMENUCAT002]] Testing Assembly if documents from a merged menu are in the right category.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT002]] Testing Assembly if documents from a merged menu are in the right category.');

    const assetName = 'Auto Assembly Mimer and ARM Merged Menu';
    const assetSlug = 'auto-assembly-mimer-and-arm-merged-menu';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu User Guide', 'Auto Assembly Mimer and ARM Merged Menu User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu API Specification', 'Auto Assembly Mimer and ARM Merged Menu API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Application Developers Guide', 'Auto Assembly Mimer and ARM Merged Menu Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Contributing Guideline', 'Auto Assembly Mimer and ARM Merged Menu Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Test Specification', 'Auto Assembly Mimer and ARM Merged Menu Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Vulnerability Analysis Report', 'Auto Assembly Mimer and ARM Merged Menu Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Software Vendor List (SVL)', 'Auto Assembly Mimer and ARM Merged Menu Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment', 'Auto Assembly Mimer and ARM Merged Menu Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto Assembly Mimer and ARM Merged Menu Report', 'Auto Assembly Mimer and ARM Merged Menu Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const apiToken = await portal.readAccessTokenForAssembly(assetSlug);
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

    const msObjectResponse = await portal.getAssembly(assetSlug);

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

    // Checking the version
    expect(docs103.versionLabel)
      .withContext(`The [versionLabel] should be [1.0.3], got ${docs103.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('1.0.3');

    // Checking the CPI
    expect(docs103.isCpiUpdated)
      .withContext(`The [isCpiUpdated] should be [true], got ${docs103.isCpiUpdated} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(true);

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] comes from [mimer]
    expect(userGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [User Guide] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Api Specification] from [dpi] category
    const apiSpecificationDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'api-specification')
      : {};

    // Checking if the [Api Specification] comes from [mimer]
    expect(apiSpecificationDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Application Developers Guide] from [dpi] category
    const applicationDevelopersGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'application-developers-guide')
      : {};

    // Checking if the [Application Developers Guide] comes from [mimer]
    expect(applicationDevelopersGuideDocument.document_server_source)
      .withContext(`The [document_server_source] from [Api Specification] should be [mimer], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    // Retrieving [Inner Source README] from [inner-source] category
    const innerSourceREADMEDocument = docs103
      && Array.isArray(docs103['inner-source'])
      ? docs103['inner-source'].find(ITEM => ITEM.slug === 'inner-source-readme')
      : {};

    // Checking if the [Inner Source README] comes from [arm]
    expect(innerSourceREADMEDocument.document_server_source)
      .withContext(`The [document_server_source] from [Inner Source README] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // Retrieving [Contributing Guideline] from [inner-source] category
    const contributingGuidelineDocument = docs103
      && Array.isArray(docs103['inner-source'])
      ? docs103['inner-source'].find(ITEM => ITEM.slug === 'contributing-guideline')
      : {};

    // Checking if the [Contributing Guideline] comes from [arm]
    expect(contributingGuidelineDocument.document_server_source)
      .withContext(`The [document_server_source] from [Contributing Guideline] should be [arm], got ${userGuideDocument.document_server_source} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    // [Release Documents] should contain only [mimer] documents.
    // Looking for [arm] misplaced documents.
    const releaseDocumentsAnyArm = docs103
      && Array.isArray(docs103['release-documents'])
      ? docs103['release-documents'].find(ITEM => ITEM.document_server_source === 'arm')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(releaseDocumentsAnyArm)
      .withContext(`The [releaseDocumentsAnyArm] should be [undefined], got ${releaseDocumentsAnyArm} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // [Additional Documents] should contain only [arm] documents.
    // Looking for [mimer] misplaced documents.
    const additionalDocumentsAnyMimer = docs103
      && Array.isArray(docs103['additional-documents'])
      ? docs103['additional-documents'].find(ITEM => ITEM.document_server_source === 'mimer')
      : {};

    // The [releaseDocumentsAnyArm] should be undefined
    expect(additionalDocumentsAnyMimer)
      .withContext(`The [additionalDocumentsAnyMimer] should be [undefined], got ${additionalDocumentsAnyMimer} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MIMERARMMENUCAT003]] Testing if some documents were removed correctly.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT003]] Testing if some documents were removed correctly.');

    const assetName = 'Auto MS Mimer and ARM Merged Menu Second Edition';
    const assetSlug = 'auto-ms-mimer-and-arm-merged-menu-second-edition';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition User Guide', 'Auto MS Mimer and ARM Merged Menu Second Edition User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition API Specification', 'Auto MS Mimer and ARM Merged Menu Second Edition API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Application Developers Guide', 'Auto MS Mimer and ARM Merged Menu Second Edition Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Contributing Guideline', 'Auto MS Mimer and ARM Merged Menu Second Edition Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Test Specification', 'Auto MS Mimer and ARM Merged Menu Second Edition Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Vulnerability Analysis Report', 'Auto MS Mimer and ARM Merged Menu Second Edition Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Software Vendor List (SVL)', 'Auto MS Mimer and ARM Merged Menu Second Edition Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Risk Assessment & Privacy Impact Assessment', 'Auto MS Mimer and ARM Merged Menu Second Edition Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu Second Edition Report', 'Auto MS Mimer and ARM Merged Menu Second Edition Menu Report'));
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

    // The mimer_version_starter is '1.0.3',
    // so 1.0.1 should follow the classic ARM rules.

    const docs101 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      ? msObjectResponse.body.data.documentsForRendering['1.0.1']
      : {};

    // Checking the DPI in classic rule

    const docs101dpi = docs101
      && Array.isArray(docs101.dpi)
      ? docs101.dpi.find(ITEM => ITEM.document_server_source !== 'arm')
      : {};

    expect(docs101dpi)
      .withContext(`The [docs101dpi] should be [undefined] :: ${JSON.stringify(docs101dpi, null, 2)}`)
      .toEqual(undefined);

    // Checking the Release Documents in classic rule

    const docs101ReleaseDocuments = docs101
      && Array.isArray(docs101['release-documents'])
      ? docs101['release-documents'].find(ITEM => ITEM.document_server_source !== 'arm')
      : {};

    expect(docs101ReleaseDocuments)
      .withContext(`The [docs101ReleaseDocuments] should be [undefined] :: ${JSON.stringify(docs101ReleaseDocuments, null, 2)}`)
      .toEqual(undefined);

    // The mimer_version_starter is '1.0.3',
    // so 1.0.3 should follow the new Mimer/ARM merge rules.

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

    // Checking the Additional Documents in the new Mimer/ARM merge rules.

    const docs103AdditionalDocuments = docs103
      && Array.isArray(docs103['additional-documents'])
      ? docs103['additional-documents'].find(ITEM => ITEM.document_server_source !== 'arm')
      : {};

    expect(docs103AdditionalDocuments)
      .withContext(`The [docs103AdditionalDocuments] should be [undefined] :: ${JSON.stringify(docs103AdditionalDocuments, null, 2)}`)
      .toEqual(undefined);

    expect(docs103['additional-documents'].length)
      .withContext(`The [docs103['additional-documents']] should contain 2 documents, got ${docs103['additional-documents'].length} instead :: ${JSON.stringify(docs103['additional-documents'], null, 2)}`)
      .toEqual(2);

    const docs103document3name = docs103['additional-documents'][1].name;
    const docs103document4name = docs103['additional-documents'][0].name;

    expect(docs103document3name)
      .withContext(`The [docs103document1name] should be [PM Metrics], got [${docs103document3name}] instead :: ${JSON.stringify(docs103['additional-documents'][0], null, 2)}`)
      .toEqual('PM Metrics');

    expect(docs103document4name)
      .withContext(`The [docs103document4name] should be [API Specification], got [${docs103document4name}] instead :: ${JSON.stringify(docs103['additional-documents'][3], null, 2)}`)
      .toEqual('API Specification');

    await kernelQueue.isFree();
    done();
  });

   // =========================================================================================== //

  it('[[MIMERARMVERSIONSLIST001]] Testing Microservice versions to be fetched from artifactory and mimer server and update the menu correctly.', async (done) => {
    portal.startTestLog('[[MIMERARMVERSIONSLIST001]] Testing Microservice versions to be fetched from artifactory and mimer server and update the menu correctly.');

    const assetName = 'Auto MS Mimer and ARM Merged Menu List';
    const assetSlug = 'auto-ms-mimer-and-arm-merged-menu-list';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcarmmimerversionslist01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.1', '1.0.3', '1.0.7']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.1', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.7', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List User Guide', 'Auto MS Mimer and ARM Merged Menu List User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List API Specification', 'Auto MS Mimer and ARM Merged Menu List API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Application Developers Guide', 'Auto MS Mimer and ARM Merged Menu List Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Contributing Guideline', 'Auto MS Mimer and ARM Merged Menu List Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Test Specification', 'Auto MS Mimer and ARM Merged Menu List Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Vulnerability Analysis Report', 'Auto MS Mimer and ARM Merged Menu List Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Software Vendor List (SVL)', 'Auto MS Mimer and ARM Merged Menu List Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Risk Assessment & Privacy Impact Assessment', 'Auto MS Mimer and ARM Merged Menu List Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Mimer and ARM Merged Menu List Report', 'Auto MS Mimer and ARM Merged Menu List Report'));
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

    const listOfVersion = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.documentsForRendering ?
    msObjectResponse.body.data.documentsForRendering : [];

    expect(Object.keys(listOfVersion)).toEqual(['development', '1.0.7', '1.0.3', '1.0.1']);

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcarmmimerversionslist01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.1', '1.0.3', '1.0.4', '1.0.7']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.1', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.7', 14));
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

    const apiToken1 = await portal.readAccessTokenForMS(assetSlug);
    await portalPublic.documentRefreshIDQueue(apiToken1);

    await kernelQueue.isFree();

    await mimer1.mimerUpdateDoc(assetSlug, true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse1 = await portal.getMS(assetSlug);

    const newlistOfVersion = msObjectResponse1
    && msObjectResponse1.body
    && msObjectResponse1.body.data
    && msObjectResponse1.body.data.documentsForRendering ?
    msObjectResponse1.body.data.documentsForRendering : [];

    expect(Object.keys(newlistOfVersion)).toEqual(['development', '1.0.7', '1.0.4', '1.0.3', '1.0.1']);

    await kernelQueue.isFree();
    done();
  });
  // =========================================================================================== //

  it('[[MIMERARMMENUCAT004]] Testing Microservice if User Guide is the default document.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT004]] Testing Microservice if User Guide is the default document.');

    const assetName = 'Auto MS Merged Menu';
    const assetSlug = 'auto-ms-merged-menu';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Merged Menu User Guide', 'Auto MS Merged Menu User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Merged Menu API Specification', 'Auto MS Merged Menu API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Merged Menu Application Developers Guide', 'Auto MS Merged Menu Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Merged Menu Contributing Guideline', 'Auto MS Merged Menu Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Merged Menu Test Specification', 'Auto MS Merged Menu Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Merged Menu Vulnerability Analysis Report', 'Auto MS Merged Menu Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Menu Software Vendor List (SVL)', 'Auto MS Merged Menu Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Merged Menu Risk Assessment & Privacy Impact Assessment', 'Auto MS Merged Menu Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Merged Menu Report', 'Auto MS Merged Menu Report'));
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

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

   // Checking the version
    expect(docs103.versionLabel)
      .withContext(`The [versionLabel] should be [1.0.3], got ${docs103.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('1.0.3');

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] is default document
    expect(userGuideDocument.default)
      .withContext(`The [default] for [User Guide] should be [true], got ${userGuideDocument.default} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(true);

    await kernelQueue.isFree();
    done();
  });
  // =========================================================================================== //
  it('[[MIMERARMMENUCAT005]] Testing Microservice if User Guide is not the default document.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT005]] Testing Microservice if User Guide is not the default document.');

    const assetName = 'Auto MS Merged Menu Without User Guide';
    const assetSlug = 'auto-ms-merged-menu-without-user-guide';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5', '1.0.7']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.7', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20135/7-6', 'Auto MS Merged Menu Without User Guide API Specification', 'Auto MS Merged Menu Without User Guide API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Application Developers Guide', 'Auto MS Merged Menu Without User Guide Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Contributing Guideline', 'Auto MS Merged Menu Without User Guide Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Test Specification', 'Auto MS Merged Menu Without User Guide Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Vulnerability Analysis Report', 'Auto MS Merged Menu Without User Guide Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20135/7-6', 'Auto MS Menu Without User Guide Software Vendor List (SVL)', 'Auto MS Merged Menu Without User Guide Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Risk Assessment & Privacy Impact Assessment', 'Auto MS Merged Menu Without User Guide Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20135/7-6', 'Auto MS Merged Menu Without User Guide Report', 'Auto MS Merged Menu Report'));
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

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

    // Checking the version
    expect(docs103.versionLabel)
      .withContext(`The [versionLabel] should be [1.0.3], got ${docs103.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('1.0.3');

    // Retrieving [User Guide] from [dpi] category
    const userGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'user-guide')
      : {};

    // Checking if the [User Guide] is not present.
    expect(userGuideDocument)
      .withContext(`The [userGuideDocument] should be [undefined] , got ${userGuideDocument} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // Checking if the [Software Vendor List] is present in [released-documents] category.
    const softwareVendorListReleasedDocuments = docs103
    && Array.isArray(docs103['release-documents'])
    ? docs103['release-documents'].find(ITEM => ITEM.slug === 'software-vendor-list-svl')
    : {};

    // Checking if document-server-source for Software Vendor List(SVL) document is mimer.
    expect(softwareVendorListReleasedDocuments.document_server_source)
      .withContext(`The [softwareVendorListReleasedDocuments] should be [defined], got ${softwareVendorListReleasedDocuments} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('mimer');

    await kernelQueue.isFree();
    done();
  });
  // =========================================================================================== //
  it('[[MIMERARMMENUCAT006]] Testing Microservice if Application Developers Guide is the downloadable document.', async (done) => {
    portal.startTestLog('[[MIMERARMMENUCAT006]] Testing Microservice if Application Developers Guide is the downloadable document.');

    const assetName = 'Auto MS Merged Menu Category';
    const assetSlug = 'auto-ms-merged-menu-category';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await this.armTemplates.mockArmObject(mockServer, 'tcMimerArmCategory01');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', assetName, ['1.0.2', '1.0.3', '1.0.4', '1.0.5','1.0.7']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.2', 15));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.3', 15));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.4', 15));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.5', 15));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', assetName, '1.0.7', 15));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '1553', '1553-APR20135/7-6', 'Auto MS Merged Menu Category User Guide', 'Auto MS Merged Menu Category User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20135/7-6', 'Auto MS Merged Menu Category Characteristics Summary Report', 'Auto MS Merged Menu Category Characteristics Summary Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '19817', '19817-APR20135/7-6', 'Auto MS Merged Menu Category Application Developers Guide', 'Auto MS Merged Menu Category Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20135/7-6', 'Auto MS Merged Menu Category Product Revision Information', 'Auto MS Merged Menu Category Product Revision Information'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15241', '15241-APR20135/7-6', 'Auto MS Merged Menu Category Test Specification', 'Auto MS Merged Menu Category Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '1597', '1597-APR20135/7-6', 'Auto MS Merged Menu Category Vulnerability Analysis Report', 'Auto MS Merged Menu Category Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '0360', '0360-APR20135/7-6', 'Auto MS Merged Menu Category Secure Coding Report', 'Auto MS Merged Menu Category Secure Coding Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '00664', '00664-APR20135/7-6', 'Auto MS Merged Menu Category Risk Assessment & Privacy Impact Assessment', 'Auto MS Merged Menu Category Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15519', '15519-APR20135/7-6', 'Auto MS Merged Menu Category Test Report', 'Auto MS Merged Menu Category Test Report'));
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

    const docs103 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.3']
      ? msObjectResponse.body.data.documentsForRendering['1.0.3']
      : {};

   // Checking the version
    expect(docs103.versionLabel)
      .withContext(`The [versionLabel] should be [1.0.3], got ${docs103.versionLabel} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('1.0.3');

    // Retrieving [Application Developers Guide] from [dpi] category
    const applicationDevelopersGuideDocument = docs103
      && Array.isArray(docs103.dpi)
      ? docs103.dpi.find(ITEM => ITEM.slug === 'application-developers-guide')
      : {};

    // Checking if the [Application Developers Guide] is default document
    expect(applicationDevelopersGuideDocument.doc_mode)
      .withContext(`The [doc_mode] for [Application Developers Guide] should be [download], got ${applicationDevelopersGuideDocument.docmode} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('download');

    // Retrieving [Secure Coding Report] from [additional-documents] category
    const secureCodingReportDocument = docs103
      && Array.isArray(docs103['additional-documents'])
      ? docs103['additional-documents'].find(ITEM => ITEM.slug === 'secure-coding-report')
      : {};

    // Checking if the [Secure Coding Report] is present in [additional-documents] category.
    // [Secure Coding Report] should not be present in [additional-documents] category
    expect(secureCodingReportDocument)
      .withContext(`The [secureCodingReportDocument] should be [undefined], got ${applicationDevelopersGuideDocument.docmode} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // Retrieving [Secure Coding Report] from [released-documents] category
    const secureCodingReportFromReleasedDocuments = docs103
      && Array.isArray(docs103['released-documents'])
      ? docs103['released-documents'].find(ITEM => ITEM.slug === 'secure-coding-report')
      : {};

    // Checking if the [Secure Coding Report] is present in [released-documents] category.
    // [Secure Coding Report] should be present in [released-documents] category
    expect(secureCodingReportFromReleasedDocuments)
      .withContext(`The [secureCodingReportFromReleasedDocuments] should be [defined], got ${applicationDevelopersGuideDocument.docmode} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toBeDefined();

    // Retrieving [Characteristics Summary Report] from [additional-documents] category
    const characteristicsSummaryReportDocument = docs103
    && Array.isArray(docs103['additional-documents'])
    ? docs103['additional-documents'].find(ITEM => ITEM.slug === 'characteristics-summary-report')
    : {};

    // Checking if the [Characteristics Summary Report] is present in [additional-documents] category.
    // [Characteristics Summary Report] should not be present in [additional-documents] category
    expect(characteristicsSummaryReportDocument)
      .withContext(`The [characteristicsSummaryReportDocument] should be [undefined], got ${characteristicsSummaryReportDocument} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual(undefined);

    // Retrieving [Characteristics Summary Report] from [released-documents] category
    const characteristicsSummaryReportFromReleasedDocuments = docs103
      && Array.isArray(docs103['released-documents'])
      ? docs103['released-documents'].find(ITEM => ITEM.slug === 'characteristics-summary-report')
      : {};

    // Checking if the [Characteristics Summary Report] is present in [released-documents] category.
    // [Characteristics Summary Report] should be present in [released-documents] category
    expect(characteristicsSummaryReportFromReleasedDocuments)
      .withContext(`The [characteristicsSummaryReportFromReleasedDocuments] should be [defined], got ${characteristicsSummaryReportFromReleasedDocuments} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toBeDefined();

    // Checking if the [Software Vendor List] is present in [released-documents] category.
    const softwareVendorListReleasedDocuments = docs103
    && Array.isArray(docs103['release-documents'])
    ? docs103['release-documents'].find(ITEM => ITEM.slug === 'software-vendor-list-svl')
    : {};

    // Checking if document-server-source for Software Vendor List(SVL) document is ARM.
    expect(softwareVendorListReleasedDocuments.document_server_source)
      .withContext(`The [softwareVendorListReleasedDocuments] should be [defined], got ${softwareVendorListReleasedDocuments} instead :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toEqual('arm');

    await kernelQueue.isFree();
    done();
  });
  // =========================================================================================== //
});

module.exports = {
  MimerAPI,
};
