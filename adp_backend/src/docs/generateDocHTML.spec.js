// ============================================================================================= //
/**
* Unit test for [ global.adp.docs.generateDocHTML ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.docs.generateDocHTML ] with expected and unexpected parameters.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.docs.generateDocHTML = require('./generateDocHTML'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  const dummyComment = {
    filename:
      '/home/escharm/Documents/@Work/adp/backend/param/CLParams.js',
    text:
      ['/**\n* [ global.adp.CLParams ]\n* Read the parameters and set up global.adp.config object.\n* @author Armando Schiavon Dias [escharm]\n*/'],
    dependencies:
    [
      'global.adp.config',
      'global.adp.config.mode',
      'global.adp.config.ldap',
      'global.adp.config.nginxssl',
      'global.adp.config.couchdbssl',
      'global.adp.config.databasename',
      'global.adp.config.corsproxyssl',
      'global.adp.config.nodemailerssl',
      'global.adp.echoDivider',
      'global.adp.echoLog',
    ],
  };

  it('[ global.adp.docs.generateDocHTML ] should return HTML comments to display.', (done) => {
    const expectReturn = global.adp.docs.generateDocHTML('DOC', 'https://localhost/', dummyComment);
    if (expectReturn !== '<b>Nothing to Show!</b>') {
      expect(expectReturn).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.generateDocHTML ] should return HTML error to display because parameter is null.', (done) => {
    const expectReturn = global.adp.docs.generateDocHTML('DOC', 'https://localhost/', null);
    if (expectReturn === '<b>Nothing to Show!</b>') {
      expect(expectReturn).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.generateDocHTML ] should return HTML error to display because parameter is undefined.', (done) => {
    const expectReturn = global.adp.docs.generateDocHTML('DOC', 'https://localhost/', undefined);
    if (expectReturn === '<b>Nothing to Show!</b>') {
      expect(expectReturn).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });

  it('[ global.adp.docs.generateDocHTML ] should return HTML error to display because parameter is an empty Object.', (done) => {
    const expectReturn = global.adp.docs.generateDocHTML('DOC', 'https://localhost/', {});
    if (expectReturn === '<b>Nothing to Show!</b>') {
      expect(expectReturn).toBeDefined();
      done();
    } else {
      expect(false).toBeTruthy();
      done();
    }
  });
});
// ============================================================================================= //
