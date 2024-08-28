const proxyquire = require('proxyquire');

const mockAsciidoctorData = {
  html: 'test Html',
  path: 'testPath',
  linenumber: 100,
  text: 'message test',
  severity: 'testSeverity',
};
const mockAsciidoctor = () => ({
  LoggerManager: {
    setLogger: () => {},
  },
  MemoryLogger: {
    $new: () => ({
      getMessages: () => [{
        getSourceLocation: () => ({
          getPath: () => mockAsciidoctorData.path,
          getLineNumber: () => mockAsciidoctorData.linenumber,
        }),
        getSeverity: () => mockAsciidoctorData.severity,
        message: { text: mockAsciidoctorData.text },
      }],
    }),
  },
  convert: () => mockAsciidoctorData.html,
});

const asciidocContr = proxyquire('./asciidoctor.controller', {
  asciidoctor: mockAsciidoctor,
});

describe('Asciidoctor Controller, ', () => {
  it('getHtml: Should return html and a set of logs logs.', (done) => {
    asciidocContr.getHtml('ascii').then((result) => {
      const log = result.logs[0];

      expect(result.html).toBe(mockAsciidoctorData.html);
      expect(log.path).toBe(mockAsciidoctorData.path);
      expect(log.linenumber).toBe(mockAsciidoctorData.linenumber);
      expect(log.text).toBe(mockAsciidoctorData.text);
      expect(log.severity).toBe(mockAsciidoctorData.severity);
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('getHtml: Should reject if the giving ascii is not type string.', (done) => {
    asciidocContr.getHtml(1).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });

  it('getHtml: Should reject if the giving ascii settings are not of type object.', (done) => {
    asciidocContr.getHtml('', 1).then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(400);
      done();
    });
  });
});
