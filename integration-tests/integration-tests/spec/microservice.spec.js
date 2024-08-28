/* eslint-disable array-callback-return */
const request = require('request');
const urljoin = require('url-join');
const config = require('../test.config.js');
const data = require('../test.data.js');
const login = require('../endpoints/login.js');
const { PortalPrivateAPI } = require('./apiClients');

let token = 'Bearer ';
let tokenTest = 'Bearer ';

let microserviceId = '';
let microserviceIdRestricted; let microserviceIdTag; let microserviceIdMaturity;
let microserviceIdTeamMailer;

const portal = new PortalPrivateAPI();


describe('Basic tests for the microservises for logged in admin user', () => {
  beforeAll((done) => {
    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      done();
    });
  });

  it('should get microservices for logged in user', (done) => {
    request.get({
      url: `${config.baseUrl}microservices`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should get microservice  getByOwner endpoint and return alll microservices for the admin and check access_token for each ms', (done) => {
    request.post({
      url: `${config.baseUrl}microservices-by-owner`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);

      let foundTokenforMS = false;
      response.body.data.forEach((microservice) => {
        if ({}.hasOwnProperty.call(microservice, 'access_token')) {
          foundTokenforMS = true;
        }
      });

      expect(foundTokenforMS).toBeTruthy();
      done();
    });
  });

  it('should get 404 in case when microservice with such id is not found', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/829b7796bb980b8f664f69f9b904051b`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('should create microservice with name Test Automation create 1', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceId = id;
      done();
    });
  });

  it('should create microservice with name Test Automation Maturity ', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_category,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceIdMaturity = id;
      done();
    });
  });

  it('should create microservice containing tags (name: MS containing tags)', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_tag,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceIdTag = id;
      done();
    });
  });

  it('should get microservice by id logged in user.', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      headers: { Authorization: token },
      json: { skip: 0, limit: 50 },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should update microservice  with new tag list (name: MS containing tags)', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      json: data.demoService_with_tag_update,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('should delete microservice with tags (name: MS containing tags)', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should return 404 when trying to update microservice which was already deleted', (done) => {
    const newAssetData = data.demoService_with_tag;
    newAssetData.reusability_level = 1;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(404);
      done();
    });
  });

  it('should create microservice containing restricted code', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_restricted_code,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceIdRestricted = id;

      done();
    });
  });

  it('should get microservice by id and return appropriate data for it.', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceIdRestricted}`,
      json: { skip: 0, limit: 50 },
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.name).toEqual('Test create MS restricted');
      done();
    });
  });

  it('should get microservice by id and check if microservice token is returned for logged in admin user.', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/integration-token/${microserviceIdRestricted}`,
      json: true,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(Object.keys(body.data).indexOf('access_token')).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should update microservice  with restricted description', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdRestricted}`,
      json: data.demoService_with_restricted_description,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should delete microservice with restricted code/description', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/${microserviceIdRestricted}`,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should update microservice with new name, tutorial and backlog fields for logged in admin user', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: data.demoService1,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('should get microservice with field "Backlog"', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: { skip: 0, limit: 50 },
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.backlog).toEqual('https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100');
      done();
    });
  });


  it('should update microservice, backlog fields ', (done) => {
    const service = data.demoService1;
    delete service.backlog;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: service,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should update microservice, change check_cpi to false', async (done) => {
    await portal.login();
    const service = data.demoService1;
    service.check_cpi = false;
    const msObjectResponse = await portal.updateMS(service, microserviceId);

    expect(msObjectResponse.code)
      .withContext('The server code should be 200')
      .toBe(200);
    done();
  });

  it('should update microservice, change check_cpi to true', async (done) => {
    await portal.login();
    const service = data.demoService1;
    service.check_cpi = true;
    const msObjectResponse = await portal.updateMS(service, microserviceId);

    expect(msObjectResponse.code)
      .withContext('The server code should be 200')
      .toBe(200);
    done();
  });

  it('should  fail to update microservice, with check_cpi as string', async (done) => {
    await portal.login();
    const service = data.demoService1;
    service.check_cpi = 'true';
    const msObjectResponse = await portal.updateMS(service, microserviceId);

    expect(msObjectResponse.code)
      .withContext('The server code should be 400')
      .toBe(400);
    done();
  });

  it('should get microservice, no backlog should be present on MS', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: { skip: 0, limit: 50 },
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.backlog).not.toBeDefined();
      done();
    });
  });


  it('should update microservice sucsessfully with new maturity status and category for logged in uadmin user', (done) => {
    const newAssetData = data.demoService_with_category;
    newAssetData.service_category = 2;
    newAssetData.service_maturity = 8;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);

      done();
    });
  });

  it('should update microservice as restricted field should not be present in case Service Maturity- RFCU ', (done) => {
    const newAssetData = data.demoService_with_category;
    newAssetData.service_category = 2;
    newAssetData.service_maturity = 7;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should fail to update microservice as restricted field is mandatory in case service maturity  RFNC', (done) => {
    const newAssetData = data.demoService_with_category;
    newAssetData.service_category = 2;
    newAssetData.service_maturity = 6;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should now be possible to update microservice with restricted field in case of Service Maturity- RFCU ', (done) => {
    const newAssetData = data.demoService_with_category;
    newAssetData.service_category = 2;
    newAssetData.service_maturity = 7;
    newAssetData.restricted = 3;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should update microservice sucsessfully with maturity status, category and restriction in case service maturity  RFNC', (done) => {
    const newAssetData = data.demoService_with_category;
    newAssetData.service_category = 2;
    newAssetData.service_maturity = 6;
    newAssetData.restricted = 3;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });


  it('should fail to update microservice as Git is mandatory in case service maturity - DS ', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: data.demoService1_updated,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should update microservice sucessfully as service maturity required Git information, service maturity - DS', (done) => {
    const newAssetData = data.demoService1_updated;
    newAssetData.giturl = 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/';
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should fail to update microservice as service maturity required Helm information, service maturity -RFI', (done) => {
    const newAssetData = data.demoService1_updated;
    newAssetData.giturl = 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/';
    newAssetData.service_maturity = 5;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('update microservice sucessfully as service maturity required Git and Helm information, service maturity -RFI', (done) => {
    const newAssetData = data.demoService1_updated;
    newAssetData.giturl = 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/';
    newAssetData.helmurl = 'https://arm.rnd.ki.sw.ericsson.se/artifactory/';
    newAssetData.helm_chartname = 'chart name';
    newAssetData.service_maturity = 5;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should  update  microservice  with Service Category ADP Aplication Specific Services and reusability level None', (done) => {
    const newAssetData = data.demoService1_updated;
    newAssetData.service_category = 4;
    newAssetData.reusability_level = 4;
    newAssetData.domain = 2;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should fail to update  microservice  with Service Category ADP Aplication Specific  Services and reusability level different from None', (done) => {
    const newAssetData = data.demoService1_updated;
    newAssetData.service_category = 4;
    newAssetData.reusability_level = 2;
    newAssetData.domain = 2;
    request.put({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should create microservice containing team mailer information', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_team_mails,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      const id = body && body.data && body.data.id;
      microserviceIdTeamMailer = id;
      done();
    });
  });

  it('should get microservice with team mailer information', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: { skip: 0, limit: 50 },
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(body.data.team_mailers).toEqual(['adpusers@ericsson.com']);
      done();
    });
  });

  it('should successfully  update  microservice  with team mailer information', (done) => {
    const newAssetData = data.demoService_with_team_mails;
    newAssetData.team_mailers = [
      'adpusers@ericsson.com',
      'adptest@ericsson.com',
    ];
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should fail to  update  microservice  with team mailer information which has incorrect format(adpusers@xyz)', (done) => {
    const newAssetData = data.demoService_with_team_mails;
    newAssetData.team_mailers = [
      'adpusers@xyz',
    ];
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should fail to  update  microservice  with team mailer information which has incorrect format(ericsson.com)', (done) => {
    const newAssetData = data.demoService_with_team_mails;
    newAssetData.team_mailers = [
      'ericsson.com',
    ];
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should fail to  update  microservice  with team mailer information which has incorrect team_mailers', (done) => {
    const newAssetData = data.demoService_with_team_mails;
    newAssetData.team_mailers = [
      'adpusers@ericsson.com',
      ':',
      'adptest@ericsson.com',
    ];
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should fail to  update  microservice  with team mailer information which has incorrect team_mailers(the same mailer repeated)', (done) => {
    const newAssetData = data.demoService_with_team_mails;
    newAssetData.team_mailers = [
      'adpusers@ericsson.com',
      'adpusers@ericsson.com',
    ];
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      json: newAssetData,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });


  it('should delete microservice with name Test MS team mailer', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/${microserviceIdTeamMailer}`,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should delete microservice with name Test Automation create 1', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/${microserviceId}`,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should delete microservice with name Test Automation Maturity', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/${microserviceIdMaturity}`,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should return 400 bad request due to validation errors', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService2,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should check name of microservice which already exist in DB, expected 403', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/checkname/Auto MS Min`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should check name of a deleted service should pass, expected 200', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/checkname/MS Deleted`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should check if menu_auto is true and check slug for the development document and additional category', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/auto-ms-test-3`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const docDevelopment = response.body.data.menu.auto.development;
      let foundDocumentSlug = false;
      docDevelopment.some((document) => {
        if (document.slug === 'sample-1' && document.category_slug === 'additional-documents') {
          foundDocumentSlug = true;
        }
      });

      expect(response.statusCode).toBe(200);
      expect(foundDocumentSlug).toBeTruthy();
      expect(body.data.menu_auto).toBe(true);
      done();
    });
  });

  it('should check if menu_auto is true and check slug for the development document and release documents category', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/auto-ms-test-3`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const docDevelopment = response.body.data.menu.auto.development;
      let foundDocumentSlug = false;
      docDevelopment.some((document) => {
        if (document.slug === 'product-revision-information-pri' && document.category_slug === 'release-documents') {
          foundDocumentSlug = true;
        }
      });

      expect(response.statusCode).toBe(200);
      expect(foundDocumentSlug).toBeTruthy();
      expect(body.data.menu_auto).toBe(true);
      done();
    });
  });


  it('should check if menu_auto is true and check version of the release document', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/auto-ms-test-3`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const docRelease = response.body.data.menu.auto.release;
      let foundReleaseVersion = false;
      docRelease.some((document) => {
        if (document.version === '1.0.1') {
          foundReleaseVersion = true;
        }
      });

      expect(response.statusCode).toBe(200);
      expect(foundReleaseVersion).toBeTruthy();
      expect(body.data.menu_auto).toBe(true);
      done();
    });
  });

  it('should check if menu_auto is true and check document slug and additional category of the release document', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/auto-ms-test-3`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const docRelease = response.body.data.menu.auto.release;
      let foundReleaseDocument = false;
      docRelease.some((versionObj) => {
        if (versionObj.version === '1.0.1') {
          versionObj.documents.some((document) => {
            if (document.slug === 'sample-2' && document.category_slug === 'additional-documents') {
              foundReleaseDocument = true;
            }
          });
        }
      });

      expect(response.statusCode).toBe(200);
      expect(foundReleaseDocument).toBeTruthy();
      expect(body.data.menu_auto).toBe(true);
      done();
    });
  });

  it('should check if menu_auto is true and check document slug and dpi category of the release document', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/auto-ms-test-3`,
      headers: { Authorization: token },
      json: true,
      strictSSL: false,
    },
    (error, response, body) => {
      const docRelease = response.body.data.menu.auto.release;
      let foundReleaseDocument = false;
      docRelease.some((versionObj) => {
        if (versionObj.version === '1.0.1') {
          versionObj.documents.some((document) => {
            if (document.slug === 'service-overview' && document.category_slug === 'dpi') {
              foundReleaseDocument = true;
            }
          });
        }
      });

      expect(response.statusCode).toBe(200);
      expect(foundReleaseDocument).toBeTruthy();
      expect(body.data.menu_auto).toBe(true);
      done();
    });
  });


  xit('should create microservice with mimer_version_starter field', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_mimer_version_starter,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      console.log(response.body.data)

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceIdMimer = id;
      done();
    });
  });

  xit('should create microservice with mimer_version_starter field', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService_with_mimer_version_starter,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response, body) => {
      const id = body && body.data && body.data.id ? body.data.id : undefined;

      expect(response.statusCode).toBe(200);
      expect(id).toBeDefined();

      microserviceIdMimer2 = id;
      done();
    });
  });

  xit('should update microservice  with new mimer_version_starter field', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMimer}`,
      json: data.demoService_with_tag_update,
      headers: { Authorization: token },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  xit('should update microservice  with new mimer_version_starter boolean, should fail', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/${microserviceIdMimer}`,
      json: data.demoService_with_mimer_version_update_fail,
      headers: { Authorization: token },
      strictSSL: false,
    },
   (error, response) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
});

describe('Basic tests for the microservice for not logged in user', () => {
  it('should return 404 for a microservice that is deleted.', (done) => {
    const getObject = {
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      headers: { Authorization: token },
      json: { skip: 0, limit: 50 },
      strictSSL: false,
    };

    request.get(getObject,
      (error, response) => {
        const debug = portal.answer({
          response: response.body,
          login: login.optionsAdmin,
          getObject,
        });

        expect(response.statusCode)
          .withContext(`The server code should be 404: ${debug}`)
          .toBe(404);

        done();
      });
  });

  it('should return 401 when tryin to get microservice token by id for not logged in user, ', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/integration-token/${microserviceIdTag}`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });

  it('should get a 401 error when trying to create microservice as access token is missing', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });


  it('should get a 401 error when trying to update microservice as access token is missing', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/24908ff7c64e3450b90d97264700ed18`,
      json: data.demoService,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });
});


describe('Basic tests for the microservice for test user', () => {
  beforeAll((done) => {
    request.post(login.optionsTest, (error, response, body) => {
      tokenTest += login.callback(error, response, body);
      done();
    });
  });

  it('should get a 403 Forbidden error when trying to delete microservice as access token is missing', (done) => {
    request.del({
      url: `${config.baseUrl}microservice/3dafa64333031d4bb16a7e593700d687`,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should get a 403 Forbidden when trying to update microservice for the test user', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/3dafa64333031d4bb16a7e593700d687`,
      json: data.demoService,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(403);
      done();
    });
  });

  it('should create microservice with name Test Automation create test user 1', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService3,
      headers: { Authorization: tokenTest },
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should return 401 when tryin to get microservice token by id for user which does not have access', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/integration-token/${microserviceIdTag}`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });
});


describe('Basic tests for the microservice for not logged in user (2)', () => {
  it('should return 404 for a microservice that is deleted. (2)', (done) => {
    const getObject = {
      url: `${config.baseUrl}microservice/${microserviceIdTag}`,
      headers: { Authorization: token },
      json: { skip: 0, limit: 50 },
      strictSSL: false,
    };

    request.get(getObject,
      (error, response) => {
        const debug = portal.answer({
          response: response.body,
          login: login.optionsAdmin,
          getObject,
        });

        expect(response.statusCode)
          .withContext(`The server code should be 404: ${debug}`)
          .toBe(404);
        done();
      });
  });

  it('should return 401 when tryin to get microservice token by id for not logged in user, (2)', (done) => {
    request.get({
      url: `${config.baseUrl}microservice/integration-token/${microserviceIdTag}`,
      json: true,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });

  it('should get a 401 error when trying to create microservice as access token is missing (2)', (done) => {
    request.post({
      url: `${config.baseUrl}microservice`,
      json: data.demoService,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });


  it('should get a 401 error when trying to update microservice as access token is missing (2)', (done) => {
    request.put({
      url: `${config.baseUrl}microservice/24908ff7c64e3450b90d97264700ed18`,
      json: data.demoService,
      strictSSL: false,
    },
    (error, response) => {
      expect(response.statusCode).toBe(401);
      done();
    });
  });
});

describe('Basic tests for the microservice RBAC', () => {
  describe('for Etasase admin user in No Perm Group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEtasase);
    });

    it('should get 200 when trying to access MS with User in No Perm Group who is admin', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-min');

      expect(msObjectResponse.code).toBe(200);
      done();
    });

    it('should get 404 when trying to access deleted MS with User in No Perm Group who is admin', async (done) => {
      const msObjectResponse = await portal.getMS('ms-deleted');

      expect(msObjectResponse.code).toBe(404);
      done();
    });
  });

  describe('for Etarase user in No Perm Group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEtarase);
    });

    it('should get 403 when trying to access MS with User in No Perm Group', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-min');

      expect(msObjectResponse.code).toBe(403);
      done();
    });

    it('should get 404 when trying to access deleted MS with User in No Perm Group', async (done) => {
      const msObjectResponse = await portal.getMS('ms-deleted');

      expect(msObjectResponse.code).toBe(404);
      done();
    });
  });

  describe('for Etesuse user in Internal Users Group', () => {
    beforeAll(async () => {
      await portal.loginTest();
    });

    it('should get 200 when trying to access MS with User in Internal Users Group', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-min');

      expect(msObjectResponse.code).toBe(200);
      done();
    });

    it('should get 200 when trying to access MS with User in Internal Users Group (2)', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-max');

      expect(msObjectResponse.code).toBe(200);
      done();
    });
  });

  describe('for Epesuse user in static group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEpesuse);
    });

    it('should get 200 when trying to access MS with User in static group, asset belongs to that group', async (done) => {
      const msObjectResponse = await portal.getMS('document-refresh-warnings-test');

      expect(msObjectResponse.code).toBe(200);
      done();
    });

    it('should get 404 when trying to access deleted MS with User in static group', async (done) => {
      const msObjectResponse = await portal.getMS('ms-deleted');

      expect(msObjectResponse.code).toBe(404);
      done();
    });

    it('should get 403 when trying to access MS with User in static group, asset outside of the group', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-max');

      expect(msObjectResponse.code).toBe(403);
      done();
    });
  });

  describe('for Etesuse2 user in dynamic group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEtesuse2);
    });

    it('should get 200 when trying to access MS with User in static group, asset belongs to that group (2)', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-max');

      expect(msObjectResponse.code).toBe(200);
      done();
    });

    it('should get 404 when trying to access deleted MS with User in static group (2)', async (done) => {
      const msObjectResponse = await portal.getMS('ms-deleted');

      expect(msObjectResponse.code).toBe(404);
      done();
    });

    it('should get 403 when trying to access MS with User in static group, asset in exception', async (done) => {
      const msObjectResponse = await portal.getMS('document-refresh-warnings-test');

      expect(msObjectResponse.code).toBe(403);
      done();
    });

    it('should get 200 when trying to access MS with User in static group, user is service owner of the MS', async (done) => {
      const msObjectResponse = await portal.getMS('auto-ms-min');

      expect(msObjectResponse.code).toBe(200);
      done();
    });
  });
});

describe('Response header check', () => {
  beforeAll(async () => {
    await portal.loginTest();
  });

  it('Response header should contain information about alertbanner', async () => {
    const response = await portal.getMS('auto-ms-min');

    const { alertbanner } = response.headers;
    const alertbannerStr = JSON.parse(JSON.stringify(alertbanner));
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'microservice'),
      },
      response,
    });

    expect(response.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(alertbannerStr)
      .withContext(`response Header should contain "isEnabled":true: ${debug}`)
      .toContain('"isEnabled":true');

    expect(alertbannerStr)
      .withContext(`response Header should contain "key":"alertbanner": ${debug}`)
      .toContain('"key":"alertbanner"');
  });
});

describe('Tests to check CPI flag logic', () => {
  beforeAll(async () => {
    await portal.login();
  });

  it('Create microservice with CPI flag=true on MS level and CPI flag=undefined on version level', async () => {
    const msData = data.demoService_CPI_undefined;
    await portal.createMS(msData);

    const msObjectResponse = await portal.getMS('test-ms-cpi-undefined');

    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 3.2.1')
      .toBe('3.2.1');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value true')
      .toBe(true);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to true')
      .toBe(false);
  });

  it('Create microservice with CPI flag=true on MS level and CPI flag=true on version level', async () => {
    const msData = data.demoService_CPI_positive;
    await portal.createMS(msData);

    const msObjectResponse = await portal.getMS('test-ms-cpi');

    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 3.2.1')
      .toBe('3.2.1');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS sould have value true')
      .toBe(true);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to true')
      .toBe(true);
  });

  it('Update microservice with CPI flag=true on MS level and CPI flag=undefined on version level, check if date_modified is updated', async () => {
    const msData = data.demoService_CPI_positive_update;
    msData.check_cpi = true;
    delete msData.menu.manual.release[0].is_cpi_updated;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const dateModified = microserviceResponseCPI.body.data.date_modified;

    let dateModifiedIsUpdated = false;

    if ((new Date(dateModified).getTime() > new Date('2019-08-16T10:44:48.559Z').getTime())) {
      dateModifiedIsUpdated = true;
    }

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(dateModifiedIsUpdated)
      .withContext('date modified should be updated')
      .toBeTruthy();

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS sould have value true')
      .toBe(true);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to false')
      .toBe(false);
  });


  it('Update microservice with CPI flag=false on MS level and CPI flag=undefined on version level', async () => {
    const msData = data.demoService_CPI_positive_update;
    msData.check_cpi = false;
    delete msData.menu.manual.release[0].is_cpi_updated;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value true')
      .toBe(false);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to false')
      .toBe(false);
  });

  it('Update microservice with CPI flag=true on MS level and CPI flag=false on version level', async () => {
    const msData = data.demoService_CPI_positive_update;
    msData.check_cpi = true;
    msData.menu.manual.release[0].is_cpi_updated = false;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value true')
      .toBe(true);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be set to false')
      .toBe(false);
  });

  it('Update microservice with CPI flag=true on MS level, check development version does not have CPI', async () => {
    const msData = data.demoService_CPI_positive_update;
    delete msData.menu.manual.release[0].is_cpi_updated;
    msData.check_cpi = true;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msDevDocData = msObjectResponse.body.data.menu.manual.development;
    const devVersion = msDevDocData[0];

    expect(devVersion.is_cpi_updated)
      .withContext('CPI flag for the version should be undefined')
      .toBe(undefined);


    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS sould have value true')
      .toBe(true);
  });


  it('Update microservice with CPI flag=false on MS level and no CPI on version level', async () => {
    const msData = data.demoService_CPI_positive_update;
    delete msData.menu.manual.release[0].is_cpi_updated;
    msData.check_cpi = false;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value false')
      .toBe(false);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be undefined')
      .toBe(false);
  });

  it('Update microservice with CPI flag=false on MS level and CPI=true on version level', async () => {
    const msData = data.demoService_CPI_positive_update;
    msData.menu.manual.release[0].is_cpi_updated = true;
    msData.check_cpi = false;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value false')
      .toBe(false);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be undefined')
      .toBe(true);
  });

  it('Update microservice with not existing CPI flag on MS level and CPI=true on version level', async () => {
    const msData = data.demoService_CPI_positive_update;
    msData.menu.manual.release[0].is_cpi_updated = true;
    delete msData.check_cpi;
    const microserviceID = await portal.readMicroserviceId('auto-ms-test-cpi');

    const microserviceResponseCPI = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseCPI.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-test-cpi');
    const msReleaseDocData = msObjectResponse.body.data.menu.manual.release;
    const firstVer = msReleaseDocData[0];

    expect(firstVer.version)
      .withContext('Version of the documents should be 2.0.0')
      .toBe('2.0.0');

    expect(msObjectResponse.body.data.check_cpi)
      .withContext('CPI flag for the MS should have value true')
      .toBe(false);

    expect(firstVer.is_cpi_updated)
      .withContext('CPI flag for the version should be undefined')
      .toBe(true);
  });

  it('Should fail to create Microservice with CPI flag=true on MS level and category =', async () => {
    const msData = data.demoService_CPI_category_negative;

    const microserviceID = await portal.createMS(msData);

    expect(microserviceID)
      .withContext('should not create MS')
      .toBeDefined();
  });
});

describe('Tests to check Additional information section on MS', () => {
  beforeAll(async () => {
    await portal.login();
  });

  it('Create MS with additional information section and check if additional info is created using MS get', async () => {
    const msData = data.demoServiceAddInfo;
    const microserviceID = await portal.createMS(msData);

    expect(microserviceID)
      .withContext('should create MS')
      .toBeDefined();

    const msObjectResponse = await portal.getMS('auto-ms-add-info-create');


    const tutorialinfoFound = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information.some(section => section.category === 'tutorial')
      : null;

    expect(tutorialinfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    const demoInfoFound = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information.some(section => section.category === 'demo')
      : null;

    expect(demoInfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    const theInfos = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information
      : [];

    expect(theInfos.length)
      .withContext(`The additional info length should be 2, got ${theInfos.length}: ${msObjectResponse}`)
      .toEqual(2);

    const theInfosCode = msObjectResponse
    && msObjectResponse.code
      ? msObjectResponse.code
      : null;

    expect(theInfosCode)
      .withContext(`The code should be 200, got ${theInfosCode}: ${msObjectResponse}`)
      .toBe(200);
  });

  it('Update MS with additional information section and check if additional info is updated using MS get', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-add-info');

    const tutorialinfoFound = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information.some(section => section.category === 'tutorial' && section.title === 'My First ADP Service')
      : null;

    expect(tutorialinfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    const theInfos = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information
      : [];

    expect(theInfos.length)
      .withContext(`The additional info length should be 1, got ${theInfos.length}: ${msObjectResponse}`)
      .toEqual(1);

    const theInfosCode = msObjectResponse
    && msObjectResponse.code
      ? msObjectResponse.code
      : null;

    expect(theInfosCode)
      .withContext(`The code should be 200, got ${theInfosCode}: ${msObjectResponse}`)
      .toBe(200);
  });

  it('Update MS with additional informations section and check if additional info is updated using MS get', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
      {
        category: 'demo',
        title: 'Test title for the Demo',
        link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-add-info');

    const tutorialinfoFound = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information.some(section => section.category === 'tutorial')
      : null;

    expect(tutorialinfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    const demoInfoFound = msObjectResponse
      && msObjectResponse.body
      && msObjectResponse.body.data
      && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information.some(section => section.category === 'demo')
      : null;

    expect(demoInfoFound)
      .withContext(`The return should be Truthy: ${msObjectResponse}`)
      .toBeTruthy();

    const theInfos = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information
      : [];

    expect(theInfos.length)
      .withContext(`The additional info length should be 2, got ${theInfos.length}: ${msObjectResponse}`)
      .toEqual(2);

    const theInfosCode = msObjectResponse
    && msObjectResponse.code
      ? msObjectResponse.code
      : null;

    expect(theInfosCode)
      .withContext(`The code should be 200, got ${theInfosCode}: ${msObjectResponse}`)
      .toBe(200);
  });

  it('Update MS with additional  2 the same type informations section and check if additional info is updated using MS get', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
      {
        category: 'demo',
        title: 'Test title for the Demo',
        link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
      },
      {
        category: 'tutorial',
        title: 'My First ADP Service 2',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service-2',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 200')
      .toBe(200);

    const msObjectResponse = await portal.getMS('auto-ms-add-info');

    const theInfos = msObjectResponse
    && msObjectResponse.body
    && msObjectResponse.body.data
    && msObjectResponse.body.data.additional_information
      ? msObjectResponse.body.data.additional_information
      : [];

    expect(theInfos.length)
      .withContext(`The additional info length should be 3, got ${theInfos.length}: ${msObjectResponse}`)
      .toEqual(3);

    const theInfosCode = msObjectResponse
    && msObjectResponse.code
      ? msObjectResponse.code
      : null;

    expect(theInfosCode)
      .withContext(`The code should be 200, got ${theInfosCode}: ${msObjectResponse}`)
      .toBe(200);
  });

  it('Should fail to update MS without link field for Additional Information section', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 400')
      .toBe(400);
  });

  it('Should fail to update MS without category field for Additional Information section', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 400')
      .toBe(400);
  });

  it('Should fail to update MS without title field for Additional Information section', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 400')
      .toBe(400);
  });

  it('Should fail to update MS with empty title field for Additional Information section', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: '',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 400')
      .toBe(400);
  });

  it('Should fail to update MS with empty link field for Additional Information section', async () => {
    const msData = data.demoServiceAddInfo1;
    msData.additional_information = [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: '',
      },
    ];
    const microserviceID = await portal.readMicroserviceId('auto-ms-add-info');

    const microserviceResponseAddInfo = await portal.updateMS(msData, microserviceID);

    expect(microserviceResponseAddInfo.code)
      .withContext('server code should be 400')
      .toBe(400);
  });
});

describe('Testing "optimized=Overview" parameter', () => {
  it('Testing if the original microservice object is complete after the use of the parameter.', async (done) => {
    const MSID = '45e7f4f992afe7bbb62a3391e500ffb1'; // slug: auto-ms-max

    await portal.login();

    const microserviceWithParameter = await portal.getMS(`${MSID}?optimized=overview`);
    const msObjectWithParam = microserviceWithParameter
      && microserviceWithParameter.body
      && microserviceWithParameter.body.data
      ? microserviceWithParameter.body.data
      : { menu: 'something' };

    const microserviceWithoutParameter = await portal.getMS(MSID);
    const msObjectWithoutParam = microserviceWithoutParameter
      && microserviceWithoutParameter.body
      && microserviceWithoutParameter.body.data
      ? microserviceWithoutParameter.body.data
      : {};

    expect(msObjectWithParam.menu)
      .withContext(`This Asset Object should not contain menu object. Got: \r${JSON.stringify(msObjectWithParam, null, 2)}`)
      .toBeUndefined();

    expect(msObjectWithoutParam.menu)
      .withContext(`This Asset Object should contain menu object. Got: \r${JSON.stringify(msObjectWithoutParam, null, 2)}`)
      .toBeDefined();

    done();
  });
});
