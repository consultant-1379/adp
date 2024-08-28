// ============================================================================================= //
/**
* Unit test for [ global.adp.docs.readDoc ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.docs.readDoc ] to read code files.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.readDoc = require('./readDoc'); // eslint-disable-line global-require
    global.adp.docs.getDependencies = () => ['No Dependencies'];
    global.fs = {};
    global.fs.readFileSync = () => `
                    /**
                    * [ global.adp.docs.readDoc ]
                    * Usually called by [ global.adp.docs.generateDocs ], the [ global.adp.docs.readDoc ]
                    * will read a physical file, extract the documentation and return this content.
                    * @param {str} FILE Physical path of the file.
                    * @return {str} A String with the documentation.
                    * @author Armando Schiavon Dias [escharm]
                    */ 

                    Fake File Text Content
                    This is simulating code. This should not be present in the result of 
                    `;
    global.fs.statSync = () => new Date();
    global.adp.dateFormat = () => '25/08/2018 at 07:00:0000';
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.docs.readDoc ] should return an Object with the result ( SIMULATION ).', (done) => {
    const fileContent = global.adp.docs.readDoc('fakeFile.js');
    const result = fileContent.filename === 'fakeFile.js';

    expect(result).toBeTruthy();
    done();
  });

  it('[ global.adp.docs.readDoc ] should return an empty String because param is empty.', (done) => {
    const fileContent = global.adp.docs.readDoc('');
    const result = fileContent === '';

    expect(result).toBeTruthy();
    done();
  });

  it('[ global.adp.docs.readDoc ] should return an empty String because param is null.', (done) => {
    const fileContent = global.adp.docs.readDoc(null);
    const result = fileContent === '';

    expect(result).toBeTruthy();
    done();
  });

  it('[ global.adp.docs.readDoc ] should return an empty String because param is undefined.', (done) => {
    const fileContent = global.adp.docs.readDoc(undefined);
    const result = fileContent === '';

    expect(result).toBeTruthy();
    done();
  });

  it('[ global.adp.docs.readDoc ] should return an empty String because param is not a String.', (done) => {
    const fileContent = global.adp.docs.readDoc(25);
    const result = fileContent === '';

    expect(result).toBeTruthy();
    done();
  });
});
// ============================================================================================= //
