// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryCompareHeads ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactoryCompareHeads ] behavior.', () => {
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
    global.mockSamePath = '/mock/document/document/https-externalmock-test-com-folder-test-document-doc/headers.systemtext';
    global.mockUpdatedPath = '/mock/document/document/https-externalmock-test-com-folder-test-document-updated-doc/headers.systemtext';

    global.fs = {};
    global.fs.existsSync = (PATH) => {
      if (PATH !== global.mockSamePath && PATH !== global.mockUpdatedPath) {
        return false;
      }
      return true;
    };
    global.fs.readFileSync = (PATH) => {
      if (PATH === global.mockUpdatedPath) {
        return '{"file":"mockfile.zip","lastModified":"2020-03-18T14:00:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}';
      }
      if (PATH === global.mockSamePath) {
        return '{"file":"mockfile.zip","lastModified":"2020-03-18T14:30:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}';
      }
      return null;
    };
    global.adp.document = {};
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.document.getFileFromArtifactoryCompareHeads = proxyquire('./getFileFromArtifactoryCompareHeads', {
      '../library/errorLog': mockErrorLog,
    });
    global.adp.document.clearArtifactoryCache = () => {};
    global.adp.document.checkThisPath = PATH => new Promise((RES1) => {
      RES1(`/mock/document/${PATH}`);
    });
    global.adp.document.getFileFromArtifactoryJustTheHead = () => new Promise((RES1) => {
      RES1('{"file":"mockfile.zip","lastModified":"2020-03-18T14:30:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}');
    });
    global.adp.document.getFileFromArtifactoryCompareHeads = require('./getFileFromArtifactoryCompareHeads');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('If is able to compare two file headers (Both equals in this case, should return NULL)', (done) => {
    const slugFolder = 'https-externalmock-test-com-folder-test-document-doc';
    const url = 'https://externalmock.test.com/folder/test-document.doc';
    const httpHeader = { mock: 'Header' };

    global.adp.document.getFileFromArtifactoryCompareHeads(slugFolder, url, httpHeader)
      .then((RESULT) => {
        expect(RESULT).toBeNull();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('If is able to compare two file headers (Different in this case, should return the remote file header)', (done) => {
    const slugFolder = 'https-externalmock-test-com-folder-test-document-updated-doc';
    const url = 'https://externalmock.test.com/folder/test-document-updated.doc';
    const httpHeader = { mock: 'Header' };
    const expectedAnwser = '{"file":"mockfile.zip","lastModified":"2020-03-18T14:30:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}';

    global.adp.document.getFileFromArtifactoryCompareHeads(slugFolder, url, httpHeader)
      .then((RESULT) => {
        expect(RESULT).toBe(expectedAnwser);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Returns the remote file header, in case of there is no local file header', (done) => {
    const slugFolder = 'https-newexternalmock-test-com-folder-test-document-updated-doc';
    const url = 'https://newexternalmock.test.com/folder/test-document-updated.doc';
    const httpHeader = { mock: 'Header' };
    const expectedAnwser = '{"file":"mockfile.zip","lastModified":"2020-03-18T14:30:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}';

    global.adp.document.getFileFromArtifactoryCompareHeads(slugFolder, url, httpHeader)
      .then((RESULT) => {
        expect(RESULT).toBe(expectedAnwser);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
