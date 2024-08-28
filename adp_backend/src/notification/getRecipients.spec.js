// ============================================================================================= //
/**
* Unit test for [ global.adp.notification.getRecipients ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let getByQueryResponse;
let getByQueryFail;

class MockAdpClass {
  getAllAdminDevTeam() {
    return new Promise((resolve, reject) => {
      if (getByQueryFail) {
        return reject();
      }
      return resolve(getByQueryResponse);
    });
  }

  getAllAdminNotDevTeam() {
    return new Promise((resolve, reject) => {
      if (getByQueryFail) {
        return reject();
      }
      return resolve(getByQueryResponse);
    });
  }
}

const proxyquire = require('proxyquire').noCallThru();

describe('Testing [ global.adp.notification.getRecipients ] behavior', () => {
  let proxyGetAdminsByField = async () => [];
  const TestAssetObject = {
    action: 'update',
    ccMail: [],
    asset: {
      teamMails: [],
      team_mailers: [],
    },
    usr: [
      {
        email: 'email',
      },
    ],
    oldAsset: {},
  };
  let MockAdminEmailsList = {};
  let MockRespFieldListWithPermissions = [];
  let MockResppermissionToSendNotificationList = [];
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    MockAdminEmailsList = {};
    TestAssetObject.asset.teamMails = [];
    TestAssetObject.asset.team_mailers = [];
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    getByQueryResponse = { docs: [] };
    getByQueryFail = false;
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.config = {};
    global.adp.config.devModeMail = false;
    global.adp.db = {};
    global.adp.db.find = (DB, QUERY) => new Promise((RESOLVE, REJECT) => {
      const justAMockError = {};
      const justAMockResponse = MockAdminEmailsList;
      if (QUERY.selector.$and[0].role.$eq === 'admin') {
        RESOLVE(justAMockResponse);
      }
      REJECT(justAMockError);
    });
    global.adp.permission = {};
    global.adp.permission.fieldListWithPermissions = () => new Promise((MOCKRES1) => {
      MOCKRES1(MockRespFieldListWithPermissions);
    });
    global.adp.permission.permissionToSendNotificationList = () => new Promise((MOCKRES1) => {
      MOCKRES1(MockResppermissionToSendNotificationList);
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //

    global.adp.notification.getRecipients = proxyquire('./getRecipients', {
      '../permission/getAdminsByField': { fetchAdmins: (fieldId, optId) => proxyGetAdminsByField(fieldId, optId) },
    });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });

  it('Should send only one item(mailobject user) if there are no admins and no team mails in microservice object', () => {
    MockAdminEmailsList.docs = [];
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(1);
      });
  });

  it('Should send only team mails and mailobject user if the action is update', () => {
    MockAdminEmailsList.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push('Test email ms object');
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(2);
      });
  });

  it('Should send team mails, team mailers and mailobject user if the action is update', () => {
    MockAdminEmailsList.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push('Test email ms object');
    TestAssetObject.asset.team_mailers.push('mailer@test.com');
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(3);
      });
  });

  it('Should send admin emails list and mailobject user if there are admins in database and no team mails in microservice object', () => {
    TestAssetObject.action = 'someTest';
    getByQueryResponse = { docs: [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }] };
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(3);
        expect(RES.recipientsMail[2]).toBe(getByQueryResponse.docs[1].email);
      });
  });

  it('Should send domain admin emails list and team mails and mailobject user if there are admins in database and team mails in microservice object and action is not update', () => {
    TestAssetObject.action = 'not update';
    getByQueryResponse.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push('Test email ms object');
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(4);
        expect(RES.recipientsMail[1]).toBe(TestAssetObject.asset.teamMails[0]);
      });
  });

  it('Should send domain admin emails list and team mails and mailobject user if there are admins in database and team mails in microservice object and action is update', () => {
    getByQueryResponse.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push('Test email ms object');
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(4);
        expect(RES.recipientsMail[1]).toBe(TestAssetObject.asset.teamMails[0]);
      });
  });

  it('Should send domain admin emails list and exclude team mails if there are admins in database and team mails in microservice object are already in admin emails list', () => {
    TestAssetObject.action = 'update';
    getByQueryResponse.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push(getByQueryResponse.docs[0].email);
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(2);
        expect(RES.recipientsMail[1]).toBe(getByQueryResponse.docs[0].email);
      });
  });

  it('Should have admins and field admins on the recipient list of admin update mail', () => {
    TestAssetObject.asset.restrictedField = 1;
    TestAssetObject.action = 'updateadminnotify';
    getByQueryResponse.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push(getByQueryResponse.docs[0].email);
    MockRespFieldListWithPermissions = [
      {
        id: 1,
        slug: 'restrictedField',
      },
    ];
    MockResppermissionToSendNotificationList = {
      fieldAdminUser: {
        email: 'field admin user email',
      },
    };
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(4);
        expect(RES.recipientsMail[1]).toBe(getByQueryResponse.docs[0].email);
        expect(RES.recipientsMail[2]).toBe(getByQueryResponse.docs[1].email);
        expect(RES.recipientsMail[3]).toBe('field admin user email');
      });
  });

  it('Should have admins and field admins on the recipient list of highlighted update mail', () => {
    const user1 = { id: 1, email: 'test1 email' };
    const user3 = { id: 3, email: 'test3 email' };
    const AssetObject = JSON.parse(JSON.stringify(TestAssetObject));
    AssetObject.asset.restrictedField = 1;
    AssetObject.action = 'update';
    AssetObject.enableHighlight = true;

    AssetObject.asset.teamMails.push(user1.email);

    MockRespFieldListWithPermissions = [
      {
        id: 1,
        slug: 'restrictedField',
      },
    ];
    MockResppermissionToSendNotificationList = {
      fieldAdminUser: {
        email: 'field admin user email',
      },
    };
    const mockResponse = {
      docs: [user3],
    };
    getByQueryResponse = mockResponse;
    global.adp.notification.getRecipients(AssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(4);
        expect(RES.recipientsMail.indexOf('email')).toBeGreaterThan(-1); // Action user
        expect(RES.recipientsMail.indexOf('test1 email')).toBeGreaterThan(-1); // Team
        expect(RES.recipientsMail.indexOf('test3 email')).toBeGreaterThan(-1); // Admin
        expect(RES.recipientsMail.indexOf('field admin user email')).toBeGreaterThan(-1); // DomainAdmin
        expect(RES.recipientsMail.indexOf('test2 email')).toBeLessThan(0);
      });
  });

  it('Should include field admins iff exists in the recipents list', (done) => {
    TestAssetObject.asset.restrictedField = 1;
    TestAssetObject.action = 'update';
    MockAdminEmailsList.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push(MockAdminEmailsList.docs[0].email);
    MockRespFieldListWithPermissions = [
      {
        id: 1,
        slug: 'restrictedField',
      },
    ];
    MockResppermissionToSendNotificationList = {
      fieldAdminUser: {
        email: 'field admin user email',
      },
    };
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(2);
        expect(RES.recipientsMail[0]).toBe('email');
        expect(RES.recipientsMail[1]).toBe(MockAdminEmailsList.docs[0].email);
        expect(RES.ccMail.length).toBe(0);
        done();
      }).catch(done.fail);
  });

  it('Should not include field admins if does not exist in database', () => {
    TestAssetObject.asset.restrictedField = 1;
    TestAssetObject.action = 'update';
    MockAdminEmailsList.docs = [{ id: 1, email: 'test1 email' }, { id: 2, email: 'test2 email' }];
    TestAssetObject.asset.teamMails.push(MockAdminEmailsList.docs[0].email);
    MockRespFieldListWithPermissions = [
      {
        id: 1,
        slug: 'restrictedField',
      },
    ];
    MockResppermissionToSendNotificationList = {};
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(2);
        expect(RES.recipientsMail[1]).toBe('test1 email');
      });
  });

  it('action = changedomainnotify -> Should resolve with list of mails if found from db', () => {
    TestAssetObject.oldAsset.domain = 1;
    global.adp.config.devModeMail = false;
    const mockResponse = {
      docs: [
        { email: 'test3 email' },
      ],
    };
    getByQueryResponse = mockResponse;
    proxyGetAdminsByField = async () => ['test1 email', 'test2 email'];
    TestAssetObject.action = 'changedomainnotify';
    global.adp.notification.getRecipients(TestAssetObject)
      .then((RES) => {
        expect(RES.recipientsMail.length).toBe(3);
        expect(RES.recipientsMail.indexOf('test2 email')).toBeGreaterThan(-1);
        expect(RES.recipientsMail.indexOf('test3 email')).toBeGreaterThan(-1);
        expect(RES.recipientsMail.indexOf('test1 email')).toBeGreaterThan(-1);

        expect(RES.recipientsMail.indexOf('test4 email')).toBeLessThan(0);
      }).catch(() => {
        expect(false).toBeTruthy();
      });
  });

  it('action = changedomainnotify -> Should reject with error if found some error', () => {
    TestAssetObject.oldAsset.domain = 1;
    global.adp.config.devModeMail = false;
    const errorResp = { msg: 'Error' };
    proxyGetAdminsByField = () => Promise.reject(errorResp);
    TestAssetObject.action = 'changedomainnotify';
    global.adp.notification.getRecipients(TestAssetObject)
      .then(() => {
        expect(false).toBeTruthy();
      }).catch((ERR) => {
        expect(ERR).toBeTruthy();
      });
  });
});
// ============================================================================================= //
