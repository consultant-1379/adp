/**
* The Assset Report heading schema generator
* [ global.adp.quickReports.AssemblyReportSchema ]
* @author Tirth [zpiptir]
*/
global.adp.docs.list.push(__filename);

class AssemblyReportSchema {
  constructor() {
    this.packName = 'global.adp.quickReports.AssemblyReportSchema';
    this.headers = {
      heading_overview: {},
      heading_documentation: {
        service_name: 'Service Name',
        version: 'Version',
        assembly_category: 'Category',
        name: 'Document Name',
        url: 'URL',
        restricted: 'Restricted',
        default: 'Default',
        menu_auto: 'Documentation Mode',
        repo_urls_development: 'Development Repository Link',
        repo_urls_release: 'Release Repository Link',
        isCpiUpdated: 'Is CPI Updated',
      },
      heading_team: {
        service_name: 'Service Name',
        name: 'Full Name',
        email: 'Email Address',
        signum: 'Signum',
        team_role: 'Team Role',
        serviceOwner: 'Service Owner',
      },
      heading_additional_information: {
        service_name: 'Service Name',
        category: 'Category',
        title: 'Title',
        link: 'Link',
      },
      heading_services: {
        assembly_name: 'Assembly Name',
        name: 'Microservice Name',
        service_category: 'Service Category',
        domain: 'Domain',
        report_service_bugs: 'Report Service Bugs',
        request_service_support: 'Request Service Support',
        serviceArea: 'Service Area',
        based_on: 'Based On 3PP',
        description: 'Description',
        tags: 'Tags',
        product_number: 'Product Number',
        mimer_version_starter: 'Mimer Activation Version',
        reusability_level: 'Reusability Level',
        service_maturity: 'Service Maturity',
        restricted: 'Restricted',
        restricted_description: 'Restricted Description',
        helm_chartname: 'Helm Chart Name',
        helmurl: 'Helm URL',
        check_cpi: 'CPI Documentation',
        giturl: 'Git URL',
        discussion_forum_link: 'Discussion Forum',
        backlog: 'JIRA Backlog',
        team_mailers: 'Team Distribution List',
        date_modified: 'Modified Date',
        date_created: 'Created Date',
      },
    };
  }

  /**
   * Fetches the headers for the report from the schema and from the
   * Default object in the constructor
   * @returns {promise} the headers object generated by the schema
   * and the detail object
   * @author Tirth [zpiptir]
   */
  getAllReportHeadingsAssembly() {
    return new Promise((resolve, reject) => {
      global.adp.notification.buildMailSchema({ type: 'assembly' })
        .then((sortedMailSchema) => {
          if (sortedMailSchema.mailSchema) {
            sortedMailSchema.mailSchema.forEach((msSchemaObj) => {
              if (typeof msSchemaObj.report === 'string') {
                const headingType = msSchemaObj.report;
                const headingToSet = `${headingType}SetHeader`;
                if (typeof this[headingToSet] !== 'undefined') {
                  this[headingToSet](msSchemaObj);
                }
              }
            });
          }
          resolve(this.headers);
        }).catch((errorBuildingMailSchema) => {
          const errorText = 'Error in [ adp.notification.buildMailSchema ] at [ getAllReportHeadings ]';
          adp.echoLog(errorText, { error: errorBuildingMailSchema }, 500, this.packName, true);
          reject(errorBuildingMailSchema);
        });
    });
  }

  /**
   * Sets the overview headings object
   * @param {object} schemaObj the schema object generated by the buildMailSchema()
   * for objects labelled report overview
   * @author Cein
   */
  overviewSetHeader(schemaObj) {
    const fieldName = schemaObj.field_name;
    const mailName = schemaObj.mail_name;
    if (typeof fieldName === 'string' && typeof mailName === 'string') {
      if (fieldName !== 'component_service') {
        this.headers.heading_overview[fieldName] = mailName;
        if (fieldName === 'name') {
          this.headers.heading_documentation.service_name = mailName;
          // this.headers.heading_compliance.service_name = mailName;
          this.headers.heading_team.service_name = mailName;
          this.headers.heading_additional_information.service_name = mailName;
        }
      }
    }
  }

  componentServicesSetHeader(schemaObj) {
    const fieldName = schemaObj.field_name;
    const mailName = schemaObj.mail_name;
    if (typeof fieldName === 'string' && typeof mailName === 'string') {
      this.headers.heading_services[fieldName] = mailName;
      if (fieldName === 'name') {
        this.headers.heading_documentation.service_name = mailName;
        this.headers.heading_team.service_name = mailName;
        this.headers.heading_additional_information.service_name = mailName;
      }
    }
  }

  /**
   * Sets the documentation headings object
   * @param {object} schemaObj the schema object generated by the buildMailSchema()
   * for objects labelled report documentation
   * @author Cein
   */
  documentationSetHeader(schemaObj) {
    const fieldName = schemaObj.field_name;
    const mailName = schemaObj.mail_name;
    if (typeof fieldName === 'string' && typeof mailName === 'string') {
      if (fieldName === 'repo_urls') {
        schemaObj.properties.forEach((docSchemaObj) => {
          const propFieldName = docSchemaObj.field_name;
          const propMailName = docSchemaObj.mail_name;
          if (propFieldName && propMailName && (propFieldName === 'development' || propFieldName === 'release')) {
            this.headers.heading_documentation[`${fieldName}_${propFieldName}`] = propMailName;
          }
        });
      } else if (schemaObj.properties) {
        this.headers.heading_documentation[fieldName] = mailName;
      }
    }
  }

  /**
   * Sets the team headings object
   * @param {object} schemaObj the schema object generated by the buildMailSchema()
   * for objects labelled report team
   * @author Cein
   */
  teamSetHeader(schemaObj) {
    const teamItems = schemaObj.items;
    if (teamItems && teamItems.length) {
      teamItems.forEach((teamItem) => {
        const fieldName = teamItem.field_name;
        const mailName = teamItem.mail_name;
        if (typeof fieldName === 'string' && typeof mailName === 'string') {
          this.headers.heading_team[fieldName] = mailName;
        }
      });
    }
  }

  /**
   * Sets the Additional Information headings object
   * @param {object} schemaObj the schema object generated by the buildMailSchema()
   * for objects labelled report additional_information
   * @author ravikiran [zgarsri]
   */
  additionalInformationSetHeader(schemaObj) {
    const addInfoItems = schemaObj.items;
    if (addInfoItems && addInfoItems.length) {
      addInfoItems.forEach((addInfoItem) => {
        const fieldName = addInfoItem.field_name;
        const mailName = addInfoItem.mail_name;
        if (typeof fieldName === 'string' && typeof mailName === 'string') {
          this.headers.heading_additional_information[fieldName] = mailName;
        }
      });
    }
  }
}

module.exports = AssemblyReportSchema;
