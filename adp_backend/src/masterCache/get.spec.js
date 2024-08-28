// ============================================================================================= //
/**
* Unit test for [ global.adp.masterCache.get ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing of [ global.adp.masterCache.get ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.quickTypeErrorMessage = () => 'mockError';
    global.adp.echoLog = () => {};
    global.adp.masterCache = {};
    global.adp.masterCache.CacheObjectClass = require('./CacheObjectClass');
    global.adp.masterCache.get = require('./get');
    global.adp.masterCache.set = require('./set');
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Requesting for a value, for now, cache doesn`t exist and promise should be reject', async (done) => {
    global.adp.masterCache.get('OBJECTNAME', null, 'ITEM')
      .then(() => {
        fail();
        done();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Rejected promise should generate the value to be cached', async (done) => {
    const mockToCache = { result: 'To be cached!' };
    global.adp.masterCache.get('OBJECTNAME', null, 'ITEM')
      .then(() => {
        fail();
        done();
      })
      .catch(() => {
        global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', mockToCache, 10000);
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
  });
  // ------------------------------------------------------------------------------------------- //
  it('Recovery value from cache', async (done) => {
    const mockToCache = { result: 'To be cached!' };
    global.adp.masterCache.get('OBJECTNAME', null, 'ITEM')
      .then(() => {
        fail();
        done();
      })
      .catch(() => {
        global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', mockToCache, 10000);
        let check = false;
        if (global.adp.masterCache.cache !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
            if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='] !== undefined) {
              if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
                global.adp.masterCache.get('OBJECTNAME', null, 'ITEM')
                  .then((RESULTFROMCACHE) => {
                    expect(RESULTFROMCACHE).toBe(mockToCache);
                    done();
                  })
                  .catch(() => {
                    fail();
                    done();
                  });
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
  });
  // ------------------------------------------------------------------------------------------- //
  it('Recovery value from cache with SubObject', async (done) => {
    const mockToCache = { result: 'To be cached!' };
    global.adp.masterCache.get('OBJECTNAME', 'SUBOBJECTNAME', 'ITEM', 10000)
      .then(() => {
        fail();
        done();
      })
      .catch(() => {
        global.adp.masterCache.set('OBJECTNAME', 'SUBOBJECTNAME', 'ITEM', mockToCache, 10000);
        let check = false;
        if (global.adp.masterCache.cache !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
            if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME !== undefined) {
              if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='] !== undefined) {
                if (global.adp.masterCache.cache.OBJECTNAME.SUBOBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
                  global.adp.masterCache.get('OBJECTNAME', 'SUBOBJECTNAME', 'ITEM')
                    .then((RESULTFROMCACHE) => {
                      expect(RESULTFROMCACHE).toBe(mockToCache);
                      done();
                    })
                    .catch(() => {
                      fail();
                      done();
                    });
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
  });
  // ------------------------------------------------------------------------------------------- //
  it('Request the Class instead of the content and check the Server Status', async (done) => {
    const mockToCache = { result: 'To be cached!' };
    global.adp.masterCache.get('OBJECTNAME', null, 'ITEM')
      .then(() => {
        fail();
        done();
      })
      .catch(() => {
        global.adp.masterCache.set('OBJECTNAME', null, 'ITEM', mockToCache, 10000, 200);
        let check = false;
        if (global.adp.masterCache.cache !== undefined) {
          if (global.adp.masterCache.cache.OBJECTNAME !== undefined) {
            if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='] !== undefined) {
              if (global.adp.masterCache.cache.OBJECTNAME['SVRFTQ=='].cache.status === 'CACHED') {
                global.adp.masterCache.get('OBJECTNAME', null, 'ITEM', true)
                  .then((RESULTFROMCACHE) => {
                    expect(RESULTFROMCACHE.getServerStatus()).toBe(200);
                    expect(RESULTFROMCACHE.getData()).toBe(mockToCache);
                    done();
                  })
                  .catch(() => {
                    fail();
                    done();
                  });
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
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing OBJ as wrong parameter', async (done) => {
    global.adp.masterCache.get([], null, 'ITEM', 10000)
      .then(() => {
        fail();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.length).toBeGreaterThan(0);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing OBJA as wrong parameter', async (done) => {
    global.adp.masterCache.get('OBJECTNAME', {}, 'ITEM')
      .then(() => {
        fail();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.length).toBeGreaterThan(0);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing ID as wrong parameter', async (done) => {
    global.adp.masterCache.get('OBJECTNAME', null, 0)
      .then(() => {
        fail();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.length).toBeGreaterThan(0);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing MS as wrong parameter', async (done) => {
    global.adp.masterCache.get('OBJECTNAME', null, 'ITEM', 10000)
      .then(() => {
        fail();
        done();
      })
      .catch((ERROR) => {
        expect(ERROR.length).toBeGreaterThan(0);
        done();
      });
  });
  // =========================================================================================== //
});
