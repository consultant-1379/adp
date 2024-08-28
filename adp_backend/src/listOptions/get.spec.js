// ============================================================================================= //
/**
* Unit test for [ global.adp.listoptions.get ]
* @author Omkar, Armando
*/
/* eslint-disable global-require */
// ============================================================================================= //
const globalListOptionsSchema = JSON.parse(JSON.stringify(require('./../setup/schema_listoptions.json').listOptionsSchema.properties));

class MockListOption {
  indexGroups() {
    return new Promise((RESOLVE, REJECT) => {
      if (global.adp.forceFindGroupCrash === false) {
        RESOLVE(global.adp.listOptionsMockObject.groups);
        return global.adp.listOptionsMockObject.groups;
      }
      const errorOBJ = { forceFindGroupCrash: true };
      REJECT(errorOBJ);
      return errorOBJ;
    });
  }

  getItemsForGroup(id) {
    return new Promise((RESOLVE, REJECT) => {
      if (id === 10) {
        RESOLVE(global.adp.listOptionsMockObject.itemsfromgroup10);
        return global.adp.listOptionsMockObject.itemsfromgroup10;
      }
      if (id === 11) {
        if (global.adp.forceFindItem11Crash === false) {
          RESOLVE(global.adp.listOptionsMockObject.itemsfromgroup11);
          return global.adp.listOptionsMockObject.itemsfromgroup11;
        }
        const errorOBJ = { forceFindItem11Crash: true };
        REJECT(errorOBJ);
        return errorOBJ;
      }
      const errorOBJ = { mockDBError: true };
      REJECT(errorOBJ);
      return errorOBJ;
    });
  }
}
// ============================================================================================= //
describe('Testing results of [ global.adp.listoptions.get ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Listoption = MockListOption;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.listOptions = {};
    global.adp.config.schema.listOptions.properties = JSON
      .parse(JSON.stringify(globalListOptionsSchema));

    global.adp.dynamicSort = require('./../library/dynamicSort');
    global.adp.listOptionsMockObject = require('./get.spec.json');

    global.adp.mock1ToCompare = JSON.stringify(global.adp.listOptionsMockObject.mock1ToCompare);
    global.adp.mock2ToCompare = JSON.stringify(global.adp.listOptionsMockObject.mock2ToCompare);

    global.adp.listOptionsMockString = JSON.stringify(global.adp.listOptionsMockObject);

    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.mockResolve = false;
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      if (global.adp.masterCache.mockResolve === true) {
        RESOLVE(global.adp.mock1ToCompare);
      } else {
        const mockError = 'mockError';
        REJECT(mockError);
      }
    });
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.listOptions = 60;
    // --- MasterCache Mock --- End ------------------------------------------------------------ //

    global.adp.echoLog = STR => STR;
    global.adp.db = {};
    global.adp.getSizeInMemory = () => 123456;
    global.adp.listOptions = {};

    global.adp.forceFindItem11Crash = false;
    global.adp.forceFindGroupCrash = false;

    global.adp.listOptions.get = require('./get');
    global.adp.db.find = (DB, SELECTOR) => new Promise((RESOLVE, REJECT) => {
      if (DB === 'dataBaseListOption') {
        if (SELECTOR.selector !== undefined) {
          if (SELECTOR.selector.type !== undefined) {
            if (SELECTOR.selector.type.$eq === 'group') {
              if (global.adp.forceFindGroupCrash === false) {
                RESOLVE(global.adp.listOptionsMockObject.groups);
                return global.adp.listOptionsMockObject.groups;
              }
              const errorOBJ = { forceFindGroupCrash: true };
              REJECT(errorOBJ);
              return errorOBJ;
            }
          }
        }
        if (SELECTOR.selector !== undefined) {
          if (SELECTOR.selector['group-id'] !== undefined) {
            if (SELECTOR.selector['group-id'].$eq === 10) {
              RESOLVE(global.adp.listOptionsMockObject.itemsfromgroup10);
              return global.adp.listOptionsMockObject.itemsfromgroup10;
            }
          }
        }
        if (SELECTOR.selector !== undefined) {
          if (SELECTOR.selector['group-id'] !== undefined) {
            if (SELECTOR.selector['group-id'].$eq === 11) {
              if (global.adp.forceFindItem11Crash === false) {
                RESOLVE(global.adp.listOptionsMockObject.itemsfromgroup11);
                return global.adp.listOptionsMockObject.itemsfromgroup11;
              }
              const errorOBJ = { forceFindItem11Crash: true };
              REJECT(errorOBJ);
              return errorOBJ;
            }
          }
        }
      }
      const errorOBJ = { mockDBError: true };
      REJECT(errorOBJ);
      return errorOBJ;
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  // =========================================================================================== //


  it('Simple Successful Case Test.', async (done) => {
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock1ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Simple Successful Case Test from cache.', async (done) => {
    global.adp.masterCache.mockResolve = true;
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock1ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Simple Successful Case Test with small problems in Schema Properties.', async (done) => {
    global.adp.config.schema.listOptions.properties.documentationCategories = undefined;
    global.adp.config.schema.listOptions.properties.desc.default = undefined;
    global.adp.config.schema.listOptions.properties.code.requiredFromDB = true;
    await global.adp.listOptions.get()
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful Case Test without Schema Properties.', async (done) => {
    global.adp.config.schema.listOptions = {};
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock2ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful Case Test without Schema listOptions.', async (done) => {
    global.adp.config.schema = {};
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock2ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful Case Test without Schema.', async (done) => {
    global.adp.config = {};
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock2ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful Case Test without config.', async (done) => {
    global.adp.config = undefined;
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock2ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Simple Successful Case Test but [global.adp.listOptions.cache] is null.', async (done) => {
    global.adp.listOptions.cache = null;
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock1ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Simple Successful Case Test but [global.adp.listOptions.cache] is valid.', async (done) => {
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = global.adp.mock1ToCompare;
    global.adp.listOptions.cache.date = new Date();
    global.adp.cache = {};
    global.adp.cache.timeInSecondsForDatabase = 9999;
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock1ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Simple Successful Case Test but [global.adp.listOptions.cache] is expired.', async (done) => {
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = global.adp.mock1ToCompare;
    global.adp.listOptions.cache.date = new Date();
    global.adp.cache = {};
    global.adp.cache.timeInSecondsForDatabase = -10;
    await global.adp.listOptions.get()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual(global.adp.mock1ToCompare);
        done();
      }).catch(() => {
        done.fail();
      });
  });

  it('Case Test where one promise inside of a loop crash.', async (done) => {
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = global.adp.mock1ToCompare;
    global.adp.listOptions.cache.date = new Date();
    global.adp.cache = {};
    global.adp.cache.timeInSecondsForDatabase = -10;
    global.adp.forceFindItem11Crash = true;
    await global.adp.listOptions.get()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.forceFindItem11Crash).toBeTruthy();
        done();
      });
  });


  it('Case Test where [ global.adp.db.find ] will crash.', async (done) => {
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = global.adp.mock1ToCompare;
    global.adp.listOptions.cache.date = new Date();
    global.adp.cache = {};
    global.adp.cache.timeInSecondsForDatabase = -10;
    global.adp.forceFindGroupCrash = true;
    await global.adp.listOptions.get()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.forceFindGroupCrash).toBeTruthy();
        done();
      });
  });
  // =========================================================================================== //
});
