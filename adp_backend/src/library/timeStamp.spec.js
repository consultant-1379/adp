// ============================================================================================= //
/**
* Unit test for [ global.adp.timeStamp ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.timeStamp ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.timeStamp = require('./timeStamp'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.timeStamp ] with a TRUE as a parameter and should return a string with numbers and symbols.', () => {
    const expectedResult = global.adp.timeStamp(true);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 24;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with a FALSE as a parameter and should return a string with numbers.', () => {
    const expectedResult = global.adp.timeStamp(false);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 18;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });


  it('[ global.adp.timeStamp ] with a NULL as a parameter and should return a string with numbers.', () => {
    const expectedResult = global.adp.timeStamp(null);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 18;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with an UNDEFINED as a parameter and should return a string with numbers.', () => {
    const expectedResult = global.adp.timeStamp(undefined);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 18;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with a STRING as a parameter and should return a string with numbers and symbols.', () => {
    const expectedResult = global.adp.timeStamp('something');
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 24;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with a NUMBER as a parameter and should return a string with numbers and symbols.', () => {
    const expectedResult = global.adp.timeStamp(25);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 24;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with an empty Array as a parameter and should return a string with numbers and symbols.', () => {
    const expectedResult = global.adp.timeStamp([]);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 24;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with an empty Object as a parameter and should return a string with numbers and symbols.', () => {
    const expectedResult = global.adp.timeStamp({});
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 24;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] with a ZERO as a parameter and should return a string with numbers.', () => {
    const expectedResult = global.adp.timeStamp(0);
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 18;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.timeStamp ] without parameter and should return a string with numbers.', () => {
    const expectedResult = global.adp.timeStamp();
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 18;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });
});
// ============================================================================================= //
