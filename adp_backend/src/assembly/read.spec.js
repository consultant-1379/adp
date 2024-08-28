// ============================================================================================= //
/**
* Unit test for [ global.adp.assesmbly.read ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

class MockAdp {
  getAssetByIDorSLUG(ID) {
    return new Promise((RESOLVE, REJECT) => {
      if (ID === 'MOCKVALIDID') {
        const obj = {
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
        };
        const objArray = [obj];
        RESOLVE({ docs: objArray, totalInDatabase: 10 });
        return { docs: objArray, totalInDatabase: 10 };
      }
      if (ID === 'MOCKVALIDIDWITHTAGS') {
        const obj = {
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
          tags: [
            '49bfab89e2ab4b291d84b4dd7c026945',
            '5c2941141c64cfbcea47e8b16006111a',
            '5c2941141c64cfbcea47e8b160066b59',
          ],
        };
        const objArray = [obj];
        RESOLVE({ docs: objArray, totalInDatabase: 10 });
        return { docs: objArray, totalInDatabase: 10 };
      }
      if (ID === 'NOTFOUNDID') {
        RESOLVE({ docs: [], totalInDatabase: 0 });
        return { docs: [], totalInDatabase: 0 };
      }
      const errorOBJ = {};
      REJECT(errorOBJ);
      return errorOBJ;
    });
  }

  update() {
    return new Promise((RES, REJ) => {
      if (global.adp.setUpdateResult === 1) {
        RES({ ok: false });
      } else if (global.adp.setUpdateResult === 2) {
        const mockError = 'Mock Error on update';
        REJ(mockError);
      } else {
        RES({ ok: true });
      }
    });
  }
}

describe('Testing if [ global.adp.assesmbly.read ] is able to read an Assesmbly (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.mimer = {};
    adp.models.Adp = MockAdp;
    global.adp.clone = J => JSON.parse(JSON.stringify(J));
    global.adp.setCacheToResolve = false;
    adp.mimer.loadFullMergedMenu = ASSETOBJECT => new Promise((RESOLVE) => {
      const asset = ASSETOBJECT;
      asset.menu_merged = {
        type: 'merged',
        version: '1.0.0',
        docs: {
          versionLabel: '1.0.0',
          'release-documents': [
            {
              category_name: 'Release Documents',
              category_slug: 'release-documents',
            },
          ],
        },
      };
      RESOLVE(ASSETOBJECT);
    });
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.masterCache.shortcut = () => true;
    global.adp.masterCache.clearBecauseCUD = () => {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      if (global.adp.setCacheToResolve === true) {
        RESOLVE({ cachedObject: true });
      } else {
        REJECT(); // Simulate there is no cache in Unit Test...
      }
    });
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.allAssets = 5;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.tags = {};
    global.adp.setTagsToReject = false;
    global.adp.tags.reload = () => new Promise((RES, REJ) => {
      if (global.adp.setTagsToReject === true) {
        const mockError = 'Mock Error on Tags';
        REJ(mockError);
      } else {
        RES();
      }
    });
    global.adp.tags.getLabel = (KEY) => {
      switch (KEY) {
        case '49bfab89e2ab4b291d84b4dd7c026945':
          return 'mockTag 1';
        case '5c2941141c64cfbcea47e8b16006111a':
          return 'mockTag 2';
        default:
          return 123;
      }
    };
    global.adp.echoLog = () => {};
    global.adp.migration = {};
    global.adp.setSlugResult = 0;
    global.adp.migration.slugItNow = ASSET => new Promise((RES, REJ) => {
      if (global.adp.setSlugResult === 1) {
        RES(true);
      } else if (global.adp.setSlugResult === 2) {
        const mockError = 'Mock Error on SlugItNow';
        REJ(mockError);
      } else {
        RES(ASSET);
      }
    });
    global.adp.microservices = {};
    global.adp.microservices.userTeamFullData = () => new Promise((RESOLVE) => {
      RESOLVE();
    });
    global.adp.microservices.denormalize = () => new Promise((RESOLVE) => {
      RESOLVE({});
    });
    global.adp.microservice = {};
    global.adp.assembly = {};

    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.assembly.read = proxyquire('./read', {
      '../library/errorLog': mockErrorLog,
    });

    global.adp.microservice.updateAssetDocSettings = assetObj => assetObj;
    global.adp.setUpdateResult = 0;
  });

  afterEach(() => {
    global.adp = null;
  });


  it('Testing with a valid mock ID.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    await global.adp.assembly.read(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });


  it('Testing with a valid mock ID, but cached.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setCacheToResolve = true;
    await global.adp.assembly.read(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });


  it('Testing with a valid mock ID, but Tags reject the promise.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setTagsToReject = true;
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Testing with a valid mock ID, but [global.adp.db.find] returns no registers.', async (done) => {
    const validMockJSON = 'NOTFOUNDID';
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Testing with a valid mock ID, slugItNow returns true.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setSlugResult = 1;
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing with a valid mock ID, slugItNow rejects the promise.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setSlugResult = 2;
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Testing with a valid mock ID, update returns ok = false.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setUpdateResult = 1;
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Testing with a valid mock ID, update reject the promise.', async (done) => {
    const validMockJSON = 'MOCKVALIDID';
    global.adp.setUpdateResult = 2;
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done.fail();
      }).catch(() => {
        done();
      });
  });


  it('Testing with a valid mock ID, with Tags.', async (done) => {
    const validMockJSON = 'MOCKVALIDIDWITHTAGS';
    await global.adp.assembly.read(validMockJSON)
      .then(() => {
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing with a invalid mock ID, Assembly cannot be found.', async (done) => {
    const inValidMockJSON = 'MOCKINVALIDID';
    await global.adp.assembly.read(inValidMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeUndefined();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
