// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryLoadZip ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactoryLoadZip ] behavior.', () => {
  beforeEach(() => {
    // ----------------------------------------------------------------------------------------- //
    global.adp = {};
    // ----------------------------------------------------------------------------------------- //
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.config = {};
    global.adp.config.siteAddress = 'https://localhost:9999';

    global.mockCached = false;

    global.fs = {};
    global.fs.existsSync = () => global.mockCached;
    global.fs.unlinkSync = () => true;
    global.fs.readFileSync = () => 'FILE';
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
            if (VALUE.url === 'https://externalzip.test.com/folder/test-document-404.zip') {
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
    global.adp.document.getFileFromArtifactoryLoadZip = require('./getFileFromArtifactoryLoadZip');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('If is able to request a ZIP file content (SIMULATION)', (done) => {
    const url = 'https://externalzip.test.com/folder/test-document.zip';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document';
    const folderSlug = 'https-externaldoc-test-com-folder-test-document';
    const headers = { mock: 'header' };
    const fileName = 'test-document.zip';
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactoryLoadZip(
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

  it('If is able to identify a 404 ZIP file (SIMULATION)', (done) => {
    const url = 'https://externalzip.test.com/folder/test-document-404.zip';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document-404';
    const folderSlug = 'https-externaldoc-test-com-folder-test-document-404';
    const headers = { mock: 'header' };
    const fileName = 'test-document-404.zip';
    const expectedAnswer = '{"status":404,"msg":"File not Found: https://externalzip.test.com/folder/test-document-404.zip","download":"ERROR"}';

    global.adp.document.getFileFromArtifactoryLoadZip(
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
