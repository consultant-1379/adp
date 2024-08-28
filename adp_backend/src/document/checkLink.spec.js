// ============================================================================================= //
/**
* Unit test for [ global.adp.document.checkLink ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.document.checkLink ] with expected and unexpected parameters.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.config = {};
    global.adp.config.eridocServer = 'https://erid2rest.internal.ericsson.com/';
    global.adp.document = {};
    global.adp.document.checkLink = require('./checkLink'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('[ global.adp.document.checkLink ] with a valid Gerrit URL.', () => {
    const testThis = 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cm.git;a=blob_plain;f=doc/CM_Service_Deployment_Guide/CM_Service_Deployment_Guide.txt;hb=705b3ce6075b17948778bc24820035e7d3370fbb';
    const returnOfTest = global.adp.document.checkLink(testThis);

    expect(returnOfTest.ok).toBeTruthy();
  });

  it('[ global.adp.document.checkLink ] with a valid Gerrit URL, but missing two parameters: Should return an ERROR.', () => {
    const testThis = 'https://gerrit-gamma.gic.ericsson.se/gitweb?p=adp-gs/adp-gs-cm.git;a=blob_plain;';

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with an valid Gerrit URL, but without parameters on the URL: Should return an ERROR.', () => {
    const testThis = 'https://gerrit-gamma.gic.ericsson.se/gitweb';

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with an empty String as parameter: Should return an ERROR.', () => {
    const testThis = '';

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with a Number as parameter: Should return an ERROR.', () => {
    const testThis = 25;

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with an Array as parameter: Should return an ERROR.', () => {
    const testThis = [];

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with an Object as parameter: Should return an ERROR.', () => {
    const testThis = {};

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with a Null as parameter: Should return an ERROR.', () => {
    const testThis = null;

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with an Undefined as parameter: Should return an ERROR.', () => {
    const testThis = undefined;

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });

  it('[ global.adp.document.checkLink ] with another URL as parameter: Should return an ERROR.', () => {
    const testThis = 'http://adp.ericsson.se/';

    expect(global.adp.document.checkLink(testThis).ok).toBeFalsy();
  });
});
// ============================================================================================= //
