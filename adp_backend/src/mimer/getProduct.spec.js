// ============================================================================================= //
/**
* Unit test for [ adp.mimer.getProduct ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
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

  setPayload() {
    return new Promise(RES => RES());
  }

  getNextIndex() {
    return new Promise(RES => RES(0));
  }

  addJob() {
    if (adp.mockBehavior.adpQueueAddJob === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }
}
// ============================================================================================= //
class MockAssetDocuments {
  hardDeleteFromDatabaseByType() {
    if (adp.mockBehavior.hardDeleteFromDatabaseByType === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }

  hardDeleteFromDatabaseByVersion() {
    if (adp.mockBehavior.hardDeleteFromDatabaseByType === true) {
      return new Promise(RES => RES('MockSuccess'));
    }
    return new Promise((RES, REJ) => {
      const mockError = { code: 500, message: 'MockError' };
      REJ(mockError);
    });
  }

  getLatestVersionByMSId() {
    return new Promise((RES) => {
      RES('0.0.0');
    });
  }

  getMimerDevelopmentVersionFromYAML() {
    return new Promise(RES => RES('1.0.0'));
  }

  getMenuVersions(MSID) {
    if (adp.mockBehavior.getOneById === false) {
      const mockError = {
        code: 500,
        message: 'MockError',
      };
      return new Promise((RES, REJ) => REJ(mockError));
    }
    let obj;
    switch (MSID) {
      case 'mockMicroserviceWithMimerMenuID':
        obj = {
          docs:
            {
              versionLabel: '8.3.0',
              'release-documents': [
                {
                  name: '15283-APR20131/7-6',
                  slug: '15283-apr201317-6',
                  mimer_source: true,
                  mimer_document_number: '15283-APR20131/7-6',
                  language: 'Uen',
                  revision: 'A',
                  external_link: 'https://erid2rest.internal.ericsson.com/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                  physical_file_name: null,
                  physical_file_extension: null,
                  physical_file_status: null,
                  default: false,
                  restricted: false,
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
          case 3:
            obj = {};
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
describe('Testing [ adp.mimer.getProduct ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      adpQueueAddJobs: true,
      getOneById: true,
      getProduct: true,
      getProductAnswer: 0,
      adpQueueAddJob: true,
    };
    adp.queue = new MockQueue();
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.models.AssetDocuments = MockAssetDocuments;
    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.mimer = {};
    adp.mimer.MimerControl = MockMimerControl;
    adp.mimer.getProduct = proxyquire('./getProduct', {
      './../library/errorLog': adp.erroLog,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case with mimer_menu.', (done) => {
    const productID = 'mockProductWithMimerMenuID';
    const allVersions = true;
    const msID = 'mockMicroserviceWithMimerMenuID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective, '1.0.0')
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ adp.queue.addJob ] rejects.', (done) => {
    const productID = 'mockProductWithMimerMenuID';
    const allVersions = true;
    adp.mockBehavior.adpQueueAddJob = false;
    adp.mockBehavior.adpQueueAddJobs = false;
    const msID = 'mockMicroserviceWithMimerMenuID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective, 'ALL')
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toEqual(500);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ adp.queue.addJobs ] rejects.', (done) => {
    adp.mockBehavior.adpQueueAddJobs = false;
    const productID = 'mockProductWithMimerMenuID';
    const allVersions = true;
    const msID = 'mockMicroserviceWithMimerMenuID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getProduct @ adp.mimer.MimerControl ] rejects.', (done) => {
    adp.mockBehavior.getProduct = false;
    const productID = 'mockProductID';
    const allVersions = true;
    const msID = 'mockMicroserviceID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getProduct @ adp.mimer.MimerControl ] returns nothing.', (done) => {
    adp.mockBehavior.getProductAnswer = 2;
    const productID = 'mockMicroserviceWithMimerMenuID';
    const allVersions = false;
    const msID = 'mockMicroserviceWithMimerMenuID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective, '1.0.0')
      .then((RES) => {
        expect(RES.status).toEqual(200);
        expect(RES.statusDescription).toEqual('No new versions were found.');
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getProduct @ adp.mimer.MimerControl ] returns non array response.', (done) => {
    adp.mockBehavior.getProductAnswer = 3;
    const productID = 'mockMicroserviceWithMimerMenuID';
    const allVersions = false;
    const msID = 'mockMicroserviceWithMimerMenuID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toEqual(500);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getOneById @ adp.models.Adp ] rejects.', (done) => {
    adp.mockBehavior.getOneById = false;
    const productID = 'mockProductID';
    const allVersions = true;
    const msID = 'mockMicroserviceID';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getOneById @ adp.models.Adp ] returns nothing.', (done) => {
    const productID = 'mockMicroserviceNotFound';
    const allVersions = true;
    const msID = 'mockMicroserviceNotFound';
    const queueObjective = 'mockQueueObjective';
    adp.mockBehavior.hardDeleteFromDatabaseByType = true;
    adp.mimer.getProduct(productID, allVersions, msID, queueObjective)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeDefined();
        done();
      });
  });

  // ------------------------------------------------------------------------------------------- //
});
// ============================================================================================= //
