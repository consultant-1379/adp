// ============================================================================================= //
/**
* Unit test for [ adp.integration.documentRefresh ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing [ adp.integration.documentRefresh ] behavior.', () => {
  // =========================================================================================== //
  class mockAdpLog {
    createOne() {
      if (adp.behavior.adpLogCreateOne === 0) {
        return new Promise(RES => RES());
      }
      const mockError = 'mockError';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};

    adp.behavior = {};
    adp.behavior.updateService = 0;
    adp.behavior.adpLogCreateOne = 0;

    adp.models = {};
    adp.models.AdpLog = mockAdpLog;

    adp.echoLog = () => {};
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.artifactoryRepo = {};
    adp.artifactoryRepo.updateService = () => {
      if (adp.behavior.updateService === 0) {
        return true;
      }
      throw new Error(JSON.stringify({ code: 500, message: 'MockError' }));
    };

    adp.integration = {};
    adp.integration.documentRefresh = proxyquire('./documentRefresh', {
      '../library/errorLog': adp.mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ update ] in a successful case.', (done) => {
    const mockMicroService = { _id: 'mockID', name: 'mockName', slug: 'mock-slug' };
    const mockObjective = 'randomMockString';
    adp.integration.documentRefresh.update(mockMicroService, mockObjective)
      .then((RESULT) => {
        expect(RESULT.statusCode).toEqual(200);
        expect(RESULT.yamlErrors).toEqual([]);
        expect(RESULT.yamlErrorsQuant).toEqual(0);
        expect(RESULT.yamlWarnings).toEqual([]);
        expect(RESULT.yamlWarningsQuant).toEqual(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  // This test expects an error, but the function should not reject
  // because the value should be saved on the queue and the queue
  // should proceed to the next job.
  it('Testing [ update ] if [ updateService ] breaks.', (done) => {
    adp.behavior.updateService = 1;
    const mockMicroService = { _id: 'mockID', name: 'mockName', slug: 'mock-slug' };
    adp.integration.documentRefresh.update(mockMicroService)
      .then((RESULT) => {
        expect(RESULT.status).toEqual(500);
        expect(RESULT.error).toBeDefined();
        expect(RESULT.ms).toBeDefined();
        expect(RESULT.statusCode).toEqual(500);
        expect(RESULT.yamlErrorsQuant).toEqual(1);
        expect(RESULT.yamlWarningsQuant).toEqual(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  // This test expects an error, but the function should not reject
  // because the value should be saved on the queue and the queue
  // should proceed to the next job.
  it('Testing [ update ] if [ updateService ] and [ createOne inside of recordError ] breaks.', (done) => {
    adp.behavior.updateService = 1;
    adp.behavior.adpLogCreateOne = 1;
    const mockMicroService = { _id: 'mockID', name: 'mockName', slug: 'mock-slug' };
    adp.integration.documentRefresh.update(mockMicroService)
      .then((RESULT) => {
        expect(RESULT.status).toEqual(500);
        expect(RESULT.error).toBeDefined();
        expect(RESULT.ms).toBeDefined();
        expect(RESULT.statusCode).toEqual(500);
        expect(RESULT.yamlErrorsQuant).toEqual(1);
        expect(RESULT.yamlWarningsQuant).toEqual(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ clearCache ] in a successful case.', async (done) => {
    const mockMicroServiceID = 'mockMicroServiceID';
    adp.masterCache = {};
    adp.masterCache.results = [];
    adp.masterCache.clear = (P1, P2, P3) => {
      adp.masterCache.results.push({ P1, P2, P3 });
    };
    try {
      await adp.integration.documentRefresh.clearCache(mockMicroServiceID);

      expect(adp.masterCache.results[0].P1).toEqual('ALLASSETS');
      expect(adp.masterCache.results[0].P2).toBeNull();
      expect(adp.masterCache.results[0].P3).toEqual('mockMicroServiceID');
      expect(adp.masterCache.results[1].P1).toEqual('DOCUMENTS');
      expect(adp.masterCache.results[1].P2).toEqual('mockMicroServiceID');
      expect(adp.masterCache.results[1].P3).not.toBeDefined();
      done();
    } catch (ERROR) {
      expect(ERROR).not.toBeDefined();
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing [ analyseErrorsAndWarnings ] in a successful case.', (done) => {
    const mockMenu1 = {
      auto: {
        errors: {
          development: ['MockError'],
          release: [],
        },
        warnings: {
          development: [],
          release: [],
        },
      },
      manual: {
        errors: {
          development: [],
          release: [],
        },
        warnings: {
          development: [],
          release: [],
        },
      },
    };
    const mockMenu2 = {
      auto: {
        errors: {},
        warnings: {},
      },
      manual: {
        errors: {},
        warnings: {},
      },
    };
    const mockMenu3 = {
      auto: {},
      manual: {},
    };
    const rawMenu = '';
    const msId = 'MockMicroserviceId';
    const msSlug = 'MockMicroserviceSlug';
    try {
      const result1 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu1, true, rawMenu, msId, msSlug,
      );

      expect(result1.errors).toEqual(1);
      expect(result1.warnings).toEqual(0);

      const result2 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu1, false, rawMenu, msId, msSlug,
      );

      expect(result2.errors).toEqual(0);
      expect(result2.warnings).toEqual(0);

      const result3 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu2, true, rawMenu, msId, msSlug,
      );

      expect(result3.errors).toEqual(0);
      expect(result3.warnings).toEqual(0);

      const result4 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu2, false, rawMenu, msId, msSlug,
      );

      expect(result4.errors).toEqual(0);
      expect(result4.warnings).toEqual(0);

      const result5 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu3, true, rawMenu, msId, msSlug,
      );

      expect(result5.errors).toEqual(0);
      expect(result5.warnings).toEqual(0);

      const result6 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        mockMenu3, false, rawMenu, msId, msSlug,
      );

      expect(result6.errors).toEqual(0);
      expect(result6.warnings).toEqual(0);

      const result7 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        {}, true, rawMenu, msId, msSlug,
      );

      expect(result7.errors).toEqual(0);
      expect(result7.warnings).toEqual(0);

      const result8 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        {}, false, rawMenu, msId, msSlug,
      );

      expect(result8.errors).toEqual(0);
      expect(result8.warnings).toEqual(0);

      const result9 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        undefined, true, rawMenu, msId, msSlug,
      );

      expect(result9.errors).toEqual(0);
      expect(result9.warnings).toEqual(0);

      const result10 = adp.integration.documentRefresh.analyseErrorsAndWarnings(
        undefined, false, rawMenu, msId, msSlug,
      );

      expect(result10.errors).toEqual(0);
      expect(result10.warnings).toEqual(0);

      done();
    } catch (ERROR) {
      expect(ERROR).not.toBeDefined();
      done.fail();
    }
  });
  // ------------------------------------------------------------------------------------------- //
});
