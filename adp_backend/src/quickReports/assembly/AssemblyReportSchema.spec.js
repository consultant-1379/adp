// ============================================================================================= //
/**
* Unit test for [ global.adp.quickReports.AssemblyReportSchema ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const AssemblyReportSchemaClass = require('./AssemblyReportSchema');

describe('Testing [ global.adp.quickReports.assemblyReportSchema ] class', () => {
  let errorOnBuildMailSchema = false;
  let assemblyReportSchema;
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
  const schemaObjServices = [
    {
      field_name: 'name',
      type: 'string',
      report: 'services',
    },
    {
      description: 'Field 1',
      field_name: 'name',
      type: 'string',
      report: 'services',
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
    assemblyReportSchema = new AssemblyReportSchemaClass();
  });

  afterAll(() => {
    assemblyReportSchema = null;
    global.adp = null;
  });

  describe('getAllReportHeadingsAssembly', () => {
    it('should get all report headings', () => {
      assemblyReportSchema.getAllReportHeadingsAssembly().then((HEADINGS) => {
        expect(HEADINGS).toBeDefined();
        expect(HEADINGS.heading_overview).toBeDefined();
        expect(HEADINGS.heading_documentation).toBeDefined();
        expect(HEADINGS.heading_team).toBeDefined();
        expect(HEADINGS.heading_additional_information).toBeDefined();
        expect(HEADINGS.heading_services).toBeDefined();
      })
        .catch(() => {
          expect(true).toBeFalsy();
        });
    });

    it('should reject if these is error fetching sorted build schema', () => {
      errorOnBuildMailSchema = true;
      assemblyReportSchema.getAllReportHeadingsAssembly().then(() => {
        expect(true).toBeFalsy();
      })
        .catch(() => {
          expect(true).toBeTruthy();
        });
    });
  });

  describe('overviewSetHeader', () => {
    it('should set the overview headings object', () => {
      assemblyReportSchema.overviewSetHeader(schemaObjOverview[0]);

      expect(assemblyReportSchema.headers.heading_overview).toBeDefined();
      expect(assemblyReportSchema.headers.heading_overview.name).toEqual('Field 3');
    });
  });

  describe('servicesSetHeader', () => {
    it('should set the services headings object', () => {
      assemblyReportSchema.overviewSetHeader(schemaObjServices[0]);

      expect(assemblyReportSchema.headers.heading_services).toBeDefined();
      expect(assemblyReportSchema.headers.heading_services.assembly_name).toEqual('Assembly Name');
      expect(assemblyReportSchema.headers.heading_services.name).toEqual('Microservice Name');
    });
  });

  describe('documentationSetHeader', () => {
    it('should set the documentation headings object for repo_urls', () => {
      assemblyReportSchema.documentationSetHeader(schemaObjDocumentation[0]);

      expect(assemblyReportSchema.headers.heading_documentation).toBeDefined();
      expect(assemblyReportSchema.headers.heading_documentation.repo_urls_development).toEqual('Development Repository Link');
      expect(assemblyReportSchema.headers.heading_documentation.repo_urls_release).toEqual('Release Repository Link');
    });

    it('should set the documentation headings object other than repo_urls', () => {
      assemblyReportSchema.documentationSetHeader(schemaObjDocumentation[1]);

      expect(assemblyReportSchema.headers.heading_documentation).toBeDefined();
      expect(assemblyReportSchema.headers.heading_documentation.field_2).toEqual('Field 2');
    });
  });

  describe('teamSetHeader', () => {
    it('should set the teams headings object', () => {
      assemblyReportSchema.teamSetHeader(schemaObjTeams);

      expect(assemblyReportSchema.headers.heading_team).toBeDefined();
      expect(assemblyReportSchema.headers.heading_team.team_role).toEqual('Team Role');
    });
  });

  describe('additionalInformationSetHeader', () => {
    it('should set the additional information headings object', () => {
      assemblyReportSchema.additionalInformationSetHeader(schemaObjAdditionalInformation);

      expect(assemblyReportSchema.headers.heading_additional_information).toBeDefined();
      expect(assemblyReportSchema.headers.heading_additional_information.category).toEqual('Category');
      expect(assemblyReportSchema.headers.heading_additional_information.title).toEqual('Title');
      expect(assemblyReportSchema.headers.heading_additional_information.link).toEqual('Link');
    });
  });
});
// ============================================================================================= //
