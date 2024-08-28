/**
* Unit test for [ global.adp.quickReports.XlsxGenerator ]
* @author Cein-Sven Da Costa [edaccei]
*/
describe('Testing [ global.adp.quickReports.XlsxGenerator ] class', () => {
  let colObj;
  let checkPathResp;
  let timestamp;
  beforeEach(() => {
    colObj = { '!cols': [] };
    checkPathResp = {
      resolve: true,
      response: '',
    };
    timestamp = '';

    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.xlsx = {
      utils: {
        book_new: () => colObj,
        sheet_add_json: (data) => {
          const result = { resultData: data };
          result['!cols'] = '';
          return result;
        },
        book_append_sheet: () => {
        },
      },
      writeFile: () => {

      },
    };

    global.adp.timeStamp = () => timestamp;

    global.adp.document = {};
    global.adp.document.checkThisPath = () => new Promise((resolve, reject) => {
      if (checkPathResp.resolve) {
        resolve(checkPathResp.response);
      } else {
        reject(checkPathResp.response);
      }
    });

    global.adp.quickReports = {};
    global.adp.quickReports.XlsxGenerator = require('./XlsxGenerator');
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('createWorkbook', () => {
    it('should return a clean file path if the path exists', (done) => {
      const header = {};
      const data = {};
      const fileName = 'testName';
      const reportPath = 'testPath';
      const reportExt = 'xlsx';
      checkPathResp.response = reportPath;

      const xlsxGen = new global.adp.quickReports.XlsxGenerator(fileName, [], header, data);

      xlsxGen.createWorkbook().then((xlsObj) => {
        expect(xlsObj.filePath).toBe(`${reportPath}/${fileName}.${reportExt}`);
        expect(xlsObj.fileName).toBe(fileName);
        expect(xlsObj.ext).toBe(reportExt);
        done();
      }).catch(() => {
        expect(false).toBeTruthy();
        done();
      });
    });

    it('should return a error if the file path is not valid', (done) => {
      checkPathResp.resolve = false;
      checkPathResp.response = 'error';

      const xlsxGen = new global.adp.quickReports.XlsxGenerator('', ['test'], {}, {});

      xlsxGen.createWorkbook().then(() => {
        expect(false).toBeTruthy();
        done();
      }).catch((error) => {
        expect(error).toBeDefined();
        done();
      });
    });
  });

  describe('createSheet', () => {
    it('should only return data when creating the sheet without headers set', () => {
      const testSheetSlug = 'testSlug';
      const testval = 'testData';
      const header = {};
      const data = {};
      data[testSheetSlug] = [testval];

      const xlsxGen = new global.adp.quickReports.XlsxGenerator('', [], header, data);
      const result = xlsxGen.createSheet(testSheetSlug);

      expect(result.resultData[0]).toBe(testval);
    });

    it('should return headers and data when creating the sheet', () => {
      const testSheetSlug = 'testSlug';
      const testHeader = 'testHeader';
      const header = {};
      const data = {};
      header[testSheetSlug] = [testHeader];

      const xlsxGen = new global.adp.quickReports.XlsxGenerator('', [], header, data);

      const result = xlsxGen.createSheet(testSheetSlug);

      expect(result.resultData[0]).toBe(testHeader);
    });
  });

  describe('sheetColumnWidth', () => {
    it('should return the min width if the given strings are shorter.', () => {
      const xlsxGen = global.adp.quickReports.XlsxGenerator;
      const testObj = { test: 'short' };

      const result = xlsxGen.sheetColumnWidth(testObj);

      expect(result[0].width).toBe(20);
    });

    it('should return the longest string length if it is larger than the min width.', () => {
      const xlsxGen = global.adp.quickReports.XlsxGenerator;
      const testObj = { test: 'longerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr' };

      const result = xlsxGen.sheetColumnWidth(testObj);

      expect(result[0].width).toBeGreaterThan(20);
    });
  });

  describe('cleanFileName', () => {
    it('should return a default name if the given name is not a string or an empty string', () => {
      const xlsxGen = global.adp.quickReports.XlsxGenerator;

      const defaultNameTest = 'test';
      timestamp = ` *()_ /\\${defaultNameTest}-+= `;

      expect(xlsxGen.cleanFileName(1)).toBe(`adpmarketplace_${defaultNameTest}`);
      expect(xlsxGen.cleanFileName()).toBe(`adpmarketplace_${defaultNameTest}`);
      expect(xlsxGen.cleanFileName('')).toBe(`adpmarketplace_${defaultNameTest}`);
    });

    it('should return the name without special characters and spaces', () => {
      const xlsxGen = global.adp.quickReports.XlsxGenerator;

      const defaultNameTest = 'test';
      const incorrectName = ` *()_ /\\${defaultNameTest}-+= `;

      expect(xlsxGen.cleanFileName(incorrectName)).toBe(defaultNameTest);
    });
  });
});
