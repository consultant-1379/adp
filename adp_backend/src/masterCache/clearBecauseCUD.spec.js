// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.clearBecauseCUD ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.clearBecauseCUD ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.MockCache = {
      MARKETPLACESEARCHS: false,
      INNERSOURCECONTRIBS: false,
      ALLASSETS: false,
      ALLUSERS: false,
      MSGETBYONWER: false,
      ALLASSETSNORMALISED: false,
      DOCUMENTS: false,
    };
    global.adp.masterCache = {};
    global.adp.masterCache.clearBecauseCUD = require('./clearBecauseCUD');
    global.adp.masterCache.clear = (STR) => {
      global.adp.MockCache[STR] = true;
    };
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should clear all by but the DOCUMENTS cache if no asset id is given', async (done) => {
    await global.adp.masterCache.clearBecauseCUD();

    Object.keys(global.adp.MockCache).forEach((cacheKey) => {
      if (cacheKey !== 'DOCUMENTS') {
        expect(global.adp.MockCache[cacheKey]).toBeTruthy();
      } else {
        expect(global.adp.MockCache[cacheKey]).toBeFalsy();
      }
    });
    done();
  });

  it('Should all cache keys if an Asset id is given', async (done) => {
    await global.adp.masterCache.clearBecauseCUD('assetId');
    Object.keys(global.adp.MockCache).forEach((cacheKey) => {
      expect(global.adp.MockCache[cacheKey]).toBeTruthy();
    });
    done();
  });
  // =========================================================================================== //
});
