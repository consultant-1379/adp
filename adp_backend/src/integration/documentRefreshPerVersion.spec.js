/**
* Unit test for [ adp.integration.documentRefreshPerVersion ]
* @author Tirth Pipalia [zpiptir]
*/

const proxyquire = require('proxyquire');

describe('Testing [ adp.integration.documentRefreshPerVersion ]', () => {
  class mockAdp {
    getById() {
      if (adp.behavior.adpGetById === 0) {
        const result = {
          docs: [
            {
              _id: '94a350e9562037d0611a54963300353d',
              name: 'mockName',
              slug: 'mocked-auto-ms-with-multiple-doc-types-automode',
              menu_auto: true,
              repo_urls: [Object],
              menu: {
                auto: {
                  development: [],
                },
              },
              check_cpi: false,

            },
          ],
        };
        return new Promise(RES => RES(result));
      } if (adp.behavior.adpGetById === 1) {
        const result = {
          docs: [
            {
              _id: '94a350e9562037d0611a54963300353d',
              name: 'mockName',
              slug: 'mocked-auto-ms-with-multiple-doc-types-automode',
              menu_auto: true,
              menu: {
                auto: {
                  errors: { release: [], development: [] },
                  development: [],
                  release: [{
                    version: 'mockVersion',
                    documents: [{}, {},
                    ],
                  }],
                },
              },
              check_cpi: false,

            },
          ],
        };
        return new Promise(RES => RES(result));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }

  class MockArtifactory {
    parseYaml() {
      if (adp.behavior.parseYaml === 0) {
        const result = {
          version: 'mockVersion',
          documents: [
          ],
        };
        return result;
      } if (adp.behavior.parseYaml === 1) {
        const result = {
          version: 'mockVersion',
          documents: [
            {
              name: 'mockNameOne pdf',
              default: true,
              restricted: true,
              external_link: 'https://gerrit.ericsson/mockelink=1',
            },
          ],
        };
        return result;
      } if (adp.behavior.parseYaml === 2) {
        const result = {
          version: 'mockVersion',
          documents: [
            {
              name: 'mockNameTwo xls',
              restricted: true,
              external_link: 'https://gerrit.ericsson/mockelink=2',
            },
            {
              name: 'mockNameOne pdf',
              default: true,
              restricted: true,
              external_link: 'https://gerrit.ericsson/mockelink=1',
            },
          ],
        };
        return result;
      }
      throw new Error('MockError');
    }

    artifactoryFileRequest() {
      if (adp.behavior.artifactoryFileRequest === 0) {
        return 2;
      }
      throw new Error('MockError');
    }
  }

  beforeEach(() => {
    global.adp = {};
    global.adp.documentMenu = {};
    global.adp.documentMenu.process = {};
    global.adp.documentMenu.process.action = MENU => new Promise((RESOLVE) => {
      RESOLVE(MENU);
    });

    adp.models = {};
    adp.models.Adp = mockAdp;

    global.adp.clone = SOURCE => JSON.parse(JSON.stringify(SOURCE));

    adp.behavior = {};
    adp.behavior.adpGetById = 0;
    adp.behavior.artifactoryFileRequest = 0;
    adp.behavior.parseYaml = 0;
    adp.behavior.queueGetPayload = 0;
    adp.behavior.queueSetPayload = 0;

    adp.echoLog = () => {};
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.queue = {};
    adp.queue.getPayload = () => {
      if (adp.behavior.queueGetPayload === 0) {
        const payLoad = {
          status: 1,
          serverStatusCode: 200,
          name: 'mock Name',
          slug: 'mock-Name',
          versions: 1,
          yamlErrors: { development: [], release: [] },
          yamlErrorsQuant: 0,
          yamlWarnings: { development: [], release: [] },
          yamlWarningsQuant: 0,
          theMenu: { auto: { development: [], release: [] } },

        };
        return new Promise(RES => RES(payLoad));
      } if (adp.behavior.queueGetPayload === 1) {
        const payLoad = {
          status: 1,
          serverStatusCode: 200,
          name: 'mock Name',
          slug: 'mock-Name',
          versions: 1,
          yamlErrors: { },
          yamlErrorsQuant: 0,
          yamlWarnings: { },
          yamlWarningsQuant: 0,
          theMenu: { auto: { development: [], release: [] } },

        };
        return new Promise(RES => RES(payLoad));
      } if (adp.behavior.queueGetPayload === 2) {
        return new Promise(RES => RES());
      }
      const mockError = 'mockError';
      return new Promise((_RES, REJ) => REJ(mockError));
    };
    adp.queue.setPayload = () => {
      if (adp.behavior.queueSetPayload === 0) {
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    };

    adp.integration = {};
    adp.integration.documentRefresh = {};
    adp.integration.documentRefresh.analyseErrorsAndWarnings = () => {
      const result = {
        errors: 0,
        warnings: 0,
      };
      return result;
    };
    adp.artifactoryRepo = {};
    adp.artifactoryRepo = new MockArtifactory();

    adp.integration.documentRefreshPerVersion = proxyquire('./documentRefreshPerVersion', {
      '../library/errorLog': adp.mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing a successful case when no document is found', (done) => {
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.statusCode).toBe(200);
        expect(RESULT.version).toBeDefined();
        expect(RESULT.yamlUrl).toBeDefined();
        expect(RESULT.yamlErrorsQuant).toBe(0);
        expect(RESULT.yamlWarningsQuant).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing a successful case when only 1 document is found', (done) => {
    adp.behavior.parseYaml = 1;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.statusCode).toBe(200);
        expect(RESULT.version).toBeDefined();
        expect(RESULT.yamlUrl).toBeDefined();
        expect(RESULT.yamlParsed.documents.length).toBe(1);
        expect(RESULT.dbResponse).toBeDefined();
        expect(RESULT.yamlErrorsQuant).toBe(0);
        expect(RESULT.yamlWarningsQuant).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing a successful case when more than 1 document is found', (done) => {
    adp.behavior.parseYaml = 2;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.statusCode).toBe(200);
        expect(RESULT.version).toBeDefined();
        expect(RESULT.yamlUrl).toBeDefined();
        expect(RESULT.yamlParsed.documents.length).toBe(2);
        expect(RESULT.dbResponse).toBeDefined();
        expect(RESULT.yamlErrorsQuant).toBe(0);
        expect(RESULT.yamlWarningsQuant).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Test case when mode!=development and errors are found in menu.auto.errors', (done) => {
    adp.behavior.adpGetById = 1;
    adp.behavior.queueGetPayload = 2;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'mockMode', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.statusCode).toBe(200);
        expect(RESULT.version).toBe('mockVersion');
        expect(RESULT.yamlUrl).toBeDefined();
        expect(RESULT.yamlParsed).toBeDefined();
        expect(RESULT.dbResponse).toBeDefined();
        expect(RESULT.yamlErrors).toBeDefined();
        expect(RESULT.yamlWarnings).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when YAML retrival from Artifactory process fails', (done) => {
    adp.behavior.artifactoryFileRequest = 1;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.code).toBe(500);
        expect(RESULT.desc).toBeDefined();
        expect(RESULT.data).toBeDefined();
        expect(RESULT.origin).toBeDefined();
        expect(RESULT.packName).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when reading Microservice from Database process fails', (done) => {
    adp.behavior.adpGetById = 2;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.code).toBe(500);
        expect(RESULT.desc).toBeDefined();
        expect(RESULT.data).toBeDefined();
        expect(RESULT.data.microserviceId).toBe('mockID');
        expect(RESULT.data.microserviceSlug).toBe('mockSlug');
        expect(RESULT.data.mode).toBe('development');
        expect(RESULT.data.objective).toBe('mockObjective');
        expect(RESULT.origin).toBeDefined();
        expect(RESULT.packName).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when Reading the Payload process fails', (done) => {
    adp.behavior.queueGetPayload = 3;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.code).toBe(500);
        expect(RESULT.desc).toBeDefined();
        expect(RESULT.data).toBeDefined();
        expect(RESULT.data.microserviceId).toBe('mockID');
        expect(RESULT.data.microserviceSlug).toBe('mockSlug');
        expect(RESULT.data.mode).toBe('development');
        expect(RESULT.data.objective).toBe('mockObjective');
        expect(RESULT.origin).toBeDefined();
        expect(RESULT.packName).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when adp.queue.setPayload fails', (done) => {
    adp.behavior.queueSetPayload = 1;
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.code).toBe(500);
        expect(RESULT.desc).toBeDefined();
        expect(RESULT.data).toBeDefined();
        expect(RESULT.data.status).toBe(500);
        expect(RESULT.data.microserviceId).toBe('mockID');
        expect(RESULT.data.microserviceSlug).toBe('mockSlug');
        expect(RESULT.data.mode).toBe('development');
        expect(RESULT.data.objective).toBe('mockObjective');
        expect(RESULT.origin).toBeDefined();
        expect(RESULT.packName).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when parsing YAML file process fails', (done) => {
    global.adp.documentMenu.process.action = () => new Promise((RESOLVE, REJECT) => {
      const mockError = 'Mock Error';
      REJECT(mockError);
    });
    adp.integration.documentRefreshPerVersion('mockID', 'mockSlug', 'mockYAMLurl', 'mockVersion', 'development', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.code).toBe(500);
        expect(RESULT.desc).toBeDefined();
        expect(RESULT.data).toBeDefined();
        expect(RESULT.data.status).toBe(500);
        expect(RESULT.data.microserviceId).toBe('mockID');
        expect(RESULT.data.microserviceSlug).toBe('mockSlug');
        expect(RESULT.data.mode).toBe('development');
        expect(RESULT.data.objective).toBe('mockObjective');
        expect(RESULT.origin).toBeDefined();
        expect(RESULT.packName).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
