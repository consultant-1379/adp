// ============================================================================================= //
/**
* Unit test for [ adp.middleware.rbac ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class MockModelAdp {
  getAssetByIDorSLUG() {
    const objectZero = {
      docs: [{ _id: 'mockID' }],
    };
    switch (adp.models.AdpTESTMODE) {
      case 1:
        return new Promise(RESOLVE => RESOLVE());
      case 2:
        return new Promise((RESOLVE, REJECT) => REJECT());
      default:
        return new Promise(RESOLVE => RESOLVE(objectZero));
    }
  }
}


class MockRBACClass {
  processRBAC(REQ, RES, NEXT) {
    switch (adp.middleware.RBACClassTESTMODE) {
      case 1:
        return new Promise(RESOLVE => RESOLVE(403));
      case 2:
        return new Promise((RESOLVE, REJECT) => REJECT());
      default:
        NEXT();
        return new Promise(RESOLVE => RESOLVE());
    }
  }
}


describe('Testing [ adp.middleware.rbac ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    adp.setHeaders = OBJ => OBJ;
    adp.models = {};
    adp.models.break = false;
    adp.models.AdpTESTMODE = 0;
    adp.models.Adp = MockModelAdp;
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.Answers = require('./../answers/AnswerClass');
    adp.clone = require('./../library/clone');
    adp.middleware = {};
    adp.middleware.RBACClass = MockRBACClass;
    adp.middleware.RBACClassTESTMODE = 0;

    global.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.middleware.rbac = proxyquire('./rbac', {
      '../library/errorLog': global.mockErrorLog,
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Successful Simple Case without target.', (done) => {
    const req = {
      params: {},
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done.fail(); } };
    const next = () => {
      done();
    };
    adp.middleware.rbac(req, res, next);
  });


  it('Successful Simple Case with an id target.', (done) => {
    const req = {
      params: { id: 'mockID' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done.fail(); } };
    const next = () => {
      done();
    };
    adp.middleware.rbac(req, res, next);
  });


  it('Successful Simple Case with a msSlug target.', (done) => {
    const req = {
      params: { msSlug: 'mockSlug' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done.fail(); } };
    const next = () => {
      done();
    };
    adp.middleware.rbac(req, res, next);
  });


  it('Another Successful Case with a msSlug target.', (done) => {
    const req = {
      params: { msSlug: 'mockSlug' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done.fail(); } };
    const next = () => {
      done();
    };
    adp.models.AdpTESTMODE = 1;
    adp.middleware.rbac(req, res, next);
  });


  it('If [ adp.middleware.RBACClass ] answer with 403.', (done) => {
    const req = {
      params: { id: 'mockID' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done(); } };
    const next = () => {
      done.fail();
    };
    adp.middleware.RBACClassTESTMODE = 1;
    adp.middleware.rbac(req, res, next);
  });


  it('If [ adp.middleware.RBACClass ] rejects the promise.', (done) => {
    const req = {
      params: { id: 'mockID' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done(); } };
    const next = () => {
      done.fail();
    };
    adp.middleware.RBACClassTESTMODE = 2;
    adp.middleware.rbac(req, res, next);
  });


  it('If [ getAssetByIDorSLUG @ adp.models.Adp ] rejects the promise.', (done) => {
    const req = {
      params: { msSlug: 'mockSlug' },
      user: {
        docs: [
          {
            signum: 'esupuse',
            role: 'admin',
          },
        ],
      },
    };
    const res = { end: () => { done(); } };
    const next = () => {
      done.fail();
    };
    adp.models.AdpTESTMODE = 2;
    adp.middleware.rbac(req, res, next);
  });


  it('If the user object is not in the Request Object.', (done) => {
    const req = {
      params: {},
      user: null,
    };
    const res = { end: () => { done(); } };
    const next = () => {
      done.fail();
    };
    adp.middleware.rbac(req, res, next);
  });
});
