// ============================================================================================= //
/**
* Unit test for [ adp.innerSource.lastAssetStatus ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
class MockAdpLog {
  getContributorsStatisticsByModeID() {
    return new Promise((resolve, reject) => {
      let obj = null;
      if (adp.db.findBehavior === 0) {
        obj = require('./lastAssetStatusTestData');
      } else if (adp.db.findBehavior === 1) {
        obj = require('./lastAssetStatusTestData');
        delete obj.docs[0].success;
        delete obj.docs[0].errors;
        delete obj.docs[1].success;
        delete obj.docs[1].errors;
      } else if (adp.db.findBehavior === 2) {
        obj = require('./lastAssetStatusTestData');
        delete obj.docs;
        obj.docs = [];
      } else {
        const errorText = 'Mock Error';
        reject(errorText);
        return;
      }
      resolve(obj);
    });
  }
}

describe('Testing [ adp.innerSource.lastAssetStatus ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    adp.docs = {};
    adp.docs.list = [];
    adp.clone = J => JSON.parse(JSON.stringify(J));
    adp.dynamicSort = require('./../library/dynamicSort');
    adp.echoLog = () => {};
    adp.innerSource = {};
    adp.innerSource.lastAssetStatus = require('./lastAssetStatus');
    adp.db = {};
    adp.db.findBehavior = 0;
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Testing a successful case using a valid mock slug with a success status', async (done) => {
    const validMockJSON = 'mock-valid-slug';
    adp.innerSource.lastAssetStatus(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(200);
        expect(expectedOBJ.lastStatusResponse.log_date).toBe('2020-11-14T10:00:00.000Z');
        expect(expectedOBJ.lastStatusResponse.desc).toBe('success');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing a successful case using a valid mock slug with a fail status', async (done) => {
    const validMockJSONwithError = 'mock-valid-slug-error';
    adp.innerSource.lastAssetStatus(validMockJSONwithError)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(500);
        expect(expectedOBJ.lastStatusResponse.log_date).toBe('2020-11-13T08:40:22.311Z');
        expect(expectedOBJ.lastStatusResponse.desc).toBe('The field giturl is empty.');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing a case where we do not have registers of the specific asset', async (done) => {
    const validMockJSONwithError = 'mock-slug-not-found';
    adp.innerSource.lastAssetStatus(validMockJSONwithError)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(404);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing a case where there is no success or errors in the answer', async (done) => {
    const validMockJSONwithError = 'mock-slug-not-found';
    adp.db.findBehavior = 1;
    adp.innerSource.lastAssetStatus(validMockJSONwithError)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(404);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing a case with no logs', async (done) => {
    const validMockJSON = 'mock-valid-slug';
    adp.db.findBehavior = 2;
    adp.innerSource.lastAssetStatus(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(404);
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Testing a case where [ adp.db.find ] crashes', async (done) => {
    const validMockJSON = 'mock-valid-slug';
    adp.db.findBehavior = 99;
    adp.innerSource.lastAssetStatus(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ.lastStatusCode).toBe(500);
        done();
      }).catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
