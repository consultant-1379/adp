// ============================================================================================= //
/**
* Unit test for [ global.adp.access.setupPassport ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing if [ global.adp.access.setupPassport ] is ready to be used.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.access = {};
    global.adp.access.setupPassport = require('./setupPassport'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.access.setupPassport ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.access.setupPassport).toBeDefined();
    done();
    return '';
  });
});
// ============================================================================================= //
