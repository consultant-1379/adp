const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();
let innersourceGitType = 'gitstatusbytag';

xdescribe('Testing Innersource API  to check calculation logic', () => {
  beforeAll(async (done) => {
    await portal.login();
    await portal.gitStatusByTag(innersourceGitType);
    done();
  });

  it('[Innersource] Should check response for InnersourceMS for a period of 6 months', async (done) => {
    const contributorExp = {
      email: 'super-user@adp-test.com',
      name: 'Super User',
      signum: 'esupuse',
      commits: 2,
      deletions: 10,
      insertions: 40,
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
      commits: 2,
      deletions: 10,
      insertions: 40,
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

  it('[Innersource] Should check response for InnersourceMS for a period of 1 day', async (done) => {
    const contributorExp = {
      email: 'super-user@adp-test.com',
      name: 'Super User',
      signum: 'esupuse',
      commits: 1,
      deletions: 0,
      insertions: 20,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '1');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'esupuse');
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

  it('[Innersource] Data only for the last 6 month for etesuse', async (done) => {
    const contributorExp = {
      email: 'test-user@adp-test.com',
      name: 'Test User',
      signum: 'etesuse',
      commits: 2,
      deletions: 20,
      insertions: 40,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-5');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');


    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesuse');
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

  it('[Innersource] Should check data for 6 months for etarase user with department information RAN0 RAN1', async (done) => {
    const contributorExp = {
      email: 'arase-user@adp-test.com',
      name: 'Arase User',
      signum: 'etarase',
      commits: 1,
      deletions: 0,
      insertions: 20,
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

  it('[Innersource] Should check if functional user was removed during collectionStatistic run', async (done) => {
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource-4');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '180');

    const functionalUserFound = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'emesuse');

    expect(functionalUserFound.length).toBe(0);
    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.data.contributors.length).toBe(3);
    done();
  });

  afterAll(async (done) => {
    innersourceGitType = 'gitstatus';
    await portal.gitStatusByTag(innersourceGitType);
    done();
  });
});
