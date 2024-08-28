// ============================================================================================= //
/**
* Unit test for [ global.adp.echoLogSaveDiskLog ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.echoLogSaveDiskLog ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLogSaveDiskLog = require('./echoSaveDiskLog'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.echoLogSaveDiskLog ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.echoLogSaveDiskLog).toBeDefined();
    done();
  });
});
// ============================================================================================= //
