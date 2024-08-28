// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.sendAssetMail ]
* @author
*/
// ============================================================================================= //
describe('Testing [ global.adp.notification.sendAssetMail ] behavior', () => {
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {};
    global.adp.config.schema.microservice.properties = {};

    global.adp.notification.getRecipients = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.buildMailSchema = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.buildAssetData = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.buildAssetHTML = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.sendMail = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.buildAssetUpdateData = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.notification.buildAssetAdminUpdateData = obj => new Promise((RESOLVE) => {
      RESOLVE(obj);
    });
    global.adp.user = {};
    global.adp.user.read = {};
    global.adp.user.read = USR => new Promise((RESOLVE, REJECT) => {
      const user = {
        docs: [
          {
            signum: 'test',
            name: 'test name',
            email: 'test mail',
            role: 'user',
          },
        ],
      };
      if (USR === 'validuser') {
        RESOLVE(user);
      }
      REJECT();
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    /* eslint-disable global-require */
    global.adp.notification.sendAssetMail = require('./sendAssetMail');
    /* eslint-enable global-require */
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Should reject if the user parameter is missing or null', () => {
    global.adp.notification.sendAssetMail()
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The USR is a mandatory parameter');
      });
    global.adp.notification.sendAssetMail(null)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The USR is a mandatory parameter');
      });
  });

  it('Should reject if the asset parameter is missing or null', () => {
    global.adp.notification.sendAssetMail('validuser', 'update')
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ASSET is a mandatory parameter');
      });
    global.adp.notification.sendAssetMail('validuser', 'update')
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ASSET is a mandatory parameter');
      });
  });

  it('Should reject if the action parameter is missing or null', () => {
    const mockAsset = {
      name: 'test service',
      alignment: 1,
    };
    const mockOldAsset = {
      name: 'test service',
      alignment: 2,
    };
    const mockUSR = {
      signum: 'validuser',
    };
    global.adp.notification.sendAssetMail(mockUSR, null, mockAsset, mockOldAsset)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ACTION is a mandatory parameter');
      });
    global.adp.notification.sendAssetMail(mockUSR, null, mockAsset, mockOldAsset)
      .then(() => {
      })
      .catch((err) => {
        expect(err).toEqual('The ACTION is a mandatory parameter');
      });
  });

  it('Should send email for all valid parameters', () => {
    const mockAsset = {
      name: 'test service',
      alignment: 1,
    };
    const mockOldAsset = {
      name: 'test service',
      alignment: 2,
    };
    const mockUSR = {
      signum: 'validuser',
    };
    const mockAction = 'create';
    global.adp.notification.sendAssetMail(mockUSR, mockAction, mockAsset, mockOldAsset)
      .then((resp) => {
        expect(resp.action).toEqual(mockAction);
        expect(resp.asset).toEqual(mockAsset);
        expect(resp.oldAsset).toEqual(mockOldAsset);
      });
  });
});
// ============================================================================================= //
