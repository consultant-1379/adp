/* eslint-disable no-console */
/* eslint-disable jasmine/no-focused-tests */
const urljoin = require('url-join');
const request = require('request');
const apiQueueClass = require('./apiQueue');
const config = require('../test.config.js');
const { mockServer } = require('../test.config.js');
const login = require('../endpoints/login.js');
const data = require('../test.data.js');
const {
  PortalPrivateAPI, PortalPublicAPI, MockArtifactory, configIntegration,
} = require('./apiClients');

const MimerTemplateClass = require('./mimerTemplates');

const portalPublic = new PortalPublicAPI();
const mockArtifactory = new MockArtifactory();
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

  mimerUpdateDoc(msSlug, updateAll = false) {
    const url = urljoin(config.baseUrl, this.mimerUpdateDocument, `${msSlug}?updateAll=${updateAll}`);
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

describe('Basic tests for the mimer token maintenance', () => {
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

  it('[[MM001]] should refresh token for mimer', async (done) => {
    portal.startTestLog('[[MM001]] Refresh Token Mimer Test');
    mimer.mimerRefreshTkn('accessTokenTest', async (error, response) => {
      expect(response.statusCode).toBe(200);
      const data1 = response.body;

      expect(data1).toEqual(true);
      await kernelQueue.isFree();
      done();
    });
  });

  // =========================================================================================== //

  it('[[MM002]] should delete token for mimer', async (done) => {
    portal.startTestLog('[[MM002]] Delete Token Mimer Test');
    mimer.mimerDeleteTkn(async (error, response) => {
      expect(response.statusCode).toBe(200);
      const data2 = response.body;

      expect(data2.result).toBe('Token deleted.');
      await kernelQueue.isFree();
      done();
    });
  });

  // =========================================================================================== //

  it('[[MM003]] should check if token for mimer was already deleted ', async (done) => {
    portal.startTestLog('[[MM003]] Deleted Token Mimer Test');
    mimer.mimerDeleteTkn((error, response) => {
      expect(response.statusCode).toBe(200);
    });
    mimer.mimerDeleteTkn(async (error, response) => {
      expect(response.statusCode).toBe(200);
      const data3 = response.body;

      expect(data3.result).toBe('Token already deleted.');
      await kernelQueue.isFree();
      done();
    });
  });
});

// ============================================================================================= //
// ============================================================================================= //
// ============================================================================================= //

describe('Basic tests for the mimer API', () => {
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

  it('[[MM004]] should build menu with one version for the microservice based on mimer mock server', async (done) => {
    portal.startTestLog('[[MM004]] Mimer Test');
    const msName = 'Auto MS Max Mimer Edition';
    const msSlug = 'auto-ms-max-mimer-edition';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20131', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20131', msName, '8.3.0'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const version0 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : [];

    const documents0 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['8.3.0']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      ? msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      : [];

    const debugHelper = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? JSON.stringify(msObjectResponse.body.data.documentsForRendering, null, 2)
      : JSON.stringify(msObjectResponse.body, null, 2);

    expect(msObjectResponse.code)
      .withContext(`The code should be 200. Got ${msObjectResponse.code} instead! :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toBe(200);

    expect(Object.keys(version0))
      .withContext(`Should contain 8.3.0. Got ${JSON.stringify(Object.keys(version0), null, 2)} instead! :: ${debugHelper}`)
      .toContain('8.3.0');

    expect(documents0.length)
      .withContext(`The 8.3.0 should contain 8 documents. Got ${documents0.length} documents instead! :: ${debugHelper}`)
      .toEqual(8);

    expect(version0.length)
      .withContext(`The version length should not be zero. Got ${debugHelper}`)
      .not.toEqual(0);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM005]] should build menu with several versions for the microservice based on mimer mock', async (done) => {
    portal.startTestLog('[[MM005]] Mimer, ElasticSearch & ARM Test');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });
    await portal.login();
    await mockArtifactory.setARMFolder('tcMimer', done);
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 1));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 2));

    const documentresponse = await portal.elasticDBSyncAfterDocumentFetch(msSlug, '8.3.0', 'release-documents', '15283-apr201317-6');

    await kernelQueue.isFree();

    expect(documentresponse.code)
      .withContext(`A Queue Status Link should be returned: got ${JSON.stringify(documentresponse, null, 2)}`)
      .toBeDefined();

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM006]] should build menu with several versions for the microservice based on mimer mock and download document', async (done) => {
    portal.startTestLog('[[MM006]] Mimer Test');

    const msName = 'Auto MS Max Mimer Edition';
    const msSlug = 'auto-ms-max-mimer-edition';

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20131', msName, ['8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20131', msName, '8.3.0', 1));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20131', msName, '8.3.1', 2));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const version0 = msObjectResponse.body.data.documentsForRendering;
    const documents0 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['8.3.0']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      ? msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      : null;

    const documents1 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['8.3.1']
      && msObjectResponse.body.data.documentsForRendering['8.3.1']['release-documents']
      ? msObjectResponse.body.data.documentsForRendering['8.3.1']['release-documents']
      : null;

    const debugHelper = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? JSON.stringify(msObjectResponse.body.data.documentsForRendering, null, 2)
      : JSON.stringify(msObjectResponse.body, null, 2);

    expect(msObjectResponse.code)
      .withContext(`The code should be 200. Got ${debugHelper}`)
      .toBe(200);

    expect(Object.keys(version0))
      .withContext(`Should contain 8.3.0. Got ${debugHelper}`)
      .toContain('8.3.0');

    expect(documents0.length)
      .withContext(`The 8.3.0 should contain just one document. Got ${documents0.length} instead :: ${debugHelper}`)
      .toEqual(1);

    expect(Object.keys(version0))
      .withContext(`Should contain 8.3.1. Got ${debugHelper}`)
      .toContain('8.3.1');

    expect(documents1.length)
      .withContext(`The 8.3.1 should contain just one document. Got ${documents1.length} instead :: ${debugHelper}`)
      .toEqual(1);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM007]] should build menu for the microservice based on mimer and primdd mock and download zip document', async (done) => {
    portal.startTestLog('[[MM007]]');
    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135/versions/8.3.0' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 3));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/10921-APR20131%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20135/7-6', 'PRI', 'PRI'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentresponse, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM008]] should build menu for the microservice based on mimer and ARM menu', async (done) => {
    portal.startTestLog('[[MM008]]');
    const msName = 'Auto MS Mimer Arm';
    const msSlug = 'auto-ms-mimer-arm';

    await mockServer.clear({ path: '.*' });
    await portal.login();
    await mockArtifactory.setARMFolder('tc830Mimer', done);

    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const percentage = response
      && response.percentage
      ? response.percentage
      : null;

    expect(percentage)
      .withContext(`The job percentage should be 100.0, got ${percentage} instead: ${debug}`)
      .toEqual('100.00');

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 3));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20139/7-6', 'Mock User Guide', 'PRI'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'pri',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM009]] should build menu for the microservice based on mimer and primdd mock and download doc document', async (done) => {
    portal.startTestLog('[[MM009]] Mimer with mock file test');
    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '19817', '19817-APR20135/7-6', 'Application Developers Guide', 'Application Developers Guide'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDoc.docx', 'officedocument.wordprocessingml.document', 'mockFileDoc.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'application-developers-guide');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM010]] should build menu for the microservice based on mimer and primdd mock and doc document with docmode as newtab', async (done) => {
    portal.startTestLog('[[MM010]] Mimer with Mock Document');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 5));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '0360', '0360-APR20135/7-6', 'Secure Coding Report', `${msName} 8.3.0 Secure Coding Report`));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDoc.docx', 'officedocument.wordprocessingml.document', 'mockFileDoc.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'secure-coding-report');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'auto-ms-mimer-830-secure-coding-report',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const tutorialinfoFound = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['8.3.0']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].doc_mode === 'download')
      : null;

    expect(tutorialinfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM011]] should build menu for the microservice based on mimer and primdd mock and "renderable" zip document', async (done) => {
    portal.startTestLog('[[MM011]]');
    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 5));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '0360', '0360-APR20135/7-6', 'Secure Coding Report', 'Secure Coding Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'secure-coding-report');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'secure-coding-report',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const tutorialinfoFound = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.documentsForRendering
    && msObjectResponse.body.data.documentsForRendering['8.3.0']
    && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
    && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].doc_mode === 'api')
      : null;

    expect(tutorialinfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM012]] should build menu for the microservice based on mimer and primdd mock and download pdf document', async (done) => {
    portal.startTestLog('[[MM012]] Mimer & Document Get Test');

    await kernelQueue.isFree();

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 3));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20135/7-6', 'PRI', 'PRI'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'pri',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM013]] should build menu for the microservice based on mimer and primdd mock and download document which is not on table', async (done) => {
    portal.startTestLog('[[MM013]] Mimer Test');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 6));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10111', '10111-APR20135/7-6', 'PRI', 'PRI'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM014]] should build menu for the microservice based on mimer and primdd mock and download document which is not on table and has empty DocumentName in Primdd', async (done) => {
    portal.startTestLog('[[MM014]] Mimer Test');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 7));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', '10112-apr201357-6');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: '10112-apr201357-6',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM015]] should build menu for the microservice based on mimer and primdd mock and download document which is not on table and no DocumentName in Primdd', async (done) => {
    portal.startTestLog('[[MM015]]');
    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['Bearer accessTokenTest'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.0',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20135/versions/8.3.0'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20135',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135/versions/8.3.0' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135/versions/8.3.0',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['Bearer accessTokenTest'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.0',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '10112-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/10112-APR20131%2F7-6/A/en';
    await mockServer.clear({ path: fileURLPrimdd });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates.primXmlResponseDocument1256_1059(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';
    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFile.pdf`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/pdf'],
          'content-disposition': ['form-data; name=\'mockFile.pdf\'; filename*=UTF-8\'\'mockFile.pdf'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-mimer', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
        done();
      })
      .catch(() => {
        done.fail();
      });
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet('auto-ms-mimer', '8.3.0', 'release-documents', 'alarm-handler-user-guide');

    expect(documentresponse.code)
      .withContext(`A Queue Status Link should be returned: got ${JSON.stringify(documentresponse, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM015/2]] should build menu for the microservice and check if documentedBy has a priority over includes', async (done) => {
    portal.startTestLog('[[MM015/2]]');

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['Bearer accessTokenTest'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.0',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20135/versions/8.3.0'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20135',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135/versions/8.3.0',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['Bearer accessTokenTest'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.0',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
                documentedBy: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '10112-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/10112-APR20131%2F7-6/A/en';
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates.primXmlResponseDocument1256_1059(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd1 = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd1,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates.primXmlResponseDocument1272(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFile.pdf`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/pdf'],
          'content-disposition': ['form-data; name=\'mockFile.pdf\'; filename*=UTF-8\'\'mockFile.pdf'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-mimer', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet('auto-ms-mimer', '8.3.0', 'release-documents', 'alarm-handler-user-guide');

    expect(documentresponse.code)
      .withContext(`A Queue Status Link should be returned: got ${JSON.stringify(documentresponse, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();

    const documentresponse1 = await portal.documentGet('auto-ms-mimer', '8.3.0', 'release-documents', 'alarm-handler-developer-guide');

    expect(documentresponse1.code)
      .withContext(`A 400 code should be: got ${JSON.stringify(documentresponse, null, 2)}`)
      .toBe(400);

    await kernelQueue.isFree();
    done();
  });


  it('[[MM016]] should build menu for the microservice based on mimer and ARM where versions are different', async (done) => {
    portal.startTestLog('[[MM016]]');

    await mockServer.clear({ path: '.*' });

    await portal.login();
    await mockArtifactory.setARMFolder('tc01', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-mimer-1');
    const result = await portalPublic.documentRefreshIDQueue(apiToken);
    await kernelQueue.isFree();

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      mockArtifactoryFolder: 'tc01',
      apiToken,
      result,
    });

    const statusCode = result
      && result.status
      ? result.status
      : null;

    expect(statusCode)
      .withContext(`Status Code should be 200, got ${statusCode} instead: ${debug}`)
      .toEqual(200);

    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.0',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20135/versions/8.3.0'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20135',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135/versions/8.3.0',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.0',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates
          .primXmlResponseDocument3226_3030_2330_2021_1721_1487(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';
    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFileDoc.docx`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/doc'],
          'content-disposition': ['form-data; name=\'mockFileDoc.docx\'; filename*=UTF-8\'\'mockFileDoc.docx'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-mimer-1', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await portal.clearCache('ALLASSETS');
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-mimer-1');

    const menuDevelopment = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering.development
      && msObjectResponse.body.data.documentsForRendering.development['additional-documents']
      ? msObjectResponse.body.data.documentsForRendering.development['additional-documents'].length === 3
      : null;

    const menu830 = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['8.3.0']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['8.3.0']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    // expect(menuDevelopment)
    //   .withContext(`The return should be Truthy: ${JSON.stringify(msObjectResponse, null, 2)}`)
    //   .toBeTruthy();

    expect(menu830)
      .withContext(`The return should be Truthy: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toBeTruthy();

    await kernelQueue.isFree();
    done();
  });

  it('[[MM017]] should build menu for the microservice based on mimer and ARM where versions are combined', async (done) => {
    portal.startTestLog('[[MM017]]');

    await mockServer.clear({ path: '.*' });

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '1.0.1',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20135/versions/1.0.1'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20135',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135/versions/1.0.1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20135/versions/1.0.1',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';

    await mockServer.clear({ path: fileURLPrimdd });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates
          .primXmlResponseDocument3226_3030_2330_2021_1721_1487(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';

    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFileDoc.docx`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/doc'],
          'content-disposition': ['form-data; name=\'mockFileDoc.docx\'; filename*=UTF-8\'\'mockFileDoc.docx'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await portal.login();
    await mockArtifactory.setARMFolder('tc01', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-mimer-1');
    const result = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      mockArtifactoryFolder: 'tc01',
      apiToken,
      result,
    });

    const statusCode = result
      && result.status
      ? result.status
      : null;

    expect(statusCode)
      .withContext(`Status Code should be 200, got ${statusCode} instead: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();

    await mimer1.mimerUpdateDoc('auto-ms-mimer-1', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-mimer-1');

    const documentsForRendering = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    expect(documentsForRendering)
      .withContext(`documentsForRendering cannot be null! ${JSON.stringify(msObjectResponse.body.data, null, 2)}`)
      .not
      .toBeNull();

    const menu101release = documentsForRendering
      && documentsForRendering['1.0.1']
      && documentsForRendering['1.0.1']['release-documents']
      && documentsForRendering['1.0.1']['release-documents'][0]
      && documentsForRendering['1.0.1']['release-documents'][0].restricted === false
      && documentsForRendering['1.0.1']['release-documents'][0].name === 'Secure Coding Report'
      ? true
      : null;

    const menu101Additional = documentsForRendering
      && documentsForRendering['1.0.1']
      && documentsForRendering['1.0.1']['additional-documents']
      && documentsForRendering['1.0.1']['additional-documents'][1]
      && documentsForRendering['1.0.1']['additional-documents'][1].name === 'Sample 1'
      && documentsForRendering['1.0.1']['additional-documents'][2]
      && documentsForRendering['1.0.1']['additional-documents'][2].name === 'Sample 2'
      ? true
      : null;

    expect(menu101release)
      .withContext(`Should find the document 'Secure Coding Report' in 'release-documents' of version 1.0.1. But fail! ${JSON.stringify(documentsForRendering, null, 2)}`)
      .toBeTruthy();

    expect(menu101Additional)
      .withContext(`Should find the documents 'Sample 1' and 'Sample 2' in 'additional-documents' of version 1.0.1. But fail! ${JSON.stringify(documentsForRendering, null, 2)}`)
      .toBeTruthy();

    await kernelQueue.isFree();
    done();
  });

  it('[[MM018]] should build menu for the microservice based on mimer and ARM where versions are combined from particular versions', async (done) => {
    portal.startTestLog('[[MM018]]');

    await portal.login();
    await mockArtifactory.setARMFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-mimer-2');
    const result = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      mockArtifactoryFolder: 'tc02',
      apiToken,
      result,
    });

    const statusCode = result
      && result.status
      ? result.status
      : null;

    expect(statusCode)
      .withContext(`Status Code should be 200, got ${statusCode} instead: ${debug}`)
      .toEqual(200);

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '1.0.1',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.1'),
                },
                {
                  productVersionLabel: '1.0.2',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.2'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20140',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.1',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.2' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.2',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.2',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';

    await mockServer.clear({ path: fileURLPrimdd });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates
          .primXmlResponseDocument3226_3030_2330_2021_1721_1487(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';

    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFileDoc.docx`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/doc'],
          'content-disposition': ['form-data; name=\'mockFileDoc.docx\'; filename*=UTF-8\'\'mockFileDoc.docx'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-mimer-2', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await portal.clearCache('ALLASSETS');
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-mimer-2');

    const menu102release = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.2']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    const menu102Additional = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.2']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['additional-documents']
      ? msObjectResponse.body.data.documentsForRendering['1.0.2']['additional-documents'].length === 4
      : null;

    const menu101Additional = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['additional-documents']
      ? msObjectResponse.body.data.documentsForRendering['1.0.1']['additional-documents'].length === 3
      : null;


    expect(menu102release)
      .withContext(`The return should be Truthy for menu102release: ${msObjectResponse}`)
      .toBeTruthy();

    expect(menu102Additional)
      .withContext(`The return should be Truthy for menu102Additional: ${msObjectResponse}`)
      .toBeTruthy();

    expect(menu101Additional)
      .withContext(`The return should be Truthy for menu101Additional: ${msObjectResponse}`)
      .toBeTruthy();

    expect(msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'])
      .withContext(`The return should be undefined: ${msObjectResponse}`)
      .toBe(undefined);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM019]] should build menu for the microservice based on mimer and ARM where the same document present in two sources', async (done) => {
    portal.startTestLog('[[MM019]]');

    const msName = 'Auto MS Mimer 3';
    const msSlug = 'auto-ms-mimer-3';

    await mockServer.clear({ path: '.*' });
    await mockArtifactory.setARMFolder('tc01Mimer', done);

    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20140', msName, ['1.0.1', '1.0.2']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.1', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.2', 14));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15283', '15283-APR20140/7-6', 'User Guide', 'User Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15284', '15284-APR20140/7-6', 'API Specification', 'API Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15285', '15285-APR20140/7-6', 'Application Developers Guide', 'Application Developers Guide'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15286', '15286-APR20140/7-6', 'Contributing Guideline', 'Contributing Guideline'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15287', '15287-APR20140/7-6', 'Test Specification', 'Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15288', '15288-APR20140/7-6', 'Vulnerability Analysis Report', 'Vulnerability Analysis Report'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15289', '15289-APR20140/7-6', 'Software Vendor List (SVL)', 'Software Vendor List (SVL)'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15290', '15290-APR20140/7-6', 'Risk Assessment & Privacy Impact Assessment', 'Risk Assessment & Privacy Impact Assessment'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15291', '15291-APR20140/7-6', 'Report', 'Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    await portal.login();

    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const result = await portalPublic.documentRefreshIDQueue(apiToken);

    const statusCode = result
      && result.status
      ? result.status
      : null;

    expect(statusCode)
      .withContext(`Status Code should be 200, got ${statusCode} instead.`)
      .toEqual(200);

    await mimer1.mimerUpdateDoc(msSlug, true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await portal.clearCache('ALLASSETS');
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const menu101Dpi = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      && msObjectResponse.body.data.documentsForRendering['1.0.1'].dpi
      && msObjectResponse.body.data.documentsForRendering['1.0.1'].dpi[0]
      ? msObjectResponse.body.data.documentsForRendering['1.0.1'].dpi[0]
      : {};

    expect(menu101Dpi.name)
      .withContext(`First document name in DPI category should be "API Specification", got ${JSON.stringify(menu101Dpi, null, 2)}`)
      .toEqual('API Specification');

    const menu101RDocuments = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'][0]
      ? msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'][0]
      : {};

    expect(menu101RDocuments.name)
      .withContext(`First document name in Release Documents category should be "Report", got ${JSON.stringify(menu101RDocuments, null, 2)}`)
      .toEqual('Contributing Guideline');

    const menu101ADocuments = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['additional-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['additional-documents'][0]
      ? msObjectResponse.body.data.documentsForRendering['1.0.1']['additional-documents'][0]
      : {};

    expect(menu101ADocuments.name)
      .withContext(`First document name in Additional Documents category should be "An External", got ${JSON.stringify(menu101Dpi, null, 2)}`)
      .toEqual('An External');

    await kernelQueue.isFree();
    done();
  });

  it('[[MM020]] should check if versions are not updated if documents are missig in mimer', async (done) => {
    portal.startTestLog('[[MM020]]');
    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20132' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20132',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Min Mimer Edition',
              productNumber: 'APR20132',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-min-mimer-edition')
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
        done();
      })
      .catch(() => {
        done.fail();
      });

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-min-mimer-edition');
    const versions = msObjectResponse.body.data.documentsForRendering;

    expect(msObjectResponse.code).toBe(200);

    const theVersionsLength = versions ? Object.keys(versions).length : 0;

    expect(theVersionsLength)
      .withContext(`Should get no versions, got ${theVersionsLength} instead :: ${JSON.stringify(versions, null, 2)}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });


  it('[[MM021]] should check if versions are not updated if only munin documents are present', async (done) => {
    portal.startTestLog('[[MM021]]');
    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20132' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20132',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.1',
                  productVersionUrl: urljoin(this.muninMockServer, '/api/v1/products/APR20132/versions/8.3.1'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Min Mimer Edition',
              productNumber: 'APR20132',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20132/versions/8.3.1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20132/versions/8.3.1',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20132',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Min Mimer Edition',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/15241-APR20132/7',
                      language: 'Uen',
                      revision: 'F',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-min-mimer-edition', true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
        done();
      })
      .catch(() => {
        done.fail();
      });

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-min-mimer-edition');

    const versions = msObjectResponse.body.data.documentsForRendering;
    const versionsLength = Object.keys(versions).length;

    expect(msObjectResponse.code).toBe(200);
    expect(versionsLength)
      .withContext(`Versions Length should be zero got ${versionsLength} instead: ${JSON.stringify(versions, null, 2)}`)
      .toBe(0);

    await kernelQueue.isFree();
    done();
  });


  it('[[MM022]] should only add new versions to the existing one if updateAll=false(default option)', async (done) => {
    portal.startTestLog('[[MM022]]');
    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20133' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20133',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '8.3.3',
                  productVersionUrl: urljoin(this.muninMockServer, '/api/v1/products/APR20133/versions/8.3.3'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Munin Mock',
              productNumber: 'APR20133',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });
    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20133/versions/8.3.3' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20133/versions/8.3.3',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '8.3.3',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20131',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Munin Mock',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '1/1597-APR20131/7',
                      language: 'Uen',
                      revision: 'F',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDoc('auto-ms-mimer-mock')
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-mimer-mock');
    const versions = msObjectResponse.body.data.documentsForRendering;
    const versionsArray = Object.keys(versions);
    const versionsArrayLength = versionsArray.length;

    expect(msObjectResponse.code).toBe(200);
    expect(versionsArray).toContain('8.3.0');
    expect(versionsArray).toContain('8.3.1');
    expect(versionsArray).toContain('8.3.3');
    expect(versionsArrayLength).toEqual(3);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM023]] should run document Mimer sync and check if microservice was syncronized which already has documents', async (done) => {
    portal.startTestLog('[[MM023]]');

    const msName = 'Auto MS Mimer 4';
    const msSlug = 'auto-ms-mimer-4';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20140', msName, ['1.0.1', '1.0.2']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.1', 5));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.2', 5));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '0360', '0360-APR20140/7-6', 'Secure Coding Report', 'Secure Coding Report'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDoc.docx', 'application/docx', 'mockFileDoc.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDocForSync(this.integrationMockTestsPassword);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const menu102release = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.2']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    const debug = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? JSON.stringify(msObjectResponse.body.data.documentsForRendering, null, 2)
      : JSON.stringify(msObjectResponse, null, 2);

    expect(menu102release)
      .withContext(`The return should be Truthy for menu102release, got ${menu102release} instead: ${debug}`)
      .toBeTruthy();

    await portal.clearCache('ALLASSETS');
    done();
  });


  // =========================================================================================== //

  it('[[MM023A]] should run document Mimer sync and check if microservice was syncronized which already has documents', async (done) => {
    portal.startTestLog('[[MM023A]]');

    const msName = 'Auto MS Mimer 4';
    const msSlug = 'auto-ms-mimer-4';

    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20140', msName, ['1.0.1', '1.0.2']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.1' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.1', 5));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.2' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20140', msName, '1.0.2', 5));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/0360-APR20140%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '0360', '0360-APR20140/7-6', 'Secure Coding Report', 'Secure Coding Report'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDoc.docx', 'application/docx', 'mockFileDoc.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);

    const menu102release = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.2']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    const debug = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? JSON.stringify(msObjectResponse.body.data.documentsForRendering, null, 2)
      : JSON.stringify(msObjectResponse, null, 2);

    expect(menu102release)
      .withContext(`The return should be Truthy for menu102release, got ${menu102release} instead: ${debug}`)
      .toBeTruthy();

    await portal.clearCache('ALLASSETS');
    done();
  });

  // =========================================================================================== //

  it('[[MM024]] should run document Mimer sync and check if microservice was syncronized', async (done) => {
    portal.startTestLog('[[MM024]]');

    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '1.0.1',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.1'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20140',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.1' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.1',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';

    await mockServer.clear({ path: fileURLPrimdd });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates
          .primXmlResponseDocument3226_3030_2330_2021_1721_1487(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';

    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFileDoc.docx`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/doc'],
          'content-disposition': ['form-data; name=\'mockFileDoc.docx\'; filename*=UTF-8\'\'mockFileDoc.docx'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDocForSync(this.integrationMockTestsPassword)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('auto-ms-mimer-5');

    const menu101release = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.1']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'][0].restricted === false
      && msObjectResponse.body.data.documentsForRendering['1.0.1']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    expect(menu101release)
      .withContext(`The return should be Truthy for menu101release: ${msObjectResponse}`)
      .toBeTruthy();

    await portal.clearCache('ALLASSETS');
    done();
  });

  it('[[MM025]] should run document Mimer sync and check if microservice was not with mannual mode', async (done) => {
    portal.startTestLog('[[MM025]]');

    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '1.0.2',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.2'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20140',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20140/versions/1.0.2' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.2',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.2',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURLPrimdd = '/primddserver/REST/G3/CICD/Document/M/0360-APR20131%2F7-6/A/en';

    await mockServer.clear({ path: fileURLPrimdd });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: fileURLPrimdd,
      },
      httpResponse: {
        statusCode: 200,
        body: MimerTemplateClass.MimerTemplates
          .primXmlResponseDocument3226_3030_2330_2021_1721_1487(),
      },
      times: {
        unlimited: true,
      },
    });

    const fileURL = '/eridocserver/d2rest/repositories/eridoca/eridocument/.*';

    await mockServer.clear({ path: fileURL });

    const fs = require('fs');

    const BufferResponse = fs.readFileSync(`${__dirname}/testFiles/mockFileDoc.docx`);
    const base64Response = await BufferResponse.toString('base64');

    await mockServer.mockAnyResponse({
      httpRequest: {
        path: fileURL,
      },
      httpResponse: {
        headers: {
          'set-cookie': [
            'DOCUMENTUM-CLIENT-TOKEN=MockToken; Path=/d2rest/repositories/eridoca/; Secure; HttpOnly',
            'BIGipServerprod-d2rest=534534016.36895.0000; path=/; Secure',
          ],
          'content-type': ['application/doc'],
          'content-disposition': ['form-data; name=\'mockFileDoc.docx\'; filename*=UTF-8\'\'mockFileDoc.docx'],
          etag: ['W/"l7eCht3Q3r9bp7rmmxOxiAI862mQ38SMWUqitgCd7mk="'],
          'x-content-type-options': ['nosniff'],
          'x-xss-protection': ['1; mode=block'],
          'cache-control': ['no-cache, no-store, max-age=0, must-revalidate'],
          pragma: ['no-cache'],
          expires: ['0'],
          'strict-transport-security': ['max-age=31536000 ; includeSubDomains'],
          'x-frame-options': ['DENY'],
          'content-length': ['54513'],
          date: ['Fri, 24 Jun 2022 12:10:14 GMT'],
          'Access-Control-Allow-Origin': ['*'],
          'Access-Control-Allow-Credentials': ['true'],
          'Access-Control-Allow-Methods': ['GET, PUT, POST, DELETE, OPTIONS'],
          'Access-Control-Max-Age': ['-1'],
          'Access-Control-Allow-Headers': ['Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner, authorization'],
          'Access-Control-Expose-Headers': ['alertbanner'],
          connection: ['close'],
        },
        body: {
          type: 'BINARY',
          base64Bytes: base64Response,
        },
      },
      times: {
        unlimited: true,
      },
    });

    await mimer1.mimerUpdateDocForSync(this.integrationMockTestsPassword)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      }).catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();
    const msObjectResponse = await portal.getMS('auto-ms-mimer-auto-false');

    const menu102release = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      && msObjectResponse.body.data.documentsForRendering['1.0.2']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents']
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0]
      ? (msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].restricted === true
      && msObjectResponse.body.data.documentsForRendering['1.0.2']['release-documents'][0].name === 'Secure Coding Report')
      : null;

    expect(menu102release)
      .withContext(`The return should be Truthy for menu102release: ${msObjectResponse}`)
      .toBeFalsy();

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM026]] should run document Mimer sync and check if Elastic Search was syncronized for that microservice', async (done) => {
    portal.startTestLog('[[MM026]]');

    const msName = 'Auto MS Mimer 6';
    const msSlug = 'auto-ms-mimer-6';

    await portal.clearCache('ALLASSETS');
    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20149' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20149', msName, ['8.3.1', '8.3.0', '8.2.9']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20149/versions/8.3.1' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.1', 2));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20149/versions/8.3.0' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.0', 8));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20149/versions/8.2.9' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.2.9', 2));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/1%2F15241-APR20149%2F7/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15241', '1/15241-APR20149/7', 'Test Specification', 'Test Specification'));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/15241-APR20149%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15241', '15241-APR20149/7-6', 'Test Specification', 'Test Specification'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'test-specification');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'test-specification',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('Specification', 'ms_documentation', 1, 20, msSlug, 'test-specification', '8.3.0');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Specification',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '8.3.0'
      && obj.asset_slug === msSlug && obj.title_slug === 'test-specification');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents, got ${response.body.data.length} :: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find version 8.3.0 with asset slug auto-ms-mimer-6 and specification' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200, got ${response.code} instead :: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM027]] should run document Mimer sync and check if document is not found in search as version is below starter version', async (done) => {
    portal.startTestLog('[[MM027]] Mimer & ElasticSearch Test');

    const msName = 'Auto MS Mimer 6';
    const msSlug = 'auto-ms-mimer-6';

    await portal.login();

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20149', msName, ['8.2.9', '8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.2.9', 8));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.0', 2));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.1', 2));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15241', '15241-APR20149/7-6', 'Test Specification', 'Test Specification'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.2.9', 'release-documents', 'test-specification');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.2.9',
        doc_category: 'release-documents',
        doc_slug: 'test-specification',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 400, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(400);

    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('Specification', 'ms_documentation', 1, 20, msSlug, 'test-specification', '8.2.9');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Specification',
      },
      search_request: {
        keyword: 'Specification',
        type: 'ms_documentation',
        page: 1,
        pagesize: 20,
        ms_slug: msSlug,
        doc_slug: 'test-specification',
        doc_version: '8.2.9',
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200, got ${response.code} instead: ${JSON.stringify(debug, null, 2)}`)
      .toEqual(200);

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 0 documents: ${JSON.stringify(debug, null, 2)}`)
      .toBe(0);

    const notFoundDocumentWhichShouldNotExists = response.body.data.every(obj => obj.version === '8.2.9'
      && obj.asset_slug === msSlug && obj.title_slug === 'test-specification');

    expect(notFoundDocumentWhichShouldNotExists)
      .withContext(`Should find version 8.2.9 with asset slug auto-ms-mimer-6 and specification' ${debug}`)
      .toBeTruthy();

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM028]] should run document Mimer sync and check if document is found in search as version is changed to be above starter version', async (done) => {
    portal.startTestLog('[[MM028]] Mimer, ElasticSearch & Update Asset');

    const msName = 'Auto MS Mimer 6';
    const msSlug = 'auto-ms-mimer-6';

    await mockServer.clear({ path: '.*' });

    await portal.login();

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20149', msName, ['8.2.9', '8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.2.9', 8));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.0', 2));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20149', msName, '8.3.1', 2));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15241', '15241-APR20149/7-6', 'Test Specification', 'Test Specification'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const microserviceIDms6 = await portal.readMicroserviceId(msSlug);

    const msDataMimer = data.demoService_mimer_6;

    const responseUpdated = await portal.updateMS(msDataMimer, microserviceIDms6);

    expect(responseUpdated.code)
      .withContext(`The code after update microservice should be 200. Got ${responseUpdated.code} instead! :: ${JSON.stringify(responseUpdated, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const bodyAfterSecondUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterSecondUpdate.code)
      .withContext(`The code after second update should be 200. Got ${bodyAfterSecondUpdate.code} instead! :: ${JSON.stringify(bodyAfterSecondUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('specification', 'ms_documentation', 1, 20, msSlug, 'test-specification', '8.2.9');

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'specification',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '8.2.9'
        && obj.asset_slug === msSlug && obj.title_slug === 'test-specification');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 document: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find version 8.2.9 with asset slug auto-ms-mimer-6 and test-specification' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM029]] should run document Mimer sync and check if Elastic Search was syncronized for that microservice where document is in pdf', async (done) => {
    portal.startTestLog('[[MM029]]');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await portal.login();

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.1', '8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 10));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 3));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20135/7-6', 'Test Specification', 'Test Specification'));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '19817', '19817-APR20135/7', 'pri', 'pri'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFile.pdf', 'application/pdf', 'mockFile.pdf'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('pri', 'ms_documentation', 1, 20, msSlug, 'pri', '8.3.1');

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'pri',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '8.3.1'
         && obj.asset_slug === msSlug && obj.title_slug === 'pri');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents, got ${response.body.data.length} instead: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find version 8.3.0 with asset slug auto-ms-mimer and pri' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200, got ${response.code} instead: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM030]] should run document Mimer sync and check if Elastic Search was syncronized for that microservice where document is zip html', async (done) => {
    portal.startTestLog('[[MM030]]');

    const msName = 'Auto MS Mimer';
    const msSlug = 'auto-ms-mimer';

    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.1', '8.3.0']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135/versions/8.3.1' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 10));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20135/versions/8.3.0' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 3));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/10921-APR20135%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20135/7-6', 'PRI', 'PRI'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentElasticSearchOneResult('pri', 'ms_documentation', 1, 20, msSlug, 'pri', '8.3.0');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'pri',
      },
      response,
    });

    const result = response.body.data.every(obj => obj.version === '8.3.0'
         && obj.asset_slug === msSlug && obj.title_slug === 'pri');

    expect(response.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents, got ${response.body.data.length} instead: ${debug}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find version 8.3.0 with asset slug auto-ms-mimer and pri' ${debug}`)
      .toBeTruthy();

    expect(response.code)
      .withContext(`The server code should be 200, got ${response.code} instead: ${debug}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  // =========================================================================================== //

  it('[[MM031]] should build menu for the microservice based on mimer and ARM menu after documentRefresh is run', async (done) => {
    portal.startTestLog('[[MM031]]');

    const msName = 'Auto MS Mimer Arm 2';
    const msSlug = 'auto-ms-mimer-arm-2';

    await portal.login();
    await mockArtifactory.setARMFolder('tc830Mimer', done);

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20139' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20139/versions/8.3.0' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 3));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/10921-APR20149%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20139/7-6', 'PRI', 'PRI'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken);

    const mimerSync = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(mimerSync.code)
      .withContext(`Mimer Update Doc should get 200, got ${mimerSync.code} instead :: ${JSON.stringify(mimerSync, null, 2)}`)
      .toEqual(200);

    await portal.clearCache('ALLASSETS');
    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM032]] should build menu for the microservice based on mimer only after documentRefresh is run', async (done) => {
    portal.startTestLog('[[MM032]]');

    const msName = 'Auto MS Mimer Arm 3';
    const msSlug = 'auto-ms-mimer-arm-3';

    await portal.login();

    await mockServer.clear({ path: '/mimerserver/authn/api/v2/refresh-token' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20139' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));

    await mockServer.clear({ path: '/muninserver/api/v1/products/APR20139/versions/8.3.0' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 3));

    await mockServer.clear({ path: '/primddserver/REST/G3/CICD/Document/M/10921-APR20149%2F7-6/A/en' });
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '10921', '10921-APR20139/7-6', 'PRI', 'PRI'));

    await mockServer.clear({ path: '/eridocserver/d2rest/repositories/eridoca/eridocument/.*' });
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken);

    const mimerSync = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(mimerSync.code)
      .withContext(`Mimer Update Doc should get 200, got ${mimerSync.code} instead :: ${JSON.stringify(mimerSync, null, 2)}`)
      .toEqual(200);

    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'release-documents', 'pri');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'release-documents',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM033]] should build menu for the microservice based on mimer menu and check category for Application Developer Guide', async (done) => {
    portal.startTestLog('[[MM033]] Mimer, ARM & Document Get Test');

    const msName = 'Auto MS Mimer Arm 2';
    const msSlug = 'auto-ms-mimer-arm-2';

    await mockServer.clear({ path: '.*' });

    await portal.login();

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '19817', '19817-APR20139/7-6', 'Application Developers Guide', 'Application Developers Guide'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/mockFileDocElasticSync.docx', 'application/docx', 'mockFileDocElasticSync.docx'));

    const apiToken = await portal.readAccessTokenForMS(msSlug);

    await portalPublic.documentRefreshIDMultipleQueue(apiToken);
    await kernelQueue.isFree();

    const mimerSync = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(mimerSync.code)
      .withContext(`Mimer Update Doc should get 200, got ${mimerSync.code} instead :: ${JSON.stringify(mimerSync, null, 2)}`)
      .toEqual(200);

    await portal.login();
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'application-developers-guide');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM034]] should build menu for the microservice based on mimer menu and check category for API Spesification', async (done) => {
    portal.startTestLog('[[MM034]] Mimer, ARM & Document Get Test');

    const msName = 'Auto MS Mimer Arm 2';
    const msSlug = 'auto-ms-mimer-arm-2';

    await portal.login();

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 12));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15519', '15519-APR20139/7', 'API Specification', 'API Specification'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken);

    await kernelQueue.isFree();

    const mimerSync = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(mimerSync.code)
      .withContext(`Mimer Update Doc should get 200, got ${mimerSync.code} instead :: ${JSON.stringify(mimerSync, null, 2)}`)
      .toEqual(200);

    await portal.login();

    await kernelQueue.isFree();

    const assetresponse = await portal.getMS(msSlug);

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'api-specification');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'api-specification',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: \n\n ${JSON.stringify(assetresponse, null, 2)} \n\n :: \n\n ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });


  it('[[MM035]] should build menu based on mimer and check category for User Guide', async (done) => {
    portal.startTestLog('[[MM035]]');

    const msName = 'Auto MS Mimer Arm 2';
    const msSlug = 'auto-ms-mimer-arm-2';

    await portal.login();
    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 11));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '1553', '1553-APR20139/7', 'User Guide', 'User Guide'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken);
    await mimer1.mimerUpdateDoc(msSlug, true);
    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'user-guide');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'user-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    const docName = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.title
      ? documentresponse.body.data.title
      : null;

    expect(docName)
      .withContext(`The Document Name should be "User Guide", got ${docName} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('User Guide');

    const docCategory = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.category
      ? documentresponse.body.data.category
      : null;

    expect(docCategory)
      .withContext(`The Document Category Name should be "Developer Product Information", got ${docCategory} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('Developer Product Information');

    await kernelQueue.isFree();
    done();
  });


  it('[[MM036]] should build menu using mimer and ARM and check category for User Guide', async (done) => {
    portal.startTestLog('[[MM036]]');

    const msName = 'Auto MS Mimer Arm 2';
    const msSlug = 'auto-ms-mimer-arm-2';

    await portal.login();
    await mockServer.clear({ path: '.*' });
    await mockArtifactory.setARMFolder('tc830MimerARM', done);
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 11));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '1553', '1553-APR20139/7', 'User Guide', 'User Guide'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken);
    await mimer1.mimerUpdateDoc(msSlug, true);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'user-guide');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'user-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    const documentresponse2 = await portal.documentGet(msSlug, '8.3.0', 'inner-source', 'contributing-guideline');

    const documentResponseDebug2 = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'inner-source',
        doc_slug: 'contributing-guideline',
      },
      doc_response: documentresponse2,
    };

    expect(documentresponse2.code)
      .withContext(`The Document Response should be 200, got ${documentresponse2.code} instead! :: ${JSON.stringify(documentResponseDebug2, null, 2)}`)
      .toBe(200);

    const documentresponse3 = await portal.documentGet(msSlug, '8.3.0', 'inner-source', 'inner-source-readme');

    const documentResponseDebug3 = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'inner-source',
        doc_slug: 'inner-source-readme',
      },
      doc_response: documentresponse3,
    };

    expect(documentresponse3.code)
      .withContext(`The Document Response should be 200, got ${documentresponse3.code} instead! :: ${JSON.stringify(documentResponseDebug3, null, 2)}`)
      .toBe(200);

    await kernelQueue.isFree();
    done();
  });


  it('[[MM037]] should build menu using mimer and ARM after documentRefresh is run per version', async (done) => {
    const msName = 'Auto MS Mimer Arm ver';
    const msSlug = 'auto-ms-mimer-arm-ver';

    await portal.login();
    await mockServer.clear({ path: '.*' });

    await mockArtifactory.setARMFolder('tc830MimerARM', done);
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20139', msName, ['8.3.0']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20139', msName, '8.3.0', 12));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '15519', '15519-APR20139/7', 'API Specification', 'API Specification'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    await portalPublic.documentRefreshIDMultipleQueue(apiToken, '8.3.0');
    await mimer1.mimerUpdateDoc(msSlug, true);

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'api-specification');

    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'api-specification',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    const docName = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.title
      ? documentresponse.body.data.title
      : null;

    expect(docName)
      .withContext(`The Document Name should be "API Specification", got ${docName} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('API Specification');

    const docCategory = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.category
      ? documentresponse.body.data.category
      : null;

    expect(docCategory)
      .withContext(`The Document Category Name should be "Developer Product Information", got ${docCategory} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('Developer Product Information');

    await kernelQueue.isFree();
    done();
  });
});

describe('Checking documentation menus for Etesuse2 user where he/she can see assets', () => {
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
    request.post(login.optionsAdmin, async (error, response, body) => {
      token += login.callback(error, response, body);
      mimer = new MimerAPI(token);
      mimer1 = new MimerAPI();
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      await mimer.mimerAdminSetInitialTokenRefresh();
      await portal.login(login.optionsTestUserEtesuse2);
      done();
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });


  it('[[MM038]] should get if test user is able to access menu', async (done) => {
    portal.startTestLog('[[MM038]]');

    const msName = 'Auto MS Mimer Mock';
    const msSlug = 'auto-ms-mimer-mock';

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20133', msName, ['8.3.3']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20133', msName, '8.3.3', 9));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, false);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();
    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const versions = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.documentsForRendering
      ? msObjectResponse.body.data.documentsForRendering
      : null;

    expect(msObjectResponse.code)
      .withContext(`The code should be 200. Got ${msObjectResponse.code} instead! :: ${JSON.stringify(msObjectResponse, null, 2)}`)
      .toBe(200);

    expect(Object.keys(versions))
      .withContext(`Version should got 8.3.0 but got: ${JSON.stringify(versions, null, 2)}`)
      .toContain('8.3.0');

    expect(Object.keys(versions))
      .withContext(`Version should got 8.3.1 but got: ${JSON.stringify(versions, null, 2)}`)
      .toContain('8.3.1');

    expect(Object.keys(versions))
      .withContext(`Version should got 8.3.3 but got: ${JSON.stringify(versions, null, 2)}`)
      .toContain('8.3.3');

    expect(Object.keys(versions).length)
      .withContext(`Versions length should be 3 but got ${Object.keys(versions).length} instead: ${JSON.stringify(Object.keys(versions), null, 2)} :: ${JSON.stringify(versions, null, 2)}`)
      .toEqual(3);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM039]] should get 200 when trying to access MS with User in static group, user is service owner of the MS', async (done) => {
    portal.startTestLog('[[MM039]]');

    const msName = 'Auto MS Min Mimer Edition';
    const msSlug = 'auto-ms-min-mimer-edition';

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20132', msName, ['8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20132', msName, '8.3.1', 13));

    await mimer1.mimerUpdateDoc(msSlug, true)
      .then((BODY) => {
        expect(BODY.code).toEqual(200);
      })
      .catch(() => {
        done.fail();
      });

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS(msSlug);
    const versions = msObjectResponse.body.data.documentsForRendering;

    expect(msObjectResponse.code).toBe(200);
    expect(Object.keys(versions).length)
      .withContext(`Expected versions length equal zero, got ${Object.keys(versions).length} instead. ${JSON.stringify(versions, null, 2)}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });
});

describe('Checking documentation menus for etapase user without access', () => {
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
    await portal.clearCache('ALLASSETS');
    request.post(login.optionsAdmin, async (error, response, body) => {
      token += login.callback(error, response, body);
      mimer = new MimerAPI(token);
      mimer1 = new MimerAPI();
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      await mimer.mimerAdminSetInitialTokenRefresh();
      done();
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[MM040]] should get 403 when trying to access MS with documentation as user does not have access', async (done) => {
    portal.startTestLog('[[MM040]] User Permission Test');
    await portal.login(login.optionsTestUserEtapase);
    const msObjectResponse = await portal.getMS('auto-ms-mimer-mock');

    expect(msObjectResponse.code).toBe(403);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM041]] should get 403 when trying to access MS with documentation', async (done) => {
    portal.startTestLog('[[MM041]] User Permission Test');
    await portal.login(login.optionsTestUserEtapase);
    const msObjectResponse = await portal.getMS('auto-ms-max-mimer-edition');

    expect(msObjectResponse.code).toBe(403);

    await kernelQueue.isFree();
    done();
  });
});


describe('Testing mimer get version endpoint', () => {
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
    await portal.clearCache('ALLASSETS');
    await portal.login(login.optionsAdmin);
    request.post(login.optionsAdmin, async (error, response, body) => {
      token += login.callback(error, response, body);
      mimer = new MimerAPI(token);
      mimer1 = new MimerAPI();
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
      await mimer.mimerAdminSetInitialTokenRefresh();

      done();
    });
  });


  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[MM042]] should get 200 when trying to get list of versions for product number', async (done) => {
    portal.startTestLog('[[MM042]] List of Versions for a Product Number Test');

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
                {
                  productVersionLabel: '1.0.1',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.1'),
                },
                {
                  productVersionLabel: '1.0.2',
                  productVersionUrl: urljoin(this.muninMockServer, 'api/v1/products/APR20140/versions/1.0.2'),
                },
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20140',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.1',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.1',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20140/versions/1.0.2',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            data: {
              lifecycle: {
                lifecycleStage: 'Released',
              },
              designationAlias: [
                'eric-fh-alarm-handler',
              ],
              schemaVersion: '6.0.2',
              productIdentifier: {
                productVersionLabel: '1.0.2',
                productVersioningSchema: 'SemVer2.0.0',
                productNumber: 'APR20135',
              },
              description: 'TODO Replace this text.',
              designation: 'Auto MS Mimer',
              relations: {
                includes: [
                  {
                    eridocTargetIdentifier: {
                      documentNumber: '0360-APR20131/7-6',
                      language: 'Uen',
                      revision: 'A',
                    },
                    systemOfRecord: 'Eridoc',
                  },
                  {
                    muninTargetIdentifier: {
                      productVersionLabel: '7.5.0',
                      productNumber: 'CXU1010087',
                    },
                    systemOfRecord: 'Munin',
                  },
                ],
              },
              artifactCategory: 'Abstract',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });
    const msObjectResponse = await portal.mimerGetVersion('APR20140');

    expect(msObjectResponse.code).toBe(200);
    expect(msObjectResponse.body).toContain('1.0.2');
    expect(msObjectResponse.body).toContain('1.0.1');

    await kernelQueue.isFree();
    done();
  });

  it('[[MM043]] should get 200 when trying to get list of versions for product number where list is empty', async (done) => {
    portal.startTestLog('[[MM043]] List of Versions Empty Test');

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);

    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/muninserver/api/v1/products/APR20GGG',
        headers: {
          Accept: ['application/json'],
          'X-On-Behalf-Of': ['eadphub'],
          Authorization: ['.*'],
        },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({
          results: [{
            status: 200,
            data: {
              schemaVersion: '9.0.1',
              productVersions: [
              ],
              productVersioningSchema: 'SemVer2.0.0',
              designation: 'Auto MS Mimer',
              productNumber: 'APR20GGG',
              designResponsible: 'BDGSLBM',
            },
          }],
        }),
      },
      times: {
        unlimited: true,
      },
    });

    const msObjectResponse = await portal.mimerGetVersion('APR20GGG');

    expect(msObjectResponse.code).toBe(200);
    expect(msObjectResponse.body).toEqual([]);

    await kernelQueue.isFree();
    done();
  });

  it('[[MM044]] should get 404 when trying to get list of versions for not existing product number', async (done) => {
    portal.startTestLog('[[MM044]] List of Versions if Product Number do not exist Test');

    await mockServer.clear({ path: '.*' });
    await mockServer.mockAnyResponse(mockaAuth);

    const msObjectResponse = await portal.mimerGetVersion('APR2014FR3');

    expect(msObjectResponse.code).toBe(404);

    await kernelQueue.isFree();
    done();
  });
});


describe('Document Render from Eridoc tests', () => {
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

  it('[[MM045]] After sync, checks if document is able to be rendered', async (done) => {
    portal.startTestLog('[[MM045]] Mimer & Renderable Document Test');

    const msName = 'Auto MS Mimer Render Document';
    const msSlug = 'auto-ms-mimer-render-document';

    await mockServer.clear({ path: '.*' });

    await mockServer.mockAnyResponse(mockaAuth);
    await mockServer.mockAnyResponse(this.mimerTemplates.mockProductMimer('APR20135', msName, ['8.3.0', '8.3.1']));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.0', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockVersionProductMimer('APR20135', msName, '8.3.1', 4));
    await mockServer.mockAnyResponse(this.mimerTemplates.mockPrimDDDocumentInfo('1', '19817', '19817-APR20135/7-6', 'Application Developers Guide', 'Application Developers Guide'));
    await mockServer.mockAnyResponse(await this.mimerTemplates.mockEriDoc('/testFiles/testHtml.zip', 'application/zip', 'testHtml.zip'));

    const bodyAfterUpdate = await mimer1.mimerUpdateDoc(msSlug, true);

    expect(bodyAfterUpdate.code)
      .withContext(`The code after update should be 200. Got ${bodyAfterUpdate.code} instead! :: ${JSON.stringify(bodyAfterUpdate, null, 2)}`)
      .toBe(200);

    await portal.login();

    await kernelQueue.isFree();

    const documentresponse = await portal.documentGet(msSlug, '8.3.0', 'dpi', 'application-developers-guide');
    const documentResponseDebug = {
      doc_request: {
        ms_slug: msSlug,
        doc_version: '8.3.0',
        doc_category: 'dpi',
        doc_slug: 'application-developers-guide',
      },
      doc_response: documentresponse,
    };

    expect(documentresponse.code)
      .withContext(`The Document Response should be 200, got ${documentresponse.code} instead! :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe(200);

    const title = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.title
      ? documentresponse.body.data.title
      : null;

    expect(title)
      .withContext(`The Document Name should be 'Application Developers Guide' :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('Application Developers Guide');

    const html = documentresponse
      && documentresponse.body
      && documentresponse.body.data
      && documentresponse.body.data.body
      ? (`${documentresponse.body.data.body}`).substring(15, 72)
      : null;

    expect(html)
      .withContext(`The HTML should contain a specific string :: ${JSON.stringify(documentResponseDebug, null, 2)}`)
      .toBe('Just testing the render of ADP Portal from pure HTML file');

    await kernelQueue.isFree();
    done();
  });
  // =========================================================================================== //
});


module.exports = {
  MimerAPI,
};
