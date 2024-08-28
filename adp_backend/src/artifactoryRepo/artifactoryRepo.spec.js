// ============================================================================================= //
/**
* Unit test for [ adp.artifactoryRepo.getRepoInfo ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing [ adp.artifactoryRepo.getRepoInfo ] behavior.', () => {
  // =========================================================================================== //
  class mockAdp {
    getById() {
      if (adp.behavior.AdpGetById === 0) {
        const mockMicroservice = {
          _id: 'mockMicroserviceId',
          slug: 'mockMicroserviceSlug',
          menu_auto: true,
          repo_urls: {
            development: 'mockDevelopmentRepoURL',
            release: 'mockReleaseRepoURL',
          },
          menu: {
            auto: {
              development: [],
              release: [],
            },
            manual: {
              development: [],
              release: [],
            },
          },
        };
        return new Promise(RES => RES({ docs: [mockMicroservice] }));
      }
      if (adp.behavior.AdpGetById === 1) {
        const mockMicroservice = {
          _id: 'mockMicroserviceId',
          slug: 'mockMicroserviceSlug',
          menu_auto: false,
          repo_urls: {
            development: 'mockDevelopmentRepoURL',
            release: 'mockReleaseRepoURL',
          },
          menu: {
            auto: {
              development: [],
              release: [],
            },
            manual: {
              development: [],
              release: [],
            },
          },
        };
        return new Promise(RES => RES({ docs: [mockMicroservice] }));
      }
      if (adp.behavior.AdpGetById === 2) {
        const mockMicroservice = {
          _id: 'mockMicroserviceId',
          slug: 'mockMicroserviceSlug',
          menu_auto: true,
        };
        return new Promise(RES => RES({ docs: [mockMicroservice] }));
      }
      if (adp.behavior.AdpGetById === 3) {
        const mockMicroservice = {
          _id: 'mockMicroserviceId',
          slug: 'mockMicroserviceSlug',
          menu_auto: true,
          repo_urls: {},
        };
        return new Promise(RES => RES({ docs: [mockMicroservice] }));
      }
      if (adp.behavior.AdpGetById === 4) {
        const mockMicroservice = {
          _id: 'mockMicroserviceId',
          slug: 'mockMicroserviceSlug',
          menu_auto: true,
          repo_urls: { development: 'something/', release: 'something/' },
        };
        return new Promise(RES => RES({ docs: [mockMicroservice] }));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }
  class mockReleaseSettings {
    getReleaseSettings() {
      if (adp.behavior.ReleaseSettingsGetReleaseSettings === 0) {
        return new Promise(RES => RES({ docs: [{ isEnabled: true }] }));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};

    adp.interceptor = {};
    adp.interceptor.queueJobs = [];

    adp.behavior = {};
    adp.behavior.AdpGetById = 0;
    adp.behavior.queueGetPayload = 0;
    adp.behavior.queueSetPayload = 0;
    adp.behavior.queueAddJob = 0;
    adp.behavior.queueAddJobs = 0;
    adp.behavior.ReleaseSettingsGetReleaseSettings = 0;
    adp.behavior.axios = 0;

    adp.models = {};
    adp.models.Adp = mockAdp;
    adp.models.ReleaseSettings = mockReleaseSettings;

    adp.config = {};
    adp.config.eadpusersPassword = 'MockPassword';

    adp.mockCustomMetrics = {};
    adp.mockCustomMetrics.customMetrics = {};
    adp.mockCustomMetrics.customMetrics.artifactoryRespMonitoringHistogram = {};
    adp.mockCustomMetrics.customMetrics.artifactoryRespMonitoringHistogram.observe = () => {};

    adp.queue = {};
    adp.queue.getPayload = () => {
      if (adp.behavior.queueGetPayload === 0) {
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    };
    adp.queue.setPayload = () => {
      if (adp.behavior.queueSetPayload === 0) {
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    };
    adp.queue.addJob = (MISSION, MSID, COMMAND, PARAMS, OBJECTIVE, INDEX) => {
      if (adp.behavior.queueAddJob === 0) {
        const job = {
          mission: MISSION,
          msId: MSID,
          command: COMMAND,
          params: PARAMS,
          objective: OBJECTIVE,
          index: INDEX,
        };
        adp.interceptor.queueJobs.push(job);
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    };
    adp.queue.addJobs = (MISSION, TARGET, OBJECTIVE, COMMANDSANDPARAMS) => {
      if (adp.behavior.queueAddJobs === 0) {
        const job = {
          mission: MISSION,
          target: TARGET,
          objective: OBJECTIVE,
          commandsAndParams: COMMANDSANDPARAMS,
        };
        adp.interceptor.queueJobs.push(job);
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    };

    adp.echoLog = () => {};
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    const mockRax = {
      attach: () => {},
      getConfig: () => {},
    };

    adp.mock = {};
    adp.mock.objective = 'mockObjectiveString';
    adp.mock.msBasics = {
      _id: 'mockMicroserviceId',
      name: 'Mock Microservice',
      slug: 'mock-microservice',
      menu_auto: true,
      repo_urls: {
        development: 'https://mockURL/development/',
        release: 'https://mockURL/release/',
      },
    };
    adp.mock.successfulCompleteStringToParse = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
    <html>
    <head><title>Index of docker-v2-global-local/aia/adp</title>
    </head>
    <body>
    <h1>Index of docker-v2-global-local/aia/adp</h1>
    <pre>Name                                                 Last modified      Size</pre><hr/>
    <pre><a href="../">../</a>
    <a href="1.0.1.yaml">1.0.1.yaml</a>                             12-Dec-2019 16:08  43.08 KB
    <a href="1.0.2.yaml">1.0.2.yaml</a>                             12-Dec-2019 16:08  43.08 KB
    </pre>
    </body></html>`;
    adp.mock.errorNoTitleStringToParse = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
    <html>
    <body>
    <h1>Index of docker-v2-global-local/aia/adp</h1>
    <pre>Name                                                 Last modified      Size</pre><hr/>
    <pre><a href="../">../</a>
    <a href="1.0.1.yaml">1.0.1.yaml</a>                             12-Dec-2019 16:08  43.08 KB
    <a href="1.0.2.yaml">1.0.2.yaml</a>                             12-Dec-2019 16:08  43.08 KB
    </pre>
    </body></html>`;

    adp.artifactoryRepo = proxyquire('./artifactoryRepo', {
      '../library/errorLog': adp.mockErrorLog,
      '../metrics/register': adp.mockCustomMetrics,
      'retry-axios': mockRax,
      axios: () => new Promise((RES, REJ) => {
        if (adp.behavior.axios === 0) {
          RES({ data: adp.mock.successfulCompleteStringToParse });
        } else if (adp.behavior.axios === 1) {
          RES({ data: adp.mock.errorNoTitleStringToParse });
        } else if (adp.behavior.axios === -1) {
          const mockError = {
            response: 'mockError',
          };
          REJ(mockError);
        } else if (adp.behavior.axios === -2) {
          const mockError = {
            request: 'mockError',
          };
          REJ(mockError);
        } else if (adp.behavior.axios === -3) {
          const mockError = {};
          REJ(mockError);
        } else if (adp.behavior.axios === -4) {
          const mockError = { response: { status: 404 } };
          REJ(mockError);
        } else if (adp.behavior.axios === -5) {
          const mockError = { response: { status: 500 } };
          REJ(mockError);
        }
      }),
    });
  });


  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] in a successful case.', (done) => {
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();

        const jobs = adp.interceptor.queueJobs;
        const job1Action1 = jobs[0].commandsAndParams[0];

        expect(job1Action1.command).toEqual('adp.integration.documentRefreshPerVersion');
        expect(job1Action1.parameters[2]).toEqual('mockReleaseRepoURL/1.0.1.yaml');
        expect(job1Action1.parameters[3]).toEqual('1.0.1');
        expect(job1Action1.parameters[4]).toEqual('release');
        expect(job1Action1.index).toEqual(1);

        const job1Action2 = jobs[0].commandsAndParams[1];

        expect(job1Action2.command).toEqual('adp.integration.documentRefreshPerVersion');
        expect(job1Action2.parameters[2]).toEqual('mockReleaseRepoURL/1.0.2.yaml');
        expect(job1Action2.parameters[3]).toEqual('1.0.2');
        expect(job1Action2.parameters[4]).toEqual('release');
        expect(job1Action2.index).toEqual(2);

        const job2 = jobs[1];

        expect(job2.mission).toEqual('documentRefresh');
        expect(job2.msId).toEqual('mockMicroserviceId');
        expect(job2.command).toEqual('adp.integration.documentRefreshConsolidation');

        expect(job2.params[0]).toEqual('mockMicroserviceId');
        expect(job2.params[1]).toEqual('mockMicroserviceSlug');

        expect(job2.index).toEqual(3);

        adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective, '1.0.1')
          .then((RESULT1) => {
            expect(RESULT1).toBeDefined();
            adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective, '1.0.2')
              .then((RESULT2) => {
                expect(RESULT2).toBeDefined();
                done();
              })
              .catch(() => {
                done.fail();
              });
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if file returns invalid.', (done) => {
    adp.behavior.axios = 1;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: htmlParse: Unable to read artifactory page';
        const errorGot = ERROR.toString();

        expect(errorGot.substr(0, expectedErrorString.length)).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ axious ] crashes.', (done) => {
    adp.behavior.axios = -1;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: {"development":["Error while reading artifactory location"],"release":["Error while reading artifactory location"]}';

        expect(ERROR.toString()).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ axious ] crashes in a different way.', (done) => {
    adp.behavior.axios = -2;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: {"development":["Error while reading artifactory location"],"release":["Error while reading artifactory location"]}';

        expect(ERROR.toString()).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ axious ] crashes with an empty response.', (done) => {
    adp.behavior.axios = -3;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: {"development":["Error while reading artifactory location"],"release":["Error while reading artifactory location"]}';

        expect(ERROR.toString()).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ axious ] crashes with a 404 error.', (done) => {
    adp.behavior.axios = -4;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: {"development":["Artifactory location not found"],"release":["Artifactory location not found"]}';

        expect(ERROR.toString()).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ axious ] crashes with a 500 error.', (done) => {
    adp.behavior.axios = -5;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        const expectedErrorString = 'Error: {"development":["Error while reading artifactory location"],"release":["Error while reading artifactory location"]}';

        expect(ERROR.toString()).toEqual(expectedErrorString);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if [ adpModel.getById @ adp.models.Adp ] crashes.', (done) => {
    adp.behavior.AdpGetById = -1;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if microservice has menu auto set as false.', (done) => {
    adp.behavior.AdpGetById = 1;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if microservice has repo_url is undefined.', (done) => {
    adp.behavior.AdpGetById = 2;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if microservice has repo_url but it is empty.', (done) => {
    adp.behavior.AdpGetById = 3;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ updateService ] if microservice has repo_url but there is no link.', (done) => {
    adp.behavior.AdpGetById = 4;
    adp.artifactoryRepo.updateService(adp.mock.msBasics, adp.mock.objective)
      .then(() => {
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ parseRepoInfo ] in a successful case.', (done) => {
    adp.artifactoryRepo.parseRepoInfo(adp.mock.successfulCompleteStringToParse)
      .then((RESULT) => {
        expect(RESULT).toEqual(['1.0.1.yaml', '1.0.2.yaml']);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ parseRepoInfo ] if title is missing.', (done) => {
    adp.artifactoryRepo.parseRepoInfo(adp.mock.errorNoTitleStringToParse)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ parseRepoInfo ] if content is empty.', (done) => {
    const TheStringToParse = '';
    adp.artifactoryRepo.parseRepoInfo(TheStringToParse)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] in a successful case.', async (done) => {
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      const result = await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );

      expect(result).toEqual(adp.mock.successfulCompleteStringToParse);
      done();
    } catch (error) {
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] if [ axious ] crashes.', async (done) => {
    adp.behavior.axios = -1;
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );
      done.fail();
    } catch (error) {
      const expectedError = 'Error: Error while reading artifactory location';

      expect(error.toString()).toEqual(expectedError);
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] if [ axious ] crashes in a different way.', async (done) => {
    adp.behavior.axios = -2;
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );
      done.fail();
    } catch (error) {
      const expectedError = 'Error: Error while reading artifactory location';

      expect(error.toString()).toEqual(expectedError);
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] if [ axious ] crashes with an empty response.', async (done) => {
    adp.behavior.axios = -3;
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );
      done.fail();
    } catch (error) {
      const expectedError = 'Error: Error while reading artifactory location';

      expect(error.toString()).toEqual(expectedError);
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] if [ axious ] crashes with a 404 error.', async (done) => {
    adp.behavior.axios = -4;
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );
      done.fail();
    } catch (error) {
      const expectedError = 'Error: Artifactory location not found';

      expect(error.toString()).toEqual(expectedError);
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ artifactoryFileRequest ] if [ axious ] crashes with a 500 error.', async (done) => {
    adp.behavior.axios = -5;
    const mockAssetId = 'mockAssetId';
    const mockAssetSlug = 'mockAssetSlug';
    const requestUrl = 'mockRequestUrl';
    try {
      await adp.artifactoryRepo.artifactoryFileRequest(
        mockAssetId, mockAssetSlug, requestUrl,
      );
      done.fail();
    } catch (error) {
      const expectedErrorString = 'Error: Error while reading artifactory location';

      expect(error.toString()).toEqual(expectedErrorString);
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ parseYaml ] in a successful case.', async (done) => {
    const theYAML = `version: 1.0.2
documents:
- name: Sample 3
  filepath: '1.0.2/CAS_Deployment_Guide.zip'
- name: Sample 4
  filepath: '1.0.2/test.html'
- name: Sample 5
  filepath: '1.0.2/other.html'
- name: An External 2
  external-link: https://www.ericsson.se`;
    try {
      const result = await adp.artifactoryRepo.parseYaml(theYAML);

      expect(result.version).toEqual('1.0.2');
      expect(result.documents[0].name).toEqual('Sample 3');
      expect(result.documents[1].name).toEqual('Sample 4');
      expect(result.documents[2].name).toEqual('Sample 5');
      expect(result.documents[3].name).toEqual('An External 2');
      done();
    } catch (error) {
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ parseYaml ] in another successful case.', (done) => {
    const yamlString1 = '"documents:\n  - name: Service User Guide\n    filepath: user-guide.zip\n    default: true\n  - name: Application Developers Guide\n    filepath: application-developers-guide.zip\n  - name: Product Revision Information (PRI)\n    filepath: pri.zip\n  - name: ADP Reference Application\n    external-link: https://adp.ericsson.se/workinginadpframework/adp-reference-application\n  - name: Inner Source README\n    external-link: https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-ref-app/adp-ref-catfacts-text-analyzer/+/refs/heads/master/README.md\n  - name: Contributing Guideline\n    external-link: https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-ref-app/adp-ref-catfacts-text-analyzer/+/refs/heads/master/CONTRIBUTING.md\n  - name: PM Metrics\n    external-link: https://arm.sero.gic.ericsson.se/artifactory/proj-adp-ref-app-docs-dev-generic-local/documents/eric-ref-catfacts-text-analyzer_pm_metrics.json\n  - name: Software Vendor List (SVL)\n    filepath: svl.zip\n  - name: Test Specification\n    external-link: https://document.internal.ericsson.com/Download?DocNo=1/15241-APR20130/2&Rev=A&Lang=EN\n  - name: Test Report\n    external-link: https://document.internal.ericsson.com/Download?DocNo=1/15283-APR20130/2-68&Rev=A&Lang=EN\n  - name: Risk Assessment & Privacy Impact Assessment\n    external-link: https://document.internal.ericsson.com/Download?DocNo=1/00664-APR20130/2&Rev=A&Lang=EN\n    restricted: true\n  - name: Secure Coding Report\n    external-link: https://document.internal.ericsson.com/Download?DocNo=1/0360-APR20130/2&Rev=A&Lang=EN\n    restricted: true\n  - name: Vulnerability Analysis Report\n    external-link: https://document.internal.ericsson.com/Download?DocNo=1/1597-APR20130/2&Rev=J&Lang=EN\n    restricted: true\n  - name: Characteristics Summary Report\n    filepath: characteristics_report.html\n"';
    const expectedResult1 = '- name: Service User Guide';
    const result1 = adp.artifactoryRepo.parseYaml(yamlString1).substr(11, 26);

    expect(result1).toEqual(expectedResult1);
    done();
  });
  // ------------------------------------------------------------------------------------------- //
});
