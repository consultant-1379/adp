// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.documentSyncStatusDetails.get ]
* @author Ravikiran [zgarsri]
*/
// ============================================================================================= //
class MockMasterQueueModel {
  documentSyncStatusDetails(obj) {
    return new Promise((RES, REJ) => {
      if (global.mockBehavior.documentSyncStatusDetailsMasterQueueClass === true && obj !== 'mockObj') {
        RES(global.adp.mock.commandFindAnwser);
        return;
      }
      if (obj === 'mockObj' && global.mockBehavior.documentSyncStatusDetailsMasterQueueClass === true) {
        RES(`${obj} not found`);
      }
      const mockError = 'mockError';
      REJ(mockError);
    });
  }
}

class MockEchoLog {
  createOne() {
    return new Promise(RES => RES());
  }
}

describe('Analysing [ adp.endpoints.documentSyncStatusDetails.get ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.echoLog = () => {};

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.documentSyncStatusDetailsMasterQueueClass = true;

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.setHeaders = RES => RES;

    adp.models.MasterQueue = MockMasterQueueModel;
    adp.Answers = require('../../../answers/AnswerClass');
    adp.getSizeInMemory = () => 1;

    adp.endpoints = {};
    adp.endpoints.documentSyncStatusDetails = {};
    adp.endpoints.documentSyncStatusDetails.get = require('./get');

    global.adp.microservices = {};
    global.adp.microservices.getByOwner = (signum, role) => new Promise((RES, REJ) => {
      if (role === 'admin') {
        return RES([
          { id: '111', name: 'Mock MS Name 1' },
          { id: '222', name: 'Mock MS Name 2' },
        ]);
      }
      if (role === 'user') {
        return RES([
          { id: '111', name: 'Mock MS Name 1' },
        ]);
      }
      const mockError = 'mockError';
      return REJ(mockError);
    });

    global.adp.mock = {};
    global.adp.mock.commandFindAnwser = [
      {
        added: '2023-05-29T14:39:31.027Z',
        started: '2023-05-29T14:39:31.498Z',
        ended: '2023-05-29T14:39:31.555Z',
        mission: 'documentRefresh',
        objective: 'auto-ms-doc-sync-mock-artifactory-2__1685371171025',
        msId: '4befcc82eebf81c3e1b5242b49001077',
        status: 'Failed',
        errors: {
          development: [
            'Artifactory location not found',
          ],
          release: [
            'Artifactory location not found',
          ],
        },
        msName: 'Auto MS Doc Sync Mock Artifactory 2',
      },
    ];
  });
  // =========================================================================================== //

  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Successful case with admin user should show given objective - document sync status details', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
        role: 'admin',
      },
      rbac: {
        etest: {
          admin: true,
          allowed: {
            contents: [],
          },
        },
      },
      query: {
        objective: 'auto-ms-doc-sync-mock-artifactory-2__1685371171025',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(1);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(1);
        done();
      },
    };
    adp.endpoints.documentSyncStatusDetails.get(req, res);
    done();
  });

  it('Negative case if master queue model for documentSyncStatusDetails() is given as 500 error', (done) => {
    global.mockBehavior.documentSyncStatusDetailsMasterQueueClass = false;
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: true,
          allowed: {
            contents: [],
          },
        },
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - Unexpected Error');
        done();
      },
    };
    adp.endpoints.documentSyncStatusDetails.get(req, res);
    done();
  });

  it('Negative case if master queue model for documentSyncStatusDetails() is given as 404 error', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: false,
          allowed: {
            contents: [],
          },
        },
      },
      query: {
        objective: 'auto-ms-doc-sync-mock-artifactory-2__1685371171025',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(500);
        expect(global.mockExpect.endResult.message).toEqual('500 - Unexpected Error');
        done();
      },
    };
    adp.endpoints.documentSyncStatusDetails.get(req, res);
    done();
  });

  it('Negative case if getMSName gives 500 error', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
      },
      rbac: {
        etest: {
          admin: true,
          allowed: {
            contents: [],
          },
        },
      },
      query: {
        objective: 'mockObj',
      },
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.code).toEqual(404);
        expect(global.mockExpect.endResult.message).toEqual('Nothing was found with this mockObj');
        done();
      },
    };
    adp.endpoints.documentSyncStatusDetails.get(req, res);
    done();
  });
});
// ============================================================================================= //
