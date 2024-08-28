// ============================================================================================= //
/**
* Unit test for [ adp.endpoints.contributions.change ]
* @author Armando Dias [zdiaarm]
*/
// ============================================================================================= //
const proxyquire = require('proxyquire');
// ============================================================================================= //
describe('Testing behavior of [ adp.endpoints.contributions.change ] ', () => {
  // =========================================================================================== //

  class MockReleaseSettingsController {
    change() {
      if (adp && adp.releaseSettings) {
        if (adp.releaseSettings.ReleaseSettingsControllerBehavior === 200) {
          return new Promise(RES => RES());
        }
      }
      if (adp.releaseSettings.ReleaseSettingsControllerBehavior === 500) {
        return new Promise((RES, REJ) => {
          const error = {
            code: 500,
            message: 'Mock Error',
          };
          REJ(error);
        });
      }
      return new Promise((RES, REJ) => {
        const error = {};
        REJ(error);
      });
    }
  }


  beforeEach(() => {
    global.adp = {};
    global.joi = require('joi');
    adp.setHeaders = RES => RES;

    adp.masterCache = {};
    adp.masterCache.clearAction = false;
    adp.masterCache.clear = (KEY) => {
      if (KEY === 'INNERSOURCECONTRIBS') {
        adp.masterCache.clearAction = true;
      }
    };

    const mockErrorLog = (code, desc, data, origin, packName) => ({
      code,
      desc,
      data,
      origin,
      packName,
    });

    adp.models = {};
    adp.models.GitstatusCollectionControl = undefined;

    adp.releaseSettings = {};
    adp.releaseSettings.ReleaseSettingsControllerBehavior = 200;
    adp.releaseSettings.ReleaseSettingsController = MockReleaseSettingsController;

    adp.mock = {};
    adp.mock.res = {
      setHeader() {},
      end(text) {
        adp.mock.resText = text;
      },
    };
    adp.mock.resText = '';

    global.mockExpect = {};
    global.mockBehavior = {};
    global.mockBehavior.contentSearchESearchClass = true;

    adp.docs = {};
    adp.docs.rest = [];
    adp.docs.list = [];

    adp.endpoints = {};
    adp.endpoints.contributions = {};

    adp.endpoints.contributions.change = proxyquire('./change', {
      './../../../library/errorLog': mockErrorLog,
    });
  });


  afterEach(() => {
    global.mockExpect = null;
    global.adp = null;
  });

  it('Basic Successful Case for gitstatus.', async (done) => {
    const req = {
      params: {
        tag: 'gitstatus',
      },
    };

    await adp.endpoints.contributions.change(req, adp.mock.res);

    const text = adp && adp.mock && adp.mock.resText ? adp.mock.resText : 'wrong';

    expect(text).toEqual('Reading InnerSource data from gitstatus collection.');
    done();
  });


  it('Basic Successful Case for gitstatusbytag.', async (done) => {
    const req = {
      params: {
        tag: 'gitstatusbytag',
      },
    };

    await adp.endpoints.contributions.change(req, adp.mock.res);

    const text = adp && adp.mock && adp.mock.resText ? adp.mock.resText : 'wrong';

    expect(text).toEqual('Reading InnerSource data from gitstatusbytag collection.');
    done();
  });


  it('Basic error if [ change @ adp.releaseSettings.ReleaseSettingsController ] crashes.', (done) => {
    const req = {
      params: {
        tag: 'gitstatusbytag',
      },
    };

    adp.releaseSettings.ReleaseSettingsControllerBehavior = 500;

    adp.endpoints.contributions.change(req, adp.mock.res);
    done();
  });


  it('Basic alternative error if [ change @ adp.releaseSettings.ReleaseSettingsController ] crashes.', (done) => {
    const req = {
      params: {
        tag: 'gitstatusbytag',
      },
    };

    adp.releaseSettings.ReleaseSettingsControllerBehavior = 501;

    adp.endpoints.contributions.change(req, adp.mock.res);
    done();
  });
});
