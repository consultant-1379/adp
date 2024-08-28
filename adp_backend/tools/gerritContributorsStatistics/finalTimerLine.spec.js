// ============================================================================================= //
/**
* Unit test for [ cs.finalTimerLine ]
* @author Armando Dias [zdiaaarm]
*/
// ============================================================================================= //
describe('[ gerritContributorsStatistics ] testing [ cs.finalTimerLine ] behavior', () => {
  beforeEach(() => {
    global.adp = {};
    global.cs = {};
    cs.mode = 'CLASSICMODE';
    cs.finalTimerLine = require('./finalTimerLine');
    cs.gitLog = () => {};
    adp.dateLogSystemFormat = SOMETHING => SOMETHING;
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Exactly one minute of difference.', () => {
    const mockDateTimeStampA = 1601632492047;
    const mockDateTimeStampB = mockDateTimeStampA + (60 * 1000);
    const returnString = cs.finalTimerLine(mockDateTimeStampA, mockDateTimeStampB);

    expect(returnString).toBe('All process finished in 1 minute.');
  });

  it('Exactly two minutes of difference.', () => {
    const mockDateTimeStampA = 1601632492047;
    const mockDateTimeStampB = mockDateTimeStampA + (2 * (60 * 1000));
    const returnString = cs.finalTimerLine(mockDateTimeStampA, mockDateTimeStampB);

    expect(returnString).toBe('All process finished in 2 minutes.');
  });

  it('Exactly one second of difference.', () => {
    const mockDateTimeStampA = 1601632492047;
    const mockDateTimeStampB = mockDateTimeStampA + 1000;
    const returnString = cs.finalTimerLine(mockDateTimeStampA, mockDateTimeStampB);

    expect(returnString).toBe('All process finished in 1 second.');
  });

  it('Exactly two seconds of difference.', () => {
    const mockDateTimeStampA = 1601632492047;
    const mockDateTimeStampB = mockDateTimeStampA + 2000;
    const returnString = cs.finalTimerLine(mockDateTimeStampA, mockDateTimeStampB);

    expect(returnString).toBe('All process finished in 2 seconds.');
  });

  it('Exactly four minutes and three seconds of difference.', () => {
    const mockDateTimeStampA = 1601632492047;
    const mockDateTimeStampB = mockDateTimeStampA + (4 * (60 * 1000)) + 3000;
    const returnString = cs.finalTimerLine(mockDateTimeStampA, mockDateTimeStampB);

    expect(returnString).toBe('All process finished in 4 minutes and 3 seconds.');
  });
});
// ============================================================================================= //
