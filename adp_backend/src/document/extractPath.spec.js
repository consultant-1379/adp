/**
* Unit test [ global.adp.document.extractPath ]
* @author Cein-Sven Da Costa [edaccei]
*/


describe('Testing [ global.adp.document.extractPath ], ', () => {
  beforeEach(() => {
    adp = {};
    adp.docs = {};
    adp.docs.list = [];

    adp.echoLog = () => {};

    adp.document = {};
    adp.document.extractPath = require('./extractPath');
  });

  afterEach(() => {
    adp = null;
  });

  it('Should return a gerrit branch url for all types of master given gerrit documents.', () => {
    const testProject = 'test/project.git';
    const testFile = 'test/file.adoc';
    const testbranchHead = 'HEAD';
    const testbranchMaster = 'refs/heads/master';

    const expectedProject = 'test%2fproject';
    const expectedFile = 'test%2ffile.adoc';
    const expectedUrl = `https://gerrit-gamma.gic.ericsson.se/a/projects/${expectedProject}/branches/master/files/${expectedFile}/content`;

    const resultHead = adp.document.extractPath(`https://gerrit-gamma.gic.ericsson.se/gitweb?p=${testProject};a=blob_plain;f=${testFile};hb=${testbranchHead}`);
    const resultMaster = adp.document.extractPath(`https://gerrit-gamma.gic.ericsson.se/gitweb?p=${testProject};a=blob_plain;f=${testFile};hb=${testbranchMaster}`);

    expect(resultHead).toBe(expectedUrl);
    expect(resultMaster).toBe(expectedUrl);
  });

  it('Should return a gerrit commit url for any given url with hb(commitId) that is not HEAD or refs/heads/master.', () => {
    const testProject = 'test/project.git';
    const testFile = 'test/file.adoc';
    const testCommitId = '123';

    const expectedProject = 'test%2fproject';
    const expectedFile = 'test%2ffile.adoc';
    const expectedUrl = `https://gerrit-gamma.gic.ericsson.se/a/projects/${expectedProject}/commits/${testCommitId}/files/${expectedFile}/content`;

    const result = adp.document.extractPath(`https://gerrit-gamma.gic.ericsson.se/gitweb?p=${testProject};a=blob_plain;f=${testFile};hb=${testCommitId}`);

    expect(result).toBe(expectedUrl);
  });
});
