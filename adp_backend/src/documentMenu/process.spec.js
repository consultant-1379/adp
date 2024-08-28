// ============================================================================================= //
/**
* Unit test for [ global.adp.documentMenu.process ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
describe('Testing the behavior of [ global.adp.documentMenu.process ] module.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.echoLog = () => true;
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.documentMenu = {};

    global.adp.documentMenu.rulebook = {};
    global.adp.documentMenu.rulebook.name = () => {};
    global.adp.documentMenu.rulebook.link = () => {};
    global.adp.documentMenu.rulebook.restricted = () => {};
    global.adp.documentMenu.rulebook.slug = () => {};
    global.adp.documentMenu.rulebook.checkCPI = () => {};
    global.adp.documentMenu.rulebook.notAllowedField = () => {};
    global.adp.documentMenu.rulebook.onlyOneDefaultAtMaximum = () => {};
    global.adp.documentMenu.rulebook.uniqueDocName = () => {};
    global.adp.documentMenu.rulebook.uniqueVersionName = () => {};
    global.adp.documentMenu.rulebook.removeEmptyVersions = () => {};
    global.adp.documentMenu.rulebook.versionOrderDesc = () => {};
    global.adp.documentMenu.rulebook.checkBasicIntegrity = () => {};
    global.adp.documentMenu.rulebook.schemaValidation = () => {};

    global.adp.documentMenu.process = require('./process'); // eslint-disable-line global-require
    global.adp.mock = {};
    global.adp.mock.errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ action ] Positive case for the main function', (done) => {
    const mockRawMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
      manual: {
        errors: { development: [], release: [] },
        development: [],
        release: [],
        date_modified: '',
      },
    };

    global.adp.documentMenu.process.action(mockRawMenu)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(JSON.stringify(mockRawMenu));
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeUndefined();
        done.fail();
      });
  });


  it('[ action ] Positive case for the main function (CPI and allDocsMode setted as true)', (done) => {
    const mockRawMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
      manual: {
        errors: { development: [], release: [] },
        development: [],
        release: [],
        date_modified: '',
      },
    };

    global.adp.documentMenu.process.action(mockRawMenu, null, true, true)
      .then((RESULT) => {
        expect(JSON.stringify(RESULT)).toBe(JSON.stringify(mockRawMenu));
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeUndefined();
        done.fail();
      });
  });


  it('[ transferErrorList ] Testing this method in a isolated way', (done) => {
    const mockErrorList = {
      auto: {
        errors: {
          development: ['auto mock dev error 1', 'auto mock dev error 2'],
          release: ['auto mock rel error 1', 'auto mock rel error 2', 'auto mock rel error 2'],
        },
        warnings: {
          development: ['manual mock dev warning 1', 'manual mock dev warning 2', 'manual mock dev warning 3'],
          release: ['manual mock rel warning 1', 'manual mock rel warning 2', 'manual mock rel warning 3'],
        },
      },
      manual: {
        errors: {
          development: ['manual mock dev error 1'],
          release: ['manual mock rel error 1'],
        },
        warnings: {
          development: ['manual mock dev warning 1', 'manual mock dev warning 2'],
          release: ['manual mock rel warning 1', 'manual mock rel warning 2'],
        },
      },
    };
    const mockRawMenuWhoWillGetTheErrors = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };

    global.adp.documentMenu.process
      .transferErrorList(mockRawMenuWhoWillGetTheErrors, mockErrorList);

    expect(JSON.stringify(mockRawMenuWhoWillGetTheErrors)).toBe(JSON.stringify(mockErrorList));
    done();
  });


  it('[ applyRulesOn ] Testing this method in a isolated way', (done) => {
    const targetMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
    };
    const targetMenuFinal = JSON.stringify(targetMenu);
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };

    global.adp.documentMenu.process
      .applyRulesOn(targetMenu.auto, 'auto', errorList);

    // The result should be the same ( before and after ) because rulebook are disabled.
    expect(JSON.stringify(targetMenu)).toBe(targetMenuFinal);
    done();
  });


  it('[ applyRulesByGroup ] Testing this method in a isolated way', (done) => {
    const targetMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
    };
    const targetMenuFinal = JSON.stringify(targetMenu);
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };

    global.adp.documentMenu.process
      .applyRulesByGroup(targetMenu.auto, 'development', 'auto', 'development', undefined, errorList);

    // The result should be the same ( before and after ) because rulebook are disabled.
    expect(JSON.stringify(targetMenu)).toBe(targetMenuFinal);
    done();
  });


  it('[ applyRulesByItem ] Testing this method in a isolated way', (done) => {
    const targetMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
    };
    const targetMenuFinal = JSON.stringify(targetMenu);
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };

    global.adp.documentMenu.process
      .applyRulesByItem(targetMenu.auto.release[0], 'auto', 'release', '1.0.0', errorList);

    // The result should be the same ( before and after ) because rulebook are disabled.
    expect(JSON.stringify(targetMenu)).toBe(targetMenuFinal);
    done();
  });


  it('[ checkForPreviousErrors ] Testing this method in a isolated way', (done) => {
    const targetMenu = {
      errors: {
        development: ['mock development error 1'],
        release: ['mock release error 1', 'mock release error 2'],
      },
    };
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
    const expectedErrorList = {
      auto: {
        errors: { development: ['mock development error 1'], release: ['mock release error 1', 'mock release error 2'] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
    global.adp.documentMenu.process
      .checkForPreviousErrors(targetMenu, 'auto', errorList);

    expect(JSON.stringify(errorList)).toBe(JSON.stringify(expectedErrorList));
    done();
  });


  it('[ addWarning ] Testing this method in a isolated way', (done) => {
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
    global.adp.documentMenu.process.addWarning(errorList, 'Mock Warning 1', 'auto', 'development', undefined, undefined);
    global.adp.documentMenu.process.addWarning(errorList, 'Mock Warning 2', 'auto', 'release', '1.0.0', 'Document Name');
    global.adp.documentMenu.process.addWarning(errorList, 'Mock Warning 3', 'manual', 'development', undefined, 'Another Document Name');
    global.adp.documentMenu.process.addWarning(errorList, 'Mock Warning 4', 'manual', 'release', '1.0.1', 'Testing Document Name');

    expect(errorList.auto.warnings.development[0]).toBe('Mock Warning 1');
    expect(errorList.auto.warnings.release[0]).toBe('[ 1.0.0 ] [ Document Name ] Mock Warning 2');
    expect(errorList.manual.warnings.development[0]).toBe('[ Another Document Name ] Mock Warning 3');
    expect(errorList.manual.warnings.release[0]).toBe('[ 1.0.1 ] [ Testing Document Name ] Mock Warning 4');
    done();
  });

  it('[ addError ] Testing this method in a isolated way', (done) => {
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
    global.adp.documentMenu.process.addError(errorList, 'Mock Error 1', 'auto', 'development', undefined, undefined);
    global.adp.documentMenu.process.addError(errorList, 'Mock Error 2', 'auto', 'release', '1.0.0', 'Document Name');
    global.adp.documentMenu.process.addError(errorList, 'Mock Error 3', 'manual', 'development', undefined, 'Another Document Name');
    global.adp.documentMenu.process.addError(errorList, 'Mock Error 4', 'manual', 'release', '1.0.1', 'Testing Document Name');

    expect(errorList.auto.errors.development[0]).toBe('Mock Error 1');
    expect(errorList.auto.errors.release[0]).toBe('[ 1.0.0 ] [ Document Name ] Mock Error 2');
    expect(errorList.manual.errors.development[0]).toBe('[ Another Document Name ] Mock Error 3');
    expect(errorList.manual.errors.release[0]).toBe('[ 1.0.1 ] [ Testing Document Name ] Mock Error 4');
    done();
  });


  it('[ addOnErrorList ] Testing this method in a isolated way', (done) => {
    const errorList = {
      auto: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
      manual: {
        errors: { development: [], release: [] },
        warnings: { development: [], release: [] },
      },
    };
    global.adp.documentMenu.process.addOnErrorList(errorList, 'Mock Message 1', 'auto', 'warnings', 'development');
    global.adp.documentMenu.process.addOnErrorList(errorList, 'Mock Message 2', 'auto', 'errors', 'release');
    global.adp.documentMenu.process.addOnErrorList(errorList, 'Mock Message 3', 'manual', 'errors', 'development');
    global.adp.documentMenu.process.addOnErrorList(errorList, 'Mock Message 4', 'manual', 'warnings', 'release');

    expect(errorList.auto.warnings.development[0]).toBe('Mock Message 1');
    expect(errorList.auto.errors.release[0]).toBe('Mock Message 2');
    expect(errorList.manual.errors.development[0]).toBe('Mock Message 3');
    expect(errorList.manual.warnings.release[0]).toBe('Mock Message 4');
    done();
  });

  it('[ howManyDocuments ] Testing this method in a isolated way', (done) => {
    const targetMenu = {
      auto: {
        errors: {
          development: [],
          release: [],
        },
        development: [
          {
            name: 'Valid Mock Name for Development Document',
            filepath: 'development/doc1.html',
            default: true,
          },
        ],
        release: [
          {
            version: '1.0.0',
            documents: [
              {
                name: 'Valid Mock Name for Release Document',
                filepath: '1.0.0/doc1.html',
                default: true,
              },
            ],
          },
        ],
        date_modified: '2019-08-15T10:32:27.067Z',
      },
    };
    const quant = global.adp.documentMenu.process.howManyDocuments(targetMenu, 'auto');

    expect(quant).toBe(2);
    done();
  });
});
// ============================================================================================= //
