// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getIncludesArray ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('[ global.adp.document.getIncludesArray ] with expected and unexpected parameters.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.document = {};
    global.adp.document.getIncludesArray = require('./getIncludesArray'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  const paramOne = `<h1>This is a Test</h1><br/>
                    include::nameOfTheFile.js[/]
                    Dumb Text
                    include::../nameOfTheSecondFile.js[/]
                    <a href="http://adp.ericsson.se/home">External Link</a><br/>
                    include::../../folder/nameOfTheThirdFile.js[/]
                    End`;
  const expectedAnswerOne = [
    'include::nameOfTheFile.js',
    'include::../nameOfTheSecondFile.js',
    'include::../../folder/nameOfTheThirdFile.js'];

  it('On this test [ global.adp.document.getIncludesArray ] should find exactly three includes.', () => {
    const theResult = global.adp.document.getIncludesArray(paramOne);
    let myFinalAnswer = true;
    if (theResult === null || theResult === undefined) {
      myFinalAnswer = false;
    } else if (theResult.length === 3) {
      const v1 = theResult[0] === expectedAnswerOne[0];
      const v2 = theResult[1] === expectedAnswerOne[1];
      const v3 = theResult[2] === expectedAnswerOne[2];
      if (v1 && v2 && v3) {
        myFinalAnswer = true;
      } else {
        myFinalAnswer = false;
      }
    } else {
      myFinalAnswer = false;
    }

    expect(myFinalAnswer).toBeTruthy();
    return '';
  });

  it('[ global.adp.document.getIncludesArray ] with a NULL param. Should return NULL.', () => {
    const theResult = global.adp.document.getIncludesArray(null);
    const result = theResult === null;

    expect(result).toBeTruthy();
  });

  it('[ global.adp.document.getIncludesArray ] with an Undefined param. Should return NULL.', () => {
    const theResult = global.adp.document.getIncludesArray(undefined);
    const result = theResult === null;

    expect(result).toBeTruthy();
  });

  it('[ global.adp.document.getIncludesArray ] with a Number param. Should return NULL.', () => {
    const theResult = global.adp.document.getIncludesArray(25);
    const result = theResult === null;

    expect(result).toBeTruthy();
  });

  it('[ global.adp.document.getIncludesArray ] with an Array param. Should return NULL.', () => {
    const theResult = global.adp.document.getIncludesArray([]);
    const result = theResult === null;

    expect(result).toBeTruthy();
  });

  it('[ global.adp.document.getIncludesArray ] with an Object param. Should return NULL.', () => {
    const theResult = global.adp.document.getIncludesArray({});
    const result = theResult === null;

    expect(result).toBeTruthy();
  });
});
// ============================================================================================= //
