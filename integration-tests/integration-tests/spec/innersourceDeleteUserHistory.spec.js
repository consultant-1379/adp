/**
     * Tests for innersource user commits history specific to microservices for a date range
     * @author Akshay Mungekar
*/

const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

const dateFormat = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toJSON().split('T')[0];
};

const invalidDate = new Date();
const invalidDateFormat = `${invalidDate.getDate()}-` + `0${invalidDate.getMonth() + 1}` + `-${invalidDate.getFullYear()}`;

const todaysDate = dateFormat(1);
const OneWeekAgoDate = dateFormat(7);
const threeMonthsAgoDate = dateFormat(89);
const microserviceSlug = 'auto-ms-test-innersource';


describe('Testing Innersource API  to check calculation logic', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  // Case 1
  it('[Innersource] Should verify and delete Innersource history for etarase user for a specific MS for a period of 7 days', async (done) => {
    // Checks response for InnersourceMS for a period of 7 days for etarase user before deletion
    const contributorExp = {
      email: 'arase-user@adp-test.com',
      name: 'Arase User',
      signum: 'etarase',
      commits: 2,
      deletions: 20,
      insertions: 30,
      organisation: 'RAN0 RAN1',
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '7');

    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etarase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));


    // Delete the commit history of the etarase user for a period of 7 days
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(OneWeekAgoDate, todaysDate, 'etarase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(200);

    // Verify response for InnersourceMS after deleting commits history for etarase user for a period of 7 days
    const responseInnersourceAfterDelete = await portal.innersourceMSGet(microserviceIdInnersource, '7');
    const innersourceContributorAfterDelete = responseInnersourceAfterDelete.body.data.contributors.filter(contributor => contributor.signum === 'etarase');

    expect(innersourceContributorAfterDelete).toEqual([]);
    expect(innersourceContributorAfterDelete.length).toBe(0);
    done();
  });

  // Case 2
  it('[Innersource] Should delete Innersource history for etapase user for a specific MS', async (done) => {
    // Checks response for InnersourceMS for a period of 7 days for etapase user before deletion
    const contributorExp = {
      email: 'apase-user@adp-test.com',
      name: 'Apase User',
      signum: 'etapase',
      commits: 1,
      deletions: 0,
      insertions: 0,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '7');

    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etapase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));

    // Delete the commit history of the etapase user for a period of 7 days
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(OneWeekAgoDate, todaysDate, 'etapase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(200);

    // Verify response for InnersourceMS after deleting commits history for etapase user for a period of 7 days
    const responseInnersourceAfterDelete = await portal.innersourceMSGet(microserviceIdInnersource, '7');
    const innersourceContributorAfterDelete = responseInnersourceAfterDelete.body.data.contributors.filter(contributor => contributor.signum === 'etapase');

    expect(innersourceContributorAfterDelete).toEqual([]);
    expect(innersourceContributorAfterDelete.length).toBe(0);
    done();
  });

  // Case 3
  it('[Innersource] Should delete Innersource history for etesase user for a specific MS', async (done) => {
    //  Checks response for InnersourceMS for a period of 90 days for etesase user before deletion
    const contributorExp = {
      email: 'etesase-user@adp-test.com',
      name: 'Sase User',
      signum: 'etesase',
      commits: 2,
      deletions: 15,
      insertions: 26,
    };
    const microserviceIdInnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const responseInnersource = await portal.innersourceMSGet(microserviceIdInnersource, '90');

    let innersourceContributor = responseInnersource.body.data.contributors.filter(contributor => contributor.signum === 'etesase');
    innersourceContributor = JSON.parse(JSON.stringify(innersourceContributor[0]));

    expect(responseInnersource.code).toBe(200);
    expect(innersourceContributor).toEqual(jasmine.objectContaining(contributorExp));

    // Delete the commit history of the etesase user for a period of 83 days (to delete old commits and verify most recent commits)
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(threeMonthsAgoDate, OneWeekAgoDate, 'etesase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(200);

    // Verify response for InnersourceMS after deleting commits history for etesase user for a period of 90 days
    const contributorExpAfterDelete = {
      email: 'etesase-user@adp-test.com',
      name: 'Sase User',
      signum: 'etesase',
      commits: 1,
      deletions: 5,
      insertions: 6,
    };

    const responseInnersourceAfterDelete = await portal.innersourceMSGet(microserviceIdInnersource, '90');

    let innersourceContributorAfterDelete = responseInnersourceAfterDelete.body.data.contributors.filter(contributor => contributor.signum === 'etesase');
    innersourceContributorAfterDelete = JSON.parse(JSON.stringify(innersourceContributorAfterDelete[0]));

    expect(responseInnersourceAfterDelete.code).toBe(200);
    expect(innersourceContributorAfterDelete).toEqual(jasmine.objectContaining(contributorExpAfterDelete));
    done();
  });

  // Case 4
  it('[Innersource] Should fail to delete Innersource history for etapase user for a specific MS with invalid arguments', async (done) => {
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(OneWeekAgoDate, invalidDateFormat, 'etapase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(400);
    done();
  });

  // Case 5
  it('[Innersource] Should fail to delete Innersource history for etapase user for a specific MS with incorrect arguments', async (done) => {
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(todaysDate, OneWeekAgoDate, 'etapase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(400);
    done();
  });

  // Case 6
  it('[Innersource] Should fail to delete Innersource history for etapase user for a specific MS with less arguments', async (done) => {
    const responseInnersourceDelete = await portal.innersourceUserHistoryDeleteInvalid(todaysDate, 'etapase', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(400);
    done();
  });

  // Case 7
  it('[Innersource] Should fail to delete Innersource history for etapase user for a specific MS with invalid msSlug', async (done) => {
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(OneWeekAgoDate, todaysDate, 'etapase', 'auto-mss-test-innersource1');

    expect(responseInnersourceDelete.code).toBe(404);
    done();
  });

  // Case 8
  it('[Innersource] Should fail to delete Innersource history for etapase user for a specific MS with invalid user signum', async (done) => {
    const responseInnersourceDelete = await portal.innersourceUserHistoryDelete(OneWeekAgoDate, todaysDate, 'etapase12', microserviceSlug);

    expect(responseInnersourceDelete.code).toBe(404);
    done();
  });
});

// Tests to verify deleted commits in the asset/excel reports

describe('Testing reports for the assets(microservices) in Json format', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  it('Should check contributors values (commit data) generated in report per microservice for Test User (etarase)', async (done) => {
    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    const contributorsAutoMSinnersource = responseReport.body.data.data_contributors.filter(contributors => contributors.service_name === 'Auto MS Test Innersource' && contributors.user_name === 'Arase User');

    expect(contributorsAutoMSinnersource).toEqual([]);
    expect(contributorsAutoMSinnersource.length).toBe(0);

    done();
  });

  it('Should check contributors values (commit data) generated in report per microservice for Sase User (etesase)', async (done) => {
    const contributorsExpected = {
      service_name: 'Auto MS Test Innersource',
      user_name: 'Sase User',
      commits: 1,
      insertions: 6,
      deletions: 5,
    };

    const microserviceIDmsinnersource = await portal.readMicroserviceId('auto-ms-test-innersource');
    const assets = [
      { _id: microserviceIDmsinnersource },
    ];
    const responseReport = await portal.reportAssetsJson({ assets });

    let contributorsAutoMSinnersource = responseReport.body.data.data_contributors.filter(contributors => contributors.service_name === 'Auto MS Test Innersource' && contributors.user_name === 'Sase User');
    contributorsAutoMSinnersource = JSON.parse(JSON.stringify(contributorsAutoMSinnersource[0]));

    expect(responseReport.code).toBe(200);
    expect(contributorsAutoMSinnersource).toEqual(jasmine.objectContaining(contributorsExpected));
    done();
  });
});

// ============================================================================================= //
