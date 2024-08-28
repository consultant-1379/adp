// ============================================================================================= //
/**
* Unit test for [ global.adp.docs.getDependencies ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.docs.getDependencies ] to localize dependencies on the code.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.getDependencies = require('./getDependencies'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.docs.getDependencies ] should return an Array with dependencies.', (done) => {
    const DummyCode = `
        module.exports = () => new Promise( ( RESOLVE, REJECT ) => {

            if ( global.adp.docs.list === undefined || global.adp.docs.list === null ) {
                global.adp.docs.htmlDocs = '<b>Nothing to Show!</b>'
                RESOLVE(true)
            }
            if ( !Array.isArray(global.adp.docs.list) ) {
                global.adp.docs.htmlDocs = '<b>Nothing to Show!</b>'
                RESOLVE(true)        
            }
            if ( global.adp.docs.list.length === 0 ) {
                global.adp.docs.htmlDocs = '<b>Nothing to Show!</b>'
                RESOLVE(true)
            }

            const start = async() => {
                let htmlContent = ""
                await global.adp.docs.list.forEach( async pathOfFileToRead => {
                    htmlContent +=
                            global.adp.docs.generateDocHTML( 
                                global.adp.docs.readDoc( 
                                    pathOfFileToRead 
                                )
                            )
                })
                let html = "{htmlContent}"
                RESOLVE( html )
            }

            start()

        })
    `;
    const expectReturn = global.adp.docs.getDependencies(DummyCode);
    if (expectReturn[0] === 'No Dependencies' && expectReturn.length === 1) {
      expect(false).toBeTruthy();
      done();
    } else {
      expect(Array.isArray(expectReturn)).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.getDependencies ] should return "No Dependencies" message because parameter is empty.', (done) => {
    const DummyCode = '';
    const expectReturn = global.adp.docs.getDependencies(DummyCode);
    if (Array.isArray(expectReturn)) {
      if (expectReturn[0] === 'No Dependencies' && expectReturn.length === 1) {
        expect(true).toBeTruthy();
        done();
      }
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.getDependencies ] should return "No Dependencies" message because parameter is undefined.', (done) => {
    const DummyCode = undefined;
    const expectReturn = global.adp.docs.getDependencies(DummyCode);
    if (Array.isArray(expectReturn)) {
      if (expectReturn[0] === 'No Dependencies' && expectReturn.length === 1) {
        expect(true).toBeTruthy();
        done();
      } else {
        expect(false).toBeTruthy();
        done();
      }
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.getDependencies ] should return "No Dependencies" message because parameter is null.', (done) => {
    const DummyCode = null;
    const expectReturn = global.adp.docs.getDependencies(DummyCode);
    if (Array.isArray(expectReturn)) {
      if (expectReturn[0] === 'No Dependencies' && expectReturn.length === 1) {
        expect(true).toBeTruthy();
        done();
      } else {
        expect(false).toBeTruthy();
        done();
      }
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.getDependencies ] should return "No Dependencies" message because parameter is not a String.', (done) => {
    const DummyCode = 25;
    const expectReturn = global.adp.docs.getDependencies(DummyCode);
    if (Array.isArray(expectReturn)) {
      if (expectReturn[0] === 'No Dependencies' && expectReturn.length === 1) {
        expect(true).toBeTruthy();
        done();
      } else {
        expect(false).toBeTruthy();
        done();
      }
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });
});
// ============================================================================================= //
