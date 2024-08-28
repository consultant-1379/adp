// ============================================================================================= //
/**
* Unit test for [ global.adp.docs.generateDocs ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.docs.generateDocs ] to generate documentation.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.readDoc = ITEM => `Faking [ global.adp.docs.readDoc ] return to [ ${ITEM} ]`;
    global.adp.docs.generateDocHTML = ITEM => `<b>Faking [ global.adp.docs.generateDocHTML ] return to [ ${ITEM} ]</b><br/>`;
    global.adp.docs.generateDocs = require('./generateDocs'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.docs.generateDocs ] should return HTML to display ( SIMULATION ).', (done) => {
    global.adp.docs.list = ['fakeFile1', 'fakeFile2', 'fakeFile3'];
    global.adp.docs.generateDocs('DOC', 'https://localhost/')
      .then((expectReturn) => {
        expect(expectReturn).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.docs.generateDocs ] should return error because [ global.adp.docs.list ] is empty.', (done) => {
    global.adp.docs.list = [];
    global.adp.docs.generateDocs('DOC', 'https://localhost/')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.docs.generateDocs ] should return error because [ global.adp.docs.list ] is not an Array.', (done) => {
    global.adp.docs.list = [];
    global.adp.docs.generateDocs('DOC', 'https://localhost/')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.docs.generateDocs ] should return error because [ global.adp.docs.list ] is undefined.', (done) => {
    global.adp.docs.list = undefined;
    global.adp.docs.generateDocs('DOC', 'https://localhost/')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });

  it('[ global.adp.docs.generateDocs ] should return error because [ global.adp.docs.list ] is null.', (done) => {
    global.adp.docs.list = null;
    global.adp.docs.generateDocs('DOC', 'https://localhost/')
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(true).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
