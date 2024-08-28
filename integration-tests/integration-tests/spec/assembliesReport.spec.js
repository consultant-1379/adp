
/**
* Testing reports for the assemblies in Json format
* @author Ludmila Omelchenko
*/
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();


describe('Testing reports for the assemblies in Json format', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Testing report generation for 3 assemblies passed to the report endpoint', async (done) => {
    const assembly1 = await portal.readAssemblyId('assembly-update-test');
    const assembly2 = await portal.readAssemblyId('assembly-min');
    const assembly3 = await portal.readAssemblyId('assembly-auto-doc');
    const assets = [
      { _id: assembly1 },
      { _id: assembly2 },
      { _id: assembly3 },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let foundAssembly2 = false;
    responseReport.body.data.data_overview.forEach((overviewAsset) => {
      if (overviewAsset.name === 'Assembly Min') {
        foundAssembly2 = true;
      }
    });

    let foundAssembly3 = false;
    responseReport.body.data.data_overview.forEach((overviewAsset) => {
      if (overviewAsset.name === 'Assembly Auto Doc') {
        foundAssembly3 = true;
      }
    });

    expect(foundAssembly2).toBeTruthy();
    expect(foundAssembly3).toBeTruthy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should generate xlsx report for 3 assemblies\'s.', async (done) => {
    const assets = [
      { _id: await portal.readAssemblyId('assembly-update-test') },
      { _id: await portal.readAssemblyId('assembly-min') },
      { _id: await portal.readAssemblyId('assembly-auto-doc') },
    ];

    const result = await portal.reportAssembliesXlsx({ assets });

    expect(result.code).toBe(200);

    expect(result.headers['content-type'])
      .withContext('Expected the header content-type to contain spreadsheetml.sheet')
      .toContain('spreadsheetml.sheet');

    expect(result.headers['content-disposition'])
      .withContext('Expected the header content-disposition to contain adpmarketplace_')
      .toContain('adpmarketplace_');

    done();
  });

  it('Should check 4 sections(overview, documentation, team, additional info) with data avaliable for the Assemblies', async (done) => {
    const assemblyMaxReport = await portal.readAssemblyId('assembly-max-report');
    const assets = [
      { _id: assemblyMaxReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let foundAssemblymaxOverview = false;
    responseReport.body.data.data_overview.forEach((serviceOverview) => {
      if (serviceOverview.name === 'Assembly Max Report') {
        foundAssemblymaxOverview = true;
      }
    });
    let foundAssemblymaxDocumentation = false;
    responseReport.body.data.data_documentation.forEach((serviceDocumentation) => {
      if (serviceDocumentation.service_name === 'Assembly Max Report') {
        foundAssemblymaxDocumentation = true;
      }
    });
    let foundAssemblymaxTeams = false;
    responseReport.body.data.data_team.forEach((serviceTeams) => {
      if (serviceTeams.service_name === 'Assembly Max Report') {
        foundAssemblymaxTeams = true;
      }
    });
    let foundAssemblymaxServices = false;
    responseReport.body.data.data_services.forEach((serviceServices) => {
      if (serviceServices.assembly_name === 'Assembly Max Report' && serviceServices.name === 'Auto MS max') {
        foundAssemblymaxServices = true;
      }
    });
    let foundAssemblymaxAddInfo = false;
    responseReport.body.data.data_additional_information.forEach((serviceAdditionalInformation) => {
      if (serviceAdditionalInformation.service_name === 'Assembly Max Report') {
        foundAssemblymaxAddInfo = true;
      }
    });

    expect(foundAssemblymaxOverview).toBeTruthy();
    expect(foundAssemblymaxDocumentation).toBeTruthy();
    expect(foundAssemblymaxServices).toBeTruthy();
    expect(foundAssemblymaxTeams).toBeTruthy();
    expect(foundAssemblymaxAddInfo).toBeTruthy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check  if no documentation is avaliable for the Assembly, no data_documentation object for this Assembly is generated', async (done) => {
    const assemblyMinReport = await portal.readAssemblyId('assembly-min');
    const assets = [
      { _id: assemblyMinReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let foundAssemblyminDocumentation = false;
    responseReport.body.data.data_documentation.forEach((serviceOverview) => {
      if (serviceOverview.name === 'Assembly Min') {
        foundAssemblyminDocumentation = true;
      }
    });

    expect(foundAssemblyminDocumentation).toBeFalsy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check  if no additional information is avaliable for the Assembly, no data_additional_documentation object for this Assembly is generated', async (done) => {
    const assemblyMinReport = await portal.readAssemblyId('assembly-min');
    const assets = [
      { _id: assemblyMinReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let foundAssemblyminDocumentation = false;
    responseReport.body.data.data_additional_information.forEach((serviceAddInfo) => {
      if (serviceAddInfo.name === 'Assembly Min') {
        foundAssemblyminDocumentation = true;
      }
    });

    expect(foundAssemblyminDocumentation).toBeFalsy();
    expect(responseReport.code).toBe(200);
    done();
  });

  it('Should check overview fields generated in report for the Assembly', async (done) => {
    const overviewExpected = {
      name: 'Assembly Max',
      assembly_category: 'Domain Specific Assembly',
      domain: 'COS',
      report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
      request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
      description: 'Max Assembly, to test all fields',
      tags: 'TagFour',
      product_number: 'APR20132',
      mimer_version_starter: '0.0.0',
      assembly_maturity: 'Ready for Commercial Use',
      restricted: 'Other',
      restricted_description: 'Reason to be Restricted',
      helm_chartname: 'eric-lcm-container-registry',
      helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
      check_cpi: 'Yes',
      giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
      discussion_forum_link: '',
      backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
      team_mailers: 'adpusers@ericsson.com, adpusers2@ericsson.com',
      date_modified: '2023-02-17T08:40:19.514Z',
      date_created: '2022-02-16T08:40:19.514Z',
    };

    const AssemblyIdMax = await portal.readAssemblyId('assembly-max');
    const assets = [
      { _id: AssemblyIdMax },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let overviewAssemblymax = responseReport.body.data.data_overview.filter(serviceOverview => serviceOverview.name === 'Assembly Max');
    overviewAssemblymax = JSON.parse(JSON.stringify(overviewAssemblymax[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(overviewAssemblymax)
      .withContext('Should contain  expected Overview fields woth values in report')
      .toEqual(jasmine.objectContaining(overviewExpected));
    done();
  });

  it('Should check component_service fields generated in report for the Assembly', async (done) => {
    const reportExpected = {
      assembly_name: 'Assembly Max Report',
      name: 'Auto MS max',
      description: 'This is a service containing maximum data',
      check_cpi: 'Yes',
      reusability_level: 'None',
      service_category: 'ADP Reusable Services',
      based_on: 'Test 3PP',
      serviceArea: 'Messaging',
      service_maturity: 'Ready for Non-Commercial Use',
      helm_chartname: 'eric-lcm-container-registry',
    };

    const AssemblyIdMax = await portal.readAssemblyId('assembly-max-report');
    const assets = [
      { _id: AssemblyIdMax },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let overviewAssemblymax = responseReport.body.data.data_services.filter(serviceOverview => serviceOverview.name === 'Auto MS max');
    overviewAssemblymax = JSON.parse(JSON.stringify(overviewAssemblymax[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(overviewAssemblymax)
      .withContext('Should contain  expected Overview fields woth values in report')
      .toEqual(jasmine.objectContaining(reportExpected));
    done();
  });


  it('Should check component_service fields generated in report for two the Assembly', async (done) => {
    const AssemblyIdMax = await portal.readAssemblyId('assembly-max-report');
    const AssemblyIdMax2 = await portal.readAssemblyId('assembly-max-report-2');
    const assets = [
      { _id: AssemblyIdMax },
      { _id: AssemblyIdMax2 },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let overviewAssemblymax = responseReport.body.data.data_services.filter(serviceOverview => serviceOverview.name === 'Auto MS max' && serviceOverview.assembly_name === 'Assembly Max Report');
    overviewAssemblymax = JSON.parse(JSON.stringify(overviewAssemblymax[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    let overviewAssemblymax2 = responseReport.body.data.data_services.filter(serviceOverview => serviceOverview.name === 'Auto MS max' && serviceOverview.assembly_name === 'Assembly Max Report 2');
    overviewAssemblymax2 = JSON.parse(JSON.stringify(overviewAssemblymax2[0]));

    expect(responseReport.code)
      .withContext('The server code should be 200')
      .toBe(200);

    expect(overviewAssemblymax)
      .withContext('Should contain expected MS and Assembly')
      .toBeTruthy();

    expect(overviewAssemblymax2)
      .withContext('Should contain expected MS and Assembly')
      .toBeTruthy();
    done();
  });


  it('Should check documentation information for the Assembly generated in report(manual mode)', async (done) => {
    const documetationExpected = {
      service_name: 'Assembly Auto Doc',
      version: 'In Development',
      assembly_category: '',
      name: 'Service Deployment Guide',
      restricted: 'No',
      default: 'No',
      menu_auto: 'Automated',
    };

    const assemblywithDocs = await portal.readAssemblyId('assembly-auto-doc');
    const assets = [
      { _id: assemblywithDocs },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let documentationAssemblywithDocs = responseReport.body.data.data_documentation.filter(serviceDocumentation => serviceDocumentation.service_name === 'Assembly Auto Doc');

    documentationAssemblywithDocs = JSON.parse(JSON.stringify(documentationAssemblywithDocs[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationAssemblywithDocs).toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check additional information for the Assembly  generated in report', async (done) => {
    const documetationExpected = {
      service_name: 'Assembly Max',
      category: 'tutorial',
      title: 'Tutorial Example Link Text',
      link: 'www.exampletutoriallink.com',
    };

    const assemblywithDocs = await portal.readAssemblyId('assembly-max');
    const assets = [
      { _id: assemblywithDocs },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let documentationAssemblywithDocs = responseReport.body.data.data_additional_information.filter(serviceAddInfo => serviceAddInfo.service_name === 'Assembly Max' && serviceAddInfo.category === 'tutorial');
    documentationAssemblywithDocs = JSON.parse(JSON.stringify(documentationAssemblywithDocs[0]));

    expect(responseReport.code).toBe(200);
    expect(documentationAssemblywithDocs).toEqual(jasmine.objectContaining(documetationExpected));
    done();
  });

  it('Should check team fields generated in report for the Assembly', async (done) => {
    const teamExpected = {
      service_name: 'Assembly Min',
      email: 'super-user@adp-test.com',
      signum: 'esupuse',
      team_role: 'PO',
      serviceOwner: 'Yes',
    };

    const assemblyMaxReport = await portal.readAssemblyId('assembly-min');
    const assets = [
      { _id: assemblyMaxReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    let teamAssemblyminforReport = responseReport.body.data.data_team.filter(serviceOverview => serviceOverview.service_name === 'Assembly Min' && serviceOverview.signum === 'esupuse');
    teamAssemblyminforReport = JSON.parse(JSON.stringify(teamAssemblyminforReport[0]));

    expect(responseReport.code).toBe(200);
    expect(teamAssemblyminforReport).toEqual(jasmine.objectContaining(teamExpected));
    done();
  });

  it('Should  check heading overview object fields generated in report', async (done) => {
    const headingOverview = {
      name: 'Name',
      assembly_category: 'Assembly Category',
      domain: 'Domain',
      report_service_bugs: 'Report Service Bugs',
      request_service_support: 'Request Service Support',
      description: 'Description',
      tags: 'Tags',
      product_number: 'Product Number',
      mimer_version_starter: 'Mimer Activation Version',
      assembly_maturity: 'Assembly Maturity',
      restricted: 'Restricted',
      restricted_description: 'Restricted Description',
      helm_chartname: 'Helm Chart Name',
      helmurl: 'Helm URL',
      check_cpi: 'CPI Documentation',
      giturl: 'Git URL',
      discussion_forum_link: 'Discussion Forum',
      backlog: 'JIRA Backlog',
      team_mailers: 'Team Distribution List',
      date_modified: 'Modified Date',
      date_created: 'Created Date',
    };

    const assemblyMaxReport = await portal.readAssemblyId('assembly-max');
    const assets = [
      { _id: assemblyMaxReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let outputHeadingOverview = responseReport.body.data.heading_overview;
    outputHeadingOverview = JSON.parse(JSON.stringify(outputHeadingOverview));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingOverview).toEqual(jasmine.objectContaining(headingOverview));
    done();
  });


  it('Should  check heading documenation object fields generated in report', async (done) => {
    const headingDocumentation = {
      service_name: 'Name',
      version: 'Version',
      assembly_category: 'Category',
      name: 'Document Name',
      url: 'URL',
      restricted: 'Restricted',
      default: 'Default',
      menu_auto: 'Documentation Mode',
      repo_urls_development: 'Development Repository Link',
      repo_urls_release: 'Release Repository Link',
      isCpiUpdated: 'Is CPI Updated',
    };

    const assemblyMaxReport = await portal.readAssemblyId('assembly-auto-doc');
    const assets = [
      { _id: assemblyMaxReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let outputHeadingDocumentation = responseReport.body.data.heading_documentation;

    outputHeadingDocumentation = JSON.parse(JSON.stringify(outputHeadingDocumentation));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingDocumentation).toEqual(jasmine.objectContaining(headingDocumentation));
    done();
  });


  it('Should check heading team object fields generated in report', async (done) => {
    const headingTeam = {
      service_name: 'Name',
      name: 'Full Name',
      email: 'Email Address',
      signum: 'Signum',
      team_role: 'Team Role',
      serviceOwner: 'Service Owner',
    };

    const assemblyMaxReport = await portal.readAssemblyId('assembly-max');
    const assets = [
      { _id: assemblyMaxReport },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let outputHeadingTeam = responseReport.body.data.heading_team;

    outputHeadingTeam = JSON.parse(JSON.stringify(outputHeadingTeam));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingTeam).toEqual(jasmine.objectContaining(headingTeam));
    done();
  });

  it('Should check heading AdditionalInformation object fields generated in report', async (done) => {
    const headingAdditionalInformation = {
      service_name: 'Name',
      category: 'Category',
      title: 'Title',
      link: 'Link',
    };
    const assemblyAdditionalInfo = await portal.readAssemblyId('assembly-max');
    const assets = [
      { _id: assemblyAdditionalInfo },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });
    let outputHeadingAddInfo = responseReport.body.data.heading_additional_information;
    outputHeadingAddInfo = JSON.parse(JSON.stringify(outputHeadingAddInfo));

    expect(responseReport.code).toBe(200);
    expect(outputHeadingAddInfo).toEqual(jasmine.objectContaining(headingAdditionalInformation));
    done();
  });

  it('Should return 400 in case of empty array of assemblies passed to the  endpoint', async (done) => {
    const assets = [
      { _id: 'notExistingID' },
    ];
    const responseReport = await portal.reportAssembliesJson({ assets });

    expect(responseReport.code).toBe(400);
    done();
  });

  it('Should return 400 in case of not existing ID of Assembly passed to the endpoint', async (done) => {
    const assets = [];
    const responseReport = await portal.reportAssembliesJson({ assets });

    expect(responseReport.code).toBe(400);
    done();
  });
});
