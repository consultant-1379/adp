const request = require('request');
const urljoin = require('url-join');
const config = require('../test.config.js');
const login = require('../endpoints/login.js');

const {
  MockArtifactory,
  PortalPublicAPI,
  PortalPrivateAPI,
} = require('./apiClients');
const apiQueueClass = require('./apiQueue');

const portal = new PortalPrivateAPI();
const portalPublic = new PortalPublicAPI();
const mockArtifactory = new MockArtifactory();
const kernelQueue = new apiQueueClass.ApiQueue();

let token = null;
let microserviceAccessToken = null;

const menuHasDocument = (actualMenu, documentInfo) => {
  const result = actualMenu.filter((entry) => {
    const subResult = (entry.name === documentInfo.name)
      && (entry.external_link === documentInfo.external_link)
      && (entry.slug === documentInfo.slug)
      && (entry.filepath === documentInfo.filepath);
    return subResult;
  }).length > 0;
  return result;
};

const menuHasVersion = (actualMenu, version) => {
  const result = actualMenu.filter((actItem) => {
    const versionsMatch = (actItem.version === version.version);
    if (versionsMatch) {
      let matches = true;
      version.documents.forEach((expected) => {
        if (!menuHasDocument(actItem.documents, expected)) {
          matches = false;
        }
      });
      return matches;
    }
    return false;
  }).length > 0;
  return result;
};

let originalValue;

describe('Testing YAML Retrieve Logic using Mock Artifactory', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  beforeAll((done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    request.post(login.optionsAdmin, (error, response, body) => {
      const tempToken = login.callback(error, response, body);
      originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
      token = `Bearer ${tempToken.trim()}`;
      done();
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[YAMLLOGIC001]] Testing a successful case of /documentrefresh endpoint', async (done) => {
    portal.startTestLog('[[YAMLLOGIC001]]');

    await mockArtifactory.setARMFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const status = response
      && response.status >= 0
      ? response.status
      : null;

    expect(status)
      .withContext(`Status Server Code should be 200, got ${status} instead: ${debug}`)
      .toEqual(200);

    const name = response
      && response.microserviceName
      ? response.microserviceName
      : null;

    expect(name)
      .withContext(`Name should equal 'Auto MS with Mock Artifactory': ${debug}`)
      .toEqual('Auto MS with Mock Artifactory');

    const warningsDevLength = response
      && response.yamlWarnings
      && Array.isArray(response.yamlWarnings.development)
      ? response.yamlWarnings.development.length
      : null;

    expect(warningsDevLength)
      .withContext(`Length of warnings array should equal 0: ${debug}`)
      .toEqual(0);

    const errorsDevLength = response
      && response.yamlErrors
      && Array.isArray(response.yamlErrors.development)
      ? response.yamlErrors.development.length
      : null;

    expect(errorsDevLength)
      .withContext(`Length of errors array should equal 0: ${debug}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC002]] Testing a successful case of /documentrefresh endpoint for assembly', async (done) => {
    portal.startTestLog('[[YAMLLOGIC002]]');

    await mockArtifactory.setARMFolder('tc02', done);
    const apiToken = await portal.readAccessTokenForAssembly('assembly-auto-doc');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const status = response
      && response.status >= 0
      ? response.status
      : null;

    expect(status)
      .withContext(`Status Server Code should be 200, got ${status} instead: ${debug}`)
      .toEqual(200);

    const name = response
      && response.microserviceName
      ? response.microserviceName
      : null;

    expect(name)
      .withContext(`Name should equal 'Assembly Auto Doc': ${debug}`)
      .toEqual('Assembly Auto Doc');

    const warningsDevLength = response
      && response.yamlWarnings
      && Array.isArray(response.yamlWarnings.development)
      ? response.yamlWarnings.development.length
      : null;

    expect(warningsDevLength)
      .withContext(`Length of warnings array should equal 0: ${debug}`)
      .toEqual(0);

    const errorsDevLength = response
      && response.yamlErrors
      && Array.isArray(response.yamlErrors.development)
      ? response.yamlErrors.development.length
      : null;

    expect(errorsDevLength)
      .withContext(`Length of errors array should equal 0: ${debug}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC003]] Retrieve the Microservice to check the auto generated menu', (done) => {
    portal.startTestLog('[[YAMLLOGIC003]]');

    const setupObject = {
      url: `${config.baseUrl}microservice/auto-ms-with-mock-artifactory`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    };

    request.get(setupObject,
      async (error, response) => {
        expect(response.statusCode).toBe(200);
        const { data } = response.body;
        if (data.menu === undefined) {
          done.fail();
          return;
        }
        if (data.menu.auto === undefined) {
          done.fail();
          return;
        }
        const { auto } = data.menu;
        const expectedDevelopmentMenu = [
          {
            name: 'Sample 1', filepath: '1.0.1/CAS_Deployment_Guide.zip', default: true, slug: 'sample-1',
          },
          {
            name: 'Sample 2', filepath: '1.0.1/test.html', slug: 'sample-2',
          },
          {
            name: 'An External', external_link: 'https://www.ericsson.se', slug: 'an-external',
          },
          {
            name: 'Sample 3', filepath: '1.0.2/CAS_Deployment_Guide.zip', slug: 'sample-3',
          },
          {
            name: 'Sample 4', filepath: '1.0.2/test.html', slug: 'sample-4',
          },
          {
            name: 'Sample 5', filepath: '1.0.2/other.html', slug: 'sample-5',
          },
          {
            name: 'An External 2', external_link: 'https://www.ericsson.se', slug: 'an-external-2',
          },
        ];

        const v1 = {
          version: '1.0.1',
          documents:
            [
              {
                name: 'Sample 1', filepath: '1.0.1/CAS_Deployment_Guide.zip', default: true, slug: 'sample-1',
              },
              {
                name: 'Sample 2', filepath: '1.0.1/test.html', slug: 'sample-2',
              },
              {
                name: 'An External', external_link: 'https://www.ericsson.se', slug: 'an-external',
              },
            ],
        };

        const v2 = {
          version: '1.0.2',
          documents:
            [
              {
                name: 'Sample 3', filepath: '1.0.2/CAS_Deployment_Guide.zip', default: true, slug: 'sample-3',
              },
              {
                name: 'Sample 4', filepath: '1.0.2/test.html', slug: 'sample-4',
              },
              {
                name: 'Sample 5', filepath: '1.0.2/other.html', slug: 'sample-5',
              },
              {
                name: 'An External 2', external_link: 'https://www.ericsson.se', slug: 'an-external-2',
              },
            ],
        };

        const expectedReleaseMenu = [v1, v2];

        const debug = portal.answer({
          param: {
            setupObject,
          },
          response,
        });

        const menuDev = response
          && response.body
          && response.body.data
          && response.body.data.menu
          && response.body.data.menu.auto
          && response.body.data.menu.auto.development
          ? JSON.stringify(response.body.data.menu.auto.development, null, 2)
          : debug;

        const menuRelease = response
          && response.body
          && response.body.data
          && response.body.data.menu
          && response.body.data.menu.auto
          && response.body.data.menu.auto.release
          ? JSON.stringify(response.body.data.menu.auto.release, null, 2)
          : debug;

        // expect(auto.development.length)
        //   .withContext(`The 'auto.development' should not be zero: ${JSON.stringify(debug, null, 2)}`)
        //   .toBeTruthy();

        // expectedDevelopmentMenu.forEach((expectedItem) => {
        //   expect(menuHasDocument(auto.development, expectedItem))
        //     .withContext(`The 'auto.development' should contains an expected item: ${JSON.stringify(expectedItem, null, 2)} :: ${menuDev}`)
        //     .toBeTruthy();
        // });
        expectedReleaseMenu.forEach((expectedItem) => {
          expect(menuHasVersion(auto.release, expectedItem))
            .withContext(`The 'auto.release' should contains an expected item: ${JSON.stringify(expectedItem, null, 2)} :: ${menuRelease}`)
            .toBeTruthy();
        });

        await kernelQueue.isFree();
        done();
      });
  });


  it('[[YAMLLOGIC004]] Testing a 404 case of /documentrefresh endpoint', async (done) => {
    portal.startTestLog('[[YAMLLOGIC004]]');

    await mockArtifactory.setARMFolder('error404', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
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
      .withContext(`The server code should be 404, got ${statusCode} instead: ${debug}`)
      .toBe(404);

    const errorsDev = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more then 0: ${debug}`)
      .toBeGreaterThan(0);

    await kernelQueue.isFree();
    done();
  });


  it('[[YAMLLOGIC005]] Testing a 500 case of /documentrefresh endpoint for in Development', async (done) => {
    portal.startTestLog('[[YAMLLOGIC005]]');

    await mockArtifactory.setARMFolder('error500', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-1');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 500, got ${statusCode} instead: ${debug0}`)
      .toBe(500);

    const errorsDev = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toBeGreaterThan(0);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC006]] Testing a 500 case of /documentrefresh endpoint for Release', async (done) => {
    portal.startTestLog('[[YAMLLOGIC006]]');

    await mockArtifactory.setARMFolder('error500', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-2');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 500, got ${statusCode} instead: ${debug0}`)
      .toBe(500);

    const errorsRel = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsRel)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toBeGreaterThan(0);

    await kernelQueue.isFree();
    done();
  });


  it('[[YAMLLOGIC007]] Testing a fake 200 case of /documentrefresh endpoint for in Development', async (done) => {
    portal.startTestLog('[[YAMLLOGIC007]]');

    await mockArtifactory.setARMFolder('error200', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-1');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 500, got ${statusCode} instead: ${debug0}`)
      .toBe(500);

    await kernelQueue.isFree();
    done();
  });


  it('[[YAMLLOGIC008]] Testing a fake 200 case of /documentrefresh endpoint for Release', async (done) => {
    portal.startTestLog('[[YAMLLOGIC008]]');

    await mockArtifactory.setARMFolder('error200', done);
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-2');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 500, got ${statusCode} instead: ${debug0}`)
      .toBe(500);

    await kernelQueue.isFree();
    done();
  });


  it('[[YAMLLOGIC009]] Yaml documentRefresh full validation warnings only test.', async (done) => {
    portal.startTestLog('[[YAMLLOGIC009]]');

    const msSlug = 'document-refresh-warnings-test';

    await mockArtifactory.setARMFolder('tcValidationWarnings', done);
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const statusCode = response
      && response.status > 0
      ? response.status
      : null;

    expect(statusCode)
      .withContext(`The server code should be 200, got ${statusCode} instead: ${debug}`)
      .toBe(200);

    const warningsDev = response
      && response.yamlWarningsQuant
      ? response.yamlWarningsQuant
      : 0;

    expect(warningsDev)
      .withContext(`The result.yamlWarningsQuant should more than 0: ${debug}`)
      .toEqual(3);

    request.get({
      url: `${config.baseUrl}microservice/${msSlug}`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    async (error, msDataResponse) => {
      const dataIsSet = (msDataResponse.body && msDataResponse.body.data);
      const menuAutoIsSet = (dataIsSet && msDataResponse.body.data.menu);
      const releaseIsSet = (menuAutoIsSet && msDataResponse.body.data.menu.auto.release);

      if (releaseIsSet) {
        const msReleaseDocData = msDataResponse.body.data.menu.auto.release;
        const firstVer = msReleaseDocData[0];
        const lastVer = msReleaseDocData[2];

        if (firstVer && lastVer) {
          // Correct default, custom slug should not be set and remove custom field
          const lastVerLastDoc = lastVer.documents[1];
          const valueLastVersionLastDoc = lastVerLastDoc
            && lastVerLastDoc.default
            ? lastVerLastDoc.default
            : null;

          expect(valueLastVersionLastDoc)
            .withContext(`Expecting last version of the last document default as truthy, got '${valueLastVersionLastDoc}' instead: ${debug}`)
            .toBeTruthy();

          expect(lastVerLastDoc.slug)
            .withContext(`Expecting last version of the last document slug not to be 'slug', got '${lastVerLastDoc.slug}' instead: ${debug}`)
            .not.toBe('slug');

          const testField = lastVerLastDoc
            && lastVerLastDoc['test-field']
            ? lastVerLastDoc['test-field']
            : undefined;

          expect(testField)
            .withContext(`Expecting last version of the last document test field to be defined, got '${testField}' instead: ${debug}`)
            .not.toBeDefined();

          // version order
          expect(firstVer.version)
            .withContext(`Expecting first version to be '889.677.99', got '${firstVer.version}' instead: ${debug}`)
            .toBe('889.677.99');

          expect(lastVer.version)
            .withContext(`Expecting last version to be '888.67.99', got '${lastVer.version}' instead: ${debug}`)
            .toBe('888.67.99');

          await kernelQueue.isFree();
          done();
        }
      }
    });
  });

  // testing elastic DB sync after a document is requested
  it('[[YAMLLOGIC010]] Testing a successful case of elastic DB sync when a document is fetched', async (done) => {
    portal.startTestLog('[[YAMLLOGIC010]]');

    await portal.clearCache('ALLASSETS');
    await portal.login();

    await mockArtifactory.setARMFolder('tc01', done);

    await portal.clearCache('ALLASSETS');
    await portal.login();

    const apiToken = await portal.readAccessTokenForMS('test-ms-for-elastic');

    await portal.clearCache('ALLASSETS');
    await portal.login();

    const response = await portalPublic.documentRefreshIDQueue(apiToken);
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

    await portal.clearCache('ALLASSETS');
    await portal.login();

    await mockArtifactory.setARMFolder('tcElasticDbSync', done);

    await portal.clearCache('ALLASSETS');
    await portal.login();

    const documentresponse = await portal.elasticDBSyncAfterDocumentFetch('test-ms-for-elastic', '1.0.1', 'additional-documents', 'sample-2');

    expect(documentresponse.queueStatus)
      .withContext(`A Queue Status Link should be returned: got ${documentresponse.queueStatus}`)
      .toBeDefined();

    await kernelQueue.isFree();
    await new Promise(resolve => setTimeout(resolve, 8000));

    const searchResponse = await portal.documentElasticSearchOneResult('fruit', '', 1, 20, 'test-ms-for-elastic', 'sample-2', '1.0.1');
    const debug1 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'fruit',
      },
      searchResponse,
    });
    const result = searchResponse.body.data.every(obj => obj.version === '1.0.1'
      && obj.asset_slug === 'test-ms-for-elastic' && obj.title_slug === 'sample-2');

    expect(searchResponse.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug1}`)
      .toBe(1);

    expect(result)
      .withContext(`Should find only version 1.0.1 with asset slug test-ms-for-elastic and sample-2' ${debug1}`)
      .toBeTruthy();

    expect(searchResponse.code)
      .withContext(`The server code should be 200: ${debug1}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC011]] Testing a successful case of /documentrefresh endpoint with CPI flag on', async (done) => {
    portal.startTestLog('[[YAMLLOGIC011]]');

    await mockArtifactory.setARMFolder('tcCPIflagPositive', done);
    const apiToken = await portal.readAccessTokenForMS('document-refresh-microservice-cpi-true');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const errorsDev = response
      && response.yamlErrorsQuant >= 0
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');

    const msObjectResponse = await portal.getMS('document-refresh-microservice-cpi-true');
    const msReleaseDocData = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.menu
      && msObjectResponse.body.data.menu.auto
      && Array.isArray(msObjectResponse.body.data.menu.auto.release)
      ? msObjectResponse.body.data.menu.auto.release
      : null;

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      msObjectResponse,
    });

    if (msReleaseDocData && Array.isArray(msReleaseDocData) && msReleaseDocData.length > 0) {
      const firstVer = msReleaseDocData[0];

      expect(firstVer.version)
        .withContext(`Version of the documents should be 1.0.1 ${debug}`)
        .toBe('1.0.1');

      expect(firstVer.is_cpi_updated)
        .withContext(`CPI flag for the version should be set to true ${debug}`)
        .toBe(true);

      await kernelQueue.isFree();
      done();
    } else {
      expect(msReleaseDocData)
        .withContext(`Expect a microservice object with an auto release menu, got null instead. ${debug}`)
        .not.toBeNull();

      done.fail();
    }
  });

  it('[[YAMLLOGIC012]] Testing a successful case of /documentrefresh endpoint with CPI flag on for assembly', async (done) => {
    portal.startTestLog('[[YAMLLOGIC012]]');

    await mockArtifactory.setARMFolder('tcCPIflagPositive', done);
    const apiToken = await portal.readAccessTokenForAssembly('assembly-auto-doc');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const errorsDev = response
      && response.yamlErrorsQuant >= 0
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');

    const msObjectResponse = await portal.getAssembly('assembly-auto-doc');
    const msReleaseDocData = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.menu
      && msObjectResponse.body.data.menu.auto
      && Array.isArray(msObjectResponse.body.data.menu.auto.release)
      ? msObjectResponse.body.data.menu.auto.release
      : null;

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      msObjectResponse,
    });

    if (msReleaseDocData && Array.isArray(msReleaseDocData) && msReleaseDocData.length > 0) {
      const firstVer = msReleaseDocData[0];

      expect(firstVer.version)
        .withContext(`Version of the documents should be 1.0.1 ${debug}`)
        .toBe('1.0.1');

      expect(firstVer.is_cpi_updated)
        .withContext(`CPI flag for the version should be set to true ${debug}`)
        .toBe(true);

      await kernelQueue.isFree();
      done();
    } else {
      expect(msReleaseDocData)
        .withContext(`Expect a microservice object with an auto release menu, got null instead. ${debug}`)
        .not.toBeNull();

      done.fail();
    }
  });

  it('[[YAMLLOGIC013]] Testing a successful case of /documentrefresh endpoint with CPI flag On on MS level and no CPI/undefined on version level', async (done) => {
    portal.startTestLog('[[YAMLLOGIC013]]');

    await mockArtifactory.setARMFolder('tc01', done);
    const apiToken = await portal.readAccessTokenForMS('document-refresh-microservice-cpi-true');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const errorsDev = response
      && response.yamlErrorsQuant >= 0
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');

    const msObjectResponse = await portal.getMS('document-refresh-microservice-cpi-true');
    const msReleaseDocData = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.menu
      && msObjectResponse.body.data.menu.auto
      && Array.isArray(msObjectResponse.body.data.menu.auto.release)
      ? msObjectResponse.body.data.menu.auto.release
      : null;

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      msObjectResponse,
    });

    if (msReleaseDocData && Array.isArray(msReleaseDocData) && msReleaseDocData.length > 0) {
      const firstVer = msReleaseDocData[0];

      expect(firstVer.version)
        .withContext(`Version of the documents should be 1.0.1 ${debug}`)
        .toBe('1.0.1');

      expect(firstVer.is_cpi_updated)
        .withContext(`CPI flag for the version should be set to false ${debug}`)
        .toBe(false);

      await kernelQueue.isFree();
      done();
    } else {
      expect(msReleaseDocData)
        .withContext(`Expect a microservice object with an auto release menu, got null instead. ${debug}`)
        .not.toBeNull();

      done.fail();
    }
  });

  it('[[YAMLLOGIC014]] Testing a successful case of /documentrefresh endpoint with no CPI version/undefined and CPI microservice level off', async (done) => {
    portal.startTestLog('[[YAMLLOGIC014]]');

    await mockArtifactory.setARMFolder('tc01', done);
    const apiToken = await portal.readAccessTokenForMS('document-refresh-microservice-cpi-false');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const warningsDev = response
      && response.yamlWarningsQuant
      ? response.yamlWarningsQuant
      : 0;

    expect(warningsDev)
      .withContext(`The result.yamlWarningsQuant should equal 0: ${debug0}`)
      .toEqual(0);

    const msObjectResponse = await portal.getMS('document-refresh-microservice-cpi-false');
    const msReleaseDocData = msObjectResponse.body.data.menu.auto.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 1.0.1')
      .toBe('1.0.1');

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to true')
      .toBe(false);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC015]] Testing a successful case of /documentrefresh endpoint with CPI documentation level On and CPI microservice level off', async (done) => {
    portal.startTestLog('[[YAMLLOGIC015]]');

    await mockArtifactory.setARMFolder('tcCPIflagPositive', done);
    const apiToken = await portal.readAccessTokenForMS('document-refresh-microservice-cpi-false');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const warningsDev = response
      && response.yamlWarningsQuant
      ? response.yamlWarningsQuant
      : 0;

    expect(warningsDev)
      .withContext(`The result.yamlWarningsQuant should equal 0: ${debug0}`)
      .toEqual(1);

    const msObjectResponse = await portal.getMS('document-refresh-microservice-cpi-false');
    const msReleaseDocData = msObjectResponse.body.data.menu.auto.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 1.0.1')
      .toBe('1.0.1');

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to true')
      .toBe(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC016]] Yaml documentRefresh CPI flag is string should return 400', async (done) => {
    portal.startTestLog('[[YAMLLOGIC016]]');

    await mockArtifactory.setARMFolder('tcCPIflagError', done);

    const apiToken = await portal.readAccessTokenForMS('document-refresh-microservice-cpi-false-400');

    await kernelQueue.isFree();

    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 400, got ${statusCode} instead: ${debug0}`)
      .toBe(400);

    const errorsDev = response
      ? response.yamlErrorsQuant
      : null;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should equal 1: ${debug0}`)
      .toEqual(1);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC017]] Yaml documentRefresh full validation errors only test.', async (done) => {
    portal.startTestLog('[[YAMLLOGIC017]]');

    await mockArtifactory.setARMFolder('tcValidationErrors', done);
    await portal.login();

    const msSlug = 'document-refresh-errors-test';
    const apiToken = await portal.readAccessTokenForMS(msSlug);
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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
      .withContext(`The server code should be 400, got ${statusCode} instead: ${debug0}`)
      .toBe(400);

    const errorsDev = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should be more than 6: ${debug0}`)
      .toBeGreaterThan(6);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC018]] Testing a successful case of /documentrefresh when old versions are not updated', async (done) => {
    portal.startTestLog('[[YAMLLOGIC018]]');

    await mockArtifactory.setARMFolder('tc01', done);

    const apiToken = await portal.readAccessTokenForMS('document-refresh-old-versions-not-updated');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const errorsDev = response
      && response.yamlErrorsQuant >= 0
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');

    const msObjectResponse = await portal.getMS('document-refresh-old-versions-not-updated');
    const msReleaseDocData = msObjectResponse.body.data.menu.auto.release;
    const firstVer = msReleaseDocData.filter(documents => documents.version === '1.0.1');

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      firstVer,
    });

    expect(firstVer[0].is_cpi_updated)
      .withContext(`CPI flag for the version should be set to false, got '${firstVer[0].is_cpi_updated}' instead. ${debug}`)
      .toBe(false);

    await kernelQueue.isFree();
    done();
  });


  it('[[YAMLLOGIC019]] Testing a successful case of /documentrefresh when new release version is sucessfully created', async (done) => {
    portal.startTestLog('[[YAMLLOGIC019]]');

    await mockArtifactory.setARMFolder('tc01', done);

    const apiToken = await portal.readAccessTokenForMS('document-refresh-old-versions-not-updated');
    await portalPublic.documentRefreshIDQueue(apiToken);
    await kernelQueue.isFree();

    await mockArtifactory.setARMFolder('tcOldVersionsIgnore', done);

    const response = await portalPublic.documentRefreshIDQueue(apiToken);

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

    const errorsDev = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();
    await portal.clearCache('ALLASSETS');

    const msObjectResponse = await portal.getMS('document-refresh-old-versions-not-updated');
    const msReleaseDocData = msObjectResponse.body.data.menu.auto.release;
    const firstVer = msReleaseDocData.filter(documents => documents.version === '1.0.2');
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      firstVer,
    });

    expect(firstVer[0].is_cpi_updated)
      .withContext(`CPI flag for the version should be set to true ${debug}`)
      .toBe(true);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC020]] Testing a successful case of /documentrefresh when new in Development versions sucessfully updated', async (done) => {
    portal.startTestLog('[[YAMLLOGIC020]]');

    await mockArtifactory.setARMFolder('tc01', done);

    const apiToken = await portal.readAccessTokenForMS('document-refresh-old-versions-not-updated');
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    await mockArtifactory.setARMFolder('tcOldVersionsIgnore', done);

    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

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

    const errorsDev = response
      && response.yamlErrorsQuant
      ? response.yamlErrorsQuant
      : 0;

    expect(errorsDev)
      .withContext(`The result.yamlErrorsQuant should more than 0: ${debug0}`)
      .toEqual(0);

    await kernelQueue.isFree();

    const msObjectResponse = await portal.getMS('document-refresh-old-versions-not-updated');
    const msDevelopmentDocData = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.menu
      && msObjectResponse.body.data.menu.auto
      && msObjectResponse.body.data.menu.auto.development
      ? msObjectResponse.body.data.menu.auto.development
      : [];

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/ID'),
      },
      msDevelopmentDocData,
    });

    const oldDocumentDeleted = msDevelopmentDocData.filter(documents => documents.slug === 'sample-not-existing');

    expect(oldDocumentDeleted.length)
      .withContext(`Array (oldDocumentDeleted) length should be 0 ${debug}`)
      .toEqual(0);

    const existingDocument = msDevelopmentDocData.filter(documents => documents.slug === 'sample-1');

    expect(existingDocument.length)
      .withContext(`Array (existingDocument) length should be 0 ${debug}`)
      .toEqual(0);

    const newDocument = msDevelopmentDocData.filter(documents => documents.slug === 'sample-5');

    expect(newDocument.length)
      .withContext(`Array (newDocument) length should be 0 ${debug}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });

  it('[[YAMLLOGIC021]] [Real Artifactory] Trigger the /integration/v1/microservice/documentrefresh endpoint', async (done) => {
    portal.startTestLog('[[YAMLLOGIC021]]');

    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-real-artifactory');
    const response = await portalPublic.documentRefreshIDQueue(apiToken);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice/documentrefresh'),
      },
      response,
    });

    const status = response ? response.status : null;

    // expect(status)
    //   .withContext(`Status should be 200: ${debug}`)
    //   .toEqual(200);

    const name = response ? response.microserviceName : null;

    // expect(name)
    //   .withContext(`Name should equal 'Auto MS with Mock Artifactory': ${debug}`)
    //   .toEqual('Auto MS with Real Artifactory');

    const errorsDevLen = response
      && response.yamlErrors
      && Array.isArray(response.yamlErrors.development)
      ? response.yamlErrors.development.length
      : null;

    // expect(errorsDevLen)
    //   .withContext(`Length of developer errors array should equal 0: ${debug}`)
    //   .toEqual(0);

    const errorsReleaseLen = response
      && response.yamlErrors
      && Array.isArray(response.yamlErrors.release)
      ? response.yamlErrors.release.length
      : null;

    // expect(errorsReleaseLen)
    //   .withContext(`Length of releases errors array should equal 0: ${debug}`)
    //   .toEqual(0);

    await kernelQueue.isFree();
    done();
  });
});


describe('Testing a successful case in YAML Retrieve Logic using Real Artifactory', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      const tempToken = login.callback(error, response, body);
      token = `Bearer ${tempToken.trim()}`;
      done();
    });
  });


  it('[[YAMLLOGIC022]] [Real Artifactory] Uses /getByOwner endpoint to get the Token of a specific Microservice', (done) => {
    portal.startTestLog('[[YAMLLOGIC022]]');

    request.post({
      url: `${config.baseUrl}microservices-by-owner`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    async (error, response) => {
      expect(response.statusCode).toBe(200);

      response.body.data.forEach((microservice) => {
        if (microservice.slug === 'auto-ms-with-real-artifactory') {
          microserviceAccessToken = `Bearer ${microservice.access_token}`;
        }
      });

      expect(microserviceAccessToken.length).toBeGreaterThan(0);
      await kernelQueue.isFree();
      done();
    });
  });
});
