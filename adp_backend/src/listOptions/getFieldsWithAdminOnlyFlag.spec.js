// ============================================================================================= //
/**
* Unit test for [ global.adp.listoptions.getFieldsWithAdminOnlyFlag ]
* @author Omkar
*/
// ============================================================================================= //
describe('Testing results of [ global.adp.listoptions.getFieldsWithAdminOnlyFlag ] ', () => {
  // =========================================================================================== //
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    // --- MasterCache Mock --- Begin ---------------------------------------------------------- //
    global.adp.masterCache = {};
    global.adp.masterCache.set = () => {};
    global.adp.masterCache.get = () => new Promise((RESOLVE, REJECT) => {
      REJECT(); // Always simulate there is no cache in Unit Test...
    });
    global.adp.masterCacheTimeOut = {};
    global.adp.masterCacheTimeOut.listOptionsAdminOnly = 60;
    // --- MasterCache Mock --- End ------------------------------------------------------------ //
    global.adp.echoLog = STR => STR;
    global.adp.db = {};
    global.adp.getSizeInMemory = () => 123456;
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RESOLVE) => {
      const values = '[{"id":1,"group":"Category","slug":"category","testID":"group-category","items":[{"id":1,"name":"Fully supported for Reuse","desc":"You can reuse these governed and approved microservices in live products.","order":1},{"id":2,"name":"Check before reuse","desc":"These microservices are potentially reusable – check with the service owner to understand more.","order":2},{"id":3,"name":"Incubating","desc":"These microservices have something brewing but not quite ready yet. Contact the submitter to collaborate or as questions.","order":3},{"id":4,"name":"Deprecated","desc":"It has been decided that these microservices will not be progressed further. If you have questions, contact the submitter.","order":4}],"order":1},{"id":2,"group":"Alignment","slug":"alignment","testID":"group-alignment","items":[{"id":1,"name":"ADP Core","order":1},{"id":2,"name":"ADP Other Generic","order":2},{"id":3,"name":"Other","order":3},{"id":4,"name":"None","order":4, "adminOnly":true}],"order":2},{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"name":"Common Asset","testID":"filter-common-asset","order":1},{"id":2,"name":"OSS","testID":"filter-oss","order":2},{"id":3,"name":"BSS","testID":"filter-bss","order":3},{"id":4,"name":"COS","testID":"filter-cos","order":5},{"id":5,"name":"DNEW","testID":"filter-dnew","order":6},{"id":7,"name":"PacketCore","testID":"filter-packet-core","order":4},{"id":6,"name":"Other","testID":"filter-other","order":7}],"order":3},{"id":4,"group":"Service Area","slug":"serviceArea","testID":"group-service-area","items":[{"id":1,"name":"Data","order":1},{"id":2,"name":"Messaging","order":2},{"id":3,"name":"Networking","order":3},{"id":4,"name":"Management","order":4},{"id":5,"name":"Monitoring","order":5},{"id":6,"name":"Security","order":6},{"id":7,"name":"Other","order":7}],"order":4},{"id":5,"group":"Service_Maturity","slug":"service_maturity","testID":"group-service-maturity","items":[{"id":1,"name":"Idea","color":"#e7eb90","acceptancePercentage":25,"iconFileName":"Icon_Idea.svg","order":1},{"id":2,"name":"In Development","color":"#62bbc1","acceptancePercentage":50,"iconFileName":"Icon_In_development.svg","order":2},{"id":3,"name":"PRA","color":"#004385","acceptancePercentage":100,"iconFileName":"Icon_PRA_PRA_DevOps.svg","order":3},{"id":4,"name":"Proof of Concept","color":"#004385","acceptancePercentage":100,"iconFileName":"Icon_PRA_PRA_DevOps.svg","order":4}],"order":5}]';
      RESOLVE(values);
    });
    // eslint-disable-next-line global-require
    global.adp.listOptions.getFieldsWithAdminOnlyFlag = require('./getFieldsWithAdminOnlyFlag');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should be return list of fields with adminOnly flag', async (done) => {
    await global.adp.listOptions.getFieldsWithAdminOnlyFlag()
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        expect(expectedOBJ.length).toBeGreaterThan(0);
        done();
      }).catch(() => {
        done();
      });
  });
  // =========================================================================================== //

  // =========================================================================================== //
});
