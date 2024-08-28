const proxyquire = require('proxyquire');

// ============================================================================================= //
/**
* Unit test for [ global.adp.document.clearArtifactoryCache ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.document.clearArtifactoryCache ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.mockHelpers = {};
    global.mockHelpers.masterFolderDeleted = false;
    global.mockHelpers.folderDeleted = false;
    global.mockHelpers.file1Deleted = false;
    global.mockHelpers.file2Deleted = false;
    global.adp.echoLog = () => {};
    global.adp.path = __dirname;
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs = {};
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs.readdirSync = (PATH) => {
      const pathToCompare = `${global.adp.path}/static/document/mockFolder/`;
      if (pathToCompare === PATH) {
        return ['folder', 'file1', 'file2'];
      }
      return [];
    };
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs.existsSync = (ITEM) => {
      const pathToCompare = `${global.adp.path}/static/document/mockFolder/`;
      if (`${pathToCompare}folder` === ITEM) {
        return true;
      }
      if (`${pathToCompare}file1` === ITEM) {
        return true;
      }
      if (`${pathToCompare}file2` === ITEM) {
        return true;
      }
      return false;
    };
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs.statSync = (ITEM) => {
      const pathToCompare = `${global.adp.path}/static/document/mockFolder/`;
      const obj = {
        isDirectory() {
          if (`${pathToCompare}folder` === ITEM) {
            return true;
          }
          return false;
        },
      };
      return obj;
    };
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs.rmdirSync = (ITEM) => {
      const pathToCompare = `${global.adp.path}/static/document/mockFolder/`;
      if (`${pathToCompare}folder/` === `${ITEM}`) {
        global.mockHelpers.folderDeleted = true;
        return true;
      }
      if (pathToCompare === ITEM) {
        global.mockHelpers.masterFolderDeleted = true;
        return true;
      }
      return false;
    };
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.fs.unlinkSync = (ITEM) => {
      const pathToCompare = `${global.adp.path}/static/document/mockFolder/`;
      if (`${pathToCompare}file1` === ITEM) {
        global.mockHelpers.file1Deleted = true;
        return true;
      }
      if (`${pathToCompare}file2` === ITEM) {
        global.mockHelpers.file2Deleted = true;
        return true;
      }
      return false;
    };
    // ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   ---   //
    global.adp.document = {};

    global.adp.document.clearArtifactoryCache = proxyquire('./clearArtifactoryCache', {
      '../library/errorLog': () => {},
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Deleting a mock folder which some files inside.', (done) => {
    const PATH = `${global.adp.path}/static/document/mockFolder/`;
    const confirmation = global.adp.document.clearArtifactoryCache(PATH);

    expect(confirmation).toBeTruthy();
    expect(global.mockHelpers.file1Deleted).toBeTruthy();
    expect(global.mockHelpers.file2Deleted).toBeTruthy();
    expect(global.mockHelpers.folderDeleted).toBeTruthy();
    expect(global.mockHelpers.masterFolderDeleted).toBeTruthy();
    done();
  });

  it('Checking if is impossible to delete the system root.', (done) => {
    const PATH = './';
    const confirmation = global.adp.document.clearArtifactoryCache(PATH);

    expect(confirmation).toBeFalsy();
    done();
  });
});
// ============================================================================================= //
