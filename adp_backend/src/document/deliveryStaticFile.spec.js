// ============================================================================================= //
/**
* Unit test for [ global.adp.document.deliveryStaticFile ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.document.deliveryStaticFile ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.rest = [];
    global.adp.echoLog = () => {};

    global.fs = {};
    global.fs.existsSync = () => true;
    global.fs.statSync = () => 'Stats';
    global.fs.readFileSync = () => '<html document/>';

    global.adp.document = {};
    global.adp.document.deliveryStaticFile = require('./deliveryStaticFile'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('deliveryStaticFile', (done) => {
    const folder = '/mock/folder/test/cache/';
    const file = 'test';
    const extension = '.html';

    global.adp.document.deliveryStaticFile(folder, file, extension)
      .then((RESULT) => {
        expect(RESULT).toEqual({ stats: 'Stats', binary: '<html document/>' });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
