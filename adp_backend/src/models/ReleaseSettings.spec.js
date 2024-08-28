/**
* Unit test for [ adp.models.ReleaseSettings ]
* @author Michael Coughlan [zmiccou]
*/

describe('Testing [ adp.models.ReleaseSettings ], ', () => {
  beforeEach(() => {
    global.adp = {};
    adp.config = {};
    adp.docs = {};
    adp.docs.list = [];
    adp.db = {};
    adp.check = {};

    adp.findResponse = true;
    adp.findFails = false;
    adp.db.create = (dbName, object) => {
      adp.check.dbName = dbName;
      adp.check.object = object;
      return new Promise(RES => RES(true));
    };
    adp.db.update = (dbName, object, mode) => {
      adp.check.dbName = dbName;
      adp.check.object = object;
      adp.check.mode = mode;
      return new Promise(RES => RES(true));
    };
    adp.db.find = (dbName, dbSelector, dbOptions) => {
      adp.check.dbName = dbName;
      adp.check.dbSelector = dbSelector;
      adp.check.dbOptions = dbOptions;
      return new Promise((resolve, reject) => (adp.findFails ? reject : resolve)(adp.findResponse));
    };

    adp.models = {};
    adp.models.ReleaseSettings = require('./ReleaseSettings');
  });

  afterEach(() => {
    global.adp = null;
  });

  it('should check the syntax of the getReleaseSettings query', (done) => {
    const releaseSettingsModel = new adp.models.ReleaseSettings();

    releaseSettingsModel.getReleaseSettings()
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('releasesettings');
        done();
      }).catch(() => done.fail());
  });

  it('should check the syntax of the getReleaseSettings query with a parameters', (done) => {
    const releaseSettingsModel = new adp.models.ReleaseSettings();

    releaseSettingsModel.getReleaseSettings('e2e-on')
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('releasesettings');
        expect(adp.check.dbSelector).toEqual({ key: 'e2e-on' });
        done();
      })
      .catch(() => done.fail());
  });

  it('should not be able to find a key and return an error', (done) => {
    const releaseSettingsModel = new adp.models.ReleaseSettings();
    adp.findResponse = {
      code: 404,
      docs: [],
    };

    adp.findFails = true;

    releaseSettingsModel.getReleaseSettings('mock-404')
      .then(() => {
        done.fail();
      }).catch((error) => {
        expect(error).toBeDefined();
        expect(error.code).toEqual(404);
        done();
      });
  });


  it('should check the syntax of the createReleaseSettings', (done) => {
    const releaseSettingsModel = new adp.models.ReleaseSettings();

    releaseSettingsModel.createReleaseSettings({ mockObject: 'test' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('releasesettings');
        expect(adp.check.object).toEqual({ mockObject: 'test' });
        done();
      }).catch(() => done.fail());
  });


  it('should check the syntax of the updateReleaseSettings', (done) => {
    const releaseSettingsModel = new adp.models.ReleaseSettings();

    releaseSettingsModel.updateReleaseSettings({ mockObject: 'test' })
      .then((response) => {
        expect(response).toBeTruthy();
        expect(adp.check.dbName).toEqual('releasesettings');
        expect(adp.check.object).toEqual({ mockObject: 'test' });
        expect(adp.check.mode).toEqual(true);
        done();
      }).catch(() => done.fail());
  });
});
