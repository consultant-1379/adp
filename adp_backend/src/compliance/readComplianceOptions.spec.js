/* eslint-disable global-require */
// ============================================================================================= //
/**
* Unit test for [ global.adp.compliance.readComplianceOptions ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
const globalComplianceOptionsSchema = JSON.parse(JSON.stringify(require('./../setup/schema_complianceoptions.json').complianceOptionsSchema));
const mockData = require('./readComplianceOptions.spec.json');

let dbFindSuccess = true;
class MockComplianceOption {
  getByType(TYPE) {
    const complianceOptionDatabaseValue = {
      group: {
        docs: mockData.groups,
      },
      answer: {
        docs: mockData.answers,
      },
      setting: {
        docs: mockData.settings,
      },
    };
    return new Promise((resolve, reject) => {
      if (dbFindSuccess) {
        switch (TYPE) {
          case 'group':
            resolve(complianceOptionDatabaseValue.group);
            return complianceOptionDatabaseValue.group;
          case 'answer':
            resolve(complianceOptionDatabaseValue.answer);
            return complianceOptionDatabaseValue.answer;
          case 'field':
            resolve(complianceOptionDatabaseValue.answer);
            return complianceOptionDatabaseValue.answer;
          case 'setting':
            resolve(complianceOptionDatabaseValue.setting);
            return complianceOptionDatabaseValue.setting;
          default:
            break;
        }
      }
      const errorOBJ = {};
      reject(errorOBJ);
      return errorOBJ;
    });
  }

  getFieldByGroupID() {
    const complianceOptionDatabaseValue = {
      group: {
        docs: mockData.groups,
      },
      answer: {
        docs: mockData.answers,
      },
      setting: {
        docs: mockData.settings,
      },
    };
    return new Promise((resolve, reject) => {
      if (dbFindSuccess) {
        resolve(complianceOptionDatabaseValue.answer);
        return complianceOptionDatabaseValue.answer;
      }
      const errorOBJ = {};
      reject(errorOBJ);
      return errorOBJ;
    });
  }
}

describe('Testing results of [ global.adp.compliance.readComplianceOptions ] ', () => {
  const complianceCacheValue = 'mock cache';
  let masterCacheSuccessResp = true;
  dbFindSuccess = true;
  beforeAll(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Complianceoption = MockComplianceOption;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;
    global.adp.getSizeInMemory = () => 123456;
    global.adp.timeStepNext = () => '';
    global.adp.dynamicSort = require('./../library/dynamicSort');
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.complianceOptions = globalComplianceOptionsSchema;
    global.adp.complianceOptions = {};
    global.adp.complianceOptions.cache = {};
    global.adp.compliance = {};
    global.adp.compliance.readComplianceOptions = require('./readComplianceOptions');
    global.adp.cache = {};
    global.adp.cache.timeInSecondsForDatabase = 10;
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.complianceOptions = 10;
    global.adp.masterCache = {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      if (masterCacheSuccessResp) {
        RESOLVE(complianceCacheValue);
        return complianceCacheValue;
      }
      const errorOBJ = {};
      REJECT(errorOBJ);
      return errorOBJ;
    });
    global.adp.masterCache.set = () => true;
  });

  beforeEach(() => {
    masterCacheSuccessResp = true;
    dbFindSuccess = true;
  });

  afterAll(() => {
    global.adp = null;
  });

  it('getComplianceOptions: Send complianceoptions response from valid master cache', async (done) => {
    const testDate = new Date();
    global.adp.complianceOptions.cache.date = testDate.setDate(testDate - 5);
    await global.adp.compliance.readComplianceOptions.getComplianceOptions()
      .then((RESP) => {
        expect(RESP).toEqual(complianceCacheValue);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('getComplianceOptions: Send complianceoptions response from database and set cache', async (done) => {
    const testDate = new Date();
    global.adp.complianceOptions.cache.date = testDate.setDate(testDate - 5);
    masterCacheSuccessResp = false;
    await global.adp.compliance.readComplianceOptions.getComplianceOptions()
      .then((RESP) => {
        expect(RESP).toBeDefined();
        expect(Object.keys(JSON.parse(RESP))).toContain('groups');
        expect(Object.keys(JSON.parse(RESP))).toContain('answers');
        done();
      }).catch((error) => {
        done.fail(error);
      });
  });

  it('getComplianceOptions: Rejects in case of db error', async (done) => {
    const testDate = new Date();
    global.adp.complianceOptions.cache.date = testDate.setDate(testDate - 5);
    masterCacheSuccessResp = false;
    dbFindSuccess = false;
    await global.adp.compliance.readComplianceOptions.getComplianceOptions()
      .then(() => {
        expect(true).toBeFalsy();
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
  // =========================================================================================== //
});
