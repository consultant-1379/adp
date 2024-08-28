/**
* Tests for details of innersource top contributors by tag for all the MS for a specific date range
* @author Ravikiran G [ZGARSRI]
*/

const { PortalPrivateAPI } = require('./apiClients');
const data = require('../test.data.js');

const portal = new PortalPrivateAPI();
let innersourceGitType = 'gitstatusbytag';

const dateFormat = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toJSON().split('T')[0];
};

const invalidDate = new Date();
const invalidDateFormat = `${invalidDate.getDate()}-0${invalidDate.getMonth() + 1}-${invalidDate.getFullYear()}`;

const todaysDate = dateFormat(1);
const threeMonthsAgoDate = dateFormat(90);

xdescribe('Testing top innersource contributors endpoint', () => {
  beforeAll(async (done) => {
    await portal.login();
    await portal.gitStatusByTag(innersourceGitType);
    done();
  });

  // case 1.1
  it('[Innersource] Should verify complete list of contributors with default values', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorNoParameters();

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);
    const topContributor1 = responseInnersource.body.data[0].contributionWeight;
    const topContributor2 = responseInnersource.body.data[1].contributionWeight;
    const topContributor3 = responseInnersource.body.data[2].contributionWeight;

    let flag = false;
    if ((topContributor1 > topContributor2) && (topContributor1 > topContributor3)) {
      flag = true;
    }

    expect(flag).toBeTruthy();

    done();
  });

  // case 1.2
  it('[Innersource] Negative case in which given contributor should not present in the results as the @InnerSource tag is not given in the commit(s)', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorNoParameters();

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const contributorWithoutTagCommit = responseInnersource.body.data.filter(contributor => contributor.userId === 'etapase');

    expect(contributorWithoutTagCommit).toEqual([]);

    done();
  });

  // Case 2.1
  it('[Innersource] Should verify default values of each parameter by passing values to the rest', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorSkippedDate(todaysDate,
      data.testTopContributorsData.domain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const topContributor1 = responseInnersource.body.data[0].contributionWeight;
    const topContributor2 = responseInnersource.body.data[1].contributionWeight;
    const topContributor3 = responseInnersource.body.data[2].contributionWeight;

    let flag = false;
    if ((topContributor1 > topContributor2) && (topContributor1 > topContributor3)) {
      flag = true;
    }

    expect(flag).toBeTruthy();

    done();
  });

  // Case 2.2
  it('[Innersource] Should verify default values of each parameter by passing values to the rest ', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorSkippedDomain(
      threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.serviceCategory,
    );

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const topContributor1 = responseInnersource.body.data[0].contributionWeight;
    const topContributor2 = responseInnersource.body.data[1].contributionWeight;

    let flag = false;
    if (topContributor1 > topContributor2) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });

  // Case 3.1
  it('[Innersource] Should verify the appropriate response for the innersource contributors obtained by passing a combination of parameters', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributor(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain,
      data.testTopContributorsData.serviceCategory);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const linesAdded = responseInnersource.body.data[0].micro_services[0].insertions;
    const linesRemoved = responseInnersource.body.data[0].micro_services[0].deletions;
    const actualWeight = responseInnersource.body.data[0].micro_services[0].weight;

    const calculatedWeight = (linesAdded + 0.5 * linesRemoved);

    expect(actualWeight).toEqual(calculatedWeight);

    const topContributor1 = responseInnersource.body.data[0].contributionWeight;
    const topContributor2 = responseInnersource.body.data[1].contributionWeight;

    let flag = false;
    if (topContributor1 > topContributor2) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });

  // Case 3.2
  it('[Innersource] Should verify the appropriate response for the innersource contributors obtained by passing a combination of parameters2', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributor(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain1,
      data.testTopContributorsData.serviceCategory1);

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).not.toEqual();
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).not.toEqual([]);

    const linesAdded = responseInnersource.body.data[0].micro_services[0].insertions;
    const linesRemoved = responseInnersource.body.data[0].micro_services[0].deletions;
    const actualWeight = responseInnersource.body.data[0].micro_services[0].weight;

    const calculatedWeight = (linesAdded + 0.5 * linesRemoved);

    expect(actualWeight).toEqual(calculatedWeight);

    const topContributor1 = responseInnersource.body.data[0].contributionWeight;
    const topContributor2 = responseInnersource.body.data[1].contributionWeight;

    let flag = false;
    if (topContributor1 > topContributor2) {
      flag = true;
    }

    expect(flag).toBeTruthy();
    done();
  });

  // Case 5
  it('[Innersource] Should verify the bad response by passing incorrect/invalid parameters fo date (DD-MM-YYYY)', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributor(invalidDateFormat,
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
    const responseInnersource = await portal.innersourceGetTopContributor(threeMonthsAgoDate,
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
    const responseInnersource = await portal.innersourceGetTopContributor(threeMonthsAgoDate,
      todaysDate, data.testTopContributorsData.domain,
      data.testTopContributorsData.invalidServiceCategory);

    expect(responseInnersource.code).toBe(404);
    expect(responseInnersource.body.total).toEqual(0);
    expect(responseInnersource.body.size).not.toEqual();

    const innersourceContributor = responseInnersource.body.data.filter(contributor => contributor.micro_services !== '');

    expect(innersourceContributor).toEqual([]);

    done();
  });

  it('[Innersource] checking limit=3 on the endpoint to get top contributors', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorNoParameters('?limit=3');

    expect(responseInnersource.code).toBe(200);
    expect(responseInnersource.body.total).toEqual(3);
    expect(responseInnersource.body.size).not.toEqual();

    done();
  });

  it('[Innersource] checking limit=true respond with 400 on the endpoint to get top contributors', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorNoParameters('?limit=true');

    expect(responseInnersource.code).toBe(400);

    done();
  });

  it('[Innersource] checking limit=0 on the endpoint to get top contributors', async (done) => {
    const responseInnersource = await portal.innersourceGetTopContributorNoParameters('?limit=0');

    expect(responseInnersource.code).toBe(400);

    done();
  });

  afterAll(async (done) => {
    innersourceGitType = 'gitstatus';
    await portal.gitStatusByTag(innersourceGitType);
    done();
  });
});
