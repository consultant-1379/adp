// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.comments.get ]
* @author Tirth [ zpiptir ]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockCommentsClass {
  getComment() {
    if (global.mockBehavior.get === 1) {
      const errorObj = { code: 400, desc: 'Bad Request' };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    if (global.mockBehavior.get === 2) {
      const errorObj = { NoErrorInfo: true };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    return new Promise(RES => RES({ code: 200, message: 'Mock Successful Message!', data: [{ field1: 'MockedField1', fields2: 'MockedField3' }] }));
  }
}
module.exports = MockCommentsClass;
// ============================================================================================= //
const mockErroLog = (code, desc, data, origin, packName) => {
  if (!global.mockBehavior) global.mockBehavior = {};
  if (!global.mockBehavior.ErrorLog) global.mockBehavior.ErrorLog = {};
  global.mockBehavior.ErrorLog.args = {
    code, desc, data, origin, packName,
  };
  return global.mockBehavior.ErrorLog.args;
};
// ============================================================================================= //
const mockRes = {
  statusCode: 0,
  end: (VALUE) => {
    if (!global.mockBehavior) {
      global.mockBehavior = {};
    }
    global.mockBehavior.mockEndAnswer = JSON.parse(VALUE);
  },
};
// ============================================================================================= //
describe('Testing behavior of [ adp.endpoints.comments.get ]', () => {
// =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.mockBehavior = {
      get: 0,
    };
    adp.setHeaders = VALUE => VALUE;
    adp.comments = {};
    adp.comments.CommentsClass = MockCommentsClass;
    adp.endpoints = {};
    adp.endpoints.comments = {};
    adp.endpoints.comments.get = proxyquire('./get.js', {
      './../../../library/errorLog': mockErroLog,
    });
  });

  // =========================================================================================== //

  it('Successful Test Case.', async (done) => {
    const REQ = {};
    const RES = mockRes;
    await adp.endpoints.comments.get(REQ, RES);

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('Mock Successful Message!');
    expect(answer.data).toBeDefined();
    done();
  });
  // =========================================================================================== //

  it('Negative Test Case.', async (done) => {
    global.mockBehavior.get = 1;
    const REQ = {};
    const RES = mockRes;
    await adp.endpoints.comments.get(REQ, RES);
    await new Promise((RESOLVE) => { setTimeout(() => { RESOLVE(); }, 200); });

    const answer = global
          && global.mockBehavior
          && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(400);
    expect(answer.message).toEqual('Bad Request');
    done();
  });
  // =========================================================================================== //

  it('Negative Test Case if error information not found should provide default values', async (done) => {
    global.mockBehavior.get = 2;
    const REQ = {};
    const RES = mockRes;
    await adp.endpoints.comments.get(REQ, RES);
    await new Promise((RESOLVE) => { setTimeout(() => { RESOLVE(); }, 200); });

    const answer = global
      && global.mockBehavior
      && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(500);
    expect(answer.message).toEqual('Internal Server Error');
    done();
  });

  // =========================================================================================== //
  // =========================================================================================== //
});
