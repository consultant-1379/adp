// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.shortcut ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.shortcut ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.quickTypeErrorMessage = () => 'mockError';
    global.adp.echoLog = () => {};
    global.adp.masterCache = {};
    global.adp.masterCache.CacheObjectClass = require('./CacheObjectClass');
    global.adp.masterCache.shortcut = require('./shortcut');
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should set a shortcut object inside of the mock shortcut cache', async (done) => {
    await global.adp.masterCache.shortcut('OBJECTNAME', null, 'ITEM', { mockValue: 'something', slug: 'anything' });
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT['YW55dGhpbmc='] !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT['YW55dGhpbmc='].id === 'ITEM') {
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
  it('Should set a shortcut subobject inside of the mock shortcut cache', async (done) => {
    await global.adp.masterCache.shortcut('OBJECTNAME', 'SUBOBJECTNAME', 'ITEM', { mockValue: 'something', slug: 'anything' });
    let check = false;
    if (global.adp.masterCache.cache !== undefined) {
      if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT !== undefined) {
        if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT.SUBOBJECTNAME !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT.SUBOBJECTNAME['YW55dGhpbmc='] !== undefined) {
            if (global.adp.masterCache.cache.OBJECTNAMESHORTCUT.SUBOBJECTNAME['YW55dGhpbmc='].id === 'ITEM') {
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
  it('Should fail because OBJ param is empty', async (done) => {
    const result = global.adp.masterCache.shortcut();
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should fail because ID param is empty', async (done) => {
    const result = global.adp.masterCache.shortcut('OBJECTNAME');
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Should fail because DATA param is empty', async (done) => {
    const result = global.adp.masterCache.shortcut('OBJECTNAME', null, 'ITEM');
    if (typeof result === 'string') {
      done();
    } else {
      fail();
      done();
    }
  });
  // =========================================================================================== //
});
