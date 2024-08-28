// ============================================================================================= //
/**
* Unit test for [ global.adp.frontEndVersionSync ]
* @author Cein-Sven Da Costa [edaccei]
*/
// ============================================================================================= //
describe('Testing [ global.adp.frontEndVersionSync ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.fs = {};
    /* eslint-disable global-require */
    global.adp.frontEndVersionSync = require('./frontEndVersionSync');
    /* eslint-enable global-require */
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return false if version file is not found', async (done) => {
    global.fs.existsSync = () => false;
    const req = {};
    const res = {};

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return false if version file content is not found', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => undefined;
    const req = {};
    const res = {};

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return false if version file content does not have a current object key', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => {};
    const req = {};
    const res = {};

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should be false if the request for API-Deployment-Version is undefined', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '1.0.32' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => undefined;

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return false if the request for API-Deployment-Version is null', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '1.0.32' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => null;

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return false if the request path is /login', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '1.0.32' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => '';
    req.path = '/login';

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });


  it('Should return false if the request path is /logged', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '1.0.32' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => '';
    req.path = '/logged';

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return false if the front end version matches the backend version', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '1' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => '1';
    req.path = '/anything';

    expect(global.adp.frontEndVersionSync(req, res)).toBeFalsy();
    done();
  });

  it('Should return true the front end version does not match the backend version', async (done) => {
    global.fs.existsSync = () => true;
    global.fs.readFileSync = () => JSON.stringify({ current: '2' });
    const req = {};
    const res = {};
    res.header = () => true;
    req.get = () => '1';
    req.path = '/anything';

    expect(global.adp.frontEndVersionSync(req, res)).toBeTruthy();
    done();
  });
});
