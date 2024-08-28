const { PortalPrivateAPI, MockArtifactory } = require('./apiClients');
const apiQueueClass = require('./apiQueue');
const portal = new PortalPrivateAPI();
const kernelQueue = new apiQueueClass.ApiQueue();
const mockArtifactory = new MockArtifactory();

describe('Basic tests for the document retrival endpoint', () => {
  it('[[MSDOC001]] should get document for microservice for the dpi category', async (done) => {
    portal.startTestLog('[[MSDOC001]]');
    const msSlug = 'auto-ms-max';

    await mockArtifactory.setup();
    await mockArtifactory.setARMFolder('tc01', done);
    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentGet(msSlug, 'development', 'dpi', 'service-deployment-guide');

    const debug = portal.answer({
      slug: msSlug,
      version: 'development',
      category: 'dpi',
      documentSlug: 'service-deployment-guide',
      responseFromServer: response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    expect(response.body.data.category)
      .withContext(`[ response.body.data.category ] should be [ Developer Product Information ]: ${debug}`)
      .toBe('Developer Product Information');

    await kernelQueue.isFree();
    done();
  });

  it('[[MSDOC002]] should get document for release version with right category', async (done) => {
    portal.startTestLog('[[MSDOC002]]');
    const msSlug = 'auto-ms-test-3';

    await mockArtifactory.setup();
    await mockArtifactory.setARMFolder('tc01', done);
    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentGet(msSlug, '1.0.1', 'dpi', 'service-overview');

    const debug = portal.answer({
      slug: msSlug,
      version: '1.0.1',
      category: 'dpi',
      documentSlug: 'service-overview',
      responseFromServer: response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    expect(response.body.data.category)
      .withContext(`[ response.body.data.category ] should be [ Developer Product Information ]: ${debug}`)
      .toBe('Developer Product Information');

    await kernelQueue.isFree();
    done();
  });

  it('[[MSDOC003]] should get document for development type with name in additional documents category', async (done) => {
    portal.startTestLog('[[MSDOC003]]');
    const msSlug = 'auto-ms-test-3';

    await mockArtifactory.setup();
    await mockArtifactory.setARMFolder('tc01', done);
    await portal.login();
    await kernelQueue.isFree();

    const response = await portal.documentGet(msSlug, 'development', 'additional-documents', 'sample-2');

    const debug = portal.answer({
      slug: msSlug,
      version: 'development',
      category: 'additional-documents',
      documentSlug: 'sample-2',
      responseFromServer: response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    expect(response.body.data.category)
      .withContext(`[ response.body.data.category ] should be [ Additional Documents ]: ${debug}`)
      .toBe('Additional Documents');

    await kernelQueue.isFree();
    done();
  });
});
