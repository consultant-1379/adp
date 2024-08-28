const proxyquire = require('proxyquire');
/**
* Unit test [ global.adp.document.getDocument ]
* @author Cein-Sven Da Costa [edaccei]
*/
describe('[ global.adp.document.getDocument ].', () => {
  let mockCacheGet;
  let mockCheckLink;
  let mockGetFileFromGerrit;
  let mockAdpGetMsByDocumentUrl;
  let mockgetFileFromArtifactory;
  let mockListoptions;
  let mockAsciiToHtml;
  let mockGetIncludesArray;
  let mockErrorLog;

  const mockMetrics = {
    customMetrics: {
      gerritRespMonitoringHistogram: {
        observe: () => {},
      },
    },
  };

  beforeEach(() => {
    mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    mockCacheGet = {
      ok: false,
      data: {
        data: {
          body: 'cached doc',
          title: 'cached title',
          category: 'cached category',
        },
      },
    };

    mockCheckLink = {
      ok: true,
      mode: 1, // 1 - gerrit, 2 - artifactory, 3 - gitweb
    };

    mockGetFileFromGerrit = {
      res: true,
      data: 'test content',
    };

    mockAdpGetMsByDocumentUrl = {
      res: true,
      data: {
        docs: [],
      },
    };

    mockgetFileFromArtifactory = {
      res: true,
      data: {},
      DOCFULLSLUGLINK: '',
    };

    mockListoptions = [
      {
        id: 7, // categories
        items: [{ id: 1, name: 'lsOptCategory' }],
      },
      {
        id: 8, // titles
        items: [{ id: 1, name: 'lsOptTitle' }, { id: 11, name: '11thTitle' }],
      },
    ];

    mockAsciiToHtml = {
      res: true,
      data: {
        html: '',
        logs: [],
      },
    };

    mockGetIncludesArray = null;

    global.adp = null;
    global.adp = {};

    global.adp.docs = {};
    global.adp.docs.list = [];

    global.adp.echoLog = () => {};
    global.adp.getSizeInMemory = () => '1';
    global.adp.timeStamp = () => 1;

    global.adp.config = {};
    global.adp.config.siteAddress = 'testUrl';

    global.adp.listOptions = {};
    global.adp.listOptions.cache = {};
    global.adp.listOptions.cache.options = JSON.stringify(mockListoptions);

    global.adp.cache = {};
    global.adp.cache.document = '';
    global.adp.cache.get = () => mockCacheGet;
    global.adp.cache.set = () => {};

    global.adp.models = {};
    global.adp.models.Adp = class Adp {
      getMsByDocumentUrl() {
        return new Promise((res, rej) => {
          if (mockAdpGetMsByDocumentUrl.res) {
            res(mockAdpGetMsByDocumentUrl.data);
          } else {
            rej(mockAdpGetMsByDocumentUrl.data);
          }
        });
      }
    };

    adp.asciidoctorService = {};
    adp.asciidoctorService.AsciidoctorController = class AsciidoctorController {
      asciiToHtml() {
        return new Promise((res, rej) => {
          if (mockAsciiToHtml.res) {
            res(mockAsciiToHtml.data);
          } else {
            rej(mockAsciiToHtml.data);
          }
        });
      }
    };

    global.adp.document = {};
    global.adp.document.clearImage = () => Promise.resolve();
    global.adp.document.checkLink = () => mockCheckLink;
    global.adp.document.getFileFromGerrit = () => new Promise((RESOLVE, REJECT) => {
      if (mockGetFileFromGerrit.res) {
        RESOLVE(mockGetFileFromGerrit.data);
      } else {
        REJECT(mockGetFileFromGerrit.data);
      }
    });

    global.adp.document.getFileFromArtifactory = (theLink, slugLink) => new Promise((res, rej) => {
      mockgetFileFromArtifactory.DOCFULLSLUGLINK = slugLink;
      if (mockgetFileFromArtifactory.res) {
        res(mockgetFileFromArtifactory.data);
      } else {
        rej(mockgetFileFromArtifactory.data);
      }
    });

    global.adp.document.getIncludesArray = () => mockGetIncludesArray;
    global.adp.document.solveHTMLImagePath = HTML => HTML;
    global.adp.document.solveHTMLImageSizes = HTML => HTML;
    global.adp.document.solveHTMLExternalLink = HTML => HTML;

    global.adp.document.getThatInclude = (URL, BASEURL) => {
      if (BASEURL !== null && BASEURL !== undefined) {
        return global.adp.document.getFileFromGerrit(URL);
      }
      return '';
    };
    global.adp.document.isJustALink = (TEXT) => {
      const result = (TEXT !== null) ? null : undefined;
      return result;
    };

    global.adp.document.getDocument = proxyquire('./getDocument', {
      '../metrics/register': mockMetrics,
      '../library/errorLog': mockErrorLog,
    });
  });

  afterAll(() => {
    global.adp = null;
  });

  it('should return the cached document if the cache is set.', (done) => {
    mockCacheGet.ok = true;
    global.adp.document.getDocument('test?a=blob_plain').then((result) => {
      const expectedObj = mockCacheGet.data.data;

      expect(result.msg.body).toBe(expectedObj.body);
      expect(result.msg.title).toBe(expectedObj.title);
      expect(result.msg.category).toBe(expectedObj.category);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should return a document from gerrit that does not need asciidoctor conversion(case 1).', (done) => {
    global.adp.document.getDocument('test').then((result) => {
      expect(result.msg[0]).toBe(mockGetFileFromGerrit.data);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should return a document from artifactory(case 2) cache with body defined, title & category should not be found and docFullSlugLink will be a empty string.', (done) => {
    mockCheckLink.mode = 2;
    mockgetFileFromArtifactory.data = {
      fromcache: 'cache test',
      html: 'html test',
    };

    global.adp.document.getDocument('test').then((result) => {
      expect(result.ok).toBeTruthy();
      expect(result.fromcache).toBe(mockgetFileFromArtifactory.data.fromcache);
      expect(result.msg.title).toBe('Document not in Database');
      expect(result.msg.category).toBe('Category not in Database');
      expect(result.msg.body).toBe(mockgetFileFromArtifactory.data.html);
      expect(mockgetFileFromArtifactory.DOCFULLSLUGLINK).toBe('');
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should return a document from artifactory(case 2), title & category should be found and docFullSlugLink will return the path to the microservice due to the document not having a slug.', (done) => {
    const testDoc = {
      url: 'testUrl',
      categoryId: 1,
      titleId: 1,
    };
    const msSlug = 'msSlug';

    mockCheckLink.mode = 2;
    mockAdpGetMsByDocumentUrl.data.docs = [{
      slug: msSlug,
      documentation: [testDoc],
    }];
    mockgetFileFromArtifactory.data = {
      fromcache: 'cache test',
      html: 'html test',
    };

    const expectedDocFullSlugLink = `${global.adp.config.siteAddress}/document/${msSlug}`;
    const expectedCategory = mockListoptions[0].items[0].name;
    const expectedTitle = mockListoptions[1].items[0].name;

    global.adp.document.getDocument(testDoc.url).then((result) => {
      expect(result.ok).toBeTruthy();
      expect(result.fromcache).toBe(mockgetFileFromArtifactory.data.fromcache);
      expect(result.msg.category).toBe(expectedCategory);
      expect(result.msg.title).toBe(expectedTitle);
      expect(result.msg.body).toBe(mockgetFileFromArtifactory.data.html);
      expect(mockgetFileFromArtifactory.DOCFULLSLUGLINK).toBe(expectedDocFullSlugLink);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should return a document from artifactory(case 2), the title should be the title of the document for titleId 11 & docFullSlugLink should include the document slug.', (done) => {
    const testDoc = {
      url: 'testUrl',
      categoryId: 1,
      titleId: 11,
      title: 'docTitle',
      slug: 'docSlugPart1/docSlugPart2',
    };
    const msSlug = 'msSlug';

    mockCheckLink.mode = 2;
    mockAdpGetMsByDocumentUrl.data.docs = [{
      slug: msSlug,
      documentation: [testDoc],
    }];
    mockgetFileFromArtifactory.data = {
      fromcache: 'cache test',
      html: 'html test',
    };

    const expectedDocFullSlugLink = `${global.adp.config.siteAddress}/document/${msSlug}/${testDoc.slug}`;
    const expectedCategory = mockListoptions[0].items[0].name;
    const expectedTitle = testDoc.title;

    global.adp.document.getDocument(testDoc.url).then((result) => {
      expect(result.ok).toBeTruthy();
      expect(result.fromcache).toBe(mockgetFileFromArtifactory.data.fromcache);
      expect(result.msg.category).toBe(expectedCategory);
      expect(result.msg.title).toBe(expectedTitle);
      expect(result.msg.body).toBe(mockgetFileFromArtifactory.data.html);
      expect(mockgetFileFromArtifactory.DOCFULLSLUGLINK).toBe(expectedDocFullSlugLink);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should reject a document from artifactory(case 2) if the fetched content is undefined.', (done) => {
    mockCheckLink.mode = 2;
    mockgetFileFromArtifactory.data = {
      fromcache: 'cache test',
    };

    global.adp.document.getDocument('test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(404);
      done();
    });
  });

  it('should resolve a document from artifactory(case 2) if download is set.', (done) => {
    mockCheckLink.mode = 2;
    mockgetFileFromArtifactory.data = {
      fromcache: 'cache test',
      download: 'downloadSet',
    };

    global.adp.document.getDocument('test').then((result) => {
      expect(result.download).toBe(mockgetFileFromArtifactory.data.download);
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });

  it('should reject a document from artifactory(case 2) if getFileFromArtifactory rejects.', (done) => {
    mockCheckLink.mode = 2;
    mockgetFileFromArtifactory.res = false;

    global.adp.document.getDocument('test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.code).toBe(500);
      done();
    });
  });


  // xit('should reject a document from gitweb(case 3) if getFileFromGerrit rejects.', (done) => {
  //   mockCheckLink.mode = 3;
  //   mockGetFileFromGerrit.res = false;
  //   mockGetFileFromGerrit.data = { msg: 'error', code: 500 };

  //   global.adp.document.getDocument('test').then(() => {
  //     expect(false).toBeTruthy();
  //     done();
  //   }).catch((error) => {
  //     expect(error.code).toBe(500);
  //     done();
  //   });
  // });

  // xit('should resolve a document from gitweb(case 3) without includes.', (done) => {
  //   const expectedCategory = 'testCategory';
  //   const expectedTitle = 'testTitle';

  //   mockCheckLink.mode = 3;
  //   mockGetFileFromGerrit.data = 'testContent';
  //   mockAsciiToHtml.data = {
  //     html: 'convertedTestContent',
  //     logs: ['testLog'],
  //   };

  //   global.adp.document
  // .getDocument('test', '', expectedTitle, expectedCategory).then((result) => {
  //     expect(result.ok).toBeTruthy();
  //     expect(result.fromcache).toBeFalsy();
  //     expect(result.warnings[0]).toBe(mockAsciiToHtml.data.logs[0]);
  //     expect(result.msg.title).toBe(expectedTitle);
  //     expect(result.msg.category).toBe(expectedCategory);
  //     expect(result.msg.body).toBe(mockAsciiToHtml.data.html);
  //     done();
  //   }).catch(() => {
  //     expect(false).toBeTruthy();
  //     done();
  //   });
  // });

  // xit('should reject a document from gitweb(case 3) without includes
  // if asciiToHtml rejects or does not return the html key.', async () => {
  //   mockCheckLink.mode = 3;
  //   mockGetFileFromGerrit.data = 'testContent';
  //   mockAsciiToHtml.data = {
  //     html: 'convertedTestContent',
  //     logs: ['testLog'],
  //   };
  //   mockAsciiToHtml.res = false;

  //   await global.adp.document.getDocument('test').then(() => {
  //     expect(false).toBeTruthy();
  //   }).catch((error) => {
  //     expect(error.code).toBe(500);
  //   });


  //   mockAsciiToHtml.data = {};
  //   mockAsciiToHtml.res = true;

  //   await global.adp.document.getDocument('test').then(() => {
  //     expect(false).toBeTruthy();
  //   }).catch((error) => {
  //     expect(error.code).toBe(500);
  //   });
  // });

  it('should reject if Adp.getMsByDocumentUrl rejects.', (done) => {
    mockAdpGetMsByDocumentUrl.res = false;
    mockAdpGetMsByDocumentUrl.data = 'test error';

    global.adp.document.getDocument('test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error.data.error).toBe(mockAdpGetMsByDocumentUrl.data);
      done();
    });
  });

  // xit('should return a document from gitweb(case 3) with includes.', (done) => {
  //   const expectedCategory = 'testCategory';
  //   const expectedTitle = 'testTitle';

  //   mockCheckLink.mode = 3;
  //   mockGetFileFromGerrit.data = 'testContent';
  //   mockAsciiToHtml.data = {
  //     html: 'convertedTestContent',
  //     logs: ['testLog'],
  //   };
  //   mockGetIncludesArray = [
  //     'include::nameOfTheFile.js',
  //     'include::../nameOfTheSecondFile.js',
  //     'include::../../folder/nameOfTheThirdFile.js',
  //   ];
  //   mockAsciiToHtml.data = {
  //     html: 'convertedTestContent',
  //     logs: ['testLog'],
  //   };

  //   global.adp.document
  // .getDocument('test', '', expectedTitle, expectedCategory).then((result) => {
  //     expect(result.ok).toBeTruthy();
  //     expect(result.fromcache).toBeFalsy();
  //     expect(result.warnings[0]).toBe(mockAsciiToHtml.data.logs[0]);
  //     expect(result.msg.title).toBe(expectedTitle);
  //     expect(result.msg.category).toBe(expectedCategory);
  //     expect(result.msg.body).toBe(mockAsciiToHtml.data.html);
  //     done();
  //   }).catch(() => {
  //     expect(false).toBeTruthy();
  //     done();
  //   });
  // });

  it('should reject if getFileFromGerrit rejects.', (done) => {
    mockGetFileFromGerrit.res = false;
    mockGetFileFromGerrit.data = 'test error';
    global.adp.document.getDocument('test').then(() => {
      expect(false).toBeTruthy();
      done();
    }).catch((error) => {
      expect(error).toBe(mockGetFileFromGerrit.data);
      done();
    });
  });

  // xit('should reject a document from gitweb(case 3) with includes
  // if asciiToHtml rejects or does not return the html key.', async () => {
  //   mockCheckLink.mode = 3;
  //   mockGetFileFromGerrit.data = 'testContent';
  //   mockAsciiToHtml.data = {
  //     html: 'convertedTestContent',
  //     logs: ['testLog'],
  //   };
  //   mockGetIncludesArray = [
  //     'include::nameOfTheFile.js',
  //     'include::../nameOfTheSecondFile.js',
  //     'include::../../folder/nameOfTheThirdFile.js',
  //   ];

  //   mockAsciiToHtml.res = false;

  //   await global.adp.document.getDocument('test').then(() => {
  //     expect(false).toBeTruthy();
  //   }).catch((error) => {
  //     expect(error.code).toBe(500);
  //   });


  //   mockAsciiToHtml.data = {};
  //   mockAsciiToHtml.res = true;

  //   await global.adp.document.getDocument('test').then(() => {
  //     expect(false).toBeTruthy();
  //   }).catch((error) => {
  //     expect(error.code).toBe(500);
  //   });
  // });


  it('Should reject if the given document link is not of type string.', async () => {
    const { getDocument } = global.adp.document;
    const nullrej = await getDocument(null).then(() => false).catch(() => true);
    const arrRej = await getDocument([]).then(() => false).catch(() => true);
    const objRej = await getDocument({}).then(() => false).catch(() => true);
    const undefRej = await getDocument().then(() => false).catch(() => true);

    expect(nullrej).toBeTruthy();
    expect(arrRej).toBeTruthy();
    expect(objRej).toBeTruthy();
    expect(undefRej).toBeTruthy();
  });

  it('should resolve if the link check rejects.', (done) => {
    mockCheckLink.ok = false;
    global.adp.document.getDocument('test').then((expectedOBJ) => {
      expect(expectedOBJ.ok).toBeFalsy();
      done();
    }).catch(() => {
      expect(false).toBeTruthy();
      done();
    });
  });
});
