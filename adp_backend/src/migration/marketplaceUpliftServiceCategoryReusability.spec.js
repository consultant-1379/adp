// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.marketplaceUpliftServiceCategoryReusability ]
* @author Armando Dias [zdiaarm]
*/
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.migration.marketplaceUpliftServiceCategoryReusability ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.fs = {};
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => `Id,Name,CategoryId,Category,AlignmentId,Alignment,StatusId,Status,DomainId,Domain,ServiceAreaId,Service Area,RestrictionStatusId,Restriction Status,Service Category,Reusability Level,Domain ,Doubt
    45e7f4f992afe7bbb62a3391e500e71b,Admin User Management,3,Incubating,1,ADP Core,2,In Development,1,Common Asset,6,Security,0,Unrestricted,ADP Generic Services,Candidate,Common Asset,
    45e7f4f992afe7bbb62a3391e500f84a,ADP Application manager Portal,3,Incubating,3,Other,1,Idea,6,Other,7,Other,0,Unrestricted,ADP Domain Specific Services,None,Other,`;
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.path = '/mockPath/app/src/';
    global.adp.echoLog = () => true;
    global.adp.echoDivider = () => true;
    global.adp.microservice = {};
    global.adp.microservice.validateSchema = () => true;
    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise(RES => RES());
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = '[{"id":1,"group":"Reusability Level","slug":"reusability_level","testID":"group-reusability-level","items":[{"id":1,"name":"Reused","testID":"filter-reused","order":1},{"id":2,"name":"Open for Reuse","testID":"filter-open-for-reuse","order":2},{"id":3,"name":"Candidate","testID":"filter-candidate","order":3},{"id":4,"name":"None","testID":"filter-none","order":4}],"order":1,"showAsFilter":false},{"id":2,"group":"Service Category","slug":"service_category","testID":"group-service-category","items":[{"id":1,"name":"ADP Generic Services","testID":"filter-adp-generic-services","order":1},{"id":2,"name":"ADP Reusable Services","testID":"filter-adp-reusable-services","order":2},{"id":3,"name":"ADP Domain Specific Services","testID":"filter-adp-domain-specific-services","order":3},{"id":4,"name":"ADP Application Specific Services","testID":"filter-adp-application-specific-services","order":4},{"id":5,"name":"Other Ericsson Services","testID":"filter-other-ericsson-services","order":5}],"order":2,"showAsFilter":true},{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"name":"Common Asset","testID":"filter-common-asset","order":1},{"id":2,"name":"OSS","testID":"filter-oss","order":2},{"id":3,"name":"BSS","testID":"filter-bss","order":3},{"id":4,"name":"COS","testID":"filter-cos","order":5},{"id":5,"name":"DNEW","testID":"filter-dnew","order":6},{"id":7,"name":"PacketCore","testID":"filter-packet-core","order":4},{"id":6,"name":"Other","testID":"filter-other","order":7}],"order":3,"showAsFilter":true},{"id":4,"group":"Service Area","slug":"serviceArea","testID":"group-service-area","items":[{"id":1,"name":"Data","testID":"filter-data","order":1},{"id":2,"name":"Messaging","testID":"filter-messaging","order":2},{"id":3,"name":"Networking","testID":"filter-networking","order":3},{"id":4,"name":"Management","testID":"filter-management","order":4},{"id":5,"name":"Monitoring","testID":"filter-monitoring","order":5},{"id":6,"name":"Security","testID":"filter-security","order":6},{"id":7,"name":"Other","testID":"filter-other","order":7}],"order":4,"showAsFilter":true},{"id":5,"group":"Status","slug":"status","testID":"group-status","items":[{"id":1,"name":"Idea","color":"#e7eb90","testID":"filter-idea","acceptancePercentage":25,"iconFileName":"Icon_Idea.svg","order":1},{"id":4,"name":"Proof of Concept","color":"#c5789e","testID":"filter-proof-of-concept","acceptancePercentage":40,"iconFileName":"Proof_of_Concept_Icon.png","order":2},{"id":2,"name":"In Development","color":"#62bbc1","testID":"filter-in-development","acceptancePercentage":50,"iconFileName":"Icon_In_development.svg","order":3},{"id":3,"name":"PRA","color":"#004385","testID":"filter-pra","acceptancePercentage":100,"iconFileName":"Icon_PRA_PRA_DevOps.svg","order":4}],"order":5,"showAsFilter":true},{"id":6,"group":"Restricted","slug":"restricted","testID":"group-restricted","items":[{"id":0,"name":"Unrestricted","code":"0","testID":"filter-unrestricted","order":1},{"id":1,"name":"Other","code":"1","testID":"filter-other","order":2},{"id":2,"name":"Temporary Delivery Restriction","code":"RE0","testID":"filter-temporary-delivery-restriction","order":3},{"id":3,"name":"Warning, Phase-out Process is starting","code":"RE1","testID":"filter-warning-phase-out-process-is-starting","order":4},{"id":7,"name":"End of Support","code":"RE5","testID":"filter-end-of-support","order":5}],"order":6,"showAsFilter":false},{"id":7,"group":"Documentation Categories","slug":"documentation-categories","testID":"group-documentation-categories","items":[{"id":1,"name":"General","testID":"filter-general","order":1},{"id":2,"name":"Developer","testID":"filter-developer","order":2}],"order":7,"showAsFilter":false},{"id":8,"group":"Documentation Titles","slug":"documentation-titles","testID":"group-documentation-titles","items":[{"id":1,"documentationCategories":1,"name":"Service Overview","testID":"filter-service-overview","order":1},{"id":2,"documentationCategories":1,"name":"Service Deployment Guide","testID":"filter-service-deployment-guide","order":2},{"id":3,"documentationCategories":1,"name":"Troubleshooting Guide","testID":"filter-troubleshooting-guide","order":3},{"id":4,"documentationCategories":1,"name":"Functional Area Description","testID":"filter-functional-area-description","order":4},{"id":5,"documentationCategories":1,"name":"Component Description","testID":"filter-component-description","order":5},{"id":6,"documentationCategories":1,"name":"Released Documentation","testID":"filter-released-documentation","order":6},{"id":7,"documentationCategories":2,"name":"Application Developers Guide","testID":"filter-application-developers-guide","order":7},{"id":8,"documentationCategories":2,"name":"API Information","testID":"filter-api-information","order":8},{"id":9,"documentationCategories":2,"name":"Inner Source Readme","testID":"filter-inner-source-readme","order":9},{"id":10,"documentationCategories":2,"name":"Inner Source Contribute","testID":"filter-inner-source-contribute","order":10},{"id":11,"documentationCategories":0,"name":"Other Documents","testID":"filter-other-documents","order":99}],"order":8,"showAsFilter":false},{"id":9,"group":"Team Roles","slug":"team_role","testID":"group-team-role","items":[{"id":1,"name":"PO","testID":"filter-po","order":1},{"id":2,"name":"SPM","testID":"filter-spm","order":2},{"id":3,"name":"Other","testID":"filter-other","order":3}],"order":9,"showAsFilter":false}]';
    global.adp.migration = {};
    global.adp.migration.memoryCache = {};
    global.adp.migration.memoryCache.marketplaceUpliftServiceCategoryReusability = null;
    global.adp.migration.dataNormalize = (ITEM) => {
      let resp = false;
      switch (ITEM.reusability_level) {
        case 'None':
          resp = {
            reusability_level: 4,
            service_category: 3,
          };
          break;
        case 'Candidate':
          resp = {
            reusability_level: 3,
            service_category: 1,
          };
          break;
        default:
          resp = false;
          break;
      }
      return resp;
    };
    global.adp.migration.marketplaceUpliftServiceCategoryReusability = require('./marketplaceUpliftServiceCategoryReusability.js');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing Migration Script with Mock Asset', (done, fail) => {
    const mockAsset = {
      _id: '45e7f4f992afe7bbb62a3391e500e71b',
      name: 'Mock Asset',
      category: 1,
      alignment: 2,
    };
    global.adp.migration.marketplaceUpliftServiceCategoryReusability(mockAsset, 'FORCE')
      .then((RESULT) => {
        expect(RESULT.reusability_level).toBe(3);
        expect(RESULT.service_category).toBe(1);
        done();
      })
      .catch(() => {
        fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing Migration Script with another Mock Asset', (done, fail) => {
    const mockAsset = {
      _id: '45e7f4f992afe7bbb62a3391e500f84a',
      name: 'Mock Asset',
      category: 4,
      alignment: 3,
    };
    global.adp.migration.marketplaceUpliftServiceCategoryReusability(mockAsset, 'FORCE')
      .then((RESULT) => {
        expect(RESULT.reusability_level).toBe(4);
        expect(RESULT.service_category).toBe(3);
        done();
      })
      .catch(() => {
        fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Testing Migration Script with a Mock Asset which is not in the Migration List', (done, fail) => {
    const mockAsset = {
      _id: '45e7f4f9923534534535dfgdgf3391e500f84a',
      name: 'Mock Asset',
      category: 1,
      alignment: 1,
    };
    global.adp.migration.marketplaceUpliftServiceCategoryReusability(mockAsset, 'FORCE')
      .then((RESULT) => {
        expect(RESULT.reusability_level).toBe(4);
        expect(RESULT.service_category).toBe(5);
        done();
      })
      .catch(() => {
        fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
