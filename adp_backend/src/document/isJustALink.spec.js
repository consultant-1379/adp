// ============================================================================================= //
/**
* Unit test for [ global.adp.document.isJustALink ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.document.isJustALink ] check if there is not beyond than a relative link.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.document = {};
    global.adp.document.isJustALink = require('./isJustALink'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.document.isJustALink ] with a valid relative link. And nothing else.', () => {
    const testThis = '../something/to/test.txt';
    const theResult = global.adp.document.isJustALink(testThis) !== null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with a valid relative link. But more text. Should return NULL.', () => {
    const testThis = '../something/to/test.txt [ something else ]';
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with an empty String. Should return NULL.', () => {
    const testThis = '';
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with a NULL parameter. Should return NULL.', () => {
    const testThis = null;
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with an Undefined parameter. Should return NULL.', () => {
    const testThis = undefined;
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with a Number as parameter. Should return NULL.', () => {
    const testThis = 25;
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with an Array as parameter. Should return NULL.', () => {
    const testThis = [];
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.isJustALink ] with an Object as parameter. Should return NULL.', () => {
    const testThis = {};
    const theResult = global.adp.document.isJustALink(testThis) === null;

    expect(theResult).toBeTruthy();
  });
});
// ============================================================================================= //
