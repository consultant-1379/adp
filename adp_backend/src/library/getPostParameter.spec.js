// ============================================================================================= //
/**
* Unit test for [ global.adp.getPostParameter ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.getPostParameter ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.getPostParameter = require('./getPostParameter'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.getPostParameter ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.getPostParameter).toBeDefined();
    done();
  });
});
// ============================================================================================= //
