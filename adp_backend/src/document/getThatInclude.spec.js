// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getThatInclude ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('[ global.adp.document.getThatInclude ] check if is able to retrieve the content of includes.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.document = {};
    global.adp.echoLog = text => text;
    global.adp.document.getFileFromGerrit = INCLUDELINK => new Promise((RESOLVE) => {
      const mockIncludeText = `<h2>Text from Include</h2><br>\r\nMy path is ${INCLUDELINK}`;
      RESOLVE(mockIncludeText);
    });
    global.adp.document.getThatInclude = require('./getThatInclude'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  const paramA1 = 'include::test.json';
  const paramA2 = 'https://test.se/?p=project.git;a=blob;f=folder/file.adoc;h=b2;hb=refs/heads/BRANCH';
  const expectedResultA = '<h2>Text from Include</h2><br>\r\nMy path is https://test.se/?p=project.git;a=blob;f=folder/test.json;hb=refs/heads/BRANCH';

  it('[ global.adp.document.getThatInclude ] should return the content of include.', (done) => {
    global.adp.document.getThatInclude(paramA1, paramA2)
      .then((theResult) => {
        const result = theResult === expectedResultA;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.document.getThatInclude ] with a NULL param. Should return NULL.', (done) => {
    global.adp.document.getThatInclude(null, null)
      .then((theResult) => {
        const result = theResult === null;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.document.getThatInclude ] with an Undefined param. Should return NULL.', (done) => {
    global.adp.document.getThatInclude(undefined, undefined)
      .then((theResult) => {
        const result = theResult === null;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.document.getThatInclude ] with a Number param. Should return NULL.', (done) => {
    global.adp.document.getThatInclude(25, 25)
      .then((theResult) => {
        const result = theResult === null;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.document.getThatInclude ] with an Array param. Should return NULL.', (done) => {
    global.adp.document.getThatInclude([], [])
      .then((theResult) => {
        const result = theResult === null;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.document.getThatInclude ] with an Object param. Should return NULL.', (done) => {
    global.adp.document.getThatInclude({}, {})
      .then((theResult) => {
        const result = theResult === null;

        expect(result).toBeTruthy();
        done();
      })
      .catch((ERROR) => {
        const result = ERROR === null;

        expect(result).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
