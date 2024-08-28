// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.update ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class mockAssetvalidation {
  uniqueAssetNameCheck() {
    if (global.mockBehaviour.uniqueAssetNameCheck) {
      return true;
    } return false;
  }

  helmChartNameValidation() {
    if (global.mockBehaviour.helmChartNameValidation) {
      return true;
    } return false;
  }

  helmUrlValidation() {
    if (global.mockBehaviour.helmUrlValidation) {
      return true;
    } return false;
  }

  restrictedDescriptionValidation() {
    if (global.mockBehaviour.restrictedDescriptionValidation) {
      return true;
    } return false;
  }

  additionalInfoValidation() {
    if (global.mockBehaviour.additionalInfoValidation) {
      return null;
    } return ['mockerror in additional information validation'];
  }

  tagsValidation() {
    if (global.mockBehaviour.tagsValidation) {
      return null;
    } return false;
  }

  componentServiceValidation() {
    if (global.mockBehaviour.componentServiceValidation) {
      return ['MockValid componenet service'];
    } return false;
  }

  domainValidation() {
    if (global.mockBehaviour.domainValidation) {
      return true;
    } return false;
  }

  checkCPIValidation() {
    if (global.mockBehaviour.checkCPIValidation) {
      return true;
    } return false;
  }

  gitValidation() {
    if (global.mockBehaviour.gitValidation) {
      return true;
    } return false;
  }

  teamHistoryCheck() {}
}
class MockAdp {
  getById(KEY) {
    return new Promise((RESOLVE, REJECT) => {
      if (KEY === 'MOCKVALIDID') {
        const obj = {
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
        };
        const objArray = [obj];
        RESOLVE({ docs: objArray, totalInDatabase: 10, v: KEY });
      } else if (KEY === 'MOCKBIGEXAMPLE') {
        const validMockJSON = {
          name: 'test',
          signum: 'estest',
          service_category: 3,
          service_maturity: 7,
          domain: 2,
          giturl: 'https://something/',
          helmurl: 'https://something/',
          restricted: 1,
          restricted_description: 'something',
          tags: [
            '49bfab89e2ab4b291d84b4dd7c026945',
            '5c2941141c64cfbcea47e8b16006111a',
            '5c2941141c64cfbcea47e8b160066b59',
          ],
          force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
          return: true,
        };
        RESOLVE({ docs: [validMockJSON], totalInDatabase: 1, v: KEY });
      } else if (KEY === 'MOCKGETERROR1') {
        RESOLVE({ docs: {}, totalInDatabase: 0, v: KEY });
      } else if (KEY === 'MOCKGETERROR2') {
        RESOLVE({ docs: ['mockDoc1', 'mockDoc2'], totalInDatabase: 0, v: KEY });
      } else {
        const errorOBJ = {};
        REJECT(errorOBJ);
      }
    });
  }

  update() {
    return new Promise((RESOLVE, REJECT) => {
      if (global.mockBehaviour.update) {
        RESOLVE({ ok: true });
      } else if (global.mockBehaviour.update === 'false') {
        RESOLVE({ ok: false });
      } else {
        REJECT();
      }
    });
  }
}

describe('Testing if [ global.adp.assembly.update ] is able to update a MicroService (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.queue = {};
    adp.queue.obtainObjectiveLink = () => 'mockQueueURL';
    adp.queue.addJob = () => new Promise((RES) => {
      RES({ queue: `MockQueueID_${(new Date()).getTime()}` });
    });
    adp.models = {};
    adp.models.Adp = MockAdp;
    global.adp.mockUSR = {
      role: 'admin',
      signum: 'mockadmin',
    };
    global.adp.mockUSRAuthor = {
      role: 'author',
      signum: 'mockauthor',
    };
    global.adp.masterCache = {};
    global.adp.masterCache.clear = () => {};
    global.adp.clone = OBJ => OBJ;
    global.adp.echoLog = () => true;
    global.adp.tags = {};
    global.adp.tags.checkIt = TAGS => new Promise((RES, REJ) => {
      if (TAGS.includes('49bfab89e2ab4b291d84b4dd7c026945')) {
        RES(RES);
      } else {
        const mockError = 'MockError';
        REJ(mockError);
      }
    });
    global.adp.docs = {};
    global.adp.docs.list = [];
    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = class mockTeamHistoryClass {
      teamOnMsUpdate() {
        this.ans = true;
        return this.ans;
      }
    };
    global.adp.permission = {};
    global.adp.permission
      .fieldIsEditableByPermissionRules = (MS, USR) => new Promise((RESOLVE, REJECT) => {
        if (USR === 'mockadmin') {
          RESOLVE();
        }
        if (USR === 'mockauthor') {
          if (MS.force_fieldIsEditableByPermissionRules_reject === true) {
            const error = 'MockError';
            REJECT(error);
          } else if (MS.force_fieldIsEditableByPermissionRules_arrayWithReadOnly === true) {
            RESOLVE(['domain', 'giturl']);
          } else if (MS.force_fieldIsEditableByPermissionRules_emptyArray === true) {
            RESOLVE([]);
          } else {
            RESOLVE();
          }
        }
      });

    global.adp.integration = {};
    global.adp.integration.documentRefresh = {};
    global.adp.integration.documentRefresh.update = MS => new Promise((RESOLVE, REJECT) => {
      if (MS.documentRefresh === 1) {
        const obj = { dbResponse: MS, yamlErrorsQuant: 0 };
        RESOLVE(obj);
      } else if (MS.documentRefresh === 2) {
        const obj = { dbResponse: MS, yamlErrorsQuant: 1 };
        RESOLVE(obj);
      } else if (MS.documentRefresh === 3) {
        const obj = { dbResponse: undefined, yamlErrorsQuant: 0 };
        RESOLVE(obj);
      } else {
        const mockError = 'ERROR';
        REJECT(mockError);
      }
    });

    global.adp.notification = {};
    global.adp.notification.sendAssetMail = () => new Promise(RESOLVE => RESOLVE());
    global.adp.notification.processEmailObject = require('../notification/processEmailObject');
    global.adp.microservice = {};
    global.adp.microservice.synchronizeWithElasticSearch = () => new Promise(RES => RES());
    global.adp.microservice.menuApplyRulesOnManual = OBJ => new Promise((RESOLVE, REJECT) => {
      if (global.mockBehaviour.menuApplyRulesOnManual) {
        RESOLVE(OBJ);
      } else {
        const error = ['Mock Error from menuApplyRulesOnManual'];
        REJECT(error);
      }
    });
    global.adp.microservice.menuPrepareDocumentBeforeProceed = require('../microservice/menuPrepareDocumentBeforeProceed');
    global.adp.microservice.menuCheckIfShouldCallDocumentRefresh = (newMS) => {
      if (newMS.force_askToCallDocumentRefresh === true) {
        return true;
      }
      return false;
    };

    adp.assetValidation = {};
    global.adp.assetValidation.AssetValidationClass = mockAssetvalidation;
    global.adp.microservice.menuBasicStructure = menu => menu;
    global.adp.migration = {};
    adp.migration.checkCpiInMSDocs = MS => new Promise(RES => RES(MS));
    global.adp.migration.slugItNow = MS => new Promise((RESOLVE) => {
      if (MS.force_slugItNow === true) {
        const ms = MS;
        ms.slug = 'mockslug';
        RESOLVE(ms);
      } else {
        RESOLVE(true);
      }
    });
    global.adp.microservice.checkName = name => new Promise((RESOLVE, REJECT) => {
      if (name === 'DuplicatedName') {
        const mockError = 'DUPLICATE';
        REJECT(mockError);
      } else if (name === 'CantCheckThis') {
        const mockError = 'MockDBError';
        REJECT(mockError);
      } else {
        RESOLVE(true);
      }
    });
    global.adp.assembly = {};
    global.adp.assembly.update = proxyquire('./update', {
      './../library/errorLog': (code, desc, data, origin, packName) => ({
        code, desc, data, origin, packName,
      }),
    });

    global.adp.microservice.CRUDLog = () => true;
    global.adp.microservice.validateSchema = (MOCKJSON) => {
      if (MOCKJSON.name === 'MOCKSCHEMAERROR') {
        return ['mock error on schema'];
      }
      return MOCKJSON;
    };
    global.adp.microservice.validateListOptionSelections = () => new Promise((RESOLVE) => {
      RESOLVE({
        valid: true,
        errorList: [],
      });
    });

    global.adp.user = {};
    global.adp.user.createFromTeam = () => new Promise((RESOLVE) => {
      RESOLVE(true);
    });

    global.mockExpect = {};
    global.mockBehaviour = {};
    global.mockBehaviour.uniqueAssetNameCheck = true;
    global.mockBehaviour.componentServiceValidation = true;
    global.mockBehaviour.checkCPIValidation = true;
    global.mockBehaviour.domainValidation = true;
    global.mockBehaviour.gitValidation = true;
    global.mockBehaviour.helmChartNameValidation = true;
    global.mockBehaviour.helmUrlValidation = true;
    global.mockBehaviour.restrictedDescriptionValidation = true;
    global.mockBehaviour.additionalInfoValidation = true;
    global.mockBehaviour.update = true;
    global.mockBehaviour.menuApplyRulesOnManual = true;
  });

  afterEach(() => {
    global.mockExpect = null;
    global.mockBehaviour = null;
    global.adp = null;
  });

  it('Testing with a valid mock ID and JSON.', async (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((expectedOBJ) => {
        expect(validMockJSON.date_modified).toBeTruthy();
        expect(expectedOBJ).toEqual({
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
          queueStatusLinkDocSync: 'mockQueueURL',
        });
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing with a valid mock ID and JSON but models.adp.update() sends error', async (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.update = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(500);
        done();
      });
  });

  it('Testing with an invalid mock ID and JSON.', async (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('Required fields are not defined in assembly object');
        done();
      });
  });

  it('Testing with an when getByID sends error.', async (done) => {
    const validMockID = 'ERROFORGETID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });

  it('Testing with an when menuApplyRulesOnManual sends error.', async (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.menuApplyRulesOnManual = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('Mock Error from menuApplyRulesOnManual');
        done();
      });
  });

  it('Testing if [global.adp.db.get] give an invalid answer.', (done) => {
    const validMockID = 'MOCKGETERROR1';
    const validMockJSON = { somethingToUpdate: true, domain: 2 };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });

  it('Testing if [global.adp.db.get] give another invalid answer.', (done) => {
    const validMockID = 'MOCKGETERROR2';
    const validMockJSON = { somethingToUpdate: true, domain: 2 };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(404);
        done();
      });
  });

  it('Testing if [global.adp.microservice.validateSchema] returns some errors.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      name: 'MOCKSCHEMAERROR', somethingToUpdate: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('mock error on schema');
        done();
      });
  });

  it('should fail to update if the listoption selectid check fails.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1,
      service_maturity: 6,
      restricted: 1,
      restricted_description: 'test',
      giturl: 'test',
      helmurl: 'test',
      domain: 1,
    };
    global.adp.microservice.validateListOptionSelections = () => new Promise((RESOLVE) => {
      RESOLVE({
        valid: false,
        errorList: ['test'],
      });
    });
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });

  it('Testing if unique name validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.uniqueAssetNameCheck = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('"differentName" is not an unique name. Cannot create an Assembly');
        done();
      });
  });

  it('Testing if domain validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.domainValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".');
        done();
      });
  });

  it('Testing if git validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.gitValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[giturl] is mandatory when creating Assembly');
        done();
      });
  });

  it('Testing if helmChartName validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.helmChartNameValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[helm_chartname] is mandatory if [assembly_maturity] === 2.');
        done();
      });
  });

  it('Testing if helmURL validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.helmUrlValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[helmurl] is mandatory if [assembly_maturity] === 2.');
        done();
      });
  });

  it('Testing if restrictedDescriptionValidation validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.restrictedDescriptionValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[restricted_description] is mandatory if [restricted] === 1.');
        done();
      });
  });

  it('Testing if additionalInfoValidation validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      assembly_maturity: 2,
    };
    global.mockBehaviour.additionalInfoValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('mockerror in additional information validation');
        done();
      });
  });

  // [tags] Tags Validation
  it('Testing protection against problems with tags, with invalid tags.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'MOCKVALIDID',
      name: 'test',
      signum: 'estest',
      assembly_category: 1,
      assembly_maturity: 2,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      tags: [
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe('MockError');
        done();
      });
  });


  // [tags] Tags Validation
  it('Testing protection against problems with tags, with valid tags.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 1,
      assembly_maturity: 2,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing if componentServiceValidation validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      assembly_maturity: 2,
    };
    global.mockBehaviour.componentServiceValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing if checkCPIValidation validation sends error.', async (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      name: 'differentName',
      assembly_category: 1,
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      assembly_maturity: 2,
    };
    global.mockBehaviour.checkCPIValidation = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[cpi_check] should not be provided if [assembly_category] === 1.');
        done();
      });
  });

  // [ReadOnly Protection - User is Author, but with problems]
  it('Testing "ReadOnly Fields" if the user is author but [fieldIsEditableByPermissionRules] reject the promise.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 3,
      assembly_maturity: 7,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_reject: true,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe('MockError');
        done();
      });
  });

  // [ReadOnly Protection - User is Author - Blocked by some fields ]
  it('Testing "ReadOnly Fields" if the user is author - blocked by some readonly fields.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 3,
      assembly_maturity: 7,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('Permission Denied. You should be Admin of the \'Domain\' to change its \'Giturl\'.');
        done();
      });
  });

  // [Slug Generation, inval_secret Protection ]
  it('Testing the slug generation and inval_secret protection.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_slugItNow: true,
      inval_secret: 'something injected',
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  // [menuCheckIfShouldCallDocumentRefresh returns true]
  it('Testing if [global.adp.microservice.menuCheckIfShouldCallDocumentRefresh] returns true.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_askToCallDocumentRefresh: true,
      documentRefresh: 1,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing if [global.adp.microservice.menuCheckIfShouldCallDocumentRefresh] returns true. but update rejects', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_askToCallDocumentRefresh: true,
      documentRefresh: 1,
      return: true,
    };
    global.mockBehaviour.update = false;
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(500);
        done();
      });
  });

  // [menuCheckIfShouldCallDocumentRefresh returns true, documentRefresh return errors]
  it('Testing when [menuCheckIfShouldCallDocumentRefresh] === true but documentRefresh return errors.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_askToCallDocumentRefresh: true,
      documentRefresh: 2,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh returns true, documentRefresh.dbResponse is undefined. ]
  it('Testing when [menuCheckIfShouldCallDocumentRefresh] === true but documentRefresh.dbResponse is undefined.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_askToCallDocumentRefresh: true,
      documentRefresh: 3,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh returns true,
  // documentRefresh.dbResponse rejects the promise. ]
  it('Testing when [menuCheckIfShouldCallDocumentRefresh] === true but documentRefresh.dbResponse rejects the promise.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_category: 4,
      reusability_level: 4,
      assembly_maturity: 8,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '49bfab89e2ab4b291d84b4dd7c026945',
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      force_fieldIsEditableByPermissionRules_arrayWithReadOnly: true,
      force_askToCallDocumentRefresh: true,
      documentRefresh: 4,
      return: true,
    };
    global.adp.assembly.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
