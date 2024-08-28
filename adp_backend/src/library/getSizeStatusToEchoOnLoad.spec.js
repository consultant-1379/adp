// ============================================================================================= //
/**
* Unit test for [ global.adp.getSizeStatusToEchoOnLoad ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.getSizeStatusToEchoOnLoad ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.getSizeStatusToEchoOnLoad = require('./getSizeStatusToEchoOnLoad'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.getSizeStatusToEchoOnLoad ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.getSizeStatusToEchoOnLoad).toBeDefined();
    done();
  });
});
// ============================================================================================= //
