// ============================================================================================= //
/**
* Unit test for [ global.adp.permission.fieldIsEditableByPermissionRules ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.permission.fieldIsEditableByPermissionRules ] behavior.', () => {
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
    global.adp.permission.fieldListWithPermissions = () => new Promise((RES) => {
      global.adp.permission.fieldPermissionCache = [{ id: 3, slug: 'domain' }];
      RES();
    });
    global.adp.permission.fieldIsEditableByPermissionRulesCacheIt = () => new Promise((RES) => {
      global.adp.permission.fieldIsEditableByPermissionRulesCache = [{ field: 'category', readOnlyExceptionsForListOption: [3] }];
      RES();
    });
    global.adp.permission.checkFieldPermissionCacheIt = () => new Promise((RES) => {
      global.adp.permission.checkFieldPermissionCache = {
        3: {
          1: {
            fieldAdministrators: {
              etesuse: {
                notification: [
                  'update',
                  'delete',
                ],
              },
              etesase: {
                notification: [
                  'create',
                  'update',
                  'delete',
                ],
              },
            },
          },
          2: {
            fieldAdministrators: {
              eterase: {
                notification: [
                  'delete',
                ],
              },
            },
          },
        },
      };
      RES();
    });
    global.adp.permission.checkFieldPermission = () => new Promise((RES) => {
      const obj = {
        etesuse: { notification: ['update', 'delete'] },
        etesase: { notification: ['create', 'update', 'delete'] },
      };
      RES(obj);
    });
    global.adp.listOptions = {};
    const optionsString = '[{"id":1,"group":"Category","slug":"category","testID":"group-category","items":[{"id":1,"name":"Fully supported for reuse","desc":"You can reuse these governed and approved microservices in live products.","testID":"filter-fully-supported-for-reuse","order":1},{"id":2,"name":"Check before reuse","desc":"These microservices are potentially reusable – check with the service owner to understand more.","testID":"filter-check-before-reuse","order":2},{"id":3,"name":"Incubating","desc":"These microservices have something brewing but not quite ready yet. Contact the submitter to collaborate or as questions.","testID":"filter-incubating","order":3},{"id":4,"name":"Deprecated","desc":"It has been decided that these microservices will not be progressed further. If you have questions, contact the submitter.","testID":"filter-deprecated","order":4}],"order":1},{"id":2,"group":"Alignment","slug":"alignment","testID":"group-alignment","items":[{"id":1,"name":"ADP Core","testID":"filter-adp-core","order":1},{"id":2,"name":"ADP Other Generic","testID":"filter-adp-other-generic","order":2},{"id":3,"name":"Other","testID":"filter-other","order":3}],"order":2},{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"name":"Common Asset","testID":"filter-common-asset","order":1},{"id":2,"name":"OSS","testID":"filter-oss","order":2},{"id":3,"name":"BSS","testID":"filter-bss","order":3},{"id":4,"name":"COS","testID":"filter-cos","order":5},{"id":5,"name":"DNEW","testID":"filter-dnew","order":6},{"id":7,"name":"PacketCore","testID":"filter-packet-core","order":4},{"id":6,"name":"Other","testID":"filter-other","order":7}],"order":3},{"id":4,"group":"Service Area","slug":"serviceArea","testID":"group-service-area","items":[{"id":1,"name":"Data","testID":"filter-data","order":1},{"id":2,"name":"Messaging","testID":"filter-messaging","order":2},{"id":3,"name":"Networking","testID":"filter-networking","order":3},{"id":4,"name":"Management","testID":"filter-management","order":4},{"id":5,"name":"Monitoring","testID":"filter-monitoring","order":5},{"id":6,"name":"Security","testID":"filter-security","order":6},{"id":7,"name":"Other","testID":"filter-other","order":7}],"order":4},{"id":5,"group":"Service Maturity","slug":"service_maturity","testID":"group-service-maturity","items":[{"id":1,"name":"Idea","color":"#e7eb90","testID":"filter-idea","acceptancePercentage":25,"iconFileName":"Icon_Idea.svg","order":1},{"id":4,"name":"Proof of Concept","color":"#c5789e","testID":"filter-proof-of-concept","acceptancePercentage":40,"iconFileName":"Proof_of_Concept_Icon.png","order":2},{"id":2,"name":"In Development","color":"#62bbc1","testID":"filter-in-development","acceptancePercentage":50,"iconFileName":"Icon_In_development.svg","order":3},{"id":3,"name":"PRA","color":"#004385","testID":"filter-pra","acceptancePercentage":100,"iconFileName":"Icon_PRA_PRA_DevOps.svg","order":4}],"order":5}]';
    global.adp.listOptions.get = () => new Promise((RES) => {
      global.adp.listOptions.cache = {
        options: optionsString,
        date: new Date(),
      };
      RES(global.adp.listOptions.cache);
    });
    global.mock = {};
    global.mock.asset1 = {
      _id: '45e7f4f992afe7bbb62a3391e500f84a',
      _rev: '1-36541b279e7266abed0870daba4acb92',
      approval: 'approved',
      team: [
        {
          team_role: 1,
          serviceOwner: true,
          signum: 'esupuse',
        },
      ],
      owner: 'esupuse',
      name: 'Auto MS in Common Asset Domain',
      description: 'Domain is Common Asset, so [etesuse] is Domain Admin in this test',
      restricted: 0,
      alignment: 2,
      domain: 1,
      serviceArea: 6,
      category: 2,
      service_maturity: 4,
      based_on: 'Ericsson Internal',
      teamMails: [
        'super-user@adp-test.com',
      ],
      type: 'microservice',
      slug: 'auto-ms-in-common-asset-domain',
    };
    global.adp.permission.fieldIsEditableByPermissionRules = require('./fieldIsEditableByPermissionRules'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.permission.fieldIsEditableByPermissionRules ] should return an Empty Array because user is Domain Admin.', (done) => {
    global.adp.permission.fieldIsEditableByPermissionRules(global.mock.asset1, 'etesuse')
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(expectReturn).toEqual([]);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.permission.fieldIsEditableByPermissionRules ] should return an Specific Array blocking "category" field because user is not Domain Admin nor Admin.', (done) => {
    global.adp.permission.fieldIsEditableByPermissionRules(global.mock.asset1, 'notadmin')
      .then((expectReturn) => {
        expect(expectReturn).toBeDefined();
        expect(expectReturn).toEqual(['category']);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
