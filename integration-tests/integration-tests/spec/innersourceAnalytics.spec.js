const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

describe('Testing Innersource API  to check calculation logic', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('[Innersource] Should check response for InnersourceMS for a period of 6 month', async (done) => {
    const contributorExp = {
      email: 'super-user@adp-test.com',
      name: 'Super User',
      signum: 'esupuse',
      commits: 5,
      deletions: 40,
      insertions: 120,
      organisation: 'BDGS SA PC PDG',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');

    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'esupuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check response for InnersourceMS for a period of 3 month', async (done) => {
    const contributorExp = {
      email: 'super-user@adp-test.com',
      name: 'Super User',
      signum: 'esupuse',
      commits: 4,
      deletions: 30,
      insertions: 80,
      organisation: 'BDGS SA PC PDG',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '90');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'esupuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check response for InnersourceMS for a period of 1 day for one user', async (done) => {
    const contributorExp = {
      email: 'super-user@adp-test.com',
      name: 'Super User',
      signum: 'esupuse',
      commits: 1,
      deletions: 0,
      insertions: 20,
      organisation: 'BDGS SA PC PDG',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '1');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'esupuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check response for InnersourceMS for a period of 1 day for one user with several commits per day', async (done) => {
    const contributorExp = {
      email: 'test-user@adp-test.com',
      name: 'Test User',
      signum: 'etesuse',
      commits: 3,
      deletions: 20,
      insertions: 20,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '1');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check if response for innersource contributors information is ranked', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');
    const innersourceContributorfirst = responseInnersource.body.data.contributors.map(contributor => contributor.signum).indexOf('esupuse');
    const innersourceContributorSecond = responseInnersource.body.data.contributors.map(contributor => contributor.signum).indexOf('etesuse');

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributorfirst).toEqual(0);
    expect(innersourceContributorSecond).toEqual(1);
    done();
  });

  it('[Innersource] Should check if innersource contributors period has wrong value, 400 is responded', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '360');

    expect(responseInnersource.code).toBe(400);

    done();
  });

  it('[Innersource] Data only for the last 6 month, without last two month  should be calculated for innersource for etesuse, as he was added to the teaam 2 month ago', async (done) => {
    const contributorExp = {
      email: 'test-user@adp-test.com',
      name: 'Test User',
      signum: 'etesuse',
      commits: 3,
      deletions: 30,
      insertions: 60,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-5');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Data only for the last 6 month, etesuse was on the team but two month ago was removed from the team based on snapshots', async (done) => {
    const contributorExp = {
      email: 'test-user@adp-test.com',
      name: 'Test User',
      signum: 'etesuse',
      commits: 3,
      deletions: 20,
      insertions: 20,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-6');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Data for the last month should not be calculated for etesuse as innersource as he was added to the team two month ago', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-5');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '30');
    const internalMemberFound = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');


    expect(responseInnersource.code).toBe(200);
    expect(internalMemberFound.length).toBe(0);
    done();
  });


  it('[Innersource] Data older then 6 months is not taken into account for Innersource calculation', async (done) => {
    const contributorExp = {
      email: 'test-user@adp-test.com',
      name: 'Test User',
      signum: 'etesuse',
      commits: 6,
      deletions: 50,
      insertions: 80,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });


  it('[Innersource] Should check data for 6 months for etesase user with department information', async (done) => {
    const contributorExp = {
      email: 'etesase-user@adp-test.com',
      name: 'Sase User',
      signum: 'etesase',
      // commits: 2,
      // deletions: 15,
      // insertions: 26,
      organisation: 'BDGS RDPS CD',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });


  it('[Innersource] Should check data for one months for eterase user with department information, only latest commit should be calculated', async (done) => {
    const contributorExp = {
      email: 'eterase-user@adp-test.com',
      name: 'Rase User',
      signum: 'eterase',
      commits: 1,
      deletions: 20,
      insertions: 12,
      organisation: 'BDGS SA OSS PDU OSS',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-1');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '30');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'eterase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check if innersource contribution requested for not existing ID, 400 is responded', async (done) => {
    const responseInnersource = await portal.innersourceMSGet('notexistingMsId', '180');

    expect(responseInnersource.code).toBe(400);

    done();
  });

  it('[Innersource] Should check data for 6 months for etesuse2 user with organisation to be BDGS RAN1', async (done) => {
    const contributorExp = {
      email: 'test-user2@adp-test.com',
      name: 'Test User2',
      signum: 'etesuse2',
      commits: 2,
      deletions: 12,
      insertions: 65,
      organisation: 'BDGS RAN1',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse2');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check data for 6 months for epesuse user with department information BNEW DNEW CDS', async (done) => {
    const contributorExp = {
      email: 'pest-user@adp-test.com',
      name: 'Pest User',
      signum: 'epesuse',
      commits: 1,
      deletions: 0,
      insertions: 20,
      organisation: 'BNEW DNEW CDS',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'epesuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check data for 6 months for etasase user with department information BNEW GSU', async (done) => {
    const contributorExp = {
      email: 'asase-user@adp-test.com',
      name: 'Asase User',
      signum: 'etasase',
      commits: 1,
      deletions: 0,
      insertions: 20,
      organisation: 'BNEW GSU',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etasase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });

  it('[Innersource] Should check data for 6 months for etarase user with department information RAN0 RAN1', async (done) => {
    const contributorExp = {
      email: 'arase-user@adp-test.com',
      name: 'Arase User',
      signum: 'etarase',
      // commits: 1,
      // deletions: 0,
      // insertions: 20,
      organisation: 'RAN0 RAN1',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etarase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    done();
  });


  it('[Innersource] Should check if user from team snapshot was removed during collectionStatistic run, only user outside of team is present. The organisation should be BDGS SA PC PDG.', async (done) => {
    const contributorExp = {
      commits: 5,
      deletions: 40,
      insertions: 120,
      name: 'Super User',
      email: 'super-user@adp-test.com',
      signum: 'esupuse',
      organisation: 'BDGS SA PC PDG',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-4');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '365');

    const internalMemberFound = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');

    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'esupuse');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(internalMemberFound.length).toBe(0);
    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));
    expect(responseInnersource.body.data.contributors.length).toBe(8);
    done();
  });

  it('[Innersource] Should check if functional user was removed during collectionStatistic run', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-4');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');

    const functionalUserFound = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'emesuse');

    expect(functionalUserFound.length).toBe(0);
    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.data.contributors.length).toBe(8);
    done();
  });

  it('[Innersource] Should check if user from the peoplefinder snapshot was removed during collectionStatistic run, only user outside of team is present', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-4');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '365');

    const internalMemberFound = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');

    expect(internalMemberFound.length).toBe(0);
    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.data.contributors.length).toBe(7);
    done();
  });
});
