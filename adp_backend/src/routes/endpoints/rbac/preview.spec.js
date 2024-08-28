/**
* Unit test for [ adp.endpoints.rbac.preview ]
* @author Cein
*/
describe('Testing results of [ adp.endpoints.rbac.preview  ] ', () => {
  class MockAnswer {
    setCode(code) { adp.AnswersMockResp.setCode = code; }

    setData() {}

    setLimit() {}

    setTotal() {}

    setPage() {}

    setSize() {}

    setTime() {}

    getAnswer() {}

    setMessage() {}
  }

  class MockRBACClass {
    async processRBAC(previewREQ, res, callback) {
      adp.middleware.RBACClassMockResp.previewREQ = previewREQ;
      return callback({ rbac: '' });
    }
  }

  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.setHeaders = () => ({
      setCode: () => {},
      end: () => {},
      statusCode: () => {},
    });
    adp.getSizeInMemory = () => {};
    adp.AnswersMockResp = { setCode: null };
    adp.Answers = MockAnswer;

    adp.middleware = {
      RBACClassMockResp: { previewREQ: null },
      RBACClass: MockRBACClass,
    };

    adp.rbac = {
      previewReqMockResp: {
        sourceUser: ['testSig2'], sourceGroup: null, target: [], preview: true, track: true, errorReason: 'ERR',
      },
      previewRequest: () => new Promise((res) => { res(adp.rbac.previewReqMockResp); }),
    };

    adp.permission = {
      getUserMockResp: {
        res: true,
        data: { signum: 'testSig', userRole: 'testRole' },
      },
      getUserFromRequestObject: () => new Promise((res, rej) => {
        if (adp.permission.getUserMockResp.res) {
          res(adp.permission.getUserMockResp.data);
        } else {
          rej(adp.permission.getUserMockResp.data);
        }
      }),
    };

    adp.preview = require('./preview');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should give processRBAC Users for processing, with no targeting', async (done) => {
    const mockAuthUserSig = adp.permission.getUserMockResp.data.signum;
    const testObj = adp.rbac.previewReqMockResp;
    try {
      await adp.preview({ user: mockAuthUserSig }, {});
      const result = adp.middleware.RBACClassMockResp.previewREQ;

      expect(result.userRequest).toBe(mockAuthUserSig);
      expect(result.users.docs.length).toBe(1);
      expect(result.users.docs[0]).toBe(testObj.sourceUser[0]);
      expect(result.rbacGroup).toBeNull();
      expect(result.rbacTarget.length).toBe(0);
      done();
    } catch (err) {
      done.fail();
    }
  });

  it('Should give processRBAC Groups for processing, with targeting', async (done) => {
    const mockAuthUserSig = adp.permission.getUserMockResp.data.signum;
    const testGroup = 'testGrp';
    adp.rbac.previewReqMockResp.sourceUser = null;
    adp.rbac.previewReqMockResp.sourceGroup = [testGroup];

    try {
      await adp.preview({ user: mockAuthUserSig }, {});

      const result = adp.middleware.RBACClassMockResp.previewREQ;

      expect(result.userRequest).toBe(mockAuthUserSig);
      expect(result.users).toBeNull();
      expect(result.rbacGroup.length).toBe(1);
      expect(result.rbacGroup[0]).toBe(testGroup);
      expect(result.rbacTarget.length).toBe(0);
      done();
    } catch (err) {
      done.fail();
    }
  });

  it('Should respond with error code 404 if both the Users and Groups are not found', async (done) => {
    const mockAuthUserSig = adp.permission.getUserMockResp.data.signum;
    adp.rbac.previewReqMockResp.sourceUser = null;

    try {
      await adp.preview({ user: mockAuthUserSig }, {});

      expect(adp.AnswersMockResp.setCode).toBe(404);
      done();
    } catch (err) {
      done.fail();
    }
  });

  it('Should respond error code 500 the user validation fails in adp.permission.getUserFromRequestObject', async (done) => {
    adp.permission.getUserMockResp.res = false;

    try {
      await adp.preview({}, {});

      expect(adp.AnswersMockResp.setCode).toBe(500);
      done();
    } catch (err) {
      done.fail();
    }
  });
});
