// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.CacheObjectClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.CacheObjectClass ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.masterCache = {};
    global.adp.masterCache.CacheObjectClass = require('./CacheObjectClass');
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should create the class and check the initial status', async (done) => {
    global.adp.mockClass = await new global.adp.masterCache.CacheObjectClass('OBJ', 'SUQ=', 120000);
    if (global.adp.mockClass.isInProgress()) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Lets set a value fullfiling the "waiting" promise', async (done) => {
    global.adp.mockClass = await new global.adp.masterCache.CacheObjectClass('OBJ', 'SUQ=', 120000);
    await global.adp.mockClass.setData({ mockResult: 'This goes to the Cache' });
    if (!global.adp.mockClass.isInProgress()) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('This cache should not be expired', async (done) => {
    global.adp.mockClass = await new global.adp.masterCache.CacheObjectClass('OBJ', 'SUQ=', 120000);
    await global.adp.mockClass.setData({ mockResult: 'This goes to the Cache' });
    if (!global.adp.mockClass.isInProgress()) {
      if (!global.adp.mockClass.isExpired()) {
        done();
      } else {
        fail();
        done();
      }
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Retrieve the cached value', async (done) => {
    global.adp.mockClass = await new global.adp.masterCache.CacheObjectClass('OBJ', 'SUQ=', 120000);
    const mockValue = { mockResult: 'This goes to the Cache' };
    await global.adp.mockClass.setData(mockValue);
    if (!global.adp.mockClass.isInProgress()) {
      if (!global.adp.mockClass.isExpired()) {
        expect(global.adp.mockClass.getData()).toBe(mockValue);
        done();
      } else {
        fail();
        done();
      }
    } else {
      fail();
      done();
    }
  });
  // =========================================================================================== //
});
