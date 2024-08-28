/**
 * Unit test for [ global.adp.quickReports.AssemblyReports ]
 * @author Cein-Sven Da Costa [edaccei]
 */
describe('Testing [ global.adp.quickReports.AssemblyReports ] class', () => {
  let msGetResp;
  let assemblyReportSchemaResp;
  let assemblyReportMapHeadersResp;
  let xlsxGeneratorResp;
  beforeEach(() => {
    msGetResp = {
      resolve: true,
      data: '404',
    };

    assemblyReportSchemaResp = {
      resolve: true,
      data: {},
    };

    assemblyReportMapHeadersResp = {
      resolve: true,
      data: {},
    };

    xlsxGeneratorResp = {
      resolve: true,
    };

    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.document = {};

    global.adp.assembly = {
      read: id => new Promise((resolve, reject) => {
        if (msGetResp.resolve) {
          resolve({ _id: id });
        } else {
          reject(msGetResp.data);
        }
      }),
    };

    global.adp.quickReports = {};
    global.adp.quickReports.XlsxGenerator = class XlsxGenerator {
      constructor(fileName, sheetSlugs, xlsxHeaders, xlsxData) {
        this.fileName = fileName;
        this.sheetSlugs = sheetSlugs;
        this.xlsxHeaders = xlsxHeaders;
        this.xlsxData = xlsxData;
        this.resp = xlsxGeneratorResp;
      }

      createWorkbook() {
        return new Promise((resolve, reject) => {
          if (xlsxGeneratorResp.resolve) {
            if (this.resp.data) {
              resolve(this.resp.data);
            } else {
              resolve({
                fileName: this.fileName,
                sheetSlugs: this.sheetSlugs,
                xlsxHeaders: this.xlsxHeaders,
                xlsxData: this.xlsxData,
              });
            }
          } else {
            reject(this.resp.data);
          }
        });
      }
    };

    global.adp.quickReports.AssemblyReportSchema = class AssemblyReportSchema {
      constructor() {
        this.resp = assemblyReportSchemaResp;
      }

      getAllReportHeadingsAssembly() {
        return new Promise((resolve, reject) => {
          if (this.resp.resolve) {
            resolve(this.resp.data);
          } else {
            reject(this.resp.data);
          }
        });
      }
    };

    global.adp.quickReports.AssemblyReportMapHeaders = class AssemblyReportMapHeaders {
      constructor() {
        this.resp = assemblyReportMapHeadersResp;
      }

      mapAllHeaders() {
        return new Promise((resolve, reject) => {
          if (this.resp.resolve) {
            resolve(this.resp.data);
          } else {
            reject(this.resp.data);
          }
        });
      }
    };

    global.adp.quickReports.AssemblyReports = require('./AssemblyReports');
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('fetchDBAsset', () => {
    it('should not return duplicate assets.', async () => {
      const assets = [
        { _id: 'a' },
        { _id: 'a' },
      ];

      const reports = new global.adp.quickReports.AssemblyReports(assets, '');

      reports.fetchDBAsset().then((result) => {
        expect(result.length).toBe(1);
      }).catch(() => {
        expect(false).toBeTruthy();
      });
    });

    it('should fail if the asset is not found, with error containing the id.', (done) => {
      const testId = 'testId';
      const assets = [
        { _id: testId },
      ];

      msGetResp.resolve = false;
      const reports = new global.adp.quickReports.AssemblyReports(assets, '');


      reports.fetchDBAsset().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toContain(404);
        done();
      });
    });
  });

  describe('validateData', () => {
    it('should resolve if the correct format and correct asset structure is given.', (done) => {
      const testId = 'asd';
      const assets = [
        { _id: testId },
      ];
      const format = 'xlsx';

      const reports = new global.adp.quickReports.AssemblyReports(assets, format, '2020-01-01', '2020-01-31');
      reports.validateData().then((result) => {
        const resultAsset = result.dbAssets[0];

        expect(result.format).toBe(format);
        expect(resultAsset._id).toBe(testId);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should resolve a json format if the format is not given.', (done) => {
      const assets = [
        { _id: 'asd' },
      ];

      const reports = new global.adp.quickReports.AssemblyReports(assets);
      reports.validateData().then((result) => {
        expect(result.format).toBe('json');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should reject if the incorrect format is given.', (done) => {
      const assets = [
        { _id: 'asd' },
      ];

      const reports = new global.adp.quickReports.AssemblyReports(assets, 'not correct', '2020-01-01', '2020-01-31');
      reports.validateData().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject if the assets are empty.', (done) => {
      const reports = new global.adp.quickReports.AssemblyReports([], '');
      reports.validateData().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('prepareFetchXlsx', () => {
    it('should return the updated object keys', (done) => {
      const testobj = { test: 1 };
      const key1 = 'overview';
      const key2 = 'documentation';
      const key3 = 'team';
      const key4 = 'additional_information';
      const key5 = 'services';
      const reportObj = {};
      reportObj[key1] = testobj;
      reportObj[key2] = testobj;
      reportObj[key3] = testobj;
      reportObj[key4] = testobj;
      reportObj[key5] = testobj;

      const reports = global.adp.quickReports.AssemblyReports;
      reports.prepareFetchXlsx(reportObj).then((result) => {
        expect(result.xlsxHeaders[key1]).toBeDefined();
        expect(result.xlsxHeaders[key2]).toBeDefined();
        expect(result.xlsxHeaders[key3]).toBeDefined();
        expect(result.xlsxHeaders[key4]).toBeDefined();
        expect(result.xlsxHeaders[key5]).toBeDefined();
        expect(result.xlsxData[key1]).toBeDefined();
        expect(result.xlsxData[key2]).toBeDefined();
        expect(result.xlsxData[key3]).toBeDefined();
        expect(result.xlsxData[key4]).toBeDefined();
        expect(result.xlsxData[key5]).toBeDefined();
        expect(result.sheetSlugs.length).toBe(5);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });
  });

  describe('generate', () => {
    it('should return the report json object and format if json is requested.', (done) => {
      const testAssets = [
        { _id: '1' },
        { _id: '2' },
      ];
      const headers = {
        heading_overview: {},
        heading_documentation: {},
        heading_team: {},
        heading_additional_information: {},
        heading_services: {},
      };
      const data = {
        data_overview: [],
        data_documentation: [],
        data_team: [],
        data_additional_information: [],
        data_services: [],
      };
      const report = { ...headers, ...data };
      const format = 'json';

      assemblyReportSchemaResp.data = headers;
      assemblyReportMapHeadersResp.data = report;

      const reports = new global.adp.quickReports.AssemblyReports(testAssets, format);
      reports.generate().then((result) => {
        const { format: resultFormat, data: resultReport } = result;

        expect(resultFormat).toBe(format);
        expect(resultReport).toBeDefined();
        expect(resultReport.heading_overview).toBeDefined();
        expect(resultReport.data_overview).toBeDefined();
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should return the filePath and format if xlsx is requested.', (done) => {
      const testAssets = [
        { _id: '1' },
        { _id: '2' },
      ];
      const headers = {
        heading_overview: {},
        heading_documentation: {},
        heading_team: {},
        heading_additional_information: {},
        heading_services: {},
      };
      const data = {
        data_overview: [],
        data_documentation: [],
        data_team: [],
        data_additional_information: [],
        data_services: [],
      };
      const report = { ...headers, ...data };
      const format = 'xlsx';

      assemblyReportSchemaResp.data = headers;
      assemblyReportMapHeadersResp.data = report;
      xlsxGeneratorResp.data = 'path';

      const reports = new global.adp.quickReports.AssemblyReports(testAssets, format);
      reports.generate().then((result) => {
        const { format: resultFormat, data: xlsxFilePath } = result;

        expect(resultFormat).toBe(format);
        expect(typeof xlsxFilePath).toBe('string');
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should reject if the validation fails.', (done) => {
      const reports = new global.adp.quickReports.AssemblyReports('notCorrect', 'notCorrect');
      reports.generate().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject if the headers fails to generate.', (done) => {
      const reports = new global.adp.quickReports.AssemblyReports([{ _id: '' }], '', '2020-01-01', '2020-01-31');
      assemblyReportSchemaResp.resolve = false;

      reports.generate().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject if the header mapping fails to generate.', (done) => {
      const reports = new global.adp.quickReports.AssemblyReports([{ _id: '' }], '', '2020-01-01', '2020-01-31');
      assemblyReportMapHeadersResp.resolve = false;

      reports.generate().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });

    it('should reject if the xlsx file fails to generate.', (done) => {
      const reports = new global.adp.quickReports.AssemblyReports([{ _id: '' }], 'xlsx', '2020-01-01', '2020-01-31');
      xlsxGeneratorResp.resolve = false;
      xlsxGeneratorResp.data = 'error';

      reports.generate().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });
});
