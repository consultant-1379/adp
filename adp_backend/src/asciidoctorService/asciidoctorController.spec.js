/**
* Unit test for [ adp.asciidoctorService.AsciidoctorController ]
* @author Cein-Sven Da Costa [edaccei]
*/
describe('Testing if [ adp.asciidoctorService.AsciidoctorController ]', () => {
  let mockAsciiToHtmlReq;
  beforeEach(() => {
    mockAsciiToHtmlReq = {
      error: null,
      resp: { statusCode: 200 },
      body: 'test',
    };

    global.request = {
      post: (header, callback) => callback(
        mockAsciiToHtmlReq.error,
        mockAsciiToHtmlReq.resp,
        mockAsciiToHtmlReq.body,
      ),
    };

    adp = {};
    adp.config = {};
    adp.config.asciidoctorService = '';

    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => true;

    adp.asciidoctorService = {};
    adp.asciidoctorService.AsciidoctorController = require('./AsciidoctorController');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('asciiToHtml: should return correct body data', (done) => {
    const asciiDoc = new adp.asciidoctorService.AsciidoctorController();
    asciiDoc.asciiToHtml('', {}).then((result) => {
      expect(result).toBe(mockAsciiToHtmlReq.body);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('asciiToHtml: should reject if the ascii param is not a string', (done) => {
    const asciiDoc = new adp.asciidoctorService.AsciidoctorController();
    asciiDoc.asciiToHtml(1).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('asciiToHtml: should reject if the settings param is not an object', (done) => {
    const asciiDoc = new adp.asciidoctorService.AsciidoctorController();
    asciiDoc.asciiToHtml('', 1).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('asciiToHtml: should reject if the request returns an error', (done) => {
    mockAsciiToHtmlReq.error = 'error';
    const asciiDoc = new adp.asciidoctorService.AsciidoctorController();
    asciiDoc.asciiToHtml('').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });

  it('asciiToHtml: should reject if the request returns a response code that is not 200', (done) => {
    const expRespCode = 401;
    mockAsciiToHtmlReq.resp.statusCode = expRespCode;

    const asciiDoc = new adp.asciidoctorService.AsciidoctorController();
    asciiDoc.asciiToHtml('').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(expRespCode);
      done();
    });
  });
});
