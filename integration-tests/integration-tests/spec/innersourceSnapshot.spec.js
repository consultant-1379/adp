const { mockServerClient } = require('mockserver-client');
const config = require('../test.config.js');
const data = require('../test.data.js');
const { MockResponseBuilder, jsonMatch, GroupMeta } = require('./mockutils.js');
const { PortalPrivateAPI } = require('./apiClients');

const portal = new PortalPrivateAPI();

const mockServer = mockServerClient(config.mockServerHost, config.mockServerPort);


let microserviceIDInnersource;

let originalValue;

describe('Basic tests for the team history snapshots', () => {
  beforeAll(async (done) => {
    originalValue = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    await portal.login();
    done();
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalValue;
  });

   it('update mock, add user to the team mailer, new snapshot should be generated, data updated in peopleFinder, date_created set to 1st Jan', async (done) => {
    // mock peoplefinder data
    const builder = new MockResponseBuilder();
    await mockServer.clear({ path: '/token' });
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
          data.peopleFinder_esupuse,
          data.peopleFinder_etesuse,
          { mailNickname: 'etesase', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    // read MSId and call team history endpoint to return latest snapshot
    await portal.login();
    const microserviceIDInnersource1 = await portal.readMicroserviceId('auto-ms-test-innersource-1');
    const assets = [
      { _id: microserviceIDInnersource1 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);
    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase');
    const memberFoundEtesuse = teamPeopleFinder.some(member => member.mailNickname === 'etesuse');
    const memberFoundEsupuse = teamPeopleFinder.some(member => member.mailNickname === 'esupuse');

    expect(memberFoundEtesase).toBeTruthy();
    expect(memberFoundEtesuse).toBeTruthy();
    expect(memberFoundEsupuse).toBeTruthy();
    expect(teamHistoryDateCreated).toBeDefined();
    expect(teamHistoryDateUpdated).not.toBeDefined();
    expect(teamPeopleFinder.length).toBe(3);
    expect(responseInnersource.code).toBe(200);
    done();
  });

   it('update mock, remove user from team mailer, new snapshot should be generated, data updated in peopleFinder on that snapshot', async (done) => {
    const builder = new MockResponseBuilder();
    await mockServer.clear({ path: '/token' });
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
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'etesase', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    // read MSId and call team history endpoint to return latest snapshot
    await portal.login();
    const microserviceIDInnersource1 = await portal.readMicroserviceId('auto-ms-test-innersource-1');
    const assets = [
      { _id: microserviceIDInnersource1 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);
    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase');
    const memberFoundEtesuse = teamPeopleFinder.some(member => member.mailNickname === 'etesuse');
    const memberFoundEsupuse = teamPeopleFinder.some(member => member.mailNickname === 'esupuse');

    expect(memberFoundEtesase).toBeTruthy();
    expect(memberFoundEtesuse).toBeFalsy();
    expect(memberFoundEsupuse).toBeFalsy();
    expect(teamHistoryDateCreated).toBeDefined();
    expect(teamHistoryDateUpdated).not.toBeDefined();
    expect(teamPeopleFinder.length).toBe(3);
    expect(responseInnersource.code).toBe(200);
    done();
  });

   it('update mock with new information fr the user, new snapshot should be generated, data updated in peopleFinder on that snapshot', async (done) => {
    const builder = new MockResponseBuilder();
    await mockServer.clear({ path: '/token' });
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
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'etesase', objectCategory: 'CN=Person', department: 'Dev&Ops Department' },
        ],
      })
      .create());

    // read MSId and call team history endpoint to return latest snapshot
    await portal.login();
    const microserviceIDInnersource1 = await portal.readMicroserviceId('auto-ms-test-innersource-1');
    const assets = [
      { _id: microserviceIDInnersource1 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);
    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);

    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase' && member.department === 'Dev&Ops Department');


    expect(memberFoundEtesase).toBeTruthy();
    expect(teamPeopleFinder.length).toBe(3);
    expect(responseInnersource.code).toBe(200);
    done();
  });

   it('add new user to the team mailer mock, new snapshot should be generated, data updated in peopleFinder on that snapshot, portal data stays the same', async (done) => {
    const builder = new MockResponseBuilder();
    await mockServer.clear({ path: '/token' });
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
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'etesase', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    // read MSId and call team history endpoint to return latest snapshot
    await portal.login();
    const microserviceIDInnersource2 = await portal.readMicroserviceId('auto-ms-test-innersource-2');
    const assets = [
      { _id: microserviceIDInnersource2 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);
    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);
    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase');

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFoundEtesuse = teamPortal.some(member => member.signum === 'etesuse');
    const memberFoundEsupuse = teamPortal.some(member => member.signum === 'esupuse');

    expect(memberFoundEtesase).toBeTruthy();
    expect(memberFoundEtesuse).toBeTruthy();
    expect(memberFoundEsupuse).toBeTruthy();
    expect(teamHistoryDateCreated).toBeDefined();
    expect(teamPeopleFinder.length).toBe(3);
    expect(responseInnersource.code).toBe(200);
    done();
  });

  it('Create microservice, new snapshot should be generated with team member added to the latest snapshot, date_created set to 1st Jan 2020', async (done) => {
    await portal.login();
    const msData = data.demoService_innersource;
    microserviceIDInnersource = await portal.createMS(msData);

    const assets = [
      { _id: microserviceIDInnersource },
    ];

    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamPortal.length).toBe(1);
    expect(responseInnersource.code).toBe(200);

    done();
  });

  it('No update on Microservice, new snapshot should not be generated, date_created set to 1st Jan 2020', async (done) => {
    await portal.login();
    const microserviceIDms5 = await portal.readMicroserviceId('auto-ms-test-5');
    const assets = [
      { _id: microserviceIDms5 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateCreated).toBeDefined();
    expect(teamPortal.length).toBe(1);
    expect(responseInnersource.code).toBe(200);
    done();
  });

  it('should update existing Microservice, add team member, new snapshot should be generated with team member added to the latest snapshot, date_created set to 1st Jan 2020', async (done) => {
    await portal.login();
    const microserviceIDms5 = await portal.readMicroserviceId('auto-ms-test-5');

    const msDataInnersource = data.demoService_5;
    const responseUpdated = await portal.updateMS(msDataInnersource, microserviceIDms5);

    expect(responseUpdated.code).toBe(200);

    const assets = [
      { _id: microserviceIDms5 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'emesuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateUpdated).toBeDefined();
    expect(teamPortal.length).toBe(2);
    expect(responseInnersource.code).toBe(200);
    done();
  });


  it('should update existing Microservice, remove team member, new snapshot should be generated with team member removed', async (done) => {
    await portal.login();
    const microserviceIDms5 = await portal.readMicroserviceId('auto-ms-test-5');

    const msDataInnersource = data.demoService_5;
    msDataInnersource.team = [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'emesuse',
      },
    ];
    const responseUpdated = await portal.updateMS(msDataInnersource, microserviceIDms5);

    expect(responseUpdated.code).toBe(200);

    const assets = [
      { _id: microserviceIDms5 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFoundEmesuse = teamPortal.some(member => member.signum === 'emesuse');
    const memberFoundEsupuse = teamPortal.some(member => member.signum === 'esupuse');

    expect(memberFoundEmesuse).toBeTruthy();
    expect(memberFoundEsupuse).toBeFalsy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateUpdated).toBeDefined();
    expect(teamPortal.length).toBe(1);
    expect(responseInnersource.code).toBe(200);
    done();
  });

  it('Delete microservice, error should be sent as snapshots for deleted microservice is not avaliable', async (done) => {
    await portal.login();
    const microserviceIDInnersourceTeam = await portal.readMicroserviceId('test-ms-innersource-team');
    await portal.deleteMS(microserviceIDInnersourceTeam);

    const assets = [
      { _id: microserviceIDInnersourceTeam },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);

    expect(responseInnersource.code).toBe(400);
    done();
  });

  it('No existing snapshot for the MS, forceLaunchDate = false, new snapshot should be generated, date_created set to 1st Jan 2020', async (done) => {
    await portal.login();
    const microserviceIDInnersource3 = await portal.readMicroserviceId('auto-ms-test-innersource-3');
    const assets = [
      { _id: microserviceIDInnersource3 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDate = responseInnersource.body.data.latestSnapshots[0].date_created;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDate).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamPortal.length).toBe(2);
    expect(responseInnersource.code).toBe(200);

    done();
  });

   it('Snapshot already exist for the MS, new snapshot should not be be generated and snapshot should not be updated', async (done) => {
    await portal.login();
    const microserviceIDInnersource5 = await portal.readMicroserviceId('auto-ms-test-innersource-5');
    const assets = [
      { _id: microserviceIDInnersource5 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDate = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;
    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'etesuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDate).toBeDefined();
    expect(teamPortal.length).toBe(1);
    expect(teamHistoryDateUpdated).not.toBeDefined();
    expect(responseInnersource.code).toBe(200);

    done();
  });

  it('Snapshot already exists, update MS forceLaunchDate = false, new snapshot should be generated, date_updated set to 1st Jan 2020', async (done) => {
    await portal.login();
    const microserviceIDInnersource3 = await portal.readMicroserviceId('auto-ms-test-innersource-3');
    const msDataInnersource = data.demoService_innersource_3;
    const responseUpdated = await portal.updateMS(msDataInnersource, microserviceIDInnersource3);

    expect(responseUpdated.code).toBe(200);
    const assets = [
      { _id: microserviceIDInnersource3 },
    ];

    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');


    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateUpdated).toBeDefined();
    expect(teamPortal.length).toBe(1);
    expect(responseInnersource.code).toBe(200);

    done();
  });

  it('Snapshot already exist, update MS with team mailer from mock, new snapshot should be generated, date_updated set to 1st Jan 2020', async (done) => {
    const builder = new MockResponseBuilder();
    await mockServer.clear({ path: '/token' });
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
        totalNoOfResults: 1,
        elements: [
          { mailNickname: 'etesase', objectCategory: 'CN=Person' },
        ],
      })
      .create());

    await portal.login();
    const microserviceIDInnersource3 = await portal.readMicroserviceId('auto-ms-test-innersource-3');
    const msDataInnersource = data.demoService_innersource_3;
    msDataInnersource.team_mailers = [
      'sample-mailer@ericsson.com',
    ];
    const responseUpdated = await portal.updateMS(msDataInnersource, microserviceIDInnersource3);

    expect(responseUpdated.code).toBe(200);
    const assets = [
      { _id: microserviceIDInnersource3 },
    ];

    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);

    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase');

    expect(memberFoundEtesase).toBeTruthy();
    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateUpdated).toBeDefined();
    expect(teamPortal.length).toBe(2);
    expect(responseInnersource.code).toBe(200);

    done();
  });

  it('Snapshot already exists, update MS, remove team mailer from MS, new snapshot should be generated, date_updated set to 1st Jan 2020', async (done) => {
    await portal.login();
    const microserviceIDInnersource3 = await portal.readMicroserviceId('auto-ms-test-innersource-3');
    const msDataInnersource = data.demoService_innersource_3;
    msDataInnersource.team_mailers = undefined;
    const responseUpdated = await portal.updateMS(msDataInnersource, microserviceIDInnersource3);

    expect(responseUpdated.code).toBe(200);
    const assets = [
      { _id: microserviceIDInnersource3 },
    ];

    const responseInnersource = await portal.microserviceLatestSnapshot(assets, false);

    const teamMembers = responseInnersource.body.data.latestSnapshots[0].team;
    const teamHistoryDateCreated = responseInnersource.body.data.latestSnapshots[0].date_created;
    const teamHistoryDateUpdated = responseInnersource.body.data.latestSnapshots[0].date_updated;

    const teamPortal = teamMembers.map(v => v.portal);
    const memberFound = teamPortal.some(member => member.signum === 'esupuse');

    const teamPeopleFinder = teamMembers.map(v => v.peopleFinder);

    const memberFoundEtesase = teamPeopleFinder.some(member => member.mailNickname === 'etesase');

    expect(memberFoundEtesase).toBeFalsy();
    expect(memberFound).toBeTruthy();
    expect(teamHistoryDateCreated).toEqual('2020-01-01T00:00:00.000Z');
    expect(teamHistoryDateUpdated).toBeDefined();
    expect(teamPortal.length).toBe(1);
    expect(responseInnersource.code).toBe(200);

    done();
  });

   it('Request two microservices on the endpoint returning latest snapshot, two snapshots should be returned', async (done) => {
    await portal.login();
    const microserviceIDInnersource2 = await portal.readMicroserviceId('auto-ms-test-innersource-2');
    const microserviceIDInnersource3 = await portal.readMicroserviceId('auto-ms-test-innersource-3');
    const assets = [
      { _id: microserviceIDInnersource2 },
      { _id: microserviceIDInnersource3 },
    ];
    const responseInnersource = await portal.microserviceLatestSnapshot(assets);
    const teamMembers = responseInnersource.body.data.latestSnapshots;

    expect(teamMembers.length).toBe(2);
    expect(responseInnersource.code).toBe(200);
    done();
  });
});
