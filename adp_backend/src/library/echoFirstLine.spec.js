// ============================================================================================= //
/**
* Unit test for [ global.adp.echoFirstLine ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.echoFirstLine ] can be loaded in memory.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dbSetup = {};
    global.adp.echoFirstLine = require('./echoFirstLine'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.echoFirstLine ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.echoFirstLine).toBeDefined();
    done();
  });
});
// ============================================================================================= //
