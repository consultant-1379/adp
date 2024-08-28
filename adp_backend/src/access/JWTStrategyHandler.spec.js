// ============================================================================================= //
/**
* Unit test for [ global.adp.JWTStrategyHandler ]
* @author Armando Schiavon Dias [escharm], Omkar Sadegaonkar
*/
// ============================================================================================= //
describe('Testing if [ global.adp.setupPassport ] is ready to be used.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    adp.user = {};
    adp.userGetError = false;
    adp.echoLog = () => true;
    adp.masterCache = {};
    adp.user.thisUserShouldBeInDatabase = () => new Promise((RES, REJ) => {
      if (adp.userGetError) {
        REJ();
        return;
      }
      RES();
    });
    adp.masterCache.clear = () => true;
    adp.user.get = () => new Promise((RES, REJ) => {
      if (adp.userGetError) {
        REJ();
        return;
      }
      RES();
    });
    adp.mockCallback = () => {
      adp.callbackcalled = true;
    };
    adp.callbackcalled = false;
    global.adp.JWTStrategyHandler = require('./JWTStrategyHandler');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.JWTStrategyHandler ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.JWTStrategyHandler).toBeDefined();
    done();
  });

  it('[ global.adp.JWTStrategyHandler ] should call callback function if user found successfully.', (done) => {
    const mockPayload = { id: 'test' };
    global.adp.JWTStrategyHandler(mockPayload, adp.mockCallback).then(() => {
      expect(adp.callbackcalled).toBeTruthy();
      done();
    })
      .catch(() => {
        expect(true).toBeFalsy();
        done.fail();
      });
  });

  it('[ global.adp.JWTStrategyHandler ] should reject with error call callback function if problem with finding user.', (done) => {
    const mockPayload = { id: 'test' };
    adp.userGetError = true;
    global.adp.JWTStrategyHandler(mockPayload, adp.mockCallback).then(() => {
      expect(adp.callbackcalled).toBeTruthy();
      done();
    })
      .catch(() => {
      });
  });
});
// ============================================================================================= //
