const request = require('request');
const urljoin = require('url-join');
const config = require('../test.config.js');
const { PortalPrivateAPI, MockArtifactory, PortalPublicAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();
const portalPublic = new PortalPublicAPI();
const mockArtifactory = new MockArtifactory();

const SSL = false;
const json = true;
let responceData;
let token = 'Bearer ';
let originalValue;

describe('Basic tests for the documentation using backend', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  beforeEach(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[DOCUMENTATION001]] should get document for the Auto MS max Troubleshooting Guide(test folder)', (done) => {
    portal.startTestLog('[[DOCUMENTATION001]]');
    request.get({
      url: `${config.baseUrl}document/auto-ms-max/development/dpi/service-overview`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response) => {
      expect(response.statusCode)
        .withContext(`Expected 200, got ${response.statusCode}: ${JSON.stringify(response, null, 2)}`)
        .toBe(200);
      done();
    });
  });

  it('[[DOCUMENTATION002]] should get includes for the Auto MS max Troubleshooting Guide(test folder)', (done) => {
    portal.startTestLog('[[DOCUMENTATION002]]');
    request.get({
      url: `${config.baseUrl}document/auto-ms-max/development/dpi/service-overview`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response, body) => {
      const responseData = body.data.body.toString();

      expect(responseData.includes('Check if the chart is installed with the provided release name'))
        .withContext(`Expected responseData to have a specific string: ${JSON.stringify(responseData, null, 2)}`)
        .toBe(true);

      done();
    });
  });

  it('[[DOCUMENTATION003]] should get document Application Developers Guide for Auto MS with Docs', (done) => {
    portal.startTestLog('[[DOCUMENTATION003]]');
    request.get({
      url: `${config.baseUrl}document/auto-ms-with-docs/development/dpi/application-developers-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response) => {
      expect(response.statusCode)
        .withContext(`Expected 200, got ${response.statusCode}: ${JSON.stringify(response, null, 2)}`)
        .toBe(200);
      done();
    });
  });

  it('[[DOCUMENTATION004]] should get document Application Developers Guide for the Auto MS with Docs with 3 includes', (done) => {
    portal.startTestLog('[[DOCUMENTATION004]]');

    const getObject = {
      url: `${config.baseUrl}document/auto-ms-with-docs/development/dpi/application-developers-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    };

    request.get(getObject,
      (error, response, body) => {
        responceData = body && body.data && body.data.body ? body.data.body.toString() : '';

        const debug = portal.answer({
          url: getObject.url,
          message: body && body.message ? body.message : undefined,
          error,
          body,
          getObject,
        });

        expect(responceData.includes('ERICSSON-ALARM-PC-MIB DEFINITIONS ::= BEGIN'))
          .withContext(`The [ body.data.body ] should contain the [ ERICSSON-ALARM-PC-MIB DEFINITIONS ::= BEGIN ] string: ${debug}`)
          .toBe(true);

        expect(responceData.includes('ERICSSON-ALARM-TC-MIB DEFINITIONS ::= BEGIN'))
          .withContext(`The [ body.data.body ] should contain the [ ERICSSON-ALARM-TC-MIB DEFINITIONS ::= BEGIN ] string: ${debug}`)
          .toBe(true);

        expect(responceData.includes('ERICSSON-ALARM-XPATH-MIB DEFINITIONS ::= BEGIN'))
          .withContext(`The [ body.data.body ] should contain the [ ERICSSON-ALARM-XPATH-MIB DEFINITIONS ::= BEGIN ] string: ${debug}`)
          .toBe(true);

        done();
      });
  });

  it('[[DOCUMENTATION005]] should get document Application Developers Guide for the Auto MS with Docs with 1 include from ConfigSchema.json', (done) => {
    portal.startTestLog('[[DOCUMENTATION005]]');

    const getObject = {
      url: `${config.baseUrl}document/auto-ms-with-docs/development/dpi/application-developers-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    };

    request.get(getObject,
      (error, response, body) => {
        responceData = body && body.data && body.data.body ? body.data.body.toString() : '';

        const debug = portal.answer({
          url: getObject.url,
          message: body && body.message ? body.message : undefined,
          error,
          body,
          getObject,
        });

        expect(responceData.includes('Definition of SNMP Alarm Provider configuration parameters.'))
          .withContext(`The [ body.data.body ] should contain the [ Definition of SNMP Alarm Provider configuration parameters. ] string: ${debug}`)
          .toBe(true);

        done();
      });
  });

  it('[[DOCUMENTATION006]] should get document Service Deployment Guide for Auto MS with Docs with 1 include', (done) => {
    portal.startTestLog('[[DOCUMENTATION006]]');

    request.get({
      url: `${config.baseUrl}document/auto-ms-with-docs/development/dpi/service-deployment-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const respData = body.data.body.toString();

      expect(respData.includes('Verify that the Cassandra cluster is healthy'))
        .withContext(`Expected respData to contain a specific string: ${JSON.stringify(respData, null, 2)}`)
        .toBe(true);

      done();
    });
  });

  it('[[DOCUMENTATION007]] should get document for the Auto MS with Docs with includes, gitweb, documents not on master branch with h and hb parameters', (done) => {
    portal.startTestLog('[[DOCUMENTATION007]]');

    request.get({
      url: `${config.baseUrl}document/auto-ms-with-docs/3.2.1/dpi/service-overview`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);

      responceData = body.data.body.toString();

      expect(responceData.includes('Introduction branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-PC-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-TC-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-XPATH-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('Testing include document on the branch')).toBe(true);
      done();
    });
  });


  it('[[DOCUMENTATION008]] should get document for the Auto MS with Docs with includes, gitweb, documents not on master branch with hb parameter only', (done) => {
    portal.startTestLog('[[DOCUMENTATION008]]');

    request.get({
      url: `${config.baseUrl}document/auto-ms-with-docs/3.2.1/dpi/application-developers-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);

      responceData = body.data.body.toString();

      expect(responceData.includes('Introduction branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-PC-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-TC-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('ERICSSON-ALARM-XPATH-MIB DEFINITIONS ::= BEGIN Testing include document on the branch')).toBe(true);
      expect(responceData.includes('Testing include document on the branch')).toBe(true);
      done();
    });
  });

  it('[[DOCUMENTATION009]] should get document for the Auto MS with Docs, gitweb with h and hb paramemters, documents not on master branch', (done) => {
    portal.startTestLog('[[DOCUMENTATION009]]');

    const getObject = {
      url: `${config.baseUrl}document/auto-ms-with-docs/3.2.1/additional-documents/troubleshooting-guide`,
      headers: { Authorization: token },
      json,
      strictSSL: SSL,
    };

    request.get(getObject,
      (error, response, body) => {
        responceData = body && body.data && body.data.body ? body.data.body.toString() : '';

        const debug = portal.answer({
          url: getObject.url,
          message: body && body.message ? body.message : undefined,
          error,
          body,
          getObject,
        });

        expect(response.statusCode)
          .withContext(`The server code should be 200: ${debug}`)
          .toBe(200);

        expect(responceData.includes('Introduction branch'))
          .withContext(`[ responceData ] should include the [ Introduction branch ] string: ${debug}`)
          .toBe(true);

        done();
      });
  });
});

describe('[ RBAC ] Testing document access ( Endpoint: /document/:msSlug/:ver/:cat/:doc/:sub?/ )', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  beforeEach(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('[[DOCUMENTATION010]] [ RBAC ] SuperUser access a specific document.', (done) => {
    portal.startTestLog('[[DOCUMENTATION010]]');
    portal.login(login.optionsAdmin)
      .then((TOKEN) => {
        const options = {
          url: `${config.baseUrl}document/auto-ms-with-docs/development/additional-documents/troubleshooting-guide`,
          headers: { Authorization: TOKEN },
          json,
          strictSSL: false,
        };
        request.get(options,
          (error, response) => {
            if (error) {
              done.fail();
              return;
            }
            const jsonReturn = response.body;

            expect(jsonReturn.code).toBe(200);
            expect(jsonReturn.data.title).toBe('Troubleshooting Guide');
            done();
          });
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[[DOCUMENTATION011]] [ RBAC ] TestUser access a specific document.', (done) => {
    portal.startTestLog('[[DOCUMENTATION011]]');
    portal.login(login.optionsTest)
      .then((TOKEN) => {
        const options = {
          url: `${config.baseUrl}document/auto-ms-with-docs/development/additional-documents/troubleshooting-guide`,
          headers: { Authorization: TOKEN },
          json,
          strictSSL: false,
        };
        request.get(options,
          (error, response) => {
            if (error) {
              done.fail();
              return;
            }
            const jsonReturn = response.body;

            expect(jsonReturn.code).toBe(200);
            expect(jsonReturn.data.title).toBe('Troubleshooting Guide');
            done();
          });
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[[DOCUMENTATION012]] [ RBAC ] Etapase User can`t access a specific document, because is inside of "Auto MS with Docs" asset.', (done) => {
    portal.startTestLog('[[DOCUMENTATION012]]');

    portal.login(login.optionsTestUserEtapase)
      .then((TOKEN) => {
        const options = {
          url: `${config.baseUrl}document/auto-ms-with-docs/development/additional-documents/troubleshooting-guide`,
          headers: { Authorization: TOKEN },
          json,
          strictSSL: false,
        };
        request.get(options,
          (error, response) => {
            if (error) {
              done.fail();
              return;
            }
            const jsonReturn = response.body;

            expect(jsonReturn.code).toBe(403);
            done();
          });
      })
      .catch(() => {
        done.fail();
      });
  });
});

describe(' Testing document access ( Endpoint: /document/:msSlug/:ver/:cat/:doc/ )', () => {
  it('[[DOCUMENTATION013]] Testing a successful case of document get and check particular location_ids', async () => {
    portal.startTestLog('[[DOCUMENTATION013]]');

    await portal.clearCache('ALLASSETS');
    await portal.login();

    const documentresponse = await portal.documentGet('auto-ms-with-docs', '3.2.1', 'additional-documents', 'troubleshooting-guide');
    const responseBody = documentresponse.body.data.body;

    expect(responseBody.indexOf('comment-h2-introduction-branch'))
      .withContext('Should contain comment-h2-introduction-branch class')
      .toBeGreaterThan(-1);

    expect(responseBody.indexOf('comment-h2-prerequisites'))
      .withContext('Should contain comment-h2-prerequisites class')
      .toBeGreaterThan(-1);

    expect(responseBody.indexOf('comment-h3-verifying-the-wide-column-database-cd-service'))
      .withContext('Should contain comment-h3-verifying-the-wide-column-database-cd-service class')
      .toBeGreaterThan(-1);

    expect(responseBody.indexOf('comment-h3-restarting-the-wide-column-database-cd-kubernetes-pods'))
      .withContext('Should contain comment-h3-restarting-the-wide-column-database-cd-kubernetes-pods class')
      .toBeGreaterThan(-1);

    expect(documentresponse.code).toBe(200);
  });

  it('[[DOCUMENTATION014]] Should check if location ID field is present for particular document', async () => {
    portal.startTestLog('[[DOCUMENTATION014]]');

    await portal.clearCache('ALLASSETS');
    await portal.login();

    const documentresponse = await portal.documentGet('auto-ms-with-docs', '3.2.1', 'additional-documents', 'troubleshooting-guide');
    const responseLocationId = documentresponse.body.data.location_id;

    expect(responseLocationId)
      .withContext('Should contain comment-h2-introduction-branch class')
      .toEqual('msdocumentation_45e7f4f992afe7bbb62a3391e5010c3b_321-additional-documents-troubleshooting-guide');

    expect(documentresponse.code).toBe(200);
  });
});
