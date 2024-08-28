// ============================================================================================= //
/**
* Unit test for [ adp.wordpress.getMenus ]
* @author Omkar Sadegaonkar [zsdgmkr], Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const mockAdpClass = class {
  getAllContentIDs() {
    if (adp.requestBehaviorGetAllContentIDs === 'success') {
      return new Promise(RES => RES({ docs: [{ ids: ['test1', 'test2', 'test3'] }] }));
    }
    if (adp.requestBehaviorGetAllContentIDs === 'unexpected') {
      return new Promise(RES => RES({}));
    }
    const mockError = {};
    return new Promise((RES, REJ) => REJ(mockError));
  }

  cleanContentPermissions(idsToClean) {
    if (adp.requestBehaviorCleanContentPermissions === 'success') {
      adp.cleanedIds = idsToClean;
      return new Promise((RES) => {
        adp.cleanUpCalled = true;
        RES();
      });
    }
    const mockError = {};
    return new Promise((RES, REJ) => REJ(mockError));
  }
};

const mockEchoLogClass = class {
  createOne() {
    return new Promise((RES) => {
      RES();
    });
  }
};

describe('Testing [ adp.wordpress.getMenus ] behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.echoLog = () => {};
    adp.timeStamp = () => '';
    adp.config = {};
    adp.config.wordpress = {};
    adp.config.wordpress.url = 'https://wordpress';
    adp.config.wordpress.menus = {};
    adp.config.wordpress.menus.cacheTimeOutInSeconds = 1000;
    adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds = 1000;
    adp.requestBehaviorHEAD = 'success';
    adp.requestBehaviorGET = 'success';
    adp.requestBehaviorGETCounter = 0;
    adp.requestBehaviorHEADCounter = 0;
    adp.requestBehaviorGetAllContentIDs = 'success';
    adp.requestBehaviorCleanContentPermissions = 'success';
    adp.mockLastModifiedDate = '2021-05-11 12:23:25';
    adp.menuResp = '';
    global.superagent = {};
    global.superagent.head = () => new Promise((RES, REJ) => {
      if (adp.requestBehaviorHEADCounter === 0) {
        if (adp.requestBehaviorHEAD === 'success') {
          RES({ headers: { last_modified: adp.mockLastModifiedDate } });
        } else {
          const error = {};
          REJ(error);
        }
      } else {
        adp.requestBehaviorHEADCounter -= 1;
        const error = {};
        REJ(error);
      }
    });
    global.superagent.get = () => new Promise((RES, REJ) => {
      if (adp.requestBehaviorGETCounter === 0) {
        if (adp.requestBehaviorGET === 'success') {
          RES({ body: { menus: [{ slug: 'mockMenu', items: [{ object_id: 'test1' }, { object_id: 'test2' }] }] } });
        } else if (adp.requestBehaviorGET === 'notExpected') {
          RES({});
        } else {
          const error = {};
          REJ(error);
        }
      } else {
        adp.requestBehaviorGETCounter -= 1;
        const error = {};
        REJ(error);
      }
    });
    adp.successCache = { menus: [{ slug: 'mockMenu', items: [{ object_id: 'test1' }, { object_id: 'test2' }] }] };
    adp.masterCache = {};
    adp.masterCache.get = () => new Promise((RES, REJ) => {
      if (adp.cacheBehavior === 'success') {
        RES(adp.successCache);
      } else {
        const error = {};
        REJ(error);
      }
    });
    adp.masterCache.set = () => true;
    adp.masterCache.clear = () => true;
    adp.models = {};
    adp.models.Adp = mockAdpClass;
    adp.models.RBACGroups = mockAdpClass;
    adp.models.EchoLog = mockEchoLogClass;
    adp.cleanUpCalled = false;
    adp.wordpress = {};
    adp.wordpress.getMenus = require('./getMenus');
  });


  afterEach(() => {
    global.adp = null;
  });

  it('Successful case for all menus ( First run, no cache available ).', (done) => {
    adp.cacheBehavior = 'nocacheavailable';
    adp.wordpress.getMenus()
      .then((RESP) => {
        expect(RESP.menus[0].slug).toEqual('mockMenu');
        expect(RESP.menus[0].items[0].object_id).toEqual('test1');
        expect(RESP.menus[0].items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful case for all menus ( cache available ).', (done) => {
    adp.cacheBehavior = 'success';
    adp.wordpress.getMenus()
      .then((RESP) => {
        expect(RESP.menus[0].items[0].object_id).toEqual('test1');
        expect(RESP.menus[0].items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful case for all menus ( First run, no cache available ) - Specific Menu.', (done) => {
    adp.config.wordpress.menus.cacheTimeOutInSeconds = null;
    adp.config.wordpress.menus.cacheOfModifiedDateTimeOutInSeconds = null;
    adp.cacheBehavior = 'nocacheavailable';
    adp.wordpress.getMenus('mockMenu')
      .then((RESP) => {
        expect(RESP.slug).toEqual('mockMenu');
        expect(RESP.items[0].object_id).toEqual('test1');
        expect(RESP.items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Successful case for all menus ( cache available ) - Specific Menu.', (done) => {
    adp.cacheBehavior = 'success';
    adp.wordpress.getMenus('mockMenu')
      .then((RESP) => {
        expect(RESP.items[0].object_id).toEqual('test1');
        expect(RESP.items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('Case the specific menu is not available ( Not from cache ).', (done) => {
    adp.cacheBehavior = 'nocacheavailable';
    adp.wordpress.getMenus('DoNotExist')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(404);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data).toBeDefined();
        expect(ERROR.data.menuslug).toBe('DoNotExist');
        expect(ERROR.origin).toBe('main');
        expect(ERROR.packName).toBe('adp.wordpress.getMenus');
        done();
      });
  });


  it('Case the specific menu is not available ( From cache ).', (done) => {
    adp.cacheBehavior = 'success';
    adp.wordpress.getMenus('DoNotExist')
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(404);
        expect(ERROR.desc).toBeDefined();
        expect(ERROR.data).toBeDefined();
        expect(ERROR.data.menuslug).toBe('DoNotExist');
        expect(ERROR.origin).toBe('main');
        expect(ERROR.packName).toBe('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ superagent ] crashes using the HEAD command.', (done) => {
    adp.requestBehaviorHEAD = 'crash';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('dateModifiedFromWordpressIsUpdated');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ superagent ] crashes two times but work at the third using the HEAD command.', (done) => {
    adp.requestBehaviorHEADCounter = 2;
    adp.requestBehaviorHEAD = 'success';
    adp.wordpress.getMenus('mockMenu')
      .then((RESP) => {
        expect(RESP.slug).toEqual('mockMenu');
        expect(RESP.items[0].object_id).toEqual('test1');
        expect(RESP.items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('If [ superagent ] crashes using the GET command.', (done) => {
    adp.requestBehaviorGET = 'crash';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('getAllMenusFromRemote');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ superagent ] crashes two times but work at the third using the GET command.', (done) => {
    adp.requestBehaviorGETCounter = 2;
    adp.requestBehaviorGET = 'success';
    adp.wordpress.getMenus('mockMenu')
      .then((RESP) => {
        expect(RESP.slug).toEqual('mockMenu');
        expect(RESP.items[0].object_id).toEqual('test1');
        expect(RESP.items[1].object_id).toEqual('test2');
        done();
      }).catch(() => {
        done.fail();
      });
  });


  it('If [ superagent ] get a unexpected response using the GET command.', (done) => {
    adp.requestBehaviorGET = 'notExpected';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('getAllMenusFromRemote');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ getAllContentIDs @ adp.models.Adp ] crashes.', (done) => {
    adp.requestBehaviorGetAllContentIDs = 'crash';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('cleanOldPermissionsFromDb');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ getAllContentIDs @ adp.models.Adp ] get an unexpected response.', (done) => {
    adp.requestBehaviorGetAllContentIDs = 'unexpected';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('cleanOldPermissionsFromDb');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });


  it('If [ cleanContentPermissions @ adp.models.Adp ] crashes.', (done) => {
    adp.requestBehaviorCleanContentPermissions = 'crash';
    adp.wordpress.getMenus()
      .then(() => {
        done.fail();
      }).catch((ERROR) => {
        expect(ERROR.code).toEqual(500);
        expect(ERROR.origin).toEqual('deleteContentIDsFromDatabase');
        expect(ERROR.packName).toEqual('adp.wordpress.getMenus');
        done();
      });
  });
});
// ============================================================================================= //
