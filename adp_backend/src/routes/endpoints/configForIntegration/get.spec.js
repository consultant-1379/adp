// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.configForIntegration ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.routes.endpoints.configForIntegration.get ] ', () => {
  // =========================================================================================== //

  beforeEach(() => {
    global.adp = {};

    global.mockExpect = {};
    global.mockExpect.endResult = {};

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];
    adp.setHeaders = RES => RES;

    adp.config = {};

    adp.routes = {};
    adp.routes.endpoints = {};
    adp.routes.endpoints.configForIntegration = {};
    adp.routes.endpoints.configForIntegration.get = require('./get');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case retriving correct mimer information.', (done) => {
    adp.config.mimerServer = 'http://localhost:1080/';
    adp.config.muninServer = 'http://localhost:1080/';
    adp.config.eridocServer = 'https://erid2rest.internal.ericsson.com/';
    adp.config.mockServerAddress = 'MockedServedAddress';
    adp.config.mockServerPort = 'MockedServerPort';
    adp.config.primDDServer = 'MockedprimeDDServer';
    adp.config.mockArtifactoryAddress = 'MockArtifactoryAddress';
    adp.config.mockServer = 'MockServer';
    adp.config.environmentID = 'MockEnvID';

    const req = {};
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.gotAllValues).toBeTruthy();
        done();
      },
    };
    adp.routes.endpoints.configForIntegration.get(req, res);
  });

  it('Negative case retriving mimer URL information.', (done) => {
    const req = {};
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.gotAllValues).toBeFalsy();
        done();
      },
    };
    adp.routes.endpoints.configForIntegration.get(req, res);
  });
});
