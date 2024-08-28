
/**
* Testing reports for the assets(microservices) in Json format
* @author Ludmila Omelchenko
*/
const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const login = require('../endpoints/login.js');

const portal = new PortalPrivateAPI();


describe('Testing reports for the assets(microservices) in Json format', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Testing report generation for 3 microservice passed to the report endpoint', async (done) => {
    const microserviceIDRestricted = await portal.readMicroserviceId('auto-ms-restricted');
    const microserviceIDManualDocs = await portal.readMicroserviceId('adp-manual-doc-menu-with-versions');
    const microserviceIDmsMax = await portal.readMicroserviceId('auto-ms-max');
    const assets = [
      { _id: microserviceIDRestricted },
      { _id: microserviceIDManualDocs },
      { _id: microserviceIDmsMax },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let foundMicroserviceAutoMSmax = false;
    responseReport.body.data.data_overview.forEach((overviewAsset) => {
      if (overviewAsset.name === 'Auto MS max') {
        foundMicroserviceAutoMSmax = true;
      }
    });

    let foundMicroserviceAutoMSRestricted = false;
    responseReport.body.data.data_overview.forEach((overviewAsset) => {
      if (overviewAsset.name === 'Auto MS Restricted') {
        foundMicroserviceAutoMSRestricted = true;
      }
    });

    expect(foundMicroserviceAutoMSmax).toBeTruthy();
    expect(foundMicroserviceAutoMSRestricted).toBeTruthy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should generate xlsx report for 3 microservice\'s.', async (done) => {
    const assets = [
      { _id: await portal.readMicroserviceId('auto-ms-restricted') },
      { _id: await portal.readMicroserviceId('adp-manual-doc-menu-with-versions') },
      { _id: await portal.readMicroserviceId('auto-ms-max') },
    ];

    const result = await portal.reportAssetsXlsx({ assets });

    expect(result.code).toBe(200);

    expect(result.headers['content-type'])
      .withContext('Expected the header content-type to contain spreadsheetml.sheet')
      .toContain('spreadsheetml.sheet');

    expect(result.headers['content-disposition'])
      .withContext('Expected the header content-disposition to contain adpmarketplace_')
      .toContain('adpmarketplace_');

    done();
  });

  it('Should check 4 sections(overview, compliance, documentation, team, additional information) with data avaliable for the Microservice with max data', async (done) => {
    const microserviceIDmsMax = await portal.readMicroserviceId('auto-ms-with-docs');
    const assets = [
      { _id: microserviceIDmsMax },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let foundMicroserviceAutoMSmaxOverview = false;
    responseReport.body.data.data_overview.forEach((serviceOverview) => {
      if (serviceOverview.name === 'Auto MS with Docs') {
        foundMicroserviceAutoMSmaxOverview = true;
      }
    });
    let foundMicroserviceAutoMSmaxDocumentation = false;
    responseReport.body.data.data_documentation.forEach((serviceDocumentation) => {
      if (serviceDocumentation.service_name === 'Auto MS with Docs') {
        foundMicroserviceAutoMSmaxDocumentation = true;
      }
    });
    let foundMicroserviceAutoMSmaxCompliance = false;
    responseReport.body.data.data_compliance.forEach((serviceCompliance) => {
      if (serviceCompliance.service_name === 'Auto MS with Docs') {
        foundMicroserviceAutoMSmaxCompliance = true;
      }
    });
    let foundMicroserviceAutoMSmaxTeams = false;
    responseReport.body.data.data_team.forEach((serviceTeams) => {
      if (serviceTeams.service_name === 'Auto MS with Docs') {
        foundMicroserviceAutoMSmaxTeams = true;
      }
    });
    let foundMicroserviceAutoMSmaxAddInfo = false;
    responseReport.body.data.data_additional_information.forEach((serviceAdditionalInformation) => {
      if (serviceAdditionalInformation.service_name === 'Auto MS with Docs') {
        foundMicroserviceAutoMSmaxAddInfo = true;
      }
    });

    expect(foundMicroserviceAutoMSmaxOverview).toBeTruthy();
    expect(foundMicroserviceAutoMSmaxDocumentation).toBeTruthy();
    expect(foundMicroserviceAutoMSmaxCompliance).toBeTruthy();
    expect(foundMicroserviceAutoMSmaxTeams).toBeTruthy();
    expect(foundMicroserviceAutoMSmaxAddInfo).toBeTruthy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check  if no documentation is avaliable for the Microservice, no data_documentation object for this MS is generated', async (done) => {
    const microserviceIDmsMin = await portal.readMicroserviceId('auto-ms-min');
    const assets = [
      { _id: microserviceIDmsMin },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let foundMicroserviceAutoMSminDocumentation = false;
    responseReport.body.data.data_documentation.forEach((serviceOverview) => {
      if (serviceOverview.name === 'Auto MS Min') {
        foundMicroserviceAutoMSminDocumentation = true;
      }
    });

    expect(foundMicroserviceAutoMSminDocumentation).toBeFalsy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check  if no additional information is avaliable for the Microservice, no data_additional_documentation object for this MS is generated', async (done) => {
    const microserviceIDmsMin = await portal.readMicroserviceId('auto-ms-min');
    const assets = [
      { _id: microserviceIDmsMin },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let foundMicroserviceAutoMSminDocumentation = false;
    responseReport.body.data.data_additional_information.forEach((serviceAddInfo) => {
      if (serviceAddInfo.name === 'Auto MS Min') {
        foundMicroserviceAutoMSminDocumentation = true;
      }
    });

    expect(foundMicroserviceAutoMSminDocumentation).toBeFalsy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check  if no compliance is avaliable for the Microservice, data_compliance object for this MS is generated', async (done) => {
    const microserviceIDmsMin = await portal.readMicroserviceId('auto-ms-min');
    const assets = [
      { _id: microserviceIDmsMin },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let foundMicroserviceAutoMSminDocumentation = false;
    responseReport.body.data.data_compliance.forEach((serviceOverview) => {
      if (serviceOverview.service_name === 'Auto MS Min') {
        foundMicroserviceAutoMSminDocumentation = true;
      }
    });

    expect(foundMicroserviceAutoMSminDocumentation).toBeTruthy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check overview fields generated in report for the microservice', async (done) => {
    const overviewExpected = {
      name: 'Auto MS max',
      description: 'This is a service containing maximum data',
      check_cpi: 'Yes',
      tags: 'TagFour',
      restricted: 'Other',
      restricted_description: 'Reason to be Restricted',
      product_number: 'APR20131',
      mimer_version_starter: '4.1.0',
      reusability_level: 'None',
      service_category: 'ADP Reusable Services',
      report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
      request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
      domain: 'COS',
      based_on: 'Test 3PP',
      serviceArea: 'Messaging',
      service_maturity: 'Ready for Non-Commercial Use',
      helm_chartname: 'eric-lcm-container-registry',
      discussion_forum_link: '',
      backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
      team_mailers: 'adpusers@ericsson.com, adpusers2@ericsson.com',
      date_modified: '2018-05-15T10:32:27.067Z',
      date_created: '2019-06-15T10:32:27.067Z',
    };
    const microserviceIDmsMax = await portal.readMicroserviceId('auto-ms-max');
    const assets = [
      { _id: microserviceIDmsMax },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let overviewAutoMSmax = responseReport.body.data.data_overview.filter(serviceOverview => serviceOverview.name === 'Auto MS max');
    overviewAutoMSmax = JSON.parse(JSON.stringify(overviewAutoMSmax[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(overviewAutoMSmax)
      .withContext('Should contain  expected Overview fields woth values in report')
      .toEqual(jasmine.objectContaining(overviewExpected));
    done();
  });

  it('Should check  CPI field as no generated in report', async (done) => {
    const overviewExpected = {
      name: 'Auto MS max for Report',
      check_cpi: 'No',
    };
    const microserviceIDmsMax = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMax },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let overviewAutoMSmax = responseReport.body.data.data_overview.filter(serviceOverview => serviceOverview.name === 'Auto MS max for Report');
    overviewAutoMSmax = JSON.parse(JSON.stringify(overviewAutoMSmax[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toEqual(200);

    expect(overviewAutoMSmax)
      .withContext('Should contain check_cpi as No')
      .toEqual(jasmine.objectContaining(overviewExpected));
    done();
  });

  it('Should check  CPI field is generated in report on Documentation level as CPI has been updated', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS Test CPI Report',
      version: '2.0.0',
      category: 'Developer Product Information',
      name: 'Service Overview',
      url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
      menu_auto: 'Manual',
      repo_urls_development: '',
      repo_urls_release: '',
      restricted: 'No',
      default: 'No',
      isCpiUpdated: 'Yes',
    };

    const microserviceIDMSwithDocs = await portal.readMicroserviceId('auto-ms-test-cpi-report');
    const assets = [
      { _id: microserviceIDMSwithDocs },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithDocs = responseReport.body.data.data_documentation.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS Test CPI Report' && serviceDocumentation.name === 'Service Overview' && serviceDocumentation.version === '2.0.0');
    documentationMSwithDocs = JSON.parse(JSON.stringify(documentationMSwithDocs[0]));


    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(documentationMSwithDocs)
      .withContext('Documentation object should match expected one in report')
      .toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check  CPI field is generated in report on Documentation level as CPI has not been updated', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS Test CPI Report',
      version: '1.0.0',
      category: 'Developer Product Information',
      name: 'Service Overview',
      url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
      menu_auto: 'Manual',
      repo_urls_development: '',
      repo_urls_release: '',
      restricted: 'No',
      default: 'No',
      isCpiUpdated: 'No',
    };

    const microserviceIDMSwithDocs = await portal.readMicroserviceId('auto-ms-test-cpi-report');
    const assets = [
      { _id: microserviceIDMSwithDocs },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithDocs = responseReport.body.data.data_documentation.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS Test CPI Report' && serviceDocumentation.name === 'Service Overview' && serviceDocumentation.version === '1.0.0');
    documentationMSwithDocs = JSON.parse(JSON.stringify(documentationMSwithDocs[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(documentationMSwithDocs)
      .withContext('Documentation object should match expected one in report')
      .toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check  CPI field is not generated in report on Documentation level as MS leve CPI=false', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS Test No CPI Report',
      version: '1.0.0',
      category: 'Developer Product Information',
      name: 'Service Overview',
      url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
      menu_auto: 'Manual',
      repo_urls_development: '',
      repo_urls_release: '',
      restricted: 'No',
      default: 'No',
    };

    const microserviceIDMSwithDocs = await portal.readMicroserviceId('auto-ms-test-no-cpi-report');
    const assets = [
      { _id: microserviceIDMSwithDocs },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithDocs = responseReport.body.data.data_documentation.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS Test No CPI Report' && serviceDocumentation.name === 'Service Overview' && serviceDocumentation.version === '1.0.0');
    documentationMSwithDocs = JSON.parse(JSON.stringify(documentationMSwithDocs[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(documentationMSwithDocs)
      .withContext('Documentation object should match expected one in report')
      .toEqual(jasmine.objectContaining(documetationExpected));

    done();
  });

  it('Should check documentation information for the microservice  generated in report(manual mode)', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS with Docs',
      version: 'In Development',
      category: 'Developer Product Information',
      name: 'Service Deployment Guide',
      url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
      menu_auto: 'Manual',
      repo_urls_development: '',
      repo_urls_release: '',
      restricted: 'No',
      default: 'No',
    };

    const microserviceIDMSwithDocs = await portal.readMicroserviceId('auto-ms-with-docs');
    const assets = [
      { _id: microserviceIDMSwithDocs },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithDocs = responseReport.body.data.data_documentation.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS with Docs' && serviceDocumentation.name === 'Service Deployment Guide');
    documentationMSwithDocs = JSON.parse(JSON.stringify(documentationMSwithDocs[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationMSwithDocs).toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check additional information for the microservice  generated in report', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS with Docs',
      category: 'tutorial',
      title: 'My First ADP Service',
      link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
    };

    const microserviceIDMSwithDocs = await portal.readMicroserviceId('auto-ms-with-docs');
    const assets = [
      { _id: microserviceIDMSwithDocs },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithDocs = responseReport.body.data.data_additional_information.filter(serviceAddInfo => serviceAddInfo.service_name === 'Auto MS with Docs' && serviceAddInfo.title === 'My First ADP Service');
    documentationMSwithDocs = JSON.parse(JSON.stringify(documentationMSwithDocs[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationMSwithDocs).toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check documentation information for the microservice with relative path for documentation generated in report(auto mode) ', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS with Multiple Doc Types AutoMode',
      version: 'formattest',
      category: 'Additional Documents',
      name: 'Relative Html',
      url: 'https://arm.seli.gic.ericsson.se/artifactory/docker-v2-global-local/aia/adp/test/formatTest/document/document.html',
      restricted: 'No',
      default: 'No',
      menu_auto: 'Automated',
      repo_urls_development: '',
      repo_urls_release: 'https://arm.seli.gic.ericsson.se/artifactory/docker-v2-global-local/aia/adp/test/formatTest',
    };

    const microserviceIDMSwithMultipleDocsAuto = await portal.readMicroserviceId('auto-ms-with-multiple-doc-types-automode');
    const assets = [
      { _id: microserviceIDMSwithMultipleDocsAuto },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithMultipleDocsAuto = responseReport.body.data.data_documentation;
    documentationMSwithMultipleDocsAuto = documentationMSwithMultipleDocsAuto.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS with Multiple Doc Types AutoMode' && serviceDocumentation.name === 'Relative Html');
    documentationMSwithMultipleDocsAuto = JSON.parse(JSON
      .stringify(documentationMSwithMultipleDocsAuto[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationMSwithMultipleDocsAuto)
      .toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check documentation information for the microservice  generated in report(auto mode) with restricted and default document', async (done) => {
    const documetationExpected = {
      service_name: 'Auto MS with Multiple Doc Types AutoMode',
      version: 'formattest',
      category: 'Additional Documents',
      name: 'Relative Html',
      url: 'https://arm.seli.gic.ericsson.se/artifactory/docker-v2-global-local/aia/adp/test/formatTest/document/document.html',
      menu_auto: 'Automated',
      repo_urls_development: '',
      repo_urls_release: 'https://arm.seli.gic.ericsson.se/artifactory/docker-v2-global-local/aia/adp/test/formatTest',
      restricted: 'No',
      default: 'No',
    };

    const microserviceIDMSwithMultipleDocsAuto = await portal.readMicroserviceId('auto-ms-with-multiple-doc-types-automode');
    const assets = [
      { _id: microserviceIDMSwithMultipleDocsAuto },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let documentationMSwithMultipleDocsAuto = responseReport.body.data.data_documentation;
    documentationMSwithMultipleDocsAuto = documentationMSwithMultipleDocsAuto.filter(serviceDocumentation => serviceDocumentation.service_name === 'Auto MS with Multiple Doc Types AutoMode' && serviceDocumentation.name === 'Relative Html');
    documentationMSwithMultipleDocsAuto = JSON.parse(JSON
      .stringify(documentationMSwithMultipleDocsAuto[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationMSwithMultipleDocsAuto)
      .toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });


  it('Should check compliance fields generated in report for the microservice', async (done) => {
    const complianceExpected = {
      service_name: 'Auto MS max for Report',
      group: 'Integration',
      name: 'Logging',
      description: 'This service supports Logging according to the ADP Logging Functional Area',
      status: 'No',
      comment: 'Test Comment 8',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let complianceAutoMSmaxforReport = responseReport.body.data.data_compliance.filter(serviceCompliance => serviceCompliance.service_name === 'Auto MS max for Report' && serviceCompliance.name === 'Logging');
    complianceAutoMSmaxforReport = JSON.parse(JSON.stringify(complianceAutoMSmaxforReport[0]));

    expect(responseReport.code).toBe(200);
    expect(complianceAutoMSmaxforReport).toEqual(jasmine.objectContaining(complianceExpected));
    done();
  });

  it('Should check team fields generated in report for the microservice', async (done) => {
    const teamExpected = {
      service_name: 'Auto MS max for Report',
      name: 'Super User',
      email: 'super-user@adp-test.com',
      signum: 'esupuse',
      team_role: 'PO',
      serviceOwner: 'Yes',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let teamAutoMSmaxforReport = responseReport.body.data.data_team.filter(serviceOverview => serviceOverview.service_name === 'Auto MS max for Report' && serviceOverview.signum === 'esupuse');
    teamAutoMSmaxforReport = JSON.parse(JSON.stringify(teamAutoMSmaxforReport[0]));

    expect(responseReport.code).toBe(200);
    expect(teamAutoMSmaxforReport).toEqual(jasmine.objectContaining(teamExpected));
    done();
  });

  it('Should check contributors fields and values generated in report per microservice for Super User', async (done) => {
    const contributorsExpected = {
      service_name: 'Auto MS Test Innersource',
      user_name: 'Super User',
      commits: 1,
      insertions: 20,
      deletions: 0,
    };

    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let contributorsAutoMSinnersource = responseReport.body.data.data_contributors.filter(contributors => contributors.service_name === 'Auto MS Test Innersource' && contributors.user_name === 'Super User');
    contributorsAutoMSinnersource = JSON.parse(JSON.stringify(contributorsAutoMSinnersource[0]));

    expect(responseReport.code).toBe(200);
    expect(contributorsAutoMSinnersource).toEqual(jasmine.objectContaining(contributorsExpected));
    done();
  });

  it('Should check contributors fields and values generated in report per microservice for Test User', async (done) => {
    const contributorsExpected = {
      service_name: 'Auto MS Test Innersource',
      user_name: 'Test User',
      commits: 3,
      insertions: 20,
      deletions: 20,
    };

    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let contributorsAutoMSinnersource = responseReport.body.data.data_contributors.filter(contributors => contributors.service_name === 'Auto MS Test Innersource' && contributors.user_name === 'Test User');
    contributorsAutoMSinnersource = JSON.parse(JSON.stringify(contributorsAutoMSinnersource[0]));

    expect(responseReport.code).toBe(200);
    expect(contributorsAutoMSinnersource).toEqual(jasmine.objectContaining(contributorsExpected));
    done();
  });

  it('Should check organisation and OU fields values generated in report for service auto-ms-test-innersource', async (done) => {
    const testUsers = {
      'Apase User': {
        organisation: 'BDGS SA OSS PDU OSS',
        ou: 'BDGS SA OSS PDU OSS PDG EEA BUD Dev 3',
      },
      'Super User': {
        organisation: 'BDGS SA PC PDG',
        ou: 'BDGS SA PC PDG IPW&POL CCRC Unit 1',
      },
      'Sase User': {
        organisation: 'BDGS RDPS CD',
        ou: 'BDGS RDPS CD GS Dev LMF',
      },
      'Test User2': {
        organisation: 'BDGS RAN1',
        ou: 'BDGS RAN1 RAN2 RAN3 RAN4',
      },
      'Pest User': {
        organisation: 'BNEW DNEW CDS',
        ou: 'BNEW DNEW CDS TCI CI Cont Integr',
      },
      'Asase User': {
        organisation: 'BNEW GSU',
        ou: 'BNEW GSU CN PIM Test Tech Team F',
      },
      'Arase User': {
        organisation: 'RAN0 RAN1',
        ou: 'RAN0 RAN1 RAN2 RAN3 RAN4',
      },
      'Test User': {
        organisation: '',
        ou: '',
      },
    };
    const contritbutorNameArr = Object.keys(testUsers);


    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    const resultContributors = {};
    responseReport.body.data.data_contributors.forEach((contributors) => {
      if (contributors.service_name === 'Auto MS Test Innersource' && contritbutorNameArr.includes(contributors.user_name)) {
        resultContributors[contributors.user_name] = { ...contributors };
      }
    });

    expect(responseReport.code).toBe(200);
    const passedAll = contritbutorNameArr.every((testUser) => {
      const testObj = testUsers[testUser];
      const resultObj = resultContributors[testUser];
      return (testObj.organisation === resultObj.organisation && testObj.ou === resultObj.ou);
    });

    expect(passedAll).toBeTruthy();
    done();
  });


  it('Should check if no contributors information is avaliable for the Microservice, no data_contributors object for this MS is generated', async (done) => {
    const microserviceIDmsMin = await portal.readMicroserviceId('auto-ms-min');
    const assets = [
      { _id: microserviceIDmsMin },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let foundMicroserviceAutoMSminContributors = false;
    responseReport.body.data.data_contributors.forEach((contributors) => {
      if (contributors.service_name === 'Auto MS Min') {
        foundMicroserviceAutoMSminContributors = true;
      }
    });

    expect(foundMicroserviceAutoMSminContributors).toBeFalsy();
    expect(responseReport.code).toBe(200);
    done();
  });


  it('Should check if contributors information is ranked in report', async (done) => {
    const microserviceIDmsContributors = await portal.readMicroserviceId('auto-ms-test-innersource');

    const assets = [
      { _id: microserviceIDmsContributors },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    const innersourceContributorfirst = responseReport.body.data.data_contributors.map(contributors => contributors.user_name).indexOf('Arase User');

    expect(responseReport.code).toBe(200);
    expect(innersourceContributorfirst).toEqual(0);
    done();
  });


  it('Should  check heading overview object fields generated in report', async (done) => {
    const headingOverview = {
      name: 'Service Name',
      description: 'Description',
      tags: 'Tags',
      restricted: 'Restricted',
      restricted_description: 'Restricted Description',
      check_cpi: 'CPI Documentation',
      product_number: 'Product Number',
      reusability_level: 'Reusability Level',
      service_category: 'Service Category',
      report_service_bugs: 'Report Service Bugs',
      request_service_support: 'Request Service Support',
      domain: 'Domain',
      based_on: 'Based On 3PP',
      serviceArea: 'Service Area',
      service_maturity: 'Service Maturity',
      helm_chartname: 'Helm Chart Name',
      helmurl: 'Helm URL',
      giturl: 'Git URL',
      discussion_forum_link: 'Discussion Forum',
      date_modified: 'Modified Date',
      date_created: 'Created Date',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingOverview = responseReport.body.data.heading_overview;
    outputHeadingOverview = JSON.parse(JSON.stringify(outputHeadingOverview));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingOverview).toEqual(jasmine.objectContaining(headingOverview));
    done();
  });


  it('Should  check heading documenation object fields generated in report', async (done) => {
    const headingDocumentation = {
      service_name: 'Service Name',
      version: 'Version',
      category: 'Category',
      name: 'Document Name',
      url: 'URL',
      menu_auto: 'Documentation Mode',
      repo_urls_development: 'Development Repository Link',
      repo_urls_release: 'Release Repository Link',
      restricted: 'Restricted',
      default: 'Default',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingDocumentation = responseReport.body.data.heading_documentation;
    outputHeadingDocumentation = JSON.parse(JSON.stringify(outputHeadingDocumentation));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingDocumentation).toEqual(jasmine.objectContaining(headingDocumentation));
    done();
  });


  it('Should  check heading compliance object fields generated in report', async (done) => {
    const headingCompliance = {
      service_name: 'Service Name',
      group: 'Group',
      name: 'Name',
      description: 'Description',
      status: 'Status',
      comment: 'Comment',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingCompliance = responseReport.body.data.heading_compliance;
    outputHeadingCompliance = JSON.parse(JSON.stringify(outputHeadingCompliance));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingCompliance).toEqual(jasmine.objectContaining(headingCompliance));
    done();
  });

  it('Should check heading contributors object fields generated in report', async (done) => {
    const headingContributors = {
      service_name: 'Service Name',
      user_name: 'Author',
      commits: 'Commits',
      insertions: 'Additions',
      deletions: 'Deletions',
      organisation: 'Organisation',
      ou: 'OU',
      from_date: 'From Date',
      to_date: 'To Date',
    };

    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingContributors = responseReport.body.data.heading_contributors;
    outputHeadingContributors = JSON.parse(JSON.stringify(outputHeadingContributors));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingContributors).toEqual(jasmine.objectContaining(headingContributors));
    done();
  });

  it('Should check heading team object fields generated in report', async (done) => {
    const headingTeam = {
      service_name: 'Service Name',
      name: 'Full Name',
      email: 'Email Address',
      signum: 'Signum',
      team_role: 'Team Role',
      serviceOwner: 'Service Owner',
    };

    const microserviceIDmsMaxReport = await portal.readMicroserviceId('auto-ms-max-for-report');
    const assets = [
      { _id: microserviceIDmsMaxReport },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingTeam = responseReport.body.data.heading_team;
    outputHeadingTeam = JSON.parse(JSON.stringify(outputHeadingTeam));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingTeam).toEqual(jasmine.objectContaining(headingTeam));
    done();
  });

  it('Should check heading AdditionalInformation object fields generated in report', async (done) => {
    const headingAdditionalInformation = {
      service_name: 'Service Name',
      category: 'Category',
      title: 'Title',
      link: 'Link',
    };
    const microserviceIDAdditionalInfo = await portal.readMicroserviceId('auto-ms-with-docs');
    const assets = [
      { _id: microserviceIDAdditionalInfo },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    let outputHeadingAddInfo = responseReport.body.data.heading_additional_information;
    outputHeadingAddInfo = JSON.parse(JSON.stringify(outputHeadingAddInfo));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingAddInfo).toEqual(jasmine.objectContaining(headingAdditionalInformation));
    done();
  });

  it('Should return 400 in case of empty array of microservices passed to the  endpoint', async (done) => {
    const assets = [
      { _id: 'notExistingID' },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    expect(responseReport.code).toBe(400);
    done();
  });

  it('Should return 400 in case of not existing ID of MS passed to the endpoint', async (done) => {
    const assets = [];
    const responseReport = await portal.reportAssetsJson({ assets });

    expect(responseReport.code).toBe(400);
    done();
  });
});


describe('Basic microservices logic for RBAC', () => {
  describe('for Etasase admin user in No Perm Group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEtasase);
    });

    it('should generate report for MS, user is Admin', async (done) => {
      const microserviceIDmsMin = await portal.readMicroserviceId('auto-ms-min');
      const assets = [
        { _id: microserviceIDmsMin },
      ];
      const responseReport = await portal.reportAssetsJson({ assets });

      const overviewAutoMSmin = responseReport.body.data.data_overview.filter(serviceOverview => serviceOverview.name === 'Auto MS Min');

      expect(overviewAutoMSmin).not.toEqual([]);
      expect(responseReport.code).toBe(200);
      done();
    });
  });

  describe('for Etarase user in No Perm Group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEtarase);
    });

    it('should try to generate report for asset with no access', async (done) => {
      const assets = [
        { _id: '45e7f4f992afe7bbb62a3391e500e71b' },
      ];
      const responseReport = await portal.reportAssetsJson({ assets });

      const debug = portal.answer({
        url: urljoin(portal.baseUrl, 'report', 'assets', 'json'),
        request: assets,
        response: responseReport.body,
      });

      expect(responseReport.code)
        .withContext(`The server code should be 403: ${debug}`)
        .toBe(403);
      done();
    });
  });

  describe('for Epesuse user in static group', () => {
    beforeAll(async () => {
      await portal.login(login.optionsTestUserEpesuse);
    });

    it('should generate report for MS', async (done) => {
      const assets = [
        { _id: '17e57f6cea1b5a673f8775e6cf023344' },
      ];
      const responseReport = await portal.reportAssetsJson({ assets });

      const overviewAutoMSmin = responseReport.body.data.data_overview.filter(serviceOverview => serviceOverview.name === 'Document Refresh Warnings Test');

      expect(overviewAutoMSmin).not.toEqual([]);
      expect(responseReport.code).toBe(200);
      done();
    });

    it('should try to find MS for user, asset outside of the group', async (done) => {
      const assets = [
        { _id: '45e7f4f992afe7bbb62a3391e500ffb1' },
      ];
      const responseReport = await portal.reportAssetsJson({ assets });

      expect(responseReport.code).toBe(403);
      done();
    });
  });
});


describe('Response header check', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Response header should contain information about alertbanner', async (done) => {
    const microserviceIDmsMax = await portal.readMicroserviceId('auto-ms-max');
    const assets = [
      { _id: microserviceIDmsMax },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });
    const { alertbanner } = responseReport.headers;
    const alertbannerStr = JSON.parse(JSON.stringify(alertbanner));
    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'report', 'assets', 'json'),
      },
      responseReport,
    });

    expect(responseReport.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toEqual(200);

    expect(alertbannerStr)
      .withContext(`response Header should contain "isEnabled":true: ${debug}`)
      .toContain('"isEnabled":true');

    expect(alertbannerStr)
      .withContext(`response Header should contain "key":"alertbanner": ${debug}`)
      .toContain('"key":"alertbanner"');
    done();
  });
});
