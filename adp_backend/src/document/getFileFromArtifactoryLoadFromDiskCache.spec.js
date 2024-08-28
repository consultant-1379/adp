// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryLoadFromDiskCache ]
* @author Vivek Kumar Verma [zmviukv]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //

describe('Testing [ global.adp.document.getFileFromArtifactoryLoadFromDiskCache ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => { };
    global.adp.slugThisURL = (URL) => {
      if (URL === 'https://external.test.com/folder/test-document1.html') {
        return 'https_external_test_com_folder_test-document1_html';
      }
      if (URL === 'https://external.test.com/folder/test-document2.html') {
        return 'https_external_test_com_folder_test-document2_html';
      }
      if (URL === 'https://external.test.com/folder/test-document3.docx') {
        return 'https_external_test_com_folder_test-document3_docx';
      }
      if (URL === 'https://external.test.com/folder/test-document4.html') {
        return 'https_external_test_com_folder_test-document4_html';
      }
      if (URL === 'https://external.test.com/folder/test-document5.html') {
        return 'https_external_test_com_folder_test-document5_html';
      }
      return 'no_url';
    };
    global.adp.document = {};
    global.adp.path = 'mockpath';
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache = proxyquire('./getFileFromArtifactoryLoadFromDiskCache', {
      '../library/errorLog': mockErrorLog,
    });

    global.fs = {};
    global.fs.existsSync = (path) => {
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document1_html/') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document1_html/cache/') {
        return false;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document1_html/test-document1.html') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/cache/') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/cache/test-document2.html') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document3_docx/') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document3_docx/cache/') {
        return false;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document3_docx/test-document3.docx') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document4_html/') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document4_html/cache/subFile') {
        return true;
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document5_html/') {
        return false;
      }
      return false;
    };

    global.fs.readdirSync = (path) => {
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document1_html/') {
        return ['test-document1.html'];
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/') {
        return [];
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/cache/') {
        return ['test-document2.html'];
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document3_docx/') {
        return ['test-document3.docx'];
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document4_html/') {
        return ['test-document4.html', 'test-document4a.html', 'test-document4b.txt'];
      }
      return null;
    };
    global.fs.readFileSync = (path) => {
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document1_html/test-document1.html') {
        return 'test-document1.html';
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document2_html/cache/test-document2.html') {
        return 'test-document2.html';
      }
      if (path === 'mockpath/static/document/https_external_test_com_folder_test-document4_html/cache/subFile') {
        return 'subFile.html';
      }
      return null;
    };
    global.fs.statSync = () => {
      const obj = {
        isDirectory: () => true,
      };
      return obj;
    };
  });

  afterEach(() => {
    global.adp = null;
  });


  it('If is able to read html file from disk cache from parent folder.', (done) => {
    const url = 'https://external.test.com/folder/test-document1.html';
    const docFullSlugLink = 'http://mock.server/microservice/document/test-document1';
    const fileName = 'test-document.html';
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = url.match(regExpExtension);
    const expectedAnswer = '{"fromcache":true,"html":"test-document1.html"}';
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
      url, docFullSlugLink, fileName, fileExtensionFinder, null,
    ).then((RESULT) => {
      expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('If is able to read html file from disk cache folder.', (done) => {
    const url = 'https://external.test.com/folder/test-document2.html';
    const docFullSlugLink = 'http://mock.server/microservice/document/test-document2';
    const fileName = 'test-document2.html';
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = url.match(regExpExtension);
    const expectedAnswer = '{"fromcache":true,"html":"test-document2.html"}';
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
      url, docFullSlugLink, fileName, fileExtensionFinder, null,
    ).then((RESULT) => {
      expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('If not able to find html file in target folder.', (done) => {
    const url = 'https://external.test.com/folder/test-document3.docx';
    const docFullSlugLink = 'http://mock.server/microservice/document/test-document3';
    const fileName = 'test-document3.docx';
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = url.match(regExpExtension);
    const expectedAnswer = '{"fromcache":true,"download":"http://mock.server/microservice/document/test-document3","internal":"mockpath/static/document/https_external_test_com_folder_test-document3_docx/test-document3.docx"}';
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
      url, docFullSlugLink, fileName, fileExtensionFinder, null,
    ).then((RESULT) => {
      expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('If not able to find html file in target folder with subfile.', (done) => {
    const url = 'https://external.test.com/folder/test-document4.html';
    const docFullSlugLink = 'http://mock.server/microservice/document/test-document4';
    const fileName = 'test-document4.html';
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = url.match(regExpExtension);
    const expectedAnswer = '{"fromcache":true,"html":"subFile.html"}';
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
      url, docFullSlugLink, fileName, fileExtensionFinder, 'subFile',
    ).then((RESULT) => {
      expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('If not able to find html file in target folder without subfile.', (done) => {
    const url = 'https://external.test.com/folder/test-document4.html';
    const docFullSlugLink = 'http://mock.server/microservice/document/test-document4';
    const fileName = 'test-document4.html';
    const regExpExtension = new RegExp(/\.([^.]+)\.?$/gim);
    const fileExtensionFinder = url.match(regExpExtension);
    const expectedAnswer = '{"fromcache":true,"html":"not found"}';
    global.adp.document.getFileFromArtifactoryLoadFromDiskCache(
      url, docFullSlugLink, fileName, fileExtensionFinder, null,
    ).then((RESULT) => {
      expect(JSON.stringify(RESULT)).toBe(expectedAnswer);
      done();
    }).catch(() => {
      done.fail();
    });
  });
});
