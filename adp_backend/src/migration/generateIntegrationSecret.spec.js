// ============================================================================================= //
/**
* Unit test for [global.adp.migration.generateIntegrationSecret]
* @author John [xjohdol]
*/
/* eslint-disable no-useless-escape                                                              */
// ============================================================================================= //
describe('Testing [ global.adp.migration.generateIntegrationSecret ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.generateIntegrationSecret = require('./generateIntegrationSecret'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should not regenerate the inval secret of an asset that already has one.', (done, fail) => {
    const untouched = {
      someField: 'untouched',
      inval_secret: 'abcdefg',
    };

    global.adp.migration.generateIntegrationSecret(untouched).then((result) => {
      expect(result).toBeTruthy();
      done();
    }).catch(() => {
      fail();
    });
  });

  it('Should generate the inval secret of an asset that has none.', (done, fail) => {
    const before = {
      someField: 'untouched',
    };

    global.adp.migration.generateIntegrationSecret(before).then((result) => {
      expect(result.inval_secret).not.toEqual(undefined);
      expect(result.inval_secret).not.toEqual(null);
      expect(result.inval_secret).not.toEqual('');
      done();
    }).catch(() => {
      fail();
    });
  });
});
