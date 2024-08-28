// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.fieldIsEditableByPermissionRulesCacheIt ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.fieldIsEditableByPermissionRulesCacheIt ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.cache = {};
    global.adp.echoLog = () => true;
    global.adp.cache.timeInSecondsForDatabase = 10;
    global.adp.config = {};
    global.adp.config.schema = {};
    global.adp.config.schema.microservice = {
      id: '/microservice',
      type: 'object',
      properties: {
        name: {
          description: 'The Name of the MicroService',
          type: 'string',
          minLength: '3',
          maxLength: '40',
          mail_name: 'Service Name',
          mail_order: 1,
        },
        category: {
          description: 'The ID of the Category of the MicroService.',
          type: 'integer',
          mail_name: 'Category',
          mail_order: 6,
          update_only_by_permission_rules: [3],
        },
        domain: {
          description: 'The ID of the Domain of the MicroService',
          type: 'integer',
          mail_name: 'Domain',
          mail_order: 10,
          permission_rules: true,
        },
      },
    };
    global.adp.db = {};
    global.adp.db.find = () => new Promise((RESOLVE) => {
      const mockPermDB = {
        docs:
          [
            {
              'group-id': 1,
              'item-id': 1,
              admin: 'test',
            },
          ],
      };
      RESOLVE(mockPermDB);
    });
    global.adp.permission = {};
    global.adp.permission.fieldIsEditableByPermissionRulesCacheIt = require('./fieldIsEditableByPermissionRulesCacheIt'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.fieldIsEditableByPermissionRulesCacheIt ] should return a generated object from mock schema file.', (done) => {
    const expectedReturnObject = [
      {
        field: 'category',
        readOnlyExceptionsForListOption: [3],
      },
    ];
    global.adp.permission.fieldIsEditableByPermissionRulesCacheIt()
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(expectReturn).toEqual(expectedReturnObject);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.fieldIsEditableByPermissionRulesCacheIt ] should return a mock cached object.', (done) => {
    const expectedReturnObject = [
      {
        field: 'category',
        readOnlyExceptionsForListOption: [3, 5],
      },
    ];
    global.adp.permission.fieldIsEditableByPermissionRulesCache = expectedReturnObject;

    global.adp.permission.fieldIsEditableByPermissionRulesCacheIt()
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(expectReturn).toEqual(expectedReturnObject);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
