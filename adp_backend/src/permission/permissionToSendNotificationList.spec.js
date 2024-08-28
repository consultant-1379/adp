// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.permissionToSendNotificationList ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
let permissionsResponse = [];
describe('Testing [ global.adp.permission.permissionToSendNotificationList ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RES1) => {
      RES1('[{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"name":"Common Asset","testID":"filter-common-asset","order":1},{"id":2,"name":"OSS","testID":"filter-oss","order":2},{"id":3,"name":"BSS","testID":"filter-bss","order":3},{"id":4,"name":"COS","testID":"filter-cos","order":5},{"id":5,"name":"DNEW","testID":"filter-dnew","order":6},{"id":7,"name":"PacketCore","testID":"filter-packet-core","order":4},{"id":6,"name":"Other","testID":"filter-other","order":7}],"order":3}]');
    });
    global.adp.user = {};
    global.adp.user.getUserNameMail = SIGNUM => new Promise((RE3) => {
      switch (SIGNUM) {
        case 'eterase':
          RE3({ name: 'Rase User', email: 'rase-user@adp-test.com' });
          break;
        case 'etesase':
          RE3({ name: 'Sase User', email: 'sase-user@adp-test.com' });
          break;
        default:
          RE3(null);
          break;
      }
    });
    global.adp.permission = {};
    global.adp.permission.checkFieldPermission = () => new Promise((MOCKRES1) => {
      MOCKRES1(permissionsResponse);
    });
    global.adp.permission.checkFieldPermissionCacheIt = () => new Promise((MOCKRES1) => {
      MOCKRES1([]);
    });
    global.adp.permission.permissionToSendNotificationList = require('./permissionToSendNotificationList'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return one specific user who wants to receive "Create" notifications.', (done) => {
    // eslint-disable-next-line prefer-destructuring
    permissionsResponse = { etesase: { notification: ['create', 'update', 'delete'] } };
    global.adp.permission.permissionToSendNotificationList(3, 1, 'create')
      .then((expectReturn) => {
        expect(expectReturn).toEqual({ etesase: { name: 'Sase User', email: 'sase-user@adp-test.com' } });
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('Should return two specific users who wants to receive "Update" notifications.', (done) => {
    // eslint-disable-next-line prefer-destructuring
    permissionsResponse = {
      eterase: { notification: ['update', 'delete'] },
      etesase: { notification: ['create', 'update', 'delete'] },
    };
    global.adp.permission.permissionToSendNotificationList(3, 1, 'update')
      .then((expectReturn) => {
        expect(expectReturn).toEqual({
          eterase: { name: 'Rase User', email: 'rase-user@adp-test.com' },
          etesase: { name: 'Sase User', email: 'sase-user@adp-test.com' },
        });
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
// ============================================================================================= //
