/**
 * Validates and generates asset reports
 * [ global.adp.quickReports.AssetReports ]
 * @param {array} assets of objects containing the _id of the service
 * @param {string} format the returning format of the report
 * @author Cein
 */
class AssetReports {
  constructor(assets, format, fromDate, toDate) {
    this.assets = assets;
    this.setDateRange(fromDate, toDate);
    this.format = format;
    this.formats = ['json', 'xlsx'];
    this.packName = 'global.adp.quickReports.AssetReports';
  }

  /**
   * If we have no dates, set them to the default range
   *
   * @param {string} fromDate the start date of our range
   * @param {string} toDate the end date of our range
   *
   * @author Michael Coughlan [zmiccou]
   */
  setDateRange(fromDate, toDate) {
    if (!fromDate) {
      const NOW = new Date();
      NOW.setDate(NOW.getDate() - 30);

      const currentMonth = (NOW.getMonth() + 1).toString().padStart(2, 0);
      const currentDate = NOW.getDate().toString().padStart(2, 0);
      this.fromDate = `${NOW.getFullYear()}-${currentMonth}-${currentDate}`;
    } else {
      this.fromDate = fromDate;
    }

    if (!toDate) {
      const NOW = new Date();
      const currentMonth = (NOW.getMonth() + 1).toString().padStart(2, 0);
      const currentDate = NOW.getDate().toString().padStart(2, 0);
      this.toDate = `${NOW.getFullYear()}-${currentMonth}-${currentDate}`;
    } else {
      this.toDate = toDate;
    }
  }

  /**
   * fetches each requested asset from the db
   * @returns {promise} array of fetched assets
   * @author Cein
   */
  fetchDBAsset() {
    return new Promise((resolve, reject) => {
      const promiseArr = [];
      const duplicateCheck = {};

      this.assets.forEach((asset) => {
        if (asset._id && !duplicateCheck[asset._id]) {
          duplicateCheck[asset._id] = true;
          promiseArr.push(new Promise((assetResolve, assetReject) => {
            global.adp.microservice.read(asset._id).then((dbasset) => {
              assetResolve(dbasset);
            }).catch((errorFetchingAsset) => {
              if (errorFetchingAsset === 404) {
                const error = `Microservice by id ${asset._id} not found or not available`;
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
   * @author Cein
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
      { name: 'Compliance', slug: 'compliance' },
      { name: 'Team', slug: 'team' },
      { name: 'Additional Information', slug: 'additional_information' },
      { name: 'Contributors', slug: 'contributors' },
    ];
    const xlsxHeaders = {
      overview: (reportObj.heading_overview ? reportObj.heading_overview : {}),
      documentation: (reportObj.heading_documentation ? reportObj.heading_documentation : {}),
      compliance: (reportObj.heading_compliance ? reportObj.heading_compliance : {}),
      team: (reportObj.heading_team ? reportObj.heading_team : {}),
      additional_information: (reportObj.heading_additional_information
        ? reportObj.heading_additional_information : {}),
      contributors: (reportObj.heading_contributors || {}),
    };
    const xlsxData = {
      overview: (reportObj.data_overview ? reportObj.data_overview : []),
      documentation: (reportObj.data_documentation ? reportObj.data_documentation : []),
      compliance: (reportObj.data_compliance ? reportObj.data_compliance : []),
      team: (reportObj.data_team ? reportObj.data_team : []),
      additional_information: (reportObj.data_additional_information
        ? reportObj.data_additional_information : []),
      contributors: (reportObj.data_contributors || {}),
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
        const headerReportSchema = new global.adp.quickReports.AssetReportSchema();

        headerReportSchema.getAllReportHeadings().then((reportHeaders) => {
          const ReportMapHeaders = global.adp.quickReports.AssetReportMapHeaders;
          const assetMapHeaders = new ReportMapHeaders(
            dbAssets,
            reportHeaders,
            this.fromDate,
            this.toDate,
          );

          assetMapHeaders.mapAllHeaders().then((reportObj) => {
            if (format === 'xlsx') {
              AssetReports.prepareFetchXlsx(reportObj).then((xlsxFileObj) => {
                resolve({ format, data: xlsxFileObj });
              }).catch((errorCreatingworkbook) => {
                const errorObj = { error: errorCreatingworkbook, code: 500 };
                reject(errorObj);
                const errorText = 'Error in [ AssetReports.prepareFetchXlsx ] at [ generate ]';
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
            const errorText = 'Error in [ assetMapHeaders.mapAllHeaders ] at [ generate ]';
            adp.echoLog(errorText, errorObj, errorObj.code, this.packName, true);
            reject(errorObj);
          });
        }).catch((createHeadersError) => {
          const errorObj = { error: createHeadersError, code: 500 };
          const errorText = 'Error in [ headerReportSchema.getAllReportHeadings ] at [ generate ]';
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


module.exports = AssetReports;
