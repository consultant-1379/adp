const joi = require('joi');
const proxyquire = require('proxyquire');
/**
* Unit test for [ global.adp.microservices.MicroservicesController ]
* @author Cein
*/
class MockAdp {
  getMsById(data) {
    return new Promise((res, rej) => {
      if (global.adp.MockAdpResp.getMsByIdres) {
        if (global.adp.MockAdpResp.forceEmpty) {
          res({ docs: [] });
        } else {
          const newData = data.map(id => ({ _id: id }));
          res({ docs: newData });
        }
      } else {
        rej();
      }
    });
  }
}

describe('Testing results of [ global.adp.microservices.MicroservicesController ] ', () => {
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
    global.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.MockAdpResp = {
      getMsByIdres: true,
      forceEmpty: false,
    };

    adp.microservice = {};
    adp.microservice.updateAssetDocSettings = assetObj => assetObj;

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

    global.adp.masterCacheTimeOut = { allAssetsNormalised: 1 };

    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.listOptions = {};

    adp.microservices = {};
    adp.microservices.MicroservicesController = proxyquire('./MicroservicesController', {
      './../library/errorLog': global.mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('validateIds: should return true on a successful match', (done) => {
    const microservicesContr = new global.adp.microservices.MicroservicesController();
    const msList = ['id1', 'id2'];

    microservicesContr.validateListOfMSIds(msList).then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('validateIds: should reject if the give id is not found', (done) => {
    global.adp.MockAdpResp.forceEmpty = true;

    const microservicesContr = new global.adp.microservices.MicroservicesController();

    microservicesContr.validateListOfMSIds(['id1']).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(400);
      done();
    });
  });

  it('validateIds: should reject if the model fails', (done) => {
    global.adp.MockAdpResp.getMsByIdres = false;
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    microservicesContr.validateListOfMSIds(['id1']).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('addMsToNormalisedCache, getNomalisedCacheByMsId: should set and retrieve cached microservices successfully', (done) => {
    const microservicesContr = new global.adp.microservices.MicroservicesController();
    const inCacheMs = { _id: 'testId' };
    const notInCacheMs = { _id: 'testId2' };

    const getArr = [inCacheMs._id, notInCacheMs._id];

    microservicesContr.addMsToNormalisedCache([inCacheMs]).then((setResult) => {
      expect(setResult).toBeTruthy();
      microservicesContr.getNomalisedCacheByMsId(getArr).then((getResult) => {
        expect(getResult.cachedMs.length).toBe(1);
        expect(getResult.msNotInCache.length).toBe(1);
        expect(getResult.cachedMs[0]._id).toBe(inCacheMs._id);
        expect(getResult.msNotInCache[0]).toBe(notInCacheMs._id);
        done();
      }).catch(() => done.fail());
    }).catch(() => done.fail());
  });

  it('addMsToNormalisedCache: should reject if incorrect param data is passed.', async (done) => {
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    await microservicesContr.addMsToNormalisedCache('notArr').then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });
    await microservicesContr.addMsToNormalisedCache([])
      .then(() => done.fail()).catch((errArrSize) => {
        expect(errArrSize.code).toBe(400);
      });

    await microservicesContr.addMsToNormalisedCache([{}])
      .then(() => done.fail()).catch((errEmptyObj) => {
        expect(errEmptyObj.code).toBe(400);
      });

    await microservicesContr.addMsToNormalisedCache([{ _id: true }])
      .then(() => done.fail()).catch((errIdNotStr) => {
        expect(errIdNotStr.code).toBe(400);
      });

    await microservicesContr.addMsToNormalisedCache([{ _id: ' ' }])
      .then(() => done.fail()).catch((errIdEmptyStr) => {
        expect(errIdEmptyStr.code).toBe(400);
      });

    done();
  });

  it('addMsToNormalisedCache: should reject if mastercache rejects', (done) => {
    cacheMock.setRes = false;

    const microservicesContr = new global.adp.microservices.MicroservicesController();

    microservicesContr.addMsToNormalisedCache([{ _id: 'testId' }]).then(() => done.fail()).catch((err) => {
      expect(err.code).toBe(500);
      done();
    });
  });

  it('getNomalisedCacheByMsId: should resolve if mastercache rejects with the passed item in the msNotInCache array', (done) => {
    cacheMock.getRes = false;
    const testId = 'testId';
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    microservicesContr.getNomalisedCacheByMsId([testId]).then((result) => {
      expect(result.msNotInCache.length).toBe(1);
      expect(result.msNotInCache[0]).toBe(testId);
      done();
    }).catch(() => done.fail());
  });

  it('getNomalisedCacheByMsId: should reject if incorrect param data is passed.', async (done) => {
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    await microservicesContr.getNomalisedCacheByMsId('notArr').then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });
    await microservicesContr.getNomalisedCacheByMsId([])
      .then(() => done.fail()).catch((errArrSize) => {
        expect(errArrSize.code).toBe(400);
      });

    await microservicesContr.getNomalisedCacheByMsId([true])
      .then(() => done.fail()).catch((errIdNotStr) => {
        expect(errIdNotStr.code).toBe(400);
      });

    await microservicesContr.getNomalisedCacheByMsId([' '])
      .then(() => done.fail()).catch((errIdEmptyStr) => {
        expect(errIdEmptyStr.code).toBe(400);
      });

    done();
  });

  it('getById: should resolve with cached data only.', (done) => {
    const inCacheMs = { _id: 'testId' };
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    microservicesContr.addMsToNormalisedCache([inCacheMs]).then((setResult) => {
      expect(setResult).toBeTruthy();
      microservicesContr.getById([inCacheMs._id]).then((result) => {
        expect(result[0]._id).toBe(inCacheMs._id);
        done();
      }).catch(() => done.fail());
    }).catch(() => done.fail());
  });

  it('getById: should reject if incorrect param data is passed.', async (done) => {
    const microservicesContr = new global.adp.microservices.MicroservicesController();

    await microservicesContr.getById('notArr').then(() => done.fail()).catch((errArr) => {
      expect(errArr.code).toBe(400);
    });
    await microservicesContr.getById([])
      .then(() => done.fail()).catch((errArrSize) => {
        expect(errArrSize.code).toBe(400);
      });

    await microservicesContr.getById([true])
      .then(() => done.fail()).catch((errIdNotStr) => {
        expect(errIdNotStr.code).toBe(400);
      });

    await microservicesContr.getById([' '])
      .then(() => done.fail()).catch((errIdEmptyStr) => {
        expect(errIdEmptyStr.code).toBe(400);
      });

    done();
  });

  describe('getDenormalisedDocumentsById()', () => {
    it('Successful case where list of denormalised microservices is fetched', (done) => {
      const microservicesContr = new global.adp.microservices.MicroservicesController();
      const msList = ['id1', 'id2'];

      microservicesContr.getDenormalisedDocumentsById(msList)
        .then((response) => {
          expect(response.length).toEqual(2);
          expect(response[0]._id).toEqual(msList[0]);
          expect(response[1]._id).toEqual(msList[1]);
          done();
        })
        .catch(() => done.fail());
    });

    it('Handle error in catch block if getMsById() fails', (done) => {
      global.adp.MockAdpResp.getMsByIdres = false;
      const microservicesContr = new global.adp.microservices.MicroservicesController();
      const msList = ['id1', 'id2'];

      microservicesContr.getDenormalisedDocumentsById(msList).then(() => done.fail())
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.desc).toEqual('Failure to retrieved denormalised microservices by given microservice id list');
          expect(ERROR.data.microservicesIdList).toEqual(msList);
          done();
        });
    });

    it('Handle error if denormMsList.length === 0', (done) => {
      global.adp.MockAdpResp.forceEmpty = true;
      const msList = ['id1', 'id2'];
      const microservicesContr = new global.adp.microservices.MicroservicesController();
      microservicesContr.getDenormalisedDocumentsById(msList).then(() => done.fail())
        .catch((ERROR) => {
          expect(ERROR.code).toEqual(400);
          expect(ERROR.desc).toEqual('No microservices found by give id list.');
          expect(ERROR.data.microservicesIdList).toEqual(msList);
          done();
        });
    });
  });
});
