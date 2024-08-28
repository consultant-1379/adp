// ============================================================================================= //
module.exports = () => {
// --------------------------------------------------------------------------------------------- //
  const adpLogs = [
    {
      _id: '45e7f4f992afe7bbb62a3391e500e0f9',
      type: 'server',
      datetime: '2019-08-15T08:33:23.648Z',
      desc: 'ADP Node.js Server - 2019.08.09.15.50 [ https://localhost:9999 ] started.',
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e500f018',
      type: 'microservice',
      datetime: '2019-07-15T08:40:19.514Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Min',
        description: 'Min Microservice to test just mandatory fields',
        restricted: 0,
        alignment: 1,
        domain: 1,
        serviceArea: 2,
        category: 3,
        service_maturity: 1,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e500e71b',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e500fa76',
      type: 'microservice',
      datetime: '2019-08-15T09:22:52.144Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        documentation: [
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 3,
            title: '',
            default: false,
            titlePosition: 2,
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS with Tags',
        description: 'Microservice containing several tags',
        restricted: 0,
        tags: [
          '49bfab89e2ab4b291d84b4dd7c026945',
          '5c2941141c64cfbcea47e8b16006111a',
          '5c2941141c64cfbcea47e8b160066b59',
          '5c2941141c64cfbcea47e8b1600f3ea6',
          'ad260e308a7943c9aa90f6cf39004d14',
        ],
        alignment: 2,
        domain: 2,
        serviceArea: 6,
        category: 2,
        service_maturity: 4,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e500f84a',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e50102ef',
      type: 'microservice',
      datetime: '2019-06-15T10:32:27.067Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
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
        documentation: [
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 1,
            title: '',
            default: false,
            titlePosition: 0,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 2,
            title: '',
            default: false,
            titlePosition: 1,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
            categoryId: 2,
            titleId: 7,
            title: '',
            default: false,
            titlePosition: 0,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 3,
            title: '',
            default: false,
            titlePosition: 2,
          },
        ],
        owner: 'esupuse',
        adp_strategy: 'Compliance',
        adp_organization: 'Organization',
        adp_realization: 'Realization',
        additional_info: 'Additional Information',
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
        restricted: 1,
        restricted_description: 'Reason to be Restricted',
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 3,
        domain: 4,
        serviceArea: 2,
        category: 1,
        service_maturity: 3,
        report_service_bugs: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display',
        request_service_support: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP',
        based_on: 'Test 3PP',
        helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-adp-gs-all-helm',
        helm_chartname: 'eric-fh-alarm-handler',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'rase-user@adp-test.com',
          'test-user@adp-test.com',
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5011991',
      type: 'microservice',
      datetime: '2019-05-15T10:44:48.559Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
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
          },
          {
            type: 1,
            name: '',
            url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Sprint+Data',
            categoryId: 2,
            titleId: 11,
            title: 'Sprint Data',
            default: false,
            titlePosition: 99,
          },
          {
            type: 1,
            name: '',
            url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/pages/viewpage.action?pageId=287053848',
            categoryId: 1,
            titleId: 6,
            title: '',
            default: false,
            titlePosition: 5,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD ',
            categoryId: 1,
            titleId: 3,
            title: '',
            default: true,
            titlePosition: 2,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD ',
            categoryId: 2,
            titleId: 7,
            title: '',
            default: false,
            titlePosition: 0,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 2,
            title: '',
            default: false,
            titlePosition: 1,
          },
          {
            type: 1,
            name: '',
            url: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
            categoryId: 1,
            titleId: 1,
            title: '',
            default: false,
            titlePosition: 0,
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS with Docs',
        description: 'Test Microservice with several gerrit documents with includes',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b16006111a',
          'ad260e308a7943c9aa90f6cf39004d14',
        ],
        alignment: 1,
        domain: 1,
        serviceArea: 3,
        category: 3,
        service_maturity: 3,
        based_on: 'Ericsson Internal',
        helmurl: 'https://arm.rnd.ki.sw.ericsson.se/artifactory/proj-adp-gs-all-helm',
        helm_chartname: 'eric-fh-alarm-handler',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5010c3b',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5011e75',
      type: 'microservice',
      datetime: '2019-08-15T10:50:04.499Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
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
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Restricted',
        description: 'Microservice with restricted Other Reason ',
        restricted: 1,
        restricted_description: 'Security Isuues',
        alignment: 1,
        domain: 1,
        serviceArea: 2,
        category: 2,
        service_maturity: 2,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5011e0d',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5012d2d',
      type: 'microservice',
      datetime: '2019-05-14T12:20:35.680Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'etesase',
          },
          {
            team_role: 2,
            serviceOwner: false,
            signum: 'etesuse',
          },
          {
            team_role: 3,
            serviceOwner: false,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Team',
        description: 'Description',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 4,
        serviceArea: 4,
        category: 1,
        service_maturity: 3,
        based_on: 'Ericsson Internal',
        helmurl: 'https://arm.epk.ericsson.se/artifactory/proj-enm-fm-helm',
        helm_chartname: 'eric-alarm-processor',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'sase-user@adp-test.com',
          'test-user@adp-test.com',
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5011ff8',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5013a15',
      type: 'microservice',
      datetime: '2019-05-13T12:21:02.875Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'owner',
          from: 'esupuse',
          to: '',
        },
        {
          fieldname: 'adp_strategy',
          to: '',
        },
        {
          fieldname: 'adp_organization',
          to: '',
        },
        {
          fieldname: 'adp_realization',
          to: '',
        },
        {
          fieldname: 'additional_info',
          to: '',
        },
        {
          fieldname: 'name',
          from: 'Auto MS Team',
          to: 'Auto MS with Team',
        },
        {
          fieldname: 'restricted_description',
          to: '',
        },
        {
          fieldname: 'report_service_bugs',
          to: '',
        },
        {
          fieldname: 'request_service_support',
          to: '',
        },
        {
          fieldname: 'approval_comment',
          to: '',
        },
      ],
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'etesase',
          },
          {
            team_role: 2,
            serviceOwner: false,
            signum: 'etesuse',
          },
          {
            team_role: 3,
            serviceOwner: false,
            signum: 'esupuse',
          },
        ],
        documentation: [],
        owner: '',
        adp_strategy: '',
        adp_organization: '',
        adp_realization: '',
        additional_info: '',
        name: 'Auto MS with Team',
        description: 'Description',
        restricted: 0,
        restricted_description: '',
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 4,
        serviceArea: 4,
        category: 1,
        service_maturity: 3,
        report_service_bugs: '',
        request_service_support: '',
        based_on: 'Ericsson Internal',
        helmurl: 'https://arm.epk.ericsson.se/artifactory/proj-enm-fm-helm',
        helm_chartname: 'eric-alarm-processor',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'sase-user@adp-test.com',
          'test-user@adp-test.com',
          'super-user@adp-test.com',
        ],
        approval_comment: '',
        _id: '45e7f4f992afe7bbb62a3391e5011ff8',
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e5011ff8',
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'etesase',
          },
          {
            team_role: 2,
            serviceOwner: false,
            signum: 'etesuse',
          },
          {
            team_role: 3,
            serviceOwner: false,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Team',
        description: 'Description',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 4,
        serviceArea: 4,
        category: 1,
        service_maturity: 3,
        based_on: 'Ericsson Internal',
        helmurl: 'https://arm.epk.ericsson.se/artifactory/proj-enm-fm-helm',
        helm_chartname: 'eric-alarm-processor',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'sase-user@adp-test.com',
          'test-user@adp-test.com',
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-team',
      },
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5014452',
      type: 'microservice',
      datetime: '2019-05-11T12:23:00.508Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS test 1',
        description: 'test MS',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 2,
        serviceArea: 2,
        category: 3,
        service_maturity: 4,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5013c25',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e50151b1',
      type: 'microservice',
      datetime: '2019-08-15T12:24:03.656Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Test 2',
        description: 'Test MS',
        restricted: 0,
        alignment: 2,
        domain: 3,
        serviceArea: 2,
        category: 3,
        service_maturity: 2,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5014a41',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5015afc',
      type: 'microservice',
      datetime: '2019-08-15T12:24:23.079Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'owner',
          from: 'esupuse',
          to: '',
        },
        {
          fieldname: 'adp_strategy',
          to: '',
        },
        {
          fieldname: 'adp_organization',
          to: '',
        },
        {
          fieldname: 'adp_realization',
          to: '',
        },
        {
          fieldname: 'additional_info',
          to: '',
        },
        {
          fieldname: 'name',
          from: 'Auto MS test 1',
          to: 'Auto MS Test 1',
        },
        {
          fieldname: 'restricted_description',
          to: '',
        },
        {
          fieldname: 'report_service_bugs',
          to: '',
        },
        {
          fieldname: 'request_service_support',
          to: '',
        },
        {
          fieldname: 'helmurl',
          to: '',
        },
        {
          fieldname: 'helm_chartname',
          to: '',
        },
        {
          fieldname: 'giturl',
          to: '',
        },
        {
          fieldname: 'approval_comment',
          to: '',
        },
      ],
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        documentation: [],
        owner: '',
        adp_strategy: '',
        adp_organization: '',
        adp_realization: '',
        additional_info: '',
        name: 'Auto MS Test 1',
        description: 'test MS',
        restricted: 0,
        restricted_description: '',
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 2,
        serviceArea: 2,
        category: 3,
        service_maturity: 4,
        report_service_bugs: '',
        request_service_support: '',
        based_on: 'Ericsson Internal',
        helmurl: '',
        helm_chartname: '',
        giturl: '',
        teamMails: [
          'super-user@adp-test.com',
        ],
        approval_comment: '',
        _id: '45e7f4f992afe7bbb62a3391e5013c25',
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e5013c25',
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS test 1',
        description: 'test MS',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 2,
        serviceArea: 2,
        category: 3,
        service_maturity: 4,
        based_on: 'Ericsson Internal',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-test-1',
      },
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5016904',
      type: 'microservice',
      datetime: '2019-08-15T12:28:19.083Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'etesuse',
          },
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        documentation: [
          {
            type: 1,
            name: '',
            url: 'https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/ADP/Contribution+Test+Cases',
            categoryId: 1,
            titleId: 2,
            title: '',
            default: false,
            titlePosition: 1,
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Test 3',
        description: 'Test MS',
        restricted: 0,
        tags: [
          '5c2941141c64cfbcea47e8b1600f3ea6',
        ],
        alignment: 1,
        domain: 1,
        serviceArea: 5,
        category: 3,
        service_maturity: 2,
        based_on: '3PP',
        teamMails: [
          'test-user@adp-test.com',
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e50160e5',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e5018134',
      type: 'microservice',
      datetime: '2019-08-15T12:30:01.089Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS Test 4',
        description: 'Description',
        restricted: 7,
        alignment: 2,
        domain: 2,
        serviceArea: 4,
        category: 3,
        service_maturity: 4,
        based_on: 'Ericsson Internal',
        giturl: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e50171e2',
      },
      old: {},
    },
    {
      _id: '45e7f4f992afe7bbb62a3391e501a31c',
      type: 'microservice',
      datetime: '2019-08-15T12:32:01.725Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'new',
      new: {
        approval: 'approved',
        team: [
          {
            team_role: 1,
            serviceOwner: true,
            signum: 'esupuse',
          },
        ],
        owner: 'esupuse',
        name: 'Auto MS test 5',
        description: 'Test MS',
        restricted: 0,
        tags: [
          'ad260e308a7943c9aa90f6cf39004d14',
          '45e7f4f992afe7bbb62a3391e50190d1',
        ],
        alignment: 2,
        domain: 6,
        serviceArea: 5,
        category: 3,
        service_maturity: 4,
        based_on: 'Party',
        teamMails: [
          'super-user@adp-test.com',
        ],
        type: 'microservice',
        _id: '45e7f4f992afe7bbb62a3391e5019b57',
      },
      old: {},
    },
    {
      _id: '3c810832dd598c9287123da66b03f548',
      type: 'permission',
      datetime: '2019-08-28T09:34:23.223Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'create',
      new: {
        'group-id': 3,
        'item-id': 1,
        admin: {
          eterase: {
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
    },
    {
      _id: '3c810832dd598c9287123da66b043582',
      type: 'permission',
      datetime: '2019-08-28T09:38:04.585Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'create',
      new: {
        'group-id': 3,
        'item-id': 2,
        admin: {
          eterase: {
            notification: [
              'delete',
            ],
          },
        },
      },
    },
    {
      _id: 'f955c1c98397d87a124fe837a600a75f',
      type: 'microservice',
      datetime: '2020-11-02T10:00:00.000Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'giturl',
          from: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
          to: '',
        },
      ],
      new: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        giturl: '',
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
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        team_mailers: [
          'adpusers@ericsson.com',
          'adpusers2@ericsson.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
    },
    {
      _id: 'f955c1c98397d87a124fe837a600b8a6',
      type: 'microservice',
      datetime: '2020-11-03T10:00:00.000Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'giturl',
          from: '',
          to: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        },
      ],
      new: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        team_mailers: [
          'adpusers@ericsson.com',
          'adpusers2@ericsson.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        giturl: '',
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
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
    },
    {
      _id: 'f955c1c98397d87a124fe837a600d176',
      type: 'microservice',
      datetime: '2020-11-04T10:00:00.000Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'giturl',
          from: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
          to: '',
        },
      ],
      new: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        giturl: '',
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
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        team_mailers: [
          'adpusers@ericsson.com',
          'adpusers2@ericsson.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
    },
    {
      _id: 'f955c1c98397d87a124fe837a600e4bc',
      type: 'microservice',
      datetime: '2020-11-04T10:30:00.000Z',
      signum: 'esupuse',
      role: 'admin',
      desc: 'update',
      changes: [
        {
          fieldname: 'giturl',
          from: '',
          to: 'https://gerrit-gamma.gic.ericsson.se/#/admin/projects/AIA/ui/adp',
        },
      ],
      new: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        team_mailers: [
          'adpusers@ericsson.com',
          'adpusers2@ericsson.com',
        ],
        type: 'microservice',
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
      old: {
        _id: '45e7f4f992afe7bbb62a3391e500ffb1',
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
        name: 'Auto MS max',
        description: 'This is a service containing maximum data',
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
        giturl: '',
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
        slug: 'auto-ms-max',
        date_modified: '2019-08-15T10:32:27.067Z',
        reusability_level: 4,
        service_category: 3,
        inval_secret: 'abcdef',
        menu_auto: false,
        repo_urls: {
          development: '',
          release: '',
        },
        menu: {
          auto: {
            development: [

            ],
            release: [

            ],
            date_modified: '',
            errors: {
              development: [

              ],
              release: [

              ],
            },
          },
          manual: {
            development: [
              {
                name: 'Service Overview',
                slug: 'service-overview',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
                default: true,
              },
              {
                name: 'Service Deployment Guide',
                slug: 'service-deployment-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-ah.git;a=blob_plain;f=doc/AH_Service_Deployment_Guide/AH_Service_Deployment_Guide.txt;hb=HEAD',
              },
              {
                name: 'Application Developers Guide',
                slug: 'application-developers-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/SNMP_Service_Developers_Guide/SNMP_Service_Developers_Guide.adoc;hb=HEAD',
              },
              {
                name: 'Troubleshooting Guide',
                slug: 'troubleshooting-guide',
                external_link: 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=PROTO-AIA/com.ericsson.aia/aia-prototype.git;a=blob_plain;f=ADP/doc/Troubleshooting_Guide/WCDCD_Troubleshooting_Guide.txt;hb=HEAD',
              },
            ],
            release: [

            ],
            date_modified: '',
          },
        },
      },
    },
  ];
  return adpLogs;
// --------------------------------------------------------------------------------------------- //
};
// ============================================================================================= //
