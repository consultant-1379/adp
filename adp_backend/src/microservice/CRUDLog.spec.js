// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.CRUDLog ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdpLog {
  createOne(LOGOBJ) {
    return new Promise((RESOLVE, REJECT) => {
      if (LOGOBJ.desc === 'new') {
        const b1 = (LOGOBJ.type === 'microservice');
        const b2 = (LOGOBJ.signum === 'emocktester');
        const b3 = (LOGOBJ.role === 'admin');
        const b4 = (LOGOBJ.new.id === 123);
        const b5 = (LOGOBJ.new.name === 'Test1');
        if (b1 && b2 && b3 && b4 && b5) {
          RESOLVE({ ok: true });
          return true;
        }
        const error = 'Log Object is incorrect!';
        REJECT(error);
        return false;
      }
      if (LOGOBJ.desc === 'delete') {
        const b1 = (LOGOBJ.type === 'microservice');
        const b2 = (LOGOBJ.signum === 'emocktester');
        const b3 = (LOGOBJ.role === 'admin');
        const b4 = (LOGOBJ.new.id === 123);
        const b5 = (LOGOBJ.new.name === 'Test2');
        const b6 = (LOGOBJ.new.deleted === true);
        if (b1 && b2 && b3 && b4 && b5 && b6) {
          RESOLVE({ ok: true });
          return true;
        }
        const error = 'Log Object is incorrect!';
        REJECT(error);
        return false;
      }
      if (LOGOBJ.desc === 'update' && LOGOBJ.new.name === 'Test3') {
        const b1 = (LOGOBJ.type === 'microservice');
        const b2 = (LOGOBJ.signum === 'emocktester');
        const b3 = (LOGOBJ.role === 'admin');
        const b4 = (LOGOBJ.new.id === 123);
        const b5 = (LOGOBJ.new.name === 'Test3');
        const b6 = (LOGOBJ.old.id === 123);
        const b7 = (LOGOBJ.old.name === 'Test3');
        const b8 = (LOGOBJ.changes[0].fieldname === 'team');
        const b9 = (LOGOBJ.changes[0].from.length === 2);
        const b10 = (LOGOBJ.changes[0].to.length === 3);
        if (b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9 && b10) {
          RESOLVE({ ok: true });
          return true;
        }
        const error = 'Log Object is incorrect!';
        REJECT(error);
        return false;
      }
      if (LOGOBJ.desc === 'update' && LOGOBJ.new.name === 'Test4') {
        const b1 = (LOGOBJ.type === 'microservice');
        const b2 = (LOGOBJ.signum === 'emocktester');
        const b3 = (LOGOBJ.role === 'admin');
        const b4 = (LOGOBJ.new.id === 123);
        const b5 = (LOGOBJ.new.name === 'Test4');
        const b6 = (LOGOBJ.old.id === 123);
        const b7 = (LOGOBJ.old.name === 'Test4');
        const b8 = (LOGOBJ.changes[0].fieldname === 'owner');
        const b9 = (LOGOBJ.changes[1].fieldname === 'role');
        const b10 = (LOGOBJ.changes[2].fieldname === 'owner');
        const b11 = (LOGOBJ.changes[3].fieldname === 'mails');
        const b12 = (LOGOBJ.new.mails.length === 3);
        const b13 = (LOGOBJ.old.mails.length === 2);
        const b14 = (LOGOBJ.new.team[0].owner === true);
        const b15 = (LOGOBJ.old.team[0].owner === false);
        const b16 = (LOGOBJ.new.team[2].owner === false);
        const b17 = (LOGOBJ.old.team[2].owner === true);
        if (b1 && b2 && b3 && b4 && b5 && b6 && b7 && b8 && b9
          && b10 && b11 && b12 && b13 && b14 && b15 && b16 && b17) {
          RESOLVE({ ok: true });
          return true;
        }
        const error = 'Log Object is incorrect!';
        REJECT(error);
        return false;
      }
      RESOLVE(true);
      return true;
    });
  }
}

describe('If [ global.adp.microservice.CRUDLog ] is able to save the CRUD Log. (SIMULATION)', () => {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.AdpLog = MockAdpLog;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.clone = SOURCE => JSON.parse(JSON.stringify(SOURCE));
    global.adp.microservice = {};
    global.adp.microservice.CRUDLog = require('./CRUDLog'); // eslint-disable-line global-require
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  afterEach(() => {
    global.adp = null;
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('[ global.adp.microservice.CRUDLog ] working with a "new" item on database.', async (done) => {
    const mockNewOBJ = {
      id: 123,
      name: 'Test1',
      team: [
        { signum: 'eMock1', role: 1 },
        { signum: 'eMock2', role: 3 },
        { signum: 'eMock3', role: 2 },
      ],
    };
    const mockOldOBJ = {};
    const action = 'new';
    const userRequest = { signum: 'emocktester', role: 'admin' };
    const expectedOBJ = await global.adp.microservice
      .CRUDLog(mockNewOBJ, mockOldOBJ, action, userRequest);

    expect(expectedOBJ).toBeTruthy();
    done();
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('[ global.adp.microservice.CRUDLog ] working with a "delete" item on database.', async (done) => {
    const mockNewOBJ = {
      id: 123,
      name: 'Test2',
      team: [
        { signum: 'eMock1', role: 1 },
        { signum: 'eMock2', role: 3 },
        { signum: 'eMock3', role: 2 },
      ],
    };
    const mockOldOBJ = {};
    const action = 'delete';
    const userRequest = { signum: 'emocktester', role: 'admin' };
    const expectedOBJ = await global.adp.microservice
      .CRUDLog(mockNewOBJ, mockOldOBJ, action, userRequest);

    expect(expectedOBJ).toBeTruthy();
    done();
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('[ global.adp.microservice.CRUDLog ] working with a "update" item on database.', async (done) => {
    const mockNewOBJ = {
      id: 123,
      name: 'Test3',
      team: [
        { signum: 'eMock1', role: 1 },
        { signum: 'eMock2', role: 3 },
        { signum: 'eMock3', role: 2 },
      ],
    };
    const mockOldOBJ = {
      id: 123,
      name: 'Test3',
      team: [
        { signum: 'eMock2', role: 3 },
        { signum: 'eMock3', role: 4 },
      ],
    };
    const action = 'update';
    const userRequest = { signum: 'emocktester', role: 'admin' };
    const expectedOBJ = await global.adp.microservice
      .CRUDLog(mockNewOBJ, mockOldOBJ, action, userRequest);

    expect(expectedOBJ).toBeTruthy();
    done();
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  it('[ global.adp.microservice.CRUDLog ] working with a more detailed "update" item on database.', async (done) => {
    const mockNewOBJ = {
      id: 123,
      name: 'Test4',
      team: [
        { signum: 'eMock1', role: 1, owner: true },
        { signum: 'eMock2', role: 3, owner: false },
        { signum: 'eMock3', role: 2, owner: false },
      ],
      category: 1,
      mails: [
        'mock1@mail.com',
        'mock2@mail.com',
        'mock3@mail.com',
      ],
    };
    const mockOldOBJ = {
      id: 123,
      name: 'Test4',
      team: [
        { signum: 'eMock1', role: 1, owner: false },
        { signum: 'eMock2', role: 4, owner: false },
        { signum: 'eMock3', role: 2, owner: true },
      ],
      category: 1,
      mails: [
        'mock1@mail.com',
        'mock2@mail.com',
      ],
    };
    const action = 'update';
    const userRequest = { signum: 'emocktester', role: 'admin' };
    const expectedOBJ = await global.adp.microservice
      .CRUDLog(mockNewOBJ, mockOldOBJ, action, userRequest);

    expect(expectedOBJ).toBeTruthy();
    done();
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
});
// ============================================================================================= //
