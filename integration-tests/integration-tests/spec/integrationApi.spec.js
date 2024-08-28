const urljoin = require('url-join');
const {
  MockArtifactory,
  PortalPrivateAPI,
  PortalPublicAPI,
} = require('./apiClients.js');
const apiQueueClass = require('./apiQueue');

const portal = new PortalPrivateAPI();
const portalPublic = new PortalPublicAPI();
const artifactory = new MockArtifactory();
const kernelQueue = new apiQueueClass.ApiQueue();

let originalValue;

describe('Integration api tests', () => {
  beforeAll(async () => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    await portal.login();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[INTAPI001]] should trigger cache invalidation resulting in document refresh', async (done) => {
    portal.startTestLog('[[INTAPI001]]');

    artifactory.setFolder('tc01');
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory');
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

    const slug = result
      && result.microserviceSlug
      ? result.microserviceSlug
      : null;

    expect(slug)
      .withContext(`Slug should equal 'auto-ms-with-mock-artifactory': ${debug}`)
      .toEqual('auto-ms-with-mock-artifactory');

    const name = result
      && result.microserviceName
      ? result.microserviceName
      : null;

    expect(name)
      .withContext(`Name should equal uto MS with Mock Artifactory: ${debug}`)
      .toEqual('Auto MS with Mock Artifactory');

    const errorsDev = result
      && result.yamlErrors
      && result.yamlErrors.development
      && Array.isArray(result.yamlErrors.development)
      ? result.yamlErrors.development.length
      : null;

    expect(errorsDev)
      .withContext(`Length of errors on development array should equal 0: ${debug}`)
      .toEqual(0);

    const errorsRel = result
      && result.yamlErrors
      && Array.isArray(result.yamlErrors.release)
      ? result.yamlErrors.release.length
      : null;

    expect(errorsRel)
      .withContext(`Length of errors on release array should equal 0: ${debug}`)
      .toEqual(0);

    await kernelQueue.isFree();
    done();
  });

  it('[[INTAPI002]] should return 401 in documentrefresh endpoint with invalid token', async (done) => {
    portal.startTestLog('[[INTAPI002]]');

    const { code } = await portalPublic.documentRefresh('badtoken');

    expect(code).toEqual(401);

    await kernelQueue.isFree();
    done();
  });
});
