/**
     * Tests for details of innersource top contributors for all the MS for a specific date range
     * @author Akshay Mungekar
*/
const urljoin = require('url-join');
const { PortalPrivateAPI } = require('./apiClients');
const data = require('../test.data.js');

const portal = new PortalPrivateAPI();

const dateFormat = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toJSON().split('T')[0];
};

const invalidDate = new Date();
const invalidDateFormat = `${invalidDate.getDate()}-0${invalidDate.getMonth() + 1}-${invalidDate.getFullYear()}`;

const todaysDate = dateFormat(1);
const threeMonthsAgoDate = dateFormat(90);

describe('Testing top innersource organisations endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    done();
  });

  // Case 1
  it('[Innersource] Should verify complete list of organisations with default values', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters();

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const topOrganisation1 = responseInnersource.body.data[0].contributionWeight;
    const topOrganisation2 = responseInnersource.body.data[1].contributionWeight;
    const topOrganisation3 = responseInnersource.body.data[2].contributionWeight;
    const topOrganisation4 = responseInnersource.body.data[3].contributionWeight;

    let flag = false;
    if ((topOrganisation1 > topOrganisation2) && (topOrganisation1 > topOrganisation3)
      && (topOrganisation1 > topOrganisation4)) {
      flag = true;
    }

    expect(flag).toBeTruthy();

    done();
  });

  // Case 2.1
  it('[Innersource] Should verify default values of each parameter by passing values to the rest', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganizationSkippedDate(todaysDate,
      data.testTopContributorsData.domain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const topOrganisation1 = responseInnersource.body.data[0].contributionWeight;
    const topOrganisation2 = responseInnersource.body.data[1].contributionWeight;
    const topOrganisation3 = responseInnersource.body.data[2].contributionWeight;
    const topOrganisation4 = responseInnersource.body.data[3].contributionWeight;

    let flag = false;
    if ((topOrganisation1 > topOrganisation2) && (topOrganisation1 > topOrganisation3)
      && (topOrganisation1 > topOrganisation4)) {
      flag = true;
    }

    expect(flag).toBeTruthy();

    done();
  });

  // Case 2.2
  it('[Innersource] Should verify default values of each parameter by passing values to the rest ', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisationSkippedDomain(
      threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.serviceCategory,
    );

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const topOrganisation1 = responseInnersource.body.data[0].contributionWeight;
    const topOrganisation2 = responseInnersource.body.data[1].contributionWeight;
    const topOrganisation3 = responseInnersource.body.data[2].contributionWeight;
    const topOrganisation4 = responseInnersource.body.data[3].contributionWeight;

    let flag = false;
    if ((topOrganisation1 > topOrganisation2) && (topOrganisation1 > topOrganisation3)
      && (topOrganisation1 > topOrganisation4)) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });

  // Case 3.1
  it('[Innersource] Should verify the appropriate response for the innersource organisations obtained by passing a combination of parameters', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisation(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceOrganisation = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceOrganisation).not.toEqual([]);

    const linesAdded = responseInnersource.body.data[0].micro_services[0].insertions;
    const linesRemoved = responseInnersource.body.data[0].micro_services[0].deletions;
    const actualWeight = responseInnersource.body.data[0].micro_services[0].weight;

    const calculatedWeight = (linesAdded + 0.5 * linesRemoved);

    expect(actualWeight).toEqual(calculatedWeight);

    const topOrganisation1 = responseInnersource.body.data[0].contributionWeight;
    const topOrganisation2 = responseInnersource.body.data[1].contributionWeight;
    const topOrganisation3 = responseInnersource.body.data[2].contributionWeight;
    const topOrganisation4 = responseInnersource.body.data[3].contributionWeight;

    let flag = false;
    if ((topOrganisation1 > topOrganisation2) && (topOrganisation1 > topOrganisation3)
      && (topOrganisation1 > topOrganisation4)) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });

  // Case 3.2
  it('[Innersource] Should verify the appropriate response for the innersource contributors obtained by passing a combination of parameters2', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisation(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain1,
      data.testTopContributorsData.serviceCategory1);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceOrganisation = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceOrganisation).not.toEqual([]);

    const linesAdded = responseInnersource.body.data[0].micro_services[0].insertions;
    const linesRemoved = responseInnersource.body.data[0].micro_services[0].deletions;
    const actualWeight = responseInnersource.body.data[0].micro_services[0].weight;

    const calculatedWeight = (linesAdded + 0.5 * linesRemoved);

    expect(actualWeight).toEqual(calculatedWeight);

    const topOrganisation1 = responseInnersource.body.data[0].contributionWeight;
    const topOrganisation2 = responseInnersource.body.data[1].contributionWeight;
    const topOrganisation3 = responseInnersource.body.data[2].contributionWeight;
    const topOrganisation4 = responseInnersource.body.data[3].contributionWeight;

    let flag = false;
    if ((topOrganisation1 > topOrganisation2) && (topOrganisation1 > topOrganisation3)
      && (topOrganisation1 > topOrganisation4)) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });


  // Case 5
  it('[Innersource] Should verify the bad response by passing incorrect/invalid parameters fo date (DD-MM-YYYY)', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisation(invalidDateFormat,
      todaysDate, data.testTopContributorsData.domain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(400);
    expect(responseInnersource.body.total).toEqual(0);
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).toEqual([]);
    done();
  });

  // Case 6.1
  it('[Innersource] Should verify the bad response by passing incorrect/invalid parameters for Domain (not existing)', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisation(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.invalidDomain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(404);
    expect(responseInnersource.body.total).toEqual(0);
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).toEqual([]);
    done();
  });

  // Case 6.2
  it('[Innersource] Should verify the bad response by passing incorrect/invalid parameters for Service Category (not existing)', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisation(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain,
      data.testTopContributorsData.invalidServiceCategory);

    expect(responseInnersource.code).toBe(404);
    expect(responseInnersource.body.total).toEqual(0);
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).toEqual([]);
    done();
  });

  it('[Innersource] checking limit=3 on the endpoint to get top organisations', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters('?limit=3');

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).toEqual(3);
    expect(responseInnersource.body.size).not.toEqual();
    done();
  });

  it('[Innersource] checking limit=true respond with 400 on the endpoint to get top organisations', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters('?limit=true');

    expect(responseInnersource.code).toBe(400);
    done();
  });

  it('[Innersource] checking limit=0 on the endpoint to get top organisations', async (done) => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters('?limit=0');

    expect(responseInnersource.code).toBe(400);
    done();
  });

  it('[Innersource] Should verify organisation in case when it is changed for one person(etesuse2). Commits for the previous organisations calculated correctly', async () => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.organisation === 'BNEW DNEW CR');
    const innersourseCommits = innersourceContributor[0].micro_services.filter(microservice => microservice.insertions === 65 && microservice.deletions === 12 && microservice.assetName === 'Auto MS Test Innersource');

    expect(innersourceContributor).not.toEqual([]);
    expect(innersourseCommits).not.toEqual([]);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'innersource', 'organisations'),
        request: 'get',
      },
      responseInnersource,
    });

    expect(responseInnersource.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    expect(innersourceContributor)
      .withContext(`Should find appropriate organisation in commit data ${debug}`)
      .not.toEqual([]);

    expect(innersourseCommits)
      .withContext(`Should find appropriate MS commits in commit data ${debug}`)
      .not.toEqual([]);
  });


  it('[Innersource] Should verify organisation in case when it is changed for two persons(etesuse2 and eterase). Commits for the previous organisations calculated correctly', async () => {
    const responseInnersource = await portal.innersourceGetTopOrganisationNoParameters();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.organisation === 'BNEW DNEW CR');
    const innersourseCommits = innersourceContributor[0].micro_services.filter(microservice => microservice.insertions === 97 && microservice.deletions === 42 && microservice.assetName === 'Auto MS with Docs');

    expect(innersourceContributor).not.toEqual([]);
    expect(innersourseCommits).not.toEqual([]);

    const debug = portal.answer({
      param: {
        url: urljoin(portal.baseUrl, 'innersource', 'organisations'),
        request: 'get',
      },
      responseInnersource,
    });

    expect(responseInnersource.code)
      .withContext(`The server code should be 200: ${debug}`)
      .toBe(200);

    expect(innersourceContributor)
      .withContext(`Should find appropriate organisation in commit data ${debug}`)
      .not.toEqual([]);

    expect(innersourseCommits)
      .withContext(`Should find appropriate MS commits in commit data ${debug}`)
      .not.toEqual([]);
  });
});
