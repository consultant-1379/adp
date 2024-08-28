// ============================================================================================= //
/**
* Unit test for [ global.adp.timerStepStart ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.timerStepStart ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.timerStepTimer = undefined;
    global.adp.timerStepStart = require('./timerStepStart'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.timerStepStart ] should update [ global.adp.timerStepTimer ] to "new Date()".', () => {
    global.adp.timerStepStart();

    expect(global.adp.timerStepTimer).toBeDefined();
  });
});
// ============================================================================================= //
