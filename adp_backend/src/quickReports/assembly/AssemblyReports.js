/**
 * Validates and generates assembly reports
 * [ global.adp.quickReports.AssemblyReports ]
 * @param {array} assets of objects containing the _id of the service
 * @param {string} format the returning format of the report
 * @author Tirth [zpiptir]
 */
class AssemblyReports {
  constructor(assets, format) {
    this.assets = assets;
    this.format = format;
    this.formats = ['json', 'xlsx'];
    this.packName = 'global.adp.quickReports.AssemblyReports';
  }

  /**
     * fetches each requested asset from the db
     * @returns {promise} array of fetched assets
     * @author Tirth
     */
  fetchDBAsset() {
    return new Promise((resolve, reject) => {
      const promiseArr = [];
      const duplicateCheck = {};

      this.assets.forEach((asset) => {
        if (asset._id && !duplicateCheck[asset._id]) {
          duplicateCheck[asset._id] = true;
          promiseArr.push(new Promise((assetResolve, assetReject) => {
            global.adp.assembly.read(asset._id).then((dbasset) => {
              assetResolve(dbasset);
            }).catch((errorFetchingAsset) => {
              if (errorFetchingAsset === 404) {
                const error = `Assembly by id ${asset._id} not found or not available`;
                adp.echoLog(error, null, 400, this.packName, true);
                assetReject(error);
              } else {
                adp.echoLog(errorFetchingAsset, null, 500, this.packName, true);
                assetReject(errorFetchingAsset);
              }
            });
          }));
        }
      });
      Promise.all(promiseArr).then((dbAssets) => {
        if (dbAssets.length) {
          resolve(dbAssets);
        } else {
          const error = 'Given asset are not available or invalid.';
          reject(error);
        }
      }).catch((errorFetchingAssets) => {
        reject(errorFetchingAssets);
      });
    });
  }

  /**
     * Validates if the given format and the asset list to fetch
     * @returns {promise} array database fetched assets
     * @author Tirth
     */
  validateData() {
    return new Promise((resolve, reject) => {
      const format = (typeof this.format === 'string' && this.format ? this.format : 'json').trim();

      if (this.formats.indexOf(format) === -1) {
        const error = `Report format of type ${format} is not available.`;
        adp.echoLog(error, { formats: this.formats, format }, 400, this.packName, true);
        reject(error);
      } else if (!(Array.isArray(this.assets) && this.assets.length > 0)) {
        const error = 'Parameters are empty or of incorrect form.';
        adp.echoLog(error, null, 400, this.packName, true);
        reject(error);
      } else {
        this.fetchDBAsset().then((dbAssets) => {
          resolve({ dbAssets, format });
        }).catch((errorFetchingAssets) => {
          reject(errorFetchingAssets);
        });
      }
    });
  }

  /**
     * prepares the heading and the data object names and builds the xlsx file
     * @param {object} reportObj the final report object  containing the headers and data objects
     * @returns {promise} string of the workbook file pathready for download
     * @author Cein
     */
  static prepareFetchXlsx(reportObj) {
    const fileName = '';
    const sheetNames = [
      { name: 'Overview', slug: 'overview' },
      { name: 'Documentation', slug: 'documentation' },
      { name: 'Team', slug: 'team' },
      { name: 'Additional Information', slug: 'additional_information' },
      { name: 'Services', slug: 'services' },
    ];
    const xlsxHeaders = {
      overview: (reportObj.heading_overview ? reportObj.heading_overview : {}),
      documentation: (reportObj.heading_documentation ? reportObj.heading_documentation : {}),
      team: (reportObj.heading_team ? reportObj.heading_team : {}),
      additional_information: (reportObj.heading_additional_information
        ? reportObj.heading_additional_information : {}),
      services: (reportObj.heading_services
        ? reportObj.heading_services : {}),
    };
    const xlsxData = {
      overview: (reportObj.data_overview ? reportObj.data_overview : []),
      documentation: (reportObj.data_documentation ? reportObj.data_documentation : []),
      team: (reportObj.data_team ? reportObj.data_team : []),
      additional_information: (reportObj.data_additional_information
        ? reportObj.data_additional_information : []),
      services: (reportObj.data_services || []),
    };
    const xlsxGen = new global.adp.quickReports.XlsxGenerator(
      fileName, sheetNames, xlsxHeaders, xlsxData,
    );

    return xlsxGen.createWorkbook();
  }


  /**
     * Generates the full asset report
     * @returns {promise} object - format {string} the format of the data,
     * data {object}:
     * Format xlsx - filePath {string}, fileName {string}, ext{string}.
     * Format json - a full report json object will be returned
     * @author Cein, Michael
     */
  generate() {
    return new Promise(async (resolve, reject) => {
      this.validateData().then((reqObj) => {
        const { dbAssets, format } = reqObj;
        const headerReportSchema = new global.adp.quickReports.AssemblyReportSchema();

        headerReportSchema.getAllReportHeadingsAssembly().then((reportHeaders) => {
          const ReportMapHeaders = global.adp.quickReports.AssemblyReportMapHeaders;
          const assemblyMapHeaders = new ReportMapHeaders(
            dbAssets,
            reportHeaders,
          );

          assemblyMapHeaders.mapAllHeaders().then((reportObj) => {
            if (format === 'xlsx') {
              AssemblyReports.prepareFetchXlsx(reportObj).then((xlsxFileObj) => {
                resolve({ format, data: xlsxFileObj });
              }).catch((errorCreatingworkbook) => {
                const errorObj = { error: errorCreatingworkbook, code: 500 };
                reject(errorObj);
                const errorText = 'Error in [ AssemblyReports.prepareFetchXlsx ] at [ generate ]';
                const errorOBJ = {
                  error: errorObj,
                  reportObject: reportObj,
                };
                adp.echoLog(errorText, errorOBJ, errorObj.code, this.packName, true);
              });
            } else {
              // If the report is not Excel, remove any CPI variales for In Development documents
              reportObj.data_documentation.forEach((document) => {
                if (document.version === 'In Development') {
                  // eslint-disable-next-line no-param-reassign
                  delete document.isCpiUpdated;
                }
              });

              resolve({ format, data: reportObj });
            }
          }).catch((errorMappingHeaders) => {
            const errorObj = { error: errorMappingHeaders, code: 500 };
            const errorText = 'Error in [ assemblyMapHeaders.mapAllHeaders ] at [ generate ]';
            adp.echoLog(errorText, errorObj, errorObj.code, this.packName, true);
            reject(errorObj);
          });
        }).catch((createHeadersError) => {
          const errorObj = { error: createHeadersError, code: 500 };
          const errorText = 'Error in [ headerReportSchema.getAllReportHeadingsAssembly ] at [ generate ]';
          adp.echoLog(errorText, errorObj, errorObj.code, this.packName, true);
          reject(errorObj);
        });
      }).catch((validationError) => {
        const errorObj = { error: validationError, code: 400 };
        const errorText = 'Error in [ this.validateData ] at [ generate ]';
        adp.echoLog(errorText, errorObj, errorObj.code, this.packName, true);
        reject(errorObj);
      });
    });
  }
}

module.exports = AssemblyReports;
