// ============================================================================================= //
/**
* Unit test for [ global.adp.echoSetDebugConsoleMode ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.echoSetDebugConsoleMode ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoDebugConsoleMode = null;
    global.adp.echoSetDebugConsoleMode = require('./echoSetDebugConsoleMode'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.echoSetDebugConsoleMode ] should set [ global.adp.echoDebugConsoleMode ] to TRUE.', () => {
    global.adp.echoSetDebugConsoleMode(true);

    expect(global.adp.echoDebugConsoleMode).toBeTruthy();
  });

  it('[ global.adp.echoSetDebugConsoleMode ] should set [ global.adp.echoDebugConsoleMode ] to FALSE.', () => {
    global.adp.echoSetDebugConsoleMode(false);

    expect(global.adp.echoDebugConsoleMode).toBeFalsy();
  });
});
// ============================================================================================= //
