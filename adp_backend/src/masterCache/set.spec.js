// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.set ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.set ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.quickTypeErrorMessage = () => 'mockError';
    global.adp.echoLog = () => {};
    global.adp.masterCache = {};
    global.adp.masterCache.CacheObjectClass = require('./CacheObjectClass');
    global.adp.masterCache.set = require('./set');
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should set an object inside of the mock cache', async (done) => {
    await global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', { mockValue: 'something' });
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='] !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
            check = true;
          }
        }
      }
    }
    if (check) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should set an object inside of the mock cache, with Server Status', async (done) => {
    await global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', { mockValue: 'something' }, 1000, 200);
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='] !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
            if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].getServerStatus() === 200) {
              check = true;
            }
          }
        }
      }
    }
    if (check) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should set an object inside of the mock cache, with Server Status and Content Type', async (done) => {
    await global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', { mockValue: 'something' }, 1000, 200, 'mime');
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='] !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
            if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].getServerStatus() === 200) {
              if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].getContentType() === 'mime') {
                check = true;
              }
            }
          }
        }
      }
    }
    if (check) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should set an subobject inside of the mock cache, with Server Status and Content Type', async (done) => {
    await global.adp.masterCache.set('OBJECTNAME', 'SUBOBJECTNAME', 'ITEM', { mockValue: 'something' }, 1000, 200, 'mime');
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='] !== undefined) {
            if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
              if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='].getServerStatus() === 200) {
                if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='].getContentType() === 'mime') {
                  check = true;
                }
              }
            }
          }
        }
      }
    }
    if (check) {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should fail because OBJ param is empty', async (done) => {
    const result = global.adp.masterCache.set();
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should fail because ID param is empty', async (done) => {
    const result = global.adp.masterCache.set('OBJECTNAME');
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should fail because DATA param is empty', async (done) => {
    const result = global.adp.masterCache.set('OBJECTNAME', null, 'ITEM');
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // =========================================================================================== //
});
