// ============================================================================================= //
/**
* Unit test for [ global.adp.document.isJustALink ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.document.solveHTMLExternalLink ] if he puts "_blank" in external links.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.document = {};
    global.adp.document.solveHTMLExternalLink = require('./solveHTMLExternalLink'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  const paramOne = `<h1>This is a Test</h1><br/>
                    <a href="#anchor">Go to end throughout anchor</a><br/>
                    <a href="http://adp.ericsson.se/">External Link One</a><br/>
                    <a href="http://adp.ericsson.se/home">External Link Two</a><br/>
                    <h2 id="anchor">end</a>`;

  const expectedAnswerOne = `<h1>This is a Test</h1><br/>
                    <a href="#anchor">Go to end throughout anchor</a><br/>
                    <a href="http://adp.ericsson.se/" target="_blank">External Link One</a><br/>
                    <a href="http://adp.ericsson.se/home" target="_blank">External Link Two</a><br/>
                    <h2 id="anchor">end</a>`;

  it('[ global.adp.document.solveHTMLExternalLink ] with a valid HTML. Should return a HTML with "_blank" in external links.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink(paramOne) === expectedAnswerOne;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.solveHTMLExternalLink ] with a NULL param. Should return NULL.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink(null) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.solveHTMLExternalLink ] with an Undefined param. Should return Undefined.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink(undefined) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.solveHTMLExternalLink ] with a Number param. Should return the Number.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink(25) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.solveHTMLExternalLink ] with an Array param. Should return the Array.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink([]) === null;

    expect(theResult).toBeTruthy();
  });

  it('[ global.adp.document.solveHTMLExternalLink ] with an Object param. Should return the Object.', () => {
    const theResult = global.adp.document.solveHTMLExternalLink({}) === null;

    expect(theResult).toBeTruthy();
  });
});
// ============================================================================================= //
