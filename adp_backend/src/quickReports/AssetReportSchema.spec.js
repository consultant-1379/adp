// ============================================================================================= //
/**
* Unit test for [ global.adp.quickReports.AssetReportSchema ]
* @author Omkar Sadegaonkar [zsdgmkr]
*/
// ============================================================================================= //
const AssetReportSchemaClass = require('./AssetReportSchema');

describe('Testing [ global.adp.quickReports.AssetReportSchema ] class', () => {
  let errorOnBuildMailSchema = false;
  let assetReportSchema;
  const schemaObjCompliance = {
    items: [
      {
        fieldName: 'fields',
        mailName: 'Fields',
      },
    ],
  };
  const schemaObjTeams = {
    items: [
      {
        field_name: 'team_member',
        mail_name: 'Team Member',
      },
    ],
  };
  const schemaObjAdditionalInformation = {
    items: [
      {
        field_name: 'fields',
        mail_name: 'Fields',
      },
    ],
  };
  const schemaObjContributors = {
    items: [
      {
        field_name: 'user_name',
        mail_name: 'Author',
      },
    ],
  };
  const schemaObjOverview = [
    {
      field_name: 'name',
      type: 'string',
      mail_name: 'Field 3',
      mail_order: 16,
      report: 'overview',
    },
    {
      description: 'Field 1',
      field_name: 'name',
      type: 'string',
      mail_name: 'Field 1',
      mail_order: 16,
      report: 'overview',
    },
  ];
  const schemaObjDocumentation = [
    {
      field_name: 'repo_urls',
      type: 'object',
      mail_order: 1,
      mail_name: 'Repository Links',
      report: 'documentation',
      properties: [
        {
          field_name: 'development',
          description: 'The artifactory link for the development repo',
          type: 'string',
          mail_name: 'Development Repository Link',
          mail_order: 1,
        },
        {
          field_name: 'release',
          description: 'The artifactory link for the release repo',
          type: 'string',
          mail_name: 'Release Repository Link',
          mail_order: 2,
        },
      ],
    },
    {
      field_name: 'field_2',
      description: 'Field 2',
      type: 'boolean',
      mail_order: 2,
      mail_name: 'Field 2',
      report: 'documentation',
      properties: [],
    },
  ];
  const mailSchemaResp = {
    mailSchema: [
      schemaObjOverview[0],
      schemaObjOverview[1],
      schemaObjDocumentation[0],
      schemaObjDocumentation[1],
    ],
  };
  beforeAll(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.notification = {};
    global.adp.notification.buildMailSchema = () => new Promise((RES, REJ) => {
      if (errorOnBuildMailSchema) {
        REJ();
      }
      RES(mailSchemaResp);
    });
  });

  beforeEach(() => {
    assetReportSchema = new AssetReportSchemaClass();
  });

  afterAll(() => {
    assetReportSchema = null;
    global.adp = null;
  });

  describe('getAllReportHeadings', () => {
    it('should get all report headings', () => {
      assetReportSchema.getAllReportHeadings().then((HEADINGS) => {
        expect(HEADINGS).toBeDefined();
        expect(HEADINGS.heading_overview).toBeDefined();
        expect(HEADINGS.heading_documentation).toBeDefined();
        expect(HEADINGS.heading_compliance).toBeDefined();
        expect(HEADINGS.heading_team).toBeDefined();
        expect(HEADINGS.heading_additional_information).toBeDefined();
      })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should reject if these is error fetching sorted build schema', () => {
      errorOnBuildMailSchema = true;
      assetReportSchema.getAllReportHeadings().then(() => {
        expect(true).toBeFalsy();
      })
        .catch(() => {
          expect(true).toBeTruthy();
        });
    });
  });

  describe('overviewSetHeader', () => {
    it('should set the overview headings object', () => {
      assetReportSchema.overviewSetHeader(schemaObjOverview[0]);

      expect(assetReportSchema.headers.heading_overview).toBeDefined();
      expect(assetReportSchema.headers.heading_overview.name).toEqual('Field 3');
    });
  });

  describe('documentationSetHeader', () => {
    it('should set the documentation headings object for repo_urls', () => {
      assetReportSchema.documentationSetHeader(schemaObjDocumentation[0]);

      expect(assetReportSchema.headers.heading_documentation).toBeDefined();
      expect(assetReportSchema.headers.heading_documentation.repo_urls_development).toEqual('Development Repository Link');
      expect(assetReportSchema.headers.heading_documentation.repo_urls_release).toEqual('Release Repository Link');
    });

    it('should set the documentation headings object other than repo_urls', () => {
      assetReportSchema.documentationSetHeader(schemaObjDocumentation[1]);

      expect(assetReportSchema.headers.heading_documentation).toBeDefined();
      expect(assetReportSchema.headers.heading_documentation.field_2).toEqual('Field 2');
    });
  });

  describe('complianceSetHeader', () => {
    it('should set the compliance headings object', () => {
      assetReportSchema.complianceSetHeader(schemaObjCompliance);

      expect(assetReportSchema.headers.heading_compliance).toBeDefined();
      expect(assetReportSchema.headers.heading_compliance.fields).toEqual('Fields');
    });
  });

  describe('teamSetHeader', () => {
    it('should set the teams headings object', () => {
      assetReportSchema.teamSetHeader(schemaObjTeams);

      expect(assetReportSchema.headers.heading_team).toBeDefined();
      expect(assetReportSchema.headers.heading_team.team_role).toEqual('Team Role');
    });
  });

  describe('additionalInformationSetHeader', () => {
    it('should set the additional information headings object', () => {
      assetReportSchema.additionalInformationSetHeader(schemaObjAdditionalInformation);

      expect(assetReportSchema.headers.heading_additional_information).toBeDefined();
      expect(assetReportSchema.headers.heading_additional_information.category).toEqual('Category');
      expect(assetReportSchema.headers.heading_additional_information.title).toEqual('Title');
      expect(assetReportSchema.headers.heading_additional_information.link).toEqual('Link');
    });
  });

  describe('contributorsSetHeader', () => {
    it('should set the contributors headings object', () => {
      assetReportSchema.contributorsSetHeader(schemaObjContributors);

      expect(assetReportSchema.headers.heading_contributors).toBeDefined();
      expect(assetReportSchema.headers.heading_contributors.user_name).toEqual('Author');
    });
  });
});
// ============================================================================================= //
