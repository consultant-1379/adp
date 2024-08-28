// ============================================================================================= //
/**
* Unit test for [ global.adp.microservice.create ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
class MockAdp {
  createOne(MOCKJSON) {
    return new Promise((resolve) => {
      if (MOCKJSON.errorOnSave === true) {
        resolve({ ok: false, id: MOCKJSON.id });
      } else {
        resolve({ ok: true, id: MOCKJSON.id });
      }
    });
  }
}
class MockEchoLog {
  createOne(MOCKJSON) {
    return new Promise((resolve) => {
      resolve({ ok: true, id: MOCKJSON.id });
    });
  }
}
class mockTeamHistoryController {
  fetchLatestSnapshotsMsList() {
    return new Promise(RES => RES());
  }
}

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

describe('Testing if [ global.adp.microservice.create ] is able to create a MicroService (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.models.EchoLog = MockEchoLog;
    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = mockTeamHistoryController;
    adp.queue = {};
    adp.queue.addJob = () => new Promise(RES => RES());
    adp.queue.startJobs = () => new Promise(RES => RES());
    adp.queue.obtainObjectiveLink = (STR, BOL) => `mock_${STR}_${BOL}`;
    adp.echoLog = t1 => t1;
    adp.clone = J => JSON.parse(JSON.stringify(J));
    adp.docs = {};
    adp.docs.list = [];
    adp.notification = {};
    adp.notification.sendAssetMail = (ID, TYPE, MS) => new Promise((RESOLVE, REJECT) => {
      if (MS.sendAssetMail === true) {
        RESOLVE();
      } else {
        const mockError = 'mockError on sendAssetMail';
        REJECT(mockError);
      }
    });
    adp.tags = {};
    adp.tags.checkIt = TAGS => new Promise((RES, REJ) => {
      if (TAGS.includes('49bfab89e2ab4b291d84b4dd7c026945')) {
        RES(RES);
      } else {
        const mockError = 'MockError';
        REJ(mockError);
      }
    });
    adp.migration = {};
    adp.migration.checkCpiInMSDocs = MS => new Promise(RES => RES(MS));
    global.adp.microservice = {};
    global.adp.microservice.synchronizeWithElasticSearch = () => new Promise(RES => RES());
    global.adp.microservice.menuCheckIfShouldCallDocumentRefresh = MS => MS.activateMenu;
    global.adp.microservice.menuApplyRulesOnManual = OBJ => new Promise((RESOLVE, REJECT) => {
      if (OBJ === undefined) {
        return RESOLVE(OBJ);
      }
      if (OBJ.menuApplyRulesOnManual === false) {
        return REJECT(OBJ);
      }
      return RESOLVE(OBJ);
    });
    global.adp.microservice.menuBasicStructure = menu => menu;
    global.adp.microservice.create = require('./create');
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
    global.adp.db = {};
    global.adp.db.create = (MOCKDB, MOCKJSON) => new Promise((RESOLVE) => {
      if (MOCKJSON.errorOnSave === true) {
        RESOLVE({ ok: false, id: MOCKJSON.id });
      } else {
        RESOLVE({ ok: true, id: MOCKJSON.id });
      }
    });
    global.adp.microservice.validateSchema = MOCKJSON => MOCKJSON.return;
    global.adp.microservice.validateListOptionSelections = () => new Promise((RESOLVE) => {
      RESOLVE({
        valid: true,
        errorList: [],
      });
    });
    global.adp.microservice.CRUDLog = () => true;
    global.adp.slugIt = ms => ms;
    global.adp.user = {};
    global.adp.user.createFromTeam = () => new Promise((RESOLVE) => {
      RESOLVE(true);
    });
    adp.assetValidation = {};
    global.adp.assetValidation.AssetValidationClass = mockAssetvalidation;

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
    global.mockExpect = null;
    global.mockBehaviour = null;
    global.adp = null;
  });


  it('Testing with a valid mock JSON.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      domain: 2,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing with missing domain field for service category other than 1 and 2.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((errorResp) => {
        expect(errorResp).toBeDefined();
        done();
      });
  });

  it('Testing with domain field equal to 1 for service category either 1 or 2.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 1,
      domain: 1,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing with check_cpi equal to true for service category other than 1 or 2.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 4,
      domain: 2,
      check_cpi: true,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((errorResp) => {
        expect(errorResp).toBeDefined();
        done();
      });
  });

  it('Testing with a invalid mock JSON.', (done) => {
    const validMockJSON = {
      name: 'test',
      return: false,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('Testing "restricted" === 1, with "restricted_description".', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      restricted: 1,
      restricted_description: 'something',
      domain: 2,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Testing "restricted" === 1, without "restricted_description". Should return error."', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      restricted: 1,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should create if service_maturity is RFCU if restricted not set, has giturl, helmurl', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      giturl: 'test',
      helmurl: 'test',
      service_category: 1,
      service_maturity: 7,
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should no longer fail to create if service_maturity is RFCU and restricted is set', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      giturl: 'test',
      helmurl: 'test',
      service_category: 1,
      service_maturity: 7,
      signum: 'estest',
      return: true,
      domain: 1,
      restricted: 1,
      restricted_description: 'test',
    };
    global.adp.microservice.create(validMockJSON)
      .then((result) => {
        expect(result).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        done.fail(expectedOBJ);
      });
  });

  it('should fail to create if service_maturity for RFI(5) up if the helm url is missing.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      giturl: 'test',
      service_category: 4,
      service_maturity: 5,
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should fail to create if service_maturity for DS(8) up if the git url is missing.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      service_category: 4,
      service_maturity: 8,
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should create if service_maturity Idea does not have a git url or helm url.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      service_category: 1,
      service_maturity: 1,
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should fail to create if service_maturity RFNCU does not have restriction set.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      service_category: 1,
      service_maturity: 6,
      giturl: 'test',
      helmurl: 'test',
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.mockBehaviour.restrictedvalidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      });
  });

  it('should create if service_maturity RFNCU does have restriction set.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      service_category: 1,
      service_maturity: 6,
      restricted: 1,
      restricted_description: 'test',
      giturl: 'test',
      helmurl: 'test',
      signum: 'estest',
      return: true,
      domain: 1,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('should fail to update if the listoption selectid check fails.', (done) => {
    const validMockJSON = {
      service_category: 1,
      service_maturity: 6,
      restricted: 1,
      restricted_description: 'test',
      giturl: 'test',
      helmurl: 'test',
      domain: 1,
      signum: 'estest',
      return: true,
    };
    global.adp.microservice.validateListOptionSelections = () => new Promise((RESOLVE) => {
      RESOLVE({
        valid: false,
        errorList: ['test'],
      });
    });

    global.adp.microservice.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });


  // "Domain" should not be provided if "Service Category" is "ADP Generics Services".
  it('Testing protection against domain !== 1 if service_category is 1.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 1,
      domain: 2,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // "Domain" can be provided if "Service Category" is "ADP Reusable Specific".
  // Domain not provided case
  it('Testing domain = 1 if service_category is 2.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      domain: 1,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  // "Domain" can be provided if "Service Category" is "ADP Reusable Specific".
  // Domain provided case
  it('Testing domain = 2 if service_category is 2.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      domain: 2,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  // "Domain" should be provided if "Service Category" is not
  // "ADP Generics Services" or "ADP Reusable Specific".
  it('Testing negative case where domain is 1 and service_category is 3 (not 1 or 2).', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 3,
      domain: 1,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // "Domain" should be provided if "Service Category" is not
  // "ADP Generics Services" or "ADP Reusable Specific".
  it('Testing successfull case where domain is 2 and service_category is 3 (not 1 or 2).', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 3,
      domain: 2,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  // [giturl] is mandatory if [service_maturity] is 5, 6, 7 or 8 and service_category is 1 or 2.
  it('Testing protection against giturl is undefined if service_maturity is 5, 6, 7 or 8.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 1,
      service_maturity: 5,
      giturl: undefined,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.gitValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [giturl] is mandatory if [service_maturity] is 5, 6, 7 or 8 and service_category is 1 or 2.
  it('Testing protection against giturl is an empty string if service_maturity is 5, 6, 7 or 8.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      service_maturity: 6,
      giturl: '',
      domain: 1,
      return: true,
    };
    global.mockBehaviour.gitValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [helmurl] is mandatory if [service_maturity] is 5, 6 or 7 and service_category is 1 or 2.
  it('Testing protection against helmurl is undefined if service_maturity is 5, 6 or 7.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 1,
      service_maturity: 6,
      giturl: 'https://something/',
      helmurl: undefined,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.helmUrlValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [helmurl] is mandatory if [service_maturity] is 5, 6 or 7 and service_category is 1 or 2.
  it('Testing protection against helmurl is an empty string if service_maturity is 5, 6 or 7.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      service_maturity: 7,
      giturl: 'https://something/',
      helmurl: '',
      domain: 1,
      return: true,
    };
    global.mockBehaviour.helmUrlValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Testing protection against helmchart_name is an empty string if service_maturity is 5, 6 or 7.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      service_maturity: 7,
      giturl: 'https://something/',
      helmurl: '',
      domain: 1,
      return: true,
    };
    global.mockBehaviour.helmChartNameValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // [restricted] is mandatory if [service_maturity] === 6 if [service_category] === 1 or 2
  it('Testing protection against restricted is undefined if service_maturity 6.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 1,
      service_maturity: 6,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: undefined,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.restrictedvalidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [restricted] must not be set if [service_maturity] === 7 if [service_category] === 1 or 2
  it('Testing protection against restricted not undefined if service_maturity 7.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      service_category: 2,
      service_maturity: 7,
      giturl: 'https://something/',
      helmurl: 'https://something/',
      restricted: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.restrictedvalidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  // [restricted] If restricted === 1, restricted_description cannot be null
  it('Testing protection against restricted_description be an empty string if restricted === 1.', (done) => {
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
      restricted_description: '',
      return: true,
    };
    global.mockBehaviour.restrictedDescriptionValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [tags] Tags Validation
  it('Testing protection against problems with tags, with invalid tags.', (done) => {
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
        '5c2941141c64cfbcea47e8b16006111a',
        '5c2941141c64cfbcea47e8b160066b59',
      ],
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [tags] Tags Validation
  it('Testing protection against problems with tags, with valid tags.', (done) => {
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
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [DuplicatedName]
  it('Testing protection against duplicated microservice name.', (done) => {
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
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [DuplicatedName]
  it('Testing protection against duplicated microservice name, if cannot check.', (done) => {
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
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [Name]
  it('Testing protection against invalid name ( name is not a string ).', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 123,
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
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [DB]
  it('Testing if was not possible to save the microservice into database.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 123,
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
      return: false,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh]
  it('Testing when menuCheckIfShouldCallDocumentRefresh returns false.', (done) => {
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
      activateMenu: false,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh]
  it('Testing when call documentRefresh and returns no errors.', (done) => {
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
      activateMenu: true,
      documentRefresh: 1,
      sendAssetMail: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh]
  it('Testing when call documentRefresh and returns with errors.', (done) => {
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
      activateMenu: true,
      documentRefresh: 2,
      sendAssetMail: false,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuCheckIfShouldCallDocumentRefresh]
  it('Testing when documentRefresh reject the promise.', (done) => {
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
      activateMenu: true,
      documentRefresh: 0,
      sendAssetMail: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      })
      .catch(() => {
        done.fail();
      });
  });


  // [menuApplyRulesOnManual]
  it('Testing when menuApplyRulesOnManual reject the promise.', (done) => {
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
      activateMenu: true,
      documentRefresh: 0,
      sendAssetMail: true,
      menu: { menuApplyRulesOnManual: false },
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      });
  });


  // [global.adp.db.create]
  it('Testing a simulation of error on global.adp.db.create.', (done) => {
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
      errorOnSave: true,
      activateMenu: true,
      documentRefresh: 3,
      sendAssetMail: false,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      });
  });


  it('Checking rule: If service_category is 4, reusability_level should be 4. Successful case.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      domain: 2,
      service_category: 4,
      reusability_level: 4,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Checking rule: If service_category is 4, reusability_level should be 4. Negative case.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      domain: 2,
      service_category: 4,
      reusability_level: 3,
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });

  it('Checking rule: If additional_information is given with valid details. Successful case.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      domain: 2,
      additional_information: [{
        category: 'tutorial',
        title: 'title',
        link: 'https://something/',
      }],
      return: true,
    };
    global.adp.microservice.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Checking rule: If additional_information is given with Invalid details. Negative case.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      domain: 2,
      additional_information: [{
        category: '',
        link: 'https://something/',
      }],
      return: true,
    };
    global.mockBehaviour.additionalInfoValidation = false;
    global.adp.microservice.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });
});
// ============================================================================================= //
