// ============================================================================================= //
/**
* Unit test for [ global.adp.document.clearExpiredFilesFromArtifactory ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
describe('Testing [ global.adp.document.clearExpiredFilesFromArtifactory ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.artifactoryDiskCacheTimeOutInSeconds = 30;
    global.adp.config.artifactoryCheckDiskCacheTimeOutInSeconds = 30;

    global.adp.document = {};
    global.adp.document.clearArtifactoryCache = (FOLDER) => {
      switch (FOLDER) {
        case '/mock/path/document/folder1/':
          global.mock.folder1Deleted = true;
          break;
        case '/mock/path/document/folder2/':
          global.mock.folder2Deleted = true;
          break;
        default:
          // Nothing
          break;
      }
    };
    global.adp.document.checkThisPath = PATH => new Promise((RES1) => {
      switch (PATH) {
        case 'zip':
          RES1('/mock/path/zip/');
          break;
        default:
          RES1('/mock/path/document/');
          break;
      }
    });
    global.fs = {};
    global.fs.existsSync = (PATH) => {
      switch (PATH) {
        case '/mock/path/zip/':
        case '/mock/path/document/':
          return true;
        default:
          return false;
      }
    };
    global.fs.readdirSync = (WORKPATH) => {
      switch (WORKPATH) {
        case '/mock/path/zip/':
          return ['file1.zip', 'file2.zip'];
        case '/mock/path/document/':
          return ['folder1', 'folder2'];
        default:
          return {};
      }
    };
    global.fs.statSync = () => {
      const mockFileStatus = { birthtime: '2020-03-10T10:00:00.000Z' };
      return mockFileStatus;
    };
    global.fs.unlinkSync = (FILE) => {
      switch (FILE) {
        case '/mock/path/zip/file1.zip':
          global.mock.file1Deleted = true;
          break;
        case '/mock/path/zip/file2.zip':
          global.mock.file2Deleted = true;
          break;
        default:
          // Nothing
          break;
      }
    };
    global.adp.document.clearExpiredFilesFromArtifactory = require('./clearExpiredFilesFromArtifactory');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Clearing Expired Files From Artifactory Mock DiskCache.', (done) => {
    global.mock = {};
    global.mock.file1Deleted = false;
    global.mock.file2Deleted = false;
    global.mock.folder1Deleted = false;
    global.mock.folder2Deleted = false;
    global.adp.document.clearExpiredFilesFromArtifactory()
      .then(() => {
        expect(global.mock.file1Deleted).toBeTruthy();
        expect(global.mock.file2Deleted).toBeTruthy();
        expect(global.mock.folder1Deleted).toBeTruthy();
        expect(global.mock.folder2Deleted).toBeTruthy();
        done();
      })
      .catch(() => {
        fail();
      });
  });
});
// ============================================================================================= //
