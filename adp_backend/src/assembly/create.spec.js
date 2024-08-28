// ============================================================================================= //
/**
* Unit test for [ global.adp.assembly.create ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
const mockErrorLog = (code, desc, data, origin, packName) => {
  if (!global.mockBehavior) global.mockBehavior = {};
  if (!global.mockBehavior.ErrorLog) global.mockBehavior.ErrorLog = {};
  global.mockBehavior.ErrorLog.args = {
    code, desc, data, origin, packName,
  };
  return global.mockBehavior.ErrorLog.args;
};
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
}

describe('Testing if [ global.adp.assembly.create ] is able to create an Assembly (SIMULATION)', () => {
  beforeEach(() => {
    global.adp = {};
    adp.models = {};
    adp.models.Adp = MockAdp;
    adp.models.EchoLog = MockEchoLog;
    global.adp.echoLog = () => true;
    adp.teamHistory = {};
    adp.teamHistory.TeamHistoryController = mockTeamHistoryController;
    adp.assetValidation = {};
    global.adp.assetValidation.AssetValidationClass = mockAssetvalidation;
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
        const mockError = 'mockerror in tags validation';
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

    global.adp.assembly = {};
    global.adp.assembly.create = proxyquire('./create.js', {
      './../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.mockExpect = null;
    global.mockBehaviour = null;
    global.adp = null;
  });

  it('Testing with a valid mock JSON.', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      tags: ['49bfab89e2ab4b291d84b4dd7c026945'],
      assembly_category: 1,
      return: true,
    };
    await global.adp.assembly.create(validMockJSON)
      .then((expectedOBJ) => {
        expect(expectedOBJ).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Testing with an invalid mock JSON.', async (done) => {
    const validMockJSON = {
      id: 'test',
      tags: [],
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      return: false,
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeFalsy();
        done();
      });
  });

  it('Testing if assembly does not have unique name', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.uniqueAssetNameCheck = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('"test" is not an unique name. Cannot create an Assembly');
        done();
      });
  });

  it('Testing if required fields are not given', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      domain: 1,
      return: true,
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('Required fields are not defined in the Assembly Object');
        done();
      });
  });

  it('When Domain Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.domainValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('"Domain" is not provided or set Domain as "Common Asset" if "Assembly Category" is "Common Assembly".');
        done();
      });
  });

  it('When Git Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.gitValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[giturl] is mandatory when creating an Assembly');
        done();
      });
  });

  it('When Helm Chart Name Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.helmChartNameValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[helm_chartname] is mandatory if [assembly_maturity] === 2.');
        done();
      });
  });

  it('When Helm URL Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.helmUrlValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[helmurl] is mandatory if [assembly_maturity] === 2.');
        done();
      });
  });

  it('When Restricted Description Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.restrictedDescriptionValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[restricted_description] is mandatory if [restricted] === 1.');
        done();
      });
  });

  it('When Additional Information Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.additionalInfoValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('mockerror in additional information validation');
        done();
      });
  });

  it('When Tags Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      tags: [],
      domain: 1,
      return: true,
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe('mockerror in tags validation');
        done();
      });
  });

  it('When Component Service Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.mockBehaviour.componentServiceValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then((RESULT) => {
        expect(RESULT).toBeDefined();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('When CPI Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      component_service: ['FakeError'],
      domain: 1,
      return: true,
    };
    global.mockBehaviour.checkCPIValidation = false;
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('[cpi_check] should not be provided if [assembly_category] === 1.');
        done();
      });
  });

  it('When Name Validaion sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 2,
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR[0]).toBe('2 is not a valid name. Cannot create.');
        done();
      });
  });

  // [menuApplyRulesOnManual]
  it('When menuApplyRulesOnManual sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
      menu: { menuApplyRulesOnManual: false },
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.menuApplyRulesOnManual).toBeFalsy();
        setTimeout(() => { done(); }, 2000);
      });
  });

  // [global.adp.db.create]
  it('When global.adp.db.create sends error', async (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
      errorOnSave: true,
    };
    await global.adp.assembly.create(validMockJSON)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBe(500);
        setTimeout(() => { done(); }, 2000);
      });
  });

  it('should fail to update if the listoption selectid check fails.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
    };
    global.adp.microservice.validateListOptionSelections = () => new Promise((RESOLVE) => {
      RESOLVE({
        valid: false,
        errorList: ['test'],
      });
    });
    global.adp.assembly.create(validMockJSON)
      .then(() => {
        expect(false).toBeTruthy();
        done();
      })
      .catch((error) => {
        expect(error).toBeDefined();
        done();
      });
  });

  // [menuCheckIfShouldCallDocumentRefresh]
  it('Testing when menuCheckIfShouldCallDocumentRefresh returns false.', (done) => {
    const validMockJSON = {
      id: 'test',
      name: 'test',
      signum: 'estest',
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
      activateMenu: false,
    };
    global.adp.assembly.create(validMockJSON)
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
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
      activateMenu: true,
      documentRefresh: 1,
    };
    global.adp.assembly.create(validMockJSON)
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
      assembly_maturity: 2,
      assembly_category: 1,
      domain: 1,
      return: true,
      activateMenu: true,
      documentRefresh: 2,
      sendAssetMail: false,
    };
    global.adp.assembly.create(validMockJSON)
      .then(() => {
        // There is code running after RESOLVE();
        // So let's give some time to finish.
        setTimeout(() => { done(); }, 100);
      })
      .catch(() => {
        done.fail();
      });
  });
});
