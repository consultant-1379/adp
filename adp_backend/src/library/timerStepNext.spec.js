// ============================================================================================= //
/**
* Unit test for [ global.adp.timerStepNext ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.timerStepNext ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.timerStepTimer = new Date();
    global.adp.timerStepNext = require('./timerStepNext'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.timerStepNext ] should get [ global.adp.timerStepTimer ] and calculate the milliseconds.', () => {
    const expectedReturn = global.adp.timerStepNext();
    const b1 = expectedReturn.length >= 4;

    expect(b1).toBeTruthy();
  });
});
// ============================================================================================= //
