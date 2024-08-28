// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.comments.delete ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockCommentsClass {
  deleteComment() {
    if (global.mockBehavior.delete === 1) {
      const errorObj = { code: 400, desc: 'Bad Request' };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    if (global.mockBehavior.delete === 2) {
      const errorObj = { NoErrorInfo: true };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    if (global.mockBehavior.delete === 3) {
      const errorObj = { code: 401, desc: 'Unauthorized' };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    return new Promise(RES => RES({ code: 200, message: 'Mock Successful Message!' }));
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
describe('Testing behavior of [ adp.endpoints.comments.delete ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.mockBehavior = {
      delete: 0,
    };
    adp.setHeaders = VALUE => VALUE;
    adp.comments = {};
    adp.comments.CommentsClass = MockCommentsClass;
    adp.endpoints = {};
    adp.endpoints.comments = {};
    adp.endpoints.comments.delete = proxyquire('./delete.js', {
      './../../../library/errorLog': mockErroLog,
    });
  });

  // =========================================================================================== //

  it('Successful Test Case.', async (done) => {
    const REQ = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.delete(REQ, RES);

    const answer = global
      && global.mockBehavior
      && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('Mock Successful Message!');
    done();
  });

  // =========================================================================================== //

  it('Negative Test Case.', async (done) => {
    global.mockBehavior.delete = 1;
    const REQ = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.delete(REQ, RES);
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

  it('Negative Test Case ( Alternative Version ).', async (done) => {
    global.mockBehavior.delete = 2;
    const REQ = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.delete(REQ, RES);
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

  it('Negative Test Case if body is empty.', async (done) => {
    global.mockBehavior.delete = 1;
    const REQ = {
      body: {},
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.delete(REQ, RES);
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

  it('Negative Test Case if user request is empty.', async (done) => {
    global.mockBehavior.delete = 3;
    const REQ = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {},
    };
    const RES = mockRes;
    await adp.endpoints.comments.delete(REQ, RES);
    await new Promise((RESOLVE) => { setTimeout(() => { RESOLVE(); }, 200); });

    const answer = global
      && global.mockBehavior
      && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(400);
    expect(answer.message).toEqual('Missing User Data');
    done();
  });

  // =========================================================================================== //
});
// ============================================================================================= //
