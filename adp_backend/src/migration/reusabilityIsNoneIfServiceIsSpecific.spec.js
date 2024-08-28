// ============================================================================================= //
/**
* Unit test for [ global.adp.migration.reusabilityIsNoneIfServiceIsSpecific ]
* @author Armando Schiavon Dias [escharm]
*/
// ============================================================================================= //
describe('Testing [ global.adp.migration.reusabilityIsNoneIfServiceIsSpecific ] Migration Rule Behavior.', () => {
  beforeEach(() => {
    global.adp = {};
    global.adp.docs = {};
    global.adp.docs.list = [];
    global.adp.migration = {};
    global.adp.migration.reusabilityIsNoneIfServiceIsSpecific = require('./reusabilityIsNoneIfServiceIsSpecific'); // eslint-disable-line global-require
  });


  afterEach(() => {
    global.adp = null;
  });


  it('Should return "true", if the parameter does not match with expectations.', (done) => {
    const obj = {
      name: 'MS Name',
    };
    global.adp.migration.reusabilityIsNoneIfServiceIsSpecific(obj)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should return "true", if the parameter doesn`t need changes.', (done) => {
    const obj = {
      name: 'MS Name',
      service_category: 4,
      reusability_level: 4,
    };
    global.adp.migration.reusabilityIsNoneIfServiceIsSpecific(obj)
      .then((RESULT) => {
        expect(RESULT).toBeTruthy();
        done();
      })
      .catch(() => {
        done.fail();
      });
  });


  it('Should return the object, if the parameter need changes.', (done) => {
    const obj = {
      name: 'MS Name',
      service_category: 4,
      reusability_level: 3,
    };
    global.adp.migration.reusabilityIsNoneIfServiceIsSpecific(obj)
      .then((RESULT) => {
        expect(RESULT.reusability_level).toBe(4);
        done();
      })
      .catch(() => {
        done.fail();
      });
  });
});
// ============================================================================================= //
