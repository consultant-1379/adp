// ============================================================================================= //
/**
* Unit test for [ adp.backendStarted ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ adp.backendStarted ]', () => {
  class MockAdpLog {
    createOne(OBJ) {
      return new Promise((RES, REJ) => {
        if (adp.mock.createOneBehavior === 0) {
          adp.mock.createOneResult = OBJ;
          RES();
          return;
        }
        adp.mock.createOneResult = null;
        REJ();
      });
    }
  }

  beforeEach(() => {
    global.adp = {};
    adp.mock = {
      createOneBehavior: 0,
      createOneResult: null,
    };
    adp.timeStepNext = () => {};
    adp.echoLog = () => {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    adp.backendStarted = require('./backendStarted');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ adp.backendStarted ] simple successful case.', async (done) => {
    adp.config = {};
    adp.config.mssqldb = {};
    adp.config.ldap = {};
    await adp.backendStarted();

    expect(adp.mock.createOneResult).not.toBeNull();
    done();
  });

  it('[ adp.backendStarted ] complex successful case.', async (done) => {
    process.env.PORTAL_FUNC_USER = 'mockUser';
    process.env.PORTAL_FUNC_USER_PASSWORD = 'mockPassword';
    adp.config = {};
    adp.config.siteAddress = 'Mock address';
    adp.config.ldap = {};
    adp.config.ldap.url = 'Mock LDAP URL';
    adp.config.ldap.bindDN = 'Mock LDAP BindDN';
    adp.config.ldap.searchBase = 'Mock LDAP SearchBase';
    adp.config.ldap.searchFilter = 'Mock LDAP SearchFilter';
    adp.config.ldap.timeout = 'Mock LDAP Timeout';
    adp.config.ldap.connectTimeout = 'Mock LDAP Connect Timeout';
    adp.config.ldap.reconnect = 'Mock LDAP Reconnect';
    adp.config.ldap.bindCredentials = 'Mock LDAP Credentials';
    adp.config.mongodb = 'Mock Mongo Connection';
    adp.config.elasticSearchAddress = 'Mock ElasticSearch Address';
    adp.config.elasticSearchWordpressIndex = 'Mock ElasticSearch Wordpress Address';
    adp.config.elasticSearchMicroservicesIndex = 'Mock ElasticSearch Microservices Address';
    adp.config.elasticSearchMsDocumentationIndex = 'Mock ElasticSearch Microservices Documentation Address';
    adp.config.mssqldb = {
      user: 'mockUser',
      password: 'mockPassword',
      server: 'mockServer',
      encrypt: 'mockEncrypt',
      database: 'mockDatabase',
      trustServerCertificate: 'mockCertificate',
    };
    adp.config.wordpress = {};
    adp.config.wordpress.url = 'mockURL';
    adp.config.wordpress.tutorials = {};
    adp.config.wordpress.tutorials.link = 'mockLink';
    adp.config.contributorsStatistics = {};
    adp.config.contributorsStatistics.gerritApi = 'mockAPIURL';
    adp.config.asciidoctorService = 'mockAsciiDoctorServiceURL';
    adp.config.azure = {
      url: 'mockURL',
      grant_type: 'mockType',
      resource: 'mockResource',
    };
    adp.config.peopleFinderApiUrl = 'mockPeopleFinder';
    adp.config.adpHelmDataFile = 'mockHelm';
    await adp.backendStarted();

    expect(adp.mock.createOneResult).not.toBeNull();
    done();
  });

  it('[ adp.backendStarted ] if [ createOne @ adp.models.AdpLog ] breaks.', async (done) => {
    adp.mock.createOneBehavior = 1;
    await adp.backendStarted();

    expect(adp.mock.createOneResult).toBeNull();
    done();
  });
});
// ============================================================================================= //
