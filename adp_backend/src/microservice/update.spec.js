// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.update ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class mockAssetvalidation {
  teamHistoryCheck() {}

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

  restrictedvalidation() {
    if (global.mockBehaviour.restrictedvalidation) {
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
          id: 'test',
          name: 'test',
          signum: 'estest',
          service_category: 3,
          service_maturity: 7,
          domain: 2,
          giturl: 'https://something/',
          helmurl: 'https://something/',
          helm_chartname: 'something',
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
    return new Promise((RESOLVE) => {
      RESOLVE({ ok: true });
    });
  }
}
describe('Testing if [ global.adp.microservice.update ] is able to update a MicroService (SIMULATION)', () => {
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
    adp.assetValidation = {};
    global.adp.assetValidation.AssetValidationClass = mockAssetvalidation;
    global.adp.microservice = {};
    global.adp.microservice.synchronizeWithElasticSearch = () => new Promise(RES => RES());
    global.adp.microservice.menuApplyRulesOnManual = OBJ => new Promise(RESOLVE => RESOLVE(OBJ));
    global.adp.microservice.menuPrepareDocumentBeforeProceed = require('./menuPrepareDocumentBeforeProceed');
    global.adp.microservice.menuCheckIfShouldCallDocumentRefresh = (newMS) => {
      if (newMS.force_askToCallDocumentRefresh === true) {
        return true;
      }
      return false;
    };
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
    global.adp.microservice.update = proxyquire('./update', {
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
    global.mockBehaviour.restrictedvalidation = true;
    global.mockBehaviour.restrictedDescriptionValidation = true;
    global.mockBehaviour.additionalInfoValidation = true;
  });

  afterEach(() => {
    global.adp = null;
    global.mockExpect = null;
    global.mockBehaviour = null;
  });

  it('Testing with a valid mock ID and JSON.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = { somethingToUpdate: true, domain: 2 };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
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
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing with missing domain field if service_category is other than 1 or 2.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = { somethingToUpdate: true, service_category: 3 };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((errorResp) => {
        expect(errorResp).toBeDefined();
        done();
      });
  });

  it('Testing with a invalid mock ID and JSON. Should return 404.', (done) => {
    const validMockID = 'MOCKINVALIDID';
    const validMockJSON = { somethingToUpdate: false };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toEqual(404);
        done();
      });
  });

  it('Testing "restricted" === 1, with "restricted_description"', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true, restricted: 1, restricted_description: 'something', domain: 2,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toEqual({
          _id: 'MOCKVALIDID',
          _rev: 'ABC',
          queueStatusLinkDocSync: 'mockQueueURL',
        });
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing "restricted" === 1, without "restricted_description". Should return error.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = { somethingToUpdate: true, restricted: 1 };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        global.adp = null;
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        global.adp = null;
        done();
      });
  });

  it('should fail to update if service_maturity for RFI(5) up if the helm url is missing.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      giturl: 'test',
      service_category: 4,
      reusability_level: 4,
      service_maturity: 5,
      domain: 1,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should fail to update if service_maturity for DS(8) up if the git url is missing.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
      domain: 1,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should fail to update if service_maturity RFNCU does not have restriction set.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1,
      service_maturity: 6,
      giturl: 'test',
      helmurl: 'test',
      domain: 1,
    };
    global.mockBehaviour.restrictedvalidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
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

    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });


  it('Testing if [global.adp.db.get] give an invalid answer.', (done) => {
    const validMockID = 'MOCKGETERROR1';
    const validMockJSON = { somethingToUpdate: true, domain: 2 };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('Testing if [global.adp.db.get] give another invalid answer.', (done) => {
    const validMockID = 'MOCKGETERROR2';
    const validMockJSON = { somethingToUpdate: true, domain: 2 };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing if [global.adp.microservice.validateSchema] returns some errors.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      name: 'MOCKSCHEMAERROR', somethingToUpdate: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // "Domain" should not be provided if "Service Category"
  // is "ADP Generics Services" .
  it('Testing protection against domain if service_category is 1.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1, domain: 2, somethingToUpdate: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing protection against missing restrictedvalidation', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 2, service_maturity: 5, domain: 2, somethingToUpdate: true,
    };
    global.mockBehaviour.restrictedvalidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[restricted] is mandatory if [service_maturity] === 6 if [service_catgory] === 2.');
        done();
      });
  });

  // service_maturity === [ 5, 6, 7 or 8] requires git url.
  it('Testing protection against missing giturl if service_maturity is 5, 6, 7 or 8.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1, service_maturity: 5, domain: 1, somethingToUpdate: true,
    };
    global.mockBehaviour.gitValidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[giturl] is mandatory if [service_maturity] === 5.');
        done();
      });
  });


  // service_maturity === [ 5, 6 or 7] requires helm url.
  it('Testing protection against missing helmurl if service_maturity is 5, 6 or 7.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1, service_maturity: 5, giturl: 'something', domain: 1, somethingToUpdate: true,
    };
    global.mockBehaviour.helmUrlValidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // service_maturity === [ 5, 6 or 7] requires helm chartname.
  it('Testing protection against missing chartname if service_maturity is 5, 6 or 7.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1, service_maturity: 5, giturl: 'something', domain: 1, somethingToUpdate: true,
    };
    global.mockBehaviour.helmChartNameValidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // Testing when restricted is 1 but restricted_description is undefined.
  it('Testing protection against restricted_description is undefined when restricted is 1.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1,
      service_maturity: 5,
      giturl: 'something',
      helmurl: 'something',
      domain: 1,
      somethingToUpdate: true,
      restricted: 1,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // Testing when restricted is 1 but restricted_description is not a string.
  it('Testing protection against restricted_description is not a string when restricted is 1.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1,
      service_maturity: 5,
      giturl: 'something',
      helmurl: 'something',
      domain: 1,
      somethingToUpdate: true,
      restricted: 1,
      restricted_description: 123,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // Testing when restricted is 1 but restricted_description is an empty string.
  it('Testing protection against restricted_description is an empty string when restricted is 1.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      service_category: 1,
      service_maturity: 5,
      giturl: 'something',
      helmurl: 'something',
      domain: 1,
      somethingToUpdate: true,
      restricted: 1,
      restricted_description: '',
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
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
      service_category: 3,
      service_maturity: 7,
      domain: 2,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      restricted_description: 'something',
      tags: [
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
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
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [DuplicatedName]
  it('Testing protection against duplicated microservice name.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
      name: 'DuplicatedName',
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
      return: true,
    };
    global.mockBehaviour.uniqueAssetNameCheck = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [DuplicatedName]
  it('Testing protection against duplicated microservice name, if cannot check.', async (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
      name: 'CantCheckThis',
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
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [No User x ReadOnly Protection]
  it('Testing "ReadOnly Fields" if there is no user.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [ReadOnly Protection - User is Admin]
  it('Testing "ReadOnly Fields" if the user is admin.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [ReadOnly Protection - User is Author, but with problems]
  it('Testing "ReadOnly Fields" if the user is author but [fieldIsEditableByPermissionRules] reject the promise.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
      force_fieldIsEditableByPermissionRules_reject: true,
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [ReadOnly Protection - User is Author - Successful ]
  it('Testing "ReadOnly Fields" if the user is author - successful in this case.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [ReadOnly Protection - User is Author - Blocked by some fields ]
  it('Testing "ReadOnly Fields" if the user is author - blocked by some readonly fields.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [ReadOnly Protection - User is Author - Empty Array ]
  it('Testing "ReadOnly Fields" if the user is author - Empty ReadOnly Fields Array.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      id: 'test',
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
      force_fieldIsEditableByPermissionRules_emptyArray: true,
      return: true,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [ReadOnly Protection - User is Author - Success, even with ReadOnly fields ]
  it('Testing "ReadOnly Fields" if the user is author - Success, even with ReadOnly fields.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [ReadOnly Protection - User is Author - Fail because change some ReadOnly fields ]
  it('Testing "ReadOnly Fields" if the user is author - Fail because change some ReadOnly fields.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
      domain: 3,
      giturl: 'https://something/change',
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done.fail();
      })
      .catch(() => {
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
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
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
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh returns true, documentRefresh return errors]
  it('Testing when [menuCheckIfShouldCallDocumentRefresh] === true but documentRefresh return errors.', (done) => {
    const validMockID = 'MOCKBIGEXAMPLE';
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
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
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
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
      service_category: 4,
      reusability_level: 4,
      service_maturity: 8,
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
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSRAuthor)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Checking rule: If service_category is 4, reusability_level should be 4. Successful case.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      service_category: 4,
      reusability_level: 4,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((expectedOBJ) => {
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


  it('Checking rule: If service_category is 4, reusability_level should be 4. Negative case.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      service_category: 4,
      reusability_level: 3,
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Checking rule: If additional_information is given with valid details. Successful case.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      additional_information: [{
        category: 'demo',
        title: 'title update',
        link: 'https://something/',
      }],
    };
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then((expectedOBJ) => {
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

  it('Checking rule: If additional_information is given with Invalid details. Negative case.', (done) => {
    const validMockID = 'MOCKVALIDID';
    const validMockJSON = {
      somethingToUpdate: true,
      domain: 2,
      additional_information: [{
        category: '',
        link: 'https://something/',
      }],
    };
    global.mockBehaviour.additionalInfoValidation = false;
    global.adp.microservice.update(validMockID, validMockJSON, global.adp.mockUSR)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
