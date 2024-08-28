const joi = require('joi');
/**
* Unit test for [ global.adp.listOptions.ListOptionsController ]
* @author Cein
*/
class MockListoption {
  getById(data) {
    return new Promise((res, rej) => {
      if (global.adp.mockListOptionResp.getByIdres) {
        if (global.adp.mockListOptionResp.forceEmpty) {
          res({ docs: [] });
        } else {
          res({ docs: data });
        }
      } else {
        rej();
      }
    });
  }

  groupItemsByGroupId() {
    const { res, data } = adp.mockListOptionResp.groupItemsByGroupId;
    if (res) {
      return Promise.resolve(data);
    }
    return Promise.reject(data);
  }
}

describe('Testing results of [ global.adp.listOptions.ListOptionsController ] ', () => {
  let cacheMock;

  beforeAll(() => {
    global.joi = joi;
  });

  beforeEach(() => {
    cacheMock = {
      setRes: true,
      getRes: true,
    };

    adp = {};
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.mockListOptionResp = {
      getByIdres: true,
      forceEmpty: false,
    };

    global.adp.mockListOptionResp.groupItemsByGroupId = {
      res: true,
      data: [],
    };

    global.adp.masterCache = {};
    global.adp.masterCache.mockCacheObj = {};
    global.adp.masterCache.set = (param1, param2, cacheId, cacheObj) => new Promise((res, rej) => {
      if (cacheMock.setRes) {
        global.adp.masterCache.mockCacheObj[cacheId] = cacheObj;
        res();
      } else {
        rej();
      }
    });
    global.adp.masterCache.get = (param1, param2, cacheId) => new Promise((res, rej) => {
      if (cacheMock.getRes) {
        if (global.adp.masterCache.mockCacheObj[cacheId]) {
          res(global.adp.masterCache.mockCacheObj[cacheId]);
        } else {
          rej();
        }
      } else {
        rej();
      }
    });
    adp.masterCacheTimeOut = { listOptionsNormalised: 1 };

    adp.models = {};
    adp.models.Listoption = MockListoption;
    adp.listOptions = {};
    adp.listOptions.ListOptionsController = require('./ListOptionsController');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('validateIds: should return valid with listopts array', (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();
    const listOpIds = ['id1', 'id2'];

    listOptsContr.validateIds(listOpIds, true).then((result) => {
      expect(result.valid).toBeTruthy();
      expect(result.data[0]).toBe(listOpIds[0]);
      expect(result.data[1]).toBe(listOpIds[1]);
      done();
    }).catch(() => done.fail());
  });

  it('validateIds: should reject if the db return does not match the list given', (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();
    const listOpIds = ['id1', 'id2'];

    global.adp.mockListOptionResp.forceEmpty = true;

    listOptsContr.validateIds(listOpIds)
      .then(() => done.fail())
      .catch((err) => {
        expect(err.code).toBe(400);
        done();
      });
  });

  it('validateIds: should reject if getById model request fails', (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();
    const listOpIds = ['id1', 'id2'];

    global.adp.mockListOptionResp.getByIdres = false;

    listOptsContr.validateIds(listOpIds)
      .then(() => done.fail())
      .catch((err) => {
        expect(err.code).toBe(500);
        done();
      });
  });

  it('setNormalisedCache, getNormalisedCacheById: should set and retrieve cached listoptions successfully', (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();
    const inCachelistOpts = { _id: 'testId' };
    const notInCacheListOpt = { _id: 'testId2' };

    const getArr = [inCachelistOpts._id, notInCacheListOpt._id];

    listOptsContr.setNormalisedCache([inCachelistOpts]).then((setResult) => {
      expect(setResult).toBeTruthy();
      listOptsContr.getNormalisedCacheById(getArr).then((getResult) => {
        expect(getResult.cachedItems.length).toBe(1);
        expect(getResult.notCachedItems.length).toBe(1);
        expect(getResult.cachedItems[0]._id).toBe(inCachelistOpts._id);
        expect(getResult.notCachedItems[0]).toBe(notInCacheListOpt._id);
        done();
      }).catch(() => done.fail());
    }).catch(() => done.fail());
  });

  it('setNormalisedCache: should reject if incorrect param data is passed.', async (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();

    await listOptsContr.setNormalisedCache('notArr').then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });
    await listOptsContr.setNormalisedCache([]).then(() => done.fail()).catch((errArrSize) => {
      expect(errArrSize.code).toBe(400);
    });
    await listOptsContr.setNormalisedCache([{}]).then(() => done.fail()).catch((errEmptyObj) => {
      expect(errEmptyObj.code).toBe(400);
    });

    await listOptsContr.setNormalisedCache([{ _id: true }])
      .then(() => done.fail()).catch((errIdNotStr) => {
        expect(errIdNotStr.code).toBe(400);
      });

    await listOptsContr.setNormalisedCache([{ _id: ' ' }])
      .then(() => done.fail()).catch((errIdEmptyStr) => {
        expect(errIdEmptyStr.code).toBe(400);
      });

    done();
  });

  it('setNormalisedCache: should reject if mastercache rejects', (done) => {
    cacheMock.setRes = false;

    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.setNormalisedCache([{ _id: 'testId' }]).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('getNormalisedCacheById: should resolve if mastercache rejects with the passed item in the notCachedItems array', (done) => {
    cacheMock.getRes = false;
    const testId = 'testId';
    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.getNormalisedCacheById([testId]).then((result) => {
      expect(result.notCachedItems.length).toBe(1);
      expect(result.notCachedItems[0]).toBe(testId);
      done();
    }).catch(() => done.fail());
  });

  it('getNormalisedCacheById: should reject if incorrect param data is passed.', async (done) => {
    const listOptsContr = new adp.listOptions.ListOptionsController();

    await listOptsContr.getNormalisedCacheById('notArr').then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });
    await listOptsContr.getNormalisedCacheById([]).then(() => done.fail()).catch((errArrSize) => {
      expect(errArrSize.code).toBe(400);
    });

    await listOptsContr.getNormalisedCacheById([true])
      .then(() => done.fail()).catch((errIdNotStr) => {
        expect(errIdNotStr.code).toBe(400);
      });

    await listOptsContr.getNormalisedCacheById([' '])
      .then(() => done.fail()).catch((errIdEmptyStr) => {
        expect(errIdEmptyStr.code).toBe(400);
      });

    done();
  });

  it('getById: should resolve with cached data only.', (done) => {
    const inCachelistOpts = { _id: 'testId' };
    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.setNormalisedCache([inCachelistOpts]).then((setResult) => {
      expect(setResult).toBeTruthy();
      listOptsContr.getById([inCachelistOpts._id]).then((result) => {
        expect(result[0]._id).toBe(inCachelistOpts._id);
        done();
      }).catch(() => done.fail());
    }).catch(() => done.fail());
  });

  it('getById: should reject if the cache.', (done) => {
    const inCachelistOpts = { _id: 'testId' };
    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.setNormalisedCache([inCachelistOpts]).then((setResult) => {
      expect(setResult).toBeTruthy();
      listOptsContr.getById([inCachelistOpts._id]).then((result) => {
        expect(result[0]._id).toBe(inCachelistOpts._id);
        done();
      }).catch(() => done.fail());
    }).catch(() => done.fail());
  });

  it('groupItemsByGroupId: should return groupItem data.', (done) => {
    const testObj = { test: true };
    adp.mockListOptionResp.groupItemsByGroupId.data = [testObj];

    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.groupItemsByGroupId().then((resp) => {
      expect(resp[0].test).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('groupItemsByGroupId: should reject if the model groupItemsByGroupId returns empty.', (done) => {
    adp.mockListOptionResp.groupItemsByGroupId.data = [];

    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.groupItemsByGroupId(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      expect(err.message).toContain('empty');
      done();
    });
  });

  it('groupItemsByGroupId: should reject if the model rejects.', (done) => {
    const testErr = 'error';
    adp.mockListOptionResp.groupItemsByGroupId.data = testErr;
    adp.mockListOptionResp.groupItemsByGroupId.res = false;

    const listOptsContr = new adp.listOptions.ListOptionsController();

    listOptsContr.groupItemsByGroupId(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      expect(err.data.error).toBe(testErr);
      done();
    });
  });
});
