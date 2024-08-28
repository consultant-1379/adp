const proxyquire = require('proxyquire');

/**
* Unit test for global.adp.document.clearImage
* @author Cein
*/
describe('Testing [ global.adp.document.clearImage ] behavior.', () => {
  let clearImage;
  let readdirResp;
  let errorLogResp;

  beforeEach(() => {
    readdirResp = {
      error: null,
      result: [],
    };

    errorLogResp = {};
    global.adp = {
      cache: { timeInSeconds: 0 },
      dateFormat: () => 1,
      docs: { list: [] },
      echoLog: () => {},
      path: '',
    };

    global.fs = {
      existsSync: () => true,
      readdir: (path, callback) => callback(readdirResp.error, readdirResp.result),
      unlinkSync: () => {},
    };

    clearImage = proxyquire('./clearImage.js', {
      '../library/errorLog': (code, msg, error) => {
        errorLogResp.code = code;
        errorLogResp.msg = msg;
        errorLogResp.error = error;
      },
    });
  });

  it('Should return true if no images had to be removed', (done) => {
    clearImage().then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('Should return true if all images were removed successfully', (done) => {
    readdirResp.result = ['test', 'test'];
    clearImage().then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });

  it('Should return true even if the unlink of the files throw errors', (done) => {
    readdirResp.result = ['test'];
    const err = { code: 'ENOENT' };
    global.fs.unlinkSync = () => { throw err; };

    clearImage().then((result) => {
      expect(result).toBeTruthy();
      expect(errorLogResp.code).toBe(404);
      done();
    }).catch(() => done.fail());
  });

  it('Should return false if reading the directory returns an error', (done) => {
    readdirResp.error = 'Failed';

    clearImage().then((result) => {
      expect(result).toBeFalsy();
      expect(errorLogResp.code).toBe(404);
      expect(errorLogResp.error.error).toBe(readdirResp.error);
      done();
    }).catch(() => done.fail());
  });

  it('Should return false if the given path does not exist', (done) => {
    global.fs.existsSync = () => false;

    clearImage().then((result) => {
      expect(result).toBeFalsy();
      done();
    }).catch(() => done.fail());
  });
});
