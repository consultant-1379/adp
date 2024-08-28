// ============================================================================================= //
/**
* Unit test for [ adp.comments.CommentsClass ]
* @author Armando Dias [ zdiaarm ]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
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
class MockModelAdp {
  getById() {
    if (global.mockBehavior.modelAdp === 0) {
      const obj = {
        docs: [{ _id: 'ValidMockMicroserviceID' }],
      };
      return new Promise(RES => RES(obj));
    }
    if (global.mockBehavior.modelAdp === 1) {
      const obj = {
        docs: [],
      };
      return new Promise(RES => RES(obj));
    }
    if (global.mockBehavior.modelAdp === 2) {
      const obj = {};
      return new Promise((RES, REJ) => REJ(obj));
    }
    const obj = { code: 500, desc: 'MockError Description' };
    return new Promise((RES, REJ) => REJ(obj));
  }
}
// ============================================================================================= //
class MockModelComments {
  getCommentsByLocationID() {
    if (global.mockBehavior.getCommentsByLocationID === -2) {
      const mockError = {
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.getCommentsByLocationID === -1) {
      const mockError = { ok: false };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.getCommentsByLocationID === 0) {
      const result = {
        code: 200,
        resultsReturned: 1,
        limitOfThisResult: 999,
        offsetOfThisResult: 0,
        time: '1ms',
        docs: [
          {
            _id: '6363c95122924855d180744d',
            location_id: 'ms_45e7f4f992afe7bbb62a3391e500e71b_overview',
            location_page: 'h2-title-slug',
            location_type: 'ms',
            location_ms: {
              ms_id: '45e7f4f992afe7bbb62a3391e500e71b',
              ms_page: 'overview',
            },
            dt_create: new Date('2022-11-03T13:59:45.742Z'),
            dt_last_update: new Date('2022-11-03T14:33:28.234Z'),
            signum: 'mockSignumTest',
            nm_author: 'mockNameTest',
            nm_email: 'mock@email.test',
            desc_comment: 'The Comment Text',
          },
        ],

      };
      return new Promise(RES => RES(result));
    }
    if (global.mockBehavior.getCommentsByLocationID === 1) {
      return new Promise(RES => RES({ ok: false }));
    }
    if (global.mockBehavior.getCommentsByLocationID === 2) {
      return new Promise(RES => RES({
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      }));
    }
    return new Promise(RES => RES({ ok: false }));
  }

  createComment() {
    if (global.mockBehavior.createComment === -2) {
      const mockError = {
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.createComment === -1) {
      const mockError = { ok: false };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.createComment === 0) {
      return new Promise(RES => RES({ ok: true }));
    }
    if (global.mockBehavior.createComment === 1) {
      return new Promise(RES => RES({ ok: false }));
    }
    if (global.mockBehavior.createComment === 2) {
      return new Promise(RES => RES({
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      }));
    }
    return new Promise(RES => RES({ ok: false }));
  }

  deleteComment() {
    if (global.mockBehavior.deleteComment === -2) {
      const mockError = {
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.deleteComment === -1) {
      const mockError = { ok: false };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.deleteComment === 0) {
      return new Promise(RES => RES({ ok: true }));
    }
    if (global.mockBehavior.deleteComment === 1) {
      return new Promise(RES => RES({ ok: false }));
    }
    if (global.mockBehavior.deleteComment === 2) {
      return new Promise(RES => RES({
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      }));
    }
    return new Promise(RES => RES({ ok: false }));
  }

  updateComment() {
    if (global.mockBehavior.updateComment === -2) {
      const mockError = {
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.updateComment === -1) {
      const mockError = { ok: false };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.updateComment === 0) {
      return new Promise(RES => RES({ ok: true }));
    }
    if (global.mockBehavior.updateComment === 1) {
      return new Promise(RES => RES({ ok: false }));
    }
    if (global.mockBehavior.updateComment === 2) {
      return new Promise(RES => RES({
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      }));
    }
    return new Promise(RES => RES({ ok: false }));
  }

  resolveComment() {
    if (global.mockBehavior.resolveComment === -2) {
      const mockError = {
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.resolveComment === -1) {
      const mockError = { ok: false };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    if (global.mockBehavior.resolveComment === 0) {
      return new Promise(RES => RES({ ok: true }));
    }
    if (global.mockBehavior.resolveComment === 1) {
      return new Promise(RES => RES({ ok: false }));
    }
    if (global.mockBehavior.resolveComment === 2) {
      return new Promise(RES => RES({
        ok: false,
        code: 500,
        desc: 'MockError',
        data: { mockError: true },
      }));
    }
    return new Promise(RES => RES({ ok: false }));
  }

  getCommentsByCommentID() {
    const obj = {
      docs: [{ _id: 'ValidMockMicroserviceID' }],
    };
    return new Promise(RES => RES(obj));
  }
}
// ============================================================================================= //
module.exports = [MockModelAdp, MockModelComments];
// ============================================================================================= //
describe('Testing behavior of [ adp.comments.CommentsClass ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.mockBehavior = {
      modelAdp: 0,
      getCommentsByLocationID: 0,
      resolveComment: 0,
      deleteComment: 0,
      updateComment: 0,
      createComment: 0,
      WordpressMenu: 0,
    };
    global.sanitizeHtml = require('sanitize-html');
    adp.wordpress = {};
    adp.wordpress.getMenus = () => {
      if (global.mockBehavior.WordpressMenu === 0) {
        const wpMenuObj = {
          menus: {
            menuA: {
              items: [
                {
                  object_id: '1515',
                  object: 'page',
                },
                {
                  object_id: '2525',
                  object: 'tutorials',
                },
              ],
            },
          },
        };
        return new Promise(RES => RES(wpMenuObj));
      }
      const errorObj = { error: 'MockError' };
      return new Promise((RES, REJ) => REJ(errorObj));
    };
    adp.echoLog = () => { };
    adp.notification = {};
    adp.notification.sendCommentsMail = () => new Promise(RES => RES());
    adp.models = {};
    adp.models.Adp = MockModelAdp;
    adp.models.Comments = MockModelComments;
    adp.comments = {};
    adp.comments.CommentsClass = proxyquire('./CommentsClass.js', {
      './../library/errorLog': mockErroLog,
    });
  });
  // =========================================================================================== //
  it('[ _sanitizeHTML ] Successful Case of private function ( Includes invisible char conversion ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const result = await comments._sanitizeHTML('<div>Testing <i>HTML</i>&nbsp;<b>tags</b></div>');

    expect(result).toEqual('Testing <i>HTML</i> <b>tags</b>');
    done();
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Successful Case which checks the Microservice ID ( For Super Admin ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const msId = 'ValidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkMsId(msId, signum, rbac)
      .then((RESULT) => {
        expect(RESULT.ms_id).toEqual('ValidMockMicroserviceID');
        expect(RESULT.is_valid).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Negative Case which checks the Microservice ID ( For Super Admin ).', async (done) => {
    global.mockBehavior.modelAdp = 1;
    const comments = new adp.comments.CommentsClass();
    const msId = 'InvalidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkMsId(msId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ ms_id: 'InvalidMockMicroserviceID', is_valid: false });
        expect(ERROR.origin).toEqual('_checkMsId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Another Negative Case which checks the Microservice ID ( For Super Admin ).', async (done) => {
    global.mockBehavior.modelAdp = 2;
    const comments = new adp.comments.CommentsClass();
    const msId = 'InvalidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkMsId(msId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Internal Server Error');
        expect(ERROR.data).toBeDefined();
        expect(ERROR.origin).toEqual('_checkMsId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] One more Negative Case which checks the Microservice ID ( For Super Admin ).', async (done) => {
    global.mockBehavior.modelAdp = 3;
    const comments = new adp.comments.CommentsClass();
    const msId = 'InvalidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkMsId(msId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('MockError Description');
        expect(ERROR.data).toEqual({ error: { code: 500, desc: 'MockError Description' } });
        expect(ERROR.origin).toEqual('_checkMsId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Negative Case when RBAC is missing.', (done) => {
    const comments = new adp.comments.CommentsClass();
    const msId = 'ValidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = null;
    const rbac2 = { anotherSignum: {} };
    comments._checkMsId(msId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ ms_id: 'ValidMockMicroserviceID', is_valid: false });
        expect(ERROR.origin).toEqual('_checkMsId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._checkMsId(msId, signum, rbac2)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(400);
            expect(ERROR2.desc).toEqual('Bad Request');
            expect(ERROR2.data).toEqual({ ms_id: 'ValidMockMicroserviceID', is_valid: false });
            expect(ERROR2.origin).toEqual('_checkMsId');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Successful Case which checks the Microservice ID ( For Regular Users ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const msId = 'ValidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: {
        admin: false,
        allowed: {
          assets: ['ValidMockMicroserviceID'],
        },
      },
    };
    await comments._checkMsId(msId, signum, rbac)
      .then((RESULT) => {
        expect(RESULT.ms_id).toEqual('ValidMockMicroserviceID');
        expect(RESULT.is_valid).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _checkMsId ] Negative Case which checks the Microservice ID ( For Regular Users ).', (done) => {
    const comments = new adp.comments.CommentsClass();
    const msId = 'InvalidMockMicroserviceID';
    const signum = 'validsignum';
    const rbac = {
      validsignum: {
        admin: false,
        allowed: {
          assets: ['ValidMockMicroserviceID'],
        },
      },
    };
    const rbac2 = {
      validsignum: {
        admin: false,
        allowed: {},
      },
    };
    comments._checkMsId(msId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ ms_id: 'InvalidMockMicroserviceID', is_valid: false });
        expect(ERROR.origin).toEqual('_checkMsId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._checkMsId(msId, signum, rbac2)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(400);
            expect(ERROR2.desc).toEqual('Bad Request');
            expect(ERROR2.data).toEqual({ ms_id: 'InvalidMockMicroserviceID', is_valid: false });
            expect(ERROR2.origin).toEqual('_checkMsId');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Successful Case which checks the Wordpress ID ( For Super Admin ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2525';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkWpId('tutorial', wpId, signum, rbac)
      .then((RESULT) => {
        expect(RESULT.wp_id).toEqual('2525');
        expect(RESULT.is_valid).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Negative Case which checks the Wordpress ID ( For Super Admin ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2626';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkWpId('tutorial', wpId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ wp_id: '2626', type: 'tutorials', is_valid: false });
        expect(ERROR.origin).toEqual('_checkWpId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Another Negative Case which checks the Wordpress ID ( For Super Admin ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2525';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkWpId('article', wpId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toBeDefined();
        expect(ERROR.origin).toEqual('_checkWpId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] One more Negative Case which checks the Wordpress ID ( For Super Admin ).', async (done) => {
    global.mockBehavior.WordpressMenu = 1;
    const comments = new adp.comments.CommentsClass();
    const wpId = '2525';
    const signum = 'validsignum';
    const rbac = {
      validsignum: { admin: true },
    };
    await comments._checkWpId('tutorial', wpId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Internal Server Error');
        expect(ERROR.data).toEqual({ error: Object({ error: 'MockError' }) });
        expect(ERROR.origin).toEqual('_checkWpId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Negative Case when RBAC is missing.', (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2525';
    const signum = 'validsignum';
    const rbac = null;
    const rbac2 = { anotherSignum: {} };
    comments._checkWpId('tutorial', wpId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ wp_id: '2525', is_valid: false });
        expect(ERROR.origin).toEqual('_checkWpId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._checkWpId('tutorial', wpId, signum, rbac2)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(400);
            expect(ERROR2.desc).toEqual('Bad Request');
            expect(ERROR2.data).toEqual({ wp_id: '2525', is_valid: false });
            expect(ERROR2.origin).toEqual('_checkWpId');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Successful Case which checks the Wordpress ID ( For Regular Users ).', async (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2525';
    const signum = 'validsignum';
    const rbac = {
      validsignum: {
        admin: false,
        allowed: {
          contents: ['2525'],
        },
      },
    };
    await comments._checkWpId('tutorial', wpId, signum, rbac)
      .then((RESULT) => {
        expect(RESULT.wp_id).toEqual('2525');
        expect(RESULT.is_valid).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _checkWpId ] Negative Case which checks the Wordpress ID ( For Regular Users ).', (done) => {
    const comments = new adp.comments.CommentsClass();
    const wpId = '2626';
    const signum = 'validsignum';
    const rbac = {
      validsignum: {
        admin: false,
        allowed: {
          contents: ['2525'],
        },
      },
    };
    const rbac2 = {
      validsignum: {
        admin: false,
        contents: {},
      },
    };
    comments._checkWpId('tutorial', wpId, signum, rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ wp_id: '2626', is_valid: false });
        expect(ERROR.origin).toEqual('_checkWpId');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._checkWpId('tutorial', wpId, signum, rbac2)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(400);
            expect(ERROR2.desc).toEqual('Bad Request');
            expect(ERROR2.data).toEqual({ wp_id: '2626', is_valid: false });
            expect(ERROR2.origin).toEqual('_checkWpId');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ _checkType ] Successful Case when checking the Type.', async (done) => {
    const comments = new adp.comments.CommentsClass();
    await comments._checkType('ms')
      .then((RESULT) => {
        expect(RESULT.type).toEqual('ms');
        expect(RESULT.is_valid).toEqual(true);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _checkType ] Negative Case when checking the Type.', async (done) => {
    const comments = new adp.comments.CommentsClass();
    await comments._checkType('Not ms')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toEqual({ type: 'Not ms', is_valid: false });
        expect(ERROR.origin).toEqual('_checkType');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _extractGetParameters ] Successful Case extracting parameters from "body" for reading.', async (done) => {
    const request = {
      body: {
        location_id: 'ms_mocklocation_id',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments._extractGetParameters(request)
      .then((RESULT) => {
        expect(RESULT.location_id).toEqual('ms_mocklocation_id');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _extractGetParameters ] Successful Case extracting parameters from "params" for reading.', async (done) => {
    const request = {
      params: {
        location_id: 'ms_mocklocation_id',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments._extractGetParameters(request)
      .then((RESULT) => {
        expect(RESULT.location_id).toEqual('ms_mocklocation_id');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _extractGetParameters ] Successful Case extracting parameters from "query" for reading.', async (done) => {
    const request = {
      query: {
        location_id: 'ms_mocklocation_id',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments._extractGetParameters(request)
      .then((RESULT) => {
        expect(RESULT.location_id).toEqual('ms_mocklocation_id');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _extractGetParameters ] Negative Case extracting parameters for reading.', async (done) => {
    const request = {
      body: {},
      params: {},
      query: {},
    };
    const comments = new adp.comments.CommentsClass();
    await comments._extractGetParameters(request)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toBeDefined();
        expect(ERROR.origin).toEqual('_extractGetParameters');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        done();
      });
  });
  // =========================================================================================== //
  it('[ _extractGetParameters ] Alternative Negative Case extracting parameters for reading.', (done) => {
    const request = {};
    const comments = new adp.comments.CommentsClass();
    comments._extractGetParameters(request)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.data).toBeDefined();
        expect(ERROR.origin).toEqual('_extractGetParameters');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._extractGetParameters(undefined)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(400);
            expect(ERROR2.desc).toEqual('Bad Request');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('_extractGetParameters');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            comments._extractGetParameters({ body: {}, params: {}, query: {} })
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(400);
                expect(ERROR3.desc).toEqual('Bad Request');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('_extractGetParameters');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                done();
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ _extractUser ] Successful Case extracting user data from the request object.', async (done) => {
    const request = {
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments._extractUser(request)
      .then((RESULT) => {
        expect(RESULT.signum).toEqual('mockSignumTest');
        expect(RESULT.name).toEqual('mockNameTest');
        expect(RESULT.email).toEqual('mock@email.test');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ _extractUser ] Negative Case extracting user data from the request object.', async (done) => {
    const request = undefined;
    const comments = new adp.comments.CommentsClass();
    await comments._extractUser(request)
      .then((RESULT) => {
        expect(RESULT.signum).toEqual('');
        expect(RESULT.name).toEqual('');
        expect(RESULT.email).toEqual('');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ resolveComment ] Successful Case when trying to resolve a comment.', async (done) => {
    const request = {
      body: {
        comment_id: 'ValidCommentID',
        resolve_text: 'Resolve Text',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.resolveComment(request.body, request.userRequest)
      .then((RESULT) => {
        expect(RESULT.code).toEqual(200);
        expect(RESULT.message).toEqual('Comment resolved successful');
        expect(RESULT.BODYREQUEST).toEqual({ comment_id: 'ValidCommentID', resolve_text: 'Resolve Text' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ resolveComment ] Negative Case when trying to resolve a comment: adp.models.Comments() crashes in four different ways.', async (done) => {
    global.mockBehavior.resolveComment = 1;
    const request = {
      body: {
        comment_id: 'ValidCommentID',
        resolve_text: 'Resolve Text',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.resolveComment(request.body, request.userRequest)
      .then(() => {
        done.fail();
      })
      .catch((ERROR1) => {
        expect(ERROR1.code).toEqual(500);
        expect(ERROR1.desc).toEqual('Internal Server Error');
        expect(ERROR1.data).toBeDefined();
        expect(ERROR1.origin).toEqual('resolve');
        expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
        global.mockBehavior.updateComment = 2;
        comments.resolveComment(request.body, request.userRequest)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(500);
            expect(ERROR2.desc).toEqual('Internal Server Error');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('resolve');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            global.mockBehavior.updateComment = -1;
            comments.resolveComment(request.body, request.userRequest)
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(500);
                expect(ERROR3.desc).toEqual('Internal Server Error');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('resolve');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                global.mockBehavior.updateComment = -2;
                comments.resolveComment(request.body, request.userRequest)
                  .then(() => {
                    done.fail();
                  })
                  .catch((ERROR4) => {
                    expect(ERROR4.code).toEqual(500);
                    expect(ERROR4.desc).toEqual('Internal Server Error');
                    expect(ERROR4.data).toBeDefined();
                    expect(ERROR4.origin).toEqual('resolve');
                    expect(ERROR4.packName).toEqual('adp.comments.CommentsClass');
                    global.mockBehavior.updateComment = 0;
                    done();
                  });
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ deleteComment ] Successful Case when trying to delete a comment.', async (done) => {
    const request = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.deleteComment(request.body, request.userRequest)
      .then((RESULT) => {
        expect(RESULT.code).toEqual(200);
        expect(RESULT.message).toEqual('Comment successful deleted');
        expect(RESULT.BODYREQUEST).toEqual({ comment_id: 'ValidCommentID' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ deleteComment ] Negative Case when trying to delete a comment: adp.models.Comments() crashes in four different ways.', async (done) => {
    global.mockBehavior.deleteComment = 1;
    const request = {
      body: {
        comment_id: 'ValidCommentID',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.deleteComment(request.body, request.userRequest)
      .then(() => {
        done.fail();
      })
      .catch((ERROR1) => {
        expect(ERROR1.code).toEqual(500);
        expect(ERROR1.desc).toEqual('Internal Server Error');
        expect(ERROR1.data).toBeDefined();
        expect(ERROR1.origin).toEqual('delete');
        expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
        global.mockBehavior.deleteComment = 2;
        comments.deleteComment(request.body, request.userRequest)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(500);
            expect(ERROR2.desc).toEqual('MockError');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('delete');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            global.mockBehavior.deleteComment = -1;
            comments.deleteComment(request.body, request.userRequest)
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(500);
                expect(ERROR3.desc).toEqual('Internal Server Error');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('delete');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                global.mockBehavior.deleteComment = -2;
                comments.deleteComment(request.body, request.userRequest)
                  .then(() => {
                    done.fail();
                  })
                  .catch((ERROR4) => {
                    expect(ERROR4.code).toEqual(500);
                    expect(ERROR4.desc).toEqual('MockError');
                    expect(ERROR4.data).toBeDefined();
                    expect(ERROR4.origin).toEqual('delete');
                    expect(ERROR4.packName).toEqual('adp.comments.CommentsClass');
                    global.mockBehavior.deleteComment = 0;
                    done();
                  });
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ deleteComment ] Negative Case when trying to delete a comment and a validation crashes.', (done) => {
    const request = {
      body: {
        comment_id: 'ValidCommentID',
      },
    };
    const comments = new adp.comments.CommentsClass();
    comments.deleteComment(request.body)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Internal Server Error');
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.origin).toEqual('delete');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._extractUser = () => {
          const mockError = { mockSimpleError: true };
          return new Promise((RES, REJ) => REJ(mockError));
        };
        comments.deleteComment(request.body)
          .then(() => {
            done.fail();
          })
          .catch((ERROR1) => {
            expect(ERROR1.code).toEqual(500);
            expect(ERROR1.desc).toEqual('Internal Server Error');
            expect(ERROR1.desc).toBeDefined();
            expect(ERROR1.origin).toEqual('delete');
            expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ putComment ] Successful Case when trying to update a comment.', async (done) => {
    const request = {
      body: {
        comment_id: 'ValidCommentID',
        comment_text: 'Updated Comment Text',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.putComment(request.body, request.userRequest)
      .then((RESULT) => {
        expect(RESULT.code).toEqual(200);
        expect(RESULT.message).toEqual('Comment updated successful');
        expect(RESULT.BODYREQUEST).toEqual({ comment_id: 'ValidCommentID', comment_text: 'Updated Comment Text' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ putComment ] Negative Case when trying to update a comment: adp.models.Comments() crashes in four different ways.', async (done) => {
    global.mockBehavior.updateComment = 1;
    const request = {
      body: {
        comment_id: 'ValidCommentID',
        comment_text: 'Updated Comment Text',
      },
      userRequest: {
        signum: 'mockSignumTest',
        name: 'mockNameTest',
        email: 'mock@email.test',
      },
    };
    const comments = new adp.comments.CommentsClass();
    await comments.putComment(request.body, request.userRequest)
      .then(() => {
        done.fail();
      })
      .catch((ERROR1) => {
        expect(ERROR1.code).toEqual(500);
        expect(ERROR1.desc).toEqual('Internal Server Error');
        expect(ERROR1.data).toBeDefined();
        expect(ERROR1.origin).toEqual('put');
        expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
        global.mockBehavior.updateComment = 2;
        comments.putComment(request.body, request.userRequest)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(500);
            expect(ERROR2.desc).toEqual('MockError');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('put');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            global.mockBehavior.updateComment = -1;
            comments.putComment(request.body, request.userRequest)
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(500);
                expect(ERROR3.desc).toEqual('Internal Server Error');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('put');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                global.mockBehavior.updateComment = -2;
                comments.putComment(request.body, request.userRequest)
                  .then(() => {
                    done.fail();
                  })
                  .catch((ERROR4) => {
                    expect(ERROR4.code).toEqual(500);
                    expect(ERROR4.desc).toEqual('MockError');
                    expect(ERROR4.data).toBeDefined();
                    expect(ERROR4.origin).toEqual('put');
                    expect(ERROR4.packName).toEqual('adp.comments.CommentsClass');
                    global.mockBehavior.updateComment = 0;
                    done();
                  });
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ putComment ] Negative Case when trying to update a comment and a validation crashes.', (done) => {
    const request = {
      body: {
        comment_id: 'ValidCommentID',
        comment_text: 'Updated Comment Text',
      },
    };
    const comments = new adp.comments.CommentsClass();
    comments.putComment(request.body)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.desc).toEqual('Internal Server Error');
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.origin).toEqual('put');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._extractUser = () => {
          const mockError = { mockSimpleError: true };
          return new Promise((RES, REJ) => REJ(mockError));
        };
        comments.putComment(request.body)
          .then(() => {
            done.fail();
          })
          .catch((ERROR1) => {
            expect(ERROR1.code).toEqual(500);
            expect(ERROR1.desc).toEqual('Internal Server Error');
            expect(ERROR1.desc).toBeDefined();
            expect(ERROR1.origin).toEqual('put');
            expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ postComment ] Successful Case when trying to update a comment.', async (done) => {
    const request = {
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
    const comments = new adp.comments.CommentsClass();
    await comments.postComment(request.body, request.userRequest, request.rbac)
      .then((RESULT) => {
        expect(RESULT.code).toEqual(200);
        expect(RESULT.message).toEqual('Comment created successful');
        expect(RESULT.BODYREQUEST).toEqual({
          location_id: 'ms_ValidMockMicroserviceID_id', location_title: 'mockTitle', location_page: 'h1_mock-title', location_author: ['mockName'], location_email: ['mockEmail'], location_signum: ['mockSignum'], comment_text: 'mockCommentText',
        });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ postComment ] Negative Case when trying to create a comment: adp.models.Comments() crashes in four different ways.', async (done) => {
    global.mockBehavior.createComment = 1;
    const request = {
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
    const comments = new adp.comments.CommentsClass();
    await comments.postComment(request.body, request.userRequest, request.rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR1) => {
        expect(ERROR1.code).toEqual(500);
        expect(ERROR1.desc).toEqual('Internal Server Error');
        expect(ERROR1.data).toBeDefined();
        expect(ERROR1.origin).toEqual('post');
        expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
        global.mockBehavior.createComment = 2;
        comments.postComment(request.body, request.userRequest, request.rbac)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(500);
            expect(ERROR2.desc).toEqual('Internal Server Error');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('post');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            global.mockBehavior.createComment = -1;
            comments.postComment(request.body, request.userRequest, request.rbac)
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(500);
                expect(ERROR3.desc).toEqual('Internal Server Error');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('post');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                global.mockBehavior.createComment = -2;
                comments.postComment(request.body, request.userRequest, request.rbac)
                  .then(() => {
                    done.fail();
                  })
                  .catch((ERROR4) => {
                    expect(ERROR4.code).toEqual(500);
                    expect(ERROR4.desc).toEqual('MockError');
                    expect(ERROR4.data).toBeDefined();
                    expect(ERROR4.origin).toEqual('post');
                    expect(ERROR4.packName).toEqual('adp.comments.CommentsClass');
                    global.mockBehavior.createComment = 0;
                    done();
                  });
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ postComment ] Negative Case when trying to create a comment and a validation crashes.', (done) => {
    const request = {
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
    };
    const comments = new adp.comments.CommentsClass();
    comments.postComment(request.body, {}, request.rbac)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.origin).toEqual('post');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._extractUser = () => {
          const mockError = { mockSimpleError: true };
          return new Promise((RES, REJ) => REJ(mockError));
        };
        comments.postComment(request.body, {}, request.rbac)
          .then(() => {
            done.fail();
          })
          .catch((ERROR1) => {
            expect(ERROR1.code).toEqual(400);
            expect(ERROR1.desc).toEqual('Bad Request');
            expect(ERROR1.desc).toBeDefined();
            expect(ERROR1.origin).toEqual('post');
            expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ getComment ] Successful Case when trying to read comments from a location.', async (done) => {
    const request = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
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
    const comments = new adp.comments.CommentsClass();
    await comments.getComment(request)
      .then((RESULT) => {
        expect(RESULT.code).toEqual(200);
        expect(RESULT.message).toEqual('Comments from ms_ValidMockMicroserviceID_id');
        expect(RESULT.docs).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
  it('[ getComment ] Negative Case when trying to read comments from a location: adp.models.Comments() crashes in four different ways.', async (done) => {
    global.mockBehavior.getCommentsByLocationID = 1;
    const request = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
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
    const comments = new adp.comments.CommentsClass();
    await comments.getComment(request)
      .then(() => {
        done.fail();
      })
      .catch((ERROR1) => {
        expect(ERROR1.code).toEqual(500);
        expect(ERROR1.desc).toEqual('Internal Server Error');
        expect(ERROR1.data).toBeDefined();
        expect(ERROR1.origin).toEqual('get');
        expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
        global.mockBehavior.getCommentsByLocationID = 2;
        comments.getComment(request)
          .then(() => {
            done.fail();
          })
          .catch((ERROR2) => {
            expect(ERROR2.code).toEqual(500);
            expect(ERROR2.desc).toEqual('Internal Server Error');
            expect(ERROR2.data).toBeDefined();
            expect(ERROR2.origin).toEqual('get');
            expect(ERROR2.packName).toEqual('adp.comments.CommentsClass');
            global.mockBehavior.getCommentsByLocationID = -1;
            comments.getComment(request)
              .then(() => {
                done.fail();
              })
              .catch((ERROR3) => {
                expect(ERROR3.code).toEqual(500);
                expect(ERROR3.desc).toEqual('Internal Server Error');
                expect(ERROR3.data).toBeDefined();
                expect(ERROR3.origin).toEqual('get');
                expect(ERROR3.packName).toEqual('adp.comments.CommentsClass');
                global.mockBehavior.getCommentsByLocationID = -2;
                comments.getComment(request)
                  .then(() => {
                    done.fail();
                  })
                  .catch((ERROR4) => {
                    expect(ERROR4.code).toEqual(500);
                    expect(ERROR4.desc).toEqual('MockError');
                    expect(ERROR4.data).toBeDefined();
                    expect(ERROR4.origin).toEqual('get');
                    expect(ERROR4.packName).toEqual('adp.comments.CommentsClass');
                    global.mockBehavior.getCommentsByLocationID = 0;
                    done();
                  });
              });
          });
      });
  });
  // =========================================================================================== //
  it('[ getComment ] Negative Case when trying to read comments and a validation crashes.', (done) => {
    const request = {
      body: {
        location_id: 'ms_ValidMockMicroserviceID_id',
      },
      rbac: {
        mockSignumTest: { admin: true },
      },
    };
    const comments = new adp.comments.CommentsClass();
    comments.getComment(request)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toEqual(400);
        expect(ERROR.desc).toEqual('Bad Request');
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.origin).toEqual('get');
        expect(ERROR.packName).toEqual('adp.comments.CommentsClass');
        comments._extractUser = () => {
          const mockError = { mockSimpleError: true };
          return new Promise((RES, REJ) => REJ(mockError));
        };
        comments.getComment(request)
          .then(() => {
            done.fail();
          })
          .catch((ERROR1) => {
            expect(ERROR1.code).toEqual(500);
            expect(ERROR1.desc).toEqual('Internal Server Error');
            expect(ERROR1.desc).toBeDefined();
            expect(ERROR1.origin).toEqual('get');
            expect(ERROR1.packName).toEqual('adp.comments.CommentsClass');
            done();
          });
      });
  });
  // =========================================================================================== //
  it('[ _checkId ] increasing coverage.', (done) => {
    const comments = new adp.comments.CommentsClass();
    comments._checkId('ms', 'ValidMockMicroserviceID', 'mockSignum', { mockSignum: { admin: true } })
      .then((RESULT1) => {
        expect(RESULT1.is_valid).toEqual(true);
        comments._checkId('msdocumentation', 'ValidMockMicroserviceID', 'mockSignum', { mockSignum: { admin: true } })
          .then((RESULT2) => {
            expect(RESULT2.is_valid).toEqual(true);
            comments._checkId('article', '1515', 'mockSignum', { mockSignum: { admin: true } })
              .then((RESULT3) => {
                expect(RESULT3.is_valid).toEqual(true);
                comments._checkId('tutorial', '2525', 'mockSignum', { mockSignum: { admin: true } })
                  .then((RESULT4) => {
                    expect(RESULT4.is_valid).toEqual(true);
                    comments._checkId('invalid', '2525', 'mockSignum', { mockSignum: { admin: true } })
                      .then(() => {
                        done.fail();
                      })
                      .catch((MOCKERROR) => {
                        expect(MOCKERROR.code).toEqual(400);
                        expect(MOCKERROR.desc).toEqual('Bad Request');
                        expect(MOCKERROR.data).toEqual({ id: '2525', is_valid: false });
                        expect(MOCKERROR.origin).toEqual('_checkId');
                        expect(MOCKERROR.packName).toEqual('adp.comments.CommentsClass');
                        done();
                      });
                  })
                  .catch(() => {
                    done.fail();
                  });
              })
              .catch(() => {
                done.fail();
              });
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });
  // =========================================================================================== //
});
// ============================================================================================= //
