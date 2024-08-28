// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.documentSyncStatus.get ]
* @author Ravikiran [zgarsri]
*/
// ============================================================================================= //
class MockMasterQueueModel {
  documentSyncStatus() {
    return new Promise((RES, REJ) => {
      if (global.mockBehavior.documentSyncStatusMasterQueueClass === true) {
        RES(global.adp.mock.commandFindAnwser);
        return;
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

describe('Analysing [ adp.endpoints.documentSyncStatus.get ] behavior', () => {
  // =========================================================================================== //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.echoLog = () => {};

    adp.models = {};
    adp.models.EchoLog = MockEchoLog;

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.documentSyncStatusMasterQueueClass = true;

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.setHeaders = RES => RES;

    adp.models.MasterQueue = MockMasterQueueModel;
    adp.Answers = require('./../../../answers/AnswerClass');
    adp.getSizeInMemory = () => 1;

    adp.endpoints = {};
    adp.endpoints.documentSyncStatus = {};
    adp.endpoints.documentSyncStatus.get = require('./get');

    global.adp.microservices = {};
    global.adp.microservices.getByOwner = (signum, role) => new Promise((MOCKRES1) => {
      if (role === 'admin') {
        return MOCKRES1([
          { id: '111', name: 'Mock MS Name 1' },
          { id: '222', name: 'Mock MS Name 2' },
        ]);
      }
      if (role === 'user') {
        return MOCKRES1([
          { id: '111', name: 'Mock MS Name 1' },
        ]);
      }
      MOCKRES1();
      return false;
    });

    global.adp.mock = {};
    global.adp.mock.commandFindAnwser = [
      {
        added: '2022-10-23T10:29:35.217Z',
        started: '2022-10-23T10:29:35.272Z',
        ended: '2022-10-23T10:29:35.414Z',
        mission: 'documentRefresh',
        status: 'Completed',
        microservice: 'Mock MS Name 1',
      },
      {
        added: '2022-10-23T10:29:35.494Z',
        started: '2022-10-23T10:29:36.343Z',
        ended: '2022-10-23T10:29:36.421Z',
        mission: 'documentRefresh',
        status: 'Completed',
        microservice: 'Mock MS Name 1',
      },
      {
        added: '2022-10-23T10:29:37.811Z',
        started: '2022-10-23T10:29:37.838Z',
        ended: '2022-10-23T10:29:37.861Z',
        mission: 'documentRefresh',
        status: 'Completed',
        microservice: 'Mock MS Name 1',
      },
      {
        added: '2022-10-23T10:29:37.955Z',
        started: '2022-10-23T10:29:38.796Z',
        ended: '2022-10-23T10:29:38.805Z',
        mission: 'documentRefresh',
        status: 'Completed',
        microservice: 'Mock MS Name 1',
      },
      {
        added: '2022-10-24T13:53:56.883Z',
        started: '2022-10-24T10:21:37.415Z',
        ended: '2022-10-24T10:21:37.493Z',
        mission: 'documentRefresh',
        status: 'Completed',
        microservice: 'Mock MS Name 2',
      },
      {
        added: '2022-10-24T13:53:56.883Z',
        started: '2022-10-25T09:33:19.737Z',
        ended: '2022-10-25T09:33:19.776Z',
        mission: 'documentRefresh',
        status: 'Failed',
        microservice: 'Mock MS Name 2',
      },
    ];
  });
  // =========================================================================================== //


  // =========================================================================================== //
  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });
  // =========================================================================================== //


  // =========================================================================================== //
  it('Successful case with admin user should show all microservices sync status', (done) => {
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
    };
    const res = {
      end(VALUE) {
        global.mockExpect.endResult = JSON.parse(VALUE);

        expect(global.mockExpect.endResult.total).toEqual(6);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(6);
        done();
      },
    };
    adp.endpoints.documentSyncStatus.get(req, res);
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Successful case with role user should show assosiated microservices sync status', (done) => {
    const req = {
      userRequest: {
        signum: 'etest',
        role: 'user',
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

        expect(global.mockExpect.endResult.total).toEqual(6);
        expect(global.mockExpect.endResult.page).toEqual(1);
        expect(global.mockExpect.endResult.code).toEqual(200);
        expect(global.mockExpect.endResult.message).toEqual('200 - Search Successful');
        expect(global.mockExpect.endResult.data.length).toEqual(6);
        done();
      },
    };
    adp.endpoints.documentSyncStatus.get(req, res);
    done();
  });
  // =========================================================================================== //

  // =========================================================================================== //
  it('Negative case if role is not given then 500 error is thouwn', (done) => {
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
    adp.endpoints.documentSyncStatus.get(req, res);
    done();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
