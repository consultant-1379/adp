// ============================================================================================= //
/**
* Unit test for [ global.adp.echoDivider ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.echoDivider ] can be loaded in memory.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dbSetup = {};
    global.adp.echoDivider = require('./echoDivider'); // eslint-disable-line global-require
    adp.echoDebugConsoleMode = null;
    adp.config = {};
    adp.config.saveConsoleLogInFile = null;
    adp.echoLogSaveDiskLog = ret => ret;
    global.chalk = {};
    global.chalk.blue = () => '-----';
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.echoDivider ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.echoDivider).toBeDefined();
    done();
  });

  it('[ adp.echoLogSaveDiskLog ] should get called.', () => {
    adp.echoDebugConsoleMode = true;
    adp.config.saveConsoleLogInFile = true;
    spyOn(adp, 'echoLogSaveDiskLog');
    global.adp.echoDivider();

    expect(adp.echoLogSaveDiskLog).toHaveBeenCalledWith('|--------------------------|------------------------------------------------------------------------');
  });

  it('[ adp.echoLogSaveDiskLog ] should not get called.', () => {
    adp.echoDebugConsoleMode = false;
    adp.config.saveConsoleLogInFile = false;
    spyOn(adp, 'echoLogSaveDiskLog');
    global.adp.echoDivider();

    expect(adp.echoLogSaveDiskLog).not.toHaveBeenCalledWith('|--------------------------|------------------------------------------------------------------------');
  });

  it('verify else condition for [ adp.echoLogSaveDiskLog ]', () => {
    adp.echoDebugConsoleMode = true;
    adp.config.saveConsoleLogInFile = false;
    spyOn(adp, 'echoLogSaveDiskLog');
    global.adp.echoDivider();

    expect(adp.echoLogSaveDiskLog).not.toHaveBeenCalledWith('|--------------------------|------------------------------------------------------------------------');
  });
});
// ============================================================================================= //
