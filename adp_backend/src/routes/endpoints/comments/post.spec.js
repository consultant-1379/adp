// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.comments.post ]
* @author Tirth [ zpiptir ]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockCommentsClass {
  postComment() {
    if (global.mockBehavior.post === 1) {
      const errorObj = { code: 400, desc: 'Bad Request' };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    if (global.mockBehavior.post === 2) {
      const errorObj = { NoErrorInfo: true };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    if (global.mockBehavior.post === 3) {
      const errorObj = { code: 401, desc: 'Unauthorized' };
      return new Promise((RES, REJ) => REJ(errorObj));
    }
    return new Promise(RES => RES({
      code: 200,
      message: 'Mock Successful Message!',
      parameters: {
        location_id: 'MockedLocation_Id',
        location_page: 'MockedLocayion_Page',
        comment_text: 'Mocked Comment Text',
      },
    }));
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
describe('Testing behavior of [ adp.endpoints.comments.post ]', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.mockBehavior = {
      post: 0,
    };
    adp.setHeaders = VALUE => VALUE;
    adp.comments = {};
    adp.comments.CommentsClass = MockCommentsClass;
    adp.endpoints = {};
    adp.endpoints.comments = {};
    adp.endpoints.comments.post = proxyquire('./post.js', {
      './../../../library/errorLog': mockErroLog,
    });
  });

  // =========================================================================================== //

  it('Successful Test Case.', async (done) => {
    const REQ = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
        location_title: 'mockTitle',
        location_page: 'h1_mock-title',
        location_author: ['mockName'],
        location_email: ['mockEmail'],
        location_signum: ['mockSignum'],
        comment_text: 'mockCommentText',
      },
      rbac: {
        mockSignumTest: { admin: true },
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.post(REQ, RES);

    const answer = global
      && global.mockBehavior
      && global.mockBehavior.mockEndAnswer
      ? global.mockBehavior.mockEndAnswer
      : {};

    expect(answer.code).toEqual(200);
    expect(answer.message).toEqual('Mock Successful Message!');
    expect(answer.parameters).toBeDefined();
    done();
  });
  // =========================================================================================== //

  it('Negative Test Case.', async (done) => {
    global.mockBehavior.post = 1;
    const REQ = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
        location_title: 'mockTitle',
        location_page: 'h1_mock-title',
        location_author: ['mockName'],
        location_email: ['mockEmail'],
        location_signum: ['mockSignum'],
        comment_text: 'mockCommentText',
      },
      rbac: {
        mockSignumTest: { admin: true },
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.post(REQ, RES);
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
    global.mockBehavior.post = 2;
    const REQ = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
        location_title: 'mockTitle',
        location_page: 'h1_mock-title',
        location_author: ['mockName'],
        location_email: ['mockEmail'],
        location_signum: ['mockSignum'],
        comment_text: 'mockCommentText',
      },
      rbac: {
        mockSignumTest: { admin: true },
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.post(REQ, RES);
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
    global.mockBehavior.post = 1;
    const REQ = {
      body: {},
      rbac: {
        mockSignumTest: { admin: true },
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const RES = mockRes;
    await adp.endpoints.comments.post(REQ, RES);
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
    global.mockBehavior.post = 3;
    const REQ = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
        location_title: 'mockTitle',
        location_page: 'h1_mock-title',
        location_author: ['mockName'],
        location_email: ['mockEmail'],
        location_signum: ['mockSignum'],
        comment_text: 'mockCommentText',
      },
      rbac: {
        mockSignumTest: { admin: true },
      },
      userRequest: {},
    };
    const RES = mockRes;
    await adp.endpoints.comments.post(REQ, RES);
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
  // =========================================================================================== //
});
