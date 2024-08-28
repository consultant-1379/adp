// ============================================================================================= //
/**
* Unit test for [ adp.mimer.MimerTranslation ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
  async update() {
    return new Promise((RES) => {
      if (adp.mockBehavior.update === false) {
        const obj = { ok: false };
        RES(obj);
      } else {
        const obj = { ok: true };
        RES(obj);
      }
    });
  }

  getAssetSlugAndNameUsingID() {
    const obj = {
      docs: [
        {
          _id: 'mockMicroserviceID',
          name: 'Mock Microservice',
          slug: 'mock-microservice',
          product_number: 'ADPMimerProductNumber',
        },
      ],
    };
    return new Promise(RES => RES(obj));
  }


  getOneById(ID) {
    if (adp.mockBehavior.getOneById === false) {
      const mockError = {
        code: 500,
        message: 'MockError',
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    let obj;
    switch (ID) {
      case 'mockMicroserviceNotFound':
        obj = {
          docs: [],
        };
        return new Promise(RES => RES(obj));
      case 'mimer_menu_in_progress_only':
        obj = {
          docs: [
            {
              _id: 'mockMicroserviceID',
              slug: 'mock-microservice-slug',
              product_number: 'ADPMimerProductNumber',
              mimer_menu_in_progress: {
                '8.3.1': {
                  versionLabel: '8.3.1',
                  'release-documents': [
                    {
                      name: '15283-APR20131/7-6',
                      slug: '15283-apr201317-6',
                      external_link: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      default: false,
                      url: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      doc_route: [
                        '/marketplace',
                        'auto-ms-max',
                        'documentation',
                        '8.3.1',
                        'release-documents',
                        '15283-apr201317-6',
                      ],
                      doc_link: 'https://localhost:9999/document/auto-ms-max/8.3.1/release-documents/15283-apr201317-6',
                      doc_mode: 'download',
                      category_name: 'Release Documents',
                      category_slug: 'release-documents',
                      titlePosition: 0,
                      data_retrieved_at: '2022-05-13T12:57:10.351Z',
                    },
                  ],
                },
              },
            },
          ],
        };
        return new Promise(RES => RES(obj));
      case 'mimer_menu_with_inProgress_and_mimer_menu':
        obj = {
          docs: [
            {
              _id: 'mockMicroserviceID',
              slug: 'mock-microservice-slug',
              name: 'Mock Microservice',
              product_number: 'ADPMimerProductNumber',
              mimer_menu: {
                '8.3.0': {
                  versionLabel: '8.3.0',
                  'release-documents': [
                    {
                      name: '15283-APR20131/7-6',
                      slug: '15283-apr201317-6',
                      external_link: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      default: false,
                      url: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      doc_route: [
                        '/marketplace',
                        'auto-ms-max',
                        'documentation',
                        '8.3.0',
                        'release-documents',
                        '15283-apr201317-6',
                      ],
                      doc_link: 'https://localhost:9999/document/auto-ms-max/8.3.0/release-documents/15283-apr201317-6',
                      doc_mode: 'download',
                      category_name: 'Release Documents',
                      category_slug: 'release-documents',
                      titlePosition: 0,
                      data_retrieved_at: '2022-05-13T12:57:10.351Z',
                    },
                  ],
                },
              },
              mimer_menu_in_progress: {
                '8.3.1': {
                  versionLabel: '8.3.1',
                  'release-documents': [
                    {
                      name: '15283-APR20131/7-6',
                      slug: '15283-apr201317-6',
                      external_link: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      default: false,
                      url: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                      doc_route: [
                        '/marketplace',
                        'auto-ms-max',
                        'documentation',
                        '8.3.1',
                        'release-documents',
                        '15283-apr201317-6',
                      ],
                      doc_link: 'https://localhost:9999/document/auto-ms-max/8.3.1/release-documents/15283-apr201317-6',
                      doc_mode: 'download',
                      category_name: 'Release Documents',
                      category_slug: 'release-documents',
                      titlePosition: 0,
                      data_retrieved_at: '2022-05-13T12:57:10.351Z',
                    },
                  ],
                },
              },
            },
          ],
        };
        return new Promise(RES => RES(obj));
      default:
        obj = {
          error: 'MockError',
        };
        return new Promise((RES, REJ) => REJ(obj));
    }
  }
}

class MockAssetDocuments {
  getMenuVersions() {
    return new Promise(RES => RES(['8.3.0']));
  }

  hardDeleteInvalidVersionsFromDatabase() {
    return new Promise(RES => RES());
  }

  saveThisSpecificDocument() {
    return new Promise(RES => RES({ ok: true }));
  }

  getSpecificDocument() {
    const obj = {
      name: '10921-APR20131/7-5',
      slug: '10921-apr201317-5',
      mimer_source: true,
      mimer_document_number: '10921-APR20131/7-5',
      language: 'Uen',
      revision: 'A',
      external_link: 'http://localhost:1080/eridocpublicserver/Download?DocNo=10921-APR20131/7-5&Lang=EN&Rev=A',
      physical_file_name: null,
      physical_file_extension: null,
      physical_file_status: null,
      default: false,
      restricted: true,
      url: 'http://localhost:1080/eridocserver/d2rest/repositories/eridoca/eridocument/download?number-part=10921-APR20131%2F7-5Uen&revision=A',
      doc_route: [
        '/marketplace',
        'auto-ms-max-mimer-edition',
        'documentation',
        '8.3.0',
        'release-documents',
        '10921-apr201317-5',
      ],
      doc_link: 'https://localhost:9999/document/auto-ms-max-mimer-edition/8.3.0/release-documents/10921-apr201317-5',
      doc_mode: 'newtab',
      category_name: 'Release Documents',
      category_slug: 'release-documents',
      titlePosition: 0,
      data_retrieved_at: '2023-04-27T13:49:23.159Z',
    };
    return new Promise(RES => RES(obj));
  }
}

class MockPrimeDDTable {
  getAll() {
    if (adp.mockBehavior.getAll === false) {
      const mockError = {
        code: 404,
        message: 'MockError from getAll',
      };
      return new Promise((RES, REJ) => {
        REJ(mockError);
      });
    }
    const obj = {
      docs: [
        {
          _id: '2twrsfdghy46758itfyhj',
          name: 'API Specification',
          slug: 'api-specification',
          decimalClass: '15519',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
          ],
        },
        {
          _id: 'rtsdfgcyg8u809po8erysdtfyguhi',
          name: 'Application Developers Guide',
          slug: 'application-developers-guide',
          decimalClass: '19817',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
            {
              format: 'Word/PDF',
              mode: 'External Link',
              type: ['docx', 'doc', 'pdf'],
              render: false,
              newtab: false,
              download: true,
              restricted: false,
            },
          ],
        },
        {
          _id: '4567809dtfghi786475yhbdsgfh567i8',
          name: 'Characteristics Summary Report',
          slug: 'characteristics-summary-report',
          decimalClass: '15283',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
          ],
        },
        {
          _id: '6755rdsdfg89578656wsrxcghk3',
          name: 'PRI',
          slug: 'pri',
          decimalClass: '10921',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
            {
              format: 'Word/PDF',
              mode: 'External Link',
              type: ['docx', 'doc', 'pdf'],
              render: false,
              newtab: false,
              download: true,
              restricted: false,
            },
          ],
        },
        {
          _id: '09876aesdgh13254edtfygh09oihjl0',
          name: 'Risk Assessment & Privacy Impact Assessment',
          slug: 'risk-assessment-privacy-impact-assessment',
          decimalClass: '00664',
          doc: [
            {
              format: 'Word',
              mode: 'External Link',
              type: ['docx', 'doc'],
              render: false,
              newtab: true,
              download: false,
              restricted: true,
            },
          ],
        },
        {
          _id: '9yuitdzcvhb2tyghjkj87',
          name: 'Secure Coding Report',
          slug: 'secure-coding-report',
          decimalClass: '0360',
          doc: [
            {
              format: 'Word',
              mode: 'External Link',
              type: ['docx', 'doc'],
              render: false,
              newtab: true,
              download: false,
              restricted: true,
            },
          ],
        },
        {
          _id: '3e6dytfghjjophvg8790',
          name: 'Security Tool Scan Report',
          slug: 'security-tool-scan-report',
          decimalClass: '15283',
          doc: [
            {
              format: 'TAR/ZIP',
              mode: 'External Link',
              type: ['tar', 'zip'],
              render: false,
              newtab: true,
              download: false,
              restricted: true,
            },
          ],
        },
        {
          _id: '9iuwrsdfghij235fvjlk6y3',
          name: 'Test/Verification Report',
          slug: 'test-verification-report',
          decimalClass: '15283',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
            {
              format: 'Word/PDF',
              mode: 'External Link',
              type: ['docx', 'doc', 'pdf'],
              render: false,
              newtab: false,
              download: true,
              restricted: false,
            },
          ],
        },
        {
          _id: '5678o9trdsxcvblkn434uykln9',
          name: 'Test Specification',
          slug: 'test-specification',
          decimalClass: '15241',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
            {
              format: 'Word/PDF',
              mode: 'External Link',
              type: ['docx', 'doc', 'pdf'],
              render: false,
              newtab: false,
              download: true,
              restricted: false,
            },
          ],
        },
        {
          _id: '7865edfgnmgw32whlklk09jgf2',
          name: 'User Guide',
          slug: 'user-guide',
          decimalClass: '1553',
          doc: [
            {
              format: 'Zipped HTML',
              mode: 'Direct rendering',
              type: ['html', 'zip'],
              render: true,
              newtab: false,
              download: false,
              restricted: false,
            },
            {
              format: 'Word/PDF',
              mode: 'External Link',
              type: ['docx', 'doc', 'pdf'],
              render: false,
              newtab: false,
              download: true,
              restricted: false,
            },
          ],
        },
        {
          _id: '346yudfgvbnoiuytdf0yugbnk5',
          name: 'Vulnerability Analysis Report',
          slug: 'vulnerability-analysis-report',
          decimalClass: '1597',
          doc: [
            {
              format: 'Markdown',
              mode: 'External Link',
              type: ['md', 'markdown'],
              render: false,
              newtab: true,
              download: false,
              restricted: true,
            },
          ],
        },
      ],
    };
    return new Promise(RES => RES(obj));
  }
}

class MockFastXMLParser {
  parse() {
    let obj;
    if (adp.mockBehavior.multipleDecimalClass) {
      obj = {
        Document: {
          DocumentName: 'MockDocumentName',
          DecimalClass: 15283,
          DecimalClassPrefix: '15283',
          DocumentNumber: 'Mocked15283-APR20131/7-6',
          DescriptionDisplayAttribute: 'MockDocumentName',
          LanguageIssue: {
            DocumentStatus: 'FREE',
            DocumentStatusChangeDate: '17-07-2023',
          },
        },
      };
    } else {
      obj = {
        Document: {
          DocumentName: 'MockDocumentName',
          DecimalClass: 1553,
          DecimalClassPrefix: '1553',
          DocumentNumber: 'Mocked15283-APR20131/7-6',
          DescriptionDisplayAttribute: 'MockDocumentName',
          LanguageIssue: {
            DocumentStatus: '',
            DocumentStatusChangeDate: '15-07-2023',
          },
        },
      };
    }


    return obj;
  }
}
// ============================================================================================= //
describe('Testing [ adp.mimer.MimerTranslation ] Behavior.', () => {
  let mockRequestGet;
  let mockRequestHead;
  let mockErrorLog;
  beforeEach(() => {
    mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp = {};
    adp.mockBehavior = {
      adpQueueAddJobs: true,
      getOneById: true,
      getProduct: true,
      getProductAnswer: 0,
      update: true,
      getAll: true,
      multipleDecimalClass: true,
    };
    adp.config = {};
    adp.config.primDDServer = 'mockPrimeDDServer';
    adp.config.eadpusersPassword = 'mockeadoUsersPassword';
    adp.clone = OBJ => OBJ;
    global.adp.slugIt = arg => arg;

    global.FastXmlParser = {};
    global.FastXmlParser.XMLParser = MockFastXMLParser;

    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.models.PrimeDDTable = MockPrimeDDTable;
    adp.models.AssetDocuments = MockAssetDocuments;
    adp.echoLog = ERRORCODE => ERRORCODE;
    mockRequestGet = {
      throw: false,
      data: {
        error: null,
        res: { statusCode: 200 },
        body: '',
      },
      errorData: {
        error: {
          statusCode: 500,
          message: 'Error in global.request.get',
        },
        res: '',
        body: '',
      },
    };
    mockRequestHead = {
      throw: false,
      data: {
        error: null,
        res: {
          statusCode: 200,
          headers: { 'content-disposition': "somecontent/with/back'/''slash/mocked/for/html" },
        },
        body: '',
      },
      data403: {
        error: null,
        res: { statusCode: 403 },
      },
    };

    global.request = {};
    global.request.get = (header, callback) => {
      if (mockRequestGet.throw) {
        const { error, res, body } = mockRequestGet.errorData;
        return callback(error, res, body);
      }
      const { error, res, body } = mockRequestGet.data;
      return callback(error, res, body);
    };
    global.request.head = (header, callback) => {
      if (mockRequestHead.throw === false) {
        const { error, res } = mockRequestGet.errorData;
        error.message = 'Error in global.request.head';
        return callback(error, res);
      } if (mockRequestHead.throw === 403) {
        const { error, res } = mockRequestHead.data403;
        return callback(error, res);
      }
      const { error, res, body } = mockRequestHead.data;
      return callback(error, res, body);
    };

    adp.mimer = {};
    adp.mimer.MimerTranslation = proxyquire('./MimerTranslation', {
      './../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Successful case when mimer DocumentStatus is Free', (done) => {
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';
    mockRequestHead.throw = true;

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then((RES) => {
        expect(RES).toBeDefined();
        expect(RES.tableReference.length).toBe(3);
        expect(RES.document.doc_link.endsWith('MockDocumentName')).toBeTruthy();
        expect(RES.document.approval_date).toBeDefined();
        expect(RES.document.approval_date).toBe('17-07-2023');
        done();
      })
      .catch((ERROR) => {
        done.fail(ERROR);
      });
  });

  it('Successful case when mimer_menu_in_progress has document and has multiple decimal class', (done) => {
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';
    mockRequestHead.throw = true;

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then((RES) => {
        expect(RES).toBeDefined();
        expect(RES.tableReference.length).toBe(3);
        expect(RES.document.doc_link.endsWith('MockDocumentName')).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        done.fail(ERROR);
      });
  });

  it('Successful case when mimer_menu_in_progress and only is single decimal class', (done) => {
    adp.mockBehavior.multipleDecimalClass = false;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';
    mockRequestHead.throw = true;

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then((RES) => {
        expect(RES).toBeDefined();
        expect(RES.tableReference.length).toBe(1);
        expect(RES.document.doc_link.endsWith('MockDocumentName')).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        done.fail(ERROR);
      });
  });

  it('Successful case when _documentHeader sends 403', (done) => {
    mockRequestHead.throw = 403;
    adp.mockBehavior.multipleDecimalClass = false;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then((RES) => {
        expect(RES).toBeDefined();
        expect(RES.tableReference.length).toBe(1);
        expect(RES.document.doc_link.includes('10921-APR20131/7-5')).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when mimer_menu_in_progress and language is en', (done) => {
    adp.mockBehavior.multipleDecimalClass = false;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'en';
    const docVersion = '8.3.1';
    mockRequestHead.throw = true;

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then((RES) => {
        expect(RES).toBeDefined();
        expect(RES.tableReference.length).toBe(1);
        expect(RES.document.doc_link.endsWith('MockDocumentName')).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Should set the correct document names from title type 1 prim-dd response', () => {
    const translation = new adp.mimer.MimerTranslation();
    const primDD = {
      Document: {
        DescriptionDisplayAttribute: 'CIS-CAT Scan Sepia report for Catfacts Text Analyzer 2.400.1',
        DocumentNumber: '2/15283-APR20130/2-247',
        DecimalClass: 664,
        DecimalClassPrefix: 1,
      },
    };

    const docId = 'x';
    const serviceName = 'Catfacts Text Analyzer';
    const serviceVersion = '2.400.1';

    const response = translation.extractDocumentName(primDD, docId, serviceName, serviceVersion);
    const expectedName = 'CIS-CAT Scan Sepia Report';

    expect(response.documentName).toEqual(expectedName);
  });

  it('Should set the correct document names from title type 2 prim-dd response', () => {
    const translation = new adp.mimer.MimerTranslation();
    const primDD = {
      Document: {
        DescriptionDisplayAttribute: 'Catfacts Text Analyzer 2.400.1 PRI Characteristics Summary Report',
        DocumentNumber: '2/15283-APR20130/2-247',
        DecimalClass: 664,
        DecimalClassPrefix: 1,
      },
    };

    const docId = 'x';
    const serviceName = 'Catfacts Text Analyzer';
    const serviceVersion = '2.400.1';

    const response = translation.extractDocumentName(primDD, docId, serviceName, serviceVersion);
    const expectedName = 'PRI Characteristics Summary Report';

    expect(response.documentName).toEqual(expectedName);
  });

  it('Should set the correct document names from title type 3 prim-dd response', () => {
    const translation = new adp.mimer.MimerTranslation();
    const primDD = {
      Document: {
        DescriptionDisplayAttribute: 'Catfacts Text Analyzer, PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)',
        DocumentNumber: '1/00664-APR 201 30/2',
        DecimalClass: 664,
        DecimalClassPrefix: 1,
      },
    };
    const docId = 'x';
    const serviceName = 'Catfacts Text Analyzer';
    const serviceVersion = '2.400.1';

    const response = translation.extractDocumentName(primDD, docId, serviceName, serviceVersion);
    const expectedName = 'PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)';

    expect(response.documentName).toEqual(expectedName);
  });

  it('Should set the correct document names from title type 4 prim-dd response', () => {
    const translation = new adp.mimer.MimerTranslation();
    const primDD = {
      Document: {
        DescriptionDisplayAttribute: 'Catfacts Text Analyzer PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)',
        DocumentNumber: '1/00664-APR 201 30/2',
        DecimalClass: 664,
        DecimalClassPrefix: 1,
      },
    };
    const docId = 'x';
    const serviceName = 'Catfacts Text Analyzer';
    const serviceVersion = '2.400.1';

    const response = translation.extractDocumentName(primDD, docId, serviceName, serviceVersion);
    const expectedName = 'PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)';

    expect(response.documentName).toEqual(expectedName);
  });

  it('Should set the correct document names from title type missed prim-dd response', () => {
    const translation = new adp.mimer.MimerTranslation();
    const primDD = {
      Document: {
        DescriptionDisplayAttribute: 'Missed PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)',
        DocumentNumber: '1/00664-APR 201 30/2',
        DecimalClass: 664,
        DecimalClassPrefix: 1,
      },
    };
    const docId = 'x';
    const serviceName = 'Catfacts Text Analyzer';
    const serviceVersion = '2.400.1';

    const response = translation.extractDocumentName(primDD, docId, serviceName, serviceVersion);
    const expectedName = 'Missed PRI CIS-CAT Risk Assessment Priority Sepia & Privacy Impact Assessment (RA & PIA)';

    expect(response.documentName).toEqual(expectedName);
  });

  it('Negative case when adpModel.getOneById throws error', (done) => {
    const msID = 'mockMicroserviceNotFound';
    const translation = new adp.mimer.MimerTranslation();
    translation._getMicroservice(msID)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(404);
        expect(ERROR.desc).toBe('Error caught because [ getOneById @ adp.models.Adp ] returned empty.');
        expect(ERROR.data.microserviceID).toBe(msID);
        done();
      });
  });

  it('Negative case when _updateMicroservice throws error (returns false)', (done) => {
    const MockMS = {
      _id: 'mockID',
    };
    mockRequestHead.throw = true;
    adp.mockBehavior.update = false;
    const translation = new adp.mimer.MimerTranslation();
    translation._updateMicroservice(MockMS)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.ok).toBeFalsy();
        done();
      });
  });

  it('Negative case if primeDD throws error', (done) => {
    adp.mockBehavior.getAll = false;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(404);
        expect(ERROR.desc).toBe('Error caught from [ getAdll @ adp.models.PrimeDDTable ] at _getMimerTableFromDatabase');
        expect(ERROR.data.message).toBe('MockError from getAll');
        done();
      });
  });

  it('Negative case if _getDocumentHeader throws error from global.request.head', (done) => {
    mockRequestHead.throw = false;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.error.statusCode).toBe(500);
        expect(ERROR.error.message).toBe('Error in global.request.head');
        done();
      });
  });

  it('Negative case if _retrieveDataFromPrimDD gets error from global.request.get', (done) => {
    mockRequestGet.throw = true;
    const msID = 'mimer_menu_with_inProgress_and_mimer_menu';
    const docNumber = '15283-APR20131/7-6';
    const revision = 'A';
    const language = 'Uen';
    const docVersion = '8.3.1';

    const translation = new adp.mimer.MimerTranslation();
    translation.getDocumentDetails(msID, docNumber, revision, language, docVersion)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.error.statusCode).toBe(500);
        expect(ERROR.error.message).toBe('Error in global.request.get');
        done();
      });
  });
});
