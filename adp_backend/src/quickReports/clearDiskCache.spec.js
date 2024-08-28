// ============================================================================================= //
/**
* Unit test for [ global.adp.quickReports.clearDiskCache ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.quickReports.clearDiskCache ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.clone = OBJ => JSON.parse(JSON.stringify(OBJ));
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = STR => STR;

    global.adp.path = '/mock/path';
    global.adp.quickReports = {};
    global.adp.quickReports.clearDiskCache = require('./clearDiskCache');
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
    global.fs = {};
    global.fs.readdirSyncCounter = 0;
    global.fs.readdirSync = (THEPATH) => {
      if (THEPATH === '/mock/path/static/quickReports/') {
        global.fs.readdirSyncCounter += 1;
        return ['file1.mock', 'file2.mock', 'file3.mock'];
      }
      return [];
    };
    global.fs.existsSyncCounter = 0;
    global.fs.existsSyncCycle = 0;
    global.fs.existsSyncWillFailIn = null;
    global.fs.existsSync = (THEPATH) => {
      const dontCrash = (global.fs.existsSyncWillFailIn === null)
        || (global.fs.existsSyncWillFailIn !== global.fs.existsSyncCycle);
      global.fs.existsSyncCycle += 1;
      if (dontCrash) {
        const situationZero = (THEPATH === '/mock/path/static/quickReports/');
        const situationOne = (THEPATH === '/mock/path/static/quickReports/file1.mock');
        const situationTwo = (THEPATH === '/mock/path/static/quickReports/file2.mock');
        const situationThree = (THEPATH === '/mock/path/static/quickReports/file3.mock');
        if (situationZero || situationOne || situationTwo || situationThree) {
          global.fs.existsSyncCounter += 1;
          return true;
        }
        return false;
      }
      return false;
    };
    global.fs.statSyncCounter = 0;
    global.fs.statSyncNowOn = null;
    global.fs.statSync = (THEPATH) => {
      const situationZero = (THEPATH === '/mock/path/static/quickReports/');
      const situationOne = (THEPATH === '/mock/path/static/quickReports/file1.mock');
      const situationTwo = (THEPATH === '/mock/path/static/quickReports/file2.mock');
      const situationThree = (THEPATH === '/mock/path/static/quickReports/file3.mock');
      if (situationZero || situationOne || situationTwo || situationThree) {
        global.fs.statSyncCounter += 1;
        const stats = {
          birthtimeMs: 1000,
        };
        if (global.fs.statSyncNowOn === global.fs.statSyncCounter) {
          stats.birthtimeMs = (new Date()).getTime();
        }
        return stats;
      }
      return false;
    };
    global.fs.unlinkSyncCounter = 0;
    global.fs.unlinkSync = (THEPATH) => {
      const situationZero = (THEPATH === '/mock/path/static/quickReports/');
      const situationOne = (THEPATH === '/mock/path/static/quickReports/file1.mock');
      const situationTwo = (THEPATH === '/mock/path/static/quickReports/file2.mock');
      const situationThree = (THEPATH === '/mock/path/static/quickReports/file3.mock');
      if (situationZero || situationOne || situationTwo || situationThree) {
        global.fs.unlinkSyncCounter += 1;
        return true;
      }
      return false;
    };
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should find and delete three files (SIMULATION).', (done) => {
    global.adp.quickReports.clearDiskCache()
      .then(() => {
        expect(global.fs.existsSyncCounter).toBe(4);
        expect(global.fs.readdirSyncCounter).toBe(1);
        expect(global.fs.statSyncCounter).toBe(3);
        expect(global.fs.unlinkSyncCounter).toBe(3);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If the folder doesn`t exists (SIMULATION).', (done) => {
    global.fs.existsSyncWillFailIn = 0;
    global.adp.quickReports.clearDiskCache()
      .then(() => {
        expect(global.fs.existsSyncCounter).toBe(0);
        expect(global.fs.readdirSyncCounter).toBe(0);
        expect(global.fs.statSyncCounter).toBe(0);
        expect(global.fs.unlinkSyncCounter).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If the first file is not there (SIMULATION).', (done) => {
    global.fs.existsSyncWillFailIn = 1;
    global.adp.quickReports.clearDiskCache()
      .then(() => {
        expect(global.fs.existsSyncCounter).toBe(3);
        expect(global.fs.readdirSyncCounter).toBe(1);
        expect(global.fs.statSyncCounter).toBe(2);
        expect(global.fs.unlinkSyncCounter).toBe(2);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('If one file was created less than one hour ago (SIMULATION).', (done) => {
    global.fs.statSyncNowOn = 2;
    global.adp.quickReports.clearDiskCache()
      .then(() => {
        expect(global.fs.existsSyncCounter).toBe(4);
        expect(global.fs.readdirSyncCounter).toBe(1);
        expect(global.fs.statSyncCounter).toBe(3);
        expect(global.fs.unlinkSyncCounter).toBe(2);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
