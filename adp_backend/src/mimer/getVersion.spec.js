// ============================================================================================= //
/**
* Unit test for [ adp.mimer.getVersion ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
class MockAdpClass {
  update() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.update === true) {
        RES();
      } else {
        const errorObject = {
          code: 500,
          message: 'Mock Error',
        };
        REJ(errorObject);
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
      case 'mockMicroserviceWithMimerMenuInProgress':
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

  getNextIndex() {
    return new Promise(RES => RES(0));
  }

  setPayload() {
    return new Promise(RES => RES());
  }
}
// ============================================================================================= //

class MockAssetDocuments {
  createOrUpdate() {
    if (adp.mockBehavior.createOrUpdate === true) {
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
  getVersion() {
    return new Promise((RES, REJ) => {
      if (adp.mockBehavior.getVersion === false) {
        REJ();
      } else {
        let obj;
        switch (adp.mockBehavior.getVersionAnswer) {
          case 1:
            obj = {
              lifecycleStage: 'Released',
              documents: [
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '15283-APR20131/7-6',
                  language: 'Uen',
                  revision: 'A',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                },
              ],
            };
            RES(obj);
            break;
          case 2:
            obj = {};
            RES(obj);
            break;
          default:
            obj = {
              lifecycleStage: 'Released',
              documents: [
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '15283-APR20131/7-6',
                  language: 'Uen',
                  revision: 'A',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=15283-APR20131%2F7-6Uen&revision=A',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/1597-APR20131/7',
                  language: 'Uen',
                  revision: 'F',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F1597-APR20131%2F7Uen&revision=F',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/1553-APR20131/7',
                  language: 'Uen',
                  revision: 'E',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F1553-APR20131%2F7Uen&revision=E',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/00664-APR20131/7',
                  language: 'Uen',
                  revision: 'E',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F00664-APR20131%2F7Uen&revision=E',
                },
                {
                  systemOfRecord: 'PRIM',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/19817-APR20131/7',
                  language: 'Uen',
                  revision: 'E',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F19817-APR20131%2F7Uen&revision=E',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/15241-APR20131/7',
                  language: 'Uen',
                  revision: 'F',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F15241-APR20131%2F7Uen&revision=F',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '1/0360-APR20131/7',
                  language: 'Uen',
                  revision: 'E',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=1%2F0360-APR20131%2F7Uen&revision=E',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'Eridoc',
                  documentNumber: '10921-APR20131/7-5',
                  language: 'Uen',
                  revision: 'A',
                  documentURL: 'https://mockURL/d2rest/repositories/eridoca/eridocument/download?number-part=10921-APR20131%2F7-5Uen&revision=A',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'Munin',
                },
                {
                  systemOfRecord: 'PRIM',
                },
                {
                  systemOfRecord: 'PRIM',
                },
                {
                  systemOfRecord: 'PRIM',
                },
              ],
            };
            RES(obj);
            break;
        }
      }
    });
  }
}
// ============================================================================================= //
describe('Testing [ adp.mimer.getVersion ] Behavior.', () => {
  // ------------------------------------------------------------------------------------------- //
  beforeEach(() => {
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.adp = {};
    adp.mockBehavior = {
      adpQueueAddJobs: true,
      getOneById: true,
      getVersion: true,
      getVersionAnswer: 0,
      update: true,
    };
    adp.slugIt = () => 'mockSlug';
    adp.config = {};
    adp.config.eridocServer = 'https://mockURL/';
    adp.queue = new MockQueue();
    adp.models = {};
    adp.models.Adp = MockAdpClass;
    adp.models.AssetDocuments = MockAssetDocuments;
    adp.echoLog = ERRORCODE => ERRORCODE;
    adp.erroLog = ERRORCODE => ERRORCODE;
    adp.mimer = {};
    adp.mimer.MimerControl = MockMimerControl;
    adp.mimer.getVersion = proxyquire('./getVersion', {
      './../library/errorLog': adp.erroLog,
    });
  });
  // ------------------------------------------------------------------------------------------- //
  afterEach(() => {
    global.adp = null;
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case.', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mockBehavior.createOrUpdate = true;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case whwn Microservice have mimer menu in progress', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceWithMimerMenuInProgress';
    adp.mockBehavior.createOrUpdate = true;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Successful case for one unique document.', (done) => {
    adp.mockBehavior.getVersionAnswer = 1;
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mockBehavior.createOrUpdate = true;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then((RES) => {
        expect(RES).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case when adp.mimer.MimerControl.getVersion sends response without document.', (done) => {
    adp.mockBehavior.getVersionAnswer = 2;
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toEqual(200);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ adp.queue.addJobs ] rejects.', (done) => {
    adp.mockBehavior.adpQueueAddJobs = false;
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toEqual(500);
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getOneById @ adp.models.Adp ] returns empty.', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceNotFound';
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ update @ adp.models.Adp ] crashes.', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mockBehavior.update = false;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getVersion @ adp.mimer.MimerControl ] crashes.', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mockBehavior.getVersion = false;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
  // ------------------------------------------------------------------------------------------- //
  it('Case [ getOneById @ adp.models.Adp ] crashes.', (done) => {
    const productNumber = 'mockProductNumber';
    const version = '8.0.1';
    const url = 'mockURL';
    const msid = 'mockMicroserviceID';
    adp.mockBehavior.getOneById = false;
    adp.mimer.getVersion(productNumber, version, url, false, msid)
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
