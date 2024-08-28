// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.sendCommentsMail ]
* @author Rinosh
*/
// ============================================================================================= //
describe('Testing [ global.adp.notification.sendCommentsMail ] behavior', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.mockBehavior = {
      buildComments: 1,
      read: 1,
    };
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {};
    global.adp.config.schema.microservice.properties = {};

    global.adp.notification.buildCommentsHTML = obj => new Promise((RESOLVE, REJECT) => {
      if (global.mockBehavior.buildComments) {
        RESOLVE(obj);
      } else {
        const err = `Error in [ ${obj.action} Promise Chain ]`;
        REJECT(err);
      }
    });
    global.adp.notification.sendMail = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.user = {};
    global.adp.user.read = {};
    global.adp.user.read = USR => new Promise((RESOLVE, REJECT) => {
      let user = {};
      if (global.mockBehavior.read === 1) {
        user = {
          docs: [
            {
              signum: 'test',
              name: 'test name',
              email: 'test mail',
              role: 'user',
            },
          ],
        };
      } else if (global.mockBehavior.read === 2) {
        user = {
          docs: [
            {
              signum: 'test',
              name: 'test name',
              email: 'test mail',
              role: 'user',
            },
            {
              signum: 'test',
              name: 'test name',
              email: 'test mail',
              role: 'user',
            },
          ],
        };
      } else if (global.mockBehavior.read === 0) {
        user = {
          docs: {},
        };
      }
      if (USR === 'validuser') {
        RESOLVE(user);
      }
      const err = 'invaliduser';
      REJECT(err);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.notification.sendCommentsMail = require('./sendCommentsMail');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Should reject if the user parameter is missing or null', () => {
    global.adp.notification.sendCommentsMail()
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The USR is a mandatory parameter');
      });
    global.adp.notification.sendCommentsMail(null)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The USR is a mandatory parameter');
      });
  });

  it('Should reject if the comment parameter is missing or null', () => {
    global.adp.notification.sendCommentsMail('validuser', 'update')
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The COMMENT is a mandatory parameter');
      });
    global.adp.notification.sendCommentsMail('validuser', 'update', null)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The COMMENT is a mandatory parameter');
      });
  });

  it('Should reject if the action parameter is missing or null', () => {
    const mockComment = {
      name: 'test comment',
    };
    const mockUSR = {
      signum: 'validuser',
    };
    global.adp.notification.sendCommentsMail(mockUSR, null, mockComment)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ACTION is a mandatory parameter');
      });
    global.adp.notification.sendCommentsMail(mockUSR, null, mockComment)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ACTION is a mandatory parameter');
      });
  });

  it('Should reject if the buildCommentsHTML method throws error', () => {
    global.mockBehavior.buildComments = 0;
    const mockComment = {
      name: 'test comment',
    };
    const mockUSR = {
      signum: 'validuser',
    };
    const mockAction = 'add';
    global.adp.notification.sendCommentsMail(mockUSR, mockAction, mockComment)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual(`ERROR :: Error in [ ${mockAction} Promise Chain ]`);
      });
  });

  it('Should reject if the user.read method throws error', () => {
    const mockComment = {
      name: 'test comment',
    };
    const mockUSR = {
      signum: 'invaliduser',
    };
    const mockAction = 'add';
    global.adp.notification.sendCommentsMail(mockUSR, mockAction, mockComment)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual(`Error on retrieve User from Database: ${mockUSR.signum}`);
      });
  });

  it('Should reject if the user.read method returns 2 users', () => {
    global.mockBehavior.read = 2;
    const mockComment = {
      name: 'test comment',
    };
    const mockUSR = {
      signum: 'validuser',
    };
    const mockAction = 'add';
    global.adp.notification.sendCommentsMail(mockUSR, mockAction, mockComment)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual(`Error on retrieve User from Database: ${mockUSR.signum}`);
      });
  });

  it('Should send email for all valid parameters', () => {
    const mockComment = {
      name: 'test comment',
    };
    const mockUSR = {
      signum: 'validuser',
    };
    const mockAction = 'add';
    global.adp.notification.sendCommentsMail(mockUSR, mockAction, mockComment)
      .then((resp) => {
        expect(resp.action).toEqual(mockAction);
        expect(resp.comment).toEqual(mockComment);
      });
  });
});
// ============================================================================================= //
