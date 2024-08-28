const urljoin = require('url-join');
const request = require('request');
const config = require('../test.config.js');
const { mockServer } = require('../test.config.js');
const login = require('../endpoints/login.js');
const { MockResponseBuilder, jsonMatch } = require('./mockutils.js');

/* eslint-disable no-await-in-loop */

class PeopleFinderAPI {
  constructor(token) {
    this.mailerTeamEndpoint = 'peoplefinder/mailerTeam';
    this.functionalUsersEndpoint = 'peoplefinder/functionalUser';
    this.peopleSearchEndpoint = 'peoplefinder/person';
    this.token = token;
  }

  functionalUser(signum, callback) {
    const options = {
      url: urljoin(config.baseUrl, this.functionalUsersEndpoint, signum),
      json: true,
      headers: { Authorization: this.token },
      strictSSL: false,
    };
    return request.get(options, callback);
  }

  people(signum, callback) {
    const options = {
      url: urljoin(config.baseUrl, this.peopleSearchEndpoint, signum),
      json: true,
      headers: { Authorization: this.token },
      strictSSL: false,
    };
    return request.get(options, callback);
  }

  mailerTeam(mailerList, callback) {
    const options = {
      url: urljoin(config.baseUrl, this.mailerTeamEndpoint),
      json: true,
      body: mailerList,
      headers: { Authorization: this.token },
      strictSSL: false,
    };
    return request.get(options, callback);
  }
}

function GroupMeta(displayName, nickname, email) {
  return {
    email,
    objectCategory: 'CN=Group,CN=Schema,CN=Configuration,DC=ericsson,DC=se',
    mailNickname: nickname,
    displayName,
  };
}

function Group(nickname, displayName, email, members) {
  const group = GroupMeta(displayName, nickname, email);
  group.elements = members;
  return group;
}
function Person(nickname, email) {
  return { mailNickname: nickname, email, objectCategory: 'CN=Person' };
}

async function standardSearchSetup(displayName, groupMetaList) {
  const builder = new MockResponseBuilder();
  await mockServer.mockAnyResponse(builder.matchPostRequest(
    '/people-finder/outlookDistribution/searchpdl/search',
    jsonMatch({ displayName }),
  )
    .expectResponse(200, {
      totalNoOfResults: 1,
      hasNext: false,
      elements: groupMetaList,
    })
    .create());
}

let token = 'Bearer ';
let peopleFinder = null;

let originalValue;

describe('Basic tests for the peoplefinder API', () => {
  beforeAll((done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

    request.post(login.optionsAdmin, (error, response, body) => {
      token += login.callback(error, response, body);
      peopleFinder = new PeopleFinderAPI(token);
      done();
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

  it('should only get functional users from the functional users endpoint', async (done) => {
    await mockServer.clear({ path: '/token' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'POST',
        path: '/token',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({ access_token: 'sample_token' }),
      },
      times: {
        unlimited: true,
      },
    });
    await mockServer.clear({ path: '/people-finder/functionalUser/eadpusers' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/functionalUser/eadpusers',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            email: 'email',
            name: 'tom',
            signType: 'U',
            org: 'ericsson',
          },
          {
            email: 'email',
            name: 'auto',
            signType: 'A',
            org: 'ericsson',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    peopleFinder.functionalUser('eadpusers', (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;

      expect(data.length).toBe(1);
      expect(data[0].signType).toBe('A');
      done();
    });
  });

  it('should only get users from the people endpoint', async (done) => {
    await mockServer.clear({ path: '/token' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'POST',
        path: '/token',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({ access_token: 'sample_token' }),
      },
      times: {
        unlimited: true,
      },
    });
    await mockServer.clear({ path: '/people-finder/people/search/efghijk' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/efghijk',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify([
          {
            email: 'email',
            name: 'tom',
            signType: 'U',
            org: 'ericsson',
          },
          {
            email: 'email',
            name: 'auto',
            signType: 'A',
            org: 'ericsson',
          },
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    peopleFinder.people('efghijk', (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;

      expect(data.length).toBe(1);
      expect(data[0].signType).toBe('U');
      done();
    });
  });

  it('should indicate a failure to find any users on people endpoint', async (done) => {
    await mockServer.clear({ path: '/token' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'POST',
        path: '/token',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 200,
        body: JSON.stringify({ access_token: 'sample_token' }),
      },
      times: {
        unlimited: true,
      },
    });
    await mockServer.clear({ path: '/people-finder/people/search/enonef' });
    await mockServer.mockAnyResponse({
      httpRequest: {
        method: 'GET',
        path: '/people-finder/people/search/enonef',
        body: { type: 'JSON' },
      },
      httpResponse: {
        statusCode: 404,
        body: JSON.stringify([
        ]),
      },
      times: {
        unlimited: true,
      },
    });
    peopleFinder.people('enonef', (error, response) => {
      expect(response.statusCode).toBe(404);
      const { data } = response.body;

      expect(data.length).toBe(0);
      done();
    });
  });


  it('should resolve members in a combination of flat and nested mailers', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group1' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group1 Mailer', 'group1', 'group1@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group2' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group2 Mailer', 'group2', 'group2@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group3' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group3 Mailer', 'group3', 'group3@ericsson.com')],
      })
      .create());

    // Pages
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 3,
        hasNext: false,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'group1', objectCategory: 'CN=Group' },
          { mailNickname: 'group2', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group1', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        hasNext: false,
        elements: [
          { mailNickname: 'person2', objectCategory: 'CN=Person' },
          { mailNickname: 'group3', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group2', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [
          { mailNickname: 'person4', objectCategory: 'CN=Person' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group3', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [
          { mailNickname: 'person3', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(4);
      expect(nickNames).toContain('person1');
      expect(nickNames).toContain('person2');
      expect(nickNames).toContain('person3');
      expect(nickNames).toContain('person4');
      done();
    });
  });

  it('should resolve members in a combination of flat and nested mailers ignoring cycles in group references', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group1' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group1 Mailer', 'group1', 'group1@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group2' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group2 Mailer', 'group2', 'group2@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group3' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Group3 Mailer', 'group3', 'group3@ericsson.com')],
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'group1', objectCategory: 'CN=Group' },
          { mailNickname: 'group2', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group1', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person2', objectCategory: 'CN=Person' },
          { mailNickname: 'group3', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group2', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person4', objectCategory: 'CN=Person' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group3', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person3', objectCategory: 'CN=Person' },
          { mailNickname: 'group1', objectCategory: 'CN=Group' },
          { mailNickname: 'group3', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(4);
      expect(nickNames).toContain('person1');
      expect(nickNames).toContain('person2');
      expect(nickNames).toContain('person3');
      expect(nickNames).toContain('person4');
      done();
    });
  });

  it('should resolve members in a combination of flat and nested mailers to a limited depth', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );
    // { 'page': ['1'] }
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person0', objectCategory: 'CN=Person' },
          { mailNickname: 'group0', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    const limit = 21;
    for (let levelCount = 0; levelCount < limit; levelCount += 1) {
      await mockServer.mockAnyResponse(builder.matchPostRequest(
        '/people-finder/outlookDistribution/searchpdl/search',
        jsonMatch({ displayName: `group${levelCount}` }),
      )
        .expectResponse(200, {
          totalNoOfResults: 1,
          hasNext: false,
          elements: [GroupMeta('Sample Mailer', `group${levelCount}`, `group${levelCount}@ericsson.com`)],
        })
        .create());

      await mockServer.mockAnyResponse(builder.matchPostRequest(
        '/people-finder/outlookDistribution/searchpdl/members',
        jsonMatch({ displayName: `group${levelCount}`, authMembers: false }),
        { page: ['1'] },
      )
        .expectResponse(200, {
          totalNoOfResults: 2,
          elements: [
            { mailNickname: `person${levelCount + 1}`, objectCategory: 'CN=Person' },
            { mailNickname: `group${levelCount + 1}`, objectCategory: 'CN=Group' },
          ],
        })
        .create());
    }

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(20);
      expect(nickNames).toContain('person19');
      expect(nickNames).not.toContain('person20'); //
      done();
    });
  });

  it('should resolve members in a flat mailers', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')],
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 3,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'person2', objectCategory: 'CN=Person' },
          { mailNickname: 'person3', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(3);
      expect(nickNames).toContain('person1');
      expect(nickNames).toContain('person2');
      expect(nickNames).toContain('person3');
      done();
    });
  });

  it('should resolve members across several pages on the mailer api', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    const groups1 = [GroupMeta('sample mailer', 'esamail', 'sample-mailer@ericsson.com')];

    const people1 = [...Array(10).keys()].map(number => Person(`person${number}`));
    const people2 = [...Array(1).keys()].map(number => Person(`person${number + 10}`));

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, { totalNoOfResults: 1, hasNext: false, elements: groups1 })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 1,
        pageSize: 9,
        hasNext: true,
        elements: people1,
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({
        displayName: 'sample-mailer',
        authMembers: false,
      }),
      { page: ['2'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 2,
        pageSize: 1,
        hasNext: false,
        elements: people2,
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(11);
      expect(nickNames).toContain('person1');
      expect(nickNames).toContain('person9');
      expect(nickNames).toContain('person10');
      done();
    });
  });

  it('should resolve nested members across several pages on the mailer api', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    // Setup the search endpoint responses
    const groupsTop = [GroupMeta('sample mailer', 'esamail', 'sample-mailer@ericsson.com')];
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, { totalNoOfResults: 1, hasNext: false, elements: groupsTop })
      .create());

    const groups1 = [GroupMeta('sample mailer', 'group1', 'sample-mailer@ericsson.com')];
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group1' }),
    )
      .expectResponse(200, { totalNoOfResults: 1, hasNext: false, elements: groups1 })
      .create());

    const groups2 = [GroupMeta('sample mailer', 'group2', 'sample-mailer@ericsson.com')];
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'group2' }),
    )
      .expectResponse(200, { totalNoOfResults: 1, hasNext: false, elements: groups2 })
      .create());

    // Set up the members endpoint to return the top level member list
    const peopleTopPage1 = [...Array(9).keys()].map(number => Person(`person${number}`));
    peopleTopPage1.push(Group('group1', 'Group 1', 'group1@ericsson.com'));
    const peopleTopPage2 = [Group('group2', 'Group 2', 'group2@ericsson.com')];

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 1,
        pageSize: 10,
        hasNext: true,
        elements: peopleTopPage1,
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['2'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 2,
        pageSize: 1,
        hasNext: true,
        elements: peopleTopPage2,
      })
      .create());


    // Set up the members endpoint to return the 2 pages of group data from the first page
    const people1Page1 = [...Array(10).keys()].map(number => Person(`g1person${number}`));
    const people1Page2 = [...Array(1).keys()].map(number => Person(`g1person${number + 10}`));

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group1', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 1,
        pageSize: 10,
        hasNext: true,
        elements: people1Page1,
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group1', authMembers: false }),
      { page: ['2'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 2,
        pageSize: 1,
        hasNext: true,
        elements: people1Page2,
      })
      .create());

    // Set up the members endpoint to return the 2 pages of group data from the second page
    const people2PageSize = 10;
    const people2Page1 = [...Array(people2PageSize).keys()].map(number => Person(`g2person${number}`));
    const people2Page2 = [...Array(1).keys()].map(number => Person(`g2person${number + people2PageSize}`));

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group2', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 1,
        pageSize: 10,
        hasNext: true,
        elements: people2Page1,
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group2', authMembers: false }),
      { page: ['2'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 11,
        pageNumber: 2,
        pageSize: 1,
        hasNext: true,
        elements: people2Page2,
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(31); // 9 + 11 + 11
      expect(nickNames).toContain('person1');
      expect(nickNames).toContain('person8');
      expect(nickNames).toContain('g1person1');
      expect(nickNames).toContain('g1person10');
      expect(nickNames).toContain('g2person1');
      expect(nickNames).toContain('g1person10');
      done();
    });
  });

  it('should remove duplicates in flat lists', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/search',
      jsonMatch({ displayName: 'sample-mailer' }),
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        hasNext: false,
        elements: [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')],
      })
      .create());

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(1);
      expect(nickNames).toContain('person1');
      done();
    });
  });

  it('should remove duplicates in a combination of flat and nested mailers', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await standardSearchSetup('sample-mailer', [GroupMeta('Sample Mailer', 'esamail', 'sample-mailer@ericsson.com')]);
    await standardSearchSetup('group1', [GroupMeta('Group1 Mailer', 'group1', 'group1@ericsson.com')]);
    await standardSearchSetup('group2', [GroupMeta('Group2 Mailer', 'group2', 'group2@ericsson.com')]);
    await standardSearchSetup('group3', [GroupMeta('Group3 Mailer', 'group3', 'group3@ericsson.com')]);

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'group1', objectCategory: 'CN=Group' },
          { mailNickname: 'group2', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group1', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 2,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
          { mailNickname: 'group3', objectCategory: 'CN=Group' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'group2', authMembers: false }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
        ],
      })
      .create());
    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({
        displayName: 'group3',
        authMembers: false,
      }),
      { page: ['1'] },
    )
      .expectResponse(200, {
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'person1', objectCategory: 'CN=Person' },
        ],
      })
      .create());
    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;
      const nickNames = data.members.map(m => m.peopleFinder.mailNickname);

      expect(nickNames.length).toBe(1);
      expect(nickNames).toContain('person1');
      done();
    });
  });


  it('should resolve an empty member list', async (done) => {
    await mockServer.clear({ path: '/token' });
    const builder = new MockResponseBuilder();
    await mockServer.mockAnyResponse(
      builder.matchPostRequest('/token')
        .expectResponse(200, { access_token: 'sample_token' })
        .create(),
    );

    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/members' });
    await mockServer.clear({ path: '/people-finder/outlookDistribution/searchpdl/search' });

    await mockServer.mockAnyResponse(builder.matchPostRequest(
      '/people-finder/outlookDistribution/searchpdl/members',
      jsonMatch({ displayName: 'sample-mailer', authMembers: false }),
    )
      .expectResponse(200, {
        totalNoOfResults: 0,
        elements: [
        ],
      })
      .create());

    peopleFinder.mailerTeam(['sample-mailer@ericsson.com'], (error, response) => {
      expect(response.statusCode).toBe(200);
      const { data } = response.body;

      expect(data.members.length).toBe(0);
      done();
    });
  });
});

module.exports = {
  MockResponseBuilder,
  PeopleFinderAPI,
};
