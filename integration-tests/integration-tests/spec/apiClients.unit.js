/**
* This is a set of tests to run the api tests without a working server.
* They are not run as part of any automation, they are more for documentation
* and convenience.
* There are some api classes in the apiClients module. These provide a convenient
* way to write automation tests where a series of requests are needed. They use
* promise based api instead of the request callback api. They are unit tested in
* this module.
* Run using unit tests using the following command from the root of the api repo
* (may need install):
* npx jasmine --config=./integration-tests/client.unit.json
*/

const urljoin = require('url-join');

const proxyquire = require('proxyquire').noCallThru();

const mockConfig = {
  baseUrl: 'https://base',
  environmentTag: 'sample',
  mockServerUrl: 'https://mockserver',
};

let mockPost = (config, callback) => callback(null, {}, '');
let mockGet = (config, callback) => callback(null, {}, '');
const mockPut = (config, callback) => callback(null, {}, '');
const mockDelete = (config, callback) => callback(null, {}, '');

const stubbedLogin = proxyquire('../endpoints/login.js', {
  '../test.config.js': mockConfig,
});

const { MockArtifactory, PortalPrivateAPI, PortalPublicAPI } = proxyquire('./apiClients', {
  '../test.config.js': mockConfig,
  '../endpoints/login.js': stubbedLogin,
  request: {
    post: (config, callback) => mockPost(config, callback),
    get: (config, callback) => mockGet(config, callback),
    put: (config, callback) => mockPut(config, callback),
    delete: (config, callback) => mockDelete(config, callback),
  },
});

describe('[MockArtifactory] basic api client unit tests.', () => {
  it('should handle common api requests', () => {
    const mock = new MockArtifactory();

    expect(mock.baseUrl).toEqual('https://mockserver');
    expect(mock.artifactorySetFolderUrl).toEqual('https://mockserver/mockartifactory/setfolder/sample');
    expect(mock.mockRequestLoggerUrl).toEqual('https://mockserver/requestlogger/sample');
  });

  it('should use right request for setFolder command', async () => {
    mockGet = (config, callback) => callback(null, {}, config.url);
    const mock = new MockArtifactory();
    const ans = await mock.setFolder('tc02');

    expect(ans).toEqual(urljoin(mock.artifactorySetFolderUrl, 'tc02'));
  });

  it('should use right request for reset command', async () => {
    mockGet = (config, callback) => callback(null, {}, config.url);
    const mock = new MockArtifactory();
    const ans = await mock.reset();

    expect(ans).toEqual(urljoin(mock.artifactorySetFolderUrl, 'tc01'));
  });

  it('should handle request errors during setFolder command', async () => {
    mockGet = (config, callback) => callback('disaster', {}, config.url);
    const mock = new MockArtifactory();
    try {
      await mock.setFolder('tc02');
      fail();
    } catch (err) {
      const { error } = err;

      expect(error).toEqual('disaster');
    }
  });
});

describe('[PortalPrivateAPI] basic api client unit tests.', () => {
  it('should handle common api requests for baseUrl', () => {
    const portal = new PortalPrivateAPI();

    expect(portal.baseUrl).toEqual('https://base');
  });

  it('should use right request for login command', async () => {
    const portal = new PortalPrivateAPI();
    mockPost = (config, callback) => {
      expect(config.url).toEqual(urljoin(portal.baseUrl, 'login'));
      callback(null, { statusCode: 200 }, { data: { token: 'an_auth_token' } });
    };
    const token = await portal.login();

    expect(token).toEqual('Bearer an_auth_token');
  });

  it('should use right request for reading access token for a microservice', async () => {
    const portal = new PortalPrivateAPI();

    mockPost = (config, callback) => {
      expect(config.url).toEqual(urljoin(portal.baseUrl, 'login'));
      callback(null, { statusCode: 200 }, { data: { token: 'an_auth_token' } });
    };
    const token = await portal.login();

    expect(token).toEqual('Bearer an_auth_token');

    mockPost = (config, callback) => {
      expect(config.url).toEqual(urljoin(portal.baseUrl, 'microservices-by-owner'));
      expect(config.headers.Authorization).toEqual(token);
      callback(null, { statusCode: 200, body: { data: [{ slug: 'slug', access_token: 'an_api_token' }] } });
    };
    const apiToken = await portal.readAccessTokenForMS('slug', token);

    expect(apiToken).toEqual('Bearer an_api_token');
  });
});

describe('[PortalPublicAPI] basic api client unit tests.', () => {
  it('should handle common api requests for publicBaseUrl', () => {
    const portal = new PortalPublicAPI('vx');

    expect(portal.publicBaseUrl).toEqual('https://base/integration/vx');
  });

  it('should use right request for documentRefresh command', async () => {
    const portal = new PortalPublicAPI('vx');
    const sampleToken = 'sample_token';

    mockPost = (config, callback) => {
      expect(config.headers.Authorization).toEqual(sampleToken);
      expect(config.url).toEqual(urljoin(portal.publicBaseUrl, 'microservice', 'documentrefresh'));
      callback(null, { statusCode: 200 }, { id: 'an_id', name: 'a name', errors: { development: [], release: [] } });
    };
    const { id, name, errors } = await portal.documentRefresh(sampleToken);

    expect(id).toEqual('an_id');
    expect(name).toEqual('a name');
    expect(errors).toBeTruthy();
    expect(errors.development).toEqual([]);
    expect(errors.release).toEqual([]);
  });
});
