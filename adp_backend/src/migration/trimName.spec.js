// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.trimName ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.trimName ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.trimName = require('./trimName'); // eslint-disable-line global-require
  });

  afterEach(() => {
    global.adp = null;
  });

  it('Should return "true", if the parameter does not contain extra spaces', (done) => {
    global.adp.migration.trimName({ name: 'MS Name' })
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });

  it('Should return the updated object, if the parameter contain extra spaces', (done) => {
    global.adp.migration.trimName({ name: ' MS Name ' })
      .then((RESULT) => {
        expect(RESULT).toEqual({ name: 'MS Name' });
        done();
      })
      .catch(() => {
        expect(false).toBeTruthy();
        done();
      });
  });
});
// ============================================================================================= //
