// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.documentationMenuStructure ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.documentationMenuStructure ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.mockListOptionsError = false;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    const mockListOptions = '[{"id":2,"group":"Service Category","slug":"service_category","testID":"group-service-category","items":[{"id":1,"documentationCategories":0,"name":"ADP Generic Services","code":"","desc":"Microservices providing functions that are considered common to many applications. They are centrally developed and maintained by the ADP Program.","color":"","testID":"filter-adp-generic-services","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"ADP Reusable Services","code":"","desc":"Microservices providing complementary functions that different applications could benefit from. They are NOT directly developed and maintained by the ADP Program.","color":"","testID":"filter-adp-reusable-services","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"ADP Domain Specific Services","code":"","desc":"Microservices providing functions that are considered common in a specific application domain. They can be used by multiple applications within the same domain.","color":"","testID":"filter-adp-domain-specific-services","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":4,"documentationCategories":0,"name":"ADP Application Specific Services","code":"","desc":"Microservices providing functions that are currently used by one single application and commonality is not confirmed yet.","color":"","testID":"filter-adp-application-specific-services","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false},{"id":5,"documentationCategories":0,"name":"Non-ADP Services","code":"","desc":"Microservices which provide common functions but do NOT adhere to ADP architecture and framework.","color":"","testID":"filter-other-ericsson-services","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"","default":false}],"order":1,"showAsFilter":true},{"id":1,"group":"Reusability Level","slug":"reusability_level","testID":"group-reusability-level","items":[{"id":1,"documentationCategories":0,"name":"Reused","code":"","desc":"The service is reused by two or more applications.","color":"","testID":"filter-reused","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"Open for Reuse","code":"","desc":"The service is now ready to be reused by different applications.","color":"","testID":"filter-open-for-reuse","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"Candidate","code":"","desc":"The service has the potential to be reused.","color":"","testID":"filter-candidate","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":4,"documentationCategories":0,"name":"None","code":"","desc":"The service is registered in the Marketplace but its potential reusability has not been evaluated.","color":"","testID":"filter-none","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false}],"order":2,"showAsFilter":true},{"id":5,"group":"Service Maturity","slug":"service_maturity","testID":"group-service-maturity","items":[{"id":1,"documentationCategories":0,"name":"Idea","code":"","desc":"","color":"#bdb76b","testID":"filter-idea","acceptancePercentage":35,"iconFileName":"Idea_Poc_Icon.svg","order":1,"adminOnly":false,"slug":"","default":false},{"id":8,"documentationCategories":0,"name":"Development Started","code":"","desc":"","color":"#c5789e","testID":"filter-development-started","acceptancePercentage":52,"iconFileName":"Development_Started_Icon.svg","order":2,"adminOnly":false,"slug":"","default":false},{"id":5,"documentationCategories":0,"name":"Ready for Integration","code":"","desc":"","color":"#62BBC1","testID":"filter-ready-for-integration","acceptancePercentage":74,"iconFileName":"Ready_For_Integration_Icon.svg","order":3,"adminOnly":false,"slug":"","default":false},{"id":6,"documentationCategories":0,"name":"Ready for Non-Commercial Use","code":"","desc":"","color":"#92a8d1","testID":"filter-ready-for-non-commercial-use","acceptancePercentage":86,"iconFileName":"Ready_For_Non_Commercial_Use_Icon.svg","order":4,"adminOnly":false,"slug":"","default":false},{"id":7,"documentationCategories":0,"name":"Ready for Commercial Use","code":"","desc":"","color":"#1a4582","testID":"filter-ready-for-commercial-use","acceptancePercentage":100,"iconFileName":"Ready_For_Commercial_Use_Icon.svg","order":5,"adminOnly":false,"slug":"","default":false}],"order":3,"showAsFilter":true},{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"documentationCategories":0,"name":"Common Asset","code":"","desc":"","color":"","testID":"filter-common-asset","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":true,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"OSS","code":"","desc":"","color":"","testID":"filter-oss","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"BSS","code":"","desc":"","color":"","testID":"filter-bss","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":6,"documentationCategories":0,"name":"Packet Core","code":"","desc":"","color":"","testID":"filter-packet-core","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false},{"id":4,"documentationCategories":0,"name":"COS","code":"","desc":"","color":"","testID":"filter-cos","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"","default":false},{"id":8,"documentationCategories":0,"name":"Cloud","code":"","desc":"","color":"","testID":"filter-cloud","acceptancePercentage":0,"iconFileName":"","order":6,"adminOnly":false,"slug":"","default":false},{"id":5,"documentationCategories":0,"name":"DNEW","code":"","desc":"","color":"","testID":"filter-dnew","acceptancePercentage":0,"iconFileName":"","order":7,"adminOnly":false,"slug":"","default":false},{"id":7,"documentationCategories":0,"name":"Other","code":"","desc":"","color":"","testID":"filter-other","acceptancePercentage":0,"iconFileName":"","order":8,"adminOnly":false,"slug":"","default":false}],"order":4,"showAsFilter":true},{"id":4,"group":"Service Area","slug":"serviceArea","testID":"group-service-area","items":[{"id":1,"documentationCategories":0,"name":"Data","code":"","desc":"Services that focus on providing capabilities for storing and maintaining data.","color":"","testID":"filter-data","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"Messaging","code":"","desc":"Services that focus on transferring or translating messages across services.","color":"","testID":"filter-messaging","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"Networking","code":"","desc":"Services that describe the networking environment and focus on the communications among services and outside world.","color":"","testID":"filter-networking","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":4,"documentationCategories":0,"name":"Management","code":"","desc":"Services that focus on providing means to control and configure behaviour of the application.","color":"","testID":"filter-management","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false},{"id":5,"documentationCategories":0,"name":"Monitoring","code":"","desc":"Services that provides various types of data that provide insight, at various levels, as to what is going on inside the system.","color":"","testID":"filter-monitoring","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"","default":false},{"id":6,"documentationCategories":0,"name":"Security","code":"","desc":"Services that focus on providing capabilities to handle the security side concerns of application.","color":"","testID":"filter-security","acceptancePercentage":0,"iconFileName":"","order":6,"adminOnly":false,"slug":"","default":false},{"id":7,"documentationCategories":0,"name":"Other","code":"","desc":"","color":"","testID":"filter-other","acceptancePercentage":0,"iconFileName":"","order":7,"adminOnly":false,"slug":"","default":false}],"order":5,"showAsFilter":true},{"id":6,"group":"Restricted","slug":"restricted","testID":"group-restricted","items":[{"id":1,"documentationCategories":0,"name":"Other","code":"1","desc":"","color":"","testID":"filter-other","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"Temporary Delivery Restriction","code":"RE0","desc":"","color":"","testID":"filter-temporary-delivery-restriction","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"Warning, Phase-out Process is starting","code":"RE1","desc":"","color":"","testID":"filter-warning-phase-out-process-is-starting","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false},{"id":7,"documentationCategories":0,"name":"End of Support","code":"RE5","desc":"","color":"","testID":"filter-end-of-support","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"","default":false}],"order":6,"showAsFilter":false},{"id":7,"group":"Documentation Categories","slug":"documentation-categories","testID":"group-documentation-categories","items":[{"id":1,"documentationCategories":0,"name":"General","code":"","desc":"","color":"","testID":"filter-general","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"Developer","code":"","desc":"","color":"","testID":"filter-developer","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false}],"order":7,"showAsFilter":false},{"id":8,"group":"Documentation Titles","slug":"documentation-titles","testID":"group-documentation-titles","items":[{"id":1,"documentationCategories":1,"name":"Service Overview","code":"","desc":"","color":"","testID":"filter-service-overview","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":1,"name":"Service Deployment Guide","code":"","desc":"","color":"","testID":"filter-service-deployment-guide","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":1,"name":"Troubleshooting Guide","code":"","desc":"","color":"","testID":"filter-troubleshooting-guide","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false},{"id":4,"documentationCategories":1,"name":"Functional Area Description","code":"","desc":"","color":"","testID":"filter-functional-area-description","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"","default":false},{"id":5,"documentationCategories":1,"name":"Component Description","code":"","desc":"","color":"","testID":"filter-component-description","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"","default":false},{"id":6,"documentationCategories":1,"name":"Released Documentation","code":"","desc":"","color":"","testID":"filter-released-documentation","acceptancePercentage":0,"iconFileName":"","order":6,"adminOnly":false,"slug":"","default":false},{"id":7,"documentationCategories":2,"name":"Application Developers Guide","code":"","desc":"","color":"","testID":"filter-application-developers-guide","acceptancePercentage":0,"iconFileName":"","order":7,"adminOnly":false,"slug":"","default":false},{"id":8,"documentationCategories":2,"name":"API Information","code":"","desc":"","color":"","testID":"filter-api-information","acceptancePercentage":0,"iconFileName":"","order":8,"adminOnly":false,"slug":"","default":false},{"id":9,"documentationCategories":2,"name":"Inner Source Readme","code":"","desc":"","color":"","testID":"filter-inner-source-readme","acceptancePercentage":0,"iconFileName":"","order":9,"adminOnly":false,"slug":"","default":false},{"id":10,"documentationCategories":2,"name":"Inner Source Contribute","code":"","desc":"","color":"","testID":"filter-inner-source-contribute","acceptancePercentage":0,"iconFileName":"","order":10,"adminOnly":false,"slug":"","default":false},{"id":11,"documentationCategories":0,"name":"Other Documents","code":"","desc":"","color":"","testID":"filter-other-documents","acceptancePercentage":0,"iconFileName":"","order":99,"adminOnly":false,"slug":"","default":false}],"order":8,"showAsFilter":false},{"id":9,"group":"Team Roles","slug":"team_role","testID":"group-team-role","items":[{"id":1,"documentationCategories":0,"name":"PO","code":"","desc":"","color":"","testID":"filter-po","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"","default":false},{"id":2,"documentationCategories":0,"name":"SPM","code":"","desc":"","color":"","testID":"filter-spm","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"","default":false},{"id":3,"documentationCategories":0,"name":"Other","code":"","desc":"","color":"","testID":"filter-other","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"","default":false}],"order":9,"showAsFilter":false},{"id":10,"group":"Documentation Categories Auto","slug":"documentation-categories-auto","testID":"group-documentation-categories-auto","items":[{"id":1,"documentationCategories":0,"name":"DPI","code":"","desc":"","color":"","testID":"filter-dpi","acceptancePercentage":0,"iconFileName":"","order":0,"adminOnly":false,"slug":"dpi","default":false},{"id":2,"documentationCategories":0,"name":"Inner Source","code":"","desc":"","color":"","testID":"filter-inner-source","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"inner-source","default":false},{"id":3,"documentationCategories":0,"name":"Release Documents","code":"","desc":"","color":"","testID":"filter-release-documents","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"release-documents","default":false},{"id":4,"documentationCategories":0,"name":"Additional Documents","code":"","desc":"","color":"","testID":"filter-additional-documents","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"additional-documents","default":true}],"order":10,"showAsFilter":false},{"id":11,"group":"Documentation Titles Auto","slug":"documentation-titles-auto","testID":"group-documentation-titles-auto","items":[{"id":1,"documentationCategories":1,"name":"Service Overview","code":"","desc":"","color":"","testID":"filter-service-overview","acceptancePercentage":0,"iconFileName":"","order":0,"adminOnly":false,"slug":"service-overview","default":false},{"id":1,"documentationCategories":2,"name":"Inner Source README","code":"","desc":"","color":"","testID":"filter-inner-source-readme","acceptancePercentage":0,"iconFileName":"","order":0,"adminOnly":false,"slug":"inner-source-readme","default":false},{"id":1,"documentationCategories":3,"name":"Product Revision Information (PRI)","code":"","desc":"","color":"","testID":"filter-product-revision-information-pri","acceptancePercentage":0,"iconFileName":"","order":0,"adminOnly":false,"slug":"product-revision-information-pri","default":false},{"id":2,"documentationCategories":1,"name":"Service Deployment Guide","code":"","desc":"","color":"","testID":"filter-service-deployment-guide","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"service-deployment-guide","default":false},{"id":2,"documentationCategories":2,"name":"Contributing Guideline","code":"","desc":"","color":"","testID":"filter-contributing-guideline","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"contributing-guideline","default":false},{"id":2,"documentationCategories":3,"name":"Test Report","code":"","desc":"","color":"","testID":"filter-test-report","acceptancePercentage":0,"iconFileName":"","order":1,"adminOnly":false,"slug":"test-report","default":false},{"id":3,"documentationCategories":1,"name":"Service Troubleshooting Guide","code":"","desc":"","color":"","testID":"filter-service-troubleshooting-guide","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"service-troubleshooting-guide","default":false},{"id":3,"documentationCategories":3,"name":"Test Specification","code":"","desc":"","color":"","testID":"filter-test-specification","acceptancePercentage":0,"iconFileName":"","order":2,"adminOnly":false,"slug":"test-specification","default":false},{"id":4,"documentationCategories":1,"name":"Application Developers Guide","code":"","desc":"","color":"","testID":"filter-application-developers-guide","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"application-developers-guide","default":false},{"id":4,"documentationCategories":3,"name":"Risk Assessment & Privacy Impact Assessment","code":"","desc":"","color":"","testID":"filter-risk-assessment-privacy-impact-assessment","acceptancePercentage":0,"iconFileName":"","order":3,"adminOnly":false,"slug":"risk-assessment-privacy-impact-assessment","default":false},{"id":5,"documentationCategories":1,"name":"API Documentation","code":"","desc":"","color":"","testID":"filter-api-documentation","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"api-documentation","default":false},{"id":5,"documentationCategories":3,"name":"Vulnerability Analysis Report","code":"","desc":"","color":"","testID":"filter-vulnerability-analysis-report","acceptancePercentage":0,"iconFileName":"","order":4,"adminOnly":false,"slug":"vulnerability-analysis-report","default":false},{"id":6,"documentationCategories":1,"name":"Service User Guide","code":"","desc":"","color":"","testID":"filter-service-user-guide","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"service-user-guide","default":false},{"id":6,"documentationCategories":3,"name":"Sofware Vendor List (SVL)","code":"","desc":"","color":"","testID":"filter-sofware-vendor-list-svl","acceptancePercentage":0,"iconFileName":"","order":5,"adminOnly":false,"slug":"sofware-vendor-list-svl","default":false},{"id":7,"documentationCategories":3,"name":"Export Control Report","code":"","desc":"","color":"","testID":"filter-export-control-report","acceptancePercentage":0,"iconFileName":"","order":6,"adminOnly":false,"slug":"export-control-report","default":false}],"order":11,"showAsFilter":false}]';

    global.adp.listOptions = {};
    global.adp.listOptions.get = () => new Promise((RESOLVE, REJECT) => {
      if (global.adp.mockListOptionsError === true) {
        const mockError = 'MockError on ListOptions';
        REJECT(mockError);
      } else {
        RESOLVE(mockListOptions);
      }
    });
    global.adp.clone = J => JSON.parse(JSON.stringify(J));
    global.adp.slugIt = require('./../library/slugIt'); // eslint-disable-line global-require
    global.adp.microservice = {};
    global.adp.microservice.menuBasicStructure = require('./../microservice/menuBasicStructure'); // eslint-disable-line global-require
    global.adp.migration = {};
    global.adp.migration.documentationMenuStructure = require('./documentationMenuStructure'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should convert the old structure documentation menu to the new structure.', (done) => {
    const obj = {
      name: 'mockValidTest',
      documentation: [
        {
          type: 1,
          name: '',
          url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Features',
          categoryId: 1,
          titleId: 11,
          title: 'Features',
          default: false,
          titlePosition: 99,
          slug: 'general/features',
        },
        {
          type: 1,
          name: '',
          url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/pages/viewpage.action?pageId=291276105',
          categoryId: 1,
          titleId: 5,
          title: '',
          default: false,
          titlePosition: 4,
          slug: 'general/component-description',
        },
      ],
    };
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT.documentation).toBeUndefined();
        expect(RESULT.menu).toBeDefined();
        expect(RESULT.menu.manual).toBeDefined();
        expect(RESULT.menu.manual.development).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should convert the old structure documentation menu to the new structure, dealing with default documents.', (done) => {
    const obj = {
      name: 'mockValidTest',
      documentation: [
        {
          type: 1,
          name: '',
          url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Features',
          categoryId: 1,
          titleId: 11,
          title: 'Features',
          default: true,
          titlePosition: 99,
          slug: 'general/features',
        },
        {
          type: 1,
          name: '',
          url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/pages/viewpage.action?pageId=291276105',
          categoryId: 1,
          titleId: 5,
          title: '',
          default: true,
          titlePosition: 4,
          slug: 'general/component-description',
        },
      ],
    };
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT.documentation).toBeUndefined();
        expect(RESULT.menu).toBeDefined();
        expect(RESULT.menu.manual).toBeDefined();
        expect(RESULT.menu.manual.development).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should convert the old structure documentation menu to the new structure, just one document.', (done) => {
    const obj = {
      name: 'mockValidTest',
      documentation: [
        {
          type: 1,
          name: '',
          url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Features',
          categoryId: 1,
          titleId: 11,
          title: 'Features',
          default: false,
          titlePosition: 99,
          slug: 'general/features',
        },
      ],
    };
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT.documentation).toBeUndefined();
        expect(RESULT.menu).toBeDefined();
        expect(RESULT.menu.manual).toBeDefined();
        expect(RESULT.menu.manual.development).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should do nothing ( return true ), because there is no documents.', (done) => {
    const obj = {
      name: 'mockValidTest',
      menu_auto: false,
      repo_urls: { development: '', release: '' },
      menu: {
        auto: { development: [], release: [], date_modified: '' },
        manual: { development: [], release: [], date_modified: '' },
      },
    };
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should fix the repo_urls, if development and/or release are not there.', (done) => {
    const obj = {
      name: 'mockValidTest',
      menu_auto: false,
      repo_urls: {},
      menu: {
        auto: { development: [], release: [], date_modified: '' },
        manual: { development: [], release: [], date_modified: '' },
      },
    };
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If listOptions is not available.', (done) => {
    const obj = {
      name: 'mockValidTest',
      documentation: [],
      menu_auto: false,
      repo_urls: {},
      menu: {
        auto: { development: [], release: [], date_modified: '' },
        manual: { development: [], release: [], date_modified: '' },
      },
    };
    global.adp.mockListOptionsError = true;
    global.adp.migration.documentationMenuStructure(obj)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
