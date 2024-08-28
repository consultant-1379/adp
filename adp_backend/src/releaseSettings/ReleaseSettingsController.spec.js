// ============================================================================================= //
/**
* Unit test for [ releaseSettings - ReleaseSettingsController ]
* @author Githu Jeeva Savy [zjeegit]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');

class MockReleaseSettingsModel {
  getReleaseSettings() {
    return new Promise((resolve, reject) => {
      if (adp.releaseSettingsModel.res) {
        resolve(adp.releaseSettingsModel.data);
      } else {
        reject(adp.releaseSettingsModel.data);
      }
    });
  }

  createReleaseSettings() {
    return new Promise((resolve, reject) => {
      if (adp.releaseSettingsModel.res1) {
        resolve(adp.releaseSettingsModel.data1);
      } else {
        reject(adp.releaseSettingsModel.data1);
      }
    });
  }

  updateReleaseSettings() {
    return new Promise((resolve, reject) => {
      if (adp.releaseSettingsModel.res1) {
        resolve(adp.releaseSettingsModel.data1);
      } else {
        reject(adp.releaseSettingsModel.data1);
      }
    });
  }
}
describe('Testing [ ReleaseSettingsController ] behaviour', () => {
  let ReleaseSettingsController;
  beforeEach(() => {
    global.adp = { docs: { list: [] } };

    global.adp.masterCacheResp = {
      res: true,
      data: [],
    };
    global.adp.masterCacheTimeOut = { releaseSettings: 10 };
    global.adp.masterCache = {
      set: () => {},
      get: () => {
        if (global.adp.masterCacheResp.res) {
          return Promise.resolve(global.adp.masterCacheResp.data);
        }
        return Promise.reject(global.adp.masterCacheResp.data);
      },
    };

    adp.models = { ReleaseSettings: MockReleaseSettingsModel };
    adp.releaseSettingsModel = {
      res: true,
      data: {
        docs: [{
          key: 'alertbanner',
          isEnabled: true,
          value: { message: 'Warning Message to be shown' },
        }],
      },
    };

    const mockErrorLog = (code, message) => ({ code, message });

    ReleaseSettingsController = proxyquire('./ReleaseSettingsController', {
      '../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  describe('Testing [ getReleaseSettings ] behaviour', () => {
    it('Should give 404 when releaseSettings is not found even when a key is provided', (done) => {
      adp.releaseSettingsModel.data = { docs: [] };

      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettings('test').then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(404);
        expect(error.message).toBe('No release setting with this key was found.');
        done();
      });
    });

    it('Should give  releaseSettings Details from the database ', (done) => {
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettings('test').then((resultDocs) => {
        expect(resultDocs[0].key).toBe('alertbanner');
        expect(resultDocs[0].isEnabled).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
    });

    it('Should Reject if it failed to fetch data from the database', (done) => {
      adp.releaseSettingsModel.res = false;
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettings('test').then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        expect(error.message).toBe('Error in Model while fetching ReleaseSettings');
        done();
      });
    });
  });

  describe('Testing [ getReleaseSettingsCache ] behaviour', () => {
    it('Should get the releaseArray from Cache', (done) => {
      global.adp.masterCacheResp.data = [true];
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettingsCache('test').then((releaseArray) => {
        expect(releaseArray[0]).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
    });

    it('Should get the data from Database', (done) => {
      global.adp.masterCacheResp.res = false;
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettingsCache('test').then((releaseArray) => {
        expect(Array.isArray(releaseArray) && releaseArray.length).toBeTruthy();
        expect(releaseArray[0].key).toBe('alertbanner');
        expect(releaseArray[0].isEnabled).toBeTruthy();
        done();
      }).catch(() => {
        done.fail();
      });
    });

    it('Should Reject if it fails to fetch data from the database', (done) => {
      global.adp.masterCacheResp.res = false;
      adp.releaseSettingsModel.res = false;
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.getReleaseSettingsCache('test').then(() => {
        done.fail();
      }).catch((error) => {
        expect(error.code).toBe(500);
        expect(error.message).toBe('Error in Model while fetching ReleaseSettings');
        done();
      });
    });
  });

  describe('Testing [ change ] behaviour', () => {
    it('Should update the release setting.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [
          { key: 'mock-key' },
        ],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { ok: true };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done();
        }).catch(() => {
          done.fail();
        });
    });


    it('If the update returns an invalid answer.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [
          { key: 'mock-key' },
        ],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { mock: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the update returns an invalid answer ( with error ).', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [
          { key: 'mock-key' },
        ],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { code: 500, message: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the update crashes.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [
          { key: 'mock-key' },
        ],
      };
      adp.releaseSettingsModel.res1 = false;
      adp.releaseSettingsModel.data1 = { mock: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', undefined)
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the update crashes ( with error ).', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [
          { key: 'mock-key' },
        ],
      };
      adp.releaseSettingsModel.res1 = false;
      adp.releaseSettingsModel.data1 = { code: 500, message: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true)
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('Should create the release setting.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { ok: true };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done();
        }).catch(() => {
          done.fail();
        });
    });


    it('If the create returns an invalid answer.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { mock: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the create returns an invalid answer ( with error ).', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [],
      };
      adp.releaseSettingsModel.res1 = true;
      adp.releaseSettingsModel.data1 = { code: 500, message: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the create crashes.', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [],
      };
      adp.releaseSettingsModel.res1 = false;
      adp.releaseSettingsModel.data1 = { mock: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', undefined)
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If the create crashes ( with error ).', (done) => {
      adp.releaseSettingsModel.res = true;
      adp.releaseSettingsModel.data = {
        docs: [],
      };
      adp.releaseSettingsModel.res1 = false;
      adp.releaseSettingsModel.data1 = { code: 500, message: 'MockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true)
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If getReleaseSettings crashes.', (done) => {
      adp.releaseSettingsModel.res = false;
      adp.releaseSettingsModel.data = {};
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });


    it('If getReleaseSettings crashes ( with error ).', (done) => {
      adp.releaseSettingsModel.res = false;
      adp.releaseSettingsModel.data = { code: 500, message: 'mockError' };
      const releaseSettings = new ReleaseSettingsController();
      releaseSettings.change('mock-key', true, 'app', { mock: 'test' })
        .then(() => {
          done.fail();
        }).catch((ERROR) => {
          expect(ERROR.code).toEqual(500);
          expect(ERROR.message).toBeDefined();
          done();
        });
    });
  });
});
