// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactory ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactory ] behavior.', () => {
  beforeEach(() => {
    // ----------------------------------------------------------------------------------------- //
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.adp.config = {};
    global.adp.config.siteAddress = 'https://localhost:9999';
    global.adp.config.eadpusersPassword = 'mockUser:mockPassword';

    global.adp.document = {};
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.document.getFileFromArtifactory = proxyquire('./getFileFromArtifactory', {
      '../library/errorLog': mockErrorLog,
    });
    global.adp.document.getFileFromArtifactoryCompareHeads = (slugFolder, URL) => new Promise(
      (RES1, REJ1) => {
        if (URL === 'http://handlingcatchblockurl') {
          const errorobject = { code: 400, message: 'wrong url' };
          REJ1(errorobject);
        } else {
          RES1(null);
        }
      },
    );
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache = URL => new
    Promise((RES1, REJ1) => {
      const linkNotFromCache1 = (URL === 'https://external.notfromcache.test.com/folder/test-document.zip');
      const linkNotFromCache2 = (URL === 'https://external.notfromcache.test.com/folder/test-document.html');
      const linkNotFromCache3 = (URL === 'https://external.notfromcache.test.com/folder/test-document.doc');
      const wrongurlcase = (URL === 'mocktesturl');
      if (linkNotFromCache1 || linkNotFromCache2 || linkNotFromCache3 || wrongurlcase) {
        REJ1();
      } else {
        RES1({ fromcache: true, html: '<html document/>' });
      }
    });
    global.adp.document.getFileFromArtifactoryLoadZip = () => new
    Promise((RES1) => {
      RES1({ fromcache: false, html: '<html document/>' });
    });
    global.adp.document.getFileFromArtifactoryLoadHTML = () => new
    Promise((RES1) => {
      RES1({ fromcache: false, html: '<html document/>' });
    });
    global.adp.document.getFileFromArtifactoryLoadDocument = () => new
    Promise((RES1) => {
      RES1({ fromcache: false, download: 'http://mock.server/microservice/document/test-document', internal: '/mock/full/path/documentation/developer/test-document.doc' });
    });

    global.adp.document.unzipThisFile = () => new Promise(RES => RES());
    global.adp.document.parseTheseFiles = () => new Promise(RES => RES('<html document/>'));
    global.adp.document.parseThisHTML = () => new Promise(RES => RES('<html document/>'));
    global.adp.slugThisURL = () => 'https-externaldoc-test-com-folder-test-document';
    global.adp.document.checkThisPath = () => new Promise((RES) => {
      RES('/mock/full/path/documentation/developer/test-document');
    });
    global.adp.document.getFileFromArtifactory = require('./getFileFromArtifactory'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('If is able to request a ZIP file content, not from disk cache (SIMULATION)', (done) => {
    const url = 'https://external.notfromcache.test.com/folder/test-document.zip';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a HTML file content, not from disk cache (SIMULATION)', (done) => {
    const url = 'https://external.notfromcache.test.com/folder/test-document.html';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a Document file for download, not from disk cache (SIMULATION)', (done) => {
    const url = 'https://external.notfromcache.test.com/folder/test-document.doc';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const expectedAnswer = '{"fromcache":false,"download":"http://mock.server/microservice/document/test-document","internal":"/mock/full/path/documentation/developer/test-document.doc"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a ZIP file content, not from disk cache (SIMULATION) with Eri-Doc Mimer Extension', (done) => {
    const url = 'https://external.notfromcache.test.com/folder/test-document.zip';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const eridocmimerexrension = 'zip';
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile, eridocmimerexrension)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a HTML file content, not from disk cache (SIMULATION) with Eri-Doc Mimer Extension', (done) => {
    const url = 'https://external.notfromcache.test.com/folder/test-document.zip';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const eridocmimerexrension = 'html';
    const expectedAnswer = '{"fromcache":false,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile, eridocmimerexrension)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a ZIP file content, from disk cache (SIMULATION)', (done) => {
    const url = 'https://external.fromcache.test.com/folder/test-document.zip';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const eridocmimerexrension = 'ZIP';
    const expectedAnswer = '{"fromcache":true,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile, eridocmimerexrension)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a HTML file content, from disk cache (SIMULATION)', (done) => {
    const url = 'https://external.fromcache.test.com/folder/test-document.html';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const eridocmimerexrension = 'html';
    const expectedAnswer = '{"fromcache":true,"html":"<html document/>"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile, eridocmimerexrension)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to request a file content, when ericdoc mimer extension not defined and file extension finder has null value.', (done) => {
    const url = 'mocktesturl';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const expectedAnswer = '{"fromcache":false,"download":"http://mock.server/microservice/document/test-document","internal":"/mock/full/path/documentation/developer/test-document.doc"}';

    global.adp.document.getFileFromArtifactory(url, docLink, subfile, undefined)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Adding coverage for catch block.', (done) => {
    const url = 'http://handlingcatchblockurl';
    const docLink = 'https://localhost:9999/document/asset-slug/documentation/developer/test-document';
    const subfile = null;
    const expectedAnswer = '{"code":400,"message":"wrong url"}';
    global.adp.document.getFileFromArtifactory(url, docLink, subfile, undefined)
      .then(() => {
        done.fail();
      })
      .catch((res) => {
        expect(JSON.stringify(res.data.response)).toBe(expectedAnswer);
        done();
      });
  });
});
// ============================================================================================= //
