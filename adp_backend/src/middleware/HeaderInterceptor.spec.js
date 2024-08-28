/**
* Unit test for [ adp.middleware.HeaderInterceptor ]
* @author Githu Jeeva Savy [zjeegit]
*/
const proxyquire = require('proxyquire');

class MockReleaseSettingsController {
  getReleaseSettingsCache() {
    return new Promise((resolve, reject) => {
      if (adp.mockReleaseSettingsController.res) {
        resolve(adp.mockReleaseSettingsController.data);
      } else {
        reject(adp.mockReleaseSettingsController.data);
      }
    });
  }
}
class MockRES {
  setHeader(key, value) {
    this[key] = value;
  }
}

describe('Testing [ adp.middleware.HeaderInterceptor ] behavior', () => {
  let HeaderInterceptor;
  let mockErrorLogReponse;
  let mockRES;
  beforeEach(() => {
    mockErrorLogReponse = {};
    global.adp = { docs: { list: [] } };
    adp.mockReleaseSettingsController = {
      res: true,
      data: [{
        key: 'alertbanner',
        isEnabled: true,
        value: { message: 'Warning Message to be shown' },
      }],
    };
    mockRES = new MockRES();
    const mockErrorLog = (code, message) => {
      mockErrorLogReponse.code = code;
      mockErrorLogReponse.message = message;
    };
    HeaderInterceptor = proxyquire('./HeaderInterceptor', {
      '../releaseSettings/ReleaseSettingsController': MockReleaseSettingsController,
      '../library/errorLog': mockErrorLog,
    });
  });

  afterEach(() => {
    global.adp = null;
  });

  it('setBanner: Should set the header with alertbanner key and value correctly', (done) => {
    const headerInterceptor = new HeaderInterceptor(mockRES);
    headerInterceptor.setBanner().then(() => {
      expect(mockRES.alertbanner).toBeDefined();
      const alertbannerObject = JSON.parse(mockRES.alertbanner);

      expect(alertbannerObject.isEnabled).toBeTruthy();
      expect(typeof alertbannerObject.value.message === 'string' && alertbannerObject.value.message.length).toBeTruthy();
      done();
    }).catch(() => {
      done.fail();
    });
  });

  it('setBanner: Should reject if the getReleaseSettings response is not an array or the array is empty', (done) => {
    adp.mockReleaseSettingsController.data = {};
    const headerInterceptor = new HeaderInterceptor(mockRES);
    headerInterceptor.setBanner().then(() => {
      expect(mockRES.alertbanner).not.toBeDefined();
      expect(mockErrorLogReponse.code).toBe(500);
      expect(mockErrorLogReponse.message).toBe('No Alert Banner Object Found');

      adp.mockReleaseSettingsController.data = [];
      headerInterceptor.setBanner().then(() => {
        expect(mockRES.alertbanner).not.toBeDefined();
        expect(mockErrorLogReponse.code).toBe(500);
        expect(mockErrorLogReponse.message).toBe('No Alert Banner Object Found');
        done();
      }).catch(() => {
        done.fail();
      });
    }).catch(() => {
      done.fail();
    });
  });

  it('setBanner: Should reject if the getReleaseSettings response failed to fetch alertbanner', (done) => {
    adp.mockReleaseSettingsController.res = false;
    const headerInterceptor = new HeaderInterceptor(mockRES);
    headerInterceptor.setBanner().then(() => {
      expect(mockRES.alertbanner).not.toBeDefined();
      expect(mockErrorLogReponse.code).toBe(500);
      expect(mockErrorLogReponse.message).toBe('Failed to fetch the alert banner');
      done();
    }).catch(() => {
      done.fail();
    });
  });
});
