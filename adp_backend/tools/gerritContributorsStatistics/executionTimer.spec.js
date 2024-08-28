// ============================================================================================= //
/**
* Unit test for [ cs.finalTimerLine ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.executionTimer ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    cs.executionTimer = require('./executionTimer');
    cs.finalTimerLine = require('./finalTimerLine');
    cs.gitLog = () => {};
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Testing if [ adp.fullLogStart ] is setted before ( Most common case ).', () => {
    adp.fullLogStart = new Date();
    const returnString = cs.executionTimer();
    expect(returnString).toBeDefined();
  });

  it('Testing if [ adp.fullLogStart ] is undefined ( Rare case ).', () => {
    const returnString = cs.executionTimer();
    expect(returnString).toBeDefined();
  });
});
// ============================================================================================= //
