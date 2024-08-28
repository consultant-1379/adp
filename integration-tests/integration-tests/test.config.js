// IMPORTANT
// Use behavior = 0; for test environments builds ( 81, 82, etc )
// Use behavior = 1; for VDI local environment
// Use behavior = 81; to use 81 Backend running the Integration Tests from somewhere else.
// Use behavior = 82; to use 82 Backend running the Integration Tests from somewhere else.
// Use behavior = 83; to use 83 Backend running the Integration Tests from somewhere else.
// Use behavior = 84; to use 84 Backend running the Integration Tests from somewhere else.
// Always use behavior = 0; to send to Code Review/Master.
const behavior = 0;


/* eslint-disable import/no-extraneous-dependencies */
const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;

jasmine.getEnv().addReporter(new HtmlReporter({
  path: 'integration_reports',
}));

const { mockServerClient } = require('mockserver-client');

let setupObject = {};
let mockServerHost;
let mockServerPort;
let mockServerPath;
let configuredMockServer;

switch (behavior) {
  case 81:
    global.extraMessagesOnTerminal = true;
    mockServerHost = process.env.MOCK_SERVER_HOST || 'seliius18473.seli.gic.ericsson.se';
    mockServerPort = process.env.MOCK_SERVER_PORT || 56061;
    mockServerPath = process.env.MOCK_SERVER_PATH || '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: process.env.BASEURL || 'https://seliius18473.seli.gic.ericsson.se:58081/api/',
      environmentTag: process.env.ENV_TAG || 'local',
      mockServerUrl: process.env.MOCK_SERVER_URL || 'https://seliius18473.seli.gic.ericsson.se:58081/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'http://seliius18473.seli.gic.ericsson.se:56061',
      strictSSL: false,
    };
    break;
  case 82:
    global.extraMessagesOnTerminal = true;
    mockServerHost = process.env.MOCK_SERVER_HOST || 'seliius18473.seli.gic.ericsson.se';
    mockServerPort = process.env.MOCK_SERVER_PORT || 1080;
    mockServerPath = process.env.MOCK_SERVER_PATH || '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: process.env.BASEURL || 'https://seliius18473.seli.gic.ericsson.se:58082/api/',
      environmentTag: process.env.ENV_TAG || 'local',
      mockServerUrl: process.env.MOCK_SERVER_URL || 'https://seliius18473.seli.gic.ericsson.se:58082/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'http://seliius18473.seli.gic.ericsson.se:56061',
      strictSSL: false,
    };
    break;
  case 83:
    global.extraMessagesOnTerminal = true;
    mockServerHost = process.env.MOCK_SERVER_HOST || 'seliius18473.seli.gic.ericsson.se';
    mockServerPort = process.env.MOCK_SERVER_PORT || 56063;
    mockServerPath = process.env.MOCK_SERVER_PATH || '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: process.env.BASEURL || 'https://seliius18473.seli.gic.ericsson.se:58083/api/',
      environmentTag: process.env.ENV_TAG || 'local',
      mockServerUrl: process.env.MOCK_SERVER_URL || 'https://seliius18473.seli.gic.ericsson.se:58083/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'http://seliius18473.seli.gic.ericsson.se:56063',
      strictSSL: false,
    };
    break;
  case 84:
    global.extraMessagesOnTerminal = true;
    mockServerHost = process.env.MOCK_SERVER_HOST || 'seliius18473.seli.gic.ericsson.se';
    mockServerPort = process.env.MOCK_SERVER_PORT || 56064;
    mockServerPath = process.env.MOCK_SERVER_PATH || '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: process.env.BASEURL || 'https://seliius18473.seli.gic.ericsson.se:58084/api/',
      environmentTag: process.env.ENV_TAG || 'local',
      mockServerUrl: process.env.MOCK_SERVER_URL || 'https://seliius18473.seli.gic.ericsson.se:58084/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'http://seliius18473.seli.gic.ericsson.se:56064',
      strictSSL: false,
    };
    break;
  case 1:
    global.extraMessagesOnTerminal = true;
    mockServerHost = 'localhost';
    mockServerPort = 1080;
    mockServerPath = '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: 'https://localhost:9999/',
      environmentTag: 'local',
      mockServerUrl: 'https://localhost/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'https://localhost:1080',
      strictSSL: false,
    };
    break;
  default:
    global.extraMessagesOnTerminal = true;
    mockServerHost = process.env.MOCK_SERVER_HOST || 'localhost';
    mockServerPort = process.env.MOCK_SERVER_PORT || 1080;
    mockServerPath = process.env.MOCK_SERVER_PATH || '';
    configuredMockServer = mockServerClient(mockServerHost, mockServerPort);
    setupObject = {
      mockServerHost,
      mockServerPort,
      mockServerPath,
      configuredMockServer,
      baseUrl: process.env.BASEURL || 'https://localhost:9999/',
      environmentTag: process.env.ENV_TAG || 'local',
      mockServerUrl: process.env.MOCK_SERVER_URL || 'https://seliius18473.seli.gic.ericsson.se:58090/notify/',
      mockServer: configuredMockServer,
      mockServerTestUrl: 'http://seliius18473.seli.gic.ericsson.se:56061',
      strictSSL: false,
    };
    break;
}

setupObject.testUserAdmin = {
  username: 'esupuse',
  password: 'c3VwZXItcGFzc3dvcmQx',
};
setupObject.testUser = {
  username: 'etesuse',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserOne = {
  username: 'emesuse',
  password: '5ryi5a2XISLCoyQlXiYqKCl7fVtdI34nQDs6PD48Lz58XFxuLixgwqzigqw=',
};
setupObject.testUserEtasase = {
  username: 'etasase',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEtarase = {
  username: 'etarase',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEtapase = {
  username: 'ETAPASE',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEpesuse = {
  username: 'epesuse',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEtesase = {
  username: 'etesase',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEtesuse2 = {
  username: 'etesuse2',
  password: 'dGVzdC1wYXNzd29yZDI=',
};
setupObject.testUserDmapuse = {
  username: 'dmapuse',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserEtesase = {
  username: 'etesase',
  password: 'dGVzdC1wYXNzd29yZDE=',
};
setupObject.testUserAdminClient = {
  username: 'esupuse',
  password: 'super-password1',
};

module.exports = setupObject;
