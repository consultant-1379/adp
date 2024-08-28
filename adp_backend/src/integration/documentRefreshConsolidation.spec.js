/**
* Unit test for [ adp.integration.documentRefreshConsolidation ]
* @author Tirth Pipalia [zpiptir]
*/

const proxyquire = require('proxyquire');

describe('Testing [ adp.integration.documentRefreshConsolidation ]', () => {
  class MockAdp {
    updateOnlyAutoMenu() {
      if (global.mockBehavior.adpupdateOnlyAutoMenu === 0) {
        const result = { ok: {} };
        return new Promise(RES => RES(result));
      } if (global.mockBehavior.adpupdateOnlyAutoMenu === 1) {
        const result = {};
        return new Promise(RES => RES(result));
      }
      const mockError = 'mockError from updateOnlyAutoMenu';
      return new Promise((RES, REJ) => REJ(mockError));
    }
  }

  class MockQueue {
    addJob() {
      return new Promise(RES => RES());
    }

    getPayload() {
      if (global.mockBehavior.queueGetPayload === 0) {
        const payLoad = {};
        return new Promise(RES => RES(payLoad));
      } if (global.mockBehavior.queueGetPayload === 1) {
        return new Promise(RES => RES());
      }
      const mockError = 'mockError from getPayload';
      return new Promise((_RES, REJ) => REJ(mockError));
    }

    setPayload() {
      if (global.mockBehavior.queueSetPayload === 0) {
        return new Promise(RES => RES({}));
      }
      const mockError = 'mockError from setPayload';
      return new Promise((_RES, REJ) => REJ(mockError));
    }

    currentStatus() {
      if (global.mockBehavior.currentStatus === 0) {
        const currentStatus = 'mockCurrent Status';
        const percentage = 100;
        return new Promise(RES => RES({ currentStatus, percentage }));
      }
      const mockError = 'mockError from currentStatus';
      return new Promise((_RES, REJ) => REJ(mockError));
    }

    groupHeader() {
      if (global.mockBehavior.groupHeader === 0) {
        const RESULT = {
          docs: [
            {
              added: '2022-02-22: 43: 10.194',
              started: '2022-02-22T09:43:10.199Z',
              data: {
                dbResponse: {
                  name: 'mockMS Name',
                  slug: 'mockms-name-slug',
                },
              },
              payload: {
                serverStatusCode: 200,
                name: 'mockMS Name',
                slug: 'mockms-name-slug',
                yamlErrors: { development: [{}, {}], release: [{}, {}, {}] },
                yamlWarnings: { development: [{}, {}], release: [{}] },
                theMenu: {
                  auto: {
                    development: [],
                    release: [{
                      version: 'mockVersionOne',
                      documents: [{}, {}, {}],
                    },
                    {
                      version: 'mockVersionTwo',
                      documents: [{}, {}, {}, {}],
                    },
                    ],
                  },
                },
              },
            },
          ],
        };

        return new Promise(RES => RES(RESULT));
      } if (global.mockBehavior.groupHeader === 1) {
        const RESULT = {
          docs: [
            {
              added: '2022-02-22: 43: 10.194',
              started: '2022-02-22T09:43:10.199Z',
              data: {
                dbResponse: {
                  name: 'mockMS Name',
                  slug: 'mockms-name-slug',
                },
              },
              payload: {
                status: 1,
                yamlErrors: { },
                yamlWarnings: { },
                theMenu: {
                  auto: {
                    development: [],
                    release: [{
                      version: 'mockVersionOne',
                      documents: [{}, {}, {}],
                    },
                    {
                      version: 'mockVersionTwo',
                      documents: [{}, {}, {}, {}],
                    },
                    ],
                  },
                },
              },
            },
          ],
        };

        return new Promise(RES => RES(RESULT));
      } if (global.mockBehavior.groupHeader === 3) {
        const RESULT = {
          docs: [
            {
              added: '2022-02-22: 43: 10.194',
              started: '2022-02-22T09:43:10.199Z',
              data: {
                dbResponse: {
                  name: 'mockMS Name',
                  slug: 'mockms-name-slug',
                },
              },
            },
          ],
        };
        return new Promise(RES => RES(RESULT));
      }
      const mockError = 'mockError from groupHeader';
      return new Promise((_RES, REJ) => REJ(mockError));
    }

    queueStatusCodeToString(CODE) {
      switch (CODE) {
        case 0:
          return 'Waiting...';
        case 1:
          return 'Running...';
        case 2:
          return 'Duplicated, ignored. See message to more details.';
        case 3:
          return 'Process crashed. Ignored because reached the maximum number of allowed attempts.';
        default:
          return `Server Status Code: ${CODE}`;
      }
    }
  }


  beforeEach(() => {
    global.adp = {};
    adp = {};
    adp.models = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.models.Adp = MockAdp;
    adp.queue = new MockQueue();

    adp.integration = {};
    adp.integration.documentRefresh = {};
    adp.integration.documentRefresh.clearCache = () => {};

    adp.versionSort = require('../library/versionSort');

    global.garbageCollectorCalled = false;
    global.gc = () => {
      global.garbageCollectorCalled = true;
    };

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.adpupdateOnlyAutoMenu = 0;
    global.mockBehavior.queueGetPayload = 0;
    global.mockBehavior.queueSetPayload = 0;
    global.mockBehavior.groupHeader = 0;
    global.mockBehavior.currentStatus = 0;

    adp.echoLog = () => {};
    adp.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.integration.documentRefreshConsolidation = proxyquire('./documentRefreshConsolidation', {
      '../library/errorLog': adp.mockErrorLog,
    });
  });

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case when yamlErrorsQuants > 0', (done) => {
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.status).toBe(200);
        expect(RESULT.statusMessage).toBe('Server Status Code: 200');
        expect(RESULT.currentStatus).toBe('mockCurrent Status');
        expect(RESULT.percentage).toBe(100);
        expect(RESULT.microserviceName).toBe('mockMS Name');
        expect(RESULT.microserviceSlug).toBe('mockms-name-slug');
        expect(RESULT.requestedAt).toBeDefined();
        expect(RESULT.startedAt).toBeDefined();
        expect(RESULT.finishedAt).toBeDefined();
        expect(RESULT.versionsFound).toBe(3);
        expect(RESULT.yamlErrorsQuant).toBe(5);
        expect(RESULT.yamlWarningsQuant).toBe(3);
        expect((RESULT.yamlErrors.development.length + RESULT.yamlErrors.release.length)).toBe(5);
        expect((RESULT.yamlWarnings.development.length
          + RESULT.yamlWarnings.release.length)).toBe(3);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when yamlErrorsQuants === 0', (done) => {
    global.mockBehavior.groupHeader = 1;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.status).toBe(1);
        expect(RESULT.statusMessage).toBe('Running...');
        expect(RESULT.currentStatus).toBe('mockCurrent Status');
        expect(RESULT.percentage).toBe(100);
        expect(RESULT.microserviceName).toBe('mockMS Name');
        expect(RESULT.microserviceSlug).toBe('mockms-name-slug');
        expect(RESULT.requestedAt).toBeDefined();
        expect(RESULT.startedAt).toBeDefined();
        expect(RESULT.finishedAt).toBeDefined();
        expect(RESULT.versionsFound).toBe(3);
        expect(RESULT.yamlErrorsQuant).toBe(0);
        expect(RESULT.yamlWarningsQuant).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing error handling when updateOnlyAutoMenu is not successful and response rejeted', (done) => {
    global.mockBehavior.groupHeader = 1;
    global.mockBehavior.adpupdateOnlyAutoMenu = 1;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.status).toBeDefined();
        expect(ERROR.statusMessage).toBeDefined();
        expect(ERROR.percentage).toBe(100);
        expect(ERROR.microserviceName).toBe('mockMS Name');
        expect(ERROR.microserviceSlug).toBe('mockms-name-slug');
        expect(ERROR.requestedAt).toBeDefined();
        expect(ERROR.startedAt).toBeDefined();
        expect(ERROR.finishedAt).toBeDefined();
        expect(ERROR.versionsFound).toBe(3);
        expect(ERROR.yamlErrorsQuant).toBe(0);
        expect(ERROR.yamlWarningsQuant).toBe(0);
        done();
      });
  });

  it('Testing error handling when Error from adpModel.updateOnlyAutoMenu @ adp.models.Adp', (done) => {
    global.mockBehavior.groupHeader = 1;
    global.mockBehavior.adpupdateOnlyAutoMenu = 3;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data.error).toBe('mockError from updateOnlyAutoMenu');
        expect(ERROR.data.microserviceID).toBe('mockID');
        expect(ERROR.data.theMenuAuto).toBeDefined();
        expect(ERROR.origin).toBe('main');
        expect(ERROR.packName).toBe('adp.integration.documentRefreshConsolidation');
        done();
      });
  });

  it('Testing error handling when Error from adp.queue.setPayload', (done) => {
    global.mockBehavior.queueSetPayload = 2;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data).toBeDefined();
        expect(ERROR.data.error).toBe('mockError from setPayload');
        expect(ERROR.data.objective).toBe('mockObjective');
        expect(ERROR.data.payload.serverStatusCode).toBe(200);
        expect(ERROR.data.payload.name).toBe('mockMS Name');
        expect(ERROR.data.payload.slug).toBe('mockms-name-slug');
        expect(ERROR.data.payload.yamlErrors).toBeDefined();
        expect(ERROR.data.payload.yamlWarnings).toBeDefined();
        expect(ERROR.data.payload.theMenu).toBeDefined();
        expect(ERROR.data.payload.yamlErrorsQuant).toBe(5);
        expect(ERROR.data.payload.yamlWarningsQuant).toBe(3);
        expect(ERROR.data.payload.status).toBe(200);
        done();
      });
  });

  it('Testing error handling when Error from adp.queue.currentStatus', (done) => {
    global.mockBehavior.currentStatus = 2;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data.error).toBe('mockError from currentStatus');
        expect(ERROR.data.objective).toBe('mockObjective');
        expect(ERROR.origin).toBe('main');
        expect(ERROR.packName).toBe('adp.integration.documentRefreshConsolidation');
        done();
      });
  });

  it('Testing error handling when Error from adp.queue.groupHeader', (done) => {
    global.mockBehavior.groupHeader = 2;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data.error).toBe('mockError from groupHeader');
        expect(ERROR.data.objective).toBe('mockObjective');
        expect(ERROR.origin).toBe('main');
        expect(ERROR.packName).toBe('adp.integration.documentRefreshConsolidation');
        done();
      });
  });

  it('Successful Case when groupHandler sends empty response', (done) => {
    global.mockBehavior.groupHeader = 3;
    adp.integration.documentRefreshConsolidation('mockID', 'mockSlug', 'mockObjective')
      .then((RESULT) => {
        expect(RESULT.statusMessage).toBeDefined();
        expect(RESULT.currentStatus).toBeDefined();
        expect(RESULT.percentage).toBe(100);
        expect(RESULT.microserviceName).toBe('mockMS Name');
        expect(RESULT.microserviceSlug).toBe('mockms-name-slug');
        expect(RESULT.requestedAt).toBeDefined();
        expect(RESULT.startedAt).toBeDefined();
        expect(RESULT.finishedAt).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
