// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryLoadDocument ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactoryLoadDocument ] behavior.', () => {
  beforeAll(() => {
    global.adp = {};
    // ----------------------------------------------------------------------------------------- //
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};
    const { registerCustomMetrics } = require('../metrics/register');
    registerCustomMetrics();
  });

  beforeEach(() => {
    // ----------------------------------------------------------------------------------------- //
    global.adp.config = {};
    global.adp.config.siteAddress = 'https://localhost:9999';

    global.mockCached = false;

    global.fs = {};
    global.fs.existsSync = () => global.mockCached;
    global.fs.unlinkSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ test: 'mock' });
    global.fs.statSync = () => {
      const obj = {
        isDirectory: () => false,
      };
      return obj;
    };
    global.request = {};
    global.request.head = () => new Promise((R1) => { R1(); });
    global.request.get = (VALUE) => {
      const obj = {
        on(V, ACTION) {
          if (V === 'response') {
            const FILE = {
              statusCode: 200,
              pipe: () => {
                const subOBJ = {
                  on: (V1, ACTION1) => {
                    if (V1 === 'finish') {
                      ACTION1();
                    }
                  },
                };
                return subOBJ;
              },
            };
            if (VALUE.url === 'https://externaldoc.test.com/folder/test-document-404.doc') {
              FILE.statusCode = 404;
            }
            ACTION(FILE);
            return this;
          }
          return this;
        },
      };
      return obj;
    };
    global.fs.createWriteStream = () => {
      const obj = {
        close: (ACTIONWS) => {
          if (ACTIONWS !== undefined) {
            ACTIONWS();
          }
        },
      };
      return obj;
    };

    global.adp.document = {};
    global.adp.document.removeFolderIfEmpty = () => {};
    global.adp.document.clearArtifactoryCache = () => {};
    global.adp.document.unzipThisFile = () => new Promise(RES => RES());
    global.adp.document.parseTheseFiles = () => new Promise(RES => RES('<html document/>'));
    global.adp.document.parseThisHTML = () => new Promise(RES => RES('<html document/>'));
    global.adp.document.checkThisPath = () => new Promise((RES) => {
      RES('/mock/full/path/documentation/developer/test-document');
    });
    global.adp.document.getFileFromArtifactoryLoadDocument = require('./getFileFromArtifactoryLoadDocument');
  });

  afterAll(() => {
    global.adp = null;
    const { clearRegisters } = require('../metrics/register');
    clearRegisters();
  });

  it('If is able to request a Document file for download (SIMULATION)', (done) => {
    const url = 'https://externaldoc.test.com/folder/test-document.doc';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document';
    const folderSlug = 'https-externaldoc-test-com-folder-test-document';
    const headers = { mock: 'header' };
    const fileName = 'test-document.doc';
    const expectedAnswer = '{"fromcache":false,"download":"http://mock.server/microservice/document/default-document","internal":"/mock/full/path/documentation/developer/test-documenttest-document.doc"}';

    global.adp.document.getFileFromArtifactoryLoadDocument(
      url,
      fullSlugUrl,
      headers,
      fileName,
      folderSlug,
      null,
    )
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to identify a 404 Document file (SIMULATION)', (done) => {
    const url = 'https://externaldoc.test.com/folder/test-document-404.doc';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document-404';
    const folderSlug = 'https-externaldoc-test-com-folder-test-document-404';
    const headers = { mock: 'header' };
    const fileName = 'test-document-404.doc';
    const expectedAnswer = '{"status":404,"msg":"File not Found: https://externaldoc.test.com/folder/test-document-404.doc","download":"ERROR"}';

    global.adp.document.getFileFromArtifactoryLoadDocument(
      url,
      fullSlugUrl,
      headers,
      fileName,
      folderSlug,
      null,
    )
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
