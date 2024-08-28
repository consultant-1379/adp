/**
 * [ global.adp.access.JWTIntegrationStrategyHandler ]
 * @author Cein [edaccei]
 */
describe('Testing if [ global.adp.access.JWTIntegrationStrategyHandler ] is ready to be used.', () => {
  class mockClass {
    getMSByIdAndSecret() {
      return new Promise((resolve, reject) => {
        if (adp.dbFindFail) {
          reject();
          return;
        }
        resolve(adp.dbFindReturnData);
      });
    }
  }

  beforeEach(() => {
    global.adp = {};
    adp.dbFindReturnData = { docs: [] };
    adp.dbFindFail = false;
    global.adp.docs = {};
    global.adp.docs.list = [];
    adp.models = {};
    adp.models.Adp = mockClass;
    global.adp.echoLog = () => {};
    global.adp.access = {};
    global.adp.access.JWTIntegrationStrategyHandler = require('./JWTIntegrationStrategyHandler');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should be loaded in memory & ready for use.', (done) => {
    expect(global.adp.access.JWTIntegrationStrategyHandler).toBeDefined();
    done();
  });

  it('should return Unauthorized if the access_token data is not set.', (done) => {
    global.adp.access.JWTIntegrationStrategyHandler({}, (callbackMessage) => {
      expect(callbackMessage).toContain('Unauthorized');
      done();
    });
  });

  it('should return Unauthorized if the db query fails.', (done) => {
    const testObj = { msid: 'test', inval_secret: 'test' };
    adp.dbFindFail = true;

    global.adp.access.JWTIntegrationStrategyHandler(testObj, (callbackMessage) => {
      expect(callbackMessage).toContain('Unauthorized');
      done();
    });
  });

  it('should return Unauthorized if the query finds no microservices.', (done) => {
    const testObj = { msid: 'test', inval_secret: 'test' };

    global.adp.access.JWTIntegrationStrategyHandler(testObj, (callbackMessage) => {
      expect(callbackMessage).toContain('Unauthorized');
      done();
    });
  });

  it('should return return all microservice data to the given data.', (done) => {
    const testObj = { msid: 'test', inval_secret: 'test' };
    const testData = 'testResult';
    adp.dbFindReturnData.docs.push(testData);

    global.adp.access.JWTIntegrationStrategyHandler(testObj, (nullData, callbackdata) => {
      expect(callbackdata.user).toBeTruthy();
      expect(callbackdata.user.signum).toEqual('portalSystem');
      expect(callbackdata.user.role).toEqual('admin');
      expect(callbackdata.asset).toBe(testData);
      done();
    });
  });
});
