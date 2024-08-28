// ============================================================================================= //
/**
* Unit test for [ global.adp.setHeaders ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.setHeaders ]', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.setHeaders = require('./setHeaders'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.setHeaders ] should be loaded in memory, ready to be used.', (done) => {
    expect(global.adp.setHeaders).toBeDefined();
    done();
  });

  it('should set the necessary headers', () => {
    const res = {
      setHeader: jasmine.createSpy('setHeader'),
    };
    const result = global.adp.setHeaders(res);

    expect(res.setHeader).toHaveBeenCalledTimes(7);
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Max-Age', '-1');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With, remember-me, api-deployment-version, alertbanner');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Expose-Headers', 'alertbanner');
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(result).toBe(res);
  });
});
// ============================================================================================= //
