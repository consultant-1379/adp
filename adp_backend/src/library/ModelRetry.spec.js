const joi = require('joi');
/**
* Unit test for [ adp.ModelRetry ]
* @author Cein
*/
describe('Testing results of [ adp.rbac.ModelRetry ] ', () => {
  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.ModelRetry = require('./ModelRetry');
    global.joi = joi;
    adp.mockCount = 0;
  });

  afterEach(() => {
    adp = null;
  });

  it('should resolve successfully on first success bypassing waitOnRetry and retryLimit', (done) => {
    const mockMethod = () => new Promise(res => res(true));
    const modelRetry = new adp.ModelRetry(mockMethod, [], 10, 5);
    const timerStart = (new Date()).getTime();

    modelRetry.init().then((result) => {
      const duration = (new Date()).getTime() - timerStart;

      expect(result).toBeTruthy();
      expect(duration).toBeDefined();
      done();
    }).catch(() => done.fail());
  });

  it('should resolve successfully on the 3rd try', (done) => {
    const mockErr = { code: 503 };
    const mockMethod = () => new Promise((res, rej) => {
      if (adp.mockCount < 2) {
        adp.mockCount += 1;
        rej(mockErr);
      } else {
        res(true);
      }
    });
    const modelRetry = new adp.ModelRetry(mockMethod, [mockErr.code], 10, 5);
    const timerStart = (new Date()).getTime();

    modelRetry.init().then((result) => {
      const duration = (new Date()).getTime() - timerStart;

      expect(result).toBeTruthy();
      expect(duration).toBeGreaterThan(19);
      done();
    }).catch(() => done.fail());
  });


  it('should reject after 3 default retries with waitOnRetry 10 ms on error code 503', (done) => {
    const mockErr = { code: 503 };
    const mockMethod = () => new Promise((res, rej) => {
      rej(mockErr);
    });
    const modelRetry = new adp.ModelRetry(mockMethod, [mockErr.code], 10);
    const timerStart = (new Date()).getTime();

    modelRetry.init().then(() => done.fail()).catch((error) => {
      const duration = (new Date()).getTime() - timerStart;

      expect(error.code).toBe(mockErr.code);
      expect(duration).toBeGreaterThan(19);
      done();
    });
  });

  it('should reject after first model rejection if retryOn is empty', (done) => {
    const mockErr = { code: 503 };
    const mockMethod = () => new Promise((res, rej) => {
      rej(mockErr);
    });
    const modelRetry = new adp.ModelRetry(mockMethod, [], 20);
    const timerStart = (new Date()).getTime();

    modelRetry.init().then(() => done.fail()).catch((error) => {
      const duration = (new Date()).getTime() - timerStart;

      expect(error.code).toBe(mockErr.code);
      expect(duration).toBeDefined();
      done();
    });
  });

  it('should reject if the given constructor params are invalid', (done) => {
    const retryMethodCheck = new adp.ModelRetry(1, []);

    retryMethodCheck.init().then(() => done.fail()).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });

    const retryOnCheck = new adp.ModelRetry((() => {}), 1);

    retryOnCheck.init().then(() => done.fail()).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });

    const waitOnRetry = new adp.ModelRetry((() => {}), [], -1);

    waitOnRetry.init().then(() => done.fail()).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });

    const requestLimit = new adp.ModelRetry((() => {}), [], 0, 0);

    requestLimit.init().then(() => done.fail()).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });
});
