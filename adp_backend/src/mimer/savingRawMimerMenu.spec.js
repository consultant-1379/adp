// ============================================================================================= //
/**
* Unit test for [ adp.mimer.savingRawMimerMenu ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
  update() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.update === false) {
        const obj = { mockError: true };
        REJ(obj);
      } else {
        RES('MockSuccess');
      }
    });
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
      case 'mockMicroserviceID':
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
            },
          ],
        };
        return new Promise(RES => RES(obj));
      case 'mockMicroserviceWithMimerMenuID':
        obj = {
          docs: [
            {
              _id: 'mockMicroserviceID',
              slug: 'mock-microservice-slug',
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
// ============================================================================================= //
class MockQueue {
  addJobs() {
    if (adp.mockBehavior.adpQueueAddJobs === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}
// ============================================================================================= //
class MockMimerControl {
  getProduct() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.getProduct === false) {
        REJ();
      } else {
        let obj;
        switch (adp.mockBehavior.getProductAnswer) {
          case 1:
            obj = [
              {
                status: 200,
                data: {
                  schemaVersion: '9.0.1',
                  productVersions: [],
                  productVersioningSchema: 'SemVer2.0.0',
                  designation: 'Mock Microservice',
                  productNumber: 'APR20131',
                  designResponsible: 'BDGSLBM',
                },
              },
            ];
            RES(obj);
            break;
          case 2:
            obj = [];
            RES(obj);
            break;
          default:
            obj = [
              {
                status: 200,
                data: {
                  schemaVersion: '9.0.1',
                  productVersions: [
                    {
                      productVersionLabel: '8.3.1',
                      productVersionUrl: 'http://localhost:1080/api/v1/products/APR20131/versions/8.3.1',
                    },
                    {
                      productVersionLabel: '8.3.0',
                      productVersionUrl: 'http://localhost:1080/api/v1/products/APR20131/versions/8.3.0',
                    },
                  ],
                  productVersioningSchema: 'SemVer2.0.0',
                  designation: 'Mock Microservice',
                  productNumber: 'APR20131',
                  designResponsible: 'BDGSLBM',
                },
              },
            ];
            RES(obj);
            break;
        }
      }
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.mimer.savingRawMimerMenu ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      adpQueueAddJobs: true,
      getOneById: true,
      getProduct: true,
      getProductAnswer: 0,
      update: true,
    };
    adp.clone = OBJ => OBJ;
    adp.queue = new MockQueue();
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.mimer = {};
    adp.mimer.MimerControl = MockMimerControl;
    adp.mimer.savingRawMimerMenu = proxyquire('./savingRawMimerMenu', {
      './../library/errorLog': adp.erroLog,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case with allVersions setted as true.', (done) => {
    const msID = 'mockMicroserviceWithMimerMenuID';
    const allVersions = true;
    adp.mimer.savingRawMimerMenu(msID, allVersions)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case with allVersions setted as false.', (done) => {
    const msID = 'mockMicroserviceWithMimerMenuID';
    const allVersions = false;
    adp.mimer.savingRawMimerMenu(msID, allVersions)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case with allVersions setted as false, but no previous menu.', (done) => {
    const msID = 'mockMicroserviceID';
    const allVersions = false;
    adp.mimer.savingRawMimerMenu(msID, allVersions)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ update @ adp.models.Adp ] rejects.', (done) => {
    const msID = 'mockMicroserviceID';
    const allVersions = false;
    adp.mockBehavior.update = false;
    adp.mimer.savingRawMimerMenu(msID, allVersions)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getOneById @ adp.models.Adp ] rejects.', (done) => {
    const msID = 'mockMicroserviceID';
    const allVersions = false;
    adp.mockBehavior.getOneById = false;
    adp.mimer.savingRawMimerMenu(msID, allVersions)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
