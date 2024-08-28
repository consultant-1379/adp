// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryLoadHTML ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactoryLoadHTML ] behavior.', () => {
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
            if (VALUE.url === 'https://externalhtml.test.com/folder/test-document-404.html') {
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
    global.adp.document.getFileFromArtifactoryLoadHTML = require('./getFileFromArtifactoryLoadHTML');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('If is able to request a HTML file content (SIMULATION)', (done) => {
    const url = 'https://externalhtml.test.com/folder/test-document.html';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document';
    const folderSlug = 'https-externalhtml-test-com-folder-test-document';
    const headers = { mock: 'header' };
    const fileName = 'test-document.html';
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactoryLoadHTML(
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

  it('If is able to identify a 404 HTML file (SIMULATION)', (done) => {
    const url = 'https://externalhtml.test.com/folder/test-document-404.html';
    const fullSlugUrl = 'http://mock.server/microservice/document/default-document-404';
    const folderSlug = 'https-externalhtml-test-com-folder-test-document-404';
    const headers = { mock: 'header' };
    const fileName = 'test-document-404.html';
    const expectedAnswer = '{"status":404,"msg":"File not Found: https://externalhtml.test.com/folder/test-document-404.html","download":"ERROR"}';

    global.adp.document.getFileFromArtifactoryLoadHTML(
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
