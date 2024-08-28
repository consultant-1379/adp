// ============================================================================================= //
module.exports = () => {
// --------------------------------------------------------------------------------------------- //
  const listOptions = [
    {
      _id: '49bfab89e2ab4b291d84b4dd7c030913',
      'select-id': 1,
      type: 'item',
      name: 'ADP Generic Services',
      desc: 'Microservices providing functions that are considered common to many applications. They are centrally developed and maintained by the ADP Program.',
      'group-id': 2,
      'test-id': 'filter-adp-generic-services',
      order: 1,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c031078',
      'select-id': 2,
      type: 'item',
      name: 'ADP Reusable Services',
      desc: 'Microservices providing complementary functions that different applications could benefit from. They are NOT directly developed and maintained by the ADP Program.',
      'group-id': 2,
      'test-id': 'filter-adp-reusable-services',
      order: 2,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03256c',
      'select-id': 3,
      type: 'item',
      name: 'ADP Domain Specific Services',
      desc: 'Microservices providing functions that are considered common in a specific application domain. They can be used by multiple applications within the same domain.',
      'group-id': 2,
      'test-id': 'filter-adp-domain-specific-services',
      order: 3,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c033a0f',
      'select-id': 4,
      type: 'item',
      name: 'ADP Application Specific Services',
      desc: 'Microservices providing functions that are currently used by one single application and commonality is not confirmed yet.',
      'group-id': 2,
      'test-id': 'filter-adp-application-specific-services',
      order: 4,
    },
    {
      _id: '313e315448e259caa9e8d0c31f01ba54',
      'select-id': 5,
      type: 'item',
      name: 'Non-ADP Services',
      desc: 'Microservices which provide common functions but do NOT adhere to ADP architecture and framework.',
      'group-id': 2,
      'test-id': 'filter-other-ericsson-services',
      order: 5,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c034f00',
      'select-id': 1,
      type: 'item',
      name: 'Reused',
      desc: 'The service is reused by two or more applications.',
      'group-id': 1,
      'test-id': 'filter-reused',
      order: 1,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c035097',
      'select-id': 2,
      type: 'item',
      name: 'Open for Reuse',
      desc: 'The service is now ready to be reused by different applications.',
      'group-id': 1,
      'test-id': 'filter-open-for-reuse',
      order: 2,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c035560',
      'select-id': 3,
      type: 'item',
      name: 'Candidate',
      desc: 'The service has the potential to be reused.',
      'group-id': 1,
      'test-id': 'filter-candidate',
      order: 3,
    },
    {
      _id: '313e315448e259caa9e8d0c31f01a9ee',
      'select-id': 4,
      type: 'item',
      name: 'None',
      desc: 'The service is registered in the Marketplace but its potential reusability has not been evaluated.',
      'group-id': 1,
      'test-id': 'filter-none',
      order: 4,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c035bae',
      'select-id': 1,
      type: 'item',
      name: 'Common Asset',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-common-asset',
      order: 1,
      adminOnly: true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c036f92',
      'select-id': 2,
      type: 'item',
      name: 'OSS',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-oss',
      order: 2,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0387a4',
      'select-id': 3,
      type: 'item',
      name: 'BSS',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-bss',
      order: 3,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0392d3',
      'select-id': 4,
      type: 'item',
      name: 'COS',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-cos',
      order: 6,
    },
    {
      _id: '5311e1d73b22faed7a5c332290002c4e',
      'select-id': 8,
      type: 'item',
      name: 'Cloud',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-cloud',
      order: 7,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03a6bc',
      'select-id': 5,
      type: 'item',
      name: 'DNEW',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-dnew',
      order: 8,
    },
    {
      _id: '7bb888d90b8921a112ca579a06263448',
      'select-id': 6,
      type: 'item',
      name: 'Packet Core - UDM',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-packet-core-udm',
      order: 4,
    },
    {
      _id: '605477bd0f69900008dd95b3',
      'select-id': 10,
      type: 'item',
      name: 'Packet Core - PC',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-packet-core-pc',
      order: 5,
    },
    {
      _id: '507f1f77bcf86cd799439011',
      'select-id': 11,
      type: 'item',
      name: 'AI/ML',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-ai/ml',
      order: 10,
    },
    {
      _id: '68dbd21f25f19cf7607278d67000170d',
      'select-id': 9,
      type: 'item',
      name: 'MSRA',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-msra',
      order: 9,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03b176',
      'select-id': 7,
      type: 'item',
      name: 'Other',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-other',
      order: 99,
    },
    {
      _id: '6346b7543ba07e00077cebasd43cb',
      'select-id': 12,
      type: 'item',
      name: 'SAN Tools',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-san-tools',
      order: 11,
    },
    {
      _id: '6346b7543ba0asd12e00077cebasd43cb',
      'select-id': 13,
      type: 'item',
      name: 'SDU',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-sdu',
      order: 12,
    },
    {
      _id: '6346b7543ba07e00077cebcb',
      'select-id': 14,
      type: 'item',
      name: 'Licensing',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-licensing',
      order: 13,
    },
    {
      _id: 'b89e2ab4b291d84b4dd7c03b198',
      'select-id': 15,
      type: 'item',
      name: 'CNS - CSW',
      desc: '',
      'group-id': 3,
      'test-id': 'filter-cns-csw',
      order: 14,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03c18a',
      'select-id': 1,
      type: 'item',
      name: 'Data',
      desc: 'Services that focus on providing capabilities for storing and maintaining data.',
      'group-id': 4,
      'test-id': 'filter-data',
      order: 1,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03d31c',
      'select-id': 2,
      type: 'item',
      name: 'Messaging',
      desc: 'Services that focus on transferring or translating messages across services.',
      'group-id': 4,
      'test-id': 'filter-messaging',
      order: 2,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03e751',
      'select-id': 3,
      type: 'item',
      name: 'Networking',
      desc: 'Services that describe the networking environment and focus on the communications among services and outside world.',
      'group-id': 4,
      'test-id': 'filter-networking',
      order: 3,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c03f6c8',
      'select-id': 4,
      type: 'item',
      name: 'Management',
      desc: 'Services that focus on providing means to control and configure behaviour of the application.',
      'group-id': 4,
      'test-id': 'filter-management',
      order: 4,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c040a1f',
      'select-id': 5,
      type: 'item',
      name: 'Monitoring',
      desc: 'Services that provides various types of data that provide insight, at various levels, as to what is going on inside the system.',
      'group-id': 4,
      'test-id': 'filter-monitoring',
      order: 5,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0419aa',
      'select-id': 6,
      type: 'item',
      name: 'Security',
      desc: 'Services that focus on providing capabilities to handle the security side concerns of application.',
      'group-id': 4,
      'test-id': 'filter-security',
      order: 6,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c042bc3',
      'select-id': 8,
      type: 'item',
      name: 'Other',
      desc: '',
      'group-id': 4,
      'test-id': 'filter-other',
      order: 8,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0433cd',
      'select-id': 1,
      type: 'item',
      name: 'Idea',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-idea',
      order: 1,
      color: '#bdb76b',
      acceptancePercentage: 35,
      iconFileName: 'Idea_Poc_Icon.svg',
    },
    {
      _id: 'd9c27cea92fde3da5b4e558769051172',
      'select-id': 8,
      type: 'item',
      name: 'Development Started',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-development-started',
      order: 2,
      color: '#c5789e',
      acceptancePercentage: 52,
      iconFileName: 'Development_Started_Icon.svg',
    },
    {
      _id: 'd9c27cea92fde3da5b4e558769034ce2',
      'select-id': 5,
      type: 'item',
      name: 'Ready for Integration',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-ready-for-integration',
      order: 3,
      color: '#62BBC1',
      acceptancePercentage: 74,
      iconFileName: 'Ready_For_Integration_Icon.svg',
    },
    {
      _id: 'd9c27cea92fde3da5b4e5587690318bc',
      'select-id': 6,
      type: 'item',
      name: 'Ready for Non-Commercial Use',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-ready-for-non-commercial-use',
      order: 4,
      color: '#92a8d1',
      acceptancePercentage: 86,
      iconFileName: 'Ready_For_Non_Commercial_Use_Icon.svg',
    },
    {
      _id: 'd9c27cea92fde3da5b4e55876902f571',
      'select-id': 7,
      type: 'item',
      name: 'Ready for Commercial Use',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-ready-for-commercial-use',
      order: 5,
      color: '#1a4582',
      acceptancePercentage: 100,
      iconFileName: 'Ready_For_Commercial_Use_Icon.png',
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0455e7',
      'select-id': 3,
      type: 'item',
      name: 'PRA',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-pra',
      order: 6,
      color: '#004385',
      acceptancePercentage: 100,
      iconFileName: 'Icon_PRA_PRA_DevOps.svg',
      deleted: true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c045de6',
      'select-id': 4,
      type: 'item',
      name: 'Proof of Concept',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-proof-of-concept',
      order: 7,
      color: '#c5789e',
      acceptancePercentage: 40,
      iconFileName: 'Proof_of_Concept_Icon.png',
      deleted: true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c0449da',
      'select-id': 2,
      type: 'item',
      name: 'In Development',
      desc: '',
      'group-id': 5,
      'test-id': 'filter-in-development',
      order: 8,
      color: '#62bbc1',
      acceptancePercentage: 50,
      iconFileName: 'Icon_In_development.svg',
      deleted: true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c058f1f',
      'group-id': 2,
      group: 'Service Category',
      slug: 'service_category',
      type: 'group',
      'test-id': 'group-service-category',
      order: 1,
      'show-as-filter': true,
    },
    {
      _id: '63c98f1a17fe8200060c5471',
      'group-id': 13,
      type: 'group',
      group: 'Assembly Category',
      slug: 'assembly_category',
      config: [
        {
          assetType: 'assembly',
          order: 13,
        },
      ],
      'test-id': 'group-assembly-category',
      order: 0,
      'show-as-filter': true,
    },
    {
      _id: '63c9909c17fe8200060c5475',
      'select-id': 1,
      type: 'item',
      name: 'Common Assembly',
      desc: 'Assemblies providing common functions to many applications. They are centrally developed and maintained by the ADP Program.',
      'group-id': 13,
      'test-id': 'category-common-assembly',
      order: 1,
    },
    {
      _id: '63c9911517fe8200060c5477',
      'select-id': 2,
      type: 'item',
      name: 'Domain Specific Assembly',
      desc: 'Assemblies providing functions that are considered common in a specific application domain. They can be used by multiple applications within the same domain.',
      'group-id': 13,
      'test-id': 'category-domain specific-assembly',
      order: 2,
    },
    {
      _id: '63c9916217fe8200060c5479',
      'select-id': 3,
      type: 'item',
      name: 'Application Specific Assembly',
      desc: 'Assemblies providing functions that are designed for one specific application and the commonality is not confirmed yet.',
      'group-id': 13,
      'test-id': 'category-application-specific-assembly',
      order: 3,
    },
    {
      _id: '63c98fc217fe8200060c5473',
      'group-id': 14,
      group: 'Assembly Maturity',
      slug: 'assembly_maturity',
      type: 'group',
      'test-id': 'group-assembly-maturity',
      order: 0,
      'show-as-filter': true,
      config: [
        {
          assetType: 'assembly',
          order: 3,
        },
      ],
    },
    {
      _id: '63c991ba17fe8200060c547b',
      'select-id': 1,
      type: 'item',
      name: 'Development Started',
      desc: 'Code starts to exist in git repository.',
      'group-id': 14,
      'test-id': 'assembly-maturity-development-started',
      order: 1,
      color: '#c5789e',
      acceptancePercentage: 52,
      iconFileName: 'Development_Started_Icon.svg',
    },
    {
      _id: '63c9922517fe8200060c547d',
      'select-id': 2,
      type: 'item',
      name: 'Ready for Commercial Use',
      desc: 'Microservice is commercially ready, and can be delivered to an external customer for use in LIVE networks.',
      'group-id': 14,
      'test-id': 'assembly-maturity-ready-for-commercial-use',
      order: 2,
      color: '#1a4582',
      acceptancePercentage: 100,
      iconFileName: 'Ready_For_Commercial_Use_Icon.png',
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c059ff0',
      'group-id': 1,
      group: 'Reusability Level',
      slug: 'reusability_level',
      type: 'group',
      'test-id': 'group-reusability-level',
      order: 2,
      'show-as-filter': true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c05a61f',
      'group-id': 3,
      group: 'Domain',
      slug: 'domain',
      type: 'group',
      'test-id': 'group-domain',
      order: 4,
      config: [
        {
          assetType: 'microservice',
          order: 4,
        },
        {
          assetType: 'assembly',
          order: 3,
        },
      ],
      'show-as-filter': true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c05ba5e',
      'group-id': 4,
      group: 'Service Area',
      slug: 'serviceArea',
      type: 'group',
      'test-id': 'group-service-area',
      order: 5,
      'show-as-filter': true,
    },
    {
      _id: '49bfab89e2ab4b291d84b4dd7c05be30',
      'group-id': 5,
      group: 'Service Maturity',
      slug: 'service_maturity',
      type: 'group',
      'test-id': 'group-service-maturity',
      order: 3,
      'show-as-filter': true,
    },
    {
      _id: 'bdcc341505c4271452001a8a21001d05',
      'group-id': 6,
      group: 'Restricted',
      slug: 'restricted',
      type: 'group',
      'test-id': 'group-restricted',
      order: 6,
      'show-as-filter': false,
    },
    {
      _id: '23be888baa7539a68ba0b2229d02b414',
      'select-id': 0,
      type: 'item',
      code: '0',
      name: 'Unrestricted',
      desc: '',
      'group-id': 6,
      'test-id': 'filter-unrestricted',
      order: 1,
      showAsDropdown: false,
    },
    {
      _id: 'bdcc341505c4271452001a8a210062b1',
      'select-id': 1,
      type: 'item',
      code: '',
      name: 'Other',
      desc: '',
      'group-id': 6,
      'test-id': 'filter-other',
      order: 5,
      showAsDropdown: true,
    },
    {
      _id: 'bdcc341505c4271452001a8a2100adcd',
      'select-id': 2,
      type: 'item',
      code: 'RE0',
      name: 'Temporary Delivery Restriction',
      desc: '',
      'group-id': 6,
      'test-id': 'filter-temporary-delivery-restriction',
      order: 2,
      showAsDropdown: true,
    },
    {
      _id: 'bdcc341505c4271452001a8a2100c230',
      'select-id': 3,
      type: 'item',
      code: 'RE1',
      name: 'Warning, Phase-out Process is starting',
      desc: '',
      'group-id': 6,
      'test-id': 'filter-warning-phase-out-process-is-starting',
      order: 3,
      showAsDropdown: true,
    },
    {
      _id: 'bdcc341505c4271452001a8a2100d375',
      'select-id': 7,
      type: 'item',
      code: 'RE5',
      name: 'End of Support',
      desc: '',
      'group-id': 6,
      'test-id': 'filter-end-of-support',
      order: 4,
      showAsDropdown: true,
    },
    {
      _id: 'bdcc341505c4271452001a8a21017f4f',
      'group-id': 7,
      group: 'Documentation Categories',
      slug: 'documentation-categories',
      type: 'group',
      'test-id': 'group-documentation-categories',
      order: 7,
      'show-as-filter': false,
    },
    {
      _id: 'bdcc341505c4271452001a8a21019c8f',
      'select-id': 1,
      type: 'item',
      name: 'General',
      'group-id': 7,
      'test-id': 'filter-general',
      order: 1,
    },
    {
      _id: 'bdcc341505c4271452001a8a2101bf52',
      'select-id': 2,
      type: 'item',
      name: 'Developer',
      'group-id': 7,
      'test-id': 'filter-developer',
      order: 2,
    },
    {
      _id: 'bdcc341505c4271452001a8a2101d440',
      'group-id': 8,
      group: 'Documentation Titles',
      slug: 'documentation-titles',
      type: 'group',
      'test-id': 'group-documentation-titles',
      order: 8,
      'show-as-filter': false,
    },
    {
      _id: 'bdcc341505c4271452001a8a2101edd1',
      'select-id': 1,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service Overview',
      'group-id': 8,
      'test-id': 'filter-service-overview',
      order: 1,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102086d',
      'select-id': 2,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service Deployment Guide',
      'group-id': 8,
      'test-id': 'filter-service-deployment-guide',
      order: 2,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102201b',
      'select-id': 3,
      'documentation-categories': 1,
      type: 'item',
      name: 'Troubleshooting Guide',
      'group-id': 8,
      'test-id': 'filter-troubleshooting-guide',
      order: 3,
    },
    {
      _id: 'bdcc341505c4271452001a8a21023735',
      'select-id': 4,
      'documentation-categories': 1,
      type: 'item',
      name: 'Functional Area Description',
      'group-id': 8,
      'test-id': 'filter-functional-area-description',
      order: 4,
    },
    {
      _id: 'bdcc341505c4271452001a8a210250c3',
      'select-id': 5,
      'documentation-categories': 1,
      type: 'item',
      name: 'Component Description',
      'group-id': 8,
      'test-id': 'filter-component-description',
      order: 5,
    },
    {
      _id: 'bdcc341505c4271452001a8a21025c46',
      'select-id': 6,
      'documentation-categories': 1,
      type: 'item',
      name: 'Released Documentation',
      'group-id': 8,
      'test-id': 'filter-released-documentation',
      order: 6,
    },
    {
      _id: 'bdcc341505c4271452001a8a210276df',
      'select-id': 7,
      'documentation-categories': 2,
      type: 'item',
      name: 'Application Developers Guide',
      'group-id': 8,
      'test-id': 'filter-application-developers-guide',
      order: 7,
    },
    {
      _id: 'bdcc341505c4271452001a8a21028f13',
      'select-id': 8,
      'documentation-categories': 2,
      type: 'item',
      name: 'API Information',
      'group-id': 8,
      'test-id': 'filter-api-information',
      order: 8,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102a88b',
      'select-id': 9,
      'documentation-categories': 2,
      type: 'item',
      name: 'Inner Source Readme',
      'group-id': 8,
      'test-id': 'filter-inner-source-readme',
      order: 9,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102beb6',
      'select-id': 10,
      'documentation-categories': 2,
      type: 'item',
      name: 'Inner Source Contribute',
      'group-id': 8,
      'test-id': 'filter-inner-source-contribute',
      order: 10,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102cba4',
      'select-id': 11,
      'documentation-categories': 0,
      type: 'item',
      name: 'Other Documents',
      'group-id': 8,
      'test-id': 'filter-other-documents',
      order: 99,
    },
    {
      _id: 'bdcc341505c4271452001a8a2102fbbe',
      'group-id': 9,
      group: 'Team Roles',
      slug: 'team_role',
      type: 'group',
      'test-id': 'group-team-role',
      order: 9,
      'show-as-filter': false,
    },
    {
      _id: 'bdcc341505c4271452001a8a210305b7',
      'select-id': 1,
      type: 'item',
      name: 'PO',
      'group-id': 9,
      'test-id': 'filter-po',
      order: 1,
    },
    {
      _id: 'bdcc341505c4271452001a8a21031b4d',
      'select-id': 2,
      type: 'item',
      name: 'SPM',
      'group-id': 9,
      'test-id': 'filter-spm',
      order: 2,
    },
    {
      _id: '0ad6e913664419f57c2d7600b9003ee6',
      'select-id': 4,
      type: 'item',
      name: 'Security Master',
      'group-id': 9,
      'test-id': 'filter-security-master',
      order: 3,
    },
    {
      _id: 'bdcc341505c4271452001a8a21033785',
      'select-id': 3,
      type: 'item',
      name: 'Team Member',
      'group-id': 9,
      'test-id': 'filter-team-member',
      order: 4,
    },
    {
      _id: 'bdcc341564c9170f0478e00006429bf8',
      'select-id': 5,
      type: 'item',
      name: 'Design Owner',
      'group-id': 9,
      'test-id': 'filter-Design Owner',
      order: 5,
    },
    {
      _id: 'bdcc341564c9170f0478e00006429cf1',
      'select-id': 6,
      type: 'item',
      name: 'Guardian',
      'group-id': 9,
      'test-id': 'filter-guardian',
      order: 6,
    },
    {
      _id: 'bdcc341564c9170f0478e00006429cf2',
      'select-id': 7,
      type: 'item',
      name: 'Trusted Committer',
      'group-id': 9,
      'test-id': 'filter-trusted-committer',
      order: 7,
    },
    {
      _id: '3e40f822bab762133a9c3b9688009e82',
      'group-id': 10,
      group: 'Documentation Categories Auto',
      slug: 'documentation-categories-auto',
      type: 'group',
      'test-id': 'group-documentation-categories-auto',
      order: 10,
      'show-as-filter': false,
    },
    {
      _id: '3e40f822bab762133a9c3b968800db56',
      'group-id': 11,
      group: 'Documentation Titles Auto',
      slug: 'documentation-titles-auto',
      type: 'group',
      'test-id': 'group-documentation-titles-auto',
      order: 11,
      'show-as-filter': false,
    },
    {
      _id: '6168336c4a03eacc30eac51c',
      'group-id': 12,
      group: 'Global Variables',
      slug: 'global-variables',
      type: 'group',
      'test-id': 'group-global-variables',
      order: 12,
      'show-as-filter': false,
    },
    {
      _id: '616834b210beca81ecad92be',
      'select-id': 1,
      type: 'item',
      name: 'https://calstore.internal.ericsson.com/elex?LI=EN/LZN7950007*&FB=0_0_0',
      'group-id': 12,
      'test-id': 'cpi',
      order: 0,
      slug: 'cpi',
    },
    {
      _id: '3e40f822bab762133a9c3b968800c09e',
      'select-id': 1,
      type: 'item',
      name: 'Developer Product Information',
      'group-id': 10,
      'test-id': 'filter-dpi',
      order: 0,
      slug: 'dpi',
    },
    {
      _id: '3e40f822bab762133a9c3b968800b23b',
      'select-id': 1,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service Overview',
      'group-id': 11,
      'test-id': 'filter-service-overview',
      order: 0,
      slug: 'service-overview',
    },
    {
      _id: '3e40f822bab762133a9c3b968800ede3',
      'select-id': 2,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service Deployment Guide',
      'group-id': 11,
      'test-id': 'filter-service-deployment-guide',
      order: 1,
      slug: 'service-deployment-guide',
    },
    {
      _id: '3e40f822bab762133a9c3b968800fdc9',
      'select-id': 3,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service Troubleshooting Guide',
      'group-id': 11,
      'test-id': 'filter-service-troubleshooting-guide',
      order: 2,
      slug: 'service-troubleshooting-guide',
    },
    {
      _id: '3e40f822bab762133a9c3b9688010f37',
      'select-id': 4,
      'documentation-categories': 1,
      type: 'item',
      name: 'Application Developers Guide',
      'group-id': 11,
      'test-id': 'filter-application-developers-guide',
      order: 3,
      slug: 'application-developers-guide',
    },
    {
      _id: '3e40f822bab762133a9c3b9688012104',
      'select-id': 5,
      'documentation-categories': 4,
      type: 'item',
      name: 'API Documentation',
      'group-id': 11,
      'test-id': 'filter-api-documentation',
      order: 4,
      slug: 'api-documentation',
    },
    {
      _id: '3e40f822bab762133a9c3b9688013120',
      'select-id': 6,
      'documentation-categories': 1,
      type: 'item',
      name: 'Service User Guide',
      'group-id': 11,
      'test-id': 'filter-service-user-guide',
      order: 5,
      slug: 'service-user-guide',
    },
    {
      _id: '3e40f822bab762133a9c3b9688013c00',
      'select-id': 2,
      type: 'item',
      name: 'Inner Source',
      'group-id': 10,
      'test-id': 'filter-inner-source',
      order: 1,
      slug: 'inner-source',
    },
    {
      _id: '3e40f822bab762133a9c3b9688014974',
      'select-id': 7,
      'documentation-categories': 2,
      type: 'item',
      name: 'Inner Source README',
      'group-id': 11,
      'test-id': 'filter-inner-source-readme',
      order: 0,
      slug: 'inner-source-readme',
    },
    {
      _id: '3e40f822bab762133a9c3b9688015fb3',
      'select-id': 8,
      'documentation-categories': 2,
      type: 'item',
      name: 'Contributing Guideline',
      'group-id': 11,
      'test-id': 'filter-contributing-guideline',
      order: 1,
      slug: 'contributing-guideline',
    },
    {
      _id: '3e40f822bab762133a9c3b968801d8ed',
      'select-id': 3,
      type: 'item',
      name: 'Release Documents',
      'group-id': 10,
      'test-id': 'filter-release-documents',
      order: 3,
      slug: 'release-documents',
    },
    {
      _id: '3e40f822bab762133a9c3b9688016dd2',
      'select-id': 9,
      'documentation-categories': 3,
      type: 'item',
      name: 'Product Revision Information (PRI)',
      'group-id': 11,
      'test-id': 'filter-product-revision-information-pri',
      order: 0,
      slug: 'product-revision-information-pri',
    },
    {
      _id: '3e40f822bab762133a9c3b9688017c4e',
      'select-id': 10,
      'documentation-categories': 3,
      type: 'item',
      name: 'Test Report',
      'group-id': 11,
      'test-id': 'filter-test-report',
      order: 1,
      slug: 'test-report',
    },
    {
      _id: '3e40f822bab762133a9c3b96880191e6',
      'select-id': 11,
      'documentation-categories': 3,
      type: 'item',
      name: 'Test Specification',
      'group-id': 11,
      'test-id': 'filter-test-specification',
      order: 2,
      slug: 'test-specification',
    },
    {
      _id: '3e40f822bab762133a9c3b9688019c4e',
      'select-id': 12,
      'documentation-categories': 3,
      type: 'item',
      name: 'Risk Assessment & Privacy Impact Assessment',
      'group-id': 11,
      'test-id': 'filter-risk-assessment-privacy-impact-assessment',
      order: 3,
      slug: 'risk-assessment-privacy-impact-assessment',
    },
    {
      _id: '3e40f822bab762133a9c3b968801a4bd',
      'select-id': 13,
      'documentation-categories': 3,
      type: 'item',
      name: 'Vulnerability Analysis Report',
      'group-id': 11,
      'test-id': 'filter-vulnerability-analysis-report',
      order: 4,
      slug: 'vulnerability-analysis-report',
    },
    {
      _id: '3e40f822bab762133a9c3b968801aacc',
      'select-id': 14,
      'documentation-categories': 3,
      type: 'item',
      name: 'Software Vendor List (SVL)',
      'group-id': 11,
      'test-id': 'filter-software-vendor-list-svl',
      order: 5,
      slug: 'software-vendor-list-svl',
    },
    {
      _id: '2d1d7b2c7d5f5a68d0fd975c9c075e9d',
      'select-id': 15,
      'documentation-categories': 3,
      type: 'item',
      name: 'Export Control Report',
      'group-id': 11,
      'test-id': 'filter-export-control-report',
      order: 6,
      slug: 'export-control-report',
    },
    {
      _id: '3e40f822bab762133a9c3b968801f98c',
      'select-id': 4,
      type: 'item',
      name: 'Additional Documents',
      'group-id': 10,
      'test-id': 'filter-additional-documents',
      order: 4,
      default: true,
      slug: 'additional-documents',
    },
    {
      _id: '3e40f822bab762133a9c3b9688015dd2',
      'select-id': 16,
      'documentation-categories': 3,
      type: 'item',
      name: 'Secure Coding Report',
      'group-id': 11,
      'test-id': 'filter-secure-coding-report',
      order: 7,
      slug: 'secure-coding-report'
    },
    {
      _id: '3e40f822bab762133a9c3b9688115dd2',
      'select-id': 17,
      'documentation-categories': 3,
      type: 'item',
      name: 'Characteristics Summary Report',
      'group-id': 11,
      'test-id': 'filter-characteristics-summary-report',
      order: 8,
      slug: 'characteristics-summary-report'
    },
    {
      _id: '665ee0c2831f680007e5c27c',
      'select-id': 16,
      type: 'item',
      name: 'SAN Services',
      'group-id': 3,
      'test-id': 'filter-oss',
      order: 16
    },
    {
      _id: '665ee38e831f680007e5c27e',
      'select-id': 7,
      type: 'item',
      name: 'Deployment',
      desc: 'Services that focus on providing a means to deliver Network Deployment commercial services.',
      'group-id': 4,
      'test-id': 'filter-messaging',
      order: 7
    },
  ];
  return listOptions;
// --------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
