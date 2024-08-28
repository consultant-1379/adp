// ============================================================================================= //
/**
* Unit test for [ adp.egsSync.egsSyncAction ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

// ============================================================================================= //
class MockQueue {
  addJobs() {
    if (adp.mockBehavior.adpQueueAddJobs) {
      return new Promise(RES => RES('MockSuccess'));
    }

    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };

      REJ(mockError);
    });
  }

  getNextIndex() {
    if (adp.mockBehavior.getNextIndex) {
      return new Promise(RES => RES(0));
    }

    return new Promise((RES, REJ) => {
      REJ();
    });
  }
}

describe('Testing [ adp.egsSync.egsSyncAction ] Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.mockBehavior = {
      egsSyncSetup: true,
      adpQueueAddJobs: true,
      getNextIndex: true,
      setup: {
        egsSyncActive: true,

        egsSyncActiveTypes: 'MockValue',

        egsSyncServerAddress: 'MockValue',

        egsSyncItemsPerRequest: 10,

        rbacAccessPermissions: { content: [], assets: [] },

        egsSyncMaxBytesSizePerRequest: 204800,

      },

    };

    adp.queue = new MockQueue();

    adp.clone = data => data;

    adp.echoLog = ERRORCODE => ERRORCODE;

    adp.erroLog = ERRORCODE => ERRORCODE;

    adp.egsSync = {};

    adp.egsSync.egsSyncSetup = () => {
      if (adp.mockBehavior.egsSyncSetup) {
        return new Promise(RES => RES(adp.mockBehavior.setup));
      }

      const errorObj = { error: 'MockError' };

      return new Promise((RES, REJ) => REJ(errorObj));
    };

    adp.egsSync.egsSyncAction = proxyquire('./egsSyncAction', {

      './../library/errorLog': adp.erroLog,

    });
  });

  afterEach(() => {
    global.adp = null;
  });

  // ------------------------------------------------------------------------------------------- //
  it('Successful case when nothing to sync', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.egsSync.egsSyncAction(queueObjective)
      .then((RES) => {
        expect(RES.code).toBe(204);
        expect(RES.message).toBe('No content - Nothing found to be synchronized');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when article to sync', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.setup.rbacAccessPermissions.content = [{
      id: 'mockId',
      type: 'article',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];

    adp.egsSync.egsSyncAction(queueObjective)
      .then((RES) => {
        expect(RES.code).toBe(200);
        expect(RES.message).toBe('Request added to the queue');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when microservice to sync', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.setup.rbacAccessPermissions.assets = [{
      id: 'mockId',
      type: 'assets',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];
    adp.egsSync.egsSyncAction(queueObjective)
      .then((RES) => {
        expect(RES.code).toBe(200);
        expect(RES.message).toBe('Request added to the queue');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case when egsSyncSetup throws an error', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.setup.egsSyncActive = false;
    adp.mockBehavior.setup.rbacAccessPermissions.content = [{
      id: 'mockId',
      type: 'article',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];

    adp.egsSync.egsSyncAction(queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(405);
        done();
      });
  });

  it('Negative case when egsSyncActive is false', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.setup.egsSyncActive = false;
    adp.mockBehavior.setup.rbacAccessPermissions.content = [{
      id: 'mockId',
      type: 'article',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];

    adp.egsSync.egsSyncAction(queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(405);
        done();
      });
  });

  it('Negative case when addjobs throws error', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.egsSyncSetup = false;
    adp.mockBehavior.setup.rbacAccessPermissions.content = [{
      id: 'mockId',
      type: 'article',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];

    adp.egsSync.egsSyncAction(queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(500);
        done();
      });
  });

  it('Negative case when getNextIndex throws error', (done) => {
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.getNextIndex = false;
    adp.mockBehavior.setup.rbacAccessPermissions.content = [{
      id: 'mockId',
      type: 'article',
      slug: 'mock_slug',
      url: 'www.mockurl.com',
    }];

    adp.egsSync.egsSyncAction(queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(500);
        done();
      });
  });
});
