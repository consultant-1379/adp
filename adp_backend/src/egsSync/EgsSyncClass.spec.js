const { default: axios } = require('axios');
const proxyquire = require('proxyquire');
/**
* Unit test for [ adp.egsSync.EgsSyncClass ]
* @author Tirth [zpiptir]
*/
// ============================================================================================= //
describe('Testing behavior of [ adp.egsSync.EgsSyncClass ] ', () => {
  class mockEgsControlClass {
    getByObjectIds() {
      if (adp.mockBehavior.getByObjectIds) {
        return new Promise((resolve) => {
          const RESULT = {
            docs: adp.mockBehavior.egsControl,
          };
          resolve(RESULT);
        });
      }
      return new Promise((resolve, reject) => {
        const error = { message: 'MockError from getByObjectIds' };
        reject(error);
      });
    }

    async insertOrUpdateEgsControlDocument() {
      if (adp.mockBehavior.insertOrUpdateEgsControlDocument) {
        return new Promise(resolve => resolve());
      }
      return new Promise((resolve, reject) => reject());
    }

    setEgsControlAsSync() {
      if (adp.mockBehavior.setEgsControl) {
        return new Promise((resolve) => {
          const result = {};
          resolve(result);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'mockError from setEgsControlAsSync';
        reject(error);
      });
    }
  }

  class wordpress {
    getByIds() {
      if (adp.mockBehavior.getByIds) {
        return new Promise((resolve) => {
          const RESULT = { result: adp.mockBehavior.wordpress };
          resolve(RESULT);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'MockError from getByIds';
        reject(error);
      });
    }
  }

  class Adp {
    getById() {
      if (adp.mockBehavior.getById) {
        return new Promise((resolve) => {
          const RESULT = { docs: adp.mockBehavior.Adp };
          resolve(RESULT);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'MockError from getById';
        reject(error);
      });
    }
  }

  class mockEgsPayloadClass {
    getPayload() {
      if (adp.mockBehavior.egsPayload) {
        return new Promise((resolve) => {
          const result = {
            array_ids: [1, 2, 3],
            payload: [],
          };
          resolve(result);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'MockError from getPayload';
        reject(error);
      });
    }

    closePayloadsToSend() {
      if (adp.mockBehavior.closePayloadsToSend) {
        return new Promise(resolve => resolve());
      } return new Promise((resolve, reject) => reject());
    }

    getTheOpenPayload() {
      if (adp.mockBehavior.getTheOpenPayload) {
        return new Promise(resolve => resolve(adp.mockBehavior.openPayLoad));
      }
      return new Promise((resolve, reject) => {
        const error = { code: 500, message: 'MockError from getTheOpenPayload' };
        reject(error);
      });
    }

    closePayloadAndGetANewOne() {
      if (adp.mockBehavior.closePayloadAndGetANewOne) {
        return new Promise(resolve => resolve(adp.mockBehavior.closePayloadData));
      }
      return new Promise((resolve, reject) => reject());
    }

    addToPayload() {
      if (adp.mockBehavior.addToPayload) {
        return new Promise(resolve => resolve());
      }
      return new Promise((resolve, reject) => reject());
    }

    setEgsPayloadAsSync() {
      if (adp.mockBehavior.setEgsPayload) {
        return new Promise((resolve) => {
          const res = {};
          resolve(res);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'mockError from setEgsPayloadAsSync';
        reject(error);
      });
    }
  }

  beforeEach(() => {
    global.adp = {};
    adp = {};

    adp.echoLog = STR => STR;
    adp.stripHtmlTags = html => (html);
    adp.config = {};
    adp.config.egs = {
      clientId: 'MockclientId',
      clientSecret: 'MockclientSecret',
      scope: 'Mockscope',
      grant: 'Mockgrant',
      accessTokenURL: 'MockaccessTokenURL',
    };

    axios.post = () => {
      if (adp.mockBehavior.axios) {
        return new Promise((resolve) => {
          const result = { data: { access_token: 'mockeAccessToken' } };
          resolve(result);
        });
      }
      return new Promise((resolve, reject) => {
        const error = 'mockError';
        reject(error);
      });
    };
    adp.mockBehavior = {
      egsSyncAction: true,
      WordpressMenu: true,
      addToPayload: true,
      getByObjectIds: true,
      closePayloadsToSend: true,
      getByIds: true,
      getById: true,
      insertOrUpdateEgsControlDocument: true,
      setEgsPayload: true,
      egsPayload: true,
      egsControl: [],
      wordpress: [],
      Adp: [],
      axios: true,
      setEgsControl: true,
      getTheOpenPayload: true,
      closePayloadAndGetANewOne: true,
      closePayloadData: { _id: '1' },
      openPayLoad: [],
      wpMenuObj: {
        menus:
            [
              {
                items: [
                  {
                    object_id: '1',
                    portal_url: 'MockPortalUrl',
                  },
                ],
              },
              {
                object_id: '2525',
                object: 'tutorials',
              },
            ],
      },
    };

    const mockErrorLog = (code, desc, error) => {
      adp.errorLog = { code, desc };
      return { code, desc, error };
    };
    adp.wordpress = {};
    adp.wordpress.getMenus = () => {
      if (adp.mockBehavior.WordpressMenu) {
        return new Promise(RES => RES(adp.mockBehavior.wpMenuObj));
      }
      const errorObj = { error: 'MockError' };
      return new Promise((RES, REJ) => REJ(errorObj));
    };
    adp.egsSync = {};
    adp.egsSync.egsSyncAction = () => {
      if (adp.mockBehavior.egsSyncAction) {
        return new Promise(RES => RES('MockSuccess'));
      }
      return new Promise((RES, REJ) => {
        const mockError = { code: 500, message: 'MockError' };
        REJ(mockError);
      });
    };
    adp.egsSync.setup = {
      egsSyncActive: true,
      egsSyncActiveTypes: true,
      egsSyncServerAddress: true,
      egsSyncItemsPerRequest: true,
      egsSyncMaxBytesSizePerRequest: true,
    };

    adp.models = {};
    adp.models.Adp = Adp;
    adp.models.EgsControl = mockEgsControlClass;
    adp.models.EgsPayload = mockEgsPayloadClass;
    adp.modelsElasticSearch = {};
    adp.modelsElasticSearch.Wordpress = wordpress;
    adp.egsSync.EgsSyncClass = proxyquire('./EgsSyncClass', {
      '../library/errorLog': mockErrorLog,
      '../library/echoLog': adp.echoLog,
    });
    adp.getSizeInMemory = () => 1;
  });

  afterEach(() => {
    global.mockExpect = null;
    adp.mockBehavior = null;
    global.adp = null;
  });

  it('Successful case when nothing to sync', (done) => {
    const IDARRAY = [1, 2, 3];
    const TYPE = 'article';
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when wordpress documents to sync', (done) => {
    const IDARRAY = [1, 2, 3];
    const TYPE = 'article';
    adp.mockBehavior.wordpress = [
      { _id: 1, object_id: 1 },
      { _id: 2, object_id: 2 },
      { _id: 3, object_id: 3 }];
    adp.mockBehavior.egsControl = [
      { object_id: 1 },
      { object_id: 2 },
      { object_id: 3 }];
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case when wordpress documents to sync', (done) => {
    const IDARRAY = [1, 2, 3];
    const TYPE = 'article';
    adp.mockBehavior.getByIds = false;
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        done();
      });
  });

  it('Successful case when assets to sync', (done) => {
    const IDARRAY = [1, 2, 3];
    const TYPE = 'asset';
    adp.mockBehavior.Adp = [
      { _id: 1, object_id: 1 },
      { _id: 2, object_id: 2 },
      { _id: 3, object_id: 3 }];
    adp.mockBehavior.egsControl = [
      { object_id: 1 },
      { object_id: 2 },
      { object_id: 3 }];
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case when assets documents to sync', (done) => {
    const IDARRAY = [1, 2, 3];
    const TYPE = 'asset';
    adp.mockBehavior.getById = false;
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        done();
      });
  });

  it('Successful case when wordpress documents to sync to cover _checkThis', async (done) => {
    const IDARRAY = ['1'];
    const TYPE = 'article';
    adp.mockBehavior.wordpress = [
      {
        _id: 1,
        object_id: 1,
        _source: {
          post_id: '1',
          post_title: 'MockTitle',
          post_name: 'MockName',
          post_type: 'article',
          post_date: '2018-03-30',
          post_content_filtered: '<h1>mock heading</h1>',
        },
      }];

    adp.mockBehavior.egsControl = [
      { object_id: 1 }];

    adp.mockBehavior.openPayLoad = {
      sizeinbytes: 50,
      _id: '1',
    };

    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when wordpress documents to sync to cover _checkThis with Empty Array with Error update in Echolog', async (done) => {
    const IDARRAY = ['1'];
    const TYPE = 'article';
    adp.mockBehavior.wordpress = [
      {
        _id: 12,
        object_id: 1,
        _source: {
          post_id: '1',
          post_title: 'MockTitle',
          post_name: 'MockName',
          post_type: 'article',
          post_date: '2018-03-30',
          post_content_filtered: 'MockContentFiltered',
        },
      }];

    adp.mockBehavior.egsControl = [
      { object_id: 1 }];

    adp.mockBehavior.openPayLoad = {
      sizeinbytes: 50,
      _id: '1',
    };

    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when assets to sync to cover _checkThis', async (done) => {
    const IDARRAY = ['1'];
    const TYPE = 'asset';
    adp.mockBehavior.Adp = [
      {
        _id: 1,
        object_id: 1,
        description: 'MockData',
        type: 'microservice',
        date: '2018-03-30',
      }];

    adp.mockBehavior.egsControl = [
      { object_id: 1 }];

    adp.mockBehavior.openPayLoad = {
      sizeinbytes: 50,
      _id: '1',
      docType: 'asset',
    };

    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when assets to sync to cover _checkThis with Empty Array with Error update in Echolog', async (done) => {
    const IDARRAY = ['1'];
    const TYPE = 'asset';
    adp.mockBehavior.Adp = [
      {
        _id: 12,
        object_id: 1,
        description: 'MockData',
      }];

    adp.mockBehavior.egsControl = [
      { object_id: 1 }];

    adp.mockBehavior.openPayLoad = {
      sizeinbytes: 50,
      _id: '1',
    };

    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.checkGroup(TYPE, IDARRAY)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Successful case when assets to sync to cover sendpayload', async (done) => {
    const PAYLOADID = 'MOCKID';
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.sendPayload(PAYLOADID)
      .then((RES) => {
        expect(RES).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });

  it('Negative case when assets to sync to cover sendpayload when getPayload give Error', async (done) => {
    const PAYLOADID = null;
    const egsSync = new adp.egsSync.EgsSyncClass();
    adp.mockBehavior.egsPayload = false;
    egsSync.sendPayload(PAYLOADID)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR).toBeTruthy();
        done();
      });
  });

  it('Negative case when axios.post send error', (done) => {
    const payload = 'MockPayload';
    adp.mockBehavior.axios = false;
    adp.mockBehavior.egsControl = [
      { object_id: 1 },
      { object_id: 2 },
      { object_id: 3 }];
    const egsSync = new adp.egsSync.EgsSyncClass();
    egsSync.sendPayload(payload)
      .then(() => {
        done.fail();
      })
      .catch((ERROR) => {
        expect(ERROR.code).toBe(500);
        expect(ERROR.desc).toBe('Internal Server Error');
        done();
      });
  });
});
