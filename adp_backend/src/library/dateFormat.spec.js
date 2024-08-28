// ============================================================================================= //
/**
* Unit test for [ global.adp.dateFormat ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.dateFormat ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dateFormat = require('./dateFormat'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.dateFormat ] with a new Date() should return friendly string with readable date.', () => {
    const expectedResult = global.adp.dateFormat(new Date());
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 27;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.dateFormat ] with a string but valid date "2018-10-15T08:47:02.327Z" should return friendly string with readable date.', () => {
    const expectedResult = global.adp.dateFormat('2018-10-15T08:47:02.327Z');
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;
      const b2 = typeof expectedResult === 'string' || (expectedResult instanceof String);
      const b3 = expectedResult.length === 27;

      expect(b1 && b2 && b3).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.dateFormat ] with a null parameter should return an empty string.', () => {
    const expectedResult = global.adp.dateFormat(null);
    try {
      const b1 = expectedResult === '';

      expect(b1).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.dateFormat ] with an undefined parameter should return an empty string.', () => {
    const expectedResult = global.adp.dateFormat(undefined);
    try {
      const b1 = expectedResult === '';

      expect(b1).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.dateFormat ] with an empty string parameter should return an empty string.', () => {
    const expectedResult = global.adp.dateFormat('');
    try {
      const b1 = expectedResult === '';

      expect(b1).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });

  it('[ global.adp.dateFormat ] with an empty array parameter should return an empty string.', () => {
    const expectedResult = global.adp.dateFormat([]);
    try {
      const b1 = expectedResult === '';

      expect(b1).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });
});
// ============================================================================================= //
