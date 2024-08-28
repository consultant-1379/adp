// ============================================================================================= //
/**
* Unit test for [ global.adp.dateLogSystemFormat ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.dateLogSystemFormat ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.dateLogSystemFormat = require('./dateLogSystemFormat'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.dateLogSystemFormat ] no parameters, should return an object.', () => {
    const expectedResult = global.adp.dateLogSystemFormat();
    try {
      const b1 = expectedResult !== null && expectedResult !== undefined;

      expect(b1).toBeTruthy();
    } catch (e) {
      expect(false).toBeTruthy();
    }
  });
});
// ============================================================================================= //
