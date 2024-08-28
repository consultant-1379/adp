/**
 *  This config object can be used to pass general test information into tests
 *
 */
const config = require('./test.config.js');

module.exports = {
  demoService: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 2,
    domain: 1,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,

    description: 'A repository for images for content delivery',
    product_number: 'A96584344PO',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    discussion_forum_link: 'https://confluence.lmera.ericsson.se/display/AP/Portal+Deployment#PortalDeployment-Workingwithgit',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test Automation create 1',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
  },

  demoService1:
     {
       helm_chartname: 'eric-lcm-container-registry',
       giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
       owner: 'eyiizha',
       approval_comment: '',
       service_category: 2,
       domain: 3,
       check_cpi: true,
       reusability_level: 1,
       teamMails: [
         'darcy.zha@ericsson.com',
         'magnus.harnesk@ericsson.com',
       ],
       adp_strategy: '1',
       service_maturity: 5,
       serviceArea: 2,
       description: 'A repository for images for content delivery',
       product_number: 'A96589344PODTY',
       helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
       approval: 'approved',
       adp_organization: 'test realization',
       adp_realization: 'test realization',
       name: 'Test Automation 2',
       additional_information: [
         {
           category: 'tutorial',
           title: 'My First ADP Service',
           link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
         },
       ],
       backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
       menu_auto: false,
       repo_urls: {
         development: '',
         release: '',
       },
       menu: {
         auto: {
           development: [],
           release: [],
           date_modified: '',
           errors: {
             development: [],
             release: [],
           },
         },
         manual: {
           development: [
             {
               name: 'Other Documents',
               external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
               default: true,
             },
           ],
           release: [],
           date_modified: '',
         },
       },
       team: [
         {
           team_role: 1,
           signum: 'eyiizha',
           serviceOwner: true,
         }],
     },

  demoServiceSync:
     {
       helm_chartname: 'eric-fh-alarm-handler',
       giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
       owner: 'esupuse',
       approval: 'approved',
       service_category: 4,
       domain: 7,
       check_cpi: false,
       reusability_level: 4,
       teamMails: [
         'super-user@adp-test.com',
       ],
       service_maturity: 7,
       serviceArea: 3,
       description: 'Test Microservice with documnet sync report',
       helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
       name: 'Auto MS doc sync Gerrit Sync',
       menu_auto: false,
       repo_urls: {
         development: '',
         release: '',
       },
       menu: {
         auto: {
           development: [],
           release: [],
           date_modified: '',
           errors: {
             development: [],
             release: [],
           },
         },
         manual: {
           development: [
             {
               name: 'adoc in Gerrit',
               slug: 'adoc-in-gerrit',
               external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/ui/adp.git;a=blob_plain;f=e2e/protractor/data/testFiles/assetDocumentation/document.adoc;hb=refs/heads/master',
             },
           ],
           release: [
             {
               version: '1.0.1',
               documents: [
                 {
                   name: 'adoc in Gerrit',
                   slug: 'adoc-in-gerrit',
                   external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/ui/adp.git;a=blob_plain;f=e2e/protractor/data/testFiles/assetDocumentation/document.adoc;hb=refs/heads/master',
                   restricted: true,
                 },
                 {
                   name: 'HTML in Gerrit Sync',
                   slug: 'html-in-gerrit',
                   external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/CI/infra.git;a=blob;f=download/document.html;hb=HEAD',
                   default: true,
                   restricted: true,
                 },
                 {
                   name: 'TXT in Gerrit Sync',
                   slug: 'txt-in-gerrit',
                   external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/CI/infra.git;a=blob;f=download/document.txt;hb=HEAD',
                   restricted: true,
                 },
                 {
                   name: 'external link',
                   external_link: 'https://www.ericsson.com/en',
                   slug: 'external-link',
                   restricted: true,
                 },
                 {
                   name: 'external pdf',
                   external_link: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/download/attachments/362717690/document.pdf?api=v2',
                   slug: 'external-pdf',
                   restricted: true,
                 },
               ],
             },
           ],
           date_modified: '',
         },
       },
       team: [
         {
           team_role: 1,
           signum: 'eyiizha',
           serviceOwner: true,
         }],
     },

  demoService_with_category:
     {
       helm_chartname: 'eric-lcm-container-registry',
       giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
       owner: 'eyiizha',
       approval_comment: '',
       service_category: 1,
       domain: 1,
       reusability_level: 3,
       teamMails: [
         'darcy.zha@ericsson.com',
         'magnus.harnesk@ericsson.com',
       ],
       adp_strategy: '1',
       service_maturity: 5,
       serviceArea: 2,
       description: 'A repository for images for content delivery',
       product_number: 'A96589344PODTY',
       helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
       approval: 'approved',
       adp_organization: 'test realization',
       adp_realization: 'test realization',
       name: 'Test Automation Maturity',
       menu_auto: false,
       repo_urls: {
         development: '',
         release: '',
       },
       menu: {
         auto: {
           development: [],
           release: [],
           date_modified: '',
           errors: {
             development: [],
             release: [],
           },
         },
         manual: {
           development: [
             {
               name: 'Other Documents',
               external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
               default: true,
             },
           ],
           release: [],
           date_modified: '',
         },
       },
       team: [
         {
           team_role: 1,
           signum: 'eyiizha',
           serviceOwner: true,
         }],
     },

  demoService1_updated:
     {
       owner: 'eyiizha',
       approval_comment: '',
       service_category: 2,
       domain: 1,
       reusability_level: 1,
       teamMails: [
         'darcy.zha@ericsson.com',
         'magnus.harnesk@ericsson.com',
       ],
       adp_strategy: '1',
       service_maturity: 8,
       serviceArea: 2,
       description: 'A repository for images for content delivery',
       product_number: 'A96589344PODTY',
       approval: 'approved',
       adp_organization: 'test realization',
       adp_realization: 'test realization',
       name: 'Test Automation 2',
       menu_auto: false,
       repo_urls: {
         development: '',
         release: '',
       },
       menu: {
         auto: {
           development: [],
           release: [],
           date_modified: '',
           errors: {
             development: [],
             release: [],
           },
         },
         manual: {
           development: [
             {
               name: 'Other Documents',
               external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
               default: true,
             },
           ],
           release: [],
           date_modified: '',
         },
       },
       team: [
         {
           team_role: 1,
           signum: 'eyiizha',
           serviceOwner: true,
         }],
     },

  demoService2:
      {
        name: 'Test Automation fail',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [],
            release: [],
            date_modified: '',
            errors: {
              development: [],
              release: [],
            },
          },
          manual: {
            development: [
              {
                name: 'Other Documents',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
                default: true,
              },
            ],
            release: [],
            date_modified: '',
          },
        },
        team: [
          {
            team_role: 1,
            signum: 'eyiizha',
            serviceOwner: true,
          }],
      },

  demoService3: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 3,
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'A repository for images for content delivery',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test create test user 1',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
  },

  demoService_with_tag: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 3,
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'A repository for images for content delivery',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test create MS tags',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_with_mimer_version_starter: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    service_category: 3,
    mimer_version_starter: '1.0.2',
    product_number: 'APR20140',
    domain: 3,
    approval: 'approved',
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'MS to check mimer_version_starter',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    name: 'MS with mimer_version_starter',
    menu_auto: true,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
    ],
  },

  demoService_with_mimer_version_starter: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    service_category: 3,
    mimer_version_starter: '1.0.2',
    domain: 3,
    reusability_level: 3,
    approval: 'approved',
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'MS to check mimer_version_starter',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    name: 'MS with mimer_version_starter',
    menu_auto: true,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
    ],
  },

  demoService_with_mimer_version_update_fail: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    service_category: 3,
    mimer_version_starter: true,
    product_number: 'APR20140',
    domain: 3,
    approval: 'approved',
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'MS to check mimer_version_starter',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    name: 'MS with mimer_version_starter',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
    ],
  },

  demoService_with_mimer_version_update: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    service_category: 3,
    mimer_version_starter: '1.0.1',
    product_number: 'APR20140',
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'MS to check mimer_version_starter',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    name: 'MS with mimer_version_starter',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
    ],
  },
  demoService_mimer_6: {
    name: 'Auto MS Mimer-6',
    mimer_version_starter: '8.2.9',
    product_number: 'APR20149',
    approval: 'approved',
    team: [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'eterase',
      },
      {
        team_role: 1,
        serviceOwner: false,
        signum: 'etesuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    owner: 'esupuse',
    adp_strategy: 'Compliance',
    adp_organization: 'Organization',
    adp_realization: 'Realization',
    additional_info: 'Additional Information',
    description: 'This is a service containing data for mimer.',
    check_cpi: false,
    restricted: 1,
    restricted_description: 'Reason to be Restricted',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    domain: 4,
    serviceArea: 2,
    service_maturity: 6,
    report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
    request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
    based_on: 'Test 3PP',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
    teamMails: [
      'rase-user@adp-test.com',
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    team_mailers: [
      'adpusers@ericsson.com',
      'adpusers2@ericsson.com',
    ],
    type: 'microservice',
    date_modified: '2018-05-15T10:32:27.067Z',
    reusability_level: 4,
    service_category: 3,
    inval_secret: 'abcdef',
    menu_auto: true,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
        ],
        release: [],
        date_modified: '',
      },
    },
  },
  demoService_with_tag_update: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 2,
    domain: 1,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'A repository for images for content delivery',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test create MS tags',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Free To Use' },
      { id: '', label: 'Test label2' },
    ],
  },

  demoService_with_restricted_code: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 3,
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    restricted: 2,
    description: 'A repository for images for content delivery',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test create MS restricted',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_with_team_mails: {
    helm_chartname: '',
    giturl: '',
    owner: 'emesuseesupuse',
    approval_comment: '',
    service_category: 3,
    domain: 4,
    reusability_level: 1,
    teamMails: [
      'super-user@adp-test.com',
    ],
    team_mailers: [
      'adpusers@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test team mailers',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test MS team mailer',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_innersource: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 3,
    domain: 4,
    reusability_level: 1,
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test Innersource information',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test MS Innersource Team',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    teamMails: [
      'super-user@adp-test.com',
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_innersource_3: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 3,
    domain: 7,
    reusability_level: 3,
    adp_strategy: '1',
    service_maturity: 8,
    serviceArea: 5,
    restricted: 2,
    description: 'Test MS to test Innersource logic 3',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Auto MS Test Innersource 3',
    menu_auto: false,
    teamMails: [
      'super-user@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Test label1' },
    ],
  },

  demoService_Owner_Test: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 3,
    domain: 4,
    reusability_level: 1,
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test Innersource information',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test MS Service Owner',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    teamMails: [
      'super-user@adp-test.com',
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_5: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 1,
    domain: 1,
    reusability_level: 4,
    service_maturity: 1,
    serviceArea: 5,
    restricted: 2,
    description: 'Test MS',
    helmurl: '',
    teamMails: [
      'messy-user@adp-test.com',
    ],
    approval: 'approved',
    name: 'Auto MS test 5',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      },
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'emesuse',
      },
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },

  demoService_Sync: {
    approval: 'approved',
    team: [
      {
        team_role: 2,
        serviceOwner: true,
        signum: 'eterase',
      },
      {
        team_role: 1,
        serviceOwner: false,
        signum: 'etesuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    owner: 'esupuse',
    adp_strategy: 'Compliance',
    adp_organization: 'Organization',
    adp_realization: 'Realization',
    additional_info: 'Additional Information',
    name: 'Auto MS Doc Sync Mock Artifactory Del',
    description: 'This is is a service containing Mock Artifactory Links for Integration Tests. Be careful with changes!',
    restricted: 1,
    restricted_description: 'Reason to be Restricted',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    domain: 4,
    serviceArea: 2,
    service_maturity: 6,
    report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
    request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
    based_on: 'Test 3PP',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    teamMails: [
      'rase-user@adp-test.com',
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    type: 'microservice',
    slug: 'auto-ms-doc-sync-mock-artifactory-del',
    date_modified: '2019-08-15T10:32:27.067Z',
    reusability_level: 4,
    service_category: 3,
    inval_secret: 'abcdef',
    menu_auto: true,
    repo_urls: {
      development: 'https://192.168.56.102/notify/mockartifactory/local/dynamic/',
      release: 'https://192.168.56.102/notify/mockartifactory/local/dynamic/',
      //    development: `${config.mockArtifactoryAddress}${config.mockArtifactoryEnvTag}dynamic/`,
      //   release: `${config.mockArtifactoryAddress}${config.mockArtifactoryEnvTag}dynamic/`,
    },
    menu: {
      auto: {
        development: [],
        release: [
          {
            version: '1.0.1',
            documents: [
              {
                name: 'Sample 1',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                default: true,
                slug: 'sample-1',
              },
              {
                name: 'An External',
                external_link: 'https://www.ericsson.se',
                restricted: true,
                slug: 'an-external',
              },
            ],
          },
        ],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
    check_cpi: false,
  },

  autoMSTestChangeCategory: {
    approval: 'approved',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS Test Change Category',
    description: 'Auto MS testChange Category',
    restricted: 1,
    restricted_description: 'Security Isuues',
    domain: 1,
    serviceArea: 2,
    service_maturity: 1,
    based_on: 'Ericsson Internal',
    teamMails: [
      'super-user@adp-test.com',
    ],
    reusability_level: 4,
    service_category: 2,
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Features',
            slug: 'features',
            external_link: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Features',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
  },


  demoService_with_restricted_description: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 3,
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    restricted: 1,
    restricted_description: 'reason to be restricted',
    description: 'A repository for images for content delivery',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test create MS restricted',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'eyiizha',
        serviceOwner: true,
      }],
    tags: [
      { id: '', label: 'Free To Use' },
      { id: '', label: 'Test label2' },
    ],
  },

  demoService_with_compliance:
   {
     helm_chartname: 'eric-lcm-container-registry',
     giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
     owner: 'eyiizha',
     approval_comment: '',
     service_category: 1,
     domain: 1,
     reusability_level: 3,
     teamMails: [
       'darcy.zha@ericsson.com',
       'magnus.harnesk@ericsson.com',
     ],
     adp_strategy: '1',
     service_maturity: 5,
     serviceArea: 2,
     description: 'A repository for images for content delivery',
     product_number: 'A96589344PODTY',
     helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
     approval: 'approved',
     name: 'Test Automation Compliance',
     menu_auto: false,
     repo_urls: {
       development: '',
       release: '',
     },
     menu: {
       auto: {
         development: [],
         release: [],
         date_modified: '',
         errors: {
           development: [],
           release: [],
         },
       },
       manual: {
         development: [
           {
             name: 'Other Documents',
             external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
             default: true,
           },
         ],
         release: [],
         date_modified: '',
       },
     },
     compliance: [
       {
         group: 1,
         fields: [
           {
             field: 1,
             answer: 1,
             comment: '',
           },
         ],
       },
     ],
     team: [
       {
         team_role: 1,
         signum: 'esupuse',
         serviceOwner: true,
       }],
   },

  demoService_with_search:
   {
     helm_chartname: 'eric-lcm-container-registry',
     giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
     owner: 'eyiizha',
     approval_comment: '',
     service_category: 1,
     domain: 1,
     reusability_level: 3,
     teamMails: [
       'darcy.zha@ericsson.com',
       'magnus.harnesk@ericsson.com',
     ],
     adp_strategy: '1',
     service_maturity: 5,
     serviceArea: 2,
     based_on: 'Ericsson Internal',
     description: 'MS to test search',
     product_number: 'A96589344PODTY',
     helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
     approval: 'approved',
     name: 'Test Automation SearchTr',
     menu_auto: false,
     repo_urls: {
       development: '',
       release: '',
     },
     menu: {
       auto: {
         development: [],
         release: [],
         date_modified: '',
         errors: {
           development: [],
           release: [],
         },
       },
       manual: {
         development: [
           {
             name: 'Other Documents',
             external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
             default: true,
           },
         ],
         release: [],
         date_modified: '',
       },
     },
     compliance: [
       {
         group: 1,
         fields: [
           {
             field: 1,
             answer: 1,
             comment: '',
           },
         ],
       },
     ],
     team: [
       {
         team_role: 1,
         signum: 'esupuse',
         serviceOwner: true,
       }],
   },

  demoService_with_search2:
   {
     helm_chartname: 'eric-lcm-container-registry',
     giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
     owner: 'eyiizha',
     approval_comment: '',
     service_category: 2,
     domain: 1,
     reusability_level: 3,
     teamMails: [
       'darcy.zha@ericsson.com',
       'magnus.harnesk@ericsson.com',
     ],
     adp_strategy: '1',
     service_maturity: 5,
     serviceArea: 2,
     based_on: 'Ericsson Internal',
     description: 'MS to test search',
     product_number: 'A96589344PODTY',
     helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
     approval: 'approved',
     name: 'Test Auto Search Doc',
     menu_auto: false,
     repo_urls: {
       development: '',
       release: '',
     },
     menu: {
       auto: {
         development: [],
         release: [],
         date_modified: '',
         errors: {
           development: [],
           release: [],
         },
       },
       manual: {
         development: [
           {
             name: 'Other Documents',
             external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
             default: true,
           },
         ],
         release: [
           {
             version: '3.2.1',
             is_cpi_updated: true,
             documents: [
               {
                 name: 'Troubleshooting Guide',
                 slug: 'troubleshooting-guide',
                 external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                 default: true,
               },
               {
                 name: 'Application Developers Guide',
                 slug: 'application-developers-guide',
                 external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=b08b5195382360149009bd719b334453b7015229',
               },
               {
                 name: 'Service Overview',
                 slug: 'service-overview',
                 external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;h=6d8da7d0fe80bb6b0c2ae5e103bb7405fd2180a1;hb=b08b5195382360149009bd719b334453b7015229',
               },
             ],
           },
         ],
         date_modified: '',
       },
     },
     compliance: [
       {
         group: 1,
         fields: [
           {
             field: 1,
             answer: 1,
             comment: '',
           },
         ],
       },
     ],
     team: [
       {
         team_role: 1,
         signum: 'esupuse',
         serviceOwner: true,
       }],
   },

  demoService_with_search3:
   {
     helm_chartname: 'eric-lcm-container-registry',
     giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-sec/sec-vault',
     owner: 'eyiizha',
     approval_comment: '',
     service_category: 1,
     domain: 1,
     reusability_level: 3,
     teamMails: [
       'darcy.zha@ericsson.com',
       'magnus.harnesk@ericsson.com',
     ],
     adp_strategy: '1',
     service_maturity: 5,
     serviceArea: 2,
     based_on: 'Ericsson Internal',
     description: 'MS to test search',
     product_number: 'A96589344PODTY',
     helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
     approval: 'approved',
     name: 'Test Search Doc Auto',
     slug: 'test-search-doc-auto',
     menu_auto: true,
     repo_urls: {
       development: `${config.mockServerUrl}mockartifactory/local/dynamic/`,
       release: `${config.mockServerUrl}mockartifactory/local/dynamic/`,
     },
     menu: {
       auto: {
         development: [],
         release: [
           {
             version: '1.0.1',
             documents: [
               {
                 name: 'Sample 1',
                 filepath: '1.0.1/CAS_Deployment_Guide.zip',
                 default: true,
                 slug: 'sample-1',
               },
               {
                 name: 'An External',
                 external_link: 'https://www.ericsson.se',
                 restricted: true,
                 slug: 'an-external',
               },
             ],
           },
         ],
         date_modified: '',
         errors: {
           development: [],
           release: [],
         },
       },
       manual: {
         development: [],
         release: [],
         date_modified: '',
       },
     },
     compliance: [
       {
         group: 1,
         fields: [
           {
             field: 1,
             answer: 1,
             comment: '',
           },
         ],
       },
     ],
     team: [
       {
         team_role: 1,
         signum: 'esupuse',
         serviceOwner: true,
       }],
   },


  demoService_datatest: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'eyiizha',
    approval_comment: '',
    service_category: 3,
    domain: 3,
    reusability_level: 3,
    teamMails: [
      'darcy.zha@ericsson.com',
      'magnus.harnesk@ericsson.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'Key Management, use cases: Secret Store, Data Signing, Data Encryption, Certificate Authority.',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-adp-gs-released-helm',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Key Management',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Service Overview',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/dpi/overview.adoc;hb=HEAD',
            default: false,
          },
          {
            name: 'Service Deployment Guide',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/dpi/deployment-guide.adoc;hb=HEAD ',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 2,
        serviceOwner: false,
        signum: 'lmfmark',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'lmfmtv',
      }],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
  },
  newuser_create: {
    signum: 'newuser_test',
    name: 'New User',
    email: 'email@newuser.com',
  },
  newuser_update_role: {
    signum: 'newuser_test',
    name: 'New User',
    email: 'email@newuser.com',
    role: 'admin',
  },
  newuser_update_name: {
    signum: 'newuser_test',
    name: 'New User Test',
    email: 'email@newuser.com',
    role: 'admin',
  },
  demoAssetWithFieldPermission: {
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/adp-gs/adp-gs-cntrreg/',
    owner: 'emesuse',
    approval_comment: '',
    service_category: 3,
    domain: 5,
    reusability_level: 1,
    teamMails: [
      'messy-user@adp-test.com',
    ],
    adp_strategy: '1',
    service_maturity: 5,
    serviceArea: 2,
    description: 'Testing Field Permission (If can or not change the reusability_level)',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    name: 'Test about Field Permission',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'emesuse',
        serviceOwner: true,
      }],
  },
  demoAssetWithFieldPermission2: {
    helm_chartname: '',
    giturl: '',
    owner: 'emesuse',
    approval_comment: '',
    service_category: 3,
    domain: 4,
    reusability_level: 1,
    teamMails: [
      'messy-user@adp-test.com',
    ],
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    description: 'Testing Field Permission (But with another Domain)',
    helmurl: '',
    approval: 'approved',
    name: 'Test about Field Permission 2',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'emesuse',
        serviceOwner: true,
      }],
  },

  demoService_CPI_positive: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 2,
    domain: 4,
    reusability_level: 1,
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test CPI',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test MS CPI',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [
          {
            version: '3.2.1',
            is_cpi_updated: true,
            documents: [
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;h=4410da0632d86c4ae0a3285f2f5137713715c6e1;hb=b08b5195382360149009bd719b334453b7015229',
                default: true,
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=b08b5195382360149009bd719b334453b7015229',
              },
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;h=6d8da7d0fe80bb6b0c2ae5e103bb7405fd2180a1;hb=b08b5195382360149009bd719b334453b7015229',
              },
            ],
          },
        ],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    teamMails: [
      'super-user@adp-test.com',
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
    check_cpi: true,
  },
  demoService_CPI_undefined: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 2,
    domain: 4,
    reusability_level: 1,
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test CPI',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test MS CPI Undefined',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [
          {
            version: '3.2.1',
            documents: [
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;h=4410da0632d86c4ae0a3285f2f5137713715c6e1;hb=b08b5195382360149009bd719b334453b7015229',
                default: true,
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=b08b5195382360149009bd719b334453b7015229',
              },
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;h=6d8da7d0fe80bb6b0c2ae5e103bb7405fd2180a1;hb=b08b5195382360149009bd719b334453b7015229',
              },
            ],
          },
        ],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    teamMails: [
      'super-user@adp-test.com',
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
    check_cpi: true,
  },

  demoService_CPI_category_negative: {
    helm_chartname: '',
    giturl: '',
    owner: 'esupuse',
    approval_comment: '',
    service_category: 2,
    domain: 4,
    reusability_level: 1,
    adp_strategy: '1',
    service_maturity: 1,
    serviceArea: 2,
    restricted: 2,
    description: 'Service to test CPI for categary for which it should not be used',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    approval: 'approved',
    adp_organization: 'test realization',
    adp_realization: 'test realization',
    name: 'Test CPI with category',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cntrreg.git;a=blob_plain;f=doc/marketplace_doclist/marketplace_doclist.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [
          {
            version: '3.2.1',
            documents: [
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;h=4410da0632d86c4ae0a3285f2f5137713715c6e1;hb=b08b5195382360149009bd719b334453b7015229',
                default: true,
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=b08b5195382360149009bd719b334453b7015229',
              },
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;h=6d8da7d0fe80bb6b0c2ae5e103bb7405fd2180a1;hb=b08b5195382360149009bd719b334453b7015229',
              },
            ],
          },
        ],
        date_modified: '',
      },
    },
    team: [
      {
        team_role: 1,
        signum: 'esupuse',
        serviceOwner: true,
      }],
    teamMails: [
      'super-user@adp-test.com',
    ],
    tags: [
      { id: '', label: 'Test label1' },
      { id: '', label: 'Free To Use' },
    ],
    check_cpi: true,
  },

  demoService_CPI_positive_update: {
    approval: 'approved',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'eterase',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS Test CPI',
    description: 'Test MS to test CPI logic in microservice and documentation level',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    restricted: 7,
    domain: 3,
    serviceArea: 4,
    service_maturity: 1,
    based_on: 'Ericsson Internal',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    teamMails: [
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    reusability_level: 4,
    service_category: 2,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        development: [
          {
            name: 'Service Overview',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
            default: true,
            slug: 'service-overview',
          },
          {
            name: 'Service Deployment Guide',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            slug: 'service-deployment-guide',
          },
          {
            name: 'Inner Source README',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            slug: 'inner-source-readme',
          },
          {
            name: 'Contributing Guideline',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            slug: 'contributing-guideline',
          },
          {
            name: 'Test Report',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            slug: 'test-report',
          },
          {
            name: 'Vulnerability Analysis Report',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            slug: 'vulnerability-analysis-report',
          },
        ],
        release: [
          {
            version: '2.0.0',
            is_cpi_updated: true,
            documents: [
              {
                name: 'Service Overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'service-overview',
              },
              {
                name: 'Application Developers Guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'application-developers-guide',
              },
              {
                name: 'Inner Source README',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'inner-source-readme',
              },
              {
                name: 'Contributing Guideline',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                default: true,
                slug: 'contributing-guideline',
              },
              {
                name: 'Product Revision Information (PRI)',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'product-revision-information-pri',
              },
              {
                name: 'Risk Assessment & Privacy Impact Assessment',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'risk-assessment-privacy-impact-assessment',
              },
            ],
          },
          {
            version: '1.0.0',
            is_cpi_updated: true,
            documents: [
              {
                name: 'Service Overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'service-overview',
              },
              {
                name: 'Service Deployment Guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
                slug: 'service-deployment-guide',
              },
              {
                name: 'Inner Source README',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'inner-source-readme',
              },
              {
                name: 'Contributing Guideline',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'contributing-guideline',
              },
              {
                name: 'Test Report',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                default: true,
                slug: 'test-report',
              },
              {
                name: 'Test Specification',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
                slug: 'test-specification',
              },
            ],
          },
        ],
        date_modified: '2020-07-08T08:24:08.996Z',
      },
      auto: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
    menu_auto: false,
    check_cpi: true,
  },

  demoServiceAddInfo: {
    approval: 'approved',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'eterase',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS Add Info Create',
    description: 'Test MS to test Additional information section on MS',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    restricted: 7,
    domain: 3,
    serviceArea: 4,
    service_maturity: 1,
    based_on: 'Ericsson Internal',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    teamMails: [
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    reusability_level: 4,
    service_category: 2,
    additional_information: [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
      {
        category: 'demo',
        title: 'Test title for the Demo',
        link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
      },
    ],
    backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    menu_auto: false,
    check_cpi: true,
  },
  demoServiceAddInfo1: {
    approval: 'approved',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'eterase',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS Add Info',
    description: 'Test MS to test Additional information section on MS',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    restricted: 7,
    domain: 3,
    serviceArea: 4,
    service_maturity: 1,
    based_on: 'Ericsson Internal',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    teamMails: [
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    reusability_level: 4,
    service_category: 2,
    additional_information: [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
      {
        category: 'demo',
        title: 'Test title for the Demo',
        link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
      },
    ],
    backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    menu_auto: false,
    check_cpi: true,
  },
  assemblyAuto1: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly Min',
    description: 'Min Assembly, to test just mandatory fields',
    check_cpi: false,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    slug: 'assembly-min',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 2,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreate: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly Min Create',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 2,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    slug: 'assembly-min',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 2,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreate5: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly create 5',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 2,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    slug: 'assembly-create-5',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 2,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail1: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS Min',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 2,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    slug: 'auto-ms-min',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 2,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail2: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly fail no helm',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 2,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 2,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail3: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly fail 3',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 1,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    component_service: ['45e7f4f992afe7bbb62a3391e500e71b', '17e57f6cea1b5a673f8775e6cf023352'],
    mimer_version_starter: '0.0.0',
    helm_chartname: 'eric-lcm-container-registry',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail4: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly fail 4',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 1,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    helm_chartname: 'eric-lcm-container-registry',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail5: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly fail 5',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 3,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    component_service: ['45e7f4f992afe7bbb62a3391e500e71b', '17e57f6cea1b5a673f8775e6cf023352'],
    mimer_version_starter: '0.0.0',
    helm_chartname: 'eric-lcm-container-registry',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateFail6: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly fail 3',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 1,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    component_service: ['45e7f4f992afe7bbb62a3391e500e71b', '17e57f6cea1b5a673f8775e6cf023352'],
    mimer_version_starter: '0.0.0',
    helm_chartname: 'eric-lcm-container-registry',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreate2: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly Create 2',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    description: 'Min Assembly, to test just mandatory fields',
    domain: 5,
    assembly_maturity: 2,
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    helm_chartname: 'eric-lcm-container-registry',
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoCreateMax: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    adp_strategy: 'Compliance',
    adp_organization: 'Organization',
    adp_realization: 'Realization',
    additional_info: 'Additional Information',
    check_cpi: false,
    component_service: ['45e7f4f992afe7bbb62a3391e500e71b', '17e57f6cea1b5a673f8775e6cf023352'],
    restricted: 1,
    restricted_description: 'Reason to be Restricted',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    domain: 1,
    report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
    request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
    teamMails: [
      'rase-user@adp-test.com',
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    team_mailers: [
      'adpusers@ericsson.com',
      'adpusers2@ericsson.com',
    ],
    name: 'Assembly Create Max',
    description: 'Man Assembly, to test just mandatory fields',
    assembly_maturity: 2,
    type: 'assembly',
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 1,
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'adoc in Gerrit',
            slug: 'adoc-in-gerrit',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/ui/adp.git;a=blob_plain;f=e2e/protractor/data/testFiles/assetDocumentation/document.adoc;hb=refs/heads/master',
          },
        ],
        release: [
          {
            version: '1.0.1',
            documents: [
              {
                name: 'adoc in Gerrit',
                slug: 'adoc-in-gerrit',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/ui/adp.git;a=blob_plain;f=e2e/protractor/data/testFiles/assetDocumentation/document.adoc;hb=refs/heads/master',
                restricted: true,
              },
              {
                name: 'HTML in Gerrit Sync',
                slug: 'html-in-gerrit',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/CI/infra.git;a=blob;f=download/document.html;hb=HEAD',
                default: true,
                restricted: true,
              },
              {
                name: 'TXT in Gerrit Sync',
                slug: 'txt-in-gerrit',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=AIA/CI/infra.git;a=blob;f=download/document.txt;hb=HEAD',
                restricted: true,
              },
              {
                name: 'external link',
                external_link: 'https://www.ericsson.com/en',
                slug: 'external-link',
                restricted: true,
              },
              {
                name: 'external pdf',
                external_link: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/download/attachments/362717690/document.pdf?api=v2',
                slug: 'external-pdf',
                restricted: true,
              },
            ],
          },
        ],
        date_modified: '',
      },
    },
  },
  assemblyAuto2: {
    name: 'Assembly Creation Test',
    slug: 'assembly-creation-test',
    description: 'Assembly description',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    type: 'assembly',
    approval: 'approved',
    domain: 1,
    date_modified: '',
    product_number: '',
    report_service_bugs: '',
    adp_strategy: '',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    adp_organization: '',
    adp_realization: '',
    assembly_category: 1,
    assembly_maturity: 1,
    restricted_description: 'Some restrictions',
    inval_secret: '',
    backlog: '',
    request_service_support: '',
    approval_comment: '',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    teamMails: [
      'super-use@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        release: [],
        development: [],
        date_modified: '',
      },
      auto: {
        release: [],
        development: [],
        date_modified: '',
      },
    },
    tags: [
      'ad260e308a7943c9aa90f6cf39004d14', 'ad260e308a7943c9aa90f6cf39004d14',
    ],
    additional_information: [
      {
        category: 'tutorial',
        title: 'Tutorial Example Link Text',
        link: 'www.exampletutoriallink.com',
      },
    ],
    menu_auto: true,
    check_cpi: false,
    component_service: [],
  },
  assemblyAuto3: {
    name: 'Assembly Update Test',
    slug: 'assembly-update-test',
    description: 'Assembly description',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    type: 'assembly',
    approval: 'approved',
    domain: 1,
    date_modified: '',
    product_number: '',
    report_service_bugs: '',
    adp_strategy: '',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    assembly_category: 1,
    assembly_maturity: 1,
    restricted_description: 'Some restrictions',
    inval_secret: '',
    backlog: '',
    request_service_support: '',
    approval_comment: '',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    teamMails: [
      'super-use@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        release: [],
        development: [],
        date_modified: '',
      },
      auto: {
        release: [],
        development: [],
        date_modified: '',
      },
    },
    tags: [
      'ad260e308a7943c9aa90f6cf39004d14', 'ad260e308a7943c9aa90f6cf39004d14',
    ],
    additional_information: [
      {
        category: 'tutorial',
        title: 'Tutorial Example Link Text',
        link: 'www.exampletutoriallink.com',
      },
    ],
    menu_auto: true,
    check_cpi: false,
    component_service: [],
  },
  assemblyMin: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly Min',
    description: 'Min Assembly, to test just mandatory fields',
    check_cpi: false,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    domain: 1,
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 1,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: false,
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [],
        release: [],
        date_modified: '',
      },
    },
  },
  assemblyAutoDoc: {
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'etesuse2',
      },
    ],
    owner: 'esupuse',
    name: 'Assembly Auto Doc',
    description: 'Min Assembly, to test just mandatory fields',
    check_cpi: true,
    helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/',
    assembly_maturity: 2,
    giturl: 'https://gerrit-gamma.gic.ericsson.se/plugins/gitiles/vas-log/gs-log',
    teamMails: [
      'super-user@adp-test.com',
    ],
    type: 'assembly',
    slug: 'assembly-auto-doc',
    domain: 1,
    product_number: 'APR20132',
    mimer_version_starter: '0.0.0',
    assembly_category: 1,
    helm_chartname: 'eric-lcm-container-registry',
    inval_secret: 'abcdef',
    menu_auto: true,
    repo_urls: {
      development: `${config.mockServerUrl}mockartifactory/local/dynamic/`,
      release: `${config.mockServerUrl}mockartifactory/local/dynamic/`,
    },
    menu: {
      manual: {
        date_modified: '2020-03-04T10:50:11.942Z',
        release: [],
        development: [
          {
            name: 'Service Deployment Guide',
            slug: 'service-deployment-guide',
            external_link: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Contribution+Test+Cases',
            default: true,
          },
        ],
      },
      auto: {
        date_modified: '2020-03-04T10:50:11.942Z',
        development: [
          {
            name: 'Service Deployment Guide',
            filepath: '1.0.1/CAS_Deployment_Guide.zip',
            slug: 'service-deployment-guide',
          },
          {
            name: 'API documentation',
            filepath: '1.0.1/CAS_Deployment_Guide.zip',
            slug: 'api-documentation',
          },
          {
            name: 'Test Specification',
            filepath: '1.0.1/CAS_Deployment_Guide.zip',
            slug: 'test-specification',
          },
          {
            name: 'Inner Source README',
            filepath: '1.0.1/test.html',
            default: true,
            restricted: true,
            slug: 'inner-source-readme',
          },
          {
            name: 'An External',
            external_link: 'https://www.ericsson.se',
            restricted: true,
            slug: 'an-external',
          },
          {
            name: 'Product Revision Information (PRI)',
            filepath: '1.0.1/CAS_Deployment_Guide.zip',
            slug: 'product-revision-information-pri',
          },
        ],
        release: [
          {
            version: '3.2.1',
            documents: [
              {
                name: 'Sample 1',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                default: true,
                slug: 'sample-1',
              },
              {
                name: 'Sample 2',
                filepath: '1.0.1/test.html',
                slug: 'sample-2',
              },
              {
                name: 'An External',
                external_link: 'https://www.ericsson.se',
                restricted: true,
                slug: 'an-external',
              },
              {
                name: 'Service Overview',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'service-overview',
              },
            ],
          },
          {
            version: '1.1.1',
            documents: [
              {
                name: 'Service Deployment Guide',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'service-deployment-guide',
              },
              {
                name: 'API documentation',
                filepath: '1.0.1/test.html',
                slug: 'api-documentation',
              },
              {
                name: 'Test Specification',
                filepath: '1.0.1/test.html',
                slug: 'test-specification',
              },
            ],
          },
          {
            version: '1.0.1',
            documents: [
              {
                name: 'Sample 1',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                default: true,
                slug: 'sample-1',
              },
              {
                name: 'Sample 2',
                filepath: '1.0.1/test.html',
                slug: 'sample-2',
              },
              {
                name: 'Service Deployment Guide',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'service-deployment-guide',
              },
              {
                name: 'API documentation',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'api-documentation',
              },
              {
                name: 'Test Specification',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'test-specification',
              },
              {
                name: 'An External',
                external_link: 'https://www.ericsson.se',
                restricted: true,
                slug: 'an-external',
              },
              {
                name: 'Service Overview',
                filepath: '1.0.1/CAS_Deployment_Guide.zip',
                slug: 'service-overview',
              },
            ],
          },
        ],
      },
    },
  },
  assemblyUpdateTest4: {
    name: 'Assembly Update Test 4',
    description: 'Assembly description',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    type: 'assembly',
    approval: 'approved',
    domain: 1,
    date_modified: '',
    product_number: '',
    report_service_bugs: '',
    adp_strategy: '',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    adp_organization: '',
    adp_realization: '',
    assembly_category: 1,
    assembly_maturity: 1,
    restricted_description: 'Some restrictions',
    inval_secret: '',
    backlog: '',
    request_service_support: '',
    approval_comment: '',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    teamMails: [
      'super-use@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        release: [],
        development: [],
        date_modified: '',
      },
      auto: {
        release: [],
        development: [],
        date_modified: '',
      },
    },
    tags: [
      'ad260e308a7943c9aa90f6cf39004d14', 'ad260e308a7943c9aa90f6cf39004d14',
    ],
    additional_information: [
      {
        category: 'tutorial',
        title: 'Tutorial Example Link Text',
        link: 'www.exampletutoriallink.com',
      },
    ],
    menu_auto: true,
    check_cpi: false,
    component_service: [],
  },
  assemblyUpdateTest: {
    name: 'Assembly Update Test',
    description: 'Assembly description',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    type: 'assembly',
    approval: 'approved',
    domain: 1,
    date_modified: '',
    product_number: '',
    report_service_bugs: '',
    adp_strategy: '',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    adp_organization: '',
    adp_realization: '',
    assembly_category: 1,
    assembly_maturity: 1,
    restricted_description: 'Some restrictions',
    inval_secret: '',
    backlog: '',
    request_service_support: '',
    approval_comment: '',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    teamMails: [
      'super-use@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        release: [],
        development: [],
        date_modified: '',
      },
      auto: {
        release: [],
        development: [],
        date_modified: '',
      },
    },
    tags: [
      'ad260e308a7943c9aa90f6cf39004d14', 'ad260e308a7943c9aa90f6cf39004d14',
    ],
    additional_information: [
      {
        category: 'tutorial',
        title: 'Tutorial Example Link Text',
        link: 'www.exampletutoriallink.com',
      },
    ],
    menu_auto: true,
    check_cpi: false,
    component_service: [],
  },
  assemblyAuto4: {
    name: 'Assembly Update Test 4',
    slug: 'assembly-update-test-4',
    description: 'Assembly description',
    helmurl: 'https://arm.epk.ericsson.se/artifactory/docker-v2-global-local/aia/adp/adp-portal-e2e-test/',
    helm_chartname: 'eric-lcm-container-registry',
    type: 'assembly',
    approval: 'approved',
    domain: 1,
    date_modified: '',
    product_number: '',
    report_service_bugs: '',
    adp_strategy: '',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    assembly_category: 1,
    assembly_maturity: 1,
    restricted_description: 'Some restrictions',
    inval_secret: '',
    backlog: '',
    request_service_support: '',
    approval_comment: '',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'esupuse',
      },
    ],
    teamMails: [
      'super-use@adp-test.com',
    ],
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      manual: {
        release: [],
        development: [],
        date_modified: '',
      },
      auto: {
        release: [],
        development: [],
        date_modified: '',
      },
    },
    tags: [
      'ad260e308a7943c9aa90f6cf39004d14', 'ad260e308a7943c9aa90f6cf39004d14',
    ],
    additional_information: [
      {
        category: 'tutorial',
        title: 'Tutorial Example Link Text',
        link: 'www.exampletutoriallink.com',
      },
    ],
    menu_auto: true,
    check_cpi: false,
    component_service: [],
  },

  MS_EGS_Payload: {
    approval: 'approved',
    team: [
      {
        team_role: 1,
        serviceOwner: true,
        signum: 'eterase',
      },
    ],
    owner: 'esupuse',
    name: 'Auto MS EGS Payload',
    description: 'Test MS to test EGS Payload',
    tags: [
      '5c2941141c64cfbcea47e8b1600f3ea6',
    ],
    restricted: 7,
    domain: 3,
    serviceArea: 4,
    product_number: 'A96584344PO',
    service_maturity: 1,
    based_on: 'Ericsson Internal',
    giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
    teamMails: [
      'test-user@adp-test.com',
      'super-user@adp-test.com',
    ],
    reusability_level: 4,
    service_category: 2,
    additional_information: [
      {
        category: 'tutorial',
        title: 'My First ADP Service',
        link: 'https://seliius18473.seli.gic.ericsson.se:58090/getstarted/tutorials/overview-my-first-adp-service',
      },
      {
        category: 'demo',
        title: 'Test title for the Demo',
        link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
      },
    ],
    backlog: 'https://eteamproject.internal.ericsson.com/secure/RapidBoard.jspa?rapidView=14274&projectKey=ADPPRG&view=planning&issueLimit=100',
    repo_urls: {
      development: '',
      release: '',
    },
    menu: {
      auto: {
        development: [],
        release: [],
        date_modified: '',
        errors: {
          development: [],
          release: [],
        },
      },
      manual: {
        development: [
          {
            name: 'Other Documents',
            external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-sec/sec-vault.git;a=blob_plain;f=doc/MarketPlace_DocList/MarketPlace_DocList.txt;hb=HEAD',
            default: true,
          },
        ],
        release: [],
        date_modified: '',
      },
    },
    menu_auto: false,
    check_cpi: true,
  },

  peopleFinder_etesuse: {
    postalCode: '164 00',
    department: 'Dev&Ops Department',
    costCentre: '2800007000',
    roomNumber: '07B',
    telephone: '+46724000000',
    memberOf: null,
    info: null,
    operationalUnit: null,
    managedBy: null,
    objectCategory: 'CN=Person',
    organizationalUnitShortName: null,
    authOrig: null,
    objectClass: null,
    assistantFullName: null,
    fullName: null,
    member: null,
    email: 'test-user@adp-test.com',
    otherTelephone: null,
    city: 'Stockholm',
    organizationalUnitId: null,
    assistantPhone: null,
    street: 'Test Street 31',
    country: 'Sweden',
    distinguishedName: 'CN=etesuse',
    owner: 'etesuse',
    company: 'EAB',
    authOrigBL: null,
    mailNickname: 'etesuse',
    displayName: 'Test User',
    mobile: '+46724000000',
    ownerDisplayname: null,
    ownerSignum: null,
    memberOfList: null,
    authMembers: false,
  },

  peopleFinder_esupuse: {
    postalCode: '164 11',
    department: 'Dev&Ops Department',
    costCentre: '2800007111',
    roomNumber: '07B',
    telephone: '+46724111111',
    memberOf: null,
    info: null,
    operationalUnit: null,
    managedBy: null,
    objectCategory: 'CN=Person',
    organizationalUnitShortName: null,
    authOrig: null,
    objectClass: null,
    assistantFullName: null,
    fullName: null,
    member: null,
    email: 'super-user@adp-test.com',
    otherTelephone: null,
    city: 'Stockholm',
    organizationalUnitId: null,
    assistantPhone: null,
    street: 'Test Street 11',
    country: 'Sweden',
    distinguishedName: 'CN=esupuse',
    owner: 'etesuse',
    company: 'EAB',
    authOrigBL: null,
    mailNickname: 'esupuse',
    displayName: 'Super User',
    mobile: '+46724000000',
    ownerDisplayname: null,
    ownerSignum: null,
    memberOfList: null,
    authMembers: false,
  },

  testTopContributorsData: {
    domain: '1,2,3',
    serviceCategory: '1,2,3',
    domain1: '1,3',
    serviceCategory1: '1,3',
    invalidDomain: '8,9',
    invalidServiceCategory: '8,9',
  },
};
