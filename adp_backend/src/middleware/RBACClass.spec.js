// ============================================================================================= //
/**
* Unit test for [ adp.middleware.RBACClass ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class MockModelAdp {
  getAllAssetsIDsByDomain() {
    if (adp.models && adp.models.break === true) {
      return new Promise((RES, REJ) => REJ());
    }
    return new Promise(RES => RES(global.mockDataBase.adp));
  }

  getAllAssetsIDsByServiceOwner(QUERY) {
    if (!adp.models.adpMock.allassetIdsBySerOwn.res) {
      return Promise.reject();
    }
    if (QUERY[0] === 'eserviceonwer') {
      return new Promise(RES => RES({ docs: global.mockDataBase.serviceOnwerAssets }));
    }
    return new Promise(RES => RES({ docs: [] }));
  }

  msSearch(QUERY) {
    const mockObj = adp.models.adpMock.msSearch;

    if (mockObj.res && mockObj.data !== null) {
      return Promise.resolve(mockObj.data);
    }

    if (!mockObj.res) {
      return Promise.reject();
    }

    if (Array.isArray(QUERY) && QUERY.length === 0) {
      const { docs } = adp.clone(global.mockDataBase.adp);
      const cloned = adp.clone(global.mockDataBase.adp);
      cloned.docs = [{ microservices: docs }];
      return new Promise(RES => RES(cloned));
    }
    const cloned = adp.clone(global.mockDataBase.adp);
    const filtered = cloned.docs.filter(ITEM => ITEM.domain === 3 || ITEM.domain === 6);
    cloned.docs = [{ microservices: filtered }];
    return new Promise(RES => RES(cloned));
  }
}

class MockModelPermission {
  getAllFieldAdminPermissionBySignum(QUERY) {
    if (!adp.models.permissionMock.allAdminPerBySig.res) {
      return Promise.reject();
    }

    if (QUERY[0] === 'emockdomainadmin') {
      return new Promise(RES => RES(global.mockDataBase.permission.emockdomainadmin));
    }
    return new Promise(RES => RES(global.mockDataBase.permission.nope));
  }
}

class MockAnswer {
  setCode(code) { adp.AnswersMockResp.setCode = code; }

  setData() {}

  setLimit() {}

  setTotal() {}

  setPage() {}

  setSize() {}

  setTime() {}

  getAnswer() {}

  setMessage() {}

  setCache() {}
}

class mockRBACContentPreparationClass {
  loadAllContentIDs() {
    this.req = {
      wpcontent: {
        allContent: {
          91:
   {
     object_id: '91',
     menu_slug: 'main',
     slug: 'community',
     title: 'Community',
     url:
      ['https://192.168.56.102:23309/category/articles/community/',
        '/community'],
   },
          95:
   {
     object_id: '95',
     menu_slug: 'tutorials',
     slug: 'tutorials',
     title: 'Tutorials',
     url:
      ['https://192.168.56.102:23309/category/tutorials/',
        '/workinginadpframework/tutorials'],
   },
          105:
   {
     object_id: '105',
     menu_slug: 'footer',
     slug: 'resources',
     title: 'Resources',
     url:
      ['https://192.168.56.102:23309/category/articles/resources/',
        '/resources'],
   },
          101:
          {
            object_id: '101',
            menu_slug: 'footer',
            slug: 'resources',
            title: 'Resources',
            url:
             ['https://192.168.56.102:23309/category/articles/resources/',
               '/resources'],
          },
        },
      },
    };
    return new Promise(RES => RES(true));
  }
}

describe('Testing [ adp.middleware.RBACClass ] behavior', () => {
  beforeEach(() => {
    const listOptionsString = require('./../listOptions/listOptionsStringForUnitTests');
    global.mockDataBase = require('./RBACClass.spec.json');
    global.adp = {};
    adp.setHeaders = OBJ => OBJ;
    adp.models = {};
    adp.models.break = false;
    adp.models.Adp = MockModelAdp;
    adp.models.adpMock = {
      allassetIdsBySerOwn: { res: true },
      msSearch: { res: true, data: null },
    };
    adp.models.Permission = MockModelPermission;
    adp.models.permissionMock = { allAdminPerBySig: { res: true } };
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {}; // ((T1, T2) => { console.log(T1, T2); });
    adp.listOptions = {};
    adp.listOptions.get = () => new Promise(RES => RES(listOptionsString()));
    adp.AnswersMockResp = { setCode: null };
    adp.Answers = MockAnswer;
    adp.clone = require('./../library/clone');
    adp.middleware = {};
    adp.middleware.RBACContentPreparationClass = mockRBACContentPreparationClass;

    global.mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.middleware.RBACClass = proxyquire('./RBACClass', {
      '../library/errorLog': global.mockErrorLog,
    });
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ processRBAC ] Successful Dynamic Case call with valid user parameters.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emesuse);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.emesuse.admin).toBeFalsy();
      expect(NEWREQ.rbac.emesuse.allowed.assets.length).toBe(29);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Static Case call with valid user parameters.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emockuser1);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.emockuser1.admin).toBeFalsy();
      expect(NEWREQ.rbac.emockuser1.allowed.assets.length).toBe(2);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Static Case call a valid user with two groups, with PREVIEW and TRACK flags setted as true.', (done) => {
    const rbac = new adp.middleware.RBACClass(true, true);
    const req = adp.clone(global.mockDataBase.preparation.emockuser2);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.emockuser2.admin).toBeFalsy();
      expect(NEWREQ.rbac.emockuser2.allowed.assets.length).toBe(2);
      expect(NEWREQ.rbac.emockuser2.preview.permission.assets.length).toBe(2);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Case call if user is super admin.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.esupuse);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.esupuse.admin).toBeTruthy();
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Case call if user is domain admin.', (done) => {
    const rbac = new adp.middleware.RBACClass(true);
    const req = adp.clone(global.mockDataBase.preparation.emockdomainadmin);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.emockdomainadmin.admin).toBeFalsy();
      expect(NEWREQ.rbac.emockdomainadmin.preview.domainAdmin.assets.length).toBe(7);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Case call if user is service owner.', (done) => {
    const rbac = new adp.middleware.RBACClass(true);
    const req = adp.clone(global.mockDataBase.preparation.eserviceonwer);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.eserviceonwer.admin).toBeFalsy();
      expect(NEWREQ.rbac.eserviceonwer.allowed.assets.length).toBe(2);
      expect(NEWREQ.rbac.eserviceonwer.preview.serviceOwner.assets.length).toBe(2);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Case call user with target.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emesuse);
    req.rbacTarget.push('45e7f4f992afe7bbb62a3391e5013c25');
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.emesuse.admin).toBeFalsy();
      expect(NEWREQ.rbac.emesuse.allowed.assets.length).toBe(1);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Dynamic Case call with valid group parameters.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.group1);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.allowed.assets.length).toBe(29);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Dynamic Case call with valid group, with PREVIEW and TRACK flags setted as true.', (done) => {
    const rbac = new adp.middleware.RBACClass(true, true);
    const req = adp.clone(global.mockDataBase.preparation.group1);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.allowed.assets.length).toBe(29);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Dynamic Case call with valid group, with target.', (done) => {
    const rbac = new adp.middleware.RBACClass(true);
    const req = adp.clone(global.mockDataBase.preparation.group2);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.allowed.assets.length).toBe(1);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Dynamic Case call with valid group, only specific domains.', (done) => {
    const rbac = new adp.middleware.RBACClass(true);
    const req = adp.clone(global.mockDataBase.preparation.group4);
    const res = {};
    let itIsDone = false;
    const callback = (NEWREQ) => {
      itIsDone = true;

      expect(NEWREQ.rbac.allowed.assets.length).toBe(4);
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        // Should run callback function to be successful
        if (!itIsDone) {
          done.fail();
        }
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ processRBAC ] Successful Dynamic Case for content (Auto All).', (done) => {
    const rbac = new adp.middleware.RBACClass(true, true);
    const req = adp.clone(global.mockDataBase.preparation.group5);
    const res = {};
    const callback = () => {
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[ processRBAC ] Successful Static and Dynamic Case for content (Auto All).', (done) => {
    const rbac = new adp.middleware.RBACClass(true, true);
    const req = adp.clone(global.mockDataBase.preparation.group6);
    const res = {};
    const callback = () => {
      done();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('[ processRBAC ] Negative Case call with invalid group.', (done) => {
    const rbac = new adp.middleware.RBACClass(true, true);
    const req = adp.clone(global.mockDataBase.preparation.group3);
    const res = {};
    const callback = () => {
      done.fail();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ processRBAC ] Negative Case call with not allowed target.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emesuse);
    req.rbacTarget.push('notAllowedMockID');
    const res = {
      end() {},
    };
    const callback = () => {
      done.fail();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ processRBAC ] Negative Case call without valid parameters.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = {};
    const res = {};
    const callback = () => {
      done.fail();
    };

    rbac.processRBAC(req, res, callback)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(400);
        done();
      });
  });

  it('[ processRBAC ] Should reject if the Permission model getAllFieldAdminPermissionBySignum rejects .', (done) => {
    adp.models.permissionMock.allAdminPerBySig.res = false;

    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emesuse);
    req.rbacTarget.push('45e7f4f992afe7bbb62a3391e5013c25');

    rbac.processRBAC(req, {}, () => {}).then(() => done.fail()).catch(() => done());
  });

  it('[ processRBAC ] Should reject if the Adp model getAllAssetsIDsByServiceOwner rejects .', (done) => {
    adp.models.adpMock.allassetIdsBySerOwn.res = false;

    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.preparation.emesuse);
    req.rbacTarget.push('45e7f4f992afe7bbb62a3391e5013c25');

    rbac.processRBAC(req, {}, () => {}).then(() => done.fail()).catch(() => done());
  });
});


describe('Testing [ adp.middleware.RBACClass ] behavior, isolating method by method', () => {
  beforeEach(() => {
    const listOptionsString = require('./../listOptions/listOptionsStringForUnitTests');
    global.mockDataBase = require('./RBACClass.spec.json');
    global.adp = {};
    adp.setHeaders = OBJ => OBJ;
    adp.models = {};
    adp.models.break = false;
    adp.models.Adp = MockModelAdp;
    adp.models.Permission = MockModelPermission;
    adp.models.permissionMock = {
      allAdminPerBySig: {
        res: true,
      },
    };
    adp.models.adpMock = {
      allassetIdsBySerOwn: { res: true },
      msSearch: { res: true, data: null },
    };
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {}; // ((T1, T2) => { console.log(T1, T2); });
    adp.listOptions = {};
    adp.listOptions.get = () => new Promise(RES => RES(listOptionsString()));
    adp.AnswersMockResp = { setCode: null };
    adp.Answers = MockAnswer;
    adp.clone = require('./../library/clone');
    adp.middleware = {};
    adp.middleware.RBACClass = require('./RBACClass');
  });


  afterEach(() => {
    global.adp = null;
  });


  it('[ loadListOption ] Successful Case if runs more than one time per execution.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const methodToTest = {
      localListOptionsCache: null,
      processTracking: () => {},
      loadListOption: rbac.loadListOption,
    };
    methodToTest.loadListOption()
      .then(() => {
        expect(Array.isArray(methodToTest.localListOptionsCache)).toBeTruthy();
        methodToTest.loadListOption()
          .then(() => {
            done();
          })
          .catch(() => {
            done.fail();
          });
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ loadListOption ] Negative Case when [ adp.listOptions.get ] breaks.', (done) => {
    adp.listOptions.get = () => new Promise((RES, REJ) => REJ());
    const rbac = new adp.middleware.RBACClass();
    const methodToTest = {
      localListOptionsCache: null,
      processTracking: () => {},
      loadListOption: rbac.loadListOption,
    };
    methodToTest.loadListOption()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ checkRequest ] Successful Case checking group with target from an external request.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.methodTestREQUESTTemplate1);
    const methodToTest = {
      processTracking: () => {},
      checkRequest: rbac.checkRequest,
    };
    const result = methodToTest.checkRequest(req);

    expect(result.users).toBeNull();
    expect(Array.isArray(result.groups)).toBeTruthy();
    expect(result.groups[0].permission[0].dynamic[0]['group-id']).toBe(2);
    expect(result.groups[0].permission[0].dynamic[1]['group-id']).toBe(3);
    expect(Array.isArray(result.targets)).toBeTruthy();

    done();
  });


  it('[ checkRequest ] Successful Case checking user from an external request.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const req = adp.clone(global.mockDataBase.methodTestREQUESTTemplate2);
    const methodToTest = {
      processTracking: () => {},
      checkRequest: rbac.checkRequest,
    };
    const result = methodToTest.checkRequest(req);

    expect(result.users).toBeDefined();
    expect(result.users[0].signum).toBe('emesuse');
    expect(result.users[0].role).toBe('author');
    expect(result.groups).toBeNull();
    done();
  });


  it('[ prepareObject ] Successful Case creating sub-objects inside the first object.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const methodToTest = {
      processTracking: () => {},
      prepareObject: rbac.prepareObject,
    };
    const mainObject = {};
    const info = methodToTest.prepareObject(mainObject, 'item', 'subItem');
    info.testInLastLevel = true;

    expect(mainObject).toBeDefined();
    expect(mainObject.item).toBeDefined();
    expect(mainObject.item.subItem).toBeDefined();
    expect(mainObject.item.subItem.testInLastLevel).toBeTruthy();

    const info2 = methodToTest.prepareObject(mainObject, 'item', 'subItem', 'anotherSubItem');
    info2.anotherTest = true;

    expect(mainObject.item.subItem.anotherSubItem.anotherTest).toBeTruthy();
    done();
  });


  it('[ loadAssetIdsByDomain ] Successful Case simulating the read of all Assets from Database.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const mockNormalise = { slug: 'domain-mock-slug', name: 'domain-mock-name' };
    const methodToTest = {
      processTracking: () => {},
      normaliseListOption: () => mockNormalise,
      loadAssetIdsByDomain: rbac.loadAssetIdsByDomain,
    };
    methodToTest.loadAssetIdsByDomain()
      .then((ASSETS) => {
        expect(Array.isArray(ASSETS)).toBeTruthy();
        expect(ASSETS.length).toBe(29);
        expect(ASSETS[0]._id).toBe('17e57f6cea1b5a673f8775e6cf023344');
        expect(ASSETS[0].slug).toBe('document-refresh-warnings-test');
        expect(ASSETS[0]['denorm_domain-mock-slug']).toBe('domain-mock-name');
        expect(ASSETS[0]['domain-mock-slug']).toBe(1);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ loadAssetIdsByDomain ] Negative Case if [ getAllAssetsIDsByDomain @ adp.models.Adp ] breaks.', (done) => {
    adp.models.break = true;
    const rbac = new adp.middleware.RBACClass();
    const mockNormalise = { slug: 'domain-mock-slug', name: 'domain-mock-name' };
    const methodToTest = {
      processTracking: () => {},
      normaliseListOption: () => mockNormalise,
      loadAssetIdsByDomain: rbac.loadAssetIdsByDomain,
    };
    methodToTest.loadAssetIdsByDomain()
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ loadAssetIdsByDomain ] Negative Case if [ getAllAssetsIDsByDomain @ adp.models.Adp ] returns no registers.', (done) => {
    global.mockDataBase.adp = { docs: [] };
    const rbac = new adp.middleware.RBACClass();
    const mockNormalise = { slug: 'domain-mock-slug', name: 'domain-mock-name' };
    const methodToTest = {
      processTracking: () => {},
      normaliseListOption: () => mockNormalise,
      loadAssetIdsByDomain: rbac.loadAssetIdsByDomain,
    };
    methodToTest.loadAssetIdsByDomain()
      .then((ASSETS) => {
        expect(Array.isArray(ASSETS)).toBeTruthy();
        expect(ASSETS.length).toBe(0);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('[ adminRule ] Negative Case if user register has the signum as null.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    let callMockAdminRuleError = false;
    const methodToTest = {
      processTracking: () => {},
      adminRuleApply: () => {},
      adminRuleError: (REJECT) => {
        callMockAdminRuleError = true;
        REJECT(new Error('Mock Error'));
      },
      adminRule: rbac.adminRule,
    };
    const users = [
      { signum: 'etest', role: 'author' },
      { signum: null, role: 'author' },
    ];
    methodToTest.adminRule(users, {}, (new Date()))
      .then(() => {
        done.fail();
      })
      .catch(() => {
        expect(callMockAdminRuleError).toBeTruthy();
        done();
      });
  });


  it('[ adminRuleError ] checking if this function is generating an error correctly.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const methodToTest = {
      processTracking: () => {},
      adminRuleError: rbac.adminRuleError,
    };
    const user = { signum: null, role: 'author' };
    const mockRejectFunction = () => {
      done();
    };
    methodToTest.adminRuleError(user, mockRejectFunction);
  });


  it('[ forbidden ] should return a code of 403.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.forbidden({ statusCode: () => {}, end: () => {} });

    expect(adp.AnswersMockResp.setCode).toBe(403);
    done();
  });


  it('[ notFound ] should return a code of 404.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.notFound({ statusCode: () => {}, end: () => {} });

    expect(adp.AnswersMockResp.setCode).toBe(404);
    done();
  });


  it('[ rbacGroupsRuleApply ] should return "true" if the permission type is content or attribute, if the type is not in the switch an error object will return.', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const contRes = rbac.rbacGroupsRuleApply('', {}, {}, { type: 'content' }, {}, false);

    expect(contRes).toBeTruthy();

    const attrRes = rbac.rbacGroupsRuleApply('', {}, {}, { type: 'attribute' }, {}, false);

    expect(attrRes).toBeTruthy();

    const ranTypeRes = rbac.rbacGroupsRuleApply('', {}, {}, { type: 'notListed' }, {}, false);

    expect(ranTypeRes.rbac).toBeDefined();
    done();
  });


  it('[ rbacGroupsRuleApply ] should reject with error 400 if the given permission object has values for dynamic, exception and static', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const permObj = {
      dynamic: null, exception: ['test'], static: ['test'], type: 'asset',
    };

    rbac.rbacGroupsRuleApply('', {}, {}, permObj, {}, false).then((result) => {
      expect(result.code).toBe(400);
      done();
    }).catch(() => done.fail());
  });


  it('[ typesResolution ] should reject if the given invalid permission', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.typesResolution('', {}, {}, { dynamic: ['test'], exception: ['test'], static: ['test'] }, {}, false)
      .then(() => done.fail())
      .catch(() => done());
  });


  it('[ dynamicPermission ] should resolve with an empty array if the Adp model msSearch returns an empty array', (done) => {
    adp.models.adpMock.msSearch.data = { docs: [] };

    const rbac = new adp.middleware.RBACClass();
    rbac.dynamicPermission({
      dynamic: ['test'], exception: ['test'], static: null, type: 'asset',
    }).then((result) => {
      expect((Array.isArray(result) && result.length === 0)).toBeTruthy();
      done();
    }).catch(() => done.fail());
  });


  it('[ dynamicPermission ] should reject if the given permission object does not contain keys dynamic and exception', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.dynamicPermission({})
      .then(() => done.fail())
      .catch(() => done());
  });


  it('[ dynamicPermission ] should reject if the Adp model msSearch rejects', (done) => {
    adp.models.adpMock.msSearch.res = false;
    const rbac = new adp.middleware.RBACClass();
    rbac.dynamicPermission({
      dynamic: ['test'], exception: ['test'], static: null, type: 'asset',
    }).then(() => done.fail()).catch(() => done());
  });


  it('[ staticPermission ] should reject if the given permission object does not have a static key', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.staticPermission({}).then(() => done.fail()).catch(() => done());
  });


  it('[ staticPermission ] testing if get a static asset permission', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.allAssets = [{
      _id: '419b7f75c7ab2427937eec161d0ea844',
      slug: 'mock-slug',
      domain: 1,
    }];
    const mockPermission = global.mockDataBase.preparation
      .emockuser1.users.docs[0].rbac[0].permission[0];
    const mockType = 'assets';
    rbac.staticPermission(mockPermission, mockType).then(() => done()).catch(() => done.fail());
  });


  it('[ targetThis ] should reject with a 404 if the targeted id is not an existing id', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.targetThis({ allowed: { assets: ['id1'] } }, ['id2'], {}).then(() => done.fail()).catch((err) => {
      expect(err).toBe(404);
      done();
    });
  });


  it('[ targetThis ] should reject with a 404 if the targeted is not in the allowed list', (done) => {
    const rbac = new adp.middleware.RBACClass();
    rbac.allAsset = [{ _id: 'id2' }];
    rbac.targetThis({ allowed: { assets: ['id1'] } }, ['id2'], {}).then(() => done.fail()).catch((err) => {
      expect(err).toBe(404);
      done();
    });
  });


  it('[ domainAdminRule ] should rejects if [ this.allAssets ] is invalid', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const methodToTest = {
      processTracking: () => {},
      domainAdminRule: rbac.domainAdminRule,
    };
    const users = [
      { signum: 'etest', role: 'author' },
    ];
    methodToTest.domainAdminRule(users, {}, (new Date()))
      .then(() => {
        done.fail();
      })
      .catch(() => {
        done();
      });
  });


  it('[ domainAdminRuleAddAsset ] behavior if [ this.preview ] if false', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const mockAssetByDomain = {
      _id: '46980f0340cc9c9217dea0abbf00c094',
      domain: 1,
      slug: 'auto-ms-with-multiple-compliance',
    };
    const mockRBAC = {
      emockusertest: {
        allowed: {},
        preview: {
          domainAdmin: {
            assets: [],
          },
        },
      },
    };
    const methodToTest = {
      preview: false,
      processTracking: () => {},
      prepareObject: OBJ => OBJ,
      domainAdminRuleAddAsset: rbac.domainAdminRuleAddAsset,
    };
    methodToTest.domainAdminRuleAddAsset('emockusertest', mockRBAC, [mockAssetByDomain], {});
    done();
  });


  it('[ domainAdminRuleAddAsset ] behavior if [ this.preview ] if true', (done) => {
    const rbac = new adp.middleware.RBACClass();
    const mockAssetByDomain = {
      _id: '46980f0340cc9c9217dea0abbf00c094',
      domain: 1,
      slug: 'auto-ms-with-multiple-compliance',
    };
    const mockRBAC = {
      emockusertest: {
        allowed: {},
        preview: {
          domainAdmin: {},
        },
      },
    };
    let counter = 0;
    const methodToTest = {
      preview: true,
      processTracking: () => {},
      prepareObject: (OBJ) => {
        if (counter === 0) {
          counter += 1;
          return OBJ.emockusertest.allowed;
        }
        return OBJ.emockusertest.preview.domainAdmin;
      },
      domainAdminRuleAddAsset: rbac.domainAdminRuleAddAsset,
    };
    methodToTest.domainAdminRuleAddAsset('emockusertest', mockRBAC, [mockAssetByDomain], { 'item-id': 1 });
    done();
  });
});
