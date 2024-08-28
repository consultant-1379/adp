// ============================================================================================= //
/**
* Unit test for [ global.adp.dynamicSortListOptions ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.dynamicSortListOptions ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dynamicSortListOptions = require('./dynamicSortListOptions'); // eslint-disable-line global-require
    global.adp.listOptions = {};
    global.adp.listOptions.mockCache = '[{"id":1,"group":"Reusability Level","slug":"reusability_level","testID":"group-reusability-level","items":[{"id":1,"name":"Reused","desc":"The service is reused by two or more applications.","testID":"filter-reused","order":1},{"id":2,"name":"Open for Reuse","desc":"The service is now ready to be reused by different applications.","testID":"filter-open-for-reuse","order":2},{"id":3,"name":"Candidate","desc":"The service has the potential to be reused.","testID":"filter-candidate","order":3},{"id":4,"name":"None","desc":"The service is registered in the Marketplace but its potential reusability has not been evaluated.","testID":"filter-none","order":4}],"order":1,"showAsFilter":true},{"id":2,"group":"Service Category","slug":"service_category","testID":"group-service-category","items":[{"id":1,"name":"ADP Generic Services","desc":"Microservices providing functions that are considered common to many applications. They are centrally developed and maintained by the ADP Program.","testID":"filter-adp-generic-services","order":1},{"id":2,"name":"ADP Reusable Services","desc":"Microservices providing complementary functions that different applications could benefit from. They are NOT directly developed and maintained by the ADP Program.","testID":"filter-adp-reusable-services","order":2},{"id":3,"name":"ADP Domain Specific Services","desc":"Microservices providing functions that are considered common in a specific application domain. They can be used by multiple applications within the same domain.","testID":"filter-adp-domain-specific-services","order":3},{"id":4,"name":"ADP Application Specific Services","desc":"Microservices providing functions that are currently used by one single application and commonality is not confirmed yet.","testID":"filter-adp-application-specific-services","order":4},{"id":5,"name":"Non-ADP Services","desc":"Microservices which provide common functions but do NOT adhere to ADP architecture and framework.","testID":"filter-other-ericsson-services","order":5}],"order":2,"showAsFilter":true},{"id":3,"group":"Domain","slug":"domain","testID":"group-domain","items":[{"id":1,"name":"Common Asset","testID":"filter-common-asset","order":1,"adminOnly":true},{"id":2,"name":"OSS","testID":"filter-oss","order":2},{"id":3,"name":"BSS","testID":"filter-bss","order":3},{"id":6,"name":"Packet Core","testID":"filter-packet-core","order":4},{"id":4,"name":"COS","testID":"filter-cos","order":5},{"id":8,"name":"Cloud","testID":"filter-cloud","order":6},{"id":5,"name":"DNEW","testID":"filter-dnew","order":7},{"id":7,"name":"Other","testID":"filter-other","order":8}],"order":3,"showAsFilter":true},{"id":4,"group":"Service Area","slug":"serviceArea","testID":"group-service-area","items":[{"id":1,"name":"Data","testID":"filter-data","order":1},{"id":2,"name":"Messaging","testID":"filter-messaging","order":2},{"id":3,"name":"Networking","testID":"filter-networking","order":3},{"id":4,"name":"Management","testID":"filter-management","order":4},{"id":5,"name":"Monitoring","testID":"filter-monitoring","order":5},{"id":6,"name":"Security","testID":"filter-security","order":6},{"id":7,"name":"Other","testID":"filter-other","order":7}],"order":4,"showAsFilter":true},{"id":5,"group":"Service Maturity","slug":"service_maturity","testID":"group-service-maturity","items":[{"id":1,"name":"Idea","color":"#e7eb90","testID":"filter-idea","acceptancePercentage":25,"iconFileName":"Icon_Idea.svg","order":1},{"id":4,"name":"Proof of Concept","color":"#c5789e","testID":"filter-proof-of-concept","acceptancePercentage":40,"iconFileName":"Proof_of_Concept_Icon.png","order":2},{"id":2,"name":"In Development","color":"#62bbc1","testID":"filter-in-development","acceptancePercentage":50,"iconFileName":"Icon_In_development.svg","order":3},{"id":3,"name":"PRA","color":"#004385","testID":"filter-pra","acceptancePercentage":100,"iconFileName":"Icon_PRA_PRA_DevOps.svg","order":4}],"order":5,"showAsFilter":true},{"id":6,"group":"Restricted","slug":"restricted","testID":"group-restricted","items":[{"id":0,"name":"Unrestricted","code":"0","testID":"filter-unrestricted","order":1},{"id":1,"name":"Other","code":"1","testID":"filter-other","order":2},{"id":2,"name":"Temporary Delivery Restriction","code":"RE0","testID":"filter-temporary-delivery-restriction","order":3},{"id":3,"name":"Warning, Phase-out Process is starting","code":"RE1","testID":"filter-warning-phase-out-process-is-starting","order":4},{"id":7,"name":"End of Support","code":"RE5","testID":"filter-end-of-support","order":5}],"order":6,"showAsFilter":false},{"id":7,"group":"Documentation Categories","slug":"documentation-categories","testID":"group-documentation-categories","items":[{"id":1,"name":"General","testID":"filter-general","order":1},{"id":2,"name":"Developer","testID":"filter-developer","order":2}],"order":7,"showAsFilter":false},{"id":8,"group":"Documentation Titles","slug":"documentation-titles","testID":"group-documentation-titles","items":[{"id":1,"documentationCategories":1,"name":"Service Overview","testID":"filter-service-overview","order":1},{"id":2,"documentationCategories":1,"name":"Service Deployment Guide","testID":"filter-service-deployment-guide","order":2},{"id":3,"documentationCategories":1,"name":"Troubleshooting Guide","testID":"filter-troubleshooting-guide","order":3},{"id":4,"documentationCategories":1,"name":"Functional Area Description","testID":"filter-functional-area-description","order":4},{"id":5,"documentationCategories":1,"name":"Component Description","testID":"filter-component-description","order":5},{"id":6,"documentationCategories":1,"name":"Released Documentation","testID":"filter-released-documentation","order":6},{"id":7,"documentationCategories":2,"name":"Application Developers Guide","testID":"filter-application-developers-guide","order":7},{"id":8,"documentationCategories":2,"name":"API Information","testID":"filter-api-information","order":8},{"id":9,"documentationCategories":2,"name":"Inner Source Readme","testID":"filter-inner-source-readme","order":9},{"id":10,"documentationCategories":2,"name":"Inner Source Contribute","testID":"filter-inner-source-contribute","order":10},{"id":11,"documentationCategories":0,"name":"Other Documents","testID":"filter-other-documents","order":99}],"order":8,"showAsFilter":false},{"id":9,"group":"Team Roles","slug":"team_role","testID":"group-team-role","items":[{"id":1,"name":"PO","testID":"filter-po","order":1},{"id":2,"name":"SPM","testID":"filter-spm","order":2},{"id":3,"name":"Other","testID":"filter-other","order":3}],"order":9,"showAsFilter":false}]';
  });

  afterEach(() => {
    global.adp = null;
  });

  // =========================================================================================== //
  it('Sorting an Array, by "status" from listOption (ORDER) and then, by name (ASC).', () => {
    const testArray = [
      { name: 'EName', status: 3 },
      { name: 'FName', status: 2 },
      { name: 'HName', status: 4 },
      { name: 'BName', status: 1 },
      { name: 'DName', status: 3 },
      { name: 'CName', status: 2 },
      { name: 'AName', status: 1 },
      { name: 'GName', status: 4 },
    ];
    const expectedResult = [
      { name: 'AName', status: 1 },
      { name: 'BName', status: 1 },
      { name: 'GName', status: 4 },
      { name: 'HName', status: 4 },
      { name: 'CName', status: 2 },
      { name: 'FName', status: 2 },
      { name: 'DName', status: 3 },
      { name: 'EName', status: 3 },
    ];
    const parsedListOptions = JSON.parse(global.adp.listOptions.mockCache);
    const resultArray = testArray.sort(global.adp.dynamicSortListOptions(['status', 'name'], parsedListOptions));

    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
  it('Sorting an Array, by "status" from listOption (ORDER DESC) and then, by name (DESC).', () => {
    const testArray = [
      { name: 'EName', status: 3 },
      { name: 'FName', status: 2 },
      { name: 'HName', status: 4 },
      { name: 'BName', status: 1 },
      { name: 'DName', status: 3 },
      { name: 'CName', status: 2 },
      { name: 'AName', status: 1 },
      { name: 'GName', status: 4 },
    ];
    const expectedResult = [
      { name: 'EName', status: 3 },
      { name: 'DName', status: 3 },
      { name: 'FName', status: 2 },
      { name: 'CName', status: 2 },
      { name: 'HName', status: 4 },
      { name: 'GName', status: 4 },
      { name: 'BName', status: 1 },
      { name: 'AName', status: 1 },
    ];
    const parsedListOptions = JSON.parse(global.adp.listOptions.mockCache);
    const resultArray = testArray.sort(global.adp.dynamicSortListOptions(['-status', '-name'], parsedListOptions));

    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
  it('Sorting an Array, by "status" from listOption (ORDER) and then, by name (DESC).', () => {
    const testArray = [
      { name: 'EName', status: 3 },
      { name: 'FName', status: 2 },
      { name: 'HName', status: 4 },
      { name: 'BName', status: 1 },
      { name: 'DName', status: 3 },
      { name: 'CName', status: 2 },
      { name: 'AName', status: 1 },
      { name: 'GName', status: 4 },
    ];
    const expectedResult = [
      { name: 'BName', status: 1 },
      { name: 'AName', status: 1 },
      { name: 'HName', status: 4 },
      { name: 'GName', status: 4 },
      { name: 'FName', status: 2 },
      { name: 'CName', status: 2 },
      { name: 'EName', status: 3 },
      { name: 'DName', status: 3 },
    ];
    const parsedListOptions = JSON.parse(global.adp.listOptions.mockCache);
    const resultArray = testArray.sort(global.adp.dynamicSortListOptions(['status', '-name'], parsedListOptions));

    const isEqual = (resultArray.toString() === expectedResult.toString());

    expect(isEqual).toBeTruthy();
  });
  // =========================================================================================== //
});
// ============================================================================================= //
