const proxyquire = require('proxyquire');

/**
* Unit test for [ global.adp.document.getFileFromGerrit ]
* @author Cein-Sven Da Costa [edaccei]
*/
describe('[ global.adp.document.getFileFromGerrit ]', () => {
  let mockRequestGet;
  let mockErrorLog;
  beforeEach(() => {
    mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });
    mockRequestGet = {
      throw: false,
      data: {
        error: null,
        res: { statusCode: 200 },
        body: '',
      },
    };

    global.request = {};
    global.request.get = (header, callback) => {
      if (mockRequestGet.throw) {
        throw mockRequestGet.data;
      } else {
        const { error, res, body } = mockRequestGet.data;
        return callback(error, res, body);
      }
    };

    global.adp = {};

    global.adp.config = {};
    global.adp.config.eadpusersPassword = '';

    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.echoLog = () => true;

    global.adp.document = {};
    global.adp.document.extractPath = () => 'url';

    global.adp.document.getFileFromGerrit = proxyquire('./getFileFromGerrit', {
      '../library/errorLog': mockErrorLog,
    });
  });

  afterAll(() => {
    global.adp = null;
  });

  it('should return gerrit file content.', (done) => {
    mockRequestGet.data.body = 'testContent';

    const expectedB64Body = Buffer.from(mockRequestGet.data.body, 'base64').toString('ascii');

    global.adp.document.getFileFromGerrit().then((result) => {
      expect(result).toBe(expectedB64Body);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should return gerrit file content on redirect.', (done) => {
    mockRequestGet.data.body = 'testContent';
    mockRequestGet.data.res.statusCode = 302;

    global.adp.document.getFileFromGerrit().then((result) => {
      expect(result).toBe(mockRequestGet.data.body);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should reject if callback returns error.', (done) => {
    mockRequestGet.data.body = 'testContent';
    mockRequestGet.data.error = 'callback error';

    global.adp.document.getFileFromGerrit().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      expect(error.data.error).toBe(mockRequestGet.data.error);
      done();
    });
  });

  it('should reject if the function user cannont access gerret with code 500.', (done) => {
    mockRequestGet.data.res.statusCode = 401;

    global.adp.document.getFileFromGerrit().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      expect(error.data.error).toContain('unauthorized access');
      done();
    });
  });

  it('should reject if the callback status code is 404.', (done) => {
    mockRequestGet.data.res.statusCode = 404;

    global.adp.document.getFileFromGerrit().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(mockRequestGet.data.res.statusCode);
      done();
    });
  });

  it('should reject if callback status code is not 200 or 302.', (done) => {
    mockRequestGet.data.res.statusCode = 500;
    mockRequestGet.data.res.body = 'testError';

    global.adp.document.getFileFromGerrit().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBe(mockRequestGet.data.res.body);
      done();
    });
  });

  it('should reject if the request throws an error.', (done) => {
    mockRequestGet.throw = true;
    mockRequestGet.data = 'testError';

    global.adp.document.getFileFromGerrit().then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.data.error).toBe(mockRequestGet.data);
      expect(error.code).toBe(500);
      done();
    });
  });
});
