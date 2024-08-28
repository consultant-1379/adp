// ============================================================================================= //
/**
* Unit test for [ global.adp.microserviceAnalytics.getPraVersion ]
* @author Omkar Sadegaonkar [esdgmkr]
*/
// ============================================================================================= //
let mockMSResponse;
let mockYamlRequest;
let mockYamlBuild;
let yamlBuildThrowError;
const mockMSError = {};
class MockAdp {
  getByMSSlug(slug) {
    return new Promise((resolve, reject) => {
      if (slug !== 'fail') {
        return resolve(mockMSResponse);
      }
      return reject(mockMSError);
    });
  }
}

describe('Testing [ global.adp.microserviceAnalytics.getPraVersion ] ', () => {
  beforeEach(() => {
    mockMSResponse = { docs: [] };
    mockYamlRequest = { error: null, response: '', body: '' };
    mockYamlBuild = {};
    yamlBuildThrowError = false;

    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.adpHelmDataFile = '';
    global.adp.config.eadpusersPassword = 'mockUser:mockPassword';
    // eslint-disable-next-line global-require
    global.adp.dynamicSort = require('../library/dynamicSort');
    global.jsyaml = {};
    global.jsyaml.safeLoad = () => {
      if (yamlBuildThrowError) {
        throw new Error();
      }
      return mockYamlBuild;
    };
    global.request = {};
    // Mock index.yml file fetch
    global.request = {};
    global.request.get = (obj, callback) => callback(
      mockYamlRequest.error,
      mockYamlRequest.response,
      mockYamlRequest.body,
    );
    global.adp.microserviceAnalytics = {};
    global.adp.microserviceAnalytics.getPraVersion = require('./getPraVersion'); // eslint-disable-line global-require

    // Mock MS Call
    global.adp.db = {};
    global.adp.db.find = ((db, query) => new Promise((resolve, reject) => {
      if (query.selector.slug !== 'fail') {
        return resolve(mockMSResponse);
      }
      return reject(mockMSError);
    }));
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should reject with 404 if the given microservice slug is blank.', async (done) => {
    await global.adp.microserviceAnalytics.getPraVersion(' ')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should reject with 500 if the microservice fetch fails.', async (done) => {
    await global.adp.microserviceAnalytics.getPraVersion('fail')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(500);
        done();
      });
  });

  it('should reject with 404 if the microservice return is empty.', async (done) => {
    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should reject with 404 if the microservice return has no helm.', async (done) => {
    mockMSResponse.docs.push({ name: 'test' });
    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should reject with 404 if the microservice return a empty string helm.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: ' ',
      helm_chartname: ' ',
    });
    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should reject with 400 if requesting the index.yaml file fails.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    mockYamlRequest.error = 'error';
    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(400);
        done();
      });
  });

  it('should reject with 404 if the yaml file is not structured correctly.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    mockYamlRequest.error = null;
    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should reject with 500 if the yaml file build throws a error.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    mockYamlRequest.error = null;
    yamlBuildThrowError = true;

    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should return with 404 if the yaml object does not have the given helm name.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    mockYamlRequest.error = null;
    mockYamlRequest = {
      entries: {
        otherHelm: {
          version: '1+324',
        },
      },
    };

    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should return with 404 if the yaml object does not have pra numbers to the fetched helm name.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    mockYamlRequest.error = null;
    mockYamlRequest = {
      entries: {
        testHelm: {
          version: '1-324',
        },
      },
    };

    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });

  it('should return the latest pra number to the given chartname.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    const latestPRa = '334.5555.123+215';
    mockYamlRequest.error = null;
    mockYamlBuild = {
      entries: {
        testHelm: [
          {
            created: '2020-01-09T13:30:44.352Z',
            version: '3.1.0+00',
          },
          {
            created: '2019-03-01T13:30:44.353Z',
            version: latestPRa,
          },
          {
            created: '2020-03-01T13:30:44.352Z',
            version: '334.5555.123+214',
          },
        ],
      },
    };

    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then((result) => {
        expect(result).toBe(latestPRa);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should return the latest pra number and exclude EP version to the given chartname.', async (done) => {
    mockMSResponse.docs.push({
      helmurl: 'testHelm',
      helm_chartname: 'testHelm',
    });
    const latestPRa = '3.55.123+215';
    mockYamlRequest.error = null;
    mockYamlBuild = {
      entries: {
        testHelm: [
          {
            created: '2024-01-09T13:30:44.352Z',
            version: '3.1.0-EP1+25',
          },
          {
            created: '2024-01-09T13:30:44.352Z',
            version: '4.1.0-EP1+26',
          },
          {
            created: '2019-03-01T13:30:44.353Z',
            version: latestPRa,
          },
          {
            created: '2024-03-01T13:30:44.352Z',
            version: '3.55.123+214',
          },
        ],
      },
    };

    await global.adp.microserviceAnalytics.getPraVersion('test')
      .then((result) => {
        expect(result).toBe(latestPRa);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
