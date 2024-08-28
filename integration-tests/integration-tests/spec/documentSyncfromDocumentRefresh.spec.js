
const urljoin = require('url-join');

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

let originalValue;

describe('Testing documentation sync after documentrefresh call', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[DOCSYNCARM001]] Testing a successful case of documentrefresh endpoint sync for html document', async (done) => {
    portal.startTestLog('[[DOCSYNCARM001]]');

    await mockArtifactory.setFolder('tc01');
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-doc-1');
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    const response1 = await portal.documentElasticSearchOneResult('Artifact', 'ms_documentation', 1, 20, 'auto-ms-with-mock-artifactory-doc-1', 'sample-2', '1.0.1');
    const debug1 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Artifact',
      },
      response1,
    });

    expect(response1.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug1}`)
      .toBe(1);


    expect(response1.code)
      .withContext(`The server code should be 200: ${debug1}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[DOCSYNCARM002]] Testing a successful case of /documentrefresh endpoint sync for html document in zip', async (done) => {
    portal.startTestLog('[[DOCSYNCARM002]]');

    await mockArtifactory.setFolder('tc01');
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-doc-1');
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    const response1 = await portal.documentElasticSearchOneResult('Cassandra Service', 'ms_documentation', 1, 20, 'auto-ms-with-mock-artifactory-doc-1', 'sample-1', '1.0.1');
    const debug1 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'Cassandra Service',
      },
      response1,
    });

    expect(response1.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug1}`)
      .toBe(1);

    expect(response1.code)
      .withContext(`The server code should be 200: ${debug1}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });

  it('[[DOCSYNCARM003]] Testing a successful case of /documentrefresh endpoint sync for external document', async (done) => {
    portal.startTestLog('[[DOCSYNCARM003]]');

    await mockArtifactory.setFolder('tc01');
    const apiToken = await portal.readAccessTokenForMS('auto-ms-with-mock-artifactory-doc-1');
    await portalPublic.documentRefreshIDQueue(apiToken);

    await kernelQueue.isFree();

    const response1 = await portal.documentElasticSearchOneResult('external', 'ms_documentation', 1, 20, 'auto-ms-with-mock-artifactory-doc-1', 'an-external', '1.0.1');
    const debug1 = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'contentSearch'),
        keyword: 'external',
      },
      response1,
    });

    expect(response1.body.data.length)
      .withContext(`[ response.body.data.length ] should contain 1 documents: ${debug1}`)
      .toBe(1);

    expect(response1.code)
      .withContext(`The server code should be 200: ${debug1}`)
      .toEqual(200);

    await kernelQueue.isFree();
    done();
  });
});
