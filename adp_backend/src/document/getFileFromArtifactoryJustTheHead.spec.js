// ============================================================================================= //
/**
* Unit test for [ global.adp.document.getFileFromArtifactoryJustTheHead ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
/* eslint-disable global-require */
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing [ global.adp.document.getFileFromArtifactoryJustTheHead ] behavior.', () => {
  beforeEach(() => {
    // ----------------------------------------------------------------------------------------- //
    global.adp = {};
    // ----------------------------------------------------------------------------------------- //
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.echoLog = () => {};

    global.request = (SETUP, CALLBACK) => {
      const response = {};
      response.headers = {
        'x-artifactory-filename': 'mockfile.zip',
        'last-modified': '2020-03-18T14:30:00.000Z',
        'x-checksum-sha1': '789456123066565',
        'x-checksum-sha256': '455415153566556',
        'x-checksum-md5': '8456611511515',
        'content-length': '123',
      };
      CALLBACK(null, response);
    };
    global.adp.document = {};
    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    global.adp.document.getFileFromArtifactoryJustTheHead = proxyquire('./getFileFromArtifactoryJustTheHead', {
      '../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('If is able to request only the a Document file for download (SIMULATION)', (done) => {
    const url = 'https://externaldoc.test.com/folder/test-document.doc';
    const httpRequestHeaders = { mock: 'HTTPRequestHeader' };
    const expectedAnwser = '{"file":"mockfile.zip","lastModified":"2020-03-18T14:30:00.000Z","sha1":"789456123066565","sha256":"455415153566556","md5":"8456611511515","length":"123"}';

    global.adp.document.getFileFromArtifactoryJustTheHead(url, httpRequestHeaders)
      .then((RESULT) => {
        expect(RESULT).toBe(expectedAnwser);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
