/**
* Unit test for [ global.adp.microservice.updateAssetDocSettings ]
* @author Cein-Sven Da Costa [edaccei]
*/

let checkLinkObj;
let matchDocNameToCategoryData;

describe('Testing [ global.adp.microservice.updateAssetDocSettings ] ', () => {
  beforeEach(() => {
    checkLinkObj = { ok: true, isDownload: false };
    matchDocNameToCategoryData = { name: '', slug: '' };

    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.config = {};
    global.adp.config.siteAddress = '';

    global.adp.echoLog = () => true;

    global.adp.slugIt = arg => arg;

    global.adp.document = {};
    global.adp.document.checkLink = () => checkLinkObj;

    global.adp.documentCategory = {};
    global.adp.documentCategory.matchDocNameToCategory = () => new Promise((resolve) => {
      resolve(matchDocNameToCategoryData);
    });

    global.adp.masterCache = {};
    global.adp.masterCache.set = () => {};

    global.adp.microservice = {};
    global.adp.microservice.updateAssetDocSettings = require('./updateAssetDocSettings'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });


  it('should return the same asset object if there is nothing to update menu_auto.', async (done) => {
    const msTestObj = {
      _id: '1',
      url: 'test',
      slug: 'test',
      menu_auto: true,
      menu: {
        auto: {
          date_modified: 'date',
          development: [],
          release: [],
        },
      },
    };

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        const resultDev = result.menu.auto.development;
        const resultRel = result.menu.auto.release;

        expect(resultDev.length).toBe(0);
        expect(resultRel.length).toBe(0);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should update the menu auto true development menu settings.', async (done) => {
    const testCatSlug = 'test-cat';
    const testDocSlug = 'test-doc';
    const testMsSlug = 'test-ms';
    const testFilePath = 'test-path';
    const repoPathTest = 'repo-path';
    const testVersion = 'development';

    const testDocLocalObj = { name: testDocSlug, filepath: testFilePath, slug: testDocSlug };
    const testDocExtObj = { name: testDocSlug, external_link: testFilePath, slug: testDocSlug };

    const msTestObj = {
      _id: '1a',
      slug: testMsSlug,
      menu_auto: true,
      repo_urls: {
        development: repoPathTest,
        release: '',
      },
      menu: {
        auto: {
          date_modified: 'date',
          development: [testDocLocalObj, testDocExtObj],
          release: [],
        },
        manual: {
          date_modified: 'date',
          development: [],
          release: [],
        },
      },
    };

    const expectedInternalDocLink = `/document/${testMsSlug}/${testVersion}/${testCatSlug}/${testDocSlug}`;
    const expectedInternalUrl = `${repoPathTest}/${testFilePath}`;
    const expectedInternalMode = 'api';
    const expectedExternalMode = 'newtab';

    matchDocNameToCategoryData = { name: testCatSlug, slug: testCatSlug };

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        const docObjInternal = result.menu.auto.development[0];
        const docObjExternal = result.menu.auto.development[1];

        const [intMar, intMsSlug, intDoc, intVer, intCatSlug, intDocSug] = docObjInternal.doc_route;

        expect(docObjInternal.doc_link).toBe(expectedInternalDocLink);
        expect(docObjInternal.url).toBe(expectedInternalUrl);
        expect(intMsSlug).toBe(testMsSlug);
        expect(intDoc && intMar).toBeTruthy();
        expect(intVer).toBe(testVersion);
        expect(intCatSlug).toBe(testCatSlug);
        expect(intDocSug).toBe(testDocSlug);
        expect(docObjInternal.doc_mode).toBe(expectedInternalMode);

        expect(docObjExternal.doc_link).toBe(testFilePath);
        expect(docObjExternal.url).toBe(testFilePath);
        expect(docObjExternal.doc_route).toBeDefined();
        expect(docObjExternal.doc_mode).toBe(expectedExternalMode);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should update the menu auto true release menu settings.', async (done) => {
    const testCatSlug = 'test-cat';
    const testDocSlug = 'test-doc';
    const testMsSlug = 'test-ms';
    const testFilePath = 'test-path';
    const repoPathTest = 'repo-path';
    const testVersion = 'test-ver';

    const testDocLocalObj = { name: testDocSlug, filepath: testFilePath, slug: testDocSlug };
    const testDocExtObj = { name: testDocSlug, external_link: testFilePath, slug: testDocSlug };

    const msTestObj = {
      _id: '1a',
      slug: testMsSlug,
      menu_auto: true,
      repo_urls: {
        development: '',
        release: repoPathTest,
      },
      menu: {
        auto: {
          date_modified: 'date',
          development: [],
          release: [{
            version: testVersion,
            documents: [testDocLocalObj, testDocExtObj],
          }],
        },
        manual: {
          date_modified: 'date',
          development: [],
          release: [],
        },
      },
    };

    const expectedInternalDocLink = `/document/${testMsSlug}/${testVersion}/${testCatSlug}/${testDocSlug}`;
    const expectedInternalUrl = `${repoPathTest}/${testFilePath}`;
    const expectedInternalMode = 'api';
    const expectedExternalMode = 'newtab';

    matchDocNameToCategoryData = { name: testCatSlug, slug: testCatSlug };

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        const docObjInternal = result.menu.auto.release[0].documents[0];
        const docObjExternal = result.menu.auto.release[0].documents[1];

        const [intMar, intMsSlug, intDoc, intVer, intCatSlug, intDocSug] = docObjInternal.doc_route;

        expect(docObjInternal.doc_link).toBe(expectedInternalDocLink);
        expect(docObjInternal.url).toBe(expectedInternalUrl);
        expect(intMsSlug).toBe(testMsSlug);
        expect(intDoc && intMar).toBeTruthy();
        expect(intVer).toBe(testVersion);
        expect(intCatSlug).toBe(testCatSlug);
        expect(intDocSug).toBe(testDocSlug);
        expect(docObjInternal.doc_mode).toBe(expectedInternalMode);

        expect(docObjExternal.doc_link).toBe(testFilePath);
        expect(docObjExternal.url).toBe(testFilePath);
        expect(docObjExternal.doc_route).toBeDefined();
        expect(docObjExternal.doc_mode).toBe(expectedExternalMode);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should update the menu auto false menu settings.', async (done) => {
    const testCatSlug = 'test-cat';
    const testDocSlug = 'test-doc';
    const testMsSlug = 'test-ms';
    const testExtLink = 'test-link';
    const repoPathTest = 'repo-path';
    const devVersion = 'development';
    const relVersion = '1.0.0';

    const testDocExtObj = { name: testDocSlug, external_link: testExtLink, slug: testDocSlug };

    const msTestObj = {
      _id: '1a',
      slug: testMsSlug,
      menu_auto: false,
      repo_urls: {
        development: repoPathTest,
        release: '',
      },
      menu: {
        auto: {
          date_modified: 'date',
          development: [],
          release: [],
        },
        manual: {
          date_modified: 'date',
          development: [JSON.parse(JSON.stringify(testDocExtObj))],
          release: [{
            version: relVersion,
            documents: [JSON.parse(JSON.stringify(testDocExtObj))],
          }],
        },
      },
    };

    const expectedExternalMode = 'newtab';

    matchDocNameToCategoryData = { name: testCatSlug, slug: testCatSlug };

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        const docObjDev = result.menu.manual.development[0];
        const docObjRel = result.menu.manual.release[0].documents[0];

        const [devMar, devMsSlug, devDoc, devVer, devCatSlug, devDocSug] = docObjDev.doc_route;
        const [relMar, relMsSlug, relDoc, relVer, relCatSlug, relDocSug] = docObjRel.doc_route;
        // Development
        expect(devMsSlug).toBe(testMsSlug);
        expect(devDoc && devMar).toBeTruthy();
        expect(devVer).toBe(devVersion);
        expect(devCatSlug).toBe(testCatSlug);
        expect(devDocSug).toBe(testDocSlug);

        expect(docObjDev.doc_link).toBe(testExtLink);
        expect(docObjDev.url).toBe(testExtLink);
        expect(docObjDev.doc_route).toBeDefined();
        expect(docObjDev.doc_mode).toBe(expectedExternalMode);


        // // release
        expect(relMsSlug).toBe(testMsSlug);
        expect(relDoc && relMar).toBeTruthy();
        expect(relVer).toBe(relVersion);
        expect(relCatSlug).toBe(testCatSlug);
        expect(relDocSug).toBe(testDocSlug);

        expect(docObjRel.doc_link).toBe(testExtLink);
        expect(docObjRel.url).toBe(testExtLink);
        expect(docObjRel.doc_route).toBeDefined();
        expect(docObjRel.doc_mode).toBe(expectedExternalMode);

        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });


  it('should set mode to newtab if restricted is true not matter the document type for manual documents.', async (done) => {
    checkLinkObj = { ok: true, isDownload: false };
    const testDocExtObj = {
      name: 'test', external_link: 'externalLink', slug: 'external link', restricted: true,
    };

    const msTestObj = {
      _id: 'test',
      slug: 'test',
      menu_auto: false,
      repo_urls: { development: '', release: '' },
      menu: {
        auto: { date_modified: 'date', development: [], release: [] },
        manual: {
          date_modified: 'date',
          development: [JSON.parse(JSON.stringify(testDocExtObj))],
          release: [],
        },
      },
    };

    const expectedExternalMode = 'newtab';

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        expect(result.menu.manual.development[0].doc_mode).toBe(expectedExternalMode);
        expect(result.menu.manual.development[0].doc_link).toBe(testDocExtObj.external_link);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });

  it('should set mode to newtab if restricted is true not matter the document type for auto documents.', async (done) => {
    checkLinkObj = { ok: true, isDownload: true };
    const testDocExtObj = {
      name: 'test', filepath: 'relativeDir', restricted: true,
    };

    const msTestObj = {
      _id: 'test',
      slug: 'test',
      menu_auto: true,
      repo_urls: { development: '', release: '' },
      menu: {
        manual: { date_modified: 'date', development: [], release: [] },
        auto: {
          date_modified: 'date',
          development: [JSON.parse(JSON.stringify(testDocExtObj))],
          release: [],
        },
      },
    };

    const expectedExternalMode = 'newtab';

    global.adp.microservice.updateAssetDocSettings(msTestObj)
      .then((result) => {
        expect(result.menu.auto.development[0].doc_mode).toBe(expectedExternalMode);
        expect(result.menu.auto.development[0].doc_link).not.toBe(testDocExtObj.filepath);
        expect(result.menu.auto.development[0].doc_link).toContain(msTestObj.slug);
        done();
      }).catch(() => {
        expect(true).toBeFalsy();
        done();
      });
  });
});
