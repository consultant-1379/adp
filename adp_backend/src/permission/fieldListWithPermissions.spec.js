// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.fieldListWithPermissions ]
* @author Omkar Sadegaonkar
*/
// ============================================================================================= //
let listOptionsResp = '';
describe('Testing [ global.adp.permission.fieldListWithPermissions ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.permission = {};
    global.adp.permission.fieldPermissionCache = {};
    global.adp.permission.fieldListWithPermissions = require('./fieldListWithPermissions'); // eslint-disable-line global-require
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RES1) => {
      RES1(listOptionsResp);
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should use the chached permissions array', (done) => {
    global.adp.permission.fieldPermissionCache = 'something';
    global.adp.permission.fieldListWithPermissions()
      .then((expectReturn) => {
        expect(expectReturn).toBe(global.adp.permission.fieldPermissionCache);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should not use cached array and return appropriate result for one field', (done) => {
    listOptionsResp = '[{"id":1,"group":"Field1","slug":"field1"}, {"id":2,"group":"Field2","slug":"field2"}]';
    global.adp.permission.fieldPermissionCache = undefined;
    global.adp.config.schema.microservice = {
      properties: {
        field1: {
          permission_rules: true,
        },
      },
    };
    global.adp.permission.fieldListWithPermissions()
      .then((expectReturn) => {
        expect(expectReturn.length).toBe(1);
        expect(expectReturn[0].slug).toBe('field1');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should not use cached array and return appropriate result with two fields', (done) => {
    listOptionsResp = '[{"id":1,"group":"Field1","slug":"field1"}, {"id":2,"group":"Field2","slug":"field2"}]';
    global.adp.permission.fieldPermissionCache = undefined;
    global.adp.config.schema.microservice = {
      properties: {
        field1: {
          permission_rules: true,
        },
        field2: {
          permission_rules: true,
        },
      },
    };
    global.adp.permission.fieldListWithPermissions()
      .then((expectReturn) => {
        expect(expectReturn.length).toBe(2);
        expect(expectReturn[0].slug).toBe('field1');
        expect(expectReturn[1].slug).toBe('field2');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should reject if listoptions does not give appropriate response', (done) => {
    global.adp.permission.fieldPermissionCache = undefined;
    listOptionsResp = '';
    global.adp.permission.fieldListWithPermissions()
      .then(() => {
        done();
      }).catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
